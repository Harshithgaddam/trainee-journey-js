import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../database/entities/task.entity';
import { User } from '../database/entities/user.entity';

import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // GET /tasks
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  // GET /tasks/:id
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // POST /tasks
  async create(
    title: string,
    completed: boolean,
    status: TaskStatus,
  ): Promise<Task> {
    // Find the default user.
    const user = await this.userRepository.findOneBy({
      handle: 'default',
    });

    if (!user) {
      throw new InternalServerErrorException(
        'Default user not found. Run database migrations.',
      );
    }

    // Create a task and associate it with the default user.
    const task = this.taskRepository.create({
      title,
      completed,
      status,
      user,
    });

    return this.taskRepository.save(task);
  }

  // PATCH /tasks/:id
  async update(
    id: number,
    title?: string,
    completed?: boolean,
    status?: TaskStatus,
  ): Promise<Task> {
    const task = await this.findOne(id);

    if (title !== undefined) {
      task.title = title;
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    if (status !== undefined) {
      task.status = status;
    }

    return this.taskRepository.save(task);
  }

  // DELETE /tasks/:id
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);
  }

  // GET /tasks/status/:status
  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        status,
      },
      order: {
        id: 'ASC',
      },
    });
  }
}