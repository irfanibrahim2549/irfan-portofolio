'use client'

import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-main)]/95 backdrop-blur-xl pointer-events-auto"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Profile Photo Avatar with Glowing Spinner Ring */}
        <div className="relative flex items-center justify-center">
          {/* Animated Blue Outer Ring */}
          <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
          
          {/* User Profile Photo Center */}
          <div className="absolute w-12 h-12 rounded-full overflow-hidden border border-blue-500/30 shadow-md shadow-blue-500/20">
            <img
              src="/profile.jpg"
              alt="Loading..."
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Loading status */}
        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 animate-pulse">
          Loading...
        </p>
      </div>
    </motion.div>
  )
}
