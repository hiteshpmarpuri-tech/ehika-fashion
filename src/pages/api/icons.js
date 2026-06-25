import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const icons = await prisma.icon.findMany({ orderBy: { order: 'asc' } });
    return res.status(200).json({ icons });
  }

  const session = await getSession({ req });
  if (!session || !session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { label, href, image, order } = req.body;
    const icon = await prisma.icon.create({ data: { label, href, image, order: Number(order) || 0 } });
    return res.status(201).json({ icon });
  }

  if (req.method === 'PUT') {
    const { id, label, href, image, order } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const icon = await prisma.icon.update({ where: { id }, data: { label, href, image, order: Number(order) || 0 } });
    return res.status(200).json({ icon });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await prisma.icon.delete({ where: { id: String(id) } });
    return res.status(200).json({ message: 'Deleted' });
  }

  res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
  res.status(405).end();
}
