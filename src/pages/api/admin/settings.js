import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const settings = await prisma.settings.findUnique({ where: { id: 1 } });
      return res.status(200).json({ ok: true, settings });
    }

    // For POST/PUT, ensure admin session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const { logoUrl, about } = req.body || {};
      const updated = await prisma.settings.upsert({
        where: { id: 1 },
        update: { logoUrl, about },
        create: { id: 1, logoUrl, about }
      });
      return res.status(200).json({ ok: true, settings: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin settings handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
