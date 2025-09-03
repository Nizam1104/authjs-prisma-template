
import { prisma } from "@/lib/prisma-client"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import jwt from 'jsonwebtoken'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      
      session.accessToken = token.accessToken
      session.sub = token.sub
      session.user.id = token.sub
      
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret && token.sub) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub, // Use token.sub instead of user.id
          email: session.user?.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      
      return session
    },
  },
  pages: {
    error: 'api/auth/error',
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development',
});
