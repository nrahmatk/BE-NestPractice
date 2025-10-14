import { PrismaClient } from '../generated/prisma';
import { seedUsers } from './seeds/user.seed';
import { seedBooks } from './seeds/book.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding...');
  console.log('='.repeat(50));

  try {
    // Seed users first
    const users = await seedUsers();

    console.log(''); // Add spacing

    // Seed books (depends on users)
    const books = await seedBooks(users);

    console.log(''); // Add spacing
    console.log('='.repeat(50));
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📚 Books: ${books.length}`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
