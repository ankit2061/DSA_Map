"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSyncSupabase } from "@/lib/hooks/use-sync-supabase"

interface AppShellProps {
  children: React.ReactNode
}

/**
 * AppShell — root layout wrapper.
 *
 * Desktop (lg+):  Fixed 240px sidebar | scrollable main area
 * Mobile (<lg):   No sidebar by default; hamburger opens it as a left Sheet
 *
 * The sidebar Sheet and the problem-detail Sheet (right/bottom) are
 * mutually exclusive — opening one never stacks over the other.
 */
export function AppShell({ children }: AppShellProps) {
  useSyncSupabase()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar — always visible ───────────────────── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-[var(--sidebar-width)] border-r border-border bg-sidebar">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar — Sheet overlay from left ────────────── */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[var(--sidebar-width)] sm:max-w-[var(--sidebar-width)] p-0 bg-sidebar border-r border-border gap-0"
        >
          <Sidebar onNavClick={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* ── Main column ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-[var(--sidebar-width)]">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
