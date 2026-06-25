import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const icons = await prisma.icon.findMany({ orderBy: { order: 'asc' } });
      return res.status(200).json({ ok: true, icons });
    }

    // For other methods, require admin session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'POST') {
      const { label, href, image, order } = req.body || {};
      const icon = await prisma.icon.create({ data: { label, href, image, order: order || 0 } });
      return res.status(201).json({ ok: true, icon });
    }

    if (req.method === 'PUT') {
      const { id, label, href, image, order } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const updated = await prisma.icon.update({ where: { id }, data: { label, href, image, order } });
      return res.status(200).json({ ok: true, icon: updated });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await prisma.icon.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin icons handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
