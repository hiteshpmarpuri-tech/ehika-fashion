import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // Require admin session to get signed params
  const session = await getSession({ req });
  if (!session || !session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });

  const timestamp = Math.floor(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) return res.status(500).json({ error: 'Cloudinary not configured' });

  const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${apiSecret}`).digest('hex');
  return res.status(200).json({ signature, apiKey: process.env.CLOUDINARY_API_KEY, timestamp, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
}
