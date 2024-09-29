import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class PersonSearchDto{
    @ApiProperty()
    @IsNotEmpty()
    query:string;

    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    pageNo:number;
}