"use client"

import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useFilterStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { topic, search, difficulty, status, setTopic, resetFilters } =
    useFilterStore()

  const hasActiveFilters = !!(
    topic ||
    search ||
    difficulty !== "All" ||
    status !== "All"
  )

  const pageTitle = topic || "All Problems"

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 h-[var(--header-height)] px-4 border-b border-border bg-background/80 backdrop-blur-md flex-shrink-0">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-8 w-8 flex-shrink-0"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        id="mobile-menu-button"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Page title + active filter chips */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h1 className="text-[15px] font-semibold text-foreground truncate tracking-tight">
          {pageTitle}
        </h1>

        {topic && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-0.5 border border-primary/20 flex-shrink-0">
            {topic}
            <button
              onClick={() => setTopic("")}
              className="hover:opacity-70 transition-opacity ml-0.5"
              aria-label={`Remove ${topic} topic filter`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-[12px] text-muted-foreground h-7 px-2 hidden sm:flex"
          >
            Clear filters
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle colour theme"
          className="h-8 w-8 relative"
          id="theme-toggle"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  )
}
