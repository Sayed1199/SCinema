import { ApiProperty, ApiQuery } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {IsInt} from "class-validator";

export class GetMoviesDto{
    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    pageNo:number;
}