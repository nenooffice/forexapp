import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  @ApiProperty({
    example: '1000',
    description: ' Add a Value to your wallet. (USD dollar)',
  })
  value: number;

  @ApiProperty({
    example: '',
    description: `Get's User Trade History`,
  })
  transactions: any[];
}
