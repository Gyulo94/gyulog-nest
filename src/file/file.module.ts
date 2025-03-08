import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'images'),
        filename: (req, file, cb) => {
          const filename = `${file.fieldname}-${Date.now()}${extname(
            file.originalname,
          )}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileController],
  providers: [FileService, PrismaService, JwtService],
})
export class FileModule {}
