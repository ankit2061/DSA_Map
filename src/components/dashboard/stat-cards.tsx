"use client"

import { type Variants, motion } from "framer-motion"
import { CheckCircle2, Target, Star, BookOpen } from "lucide-react"
import { allProblems } from "@/lib/data"
import { useTrackerStore } from "@/lib/store"
import type { Status } from "@/lib/types"

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}

const card: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

export function StatCards() {
  const { progress } = useTrackerStore()

  const total = allProblems.length
  const solved = allProblems.filter(
    (p) => ((progress[String(p.id)]?.status ?? p.status) as Status) === "solved"
  ).length
  const favorites = allProblems.filter(
    (p) => progress[String(p.id)]?.favorite ?? p.favorite
  ).length
  const remaining = total - solved
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0

  const stats = [
    {
      id: "total",
      title: "Total Problems",
      value: total,
      sub: "In your tracker",
      Icon: BookOpen,
      iconColor: "text-muted-foreground",
      accent: null,
    },
    {
      id: "solved",
      title: "Solved",
      value: solved,
      sub: `${pct}% complete`,
      Icon: CheckCircle2,
      iconColor: "text-[--status-solved]",
      accent: "bg-[--status-solved]",
    },
    {
      id: "favorites",
      title: "Favorites",
      value: favorites,
      sub: "Starred problems",
      Icon: Star,
      iconColor: "text-[--diff-medium]",
      accent: "bg-[--diff-medium]",
    },
    {
      id: "remaining",
      title: "Remaining",
      value: remaining,
      sub: `${remaining} to go`,
      Icon: Target,
      iconColor: "text-muted-foreground",
      accent: null,
    },
  ] as const

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((s) => (
        <motion.div key={s.id} variants={card}>
          <div className="relative bg-card border border-border rounded-xl p-5 overflow-hidden h-full">
            {/* Left accent bar */}
            {s.accent && (
              <div
                className={`absolute left-0 top-3 bottom-3 w-[3px] ${s.accent} rounded-full`}
              />
            )}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-muted-foreground">
                  {s.title}
                </p>
                <p className="text-[28px] font-bold tracking-tight text-foreground mt-1 leading-none">
                  {s.value}
                </p>
                <p className="text-[13px] text-muted-foreground mt-1.5">
                  {s.sub}
                </p>
              </div>
              <s.Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${s.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
