import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Book } from './modules/database/entities/book.entity'
import { Author } from './modules/database/entities/author.entity'
import { CreateBookDto } from './modules/database/dto/create-book.dto';
import { Rating } from './modules/database/entities/rating.entity';
import { CreateRatingDto } from './modules/database/dto/create-rating.dto';

//Detail des routes existantes :
// - GET /books -> obtenir tout les  livres
// - GET /books/id -> obtenir un livre par son ID
// - GET /authors -> obtenir tout les auteurs
// - GET /autors/id -> obtenir un auteur par son ID
// - POST /authors -> ajouter un nouvel auteur
// - DELETE /autors/id -> supprimer un auteur par son ID
// - GET /books/serach/title -> rechercher des livres avec leur titre
// - GET /authors/search/name -> recherche des auteurs par leur nom / nom pénom / prenom nom / prénom
// - DELETE /books/id -> supprime un livre
// - POST /books -> créer un livre, si un ID d'auteur valide est envoyer, il le lie à l'auteur existant, si on lui envois un nouvel auteur, il le creer

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

  @Get('search/:title')
  public async searchBooks(@Param('title') title: string): Promise<Book[]> {
  return this.appService.searchBooksByTitle(title);
  }

  @Delete(':id')  // Route DELETE pour supprimer un livre par son ID
  public async deleteBook(@Param('id') id: string): Promise<void> {
    await this.appService.deleteBook(id);
    return;
  }

  @Post()
  public async createBook(@Body() createBookDto: CreateBookDto) {
    return this.appService.createBook(createBookDto);  // Appelle la méthode de service pour créer le livre
  }

  @Get(':id/ratings')
  async getBookRatings(@Param('id') id: string): Promise<Rating[]> {
    return this.appService.getBookRatings(id);
  }

  @Post(':id/ratings')
  async addRating(
    @Param('id') bookId: string,
    @Body() createRatingDto: CreateRatingDto
    ): Promise<Rating> {
    return this.appService.addRating(bookId, createRatingDto);
  }

  // Route pour mettre à jour un livre
  @Put(':id')
  public async updateBook(
    @Param('id') id: string,
    @Body() updateData: Partial<Book>,  // Permet de passer une partie de l'entité Book
  ): Promise<Book> {
    return this.appService.updateBook(id, updateData);
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

  @Get('search/:name')
  async searchAuthors(@Param('name') name: string) {
  return this.appService.searchAuthorsByName(name);
  }
  
  @Put(':id')
  public async updateAuthor(
    @Param('id') id: string,
    @Body() updateData: Partial<Author>,  // Permet de passer une partie de l'entité Author
  ): Promise<Author> {
    return this.appService.updateAuthor(id, updateData);
  }
}




@Controller('ratings')
export class RatingsController {
  constructor(private readonly appService: AppService) {}

  // Route pour supprimer un commentaire (évaluation)
  @Delete(':id')
  async deleteRating(@Param('id') id: string) {
    return this.appService.deleteRating(id);
  }
}
