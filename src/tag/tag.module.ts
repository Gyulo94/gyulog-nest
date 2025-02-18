import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaService, JwtService],
})
export class TagModule {}
