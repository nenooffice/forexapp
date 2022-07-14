import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Eugenio',
    description: 'Users name.',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'aaaaa@aaa.com',
    description: 'Users email.',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Too weak',
  })
  @ApiProperty({
    example: '@Admin1234',
    description:
      'The users password must contain: a symbol, a number, an upper case and a lower case, minimum 8 characters lenght',
  })
  password: string;

  @ApiProperty({
    example: '',
    description: `Wallet's info.`,
  })
  wallet: string;
}
