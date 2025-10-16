import { PartialType } from '@nestjs/swagger';
import { CreateDomaineExpertiseDto } from './create-domaine-expertise.dto';

export class UpdateDomaineExpertiseDto extends PartialType(CreateDomaineExpertiseDto) {}