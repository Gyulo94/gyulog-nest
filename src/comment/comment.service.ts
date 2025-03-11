import { Injectable, NotFoundException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfirmPasswordDto } from './dto/confirm-password.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateCommentDto) {
    const { blogId, content, password, author, userId } = dto;

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('해당 블로그를 찾을 수 없습니다.');
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
      }

      const newComment = await this.prisma.comment.create({
        data: {
          content,
          author: user.name,
          password: user.password,
          profileImage: user.profileImage,
          blog: {
            connect: { id: blogId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
      return {
        newComment,
        status: 'success',
        message: '댓글이 성공적으로 등록되었습니다.',
      };
    } else {
      const hashedPassword = await hash(password, 10);
      const newComment = await this.prisma.comment.create({
        data: {
          content,
          author,
          password: hashedPassword,
          profileImage:
            process.env.SERVER_URL + '/' + 'uploads\profileImages\logo.png',
          blog: {
            connect: { id: blogId },
          },
        },
      });
      return {
        newComment,
        status: 'success',
        message: '댓글이 성공적으로 등록되었습니다.',
      };
    }
  }

  async createReply(dto: CreateCommentDto) {
    const { blogId, content, password, author, userId, parentId } = dto;

    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('해당 블로그를 찾을 수 없습니다.');
    }

    const parentComment = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      throw new NotFoundException('해당 부모 댓글을 찾을 수 없습니다.');
    }

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
      }

      const newComment = await this.prisma.comment.create({
        data: {
          content,
          author: user.name,
          password: user.password,
          profileImage: user.profileImage,
          blog: {
            connect: { id: blogId },
          },
          parent: {
            connect: { id: parentId },
          },
          user: {
            connect: { id: userId },
          },
        },
      });
      return {
        newComment,
        status: 'success',
        message: '답글이 성공적으로 등록되었습니다.',
      };
    } else {
      const hashedPassword = await hash(password, 10);
      const newComment = await this.prisma.comment.create({
        data: {
          content,
          author,
          password: hashedPassword,
          profileImage:
            process.env.SERVER_URL + '/' + 'uploads\profileImages\logo.png',
          blog: {
            connect: { id: blogId },
          },
          parent: {
            connect: { id: parentId },
          },
        },
      });
      return {
        newComment,
        status: 'success',
        message: '답글이 성공적으로 등록되었습니다.',
      };
    }
  }

  async findByBlogId(blogId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      throw new NotFoundException('해당 블로그를 찾을 수 없습니다.');
    }
    const comments = await this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: { parent: true, user: true },
    });

    return comments;
  }

  async confirmPassword(dto: ConfirmPasswordDto) {
    const { id, password } = dto;
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    const isPasswordMatched = await compare(password, comment.password);

    if (!isPasswordMatched) {
      return false;
    }
    return true;
  }

  async update(id: string, dto: UpdateCommentDto) {
    const { content } = dto;
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }
    return await this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('해당 댓글을 찾을 수 없습니다.');
    }

    return await this.prisma.comment.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
