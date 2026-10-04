import { Injectable, NotFoundException } from '@nestjs/common';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Learn NestJS',
      completed: false,
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

  create(title: string): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      completed: false,
    };

    this.tasks.push(task);

    return task;
  }

  update(id: number, title: string, completed: boolean): Task {
    const task = this.findOne(id);

    task.title = title;
    task.completed = completed;

    return task;
  }

  remove(id: number): void {
    const index = this.tasks.findIndex(task => task.id === id);

    if (index === -1) {
      throw new NotFoundException('Task not found');
    }

    this.tasks.splice(index, 1);
  }
}