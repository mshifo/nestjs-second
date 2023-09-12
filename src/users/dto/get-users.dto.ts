import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetUsersDto {
  /**
   * Current page
   */
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @ApiPropertyOptional()
  page = 1;

  /**
   * Number of items per page
   */
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(100) // limit the size of 'limit' to 100 records
  @ApiPropertyOptional()
  limit = 10;
}
