import { useState } from 'react'
import type { Message } from '@/lib/types'
import { sendMessage } from '@/lib/chat/serverAction'
import { nanoid } from '@/lib/utils'

interface ChatProps {
  id: string
  initialMessages?: Message[]
}

export function Chat({ id, initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: [{ type: 'tool_result', result: input }]
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    const response = await sendMessage(input)
    setMessages(prev => [...prev, response])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <div key={msg.id} className="mb-2">
            {msg.content.map((c, idx) => (
              <p key={idx}>{c.result}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  )
}
