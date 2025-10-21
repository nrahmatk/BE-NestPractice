import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookDto, FilterBooksDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  private transformBookResponse(book: any) {
    const {
      created_by_id,
      created_by,
      created_at,
      updated_at,
      published_at,
      ...rest
    } = book;

    return {
      ...rest,
      userId: created_by_id,
      user: created_by,
      createdAt: created_at,
      updatedAt: updated_at,
      published_at: published_at,
    };
  }

  async create(createBookDto: CreateBookDto, userId: number) {
    const bookData = {
      ...createBookDto,
      created_by_id: userId,
      published_at: createBookDto.published_at
        ? new Date(createBookDto.published_at)
        : null,
    };

    const book = await this.prisma.book.create({
      data: bookData,
      include: {
        created_by: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.transformBookResponse(book);
  }

  async findAll(userId: number, filterDto?: FilterBooksDto) {
    const {
      search,
      language,
      sortBy = 'published_at',
      sortOrder = 'desc',
    } = filterDto || {};

    const whereClause: any = {
      published: true,
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { sub_title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (language) {
      whereClause.language = { contains: language, mode: 'insensitive' };
    }

    const books = await this.prisma.book.findMany({
      where: whereClause,
      include: {
        created_by: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return books.map((book) => this.transformBookResponse(book));
  }

  async findOne(id: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        created_by: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return this.transformBookResponse(book);
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.created_by_id !== userId) {
      throw new ForbiddenException(
        'You can only update books that you created',
      );
    }

    const updateData = {
      ...updateBookDto,
      published_at: updateBookDto.published_at
        ? new Date(updateBookDto.published_at)
        : undefined,
    };

    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        created_by: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return this.transformBookResponse(updatedBook);
  }

  async remove(id: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.created_by_id !== userId) {
      throw new ForbiddenException(
        'You can only delete books that you created',
      );
    }

    await this.prisma.book.delete({
      where: { id },
    });

    return { message: 'Book deleted successfully' };
  }

  async findMyBooks(userId: number) {
    const books = await this.prisma.book.findMany({
      where: {
        created_by_id: userId,
      },
      include: {
        created_by: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return books.map((book) => this.transformBookResponse(book));
  }
}
