import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto.user';
import { User } from './entity/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  create(@Body() dto: CreateUserDto): Promise<User | void> {
    return this.usersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'List user by ID',
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user info',
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User | void> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletes an user.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
