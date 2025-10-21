import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto, FilterBooksDto, UpdateBookDto } from './dto/book.dto';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createBookDto: CreateBookDto, @Request() req: any) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @Get()
  findAll(@Query() filterDto: FilterBooksDto, @Request() req: any) {
    return this.booksService.findAll(req.user.userId, filterDto);
  }

  @Get('my-books')
  findMyBooks(@Request() req: any) {
    return this.booksService.findMyBooks(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.booksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
    @Request() req: any,
  ) {
    return this.booksService.update(id, updateBookDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.booksService.remove(id, req.user.userId);
  }
}
