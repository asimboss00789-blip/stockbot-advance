import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import ChatLayout from '@/components/chat-layout'

export default function IndexPage() {
  const chatId = nanoid()

  return (
    <ChatLayout>
      <Chat
        id={chatId}
        missingKeys={[]} // put your missingKeys logic if needed
      />
    </ChatLayout>
  )
}
