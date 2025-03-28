import { Module } from '@nestjs/common';
import { AppController, AuthorController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { Book } from './modules/database/entities/book.entity';
import { Author } from './modules/database/entities/author.entity'
import { Rating } from './modules/database/entities/rating.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Book, Author, Rating]),],
  controllers: [AppController,AuthorController],
  providers: [AppService],
})
export class AppModule {}

