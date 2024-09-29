import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha } from "class-validator";

export class UpdateUsernameDto{
    @ApiProperty(
        {
          required:true,
          example:"sayed"
        }
      )
      @IsAlpha()
      username?: string;
}