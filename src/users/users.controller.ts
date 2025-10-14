import { Body, Controller, Get, Patch, Param, Req, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Profil connecté
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  // Mettre à jour son profil
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  // Voir un profil public
  @Get(':id')
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Liste de tous les utilisateurs (exemple admin)
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // Créer un utilisateur (exemple admin)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }
}
