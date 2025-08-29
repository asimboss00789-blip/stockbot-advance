import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage (replace with DB if needed)
let conversations: any[] = []

export async function GET(req: NextRequest) {
  return NextResponse.json(conversations)
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data.id || !data.name) {
      return NextResponse.json({ error: 'Missing id or name' }, { status: 400 })
    }

    const newConversation = {
      id: data.id,
      name: data.name,
      created_at: new Date().toISOString(),
      messages: data.messages || []
    }

    conversations.push(newConversation)
    return NextResponse.json(newConversation)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
