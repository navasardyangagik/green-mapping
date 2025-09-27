import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/users"
import { hashPassword, generateToken, validateEmail, validatePassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ message: passwordValidation.message }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    // Generate token
    const token = generateToken({
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
    })

    return NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          id: user._id!.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    // Handle duplicate key error (email already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
