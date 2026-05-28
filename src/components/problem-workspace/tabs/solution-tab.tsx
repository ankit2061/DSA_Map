"use client"

import type { Problem } from "@/lib/types"

export function SolutionTab({ problem }: { problem: Problem }) {
  if (!problem.solutionSummary) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground text-base">No solution summary available.</p>
      </div>
    )
  }

  return (
    <div className="prose dark:prose-invert max-w-3xl prose-p:leading-relaxed prose-p:text-[15px] prose-p:text-foreground/90">
      <h3 className="text-xl font-semibold mb-4 tracking-tight">Solution Approach</h3>
      {problem.solutionSummary.split('\n').map((paragraph, index) => {
        // Simple markdown-like rendering for bold text (e.g. "Approach 1:")
        const parts = paragraph.split(/(\*\*.*?\*\*|Approach \d+:|Optimal:)/)
        
        return (
          <p key={index} className="mb-4">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>
              }
              if (part.startsWith('Approach') || part.startsWith('Optimal')) {
                return <strong key={i} className="text-primary">{part}</strong>
              }
              return part
            })}
          </p>
        )
      })}
    </div>
  )
}
