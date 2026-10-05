import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { TASK_STATUSES, TaskStatus } from './task-status';

@Injectable()
export class ParseTaskStatusPipe
  implements PipeTransform<string | undefined, TaskStatus | undefined>
{
  transform(value: string | undefined): TaskStatus | undefined {
    if (value === undefined) {
      return undefined;
    }
    if (!TASK_STATUSES.includes(value as TaskStatus)) {
      throw new BadRequestException(
        `Invalid task status. Allowed values: ${TASK_STATUSES.join(', ')}`,
      );
    }

    return value as TaskStatus;
  }
}