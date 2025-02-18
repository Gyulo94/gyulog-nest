import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}
