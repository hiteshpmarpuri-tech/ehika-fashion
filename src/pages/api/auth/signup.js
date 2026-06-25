import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const lower = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: lower } });
  if (existing) return res.status(409).json({ error: 'User already exists' });
  const hash = await bcrypt.hash(password, 10);
  const isAdmin = lower === (process.env.ADMIN_EMAIL || '').toLowerCase();
  const user = await prisma.user.create({ data: { email: lower, password: hash, name: name || '', isAdmin } });
  return res.status(201).json({ message: 'User created', user: { email: user.email, isAdmin: user.isAdmin } });
}
