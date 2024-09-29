import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetPeopleDataDto } from './dto/get-personId-dto';
import { PersonSearchDto } from './dto/person-search.dto';

@ApiTags("People")
@ApiBearerAuth('access-token')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiParam({ name: 'personID', required: true, type: GetPeopleDataDto})
  @ApiOperation({summary:"Person Details"})
  @Get('details/:personID')
  async getPersonDetails(@Param() personDataDto:GetPeopleDataDto):Promise<any>{
    var response = await this.peopleService.getPersonDetails(personDataDto.personID)
    response.data.profile_path = `${process.env.TMDB_IMAGE_BASE_URL}${response.data.profile_path}`;
    response.data.gender = response.data.gender == 0 ?"Male" : "Female"
    return {
      success: true,
      data: response.data
    }
  }


  @ApiParam({ name: 'personID', required: true, type: GetPeopleDataDto})
  @ApiOperation({summary:"Person Images"})
  @Get('images/:personID')
  async getPersonImages(@Param() personDataDto:GetPeopleDataDto):Promise<any>{
    var response = await this.peopleService.getPersonImages(personDataDto.personID)
    var imagesList:string[] = response.data.profiles.map((value, index, array) => {
      return `${process.env.TMDB_IMAGE_BASE_URL}${value.file_path}`;
    }); 
    return {
      success: true,
      data: {
        images: imagesList
      }
    }
  }

  @ApiBody({ required: true, type: PersonSearchDto})
  @ApiOperation({summary:"Search Person"})
  @Post('search')
  async searchPerson(@Body() personSearchDto:PersonSearchDto):Promise<any>{
    var response = await this.peopleService.searchPersons(personSearchDto.query,personSearchDto.pageNo)
    return {
      success: true,
      data: {
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
        results: response.data.results.map((value) => {
          value.gender == 0 ? "Female" : "Male";
          value.profile_path = `${process.env.TMDB_IMAGE_BASE_URL}${value.profile_path}`
          value.known_for.map((innerVal) => {
            innerVal.backdrop_path = `${process.env.TMDB_IMAGE_BASE_URL}${innerVal.backdrop_path}`;
            innerVal.poster_path = `${process.env.TMDB_IMAGE_BASE_URL}${innerVal.poster_path}`;
          })
          return value;
        })
      }
    }
  }

}
 