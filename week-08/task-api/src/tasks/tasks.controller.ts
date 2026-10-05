import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseTaskStatusPipe } from './parse-task-status.pipe';
import type { TaskStatus } from './task-status';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }
  @Get('status/:status')
findByStatus(
  @Param('status', ParseTaskStatusPipe) status: TaskStatus,
) {
  return this.tasksService.findByStatus(status);
}

  @Post()
  create(
    @Body() body: CreateTaskDto,
     @Body('status', ParseTaskStatusPipe) status: TaskStatus,
  ) {
    return this.tasksService.create(
      body.title,
      body.completed,
      status,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Body('status', ParseTaskStatusPipe) status?: TaskStatus,
  ) {
    return this.tasksService.update(
      Number(id),
      body.title,
      body.completed,
      status,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.tasksService.remove(Number(id));

    return {
      message: 'Task deleted successfully',
    };
  }
}