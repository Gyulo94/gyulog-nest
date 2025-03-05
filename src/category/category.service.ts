import { BadRequestException, Injectable } from '@nestjs/common';
import { PagePaginationDto } from 'src/common/dto/page-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });
    if (category) {
      throw new BadRequestException('이미 존재하는 카테고리 입니다.');
    }
    return await this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findByCategory(dto: PagePaginationDto, category: string) {
    const { page, take } = dto;
    const skip = (page - 1) * take;

    const where: any = {};

    where.category = {
      name: category,
    };

    const [blogs, totalCount] = await Promise.all([
      this.prisma.blog.findMany({
        where: where,
        take: take,
        skip: skip,
        include: {
          tags: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count({ where: where }),
    ]);

    return { blogs, totalCount };
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
    });
  }
  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) {
      throw new BadRequestException('존재하지 않는 카테고리 입니다.');
    }
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) {
      throw new BadRequestException('존재하지 않는 카테고리 입니다.');
    }
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
