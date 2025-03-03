import { IsInt, IsOptional } from 'class-validator';

export class PagePaginationDto {
  @IsInt()
  @IsOptional()
  page: number;

  @IsInt()
  @IsOptional()
  take: number;
}
