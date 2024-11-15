import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail(undefined, {
    message: 'E-mail inválido',
    always: true,
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  password: string;
}

export class BasicUserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdateUserDTO {
  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ maxLength: 100 })
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail(undefined, {
    message: 'E-mail inválido',
    always: true,
  })
  email: string;
}