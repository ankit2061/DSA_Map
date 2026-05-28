import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useUser() {
  const [userName, setUserName] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // If logged in, use their metadata name or default to Ankit
        setUserName(session.user.user_metadata?.name || "Ankit")
      } else {
        setUserName(null)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.name || "Ankit")
      } else {
        setUserName(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return userName
}