import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
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

@ApiTags('api/v1/post')
@ApiExtraModels(PaginationDto)
@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllBoard(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    if (!page) {
      paginationDto.page = 1;
    }
    if (!limit) {
      paginationDto.limit = 10;
    }
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
    return await this.postService.postBoard(body, files);
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  async updatedBoard(@Body() body: PostBoardDto, @User() user: any) {
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    return await this.postService.updatedBoard(user.id, body);
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
  async getMyBoard(@User() user: any, @Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    if (!page) {
      paginationDto.page = 1;
    }
    if (!limit) {
      paginationDto.limit = 10;
    }
    return await this.postService.getMyBoardById(user.id, paginationDto);
  }
}
