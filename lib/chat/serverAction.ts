// lib/chat/serverAction.ts
'use server'

import { nanoid } from '@/lib/utils'

// Temporary sendMessage stub — safe for the new Chat component
export async function sendMessage(message: string) {
  // Normally: call AI / database / API here
  return {
    id: nanoid(),
    role: 'assistant' as const,
    text: `You sent: "${message}". (AI not yet integrated in baseline)`
  }
}
