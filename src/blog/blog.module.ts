import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, PrismaService, JwtService],
})
export class BlogModule {}
