import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { Book } from './modules/database/entities/book.entity';
import { Author } from './modules/database/entities/author.entity'

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Book, Author]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

