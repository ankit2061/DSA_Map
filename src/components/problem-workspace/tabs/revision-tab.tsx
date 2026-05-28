"use client"

import { useEffect, useRef, useState } from "react"
import { useTrackerStore } from "@/lib/store"
import type { Confidence } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Check, CalendarCheck, RotateCcw, AlertTriangle } from "lucide-react"

export function RevisionTab({ problemId }: { problemId: string }) {
  const { progress, updateRevision } = useTrackerStore()
  
  const prog = progress[problemId] || {}
  const confidence = prog.confidence ?? null
  const revisitLater = prog.revisitLater ?? false
  const lastReviewed = prog.lastReviewed
  const currentMistakes = prog.mistakes ?? ""
  const [mistakes, setMistakes] = useState(currentMistakes)
  
  const [showSaved, setShowSaved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [prevProblemId, setPrevProblemId] = useState(problemId)

  // Derive state based on problemId change to avoid useEffect
  if (problemId !== prevProblemId) {
    setPrevProblemId(problemId)
    setMistakes(currentMistakes)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])


  function handleMistakesChange(newVal: string) {
    setMistakes(newVal)
    setShowSaved(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateRevision(problemId, { mistakes: newVal })
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2200)
    }, 600)
  }

  function setConfidence(val: Confidence) {
    updateRevision(problemId, { confidence: val })
  }

  function toggleRevisit() {
    updateRevision(problemId, { revisitLater: !revisitLater })
  }

  function markReviewed() {
    updateRevision(problemId, { lastReviewed: Date.now() })
  }

  const reviewedDateStr = lastReviewed 
    ? new Date(lastReviewed).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : "Never"

  return (
    <div className="max-w-3xl space-y-8">
      
      {/* ── Confidence & Status ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h4 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Confidence Level</h4>
          <div className="flex gap-2">
            <ConfidenceButton 
              active={confidence === "low"} 
              onClick={() => setConfidence("low")} 
              colorClass="bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/15"
            >
              Low
            </ConfidenceButton>
            <ConfidenceButton 
              active={confidence === "medium"} 
              onClick={() => setConfidence("medium")}
              colorClass="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/15 dark:text-yellow-500"
            >
              Medium
            </ConfidenceButton>
            <ConfidenceButton 
              active={confidence === "high"} 
              onClick={() => setConfidence("high")}
              colorClass="bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/15 dark:text-green-500"
            >
              High
            </ConfidenceButton>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <h4 className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Review Status</h4>
          <div className="space-y-3">
            <button
              onClick={toggleRevisit}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all",
                revisitLater 
                  ? "bg-[--status-revisit]/10 text-[--status-revisit] border-[--status-revisit]/30" 
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <RotateCcw className="h-4 w-4" />
                Revisit Later
              </span>
              <div className={cn("w-4 h-4 rounded-full border", revisitLater ? "bg-[--status-revisit] border-[--status-revisit]" : "border-muted-foreground")} />
            </button>

            <button
              onClick={markReviewed}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <CalendarCheck className="h-4 w-4" />
                Last Reviewed: <span className="text-foreground">{reviewedDateStr}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mistakes to Remember ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Mistakes to Remember</h3>
          </div>
          {showSaved && (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[--status-solved] animate-in fade-in duration-200 bg-[--status-solved]/10 px-2.5 py-1 rounded-full">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
        </div>
        <textarea
          value={mistakes}
          onChange={(e) => handleMistakesChange(e.target.value)}
          placeholder="What edge cases did you miss? What syntax tripped you up? (Auto-saves)"
          className="w-full min-h-[160px] resize-y text-[15px] text-foreground placeholder:text-muted-foreground bg-card border border-border rounded-xl p-4 leading-relaxed focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all font-sans shadow-sm"
          aria-label="Mistakes to remember"
        />
      </div>

    </div>
  )
}

function ConfidenceButton({ 
  children, 
  active, 
  onClick, 
  colorClass 
}: { 
  children: React.ReactNode, 
  active: boolean, 
  onClick: () => void,
  colorClass: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 h-9 rounded-lg text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-ring/50",
        active 
          ? colorClass 
          : "bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
