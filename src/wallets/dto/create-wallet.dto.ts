import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @ApiProperty({
    example: '1000',
    description: ' Add a Value to your wallet. (USD dollar)',
  })
  valueUSD: string;

  @IsString()
  @ApiProperty({
    example: '1000',
    description: ' Add a Value to your wallet. (GBP pound)',
  })
  valueGBP: string;
}
