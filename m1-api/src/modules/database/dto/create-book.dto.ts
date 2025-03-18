import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsString()
  authorFirstName?: string;

  @IsOptional()
  @IsString()
  authorLastName?: string;

  @IsInt()
  yearPublished: number;
}