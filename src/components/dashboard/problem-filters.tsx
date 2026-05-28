"use client"

import { Search, X } from "lucide-react"
import { getAllTopics } from "@/lib/data"
import { useFilterStore } from "@/lib/store"
import type { Difficulty, Status } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DIFFICULTIES: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"]

const STATUS_OPTIONS: { value: Status | "All"; label: string }[] = [
  { value: "All", label: "All Statuses" },
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "solved", label: "Solved" },
  { value: "revisit", label: "Revisit" },
]

export function ProblemFilters() {
  const {
    search, setSearch,
    topic, setTopic,
    difficulty, setDifficulty,
    status, setStatus,
    resetFilters,
  } = useFilterStore()

  const topics = getAllTopics()
  const hasFilters = !!(search || topic || difficulty !== "All" || status !== "All")

  return (
    <div className="space-y-3" role="search" aria-label="Problem filters">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          id="problem-search"
          type="search"
          placeholder="Search problems…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-9 rounded-lg border border-border bg-card text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 transition-all"
          aria-label="Search problems by title"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Topic tabs + filter dropdowns */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        {/* Scrollable topic strip */}
        <div className="flex-1 overflow-x-auto scrollbar-none min-w-0">
          <div
            className="flex items-center gap-1.5 min-w-max pb-0.5"
            role="group"
            aria-label="Filter by topic"
          >
            {/* "All" tab */}
            <TopicTab
              label="All"
              isActive={!topic}
              onClick={() => setTopic("")}
            />
            {topics.map((t) => (
              <TopicTab
                key={t}
                label={t}
                isActive={topic === t}
                onClick={() => setTopic(topic === t ? "" : t)}
              />
            ))}
          </div>
        </div>

        {/* Selects */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select
            value={difficulty}
            onValueChange={(v) => setDifficulty(v as Difficulty | "All")}
          >
            <SelectTrigger
              className="h-7 text-[12px] w-[130px] border-border"
              id="difficulty-filter"
              aria-label="Filter by difficulty"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d} className="text-[13px]">
                  {d === "All" ? "All Difficulties" : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(v) => setStatus(v as Status | "All")}
          >
            <SelectTrigger
              className="h-7 text-[12px] w-[130px] border-border"
              id="status-filter"
              aria-label="Filter by status"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-[13px]">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="h-7 px-2.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TopicTab({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center h-7 px-3 rounded-full text-[12px] font-medium whitespace-nowrap transition-all border",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}
