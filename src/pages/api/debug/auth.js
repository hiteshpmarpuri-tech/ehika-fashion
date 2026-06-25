import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  // Simple diagnostics for auth issues. Safe to expose non-secret info.
  try {
    const envs = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLOUDINARY_CONFIG: !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME)
    };

    // Test DB connectivity and user count
    let dbOk = false;
    let userCount = null;
    let adminExists = false;
    try {
      userCount = await prisma.user.count();
      dbOk = true;
      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
      if (adminEmail) {
        const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
        adminExists = !!admin;
      }
    } catch (e) {
      console.error('Debug DB error:', e);
    }

    return res.status(200).json({ ok: true, envs, dbOk, userCount, adminExists });
  } catch (err) {
    console.error('Debug handler error:', err);
    return res.status(500).json({ ok: false, error: 'Debug failed' });
  }
}
