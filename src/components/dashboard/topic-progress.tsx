"use client"

import { motion } from "framer-motion"
import { allProblems, getAllTopics } from "@/lib/data"
import { useFilterStore, useTrackerStore } from "@/lib/store"
import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"

export function TopicProgress() {
  const { progress } = useTrackerStore()
  const { topic: activeTopic, setTopic } = useFilterStore()
  const topics = getAllTopics()

  const rows = topics
    .map((t) => {
      const total = allProblems.filter((p) => p.topic === t).length
      const solved = allProblems.filter(
        (p) =>
          p.topic === t &&
          ((progress[String(p.id)]?.status ?? p.status) as Status) === "solved"
      ).length
      const pct = total > 0 ? Math.round((solved / total) * 100) : 0
      return { topic: t, total, solved, pct }
    })
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-[15px] font-semibold text-foreground mb-4 tracking-tight">
        Topic Breakdown
      </h2>

      <div className="space-y-3">
        {rows.map(({ topic, total, solved, pct }, i) => {
          const isActive = activeTopic === topic
          return (
            <button
              key={topic}
              onClick={() => setTopic(isActive ? "" : topic)}
              className="w-full text-left group"
              aria-pressed={isActive}
              aria-label={`Filter by ${topic}: ${solved} of ${total} solved`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-[13px] font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary"
                  )}
                >
                  {topic}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium tabular-nums">
                  {solved}/{total} · {pct}%
                </span>
              </div>

              {/* Animated progress bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    isActive ? "bg-primary" : "bg-primary/60 group-hover:bg-primary"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.04,
                    ease: "easeOut",
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
