import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt_guard';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async saveFiles(@UploadedFile() image: Express.Multer.File) {
    return this.fileService.saveFile(image.filename);
  }
}
