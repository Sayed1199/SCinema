import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
// import HttpService as httpServiceInner from 'src/http/http.service';
import { HttpService } from '@nestjs/axios';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



});
 