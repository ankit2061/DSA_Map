"use client"

import { useEffect, useRef, useState } from "react"
import { useAiChat } from "@/lib/hooks/use-ai-chat"
import type { Problem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Sparkles, Send, RotateCcw } from "lucide-react"

interface AiSidebarProps {
  problem: Problem
}

export function AiSidebar({ problem }: AiSidebarProps) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, isLoading, clearChat, quickPrompts } = useAiChat(problem.id)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isLoading) return
    const text = input
    setInput("")
    await sendMessage(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background lg:bg-transparent">
      
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-border bg-card lg:bg-transparent">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-semibold text-foreground tracking-tight">
            AI Assistant
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear chat history"
            title="Clear chat"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Messages Area ─────────────────────────────────── */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 py-10 opacity-70">
            <Sparkles className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-medium text-foreground mb-1">How can I help?</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
              Ask me for hints, time complexity analysis, or approach explanations for this problem.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[90%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm text-foreground"
              )}
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
              <div className="flex items-center gap-1.5" aria-label="AI is typing">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-ai-dot"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompts ─────────────────────────────────── */}
      {messages.length === 0 && (
        <div className="flex-shrink-0 px-4 pb-3 flex flex-col gap-1.5">
          {quickPrompts.slice(0, 3).map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInput(prompt)
                inputRef.current?.focus()
              }}
              className="text-left text-[12px] py-2 px-3 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-sm transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Area ────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 lg:p-4 border-t border-border bg-card lg:bg-transparent">
        <div className="relative flex items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this problem..."
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
            className="w-full resize-none text-[14px] text-foreground placeholder:text-muted-foreground bg-background border border-border rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 bottom-1.5 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, lineIdx) => {
        const parts = line.split(/\*\*(.*?)\*\*/)
        return (
          <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
            {parts.map((part, partIdx) =>
              partIdx % 2 === 1 ? (
                <strong key={partIdx} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        )
      })}
    </>
  )
}
