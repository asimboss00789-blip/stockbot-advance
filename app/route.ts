import { NextResponse } from "next/server"

const USER = {
  email: "test@example.com",
  password: "password123"
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (email === USER.email && password === USER.password) {
      return NextResponse.json({ success: true, message: "Login successful" })
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    )
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    )
  }
}
