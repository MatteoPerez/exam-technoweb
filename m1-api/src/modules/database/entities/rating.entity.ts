import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, Check, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('ratings') // Nom de la table dans la base de données
@Check(`stars IN (0, 1, 2, 3, 4, 5)`)
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  stars: number;

  @Column({ type: 'varchar', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  author_fname: string;

  @Column({ type: 'varchar', nullable: false })
  author_lname: string;

  @ManyToOne(() => Book, (book) => book.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_book' }) // Spécifie que c'est la colonne `id_book` qui fait référence au livre
  book: Book;
  
  @Column()
  id_book: string; // Stocke uniquement l'ID du livre
}
