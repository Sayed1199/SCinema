import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpService } from 'src/http/http.service';
import { HttpModule } from 'src/http/http.module';

@Module({
  imports: [
    HttpModule.forFeature({
      serviceName: 'CustomHttpService',
      config: {
        baseURL: `${process.env.TMDB_BASE_URL}`,
        enableLogging: true,
        headers:{
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        }
      },
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
