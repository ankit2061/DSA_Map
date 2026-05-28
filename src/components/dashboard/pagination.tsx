"use client"

import { useMemo } from "react"
import { allProblems } from "@/lib/data"
import { useFilterStore, useTrackerStore } from "@/lib/store"
import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  const { page, pageSize, setPage, search, topic, difficulty, status } =
    useFilterStore()
  const { progress } = useTrackerStore()

  const filteredCount = useMemo(() => {
    const searchLower = search.toLowerCase()
    return allProblems.filter((p) => {
      const userStatus = (progress[String(p.id)]?.status ?? p.status) as Status
      return (
        (!search || p.title.toLowerCase().includes(searchLower)) &&
        (!topic || p.topic === topic) &&
        (difficulty === "All" || p.difficulty === difficulty) &&
        (status === "All" || userStatus === status)
      )
    }).length
  }, [progress, search, topic, difficulty, status])

  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize))
  const current = Math.max(1, Math.min(page, totalPages))
  const start = (current - 1) * pageSize + 1
  const end = Math.min(current * pageSize, filteredCount)

  if (filteredCount === 0) return null

  // Build page number array with ellipsis
  function buildPages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (current > 3) pages.push("…")
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < totalPages - 2) pages.push("…")
    pages.push(totalPages)
    return pages
  }

  const pages = buildPages()

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap" aria-label="Pagination">
      {/* Count */}
      <p className="text-[13px] text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground tabular-nums">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground tabular-nums">
          {filteredCount}
        </span>
      </p>

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1" role="navigation" aria-label="Page navigation">
          <PageButton
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </PageButton>

          {pages.map((p, i) =>
            p === "…" ? (
              <span
                key={`ellipsis-${i}`}
                className="w-7 text-center text-[13px] text-muted-foreground select-none"
                aria-hidden
              >
                …
              </span>
            ) : (
              <PageButton
                key={p}
                onClick={() => setPage(p as number)}
                isActive={current === p}
                aria-label={`Page ${p}`}
                aria-current={current === p ? "page" : undefined}
              >
                {p}
              </PageButton>
            )
          )}

          <PageButton
            onClick={() => setPage(current + 1)}
            disabled={current === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </PageButton>
        </div>
      )}
    </div>
  )
}

function PageButton({
  children,
  onClick,
  disabled,
  isActive,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  "aria-label"?: string
  "aria-current"?: "page" | undefined
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded-md text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50",
        isActive
          ? "bg-primary text-primary-foreground"
          : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  )
}
