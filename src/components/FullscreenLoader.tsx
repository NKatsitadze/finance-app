'use client'

import { ReactNode } from 'react'

export default function FullscreenLoader({ message }: { message?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin"
        style={{ borderTopColor: '#3F82B2' }}></div>
        {message && <p className="text-grey-600 text-lg font-medium">{message}</p>}
    </div>
  )
}
