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
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}
