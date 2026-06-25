import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ products });
  }
  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session || !session.isAdmin) return res.status(401).json({ message: 'Unauthorized' });
    const { title, price, description, image } = req.body;
    if (!title) return res.status(400).json({ message: 'Missing title' });
    const p = await prisma.product.create({ data: { title, price: Number(price) || 0, description: description || '', image: image || '' } });
    return res.status(201).json({ message: 'Product added', product: p });
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
