"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { allProblems, getAllTopics } from "@/lib/data"
import { useFilterStore, useTrackerStore } from "@/lib/store"
import type { Status } from "@/lib/types"
import {
  LayoutDashboard,
  BookOpen,
  Star,
  Hash,
} from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  /** Called after a nav item is clicked — lets the AppShell close the mobile Sheet */
  onNavClick?: () => void
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const router = useRouter()
  const { topic, setTopic, showFavoritesOnly, setShowFavoritesOnly, resetFilters } = useFilterStore()
  const { progress } = useTrackerStore()
  const topics = getAllTopics()
  
  const loggedInUser = useUser()
  const displayUserName = loggedInUser || process.env.NEXT_PUBLIC_USER_NAME || "User"


  const totalSolved = allProblems.filter(
    (p) => ((progress[String(p.id)]?.status ?? p.status) as Status) === "solved"
  ).length

  const favoriteCount = allProblems.filter(
    (p) => progress[String(p.id)]?.favorite ?? p.favorite
  ).length

  function topicTotal(t: string) {
    return allProblems.filter((p) => p.topic === t).length
  }

  function topicSolved(t: string) {
    return allProblems.filter(
      (p) =>
        p.topic === t &&
        ((progress[String(p.id)]?.status ?? p.status) as Status) === "solved"
    ).length
  }

  function navigate(newTopic: string) {
    setTopic(newTopic)
    router.push('/')
    onNavClick?.()
  }

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div 
        className="flex items-center gap-2.5 h-[var(--header-height)] px-4 border-b border-sidebar-border flex-shrink-0 cursor-pointer"
        onClick={() => {
          resetFilters()
          router.push('/')
          onNavClick?.()
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary flex-shrink-0">
          <Hash className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-sidebar-foreground">
          DSA Map
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto scrollbar-none py-3 px-2"
        aria-label="Main navigation"
      >
        {/* Overview section */}
        <SectionLabel>Overview</SectionLabel>

        <NavItem
          icon={<LayoutDashboard className="h-4 w-4" />}
          label="All Problems"
          count={allProblems.length}
          isActive={!topic && !showFavoritesOnly}
          onClick={() => {
            resetFilters()
            router.push('/')
            onNavClick?.()
          }}
        />
        <NavItem
          icon={<Star className="h-4 w-4" />}
          label="Favorites"
          count={favoriteCount}
          isActive={showFavoritesOnly}
          onClick={() => {
            setShowFavoritesOnly(true)
            router.push('/')
            onNavClick?.()
          }}
        />

        {/* Topics section */}
        <SectionLabel className="pt-5">Topics</SectionLabel>

        {topics.map((t) => (
          <NavItem
            key={t}
            icon={<BookOpen className="h-4 w-4" />}
            label={t}
            count={topicTotal(t)}
            solvedCount={topicSolved(t)}
            isActive={topic === t}
            onClick={() => navigate(t === topic ? "" : t)}
          />
        ))}
      </nav>

      {/* ── Footer / user ────────────────────────────────────────── */}
      <div className="flex-shrink-0 p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/profile.png" alt={displayUserName} className="object-cover" />
            <AvatarFallback className="text-[11px] font-bold text-primary bg-primary/20">
              {displayUserName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-sidebar-foreground truncate">
              {displayUserName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {totalSolved} solved
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2.5 pb-1 pt-2",
        className
      )}
    >
      {children}
    </p>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  count?: number
  solvedCount?: number
  onClick: () => void
}

function NavItem({
  icon,
  label,
  isActive,
  count,
  solvedCount,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center gap-2.5 rounded-lg px-2.5 h-8 text-[13px] font-medium transition-all duration-150 text-left group",
        isActive
          ? "bg-primary/10 text-primary nav-active-bar"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {icon}
      </span>

      <span className="flex-1 truncate">{label}</span>

      {count !== undefined && (
        <span
          className={cn(
            "text-[11px] font-medium rounded-full px-1.5 min-w-[20px] text-center tabular-nums",
            isActive
              ? "bg-primary/15 text-primary"
              : "bg-muted/80 text-muted-foreground"
          )}
        >
          {solvedCount !== undefined ? `${solvedCount}/${count}` : count}
        </span>
      )}
    </button>
  )
}
