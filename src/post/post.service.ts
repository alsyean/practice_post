import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostBoardDto } from './dto/post.board.dto';
import { UserDto } from '../users/dto/login.dto';
import { PaginationDto } from '../common/entities/pagination.dto';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async postBoard(board: PostBoardDto) {
    return this.postRepository.save(board);
  }

  async getMyBoardById(id: UserDto, paginationDto: PaginationDto) {
    const { limit, skip } = paginationDto;
    return this.postRepository.find({
      where: {
        user: id,
      },
      take: limit,
      skip: skip,
      order: {
        id: 'DESC', // 예시로 ID 기준 오름차순 정렬
      },
    });
  }
}
