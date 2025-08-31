import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use service role key for admin operations
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          console.log('here')
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Generate user_id - prefer auth.uid if available, otherwise generate custom ID
            const userId = account.providerAccountId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            
            // Create new user with custom user_id
            const newUser = await prisma.user.create({
              data: {
                id: user.id || `${Date.now()}`, // NextAuth generated ID
                name: user.name || '',
                email: user.email!,
                user_id: userId, // This will be used for RLS
                image: user.image || '',
                dpUrl: user.image || null,
              }
            })

            // Set RLS context for this user in Supabase
            await supabase.rpc('set_session_user_id', { user_id: userId })
            
            console.log('Created new user:', newUser.user_id)
          } else {
            // Set RLS context for existing user
            await supabase.rpc('set_session_user_id', { user_id: existingUser.user_id })
          }
        } catch (error) {
          console.error("Error creating/finding user:", error)
          return false
        }
      }
      return true
    },

    // async session({ session, user, token }) {
    //   if (session?.user?.email) {
    //     const dbUser = await prisma.user.findUnique({
    //       where: { email: session.user.email },
    //       select: {
    //         id: true,
    //         user_id: true,
    //         name: true,
    //         email: true,
    //         image: true,
    //         dpUrl: true
    //       }
    //     })
        
    //     if (dbUser) {
    //       session.user.id = dbUser.id
    //       session.user.user_id = dbUser.user_id
    //       session.user.name = dbUser.name
    //       session.user.image = dbUser.image || dbUser.dpUrl
          
    //       // Set RLS context in Supabase for this session
    //       await supabase.rpc('set_session_user_id', { user_id: dbUser.user_id })
    //     }
    //   }
    //   return session
    // },

    // async jwt({ token, user, account }) {
    //   // Persist user_id in JWT token
    //   if (user && account) {
    //     const dbUser = await prisma.user.findUnique({
    //       where: { email: user.email! }
    //     })
    //     if (dbUser) {
    //       token.user_id = dbUser.user_id
    //       token.id = dbUser.id
    //     }
    //   }
    //   return token
    // }
  },
  pages: {
    signIn: "/auth/signin",
  },
//   session: {
//     strategy: "database",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   events: {
//     async signIn({ user, account, profile }) {
//       console.log(`User ${user.email} signed in with ${account?.provider}`)
//     },
//     async signOut({ session, token }) {
//       console.log('User signed out')
//     }
//   }
})
