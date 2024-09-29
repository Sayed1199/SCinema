import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from 'src/http/http.service';

@Injectable()
export class PeopleService {
    constructor(
        @Inject('CustomHttpService')
        private readonly httpService: HttpService,
    ){}

    async getPersonDetails(personID: number):Promise<any>{
        return await this.httpService.get(`/person/${personID}`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async getPersonImages(personID: number) : Promise<any>{
        return await this.httpService.get(`/person/${personID}/images`,{
            params:{
                adult:process.env.SUPPORTS_ADULTS
            }
        })
    }

    async searchPersons(searchKey:string,pageNo:number) : Promise<any>{
        return await this.httpService.get(`/search/person`,{
            params:{
                include_adult:process.env.SUPPORTS_ADULTS,
                page:pageNo,
                query: searchKey
            }
        })
    }

}
