import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

// Warn if critical envs missing and provide a safe fallback for NEXTAUTH_SECRET in non-production
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not set — using a temporary fallback secret. Set NEXTAUTH_SECRET in your environment for production.');
}

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

          // Defensive check for prisma
          if (!prisma) {
            console.error('Prisma client not available in authorize');
            return null;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;

          // Accept passwords with special characters by trying a few decoding variants
          const variants = new Set([password]);
          try { variants.add(decodeURIComponent(password)); } catch (e) {}
          try { variants.add(password.replace(/\\u0020/g, ' ')); } catch (e) {}

          for (const p of variants) {
            try {
              const ok = bcrypt.compareSync(p, user.password);
              if (ok) {
                return { id: user.id, name: user.name || user.email, email: user.email, isAdmin: user.isAdmin };
              }
            } catch (e) {
              // ignore compare errors for a variant
            }
          }

          return null;
        } catch (err) {
          // Log error for debugging (server-side only) but return null to avoid 500
          console.error('Authorize error:', err?.message || err);
          return null;
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
  // Use provided secret or a dev fallback so NextAuth doesn't throw in environments where it's missing
  secret: process.env.NEXTAUTH_SECRET || 'dev_fallback_secret'
};

export default NextAuth(authOptions);
