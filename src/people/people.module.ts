import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
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
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
