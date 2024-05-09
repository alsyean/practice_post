import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostBoardDto } from './dto/post.board.dto';
import { UserDto } from '../users/dto/login.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { deletedBoardDto } from "./dto/delete.board.dto";


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async getAllBoard(paginationDto: PaginationDto) {
    const { limit, skip } = paginationDto;
    return await this.postRepository.find({
      where: {
        isOpen: true,
      },
      take: limit,
      skip: skip,
      order: {
        id: 'DESC', // 예시로 ID 기준 오름차순 정렬
      },
    });
  }

  async updatedBoard(userId: UserDto, board: PostBoardDto) {
    const post = await this.postRepository.findOne({
      where: {
        user: userId,
        id: board.id,
      },
    });

    post.title = board.title;
    post.content = board.content;
    post.isOpen = board.isOpen;
    post.images = board.images;
    await this.postRepository.save(post);
    return post;
  }

  async deletedBoard(userId: UserDto, postId: number) {
    const post = await this.postRepository.findOne({
      where: {
        user: userId,
        id: postId,
      },
    });

    if (post) {
      return await this.postRepository.softDelete(post.id);
    }
    // return post;
  }

  async postBoard(board: PostBoardDto) {
    return this.postRepository.save(board);
  }

  async getMyBoardById(userId: UserDto, paginationDto: PaginationDto) {
    const { limit, skip } = paginationDto;
    return this.postRepository.find({
      where: {
        user: userId,
      },
      take: limit,
      skip: skip,
      order: {
        id: 'DESC', // 예시로 ID 기준 오름차순 정렬
      },
    });
  }
}
