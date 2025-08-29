import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { PromptForm } from './prompt-form'
import { ButtonScrollToBottom } from './button-scroll-to-bottom'
import { UserMessage } from './stocks/message'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({ input, setInput, isAtBottom, scrollToBottom }: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  const exampleMessages = [
    { heading: 'What is the price', subheading: 'of Apple Inc.?', message: 'What is the price of Apple stock?' },
    { heading: 'Show me a stock chart', subheading: 'for $GOOGL', message: 'Show me a stock chart for $GOOGL' },
    { heading: 'What are some recent', subheading: `events about Amazon?`, message: `What are some recent events about Amazon?` }
  ]

  const [randExamples, setRandExamples] = useState(exampleMessages)

  useEffect(() => {
    const shuffledExamples = [...exampleMessages].sort(() => 0.5 - Math.random())
    setRandExamples(shuffledExamples)
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 to-muted/30 duration-300 ease-in-out animate-in dark:from-background/10 dark:to-background/80">
      <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            randExamples.map((example) => (
              <div key={example.heading} className="cursor-pointer border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    { id: nanoid(), display: <UserMessage>{example.message}</UserMessage> }
                  ])
                  const responseMessage = await submitUserMessage(example.message)
                  setMessages((currentMessages) => [...currentMessages, responseMessage])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">{example.subheading}</div>
              </div>
            ))}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  )
