import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt_guard';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { GetBlogDto } from './dto/get-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post()
  create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.blogService.create(dto, thumbnail.filename);
  }

  @Get()
  findAll(@Query() dto: GetBlogDto) {
    return this.blogService.findAll(dto);
  }

  @Get('bot')
  findByBot(@Query('title') title: string) {
    // console.log('controller title', title);

    return this.blogService.findByBot(title);
  }

  @Post(':id/view')
  async increaseViewCount(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const cookieName = `viewed_${id}`;
    const viewed = req.cookies[cookieName];

    if (!viewed) {
      await this.blogService.increaseViewCount(Number(id));
      res.cookie(cookieName, 'true', { maxAge: 24 * 60 * 60 * 1000 }); // 24시간 유효기간
    }

    return res.status(200).json({ message: 'View count increased' });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.blogService.update(id, dto, thumbnail?.filename);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
