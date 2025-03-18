import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { Book } from './modules/database/entities/book.entity'
import { Author } from './modules/database/entities/author.entity'

@Controller('books')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  public async getBook(@Param('id') id: string): Promise<Book> {
    return this.appService.getBookById(id);
  }

  @Get()
  public async getAllBooks(): Promise<Book[]> {
    return this.appService.getBooks();
  }
}

@Controller('authors')
export class AuthorController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public async getAllAuthors(): Promise<Author[]> {
    return this.appService.getAuthors();
  }

  @Get(':id')
  public async getAuthorsById(@Param('id') id: string): Promise<Author> {
    return this.appService.getAuthorById(id);
  }

  @Post()
  async addAuthorWithBooks(
    @Body() body: { authorData: any; booksData: any[] },
  ) {
    return this.appService.addAuthorWithBooks(body.authorData, body.booksData);
  }

  @Delete(':id')
  async deleteAuthor(@Param('id') id: string) {
    return this.appService.deleteAuthor(id);
  }
}
