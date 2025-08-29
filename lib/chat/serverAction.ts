'use server'

import { nanoid } from '@/lib/utils'
import type { Message } from '@/lib/types'

export async function sendMessage(content: string): Promise<Message> {
  // Return a tool_result message matching the expected type
  return {
    id: nanoid(),
    role: 'tool',
    content: [
      {
        type: 'tool_result',
        result: content
      }
    ]
  }
}
