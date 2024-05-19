import { Test, TestingModule } from '@nestjs/testing';
import { SqsServiceService } from './sqs.service';

describe('SqsServiceService', () => {
  let service: SqsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsServiceService],
    }).compile();

    service = module.get<SqsServiceService>(SqsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
