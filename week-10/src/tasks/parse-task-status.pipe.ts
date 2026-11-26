import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { TASK_STATUSES } from './task-status';

@Injectable()
export class ParseTaskStatusPipe implements PipeTransform {
  transform(value: string) {
    if (!TASK_STATUSES.includes(value as any)) {
      throw new BadRequestException('Invalid task status');
    }

    return value;
  }
}