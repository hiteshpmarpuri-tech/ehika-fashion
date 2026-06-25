import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Ensure JSON body
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
      // continue, but warn — client should send application/json
    }

    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const lower = email.toLowerCase();

    // Defensive prisma check
    if (!prisma) {
      console.error('[auth-debug] Prisma client not available in signup');
      return res.status(500).json({ error: 'Server error' });
    }

    const existing = await prisma.user.findUnique({ where: { email: lower } });
    if (existing) {
      console.error(`[auth-debug] signup attempted for existing user: ${lower}`);
      return res.status(409).json({ error: 'User already exists' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const isAdmin = lower === (process.env.ADMIN_EMAIL || '').toLowerCase();
    const user = await prisma.user.create({ data: { email: lower, password: hash, name: name || '', isAdmin } });

    console.error(`[auth-debug] user created: ${user.email} isAdmin=${user.isAdmin}`);

    // Return minimal user info (no password)
    return res.status(201).json({ message: 'User created', user: { email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('[auth-debug] Signup handler error:', err?.message || err);
    // Return JSON error (avoid HTML error pages)
    return res.status(500).json({ error: 'Signup failed' });
  }
}
