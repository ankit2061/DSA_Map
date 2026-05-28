import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { AppShell } from "@/components/layout/app-shell"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "DSA Map — LeetCode Problem Tracker",
  description:
    "Track your DSA progress, take notes, and master coding interviews with a clean, focused problem tracker.",
  keywords: ["DSA", "LeetCode", "Problem Tracker", "Interview Prep", "Coding"],
  authors: [{ name: "DSA Map" }],
  creator: "DSA Map",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dsa-map.vercel.app",
    title: "DSA Map — LeetCode Problem Tracker",
    description:
      "Track your DSA progress, take notes, and master coding interviews with a clean, focused problem tracker.",
    siteName: "DSA Map",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Map — LeetCode Problem Tracker",
    description:
      "Track your DSA progress, take notes, and master coding interviews with a clean, focused problem tracker.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
