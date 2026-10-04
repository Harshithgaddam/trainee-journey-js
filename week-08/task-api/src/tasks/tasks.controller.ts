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

  @Post()
  create(@Body() body: { title: string }) {
    return this.tasksService.create(body.title);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: {
      title: string;
      completed: boolean;
    },
  ) {
    return this.tasksService.update(
      Number(id),
      body.title,
      body.completed,
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