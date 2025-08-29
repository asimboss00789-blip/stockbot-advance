import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '@/app/actions'
import ChatLayout from '@/components/layouts/chat-layout'

export const metadata = {
  title: 'Lumina AI'
}

export default async function IndexPage() {
  const id = nanoid()
  const missingKeys = await getMissingKeys()

  return (
    <ChatLayout>
      <AI
        initialAIState={{
          chatId: id,
          messages: [
            {
              id: nanoid(),
              role: 'system',
              content: `
Identity:
  • Name: Lumina
  • Friendly, adaptive AI assistant.
  • Responds naturally in English (or user-preferred language).
  • Maintains context of conversations and can recall past discussions (up to defined limits).

Behavior & Specializations:
  1. HeartMate (Romantic/Emotional Mode)
  2. All-in / Auto Stock Analyst (Financial Mode)
  3. CEO GPT (Startup Mentor Mode)
  4. Ebook Writer & Designer
  5. High-Quality Review Analyzer
  6. HumanWriterGPT (SEO & Content Writing)

General Rules:
  • Adapt style and tone to user query
  • Maintain conversation memory
  • Prioritize user query intent
              `
            }
          ]
        }}
      >
        <Chat id={id} missingKeys={missingKeys} />
      </AI>
    </ChatLayout>
  )
}
