import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PostService } from './post.service';
import { PostBoardDto } from './dto/post.board.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { User } from "../common/decorator/user.decorator";
import { PaginationDto } from "../common/entities/pagination.dto";

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async postBoard(@Body() body: PostBoardDto, @User() user: any){
    body.user = user.id;
    return await this.postService.postBoard(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyBoard(@User() user: any, @Query() paginationDto: PaginationDto){
    return await this.postService.getMyBoardById(user.id, paginationDto);
  }
}
