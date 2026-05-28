"use client"

import { useEffect, useRef, useState } from "react"
import { useTrackerStore } from "@/lib/store"
import { Check } from "lucide-react"

export function NotesTab({ problemId }: { problemId: string }) {
  const { progress, saveNotes } = useTrackerStore()
  const [value, setValue] = useState(progress[problemId]?.notes ?? "")
  const [showSaved, setShowSaved] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(progress[problemId]?.notes ?? "")
  }, [problemId, progress])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  function handleChange(newVal: string) {
    setValue(newVal)
    setShowSaved(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      saveNotes(problemId, newVal)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2200)
    }, 600)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">My Notes</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Write down your insights, alternative approaches, or pseudocode.</p>
        </div>
        {showSaved && (
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[--status-solved] animate-in fade-in duration-200 bg-[--status-solved]/10 px-2.5 py-1 rounded-full">
            <Check className="h-3.5 w-3.5" />
            Saved
          </span>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Type your notes here... (Auto-saves as you type)"
        className="w-full min-h-[300px] resize-y text-[15px] text-foreground placeholder:text-muted-foreground bg-card border border-border rounded-xl p-5 leading-relaxed focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all font-sans shadow-sm"
        aria-label="My Notes"
      />
    </div>
  )
}
