import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [Author,Book,Rating],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
