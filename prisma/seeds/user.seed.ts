import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const seedUsers = async () => {
  console.log('🌱 Seeding users...');

  const users = [
    {
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('password123', 10),
      name: 'Administrator',
    },
    {
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
    },
    {
      email: 'jane.smith@example.com',
      username: 'janesmith',
      password: await bcrypt.hash('password123', 10),
      name: 'Jane Smith',
    },
    {
      email: 'bob.wilson@example.com',
      username: 'bobwilson',
      password: await bcrypt.hash('password123', 10),
      name: 'Bob Wilson',
    },
    {
      email: 'alice.brown@example.com',
      username: 'alicebrown',
      password: await bcrypt.hash('password123', 10),
      name: 'Alice Brown',
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`⚠️  User already exists: ${userData.email}`);
      createdUsers.push(existingUser);
    }
  }

  console.log(`🎉 Successfully seeded ${createdUsers.length} users`);
  return createdUsers;
};
