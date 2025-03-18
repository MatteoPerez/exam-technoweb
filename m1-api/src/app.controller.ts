import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Book } from './modules/database/entities/book.entity'

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

  @Post()
  async addAuthorWithBooks(
    @Body() body: { authorData: any; booksData: any[] },
  ) {
    return this.appService.addAuthorWithBooks(body.authorData, body.booksData);
  }
}
