import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status';

export interface Task {
  id: number;
  title: string | undefined;
  completed: boolean;
  status: TaskStatus;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
      status: 'todo',
    },
  ];

  private nextId = 2;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  create(
  title: string,
  completed: boolean,
  status: TaskStatus,
): Task {
  const task: Task = {
    id: this.nextId++,
    title,
    completed,
    status,
  };

  this.tasks.push(task);

  return task;
}

  update(
  id: number,
  title?: string,
  completed?: boolean,
  status?: TaskStatus,
) {
  const task = this.findOne(id);

  if (title !== undefined) {
    task.title = title;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }
  if (status !== undefined) {
    task.status = status;
  }

  return task;
}


  remove(id: number): void {
    const index = this.tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new NotFoundException('Task not found');
    }

    this.tasks.splice(index, 1);
  }

  findByStatus(status: TaskStatus): Task[] {
  return this.tasks.filter(task => task.status === status);
}
}