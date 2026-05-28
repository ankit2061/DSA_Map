"use client"

import { allProblems } from "@/lib/data"
import { useTrackerStore } from "@/lib/store"
import type { Difficulty, Status } from "@/lib/types"

const SEGMENTS: {
  key: Difficulty
  label: string
  barColor: string
  dotColor: string
  textColor: string
}[] = [
  {
    key: "Easy",
    label: "Easy",
    barColor: "bg-[--diff-easy]",
    dotColor: "bg-[--diff-easy]",
    textColor: "text-[--diff-easy]",
  },
  {
    key: "Medium",
    label: "Med",
    barColor: "bg-[--diff-medium]",
    dotColor: "bg-[--diff-medium]",
    textColor: "text-[--diff-medium]",
  },
  {
    key: "Hard",
    label: "Hard",
    barColor: "bg-[--diff-hard]",
    dotColor: "bg-[--diff-hard]",
    textColor: "text-[--diff-hard]",
  },
]

export function DifficultySplit() {
  const { progress } = useTrackerStore()

  const counts = SEGMENTS.map(({ key }) => {
    const group = allProblems.filter((p) => p.difficulty === key)
    const solved = group.filter(
      (p) =>
        ((progress[String(p.id)]?.status ?? p.status) as Status) === "solved"
    ).length
    return { key, total: group.length, solved }
  })

  const total = allProblems.length

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-[15px] font-semibold text-foreground mb-4 tracking-tight">
        Difficulty Split
      </h2>

      {/* Segmented bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        {counts.map(({ key, total: t }, i) => (
          <div
            key={key}
            className={`${SEGMENTS[i].barColor} flex-none`}
            style={{ width: `${(t / total) * 100}%` }}
            title={`${SEGMENTS[i].label}: ${t} problems`}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {counts.map(({ key, total: t, solved }, i) => {
          const seg = SEGMENTS[i]
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${seg.dotColor}`} />
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${seg.textColor}`}
                >
                  {seg.label}
                </span>
              </div>
              <p className="text-[15px] font-bold text-foreground tabular-nums">
                {solved}
                <span className="text-[11px] text-muted-foreground font-normal">
                  /{t}
                </span>
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
