import { NextRequest, NextResponse } from "next/server";

interface User {
  username: string;
  password: string;
}

// Simple in-memory storage (replace with DB in production)
const users: User[] = [];

export async function POST(req: NextRequest) {
  const { username, password, action } = await req.json();

  if (!username || !password || !action) {
    return NextResponse.json(
      { error: "Missing username, password, or action" },
      { status: 400 }
    );
  }

  if (action === "signup") {
    if (users.find((u) => u.username === username)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    users.push({ username, password });
    return NextResponse.json({ success: true, username });
  }

  if (action === "login") {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    return NextResponse.json({ success: true, username });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
