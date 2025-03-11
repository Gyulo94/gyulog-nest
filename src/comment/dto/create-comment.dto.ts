import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  blogId: number;

  @IsString()
  @IsOptional()
  author: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  parentId: string;
}
