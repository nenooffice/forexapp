// import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// import { WalletsService } from './wallets.service';
// import { CreateWalletDto } from './dto/create-wallet.dto';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiTags('wallet')
// @Controller('wallet')
// export class WalletsController {
//   constructor(private readonly walletsService: WalletsService) {}

//   @Post()
//   @ApiOperation({
//     summary: 'Adds your wallet a value',
//   })
//   create(@Body() createWalletDto: CreateWalletDto) {
//     return this.walletsService.create(createWalletDto);
//   }

//   @Get(':id')
//   @ApiOperation({
//     summary: 'Show Wallet related per ID.',
//   })
//   findOne(@Param('id') id: string) {
//     return this.walletsService.findOne(id);
//   }
// }
