import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBlogDto) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: dto.subCategoryId },
    });
    if (!subCategory) {
      throw new NotFoundException('해당 하위 카테고리를 찾을 수 없습니다.');
    }

    const tagArr = await Promise.all(
      dto.tags.map(async (tagName) => {
        let tag = await this.prisma.tag.findUnique({
          where: { name: tagName },
        });
        if (!tag) {
          tag = await this.prisma.tag.create({
            data: { name: tagName },
          });
        }
        return tag;
      }),
    );

    try {
      const blog = await this.prisma.blog.create({
        data: {
          title: dto.title,
          content: dto.content,
          isPublished: dto.isPublished,
          subCategory: {
            connect: { id: subCategory.id },
          },
          user: {
            connect: { id: dto.userId },
          },
          tags: {
            connect: tagArr.map((tag) => ({ id: tag.id })),
          },
        },
      });

      return blog;
    } catch (error) {
      throw new InternalServerErrorException(
        `블로그 생성 중 오류 발생: ${error.message}`,
      );
    }
  }

  async findAll() {
    return await this.prisma.blog.findMany({
      include: { tags: true, subCategory: true },
    });
  }

  async findOne(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: { tags: true, subCategory: true },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }
    return blog;
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }

    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: dto.subCategoryId },
    });
    if (!subCategory) {
      throw new NotFoundException('해당 서브 카테고리를 찾을 수 없습니다.');
    }

    const tagArr = await Promise.all(
      dto.tags.map(async (tags) => {
        let tag = await this.prisma.tag.findUnique({
          where: { name: tags },
        });
        if (!tag) {
          tag = await this.prisma.tag.create({
            data: { name: tags },
          });
        }
        return tag;
      }),
    );

    try {
      const updatedBlog = await this.prisma.blog.update({
        where: { id },
        data: {
          title: dto.title,
          content: dto.content,
          isPublished: dto.isPublished,
          subCategory: {
            connect: { id: subCategory.id },
          },
          tags: {
            set: tagArr.map((tag) => ({ id: tag.id })),
          },
        },
      });

      return updatedBlog;
    } catch (error) {
      throw new InternalServerErrorException(
        `블로그 업데이트 중 오류 발생: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }

    return await this.prisma.blog.delete({ where: { id } });
  }
}
