import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
// import { ApiModelProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  // @ApiModelProperty({
  //   example: 'pejman@gmail.com',
  //   description: 'The email of the User',
  //   format: 'email',
  //   uniqueItems: true,
  //   minLength: 5,
  //   maxLength: 255,
  // })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  // @ApiModelProperty({
  //   example: 'secret password change me!',
  //   description: 'The password of the User',
  //   format: 'string',
  //   minLength: 5,
  //   maxLength: 1024,
  // })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  readonly password: string;
}
