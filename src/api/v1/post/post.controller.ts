import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostBoardDto } from './dto/post.board.dto';
import { JwtAuthGuard } from '../../../auth/jwt/jwt.guard';
import { User } from '../../../common/decorator/user.decorator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { deletedBoardDto } from './dto/delete.board.dto';
import { ApiConsumes, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../../common/pipes/file.validation.pipe';
import { multerOptions } from '../../../common/utils/multer.options';
import { Request } from 'express';
import * as process from 'process';

@ApiTags('api/v1/post')
@ApiExtraModels(PaginationDto)
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllBoard(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
  ) {
    return await this.postService.getAllBoard(paginationDto);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new FileValidationPipe())
  @UseInterceptors(FilesInterceptor('images'))
  async postBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: PostBoardDto,
    @User() user: any,
  ) {
    body.user = user.id;
    return await this.postService.postBoard(user, body, files);
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new FileValidationPipe())
  @UseInterceptors(FilesInterceptor('images'))
  async updatedBoard(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: PostBoardDto,
    @User() user: any,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    return await this.postService.updatedBoard(user, body, files);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deletedBoard(@Body() body: deletedBoardDto, @User() user: any) {
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    return await this.postService.deletedBoard(user.id, body.id);
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyBoard(
    @Query(new ValidationPipe({ transform: true }))
    paginationDto: PaginationDto,
    @User() user: any,
  ) {
    return await this.postService.getMyBoardById(user.id, paginationDto);
  }
}
