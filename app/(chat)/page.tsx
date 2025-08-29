// app/(chat)/page.tsx
import { nanoid } from '@/lib/utils'
import ChatLayout from '@/components/chat-layout'
import Chat from '@/components/chat'

export const metadata = {
  title: 'Lumina AI'
}

export default function IndexPage() {
  const chatId = nanoid()
  const missingKeys: string[] = [] // keep empty for baseline; populate from getMissingKeys later

  return (
    <ChatLayout>
      <div className="h-[calc(100vh_-_4rem)]">
        <Chat id={chatId} missingKeys={missingKeys} />
      </div>
    </ChatLayout>
  )
}
