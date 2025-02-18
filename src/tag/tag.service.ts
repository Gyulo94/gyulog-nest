import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.prisma.tag.findMany();
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
