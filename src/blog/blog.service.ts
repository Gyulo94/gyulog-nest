import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetBlogDto } from './dto/get-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBlogDto, thumbnailFilename: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
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

    const thumbnailFolder = join('uploads', 'thumbnails');

    try {
      const blog = await this.prisma.blog.create({
        data: {
          title: dto.title,
          thumbnail: join(thumbnailFolder, thumbnailFilename),
          content: dto.content,
          isPublished: dto.isPublished,
          category: {
            connect: { id: category.id },
          },
          user: {
            connect: { id: dto.userId },
          },
          tags: {
            connect: tagArr.map((tag) => ({ id: tag.id })),
          },
        },
        include: {
          tags: true,
          category: true,
          user: true,
        },
      });

      return {
        id: blog.id,
        status: 'success',
        message: '블로그 글이 성공적으로 작성되었습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `블로그 생성 중 오류 발생: ${error.message}`,
      );
    }
  }

  async findAll(dto: GetBlogDto) {
    const { page, take } = dto;
    const skip = (page - 1) * take;

    const [blogs, totalCount] = await Promise.all([
      this.prisma.blog.findMany({
        take: take,
        skip: skip,
        include: {
          tags: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count(),
    ]);

    return { blogs, totalCount };
  }

  async findByBot(title: string) {
    const splitTitle = title.split(' ');
    const where: any = {};
    if (Array.isArray(splitTitle)) {
      where.OR = splitTitle.map((t) => ({
        title: { contains: t, mode: 'insensitive' },
      }));
    } else if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    const blog = await this.prisma.blog.findMany({
      where: where,
      include: {
        tags: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return blog;
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        tags: true,
        category: true,
      },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }
    return blog;
  }

  async update(id: number, dto: UpdateBlogDto, thumbnailFilename: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
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
    const thumbnailFolder = join('uploads', 'thumbnails');
    try {
      await this.prisma.blog.update({
        where: { id },
        data: {
          title: dto.title,
          content: dto.content,
          isPublished: dto.isPublished,
          thumbnail:
            thumbnailFilename && join(thumbnailFolder, thumbnailFilename),
          category: {
            connect: { id: category.id },
          },
          tags: {
            set: tagArr.map((tag) => ({ id: tag.id })),
          },
        },
      });

      return {
        status: 'success',
        message: '블로그 글이 성공적으로 수정되었습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `블로그 업데이트 중 오류 발생: ${error.message}`,
      );
    }
  }

  async remove(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`블로그를 찾을 수 없습니다. ID: ${id}`);
    }

    await this.prisma.blog.delete({ where: { id } });

    return {
      status: 'success',
      message: '블로그 글이 성공적으로 삭제되었습니다.',
    };
  }

  async increaseViewCount(id: number) {
    await this.prisma.blog.update({
      where: { id },
      data: { viewCnt: { increment: 1 } },
    });
  }
}
