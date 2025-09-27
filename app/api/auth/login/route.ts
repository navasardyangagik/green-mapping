import { type NextRequest, NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/users"
import { verifyPassword, generateToken, validateEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Find user
    const user = await findUserByEmail(email.toLowerCase())
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken({
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
    })

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id!.toString(),
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
