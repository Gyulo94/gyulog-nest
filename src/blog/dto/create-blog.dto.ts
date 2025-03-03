import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  thumnail: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}
