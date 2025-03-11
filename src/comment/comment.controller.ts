import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ConfirmPasswordDto } from './dto/confirm-password.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Post('/reply')
  createReply(@Body() dto: CreateCommentDto) {
    return this.commentService.createReply(dto);
  }

  @Post('/password')
  checkPassword(@Body() dto: ConfirmPasswordDto) {
    return this.commentService.confirmPassword(dto);
  }

  @Get(':blogId')
  findByBlogId(@Param('blogId', ParseIntPipe) blogId: number) {
    return this.commentService.findByBlogId(blogId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
