"use client"

import { StatCards } from "@/components/dashboard/stat-cards"
import { TopicProgress } from "@/components/dashboard/topic-progress"
import { DifficultySplit } from "@/components/dashboard/difficulty-split"
import { ProblemFilters } from "@/components/dashboard/problem-filters"
import { ProblemTable } from "@/components/dashboard/problem-table"
import { Pagination } from "@/components/dashboard/pagination"

export default function Home() {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const userName = process.env.NEXT_PUBLIC_USER_NAME || "there"

  return (
    <>
      {/* ── Page content ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-base text-muted-foreground mt-0.5 leading-relaxed">
            Track your progress and keep grinding.
          </p>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <StatCards />

        {/* ── Topic progress + Difficulty split ───────────────── */}
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <TopicProgress />
          <DifficultySplit />
        </div>

        {/* ── Problem list ────────────────────────────────────── */}
        <section aria-label="Problem list">
          <div className="space-y-3">
            <ProblemFilters />
            <ProblemTable />
            <Pagination />
          </div>
        </section>
      </div>
    </>
  )
}
