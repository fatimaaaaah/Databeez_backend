import { IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Numéro de page', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Nombre d\'éléments par page', default: 10, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Recherche textuelle' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Tri par champ' })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Ordre de tri (asc/desc)', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} 