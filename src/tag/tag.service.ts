import { Injectable, NotFoundException } from '@nestjs/common';
import { PagePaginationDto } from 'src/common/dto/page-pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    return await this.prisma.tag.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll() {
    return await this.prisma.tag.findMany({
      select: {
        name: true,
        _count: {
          select: { blogs: true },
        },
      },
    });
  }

  async findByTags(dto: PagePaginationDto, tag: string) {
    const { page, take } = dto;
    const skip = (page - 1) * take;

    const where: any = {};

    where.tags = {
      some: {
        name: tag,
      },
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
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    return await this.prisma.tag.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    return await this.prisma.tag.delete({
      where: { id },
    });
  }
}
