import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../../entities/post.entity';
import { AuthModule } from '../../../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { AwsModule } from '../../../common/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    AuthModule,
    AwsModule,
    MulterModule.register({
      storage: multer.memoryStorage(), // memoryStorage로 변경
    }),
    // MulterModule.register({
    //   storage: diskStorage({
    //     destination: './uploads',
    //     filename: (req, file, callback) => {
    //       const uniqueSuffix =
    //         Date.now() + '-' + Math.round(Math.random() * 1e9);
    //       console.log(`uniqueSuffix : ${uniqueSuffix}`);
    //       callback(null, uniqueSuffix + '-' + file.originalname);
    //     },
    //   }),
    // }),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
