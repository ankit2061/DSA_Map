"use client"

import { useTrackerStore } from "@/lib/store"
import type { Problem, Status } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Star, ExternalLink, Circle, Clock, CheckCircle2, RotateCcw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface ProblemMetaProps {
  problem: Problem
}

export function ProblemMeta({ problem }: ProblemMetaProps) {
  const { progress, updateStatus, toggleFavorite } = useTrackerStore()
  const idStr = String(problem.id)
  const userStatus = (progress[idStr]?.status ?? problem.status) as Status
  const isFav = progress[idStr]?.favorite ?? problem.favorite

  const { Icon: StatusIcon, color: statusColor, label: statusLabel } = STATUS_CONFIG[userStatus]

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Title and Badges */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {problem.id}. {problem.title}
            </h1>
            <button
              onClick={() => toggleFavorite(idStr)}
              className={cn(
                "flex-shrink-0 transition-all hover:scale-110 focus:outline-none rounded-full p-1",
                isFav
                  ? "text-[--diff-medium]"
                  : "text-muted-foreground hover:text-[--diff-medium] hover:bg-muted"
              )}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={cn("h-5 w-5", isFav && "fill-current")} />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center text-[12px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-md border",
                DIFF_CLASSES[problem.difficulty] ?? DIFF_CLASSES.Unknown
              )}
            >
              {problem.difficulty}
            </span>
            <span className="inline-flex items-center text-[12px] font-medium px-2.5 py-0.5 rounded-md border bg-muted text-muted-foreground border-border">
              {problem.topic}
            </span>
            <a
              href={`https://leetcode.com/problems/${problem.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-primary transition-colors ml-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              LeetCode ↗
            </a>
          </div>
        </div>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-medium border transition-all hover:opacity-80",
                userStatus === "not_started" 
                  ? "bg-muted text-foreground border-border" 
                  : `bg-[--status-${userStatus}]/10 ${statusColor} border-[--status-${userStatus}]/30`
              )}
            >
              <StatusIcon className="h-4 w-4" />
              {statusLabel}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {(Object.keys(STATUS_CONFIG) as Status[]).map((statusKey) => {
              const { Icon, color, label } = STATUS_CONFIG[statusKey]
              return (
                <DropdownMenuItem
                  key={statusKey}
                  onClick={() => updateStatus(idStr, statusKey)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon className={cn("h-4 w-4", color)} />
                  <span className="text-[13px]">{label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
