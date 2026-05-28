"use client"

import { useMemo } from "react"
import { allProblems } from "@/lib/data"
import { useFilterStore, useTrackerStore } from "@/lib/store"
import type { Problem, Status } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Circle,
  Clock,
  RotateCcw,
  Star,
  BookOpen,
} from "lucide-react"

import { useRouter } from "next/navigation"

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Status,
  { Icon: React.ElementType; color: string; label: string }
> = {
  solved: { Icon: CheckCircle2, color: "text-[--status-solved]", label: "Solved" },
  in_progress: { Icon: Clock, color: "text-[--status-progress]", label: "In Progress" },
  revisit: { Icon: RotateCcw, color: "text-[--status-revisit]", label: "Revisit" },
  not_started: { Icon: Circle, color: "text-muted-foreground", label: "Not Started" },
}

const DIFF_CLASSES: Record<string, string> = {
  Easy: "text-[--diff-easy] bg-[--diff-easy]/10 border-[--diff-easy]/25",
  Medium: "text-[--diff-medium] bg-[--diff-medium]/10 border-[--diff-medium]/25",
  Hard: "text-[--diff-hard] bg-[--diff-hard]/10 border-[--diff-hard]/25",
  Unknown: "text-muted-foreground bg-muted border-border",
}

const STATUS_CYCLE: Status[] = ["not_started", "in_progress", "solved", "revisit"]

// ─── Component ────────────────────────────────────────────────────────────────

export function ProblemTable() {
  const router = useRouter()
  const { progress, updateStatus, toggleFavorite } = useTrackerStore()
  const {
    search,
    topic,
    difficulty,
    status,
    showFavoritesOnly,
    page,
    pageSize,
  } = useFilterStore()

  // Client-side filter — replace with server call for Supabase
  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase()
    return allProblems.filter((p) => {
      const userStatus = (progress[String(p.id)]?.status ?? p.status) as Status
      const isFav = progress[String(p.id)]?.favorite ?? p.favorite
      return (
        (!search || p.title.toLowerCase().includes(searchLower)) &&
        (!topic || p.topic === topic) &&
        (difficulty === "All" || p.difficulty === difficulty) &&
        (status === "All" || userStatus === status) &&
        (!showFavoritesOnly || isFav)
      )
    })
  }, [progress, search, topic, difficulty, status, showFavoritesOnly])

  const safePage = Math.max(1, Math.min(page, Math.ceil(filtered.length / pageSize) || 1))
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function cycleStatus(p: Problem, e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation()
    const curr = (progress[String(p.id)]?.status ?? p.status) as Status
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(curr) + 1) % STATUS_CYCLE.length]
    updateStatus(String(p.id), next)
  }

  if (filtered.length === 0) return <EmptyState />

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" aria-label="Problem list">
          {/* Sticky header */}
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 w-14">
                #
              </th>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-3">
                Title
              </th>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-3 hidden md:table-cell w-28">
                Topic
              </th>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-3 w-20">
                Diff
              </th>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-3 w-10 hidden sm:table-cell">
                <span className="sr-only">Status</span>
                ◎
              </th>
              <th scope="col" className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-3 w-10">
                <span className="sr-only">Favorite</span>
                ★
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginated.map((problem) => {
              const userStatus = (progress[String(problem.id)]?.status ?? problem.status) as Status
              const isFav = progress[String(problem.id)]?.favorite ?? problem.favorite
              const { Icon: StatusIcon, color: statusColor, label: statusLabel } =
                STATUS_CONFIG[userStatus]

              return (
                <tr
                  key={problem.id}
                  onClick={() => router.push(`/problems/${problem.slug}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/problems/${problem.slug}`)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${problem.title}`}
                  className="group hover:bg-muted/40 cursor-pointer transition-colors focus:outline-none focus:bg-muted/40"
                >
                  {/* ID */}
                  <td className="px-4 py-3 text-[13px] text-muted-foreground font-mono">
                    {problem.id}
                  </td>

                  {/* Title */}
                  <td className="px-3 py-3">
                    <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                      {problem.title}
                    </span>
                  </td>

                  {/* Topic — hidden on mobile */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-[12px] text-muted-foreground">
                      {problem.topic}
                    </span>
                  </td>

                  {/* Difficulty badge */}
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md border",
                        DIFF_CLASSES[problem.difficulty] ?? DIFF_CLASSES.Unknown
                      )}
                    >
                      {problem.difficulty === "Unknown"
                        ? "?"
                        : problem.difficulty.slice(0, 3)}
                    </span>
                  </td>

                  {/* Status toggle — hidden on mobile */}
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <button
                      onClick={(e) => cycleStatus(problem, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          cycleStatus(problem, e)
                        }
                      }}
                      className={cn(
                        "transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/50 rounded",
                        statusColor
                      )}
                      aria-label={`Status: ${statusLabel}. Click to cycle.`}
                      title={statusLabel}
                    >
                      <StatusIcon className="h-4 w-4" />
                    </button>
                  </td>

                  {/* Favorite star */}
                  <td className="px-3 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(String(problem.id))
                      }}
                      className={cn(
                        "transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/50 rounded",
                        isFav
                          ? "text-[--diff-medium]"
                          : "text-muted-foreground hover:text-[--diff-medium]"
                      )}
                      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={isFav}
                    >
                      <Star className={cn("h-4 w-4", isFav && "fill-current")} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
        <BookOpen className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-base font-medium text-foreground mb-1.5">
        No problems found
      </p>
      <p className="text-base text-muted-foreground text-center max-w-[280px] leading-relaxed">
        Try adjusting your search or filter criteria to find what you&apos;re
        looking for.
      </p>
    </div>
  )
}
