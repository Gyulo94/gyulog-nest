import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}
  saveFile(imageFilename: string) {
    const ImageFolder = join('uploads', 'images');
    const image = this.prisma.image.create({
      data: {
        url: join(ImageFolder, imageFilename),
      },
    });
    return image;
  }
}
