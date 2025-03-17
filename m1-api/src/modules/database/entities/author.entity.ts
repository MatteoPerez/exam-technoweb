import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity('authors') // Nom de la table pour les auteurs
export class Author {
  @PrimaryGeneratedColumn('uuid') // ID généré automatiquement
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @OneToMany(() => Book, (book) => book.author) // ✅ Relation inverse
  books: Book[];
}