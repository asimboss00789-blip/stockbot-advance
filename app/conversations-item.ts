import { NextRequest, NextResponse } from 'next/server'

// Reuse the same in-memory storage
let conversations: any[] = []

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const conversation = conversations.find((c) => c.id === id)
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(conversation)
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  conversations = conversations.filter((c) => c.id !== id)
  return NextResponse.json({ success: true })
}
