import { Entity, PrimaryGeneratedColumn, Column,ManyToOne, IntegerType,JoinColumn, OneToMany } from 'typeorm';
import { Author } from './author.entity';
import { Rating } from './rating.entity';


@Entity('books') // Nom de la table dans la base de données
export class Book {
  @PrimaryGeneratedColumn('uuid') // ID généré automatiquement
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => Author, (author) => author.books) // Relation Many-to-One avec Author
  @JoinColumn({ name: 'id_author' }) // Indiquer la colonne de la clé étrangère
  author: Author;

  @Column()
  year_published: number;

  @OneToMany(() => Rating, (rating) => rating.book)
  ratings: Rating[];
}