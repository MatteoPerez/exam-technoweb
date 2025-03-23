import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './modules/database/entities/book.entity';
import { Author } from './modules/database/entities/author.entity';
import { CreateBookDto } from './modules/database/dto/create-book.dto';
import { Rating } from './modules/database/entities/rating.entity';
import { CreateRatingDto } from './modules/database/dto/create-rating.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
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

  async addAuthor(authorData: { first_name: string; last_name: string; biography?: string; photo?: string }): Promise<Author> {
    try {
      const author = this.authorRepository.create({
        first_name: authorData.first_name,
        last_name: authorData.last_name,
        biography: authorData.biography || null,
        photo: authorData.photo || null,
      });

      return await this.authorRepository.save(author);
    } catch (error) {
      console.error('Error adding author my bro:', error);
      throw new Error('Unable to add author');
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

  //Methode de recherche de livre avec son titre
  async searchBooksByTitle(title: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: { title: Like(`%${title}%`) },
    });
  }

  //Methode de recherche d'auteurs par leur nom ou prenom
  async searchAuthorsByName(name: string): Promise<Author[]> {
    const nameParts = name.split(' '); // Divise la chaîne en mots
  
    // Si un seul mot est passé (par exemple "Rowling"), on le recherche dans les deux champs
    if (nameParts.length === 1) {
      return this.authorRepository.find({
        where: [
          { first_name: Like(`%${nameParts[0]}%`) }, // Recherche dans le prénom
          { last_name: Like(`%${nameParts[0]}%`) },  // Recherche dans le nom
        ],
      });
    }
  
    // Si deux mots sont passés, on fait la recherche avec prénom + nom et nom + prénom
    const [firstName, lastName] = nameParts;
    return this.authorRepository.find({
      where: [
        {
          first_name: Like(`%${firstName}%`),
          last_name: Like(`%${lastName}%`), // Recherche avec prénom puis nom
        },
        {
          first_name: Like(`%${lastName}%`), // Recherche avec nom puis prénom
          last_name: Like(`%${firstName}%`),
        },
      ],
    });
  }

  //Methode de suppression d'un livre
  async deleteBook(id: string): Promise<void> {
    try {
      const book = await this.bookRepository.findOne({
        where: { id }  // Recherche le livre par son ID
      });  // Trouver le livre par ID

      if (!book) {
        throw new Error('Book not found');
      }
  
      await this.bookRepository.remove(book);  // Supprimer le livre de la base de données
    } catch (error) {
      throw new Error('Error deleting book: ' + error.message);
    }
  }

  // Méthode pour créer un livre
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    let author;

    // Si un authorId est fourni, on vérifie si l'auteur existe
    if (createBookDto.authorId) {
      author = await this.authorRepository.findOne({ where: { id: createBookDto.authorId } });

      if (!author) {
        throw new Error('Author not found');
      }
    } else if (createBookDto.authorFirstName && createBookDto.authorLastName) {
      // Si l'auteur n'existe pas et qu'on a un prénom et un nom, on crée un nouvel auteur
      author = this.authorRepository.create({
        first_name: createBookDto.authorFirstName,
        last_name: createBookDto.authorLastName,
      });
      author = await this.authorRepository.save(author);  // Sauvegarde le nouvel auteur dans la base de données
    } else {
      throw new Error('Either an author ID or author first and last name are required');
    }

    // Création du livre
    const book = this.bookRepository.create({
      title: createBookDto.title,
      year_published: createBookDto.yearPublished,
      author,  // Associe l'auteur au livre
    });

    return await this.bookRepository.save(book);  // Sauvegarde le livre dans la base de données
  }

  //Methode pour recuperer les evaluations d'un livre par son ID
  async getBookRatings(bookId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { id_book: bookId },
    });
  }

  //Methode pour ajouter une evalutation
  async addRating(bookId: string, createRatingDto: CreateRatingDto): Promise<Rating> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const newRating = this.ratingRepository.create({
      ...createRatingDto,
      book, // Associe le livre au commentaire
    });

    return await this.ratingRepository.save(newRating);
  }


  //Methode pour supprimer un commentaire avec son ID
  async deleteRating(id: string): Promise<void> {
    const rating = await this.ratingRepository.findOne({ where: { id } });

    if (!rating) {
      throw new Error('Rating not found');
    }

    // Suppression du commentaire
    await this.ratingRepository.delete(id);
  }

  async updateBook(id: string, updateData: Partial<Book>): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id }, relations: ['author'] });

    if (!book) {
      throw new Error('Book not found');
    }

    // Vérifier si des informations d'auteur sont fournies et les mettre à jour séparément
    if (updateData.author) {
        if (!book.author) {
            throw new Error("This book doesn't have an associated author");
        }
        book.author.first_name = updateData.author.first_name ?? book.author.first_name;
        book.author.last_name = updateData.author.last_name ?? book.author.last_name;
        await this.authorRepository.save(book.author); // Met à jour l'auteur
        delete updateData.author; // Empêche l'écrasement plus tard
    }

    // Mettre à jour les autres champs du livre
    Object.assign(book, updateData);
    await this.bookRepository.save(book);

    return book;
}

  //Methode de mise a jour d'un auteur
  async updateAuthor(id: string, updateData: Partial<Author>): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new Error('Author not found');
    }

    // Met à jour les champs de l'auteur avec les nouvelles données
    Object.assign(author, updateData);

    // Sauvegarde les changements dans la base de données
    await this.authorRepository.save(author);

    return author;
  }
}