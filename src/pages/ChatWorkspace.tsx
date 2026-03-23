import React, { useState } from 'react';
import {
  MessageSquareIcon,
  TerminalIcon,
  BotIcon,
  UserIcon,
  ChevronRightIcon,
  CpuIcon,
  ClockIcon,
  DollarSignIcon,
  SendIcon } from
'lucide-react';
interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentName?: string;
  agentColor?: string;
  toolCall?: {
    name: string;
    input: string;
    result: string;
  };
  metadata?: {
    model: string;
    tokens: number;
    cost: number;
  };
}
const mockChats = [
{
  id: 'c1',
  title: 'Analyze Q3 Competitor Earnings',
  time: '10m ago',
  active: true
},
{
  id: 'c2',
  title: 'Draft Marketing Copy for v2.0',
  time: '2h ago',
  active: false
},
{
  id: 'c3',
  title: 'Database Migration Script',
  time: '1d ago',
  active: false
}];

const mockMessages: Message[] = [
{
  id: 'm1',
  role: 'user',
  content:
  'Can you analyze the Q3 earnings for our top 3 competitors and summarize their AI investments?'
},
{
  id: 'm2',
  role: 'agent',
  agentName: 'Researcher',
  agentColor: '#3b82f6',
  content:
  'I will search for the Q3 earnings reports for your top competitors and extract their AI-related investments.',
  metadata: {
    model: 'gpt-4o-mini',
    tokens: 45,
    cost: 0.0001
  }
},
{
  id: 'm3',
  role: 'agent',
  agentName: 'Researcher',
  agentColor: '#3b82f6',
  content: 'Searching the web for recent earnings call transcripts...',
  toolCall: {
    name: 'search_web',
    input:
    '{"query": "Q3 2023 earnings call transcripts AI investments top tech competitors"}',
    result: 'Found 3 relevant transcripts. Extracting key sections...'
  },
  metadata: {
    model: 'gpt-4o',
    tokens: 850,
    cost: 0.0085
  }
},
{
  id: 'm4',
  role: 'agent',
  agentName: 'Analyst',
  agentColor: '#10b981',
  content:
  'Based on the transcripts gathered by the Researcher, here is the summary of AI investments:\n\n1. **Competitor A**: Invested $2.4B primarily in custom silicon and expanding their LLM training cluster.\n2. **Competitor B**: Focused on AI integration into existing enterprise tools, allocating $800M for acquisitions.\n3. **Competitor C**: Highlighted a new partnership with OpenAI, though specific dollar amounts were not disclosed.',
  metadata: {
    model: 'claude-3-opus',
    tokens: 1240,
    cost: 0.0186
  }
}];

export function ChatWorkspace() {
  const [isTyping, setIsTyping] = useState(true);
  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Left Panel: Chat List */}
      <div className="w-72 border-r border-border flex flex-col bg-[#050506]">
        <div className="p-4 border-b border-border/50">
          <button className="w-full flex items-center justify-center gap-2 bg-card hover:bg-white/5 border border-border text-foreground px-4 py-2 rounded-lg font-medium text-sm transition-colors">
            <MessageSquareIcon className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {mockChats.map((chat) =>
          <button
            key={chat.id}
            className={`w-full text-left p-3 rounded-lg transition-colors ${chat.active ? 'bg-accent/10 border border-accent/20 text-accent' : 'hover:bg-white/5 text-muted hover:text-foreground border border-transparent'}`}>
            
              <div className="text-sm font-medium truncate mb-1">
                {chat.title}
              </div>
              <div className="text-xs opacity-70">{chat.time}</div>
            </button>
          )}
        </div>
      </div>

      {/* Center Panel: Thread */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-6 bg-card/30 backdrop-blur-sm z-10">
          <h2 className="text-sm font-medium text-foreground">
            Analyze Q3 Competitor Earnings
          </h2>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mockMessages.map((msg) =>
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
              <div
              className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
              
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ?
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center border border-accent/30">
                      <UserIcon className="w-4 h-4" />
                    </div> :

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border shadow-sm"
                  style={{
                    backgroundColor: `${msg.agentColor}20`,
                    borderColor: `${msg.agentColor}40`,
                    color: msg.agentColor
                  }}>
                  
                      <BotIcon className="w-4 h-4" />
                    </div>
                }
                </div>

                {/* Content Bubble */}
                <div
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                  {msg.role === 'agent' &&
                <div className="flex items-center gap-2 mb-1.5 ml-1">
                      <span className="text-xs font-medium text-foreground">
                        {msg.agentName}
                      </span>
                      {msg.metadata &&
                  <span className="text-[10px] text-muted font-mono bg-white/5 px-1.5 py-0.5 rounded">
                          {msg.metadata.model}
                        </span>
                  }
                    </div>
                }

                  <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-accent/10 text-foreground border border-accent/20 rounded-tr-sm' : 'bg-card text-foreground border border-border rounded-tl-sm shadow-sm'}`}
                  style={
                  msg.role === 'agent' ?
                  {
                    borderLeftWidth: '3px',
                    borderLeftColor: msg.agentColor
                  } :
                  {}
                  }>
                  
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Tool Call Terminal Block */}
                    {msg.toolCall &&
                  <div className="mt-4 bg-[#050506] border border-status-tool/30 rounded-lg overflow-hidden">
                        <div className="bg-status-tool/10 px-3 py-1.5 border-b border-status-tool/20 flex items-center gap-2">
                          <TerminalIcon className="w-3.5 h-3.5 text-status-tool" />
                          <span className="text-xs font-mono text-status-tool font-medium">
                            {msg.toolCall.name}
                          </span>
                        </div>
                        <div className="p-3 text-xs font-mono text-status-tool/80 space-y-2">
                          <div>
                            <span className="opacity-50">&gt; Input:</span>{' '}
                            {msg.toolCall.input}
                          </div>
                          <div className="text-status-success/80">
                            <span className="opacity-50">&gt; Result:</span>{' '}
                            {msg.toolCall.result}
                          </div>
                        </div>
                      </div>
                  }
                  </div>

                  {/* Message Footer (Cost) */}
                  {msg.role === 'agent' && msg.metadata &&
                <div className="mt-1.5 ml-1 text-[10px] text-muted font-mono flex items-center gap-3">
                      <span>{msg.metadata.tokens} tkns</span>
                      <span>${msg.metadata.cost.toFixed(4)}</span>
                    </div>
                }
                </div>
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping &&
          <div className="flex justify-start">
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-status-model/20 text-status-model flex items-center justify-center border border-status-model/40 flex-shrink-0 mt-1">
                  <BotIcon className="w-4 h-4" />
                </div>
                <div className="bg-card border border-border border-l-3 border-l-status-model rounded-2xl rounded-tl-sm p-4 flex items-center gap-1 h-12">
                  <div className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" />
                  <div className="w-1.5 h-1.5 bg-muted rounded-full typing-dot" />
                </div>
              </div>
            </div>
          }
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <div className="relative flex items-end bg-card border border-border rounded-xl focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all p-2 shadow-sm">
            <textarea
              rows={1}
              placeholder="Reply to agents or provide new instructions..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted resize-none focus:outline-none py-2 px-3 max-h-32" />
            
            <button className="p-2 mb-0.5 mr-0.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors flex-shrink-0">
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Metadata Sidebar */}
      <div className="w-64 border-l border-border bg-card/30 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Session Details
          </h3>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl p-3 card-glow">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
              <BotIcon className="w-4 h-4 text-accent" /> Active Agents
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Researcher</span>
                <span className="w-2 h-2 rounded-full bg-status-running led-pulse" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Analyst</span>
                <span className="w-2 h-2 rounded-full bg-border" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3 card-glow">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
              <DollarSignIcon className="w-4 h-4 text-status-model" /> Cost &
              Usage
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-muted uppercase mb-1">
                  Total Cost
                </div>
                <div className="text-lg font-mono text-foreground tabular-nums">
                  $0.0272
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase mb-1">
                  Total Tokens
                </div>
                <div className="text-sm font-mono text-foreground tabular-nums">
                  2,135
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-3 card-glow">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
              <ClockIcon className="w-4 h-4 text-status-tool" /> Timeline
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Started</span>
                <span className="font-mono text-foreground">10:42 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Duration</span>
                <span className="font-mono text-foreground">12m 4s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}