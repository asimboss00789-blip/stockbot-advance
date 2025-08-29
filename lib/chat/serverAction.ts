'use server'

import { getMutableAIState } from 'ai/rsc'
import { AIState } from './types' // if you have types defined
import { nanoid } from '@/lib/utils'

// Example: submit a user message
export async function submitUserMessage(content: string) {
  const aiState = getMutableAIState<AIState>()

  const newMessage = {
    id: nanoid(),
    role: 'user',
    content
  }

  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, newMessage]
  })

  // Here you can trigger AI response generation if needed
  // e.g., await generateAIResponse(aiState)
  return newMessage
}

// Example: a server-side function to fetch AI data
export async function generateAIResponse(aiState: any) {
  // logic to call AI model / Groq / Hugging Face
  const responseMessage = {
    id: nanoid(),
    role: 'assistant',
    content: 'AI generated content here'
  }

  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, responseMessage]
  })

  return responseMessage
}
