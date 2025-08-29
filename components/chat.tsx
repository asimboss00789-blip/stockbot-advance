'use client'

import * as React from 'react'
import { useState } from 'react'
import { ChatPanel } from './chat-panel'
import type { Message } from '@/lib/types'

interface ChatProps {
  id: string
  missingKeys: string[]
  initialMessages?: Message[]
}

export function Chat({ id, missingKeys, initialMessages = [] }: ChatProps) {
  const [input, setInput] = useState('')
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scrollToBottom = () => {
    setIsAtBottom(true)
  }

  return (
    <ChatPanel
      id={id}
      input={input}
      setInput={setInput}
      isAtBottom={isAtBottom}
      scrollToBottom={scrollToBottom}
    />
  )
}
