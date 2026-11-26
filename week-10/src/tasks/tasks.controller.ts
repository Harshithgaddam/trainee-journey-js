import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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

  // GET /tasks
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // GET /tasks/status/:status
  @Get('status/:status')
  findByStatus(
    @Param('status', ParseTaskStatusPipe) status: TaskStatus,
  ) {
    return this.tasksService.findByStatus(status);
  }

  // GET /tasks/:id
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(id);
  }

  // POST /tasks
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

  // PATCH /tasks/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
    @Body('status', ParseTaskStatusPipe) status?: TaskStatus,
  ) {
    return this.tasksService.update(
      id,
      body.title,
      body.completed,
      status,
    );
  }

  // DELETE /tasks/:id
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.tasksService.remove(id);

    return {
      message: 'Task deleted successfully',
    };
  }
}