import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(0)
  @Max(5)
  stars: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsString()
  author_fname: string;

  @IsString()
  author_lname: string;

  @IsUUID() // Vérifie que l'ID du livre est bien un UUID
  id_book: string;
}