import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Query('archived') archived?: string, @Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.notesService.findByCategory(+categoryId);
    }
    const isArchived = archived === 'true' ? true : archived === 'false' ? false : undefined;
    return this.notesService.findAll(isArchived);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateNoteDto) {
    return this.notesService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @Patch(':id/archive')
  toggleArchive(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.toggleArchive(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.remove(id);
  }

  @Post(':id/categories')
  addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.notesService.addCategory(id, categoryId);
  }

  @Delete(':id/categories/:categoryId')
  removeCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.notesService.removeCategory(id, categoryId);
  }
}
