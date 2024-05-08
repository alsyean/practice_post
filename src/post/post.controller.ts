import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostBoardDto } from './dto/post.board.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { User } from '../common/decorator/user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { deletedBoardDto } from "./dto/delete.board.dto";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllBoard(@Query() paginationDto: PaginationDto) {
    return await this.postService.getAllBoard(paginationDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async postBoard(@Body() body: PostBoardDto, @User() user: any) {
    body.user = user.id;
    return await this.postService.postBoard(body);
  }

  @Put()
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
    return await this.postService.getMyBoardById(user.id, paginationDto);
  }
}
