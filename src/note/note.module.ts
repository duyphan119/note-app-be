import { Module } from "@nestjs/common";
import { NoteService } from "./note.service";
import { NoteResolver } from "./note.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "./entities/note.entity";
import { Folder, FolderSchema } from "src/folder/entities/folder.entity";
import { FolderService } from "src/folder/folder.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
      {
        name: Folder.name,
        schema: FolderSchema,
      },
    ]),
  ],
  providers: [NoteResolver, NoteService, FolderService],
})
export class NoteModule {}
