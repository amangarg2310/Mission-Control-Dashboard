import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

/**
 * POST /api/chat
 *
 * Conversational endpoint. Uses Claude Agent SDK when available (local dev),
 * falls back to Anthropic API (ANTHROPIC_API_KEY env var) for Vercel deploys.
 *
 * Body: { message, images?, conversation_id?, project_id?, agent_id?, role? }
 */

async function replyWithAnthropicAPI(
  conversationId: string,
  agentId: string,
  projectId: string,
  userMessage: string,
): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')

  const project = store.getProject(projectId)
  const agent = store.getAgent(agentId)

  const systemPrompt = [
    `You are ${agent?.name ?? 'an AI assistant'} — a project agent for "${project?.name ?? 'this project'}".`,
    project?.objective ? `Project objective: ${project.objective}` : '',
    'Be concise and actionable. When you identify tasks worth tracking, mention them clearly.',
  ].filter(Boolean).join('\n')

  // Fetch conversation history for context
  const history = store.getMessages(conversationId)
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        ...history.slice(-20), // last 20 messages for context
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  const data = await res.json() as { content: Array<{ type: string; text: string }>; usage?: { input_tokens: number; output_tokens: number } }
  const text = data.content.find(b => b.type === 'text')?.text ?? ''
  const inputTokens = data.usage?.input_tokens ?? null
  const outputTokens = data.usage?.output_tokens ?? null
  const estimatedCost = inputTokens && outputTokens
    ? (inputTokens * 3 + outputTokens * 15) / 1_000_000
    : null

  store.addMessage({
    id: `msg-${crypto.randomUUID().slice(0, 8)}`,
    conversation_id: conversationId,
    role: 'assistant',
    content: text,
    images: undefined,
    agent_id: agentId,
    model: 'claude-sonnet-4-6',
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    estimated_cost: estimatedCost,
    created_at: new Date().toISOString(),
  })

  // Update conversation cost + message count
  const conv = store.getConversation(conversationId)
  if (conv) {
    store.upsertConversation({
      ...conv,
      message_count: conv.message_count + 1,
      total_cost: conv.total_cost + (estimatedCost ?? 0),
      last_message_at: new Date().toISOString(),
      status: 'idle',
    })
  }
}

async function runAgentOrFallback(
  conversationId: string,
  agentId: string,
  projectId: string,
  prompt: string,
  role?: string,
): Promise<void> {
  // Try the Claude Agent SDK first (works locally with `claude login`)
  try {
    const { startConversation } = await import('@/lib/agent-runtime')
    await startConversation({ conversationId, agentId, projectId, prompt, role })
    return
  } catch {
    // SDK not available or not logged in — fall through to API fallback
  }

  // Try direct Anthropic API (works on Vercel with ANTHROPIC_API_KEY)
  try {
    await replyWithAnthropicAPI(conversationId, agentId, projectId, prompt)
    return
  } catch (err) {
    const msg = (err as Error).message
    if (msg.includes('ANTHROPIC_API_KEY not set')) {
      store.addMessage({
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        conversation_id: conversationId,
        role: 'assistant',
        content: 'Chat requires either:\n\n**Local dev**: Run `claude login` and restart the dev server\n\n**Vercel**: Add `ANTHROPIC_API_KEY` to your Vercel environment variables (Project Settings → Environment Variables)',
        images: undefined,
        agent_id: agentId,
        model: null,
        input_tokens: null,
        output_tokens: null,
        estimated_cost: null,
        created_at: new Date().toISOString(),
      })
    } else {
      throw err
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, images, conversation_id, project_id, agent_id, role } = body

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const messageImages = images?.map((img: { data: string; name: string; type: string }) => ({
      id: `img-${crypto.randomUUID().slice(0, 8)}`,
      ...img,
    }))

    const now = new Date().toISOString()

    // Continue existing conversation
    if (conversation_id) {
      // Add user message to store first
      store.addMessage({
        id: `msg-${crypto.randomUUID().slice(0, 8)}`,
        conversation_id,
        role: 'user',
        content: message,
        images: messageImages,
        agent_id: null,
        model: null,
        input_tokens: null,
        output_tokens: null,
        estimated_cost: null,
        created_at: now,
      })

      const conv = store.getConversation(conversation_id)
      const existingAgentId = conv?.agent_id ?? agent_id
      const existingProjectId = conv?.project_id ?? project_id

      // Run agent/fallback (fire and forget — don't block response)
      if (existingAgentId && existingProjectId) {
        runAgentOrFallback(conversation_id, existingAgentId, existingProjectId, message, role)
          .catch(err => console.error('[api/chat] runAgentOrFallback error:', err))
      }

      return NextResponse.json({ ok: true, conversation_id })
    }

    // Start new conversation — need project_id and agent_id
    if (!project_id || !agent_id) {
      return NextResponse.json(
        { error: 'Either conversation_id or (project_id + agent_id) is required' },
        { status: 400 }
      )
    }

    const conversationId = `conv-${crypto.randomUUID().slice(0, 8)}`

    store.upsertConversation({
      id: conversationId,
      agent_id,
      title: message.slice(0, 80),
      task_id: null,
      status: 'active',
      message_count: 1,
      total_cost: 0,
      last_message_at: now,
      project_id,
    })

    store.addMessage({
      id: `msg-${crypto.randomUUID().slice(0, 8)}`,
      conversation_id: conversationId,
      role: 'user',
      content: message,
      images: messageImages,
      agent_id: null,
      model: null,
      input_tokens: null,
      output_tokens: null,
      estimated_cost: null,
      created_at: now,
    })

    // Fire and forget — explicitly catch to prevent unhandled rejection
    runAgentOrFallback(conversationId, agent_id, project_id, message, role)
      .catch(err => console.error('[api/chat] runAgentOrFallback error:', err))

    return NextResponse.json({ ok: true, conversation_id: conversationId })
  } catch (err) {
    console.error('[api/chat] Error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
