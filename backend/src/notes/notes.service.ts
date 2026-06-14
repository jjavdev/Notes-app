import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NotesRepository } from './notes.repository';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepo: NotesRepository,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(archived?: boolean): Promise<Note[]> {
    return this.notesRepo.findAll(archived);
  }

  async findByCategory(categoryId: number): Promise<Note[]> {
    return this.notesRepo.findByCategory(categoryId);
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepo.findById(id);
    if (!note) throw new NotFoundException(`Note #${id} not found`);
    return note;
  }

  async create(dto: CreateNoteDto): Promise<Note> {
    const categories = dto.categoryIds?.length
      ? await this.categoryRepo.findBy({ id: In(dto.categoryIds) })
      : [];
    return this.notesRepo.create({ ...dto, categories });
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    await this.findOne(id);
    const categories = dto.categoryIds !== undefined
      ? dto.categoryIds.length
        ? await this.categoryRepo.findBy({ id: In(dto.categoryIds) })
        : []
      : undefined;
    const updated = await this.notesRepo.update(id, {
      ...dto,
      ...(categories !== undefined && { categories }),
    });
    if (!updated) throw new NotFoundException(`Note #${id} not found`);
    return updated;
  }

  async toggleArchive(id: number): Promise<Note> {
    const note = await this.findOne(id);
    return this.notesRepo.update(id, { isArchived: !note.isArchived }) as Promise<Note>;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.notesRepo.delete(id);
  }

  async addCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findOne(noteId);
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException(`Category #${categoryId} not found`);
    if (!note.categories.find((c) => c.id === categoryId)) {
      note.categories.push(category);
      await this.notesRepo.update(noteId, { categories: note.categories });
    }
    return this.findOne(noteId);
  }

  async removeCategory(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.findOne(noteId);
    note.categories = note.categories.filter((c) => c.id !== categoryId);
    await this.notesRepo.update(noteId, { categories: note.categories });
    return this.findOne(noteId);
  }
}
