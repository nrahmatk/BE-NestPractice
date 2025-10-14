import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const seedBooks = async (users: any[]) => {
  console.log('📚 Seeding books...');

  const books = [
    {
      title: 'The Art of Clean Code',
      sub_title: 'A Handbook of Agile Software Craftsmanship',
      description:
        "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.",
      author: 'Robert C. Martin',
      editors: 'Prentice Hall Editorial Team',
      image: 'https://picsum.photos/300/300?random=1',
      published: true,
      published_at: new Date('2008-08-01'),
      publisher: 'Prentice Hall',
      language: 'English',
      created_by_id: users[0]?.id,
    },
    {
      title: 'JavaScript: The Good Parts',
      sub_title: 'Unearthing the Excellence in JavaScript',
      description:
        'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined.',
      author: 'Douglas Crockford',
      editors: "O'Reilly Editorial Team",
      image: 'https://picsum.photos/300/300?random=2',
      published: true,
      published_at: new Date('2008-05-01'),
      publisher: "O'Reilly Media",
      language: 'English',
      created_by_id: users[1]?.id,
    },
    {
      title: 'Design Patterns',
      sub_title: 'Elements of Reusable Object-Oriented Software',
      description:
        'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
      author: 'Gang of Four',
      editors: 'Addison-Wesley Editorial Team',
      image: 'https://picsum.photos/300/300?random=3',
      published: true,
      published_at: new Date('1994-10-21'),
      publisher: 'Addison-Wesley Professional',
      language: 'English',
      created_by_id: users[0]?.id,
    },
    {
      title: "You Don't Know JS: Scope & Closures",
      sub_title: 'Deep dive into JavaScript fundamentals',
      description:
        "No matter how much experience you have with JavaScript, odds are you don't fully understand the language. This concise yet in-depth guide takes you inside scope and closures.",
      author: 'Kyle Simpson',
      editors: "O'Reilly Editorial Team",
      image: 'https://picsum.photos/300/300?random=4',
      published: true,
      published_at: new Date('2014-03-24'),
      publisher: "O'Reilly Media",
      language: 'English',
      created_by_id: users[2]?.id,
    },
    {
      title: 'Refactoring',
      sub_title: 'Improving the Design of Existing Code',
      description:
        "For more than twenty years, experienced programmers worldwide have relied on Martin Fowler's Refactoring to improve the design of existing code and to enhance software maintainability.",
      author: 'Martin Fowler',
      editors: 'Addison-Wesley Editorial Team',
      image: 'https://picsum.photos/300/300?random=5',
      published: true,
      published_at: new Date('2018-11-19'),
      publisher: 'Addison-Wesley Professional',
      language: 'English',
      created_by_id: users[1]?.id,
    },
    {
      title: 'Node.js Design Patterns',
      sub_title: 'Design and implement production-grade Node.js applications',
      description:
        'Get the best out of Node.js by mastering its most powerful components and patterns to create modular and scalable applications with ease.',
      author: 'Mario Casciaro',
      editors: 'Packt Editorial Team',
      image: 'https://picsum.photos/300/300?random=6',
      published: true,
      published_at: new Date('2020-07-29'),
      publisher: 'Packt Publishing',
      language: 'English',
      created_by_id: users[3]?.id,
    },
    {
      title: 'Learning TypeScript',
      sub_title:
        'Enhance Your Web Development Skills Using Type-Safe JavaScript',
      description:
        "TypeScript has conquered the world of JavaScript: it's one of the world's fastest growing and most popular programming languages.",
      author: 'Josh Goldberg',
      editors: "O'Reilly Editorial Team",
      image: 'https://picsum.photos/300/300?random=7',
      published: true,
      published_at: new Date('2022-07-26'),
      publisher: "O'Reilly Media",
      language: 'English',
      created_by_id: users[2]?.id,
    },
    {
      title: 'NestJS: A Progressive Node.js Framework',
      sub_title: 'Building Scalable Server-Side Applications',
      description:
        'Learn how to build efficient, scalable Node.js server-side applications using NestJS, a progressive framework for building efficient and reliable server-side applications.',
      author: 'Kamil Mysliwiec',
      editors: 'Tech Editorial Team',
      image: 'https://picsum.photos/300/300?random=8',
      published: false,
      published_at: null,
      publisher: 'Independent',
      language: 'English',
      created_by_id: users[4]?.id,
    },
    {
      title: 'Prisma in Action',
      sub_title: 'Next-generation Database Toolkit',
      description:
        'Prisma is a next-generation database toolkit that makes database access easy with an auto-generated query builder for TypeScript & Node.js.',
      author: 'Development Team',
      editors: 'Database Editorial Team',
      image: 'https://picsum.photos/300/300?random=9',
      published: false,
      published_at: null,
      publisher: 'Tech Publishers',
      language: 'English',
      created_by_id: users[3]?.id,
    },
    {
      title: 'Full-Stack Development with React and NestJS',
      sub_title: 'Building Modern Web Applications',
      description:
        'Learn how to build full-stack web applications using React for the frontend and NestJS for the backend, creating robust and scalable solutions.',
      author: 'Full-Stack Team',
      editors: 'Web Development Editorial',
      image: 'https://picsum.photos/300/300?random=10',
      published: true,
      published_at: new Date('2023-05-15'),
      publisher: 'Modern Web Publishers',
      language: 'English',
      created_by_id: users[0]?.id,
    },
  ];

  const createdBooks = [];
  for (const bookData of books) {
    const existingBook = await prisma.book.findFirst({
      where: {
        title: bookData.title,
        author: bookData.author,
      },
    });

    if (!existingBook) {
      const book = await prisma.book.create({
        data: bookData,
      });
      createdBooks.push(book);
      console.log(`✅ Created book: ${book.title} by ${book.author}`);
    } else {
      console.log(`⚠️  Book already exists: ${bookData.title}`);
      createdBooks.push(existingBook);
    }
  }

  console.log(`🎉 Successfully seeded ${createdBooks.length} books`);
  return createdBooks;
};
