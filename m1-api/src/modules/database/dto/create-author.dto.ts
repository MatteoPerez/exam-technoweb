import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}