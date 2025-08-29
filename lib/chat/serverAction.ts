'use server'

import { getMutableAIState, createAI } from 'ai/rsc'
import { AIState } from '@/lib/types'

/**
 * Submit a user message to AI and update the state.
 */
export async function submitUserMessage(content: string) {
  const aiState = getMutableAIState<typeof AIState>()

  // Update AI state with the new user message
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      { id: crypto.randomUUID(), role: 'user', content }
    ]
  })

  // Generate AI response (dummy for now, replace with real AI call)
  const aiResponse = `AI Reply to: ${content}`

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      { id: crypto.randomUUID(), role: 'assistant', content: aiResponse }
    ]
  })

  return aiResponse
}
