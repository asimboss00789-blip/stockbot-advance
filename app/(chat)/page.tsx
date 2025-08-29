'use client'

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat-panel' // if ChatPanel is exported as Chat
import { ChatLayout } from '@/components/chat-layout'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '@/app/actions'

export const metadata = {
  title: 'Lumina StockBot Chat'
}

export default function ChatPage() {
  const chatId = nanoid()
  const missingKeys: string[] = getMissingKeys() || []

  // Initial messages (tool role type)
  const initialMessages: AI['messages'] = [
    {
      id: nanoid(),
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: 'identity-001',
          toolName: 'identity',
          result: `
Identity:
  • Name: Lumina
  • Friendly, adaptive AI assistant.
  • Responds naturally in English (or user-preferred language).
  • Maintains context of conversations and can recall past discussions (up to defined limits).

Behavior & Specialization:
  • Financial assistant for stocks, markets, charts, and news.
  • Provides information by calling functions; does not make up data.
  • Always responds in a helpful, safe, and concise manner.
`
        }
      ]
    }
  ]

  return (
    <ChatLayout chatId={chatId} missingKeys={missingKeys}>
      <AI
        initialAIState={{
          chatId,
          messages: initialMessages
        }}
      >
        <Chat id={chatId} missingKeys={missingKeys} />
      </AI>
    </ChatLayout>
  )
}
