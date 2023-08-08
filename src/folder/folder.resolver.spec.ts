import { Test, TestingModule } from '@nestjs/testing';
import { FolderResolver } from './folder.resolver';
import { FolderService } from './folder.service';

describe('FolderResolver', () => {
  let resolver: FolderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderResolver, FolderService],
    }).compile();

    resolver = module.get<FolderResolver>(FolderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
