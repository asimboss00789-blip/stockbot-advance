'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconSeparator } from '@/components/ui/icons'

async function UserOrLogin() {
  return (
    <>
      {/* Emoji Logo linking to homepage */}
      <Link href="/">
        <span style={{ fontSize: '24px', cursor: 'pointer' }}>👾</span>
      </Link>

      <div className="flex items-center font-semibold ml-4 space-x-2">
        {/* Lumina AI Name */}
        <span style={{ fontSize: '20px' }}>Lumina</span>
        <span style={{ fontSize: '20px', color: '#F55036' }}>AI</span>

        <IconSeparator className="size-6 text-muted-foreground/50" />
        <a href="/new">📚</a>
        <IconSeparator className="size-6 text-muted-foreground/50" />

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
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
