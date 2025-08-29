// app/api/conversations/[id]/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Same in-memory storage as in conversations/route.ts
const conversations: { [user: string]: Array<{ id: string; name: string; created_at: string }> } = {}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = cookies().get("user")?.value
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const convo = conversations[user]?.find((c) => c.id === params.id)
  if (!convo) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(convo)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = cookies().get("user")?.value
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  conversations[user] = conversations[user]?.filter((c) => c.id !== params.id) || []
  return NextResponse.json({ success: true })
}
