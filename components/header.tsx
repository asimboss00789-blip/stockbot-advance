'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconSeparator } from '@/components/ui/icons'

async function UserOrLogin() {
  return (
    <>
      {/* Main Logo linking to homepage */}
      <Link href="/" className="flex items-center space-x-2">
        <span style={{ fontSize: '24px', cursor: 'pointer' }}>👾</span>
        <span style={{ fontSize: '20px', fontWeight: 600 }}>Lumina</span>
        <span style={{ fontSize: '20px', color: '#F55036', fontWeight: 600 }}>AI</span>
      </Link>

      <div className="flex items-center font-semibold ml-6 space-x-4">
        {/* Books Button */}
        <a href="/new" className="text-xl">
          📚
        </a>

        {/* Start New Chat Button */}
        <a
          href="/new"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'ghost' }))}
          style={{ borderRadius: 0, color: '#F55036', padding: '4px' }}
        >
          <span className="flex">Start New Chat</span>
        </a>
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center w-full justify-between">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
