import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "src/constants";
import { Folder } from "src/folder/entities/folder.entity";
import { FolderService } from "src/folder/folder.service";
import { CreateNoteInput } from "./dto/create-note.input";
import { NoteQueryParamsInput } from "./dto/note-query-params.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { Note } from "./entities/note.entity";
import { NoteResponse } from "./types/NoteResponse";
import { NotesResponse } from "./types/NotesResponse";
import { RemoveNoteResponse } from "./types/RemoveNoteResponse";
import { UpdateNoteResponse } from "./types/UpdateNoteResponse";

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<Note>,
    @InjectModel(Folder.name)
    private readonly folderModel: Model<Folder>,
    private readonly folderService: FolderService
  ) {}

  async create(
    { folderId, ...createNoteInput }: CreateNoteInput,
    authorId: string
  ): Promise<NoteResponse> {
    try {
      await this.folderService.checkMyFolder(folderId, authorId);

      const createdNote = new this.noteModel({
        folderId,
        ...createNoteInput,
      });

      const savedNote = await createdNote.save();

      return {
        note: savedNote,
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    noteQueryParamsInput: NoteQueryParamsInput,
    authorId: string
  ): Promise<NotesResponse> {
    const { folderId, limit, p, sortBy, sortType } = noteQueryParamsInput;
    try {
      await this.folderService.checkMyFolder(folderId, authorId);

      const count = await this.noteModel.count();

      let totalPages = 1;
      let query = this.noteModel.find({ folderId });

      if (limit) {
        if (p) {
          query = query.skip((p - 1) * limit);
        }
        query = query.limit(limit);
        totalPages = Math.ceil(count / limit);
      }

      if (sortBy && sortType) {
        query = query.sort({
          [sortBy]:
            sortType === "asc" || sortType === "ascending" ? "asc" : "desc",
        });
      }

      const notes = await query.exec();
      return {
        count,
        notes,
        totalPages,
        statusCode: HttpStatus.OK,
        message: Message.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, authorId: string): Promise<NoteResponse> {
    try {
      const existingNote = await this.noteModel.findById(id).exec();

      if (existingNote) {
        await this.folderService.checkMyFolder(existingNote.folderId, authorId);

        return {
          note: existingNote,
          message: Message.SUCCESS,
          statusCode: HttpStatus.OK,
        };
      }
      throw new NotFoundException();
    } catch (error) {
      throw error;
    }
  }

  async update(
    { id, ...updateNoteInput }: UpdateNoteInput,
    authorId: string
  ): Promise<UpdateNoteResponse> {
    try {
      const existingNote = await this.noteModel.findById(id).exec();

      if (existingNote) {
        await this.folderService.checkMyFolder(existingNote.folderId, authorId);

        const result = await this.noteModel.updateOne(
          { _id: id },
          updateNoteInput
        );

        return {
          isUpdated: result.matchedCount > 0,
          message: Message.SUCCESS,
          statusCode: HttpStatus.OK,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async removeNotes(
    idList: string[],
    authorId: string
  ): Promise<RemoveNoteResponse> {
    try {
      const myNotes = await this.noteModel
        .find({
          _id: {
            $in: idList,
          },
        })
        .exec();

      const folderIdList = [];

      myNotes.forEach((item) => {
        if (!folderIdList.includes(item.folderId)) {
          folderIdList.push(item.folderId);
        }
      });

      const myFolders = await this.folderModel
        .find({
          _id: {
            $in: folderIdList,
          },
          authorId,
        })
        .exec();

      if (folderIdList.length !== myFolders.length) {
        throw new ForbiddenException();
      }
      const result = await this.noteModel.deleteMany({
        _id: {
          $in: idList,
        },
      });

      if (result.deletedCount === 0) {
        throw new NotFoundException();
      }

      return {
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
        isDeleted: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
