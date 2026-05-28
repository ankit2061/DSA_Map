// ─── Primitive types ──────────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard" | "Unknown"

/** Four status states — maps to the four toggle buttons */
export type Status = "not_started" | "in_progress" | "solved" | "revisit"

export type Confidence = "low" | "medium" | "high" | null

// ─── Domain model ─────────────────────────────────────────────────────────────

/** Shape of each problem as stored in dataset.json */
export interface Problem {
  id: number
  title: string
  slug: string
  topic: string
  difficulty: Difficulty
  questionSummary: string
  solutionSummary: string
  sourcePage: number
  /** Default status from JSON — overridden by UserProgress in the store */
  status: Status
  /** Default favourite flag from JSON — overridden by UserProgress */
  favorite: boolean
  notes: string
}

// ─── Persisted store (user progress) ─────────────────────────────────────────

/** Sparse overrides saved per problem in localStorage */
export interface UserProgress {
  status?: Status
  favorite?: boolean
  notes?: string
  confidence?: Confidence
  revisitLater?: boolean
  lastReviewed?: number
  mistakes?: string
  lastUpdated: number
}

export interface TrackerState {
  progress: Record<string, UserProgress>
  updateStatus: (id: string, status: Status) => void
  saveNotes: (id: string, notes: string) => void
  toggleFavorite: (id: string) => void
  updateRevision: (
    id: string,
    data: {
      confidence?: Confidence
      revisitLater?: boolean
      lastReviewed?: number
      mistakes?: string
    }
  ) => void
}

// ─── In-memory filter/UI store ────────────────────────────────────────────────

export interface FilterState {
  search: string
  /** Empty string = "All topics" */
  topic: string
  difficulty: Difficulty | "All"
  status: Status | "All"
  showFavoritesOnly: boolean
  page: number
  /** Default 25, kept constant for MVP */
  readonly pageSize: 25

  setSearch: (s: string) => void
  setTopic: (t: string) => void
  setDifficulty: (d: Difficulty | "All") => void
  setStatus: (s: Status | "All") => void
  setShowFavoritesOnly: (v: boolean) => void
  setPage: (p: number) => void
  resetFilters: () => void
}
