import { notFound } from "next/navigation"
import { getProblemBySlug } from "@/lib/data"
import { WorkspaceLayout } from "@/components/problem-workspace/workspace-layout"
import { WorkspaceHeader } from "@/components/problem-workspace/workspace-header"
import { ProblemMeta } from "@/components/problem-workspace/problem-meta"
import { ContentTabs } from "@/components/problem-workspace/content-tabs"
import { AiSidebar } from "@/components/problem-workspace/ai-sidebar"
import { Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const problem = getProblemBySlug(resolvedParams.slug)

  if (!problem) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 min-w-0">
        <WorkspaceLayout
          sidebar={<AiSidebar problem={problem} />}
          mainContent={
            <div className="max-w-4xl pb-20">
              <WorkspaceHeader problem={problem} />
              <ProblemMeta problem={problem} />
              <ContentTabs problem={problem} />
            </div>
          }
        />
      </main>

      {/* ── Mobile AI Trigger (Bottom right floating FAB) ── */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Sheet>
          <SheetTrigger
            render={
              <button
                className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2 focus:ring-offset-background"
                aria-label="Open AI Assistant"
              />
            }
          >
            <Sparkles className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl border-t border-border overflow-hidden">
            <AiSidebar problem={problem} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
