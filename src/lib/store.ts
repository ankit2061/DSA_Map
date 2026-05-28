import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { TrackerState, FilterState } from "./types"

// ─── Persisted: user progress ─────────────────────────────────────────────────

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set) => ({
      progress: {},

      updateStatus: (id, status) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [id]: {
              ...(state.progress[id] ?? { lastUpdated: 0 }),
              status,
              lastUpdated: Date.now(),
            },
          },
        })),

      saveNotes: (id, notes) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [id]: {
              ...(state.progress[id] ?? { lastUpdated: 0 }),
              notes,
              lastUpdated: Date.now(),
            },
          },
        })),

      toggleFavorite: (id) =>
        set((state) => {
          const current = state.progress[id]
          return {
            progress: {
              ...state.progress,
              [id]: {
                ...(current ?? { lastUpdated: 0 }),
                favorite: !(current?.favorite ?? false),
                lastUpdated: Date.now(),
              },
            },
          }
        }),

      updateRevision: (id, data) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [id]: {
              ...(state.progress[id] ?? { lastUpdated: 0 }),
              ...data,
              lastUpdated: Date.now(),
            },
          },
        })),

      hydrateProgress: (serverProgress) =>
        set((state) => {
          // Merge server progress with local state, keeping the most recently updated versions
          const newProgress = { ...state.progress }
          
          for (const [id, serverItem] of Object.entries(serverProgress)) {
            const localItem = newProgress[id]
            if (!localItem || serverItem.lastUpdated > localItem.lastUpdated) {
              newProgress[id] = serverItem
            }
          }
          
          return { progress: newProgress }
        }),
    }),
    { name: "dsa-tracker-storage" }
  )
)

// ─── Non-persisted: filter + UI state ────────────────────────────────────────

export const useFilterStore = create<FilterState>()((set) => ({
  search: "",
  topic: "",
  difficulty: "All",
  status: "All",
  showFavoritesOnly: false,
  page: 1,
  pageSize: 25,

  setSearch: (search) => set({ search, page: 1 }),
  setTopic: (topic) => set({ topic, showFavoritesOnly: false, page: 1 }),
  setDifficulty: (difficulty) => set({ difficulty, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setShowFavoritesOnly: (showFavoritesOnly) => set({ showFavoritesOnly, topic: "", page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({ search: "", topic: "", difficulty: "All", status: "All", showFavoritesOnly: false, page: 1 }),
}))
