import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ListDirectoryDto {
  @IsString()
  path: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}