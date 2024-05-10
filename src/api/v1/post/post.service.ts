import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostBoardDto } from './dto/post.board.dto';
import { UserDto } from '../users/dto/login.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async getAllBoard(paginationDto: PaginationDto) {
    const { limit, page, sort} = paginationDto;
    const offset = (page - 1) * limit;
    // QueryBuilder를 사용하여 쿼리 생성
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // 조인 및 필요한 필드 선택
    queryBuilder
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.createdAt',
        'post.images',
        'post.isOpen',
      ]) // post에서 title과 content만 선택
      .orderBy('post.id', sort) // ID 기준 내림차순 정렬
      .take(limit)
      .skip(offset);

    const [posts, count] = await queryBuilder.getManyAndCount();

    return {
      page: page,
      total: count,
      count: posts.length,
      pageCount: Math.ceil(count / limit),
      data: posts,
    };
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

  async postBoard(board: PostBoardDto, files: Array<Express.Multer.File>) {
    if (files && files.length > 0) {
      // console.log(files);
      return '';
    }
    return this.postRepository.save(board);
  }

  async getMyBoardById(userId: UserDto, paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const offset = (page - 1) * limit;
    // QueryBuilder를 사용하여 쿼리 생성
    const queryBuilder = this.postRepository.createQueryBuilder('post');

    // 조인 및 필요한 필드 선택
    queryBuilder
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'post.id',
        'post.title',
        'post.content',
        'post.createdAt',
        'post.images',
        'post.isOpen',
      ]) // post에서 title과 content만 선택
      .addSelect(['user.username', 'user.email', 'user.id', 'user.isAdmin']) // user에서 username과 email만 선택
      .where('user.id = :userId', { userId })
      .orderBy('post.id', 'DESC') // ID 기준 내림차순 정렬
      .take(limit)
      .skip(offset);

    const [posts, count] = await queryBuilder.getManyAndCount();

    return {
      page: page,
      total: count,
      count: posts.length,
      pageCount: Math.ceil(count / limit),
      data: posts,
    };
  }
}
