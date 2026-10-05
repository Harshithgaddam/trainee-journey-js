import {
  IsBoolean,
  IsString,
  MinLength,
} from 'class-validator';
import type { TaskStatus } from '../task-status';
export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  status: TaskStatus;
}