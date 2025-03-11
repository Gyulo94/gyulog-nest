import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt_guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':email')
  async updateUserProfile(
    @Param('email') email: string,
    @Body('name') name: string,
  ) {
    return this.userService.update(email, name);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  @Patch('profile-image/:email')
  async updateUserImage(
    @Param('email') email: string,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return this.userService.updateImage(email, profileImage.filename);
  }
}
