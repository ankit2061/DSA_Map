import { useEffect, useState } from "react"

/**
 * useMediaQuery — SSR-safe media query hook.
 *
 * Initialises to `false` on the server so the initial render matches
 * the server-rendered HTML. After hydration the correct value is applied.
 * Since the Sheet only opens after user interaction (always post-hydration),
 * there is no visible flash.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    
    // Set initial value only if different from current state
    if (media.matches !== matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(media.matches)
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return matches
}
