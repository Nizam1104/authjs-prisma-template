import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

import {prisma} from "@/lib/prisma-client"

import { getSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const session = await auth()

  const supabase = await getSupabaseClient()
  const { data, error } = await supabase.from('users').select('*').eq('id', session?.user.id)
  console.log(data, error)
  return NextResponse.json(session)
}
