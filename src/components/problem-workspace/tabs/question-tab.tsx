"use client"

import type { Problem } from "@/lib/types"

export function QuestionTab({ problem }: { problem: Problem }) {
  if (!problem.questionSummary) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground text-base">No question summary available.</p>
      </div>
    )
  }

  return (
    <div className="prose dark:prose-invert max-w-3xl prose-p:leading-relaxed prose-p:text-[15px] prose-p:text-foreground/90">
      <h3 className="text-xl font-semibold mb-4 tracking-tight">Problem Summary</h3>
      {problem.questionSummary.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <div className="mt-8 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Original Source</h4>
        <p className="text-sm text-muted-foreground">
          Extracted from page {problem.sourcePage} of the LeetCode solutions PDF.
        </p>
      </div>
    </div>
  )
}
