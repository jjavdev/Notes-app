import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Category]), AuthModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
