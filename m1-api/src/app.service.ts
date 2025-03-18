import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './modules/database/entities/book.entity';
import { Author } from './modules/database/entities/author.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}


  // Méthode pour récupérer un livre par ID avec les informations sur l'auteur
  async getBookById(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'], // Récupérer les informations de l'auteur
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  // Méthode pour récupérer tous les livres
  async getBooks() {
    try {
      const books = await this.bookRepository.find({
        relations: ['author'], // Récupérer les informations des auteurs
      });
      return books;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Unable to fetch books');
    }
  }

  //methode pour recuperer un autheur par son ID
  async getAuthorById(id : string){
    const author = await this.authorRepository.findOne({
      where: {id},
      relations: ['books']
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  //methode pour recuperer tout les autheurs
  async getAuthors(){
    try {
      const authors = await this.authorRepository.find({
        relations: ['books'], // Récupérer les informations des auteurs
      });
      return authors;
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw new Error('Unable to fetch authors');
    }
  }

  // Méthode pour ajouter un auteur avec ses livres
  async addAuthorWithBooks(authorData: any, booksData: any[]) {
    const author = this.authorRepository.create(authorData);  // Crée un auteur

    try {
      // Sauvegarde l'auteur
      await this.authorRepository.save(author);

      // Ajoute les livres associés à cet auteur
      for (const bookData of booksData) {
        const book = this.bookRepository.create({
          ...bookData,
          author: author,  // Associe l'auteur au livre
        });

        // Sauvegarde chaque livre
        await this.bookRepository.save(book);
      }

      return { message: 'Author and books added successfully' };
    } catch (error) {
      console.error('Error adding author and books:', error);
      throw new Error('Unable to add author and books');
    }
  }


  // Methode de suppression d'auteurs et de tout les livres qui lui sont associés
  async deleteAuthor(id: string): Promise<{ message: string }> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
  
    if (!author) {
      throw new NotFoundException('Author not found');
    }
  
    // Supprimer tous les livres liés à cet auteur
    await this.bookRepository.remove(author.books);
  
    // Supprimer l'auteur
    await this.authorRepository.remove(author);
  
    throw new HttpException(
      { message: `Author ${id} and all associated books have been deleted` },
      HttpStatus.OK
    );
  }
}