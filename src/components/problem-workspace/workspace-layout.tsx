"use client"

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode
  mainContent: React.ReactNode
}

/**
 * WorkspaceLayout
 * 
 * Desktop (lg+): CSS Grid with a 300px min / 32% max sticky left sidebar, and 1fr main content.
 * Mobile (<lg): The main content takes full width. The sidebar is rendered, but it's expected
 * to handle its own mobile presentation (e.g., rendering as a Sheet trigger).
 */
export function WorkspaceLayout({ sidebar, mainContent }: WorkspaceLayoutProps) {
  return (
    <div className="w-full max-w-[1600px] mx-auto min-h-[calc(100vh-var(--header-height))]">
      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(300px,32%)_1fr] lg:items-start h-full">
        
        {/* AI Sidebar Area */}
        <div className="lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))] lg:border-r lg:border-border lg:overflow-y-auto scrollbar-none bg-muted/10">
          {sidebar}
        </div>

        {/* Main Content Area */}
        <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {mainContent}
        </div>

      </div>
    </div>
  )
}
