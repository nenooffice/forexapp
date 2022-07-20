import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  @ApiProperty({
    example: '1000',
    description: ' Add a Value to your wallet. (USD dollar)',
  })
  valueUSD: number;

  @IsNumber()
  @ApiProperty({
    example: '1000',
    description: ' Add a Value to your wallet. (GBP pound)',
  })
  valueGBP: number;
}
