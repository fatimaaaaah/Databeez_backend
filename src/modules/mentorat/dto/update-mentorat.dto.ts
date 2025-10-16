import { PartialType } from '@nestjs/swagger';
import { CreateMentoratDto } from './create-mentorat.dto';

export class UpdateMentoratDto extends PartialType(CreateMentoratDto) {}