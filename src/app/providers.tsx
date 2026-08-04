'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode, useState, useEffect, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PageLoader } from '@/components/PageLoader'
import { usePathname } from 'next/navigation'

function RouteChangeHandler() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Tampilkan transisi dissolve loader saat terjadi perpindahan halaman/route
    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 350)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {isNavigating && <PageLoader key={pathname} />}
    </AnimatePresence>
  )
}

function AppInitialLoader({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Hilangkan loader secara dissolve setelah web selesai memuat initial state
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {isInitialLoading && <PageLoader key="initial-app-loader" />}
      </AnimatePresence>
      {children}
    </>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppInitialLoader>
        <Suspense fallback={null}>
          <RouteChangeHandler />
        </Suspense>
        {children}
      </AppInitialLoader>
    </NextThemesProvider>
  )
}
