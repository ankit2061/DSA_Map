"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { getAdjacentProblems } from "@/lib/data"
import type { Problem } from "@/lib/types"

interface WorkspaceHeaderProps {
  problem: Problem
}

export function WorkspaceHeader({ problem }: WorkspaceHeaderProps) {
  const router = useRouter()
  const { prevSlug, nextSlug } = getAdjacentProblems(problem.slug)

  return (
    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
      {/* ── Breadcrumbs & Back ────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            // If the user came directly, history might be empty, but router.back is safe.
            // A fallback would be nice, but router.back is standard SPA pattern.
            // If window.history.length > 1, back. Else push to home.
            if (window.history.length > 2) {
              router.back()
            } else {
              router.push("/")
            }
          }}
          className="group flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div className="hidden sm:flex items-center text-[13px] font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            All Problems
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span>{problem.topic}</span>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-foreground truncate max-w-[200px]">
            {problem.title}
          </span>
        </div>
      </div>

      {/* ── Prev / Next Navigation ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Link
          href={prevSlug ? `/problems/${prevSlug}` : "#"}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium border transition-all ${
            prevSlug
              ? "border-border text-foreground hover:bg-muted"
              : "border-border/50 text-muted-foreground/40 pointer-events-none"
          }`}
          aria-disabled={!prevSlug}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </Link>

        <Link
          href={nextSlug ? `/problems/${nextSlug}` : "#"}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium border transition-all ${
            nextSlug
              ? "border-border text-foreground hover:bg-muted"
              : "border-border/50 text-muted-foreground/40 pointer-events-none"
          }`}
          aria-disabled={!nextSlug}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
