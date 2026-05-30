const prisma = require('./db.js');

async function seed() {
  try {
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Admin Demo', email: 'admin@demo.com' }
    });
    console.log('Created user:', user);
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
