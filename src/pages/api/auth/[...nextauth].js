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
          const password = credentials.password;
          if (!email || !password) return null;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;
          return { id: user.id, name: user.name || user.email, email: user.email, isAdmin: user.isAdmin };
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
