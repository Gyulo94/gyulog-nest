import { IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Min(1, { message: '한글자 이상 입력하세요.' })
  name: string;
}
