import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';
import { PostBoardDto } from './dto/post.board.dto';
import { UserDto } from '../users/dto/login.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { S3Service } from '../../../common/aws/s3/s3.service';
import { User } from '../../../common/decorator/user.decorator';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private readonly s3Service: S3Service,
  ) {}

  private async getS3Urls(posts: PostEntity[]) {
    for (const post of posts) {
      if (post.images) {
        const imageUrls = await this.s3Service.getFileUrls(post.images);
        post.images = imageUrls;
      }
    }
  }
  async getAllBoard(paginationDto: PaginationDto) {
    const { limit, page, sort } = paginationDto;
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

    await this.getS3Urls(posts);

    return {
      page: page,
      total: count,
      count: posts.length,
      pageCount: Math.ceil(count / limit),
      data: posts,
    };
  }

  async updatedBoard(
    @User() user,
    board: PostBoardDto,
    files: Array<Express.Multer.File>,
  ) {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
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
      .where('user.id = :userId', { userId: user.id })
      .andWhere('post.id = :postId', { postId: board.id });

    const post = await queryBuilder.getOne();
    // const post = await this.postRepository.findOne({
    //   where: {
    //     user: userId,
    //     id: board.id,
    //   },
    //   relations: ['user'],
    // });

    post.title = board.title;
    post.content = board.content;
    post.isOpen = board.isOpen;
    // disk storage
    // if (files && files.length > 0) {
    //   const filePath = [];
    //   // console.log(files);
    //   files.forEach((v) => {
    //     filePath.push(imageBaseUrl + '/static/post/' + v.filename);
    //   });
    //   board.images = filePath;
    // }
    // s3 upload
    if (files && files.length > 0) {
      const filePath = await this.s3Service.uploadMultipleFiles(
        files,
        user.email,
        board.title,
      );
      board.images = filePath;
    }

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

  async postBoard(
    @User() user,
    board: PostBoardDto,
    files: Array<Express.Multer.File>,
  ) {
    if (files && files.length > 0) {
      const filePath = await this.s3Service.uploadMultipleFiles(
        files,
        user.email,
        board.title,
      );
      board.images = filePath;
      return this.postRepository.save(board);
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

    await this.getS3Urls(posts);

    return {
      page: page,
      total: count,
      count: posts.length,
      pageCount: Math.ceil(count / limit),
      data: posts,
    };
  }
}
