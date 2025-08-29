'use server'

import { getMutableAIState } from './state'
import { AI } from './actions'

// Server-side function to submit a user message
export async function submitUserMessage(content: string) {
  const aiState = getMutableAIState<typeof AI>()
  
  // You can keep your existing logic here
  aiState.messages.push({
    id: crypto.randomUUID(),
    role: 'user',
    content,
  })

  // Example: simulate AI response
  const aiResponse = await AI.generate(content)
  aiState.messages.push({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: aiResponse,
  })

  return aiResponse
}
