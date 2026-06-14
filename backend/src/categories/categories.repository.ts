import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(name: string): Promise<Category> {
    const category = this.repo.create({ name });
    return this.repo.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.repo.manager
      .createQueryBuilder()
      .delete()
      .from('note_categories_category')
      .where('"categoryId" = :id', { id })
      .execute();
    await this.repo.delete(id);
  }
}
