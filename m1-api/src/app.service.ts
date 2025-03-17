import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Book not found'); // ⬅️ Retourne une erreur 404 au lieu de 500
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
}