import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from 'src/http/http.service';

@Injectable()
export class MoviesService {
    constructor(
        @Inject('CustomHttpService')
        private readonly httpService: HttpService,
    ){}


    async findNowPlayingMovies(pageNo:number) : Promise<any>{
        return await this.httpService.get('/movie/now_playing',{
            params:{
                language:"en-US",
                page:pageNo,
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async findPopularMovies(pageNo:number) : Promise<any>{
        return await this.httpService.get('/movie/popular',{
            params:{
                language:"en-US",
                page:pageNo,
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async findTopRatedMovies(pageNo:number) : Promise<any>{
        return await this.httpService.get('/movie/top_rated',{
            params:{
                language:"en-US",
                page:pageNo,
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async findUpcomingMovies(pageNo:number) : Promise<any>{
        return await this.httpService.get('/movie/upcoming',{
            params:{
                language:"en-US",
                page:pageNo,
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async findMovieDetails(movieID:string) : Promise<any>{
        return await this.httpService.get(`/movie/${movieID}`,{
            params:{
                language:"en-US",
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async findMovieRecommendations(movieID: string,pageNo:number) : Promise<any>{
        return await this.httpService.get(`/movie/${movieID}/recommendations`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS,
                page:pageNo,
            }
        })
    }

    async findSimilarMovies(movieID: string,pageNo:number) : Promise<any>{
        return await this.httpService.get(`/movie/${movieID}/similar`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS,
                page:pageNo,
            }
        })
    }

    async findMovieImages(movieID:string) : Promise<any>{ 
        return await this.httpService.get(`/movie/${movieID}/images`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    } 

    async findMovieVideos(movieID:string) : Promise<any>{ 
        return await this.httpService.get(`/movie/${movieID}/videos`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    } 

    async findCastAndCrew(movieID: string) : Promise<any>{
        return await this.httpService.get(`/movie/${movieID}/credits`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }
 
    async searchMovie(searchKey:string,pageNo:number) : Promise<any>{
        return await this.httpService.get(`/search/movie`,{
            params:{
                include_adult:process.env.SUPPORTS_ADULTS,
                page:pageNo,
                query: searchKey
            }
        })
    }
    

}
