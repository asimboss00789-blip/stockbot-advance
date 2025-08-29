'use server'

import { getMutableAIState } from '@/lib/chat/state' // adjust according to your state
import { AI } from './actions' // import AI type if needed

// Submit user message
export async function submitUserMessage(content: string) {
  const aiState = getMutableAIState<typeof AI>()
  aiState.messages.push({
    id: crypto.randomUUID(),
    role: 'user',
    content
  })

  // Process AI response here (dummy example)
  const aiResponse = `AI Response to: ${content}`
  aiState.messages.push({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: aiResponse
  })

  return aiResponse
}

// Fetch AI messages for a chat
export async function fetchChatMessages(chatId: string) {
  const aiState = getMutableAIState<typeof AI>()
  return aiState.messages.filter(msg => msg.chatId === chatId)
}
