import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async findAll() {
    return this.categoriesRepo.findAll();
  }

  async create(dto: CreateCategoryDto) {
    return this.categoriesRepo.create(dto.name);
  }

  async remove(id: number) {
    const category = await this.categoriesRepo.findById(id);
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    await this.categoriesRepo.delete(id);
  }
}
