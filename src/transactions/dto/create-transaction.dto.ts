import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/(?=.*[A-Z])/)
  @ApiProperty({
    example: 'USD',
    description: 'Insert here the actual currency of your amount.',
  })
  currencyActual: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/(?=.*[A-Z])/)
  @ApiProperty({
    example: 'GBP',
    description: 'Insert here the wanted currency to convert.',
  })
  currencyWanted: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({
    example: '$ 1000,00',
    description: 'Insert here your actual currency and trade value wanted.',
  })
  tradeValue: string;

  @ApiProperty({
    example: 'Will receive the convert value, from wanted currency.',
    description: '£ 850,00',
  })
  currencyValue: string;
  id: any;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
