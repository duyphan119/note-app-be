import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "src/note/entities/note.entity";
import { Folder, FolderSchema } from "./entities/folder.entity";
import { FolderResolver } from "./folder.resolver";
import { FolderService } from "./folder.service";

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
  providers: [FolderResolver, FolderService],
})
export class FolderModule {}
