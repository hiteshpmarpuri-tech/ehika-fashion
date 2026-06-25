import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let settings = await prisma.settings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 1, logoUrl: '/images/ehika-logo.svg', about: '' } });
    }
    return res.status(200).json({ settings });
  }

  const session = await getSession({ req });
  if (!session || !session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { logoUrl, about } = req.body;
    const data = {};
    if (logoUrl !== undefined) data.logoUrl = logoUrl;
    if (about !== undefined) data.about = about;
    const settings = await prisma.settings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    return res.status(200).json({ settings });
  }

  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
