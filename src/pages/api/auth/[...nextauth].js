import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;
          const email = credentials.email?.toLowerCase();
          let password = credentials.password;
          if (!email || password === undefined) return null;

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          // Accept passwords with special characters by trying a few decoding variants
          const variants = new Set([password]);
          try { variants.add(decodeURIComponent(password)); } catch (e) {}
          try { variants.add(password.replace(/\u0020/g, ' ')); } catch (e) {}

          for (const p of variants) {
            try {
              const ok = await bcrypt.compare(p, user.password);
              if (ok) {
                return { id: user.id, name: user.name || user.email, email: user.email, isAdmin: user.isAdmin };
              }
            } catch (e) {
              // ignore compare errors for a variant
            }
          }

          return null;
        } catch (err) {
          // Log error for debugging (server-side only)
          console.error('Authorize error:', err);
          throw err;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin || false;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.email = token.email;
      session.isAdmin = token.isAdmin || false;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
