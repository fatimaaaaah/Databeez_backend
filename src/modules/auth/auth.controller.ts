import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterWithOtpDto } from './dto/register-with-otp.dto';
import { LoginWithOtpDto } from './dto/login-with-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: "Inscription d'un nouvel utilisateur" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Inscription réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 409,
    description: 'Utilisateur déjà existant',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(createUserDto);
    return ApiResponseDto.success(result, 'Inscription réussie');
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Identifiants invalides',
  })
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ApiResponseDto.success(result, 'Connexion réussie');
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: "Rafraîchir le token d'accès" })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token rafraîchi avec succès',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de rafraîchissement invalide',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.refreshToken(refreshTokenDto);
    return ApiResponseDto.success(result, 'Token rafraîchi avec succès');
  }

  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req): Promise<ApiResponseDto<null>> {
    await this.authService.logout(req.user.id);
    return ApiResponseDto.success(null, 'Déconnexion réussie');
  }

  @Post('validate')
  @Public()
  @ApiOperation({ summary: 'Valider un token JWT' })
  @ApiBody({ type: ValidateTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token valide',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            user: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token manquant',
  })
  async validateToken(
    @Body() validateTokenDto: ValidateTokenDto,
  ): Promise<ApiResponseDto<{ valid: boolean; user?: any }>> {
    const result = await this.authService.validateToken(validateTokenDto.token);
    return ApiResponseDto.success(
      result,
      result.valid ? 'Token valide' : 'Token invalide',
    );
  }

  // ==================== ENDPOINTS OTP ====================

  @Post('send-otp')
  @Public()
  @ApiOperation({ summary: 'Envoyer un code OTP par email' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({
    status: 200,
    description: 'Code OTP envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou trop de tentatives',
  })
  async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
  ): Promise<ApiResponseDto<{ success: boolean; message: string }>> {
    const result = await this.authService.sendOtp(
      sendOtpDto.email,
      sendOtpDto.type,
    );
    return ApiResponseDto.success(result, 'Code OTP traité');
  }

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Vérifier un code OTP' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: 'Code OTP vérifié avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            otpId: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Code OTP invalide ou expiré',
  })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<ApiResponseDto<{ success: boolean; otpId?: string }>> {
    const result = await this.authService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
      verifyOtpDto.type,
    );
    return ApiResponseDto.success(result, 'Code OTP vérifié avec succès');
  }

  @Post('resend-otp')
  @Public()
  @ApiOperation({ summary: 'Renvoyer un code OTP existant' })
  @ApiBody({ type: ResendOtpDto })
  @ApiResponse({
    status: 200,
    description: 'Code OTP renvoyé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Aucun code récent trouvé ou trop de tentatives',
  })
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<ApiResponseDto<{ success: boolean; message: string }>> {
    const result = await this.authService.resendOtp(
      resendOtpDto.email,
      resendOtpDto.type,
    );
    return ApiResponseDto.success(result, 'Code OTP traité');
  }

  @Post('register-with-otp')
  @Public()
  @ApiOperation({ summary: 'Inscription avec vérification OTP' })
  @ApiBody({ type: RegisterWithOtpDto })
  @ApiResponse({
    status: 201,
    description: 'Inscription avec OTP réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Code OTP invalide',
  })
  @ApiResponse({
    status: 409,
    description: 'Utilisateur déjà existant',
  })
  async registerWithOtp(
    @Body() registerWithOtpDto: RegisterWithOtpDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.registerWithOtp(registerWithOtpDto);
    return ApiResponseDto.success(result, 'Inscription avec OTP réussie');
  }

  @Post('login-with-otp')
  @Public()
  @ApiOperation({ summary: 'Connexion avec code OTP' })
  @ApiBody({ type: LoginWithOtpDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion avec OTP réussie',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Code OTP invalide ou utilisateur introuvable',
  })
  async loginWithOtp(
    @Body() loginWithOtpDto: LoginWithOtpDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.loginWithOtp(loginWithOtpDto);
    return ApiResponseDto.success(result, 'Connexion avec OTP réussie');
  }
}
