import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class GetPeopleDataDto{
    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    personID:number;
}