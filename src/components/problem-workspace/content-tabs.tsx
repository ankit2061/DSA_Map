"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionTab } from "./tabs/question-tab"
import { SolutionTab } from "./tabs/solution-tab"
import { NotesTab } from "./tabs/notes-tab"
import { RevisionTab } from "./tabs/revision-tab"
import type { Problem } from "@/lib/types"

interface ContentTabsProps {
  problem: Problem
}

export function ContentTabs({ problem }: ContentTabsProps) {
  return (
    <Tabs defaultValue="question" className="w-full">
      <TabsList className="w-full flex justify-start h-12 bg-transparent border-b border-border rounded-none p-0 space-x-6 overflow-x-auto scrollbar-none">
        <TabsTrigger
          value="question"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 text-[14px] font-medium text-muted-foreground data-[state=active]:text-foreground"
        >
          Question
        </TabsTrigger>
        <TabsTrigger
          value="solution"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 text-[14px] font-medium text-muted-foreground data-[state=active]:text-foreground"
        >
          Solution
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 text-[14px] font-medium text-muted-foreground data-[state=active]:text-foreground"
        >
          My Notes
        </TabsTrigger>
        <TabsTrigger
          value="revision"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 pt-2 text-[14px] font-medium text-muted-foreground data-[state=active]:text-foreground"
        >
          Revision
        </TabsTrigger>
      </TabsList>

      <div className="pt-6 pb-12">
        <TabsContent value="question" className="mt-0 outline-none">
          <QuestionTab problem={problem} />
        </TabsContent>
        
        <TabsContent value="solution" className="mt-0 outline-none">
          <SolutionTab problem={problem} />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0 outline-none">
          <NotesTab problemId={String(problem.id)} />
        </TabsContent>
        
        <TabsContent value="revision" className="mt-0 outline-none">
          <RevisionTab problemId={String(problem.id)} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
