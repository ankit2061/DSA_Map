import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTrackerStore } from "@/lib/store"
import type { UserProgress } from "@/lib/types"

export function useSyncSupabase() {
  const supabase = createClient()
  const hydrateProgress = useTrackerStore((state) => state.hydrateProgress)
  const isHydratedRef = useRef(false)
  
  // Track last sync time to avoid infinite loops and know what to push
  const lastSyncTimeRef = useRef(Date.now())
  const [userId, setUserId] = useState<string | null>(null)

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null)
    })
    
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // 2. Fetch Initial State from Supabase when user logs in
  useEffect(() => {
    if (!userId) return

    async function fetchServerProgress() {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
      
      if (error || !data) {
        console.error("Failed to fetch progress from Supabase", error)
        return
      }

      // Convert DB rows back to UserProgress records
      const serverProgress: Record<string, UserProgress> = {}
      for (const row of data) {
        serverProgress[row.problem_id] = {
          status: row.status as any,
          notes: row.notes || "",
          favorite: row.favorite,
          confidence: row.confidence as any,
          revisitLater: row.revisit_later,
          lastReviewed: row.last_reviewed,
          mistakes: row.mistakes || "",
          lastUpdated: row.last_updated || 0,
        }
      }

      hydrateProgress(serverProgress)
      
      // Initially, let's sync up if the local states are newer than the server
      // We set lastSyncTimeRef a bit in the past so the subscription will pick up local items that are strictly newer.
      // But actually, we don't need to do anything here because the subscription will handle it.
      isHydratedRef.current = true
    }

    fetchServerProgress()
  }, [userId, supabase, hydrateProgress])

  // 3. Subscribe to Zustand store changes and Push to Supabase optionally
  useEffect(() => {
    if (!userId) return

    // Debounce the sync to avoid API spam if many rapid clicks happen
    let syncTimeout: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = useTrackerStore.subscribe((state) => {
      // Don't trigger saves until initial fetch is complete
      if (!isHydratedRef.current) return

      if (syncTimeout) clearTimeout(syncTimeout)

      syncTimeout = setTimeout(async () => {
        const { progress } = state
        const itemsToSync = []
        let newestUpdate = lastSyncTimeRef.current

        // Find items that have been updated locally since our last Sync
        for (const [problemId, userProgress] of Object.entries(progress)) {
          if (userProgress.lastUpdated > lastSyncTimeRef.current) {
            itemsToSync.push({
              user_id: userId,
              problem_id: problemId,
              status: userProgress.status,
              notes: userProgress.notes || null,
              favorite: userProgress.favorite ?? false,
              confidence: userProgress.confidence || null,
              revisit_later: userProgress.revisitLater ?? false,
              last_reviewed: userProgress.lastReviewed || null,
              mistakes: userProgress.mistakes || null,
              last_updated: userProgress.lastUpdated,
            })
            if (userProgress.lastUpdated > newestUpdate) {
              newestUpdate = userProgress.lastUpdated
            }
          }
        }

        if (itemsToSync.length > 0) {
          // Send upsert to Supabase
          const { error } = await supabase
            .from("user_progress")
            .upsert(itemsToSync, { onConflict: "user_id,problem_id" })

          if (!error) {
            // Update last sync time so we don't resend
            lastSyncTimeRef.current = newestUpdate
          } else {
            console.error("Failed to sync to Supabase", error)
          }
        }
      }, 1500) // 1.5s debounce
    })

    return () => {
      unsubscribe()
      if (syncTimeout) clearTimeout(syncTimeout)
    }
  }, [userId, supabase])
}
