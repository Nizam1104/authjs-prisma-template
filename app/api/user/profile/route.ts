import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-client"

export async function GET(request: NextRequest) {
  const session = await auth()
  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: session?.user.id
  //   }
  // })
  return NextResponse.json(session)
}
