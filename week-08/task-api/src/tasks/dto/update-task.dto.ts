import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import type { TaskStatus } from '../task-status';
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string | undefined;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
  @IsOptional()
  @IsString()
  status?: TaskStatus;
}