import { useCallback, useEffect, useRef, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

// ─── Simulated AI responses (MVP) ─────────────────────────────────────────────
// Future: replace `generateSimulatedResponse` with a real API call
// (Gemini, OpenAI, etc.) — zero changes needed in any component.

const QUICK_PROMPTS = [
  "Explain the optimal approach",
  "Give me a hint",
  "What's the time complexity?",
  "Walk through an example",
]

function generateSimulatedResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes("time") || q.includes("complex") || q.includes("big o")) {
    return "**Time & Space Complexity**\n\nDepends on your approach:\n- **Brute force** — O(n²) time, O(1) space\n- **Hash map (optimal)** — O(n) time, O(n) space\n\nFor most array/string problems the trade-off is space for time. The hash map approach is almost always the intended solution at this difficulty."
  }

  if (q.includes("hint")) {
    return "**Hint 💡**\n\nAsk yourself: what information do I need to remember as I iterate? Is there a data structure that lets me answer a membership question in O(1)?\n\nTry not to jump straight to code — write the invariant you want to maintain at each step first."
  }

  if (
    q.includes("approach") ||
    q.includes("explain") ||
    q.includes("optimal") ||
    q.includes("solve")
  ) {
    return "**Optimal Approach**\n\n1. Identify the key operation that is repeated (e.g. lookup, comparison)\n2. Choose a data structure that makes that operation O(1) — usually a hash map or hash set\n3. Iterate once, maintaining state as you go\n4. Return the result when the condition is met\n\nThis pattern covers the majority of Easy-Medium problems. Complexity: **O(n) time, O(n) space**."
  }

  if (q.includes("example") || q.includes("walk") || q.includes("trace")) {
    return "**Example Walkthrough**\n\nLet's trace through a concrete input step by step:\n\n```\nInput: nums = [2, 7, 11, 15], target = 9\n\ni=0: val=2, looking for 7 → not seen yet → store {2:0}\ni=1: val=7, looking for 2 → found at index 0 → return [0, 1]\n```\n\nOutput: `[0, 1]` ✓\n\nThe key insight: check the complement *before* inserting the current value."
  }

  return "Great question! The best way to approach this is to start with the brute-force solution and identify its bottleneck — that bottleneck usually points directly to the optimal data structure or algorithm. What specific part of the problem is tripping you up?"
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAiChat — portable, context-aware chat hook.
 *
 * Designed to be used in:
 *  a) The collapsible AI section inside ProblemDrawer (current MVP)
 *  b) A future dedicated /ai page — import this hook there with no changes
 *
 * The only coupling to the drawer is `problemId`, which provides context.
 * To wire a real LLM: replace the `await simulate(...)` block with a fetch
 * to your API route, streaming or batch — the interface stays the same.
 */
export function useAiChat(problemId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<boolean>(false)

  const clearChat = useCallback(() => {
    abortRef.current = true
    setMessages([])
    setIsLoading(false)
  }, [])

  // Reset when the selected problem changes
  useEffect(() => {
    // Reset state without calling clearChat to avoid setState warnings
    abortRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([])
    setIsLoading(false)
    
    return () => {
      abortRef.current = false
    }
  }, [problemId])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      abortRef.current = false

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      // Simulated latency — swap for real API call here
      const delay = 700 + Math.random() * 700
      await new Promise((r) => setTimeout(r, delay))

      if (abortRef.current) return // Problem changed mid-request

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: generateSimulatedResponse(text),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsLoading(false)
    },
    [isLoading]
  )

  return {
    messages,
    sendMessage,
    isLoading,
    clearChat,
    quickPrompts: QUICK_PROMPTS,
  }
}
