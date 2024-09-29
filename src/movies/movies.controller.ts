import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MovieModel } from 'src/interfaces/movie.interface';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetMovieDetailsDto } from './dto/get-movie-details.dto';
import { MovieDetailsModel } from 'src/interfaces/movie-details.interface';
import { VideoModel } from 'src/interfaces/video.interface';
import { plainToInstance, TransformPlainToInstance } from 'class-transformer';
import { PersonSearchDto } from 'src/people/dto/person-search.dto';

@ApiTags("Movies")
@ApiBearerAuth('access-token')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,

  ) {
  }


  @ApiQuery({ name: 'pageNo', required: true,type:GetMoviesDto})
  @ApiOperation({summary:"Now Playing Movies By Page"})
  @Get('now-playing')
  async getNowPlayingMovies(@Query() getMovieDto: GetMoviesDto ):Promise<any>{
    var response = await this.moviesService.findNowPlayingMovies(getMovieDto.pageNo)
    return this.handleMoviesResponse(response);
  }

  @ApiQuery({ name: 'pageNo', required: true,type:GetMoviesDto})
  @ApiOperation({summary:"Popular Movies By Page"})
  @Get('popular')
  async getPopularMovies(@Query() getMovieDto: GetMoviesDto ):Promise<any>{
    var response = await this.moviesService.findPopularMovies(getMovieDto.pageNo)
    return this.handleMoviesResponse(response);
  }

  @ApiQuery({ name: 'pageNo', required: true,type:GetMoviesDto})
  @ApiOperation({summary:"TopRated Movies By Page"})
  @Get('top-rated')
  async getTopRatedMovies(@Query() getMovieDto: GetMoviesDto ):Promise<any>{
    var response = await this.moviesService.findTopRatedMovies(getMovieDto.pageNo)
    return this.handleMoviesResponse(response);
  }

  @ApiQuery({ name: 'pageNo', required: true,type:GetMoviesDto})
  @ApiOperation({summary:"Upcoming Movies By Page"})
  @Get('upcoming')
  async getUpcomingMovies(@Query() getMovieDto: GetMoviesDto ):Promise<any>{
    var response = await this.moviesService.findUpcomingMovies(getMovieDto.pageNo)
    return this.handleMoviesResponse(response);
  }
 

  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiOperation({summary:"Get Movie Details."})
  @Get(':id')
  async getMovieDetails(@Param('id') id:string):Promise<any>{
    var response = await this.moviesService.findMovieDetails(id)
    response.data.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${response.data.backdrop_path}`;
    response.data.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${response.data.poster_path}`;
    var movideDetails : MovieDetailsModel = response.data;
    return {
      success : true,
      movieData : movideDetails
    };
  }
   
 
  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiQuery({name:'pageNo',required:false,type:GetMoviesDto})
  @ApiOperation({summary:"Get Movies Recommendations"})
  @Get('recommendations/:id')
  async getMovieRecommendations(@Param('id') id:string, @Query('pageNo',new ParseIntPipe()) pageNo: number):Promise<any>{
    var response = await this.moviesService.findMovieRecommendations(id,pageNo)
    var movies:MovieModel[]=[];
    for(var i of response.data.results){
      i.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.backdrop_path}`;
      i.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.poster_path}`;
      movies.push(i)
    }
    return {
      success : true,
      data : {
        movies,
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results
      }
    };
  }


  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiQuery({name:'pageNo',required:false,type:GetMoviesDto})
  @ApiOperation({summary:"Get Similar Movies"})
  @Get('similar/:id')
  async getSimilarMovies(@Param('id') id:string, @Query('pageNo',new ParseIntPipe()) pageNo: number):Promise<any>{
    var response = await this.moviesService.findSimilarMovies(id,pageNo)
    var movies:MovieModel[]=[];
    for(var i of response.data.results){
      i.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.backdrop_path}`;
      i.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.poster_path}`;
      movies.push(i)
    }
    return {
      success : true,
      data : {
        movies,
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results
      }
    };
  }


  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiOperation({summary:"Get Movies Images"})
  @Get('images/:id')
  async getMovieImages(@Param('id') id:string):Promise<any>{
    var response = await this.moviesService.findMovieImages(id)
    var posters : string[] = response.data.posters.map((poster, index, array) => `${process.env.TMDB_IMAGE_BASE_URL}${poster.file_path}`)
    var logos : string[] = response.data.logos.map((logo, index, array) => `${process.env.TMDB_IMAGE_BASE_URL}${logo.file_path}`)
    var backdrops : string[] = response.data.backdrops.map((backdrop, index, array) => `${process.env.TMDB_IMAGE_BASE_URL}${backdrop.file_path}`)
    return {
      success : true,
      data : {
        posters,
        backdrops,
        logos
      }
    };
  }
 

  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiOperation({summary:"Get Movies Videos"})
  @Get('videos/:id')
  async getMovieVideos(@Param('id') id:string):Promise<any>{
    var response = await this.moviesService.findMovieVideos(id)
    var videos:VideoModel[] = response.data.results.map((value, index, array) => 
      ({
      name:value.name,
      key:value.key,
      site: value.site,
      size:value.size,
      type:value.type,
      official:value.official,
      published_at:value.published_at,
      id: value.id
    })
  );
    return {
      success : true,
      data : {
        videos
      }
    };
  }

  @ApiParam({ name: 'id', required: true,type:GetMovieDetailsDto})
  @ApiOperation({summary:"Get Movies Cast & Crew"})
  @Get('people/:id')
  async getMovieCastAndCrew(@Param('id') id:string):Promise<any>{
    var response = await this.moviesService.findCastAndCrew(id);

    return {
      success : true,
      data : {
        cast: response.data.cast,
        crew: response.data.crew
      }
    };
  }

  @ApiBody({ required: true, type: PersonSearchDto})
  @ApiOperation({summary:"Search Movies"})
  @Post('search')
  async searchPerson(@Body() personSearchDto:PersonSearchDto):Promise<any>{
    var response = await this.moviesService.searchMovie(personSearchDto.query,personSearchDto.pageNo)
    return {
      success: true,
      data: {
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
        results: response.data
        .results.map((value) => {
          value.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${value.backdrop_path}`
          value.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${value.poster_path}`
          return value;
        })
        
      }
    }
  }
  


 



  handleMoviesResponse(response):any{
    var moviesList:MovieModel[] = [];
    for(var i of response.data.results){
      i.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.backdrop_path}`;
      i.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${i.poster_path}`;
      moviesList.push(i)
    }
    return {
      success: true,
      data:{
      curPage: response.data.page,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
      movies: moviesList
      }
    }   
  }



}
 