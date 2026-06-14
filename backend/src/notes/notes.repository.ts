import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly repo: Repository<Note>,
  ) {}

  async findAll(archived?: boolean): Promise<Note[]> {
    const where = archived !== undefined ? { isArchived: archived } : {};
    return this.repo.find({ where, relations: ['categories'], order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Note | null> {
    return this.repo.findOne({ where: { id }, relations: ['categories'] });
  }

  async findByCategory(categoryId: number): Promise<Note[]> {
    return this.repo
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('note.isArchived = :isArchived', { isArchived: false })
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }

  async create(data: Partial<Note>): Promise<Note> {
    const note = this.repo.create(data);
    return this.repo.save(note);
  }

  async update(id: number, data: Partial<Note>): Promise<Note | null> {
    const note = await this.findById(id);
    if (!note) return null;
    Object.assign(note, data);
    return this.repo.save(note);
  }

  async delete(id: number): Promise<void> {
    await this.repo.manager
      .createQueryBuilder()
      .delete()
      .from('note_categories_category')
      .where('"noteId" = :id', { id })
      .execute();
    await this.repo.delete(id);
  }
}
