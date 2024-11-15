import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail(undefined, {
    message: 'E-mail inválido',
    always: true,
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}