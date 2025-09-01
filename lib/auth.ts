// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import { SupabaseAdapter } from "@auth/supabase-adapter"
// import jwt from "jsonwebtoken"

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: SupabaseAdapter({
//     url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
//   }),
//   session: {
//      strategy: "jwt"
//   },
// providers: [
//   GoogleProvider({
//     clientId: process.env.GOOGLE_CLIENT_ID || '',
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//   }),
// ],
// secret: process.env.AUTH_SECRET,
// callbacks: {
//   async session({ session, user }) {
//     const signingSecret = process.env.SUPABASE_JWT_SECRET
//     if (signingSecret) {
//       const payload = {
//         aud: "authenticated",
//         exp: Math.floor(new Date(session.expires).getTime() / 1000),
//         sub: user.id,
//         email: user.email,
//         role: "authenticated",
//       }
//       session.supabaseAccessToken = jwt.sign(payload, signingSecret)
//     }
//     return session
//   },
// },
// });


import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "", // Use service role key, not anon key
  }),
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
      // Persist the OAuth access_token and user id to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Create Supabase JWT token
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
      // Send properties to the client
      session.accessToken = token.accessToken
      session.user.id = token.sub
      return session
    },
  },
  pages: {
    error: '/auth/error', // Custom error page (optional)
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
});
