'use server'

import { nanoid } from '@/lib/utils'
import { Message } from '@/lib/types'
import { AIState } from './actions'

// Example type for a mutable AI state
interface MutableAIState {
  get: () => AIState
  update: (newState: Partial<AIState>) => void
  done: (newState: AIState) => void
}

/**
 * Submit a user message to the AI.
 */
export async function submitUserMessage(content: string, aiState: MutableAIState) {
  // Update AI state immediately
  const current = aiState.get()
  const message: Message = {
    id: nanoid(),
    role: 'user',
    content
  }

  aiState.update({
    messages: [...current.messages, message]
  })

  // You can call your AI model / API here to get the response
  // For example:
  // const aiResponse = await generateAIResponse(content)
  // aiState.update({ messages: [...current.messages, message, aiResponse] })
  // aiState.done({ messages: [...current.messages, message, aiResponse] })

  return message
}

/**
 * Save a conversation to your database or storage.
 */
export async function saveConversation(chatId: string, messages: Message[]) {
  // Implement your storage logic here (database, file, etc.)
  console.log(`Saving conversation ${chatId}`, messages)
}

/**
 * Load a conversation from storage
 */
export async function loadConversation(chatId: string): Promise<Message[]> {
  // Replace with actual storage retrieval
  console.log(`Loading conversation ${chatId}`)
  return []
}

/**
 * Delete a conversation from storage
 */
export async function deleteConversation(chatId: string) {
  // Implement delete logic here
  console.log(`Deleting conversation ${chatId}`)
}

/**
 * Additional helper server actions can be added here,
 * like fetching stock data, news, or other AI tools
 */
