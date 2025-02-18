import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, CategoryModule, TagModule, BlogModule],
})
export class AppModule {}
