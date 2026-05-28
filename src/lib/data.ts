import type { Problem } from "./types"
import rawProblems from "../../dataset.json"

export const allProblems: Problem[] = rawProblems as Problem[]

export function getAllTopics(): string[] {
  const seen = new Set<string>()
  for (const p of allProblems) seen.add(p.topic)
  return Array.from(seen).sort()
}

export function getProblemById(id: number): Problem | undefined {
  return allProblems.find((p) => p.id === id)
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return allProblems.find((p) => p.slug === slug)
}

/**
 * Returns the prev/next problem slugs based purely on dataset order for the MVP.
 */
export function getAdjacentProblems(slug: string): {
  prevSlug: string | null
  nextSlug: string | null
} {
  const idx = allProblems.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prevSlug: null, nextSlug: null }

  return {
    prevSlug: idx > 0 ? allProblems[idx - 1].slug : null,
    nextSlug: idx < allProblems.length - 1 ? allProblems[idx + 1].slug : null,
  }
}
