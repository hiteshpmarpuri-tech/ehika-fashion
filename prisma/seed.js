const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed');
    process.exit(0);
  }

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    process.exit(0);
  }

  const hash = bcrypt.hashSync(adminPassword, 10);
  await prisma.user.create({ data: { email: adminEmail, password: hash, isAdmin: true, name: 'Admin' } });
  console.log('Seeded admin user:', adminEmail);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
