import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserProfileDto } from './dto/user-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 409,
    description: 'Utilisateur déjà existant',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.create(createUserDto);
    return ApiResponseDto.success(user, 'Utilisateur créé avec succès');
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs (Admin uniquement)' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès',
    type: PaginatedResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<ApiResponseDto<PaginatedResponseDto<UserResponseDto>>> {
    const users = await this.userService.findAll(paginationDto);
    return ApiResponseDto.success(users, 'Liste des utilisateurs récupérée avec succès');
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil utilisateur récupéré avec succès',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  async getProfile(@CurrentUser() userId: string): Promise<ApiResponseDto<UserProfileDto>> {
    const user = await this.userService.findOne(userId);
    return ApiResponseDto.success(user, 'Profil utilisateur récupéré avec succès');
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur récupéré avec succès',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<UserProfileDto>> {
    const user = await this.userService.findOne(id);
    return ApiResponseDto.success(user, 'Utilisateur récupéré avec succès');
  }

  @Patch('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mettre à jour le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit avec un autre utilisateur',
  })
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.update(userId, updateUserDto);
    return ApiResponseDto.success(user, 'Profil mis à jour avec succès');
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (Admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.update(id, updateUserDto);
    return ApiResponseDto.success(user, 'Utilisateur mis à jour avec succès');
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 204,
    description: 'Utilisateur supprimé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès interdit',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Patch(':id/verify')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vérifier un utilisateur (Admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur vérifié avec succès',
    type: UserResponseDto,
  })
  async verifyUser(@Param('id') id: string): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.verifyUser(id);
    return ApiResponseDto.success(user, 'Utilisateur vérifié avec succès');
  }

  @Patch(':id/deactivate')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Désactiver un utilisateur (Admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur désactivé avec succès',
    type: UserResponseDto,
  })
  async deactivateUser(@Param('id') id: string): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.deactivateUser(id);
    return ApiResponseDto.success(user, 'Utilisateur désactivé avec succès');
  }

  @Patch(':id/activate')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activer un utilisateur (Admin uniquement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur activé avec succès',
    type: UserResponseDto,
  })
  async activateUser(@Param('id') id: string): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.userService.activateUser(id);
    return ApiResponseDto.success(user, 'Utilisateur activé avec succès');
  }
} 