import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      throw new ConflictException('해당 유저는 이미 존재합니다.');
    }
    const newUser = await this.prisma.user.create({
      data: { ...dto, password: await hash(dto.password, 10) },
    });
    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(email: string, name: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new ConflictException('해당 유저는 존재하지 않습니다.');
    }
    return await this.prisma.user.update({
      where: { email },
      data: { name },
    });
  }

  async updateImage(email: string, profileImageFilename: string) {
    const ImageFolder = join('uploads', 'profileImages');
    const profileImage = await this.prisma.user.update({
      where: { email },
      data: {
        profileImage: join(
          process.env.SERVER_URL + '/' + ImageFolder,
          profileImageFilename,
        ),
      },
    });
    return profileImage;
  }
}
