import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from 'typeorm';
import { Author } from './author.entity';

@Entity('books') // Nom de la table dans la base de données
export class Book {
  @PrimaryGeneratedColumn('uuid') // ID généré automatiquement
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Author, (author) => author.books, { eager: true }) // ✅ Relation avec l'entité Author
  author: Author;

  @Column()
  year_published: number;
}