import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async subCreate(dto: CreateCategoryDto) {
    const parentCategory = await this.findOne(dto.categoryId);
    if (!parentCategory) {
      throw new NotFoundException('존재하지 않는 카테고리 입니다.');
    }
    return await this.prisma.subCategory.create({
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async subFindAll() {
    return await this.prisma.subCategory.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
      },
    });
  }

  async subFindOne(id: string) {
    return await this.prisma.subCategory.findUnique({
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

  async subRemove(id: string) {
    const category = await this.subFindOne(id);
    if (!category) {
      throw new BadRequestException('존재하지 않는 카테고리 입니다.');
    }
    return await this.prisma.subCategory.delete({
      where: { id },
    });
  }
}
