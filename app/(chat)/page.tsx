import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '@/app/actions'

export const metadata = {
  title: 'EternalStar StockBot'
}

export default async function IndexPage() {
  const id = nanoid()
  const missingKeys = await getMissingKeys()

  return (
    <AI
      initialAIState={{
        chatId: id,
        messages: [
          {
            id: nanoid(),     // Unique ID required for TypeScript
            role: 'system',   // System message
            type: 'system',   // Some templates require this field
            content: `
You are EternalStar, a friendly AI assistant. 
Answer general questions in English.
If the user asks about a stock symbol or company, provide the stock name, symbol, and current price in readable format.
Respond naturally and conversationally.
            `
          }
        ]
      }}
    >
      <Chat id={id} missingKeys={missingKeys} />
    </AI>
  )
}
