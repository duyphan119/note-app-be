import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "src/constants";
import { Note } from "src/note/entities/note.entity";
import { CreateFolderInput } from "./dto/create-folder.input";
import { FolderQueryParamsInput } from "./dto/folder-query-params.input";
import { UpdateFolderInput } from "./dto/update-folder.input";
import { Folder } from "./entities/folder.entity";
import { FolderResponse } from "./types/FolderResponse";
import { FoldersResponse } from "./types/FoldersResponse";
import { RemoveFolderResponse } from "./types/RemoveFolderResponse";
import { UpdateFolderResponse } from "./types/UpdateFolderResponse";

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private readonly folderModel: Model<Folder>,
    @InjectModel(Note.name)
    private readonly noteModel: Model<Note>
  ) {}
  async create(
    createFolderInput: CreateFolderInput,
    authorId: string
  ): Promise<FolderResponse> {
    try {
      const createdFolder = new this.folderModel({
        authorId: authorId,
        ...createFolderInput,
      });
      const savedFolder = await createdFolder.save();
      return {
        folder: savedFolder,
        message: Message.SUCCESS,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    folderQueryParamsInput: FolderQueryParamsInput,
    authorId: string
  ): Promise<FoldersResponse> {
    try {
      const { limit, p, sortBy, sortType } = folderQueryParamsInput;

      const count = await this.folderModel.count();

      let totalPages = 1;
      let query = this.folderModel.find({ authorId });

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

      const folders = await query.exec();
      return {
        count,
        folders,
        totalPages,
        statusCode: HttpStatus.OK,
        message: Message.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} folder`;
  }

  async checkMyFolder(folderId: string, authorId: string): Promise<Folder> {
    try {
      const existingFolder = await this.folderModel
        .findOne({ _id: folderId, authorId })
        .exec();

      if (!existingFolder) {
        throw new UnauthorizedException("This folder is not yours");
      }
      return existingFolder;
    } catch (error) {
      throw error;
    }
  }

  async update(
    { id, ...updateFolderInput }: UpdateFolderInput,
    authorId: string
  ): Promise<UpdateFolderResponse> {
    try {
      await this.checkMyFolder(id, authorId);

      const updatedFolder = await this.folderModel.findByIdAndUpdate(
        id,
        updateFolderInput
      );

      return {
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
        isUpdated: updatedFolder ? true : false,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeFolders(
    idList: string[],
    authorId: string
  ): Promise<RemoveFolderResponse> {
    try {
      const myFolders = await this.folderModel
        .find({
          _id: {
            $in: idList,
          },
          authorId,
        })
        .exec();

      if (myFolders.length !== idList.length) {
        throw new ForbiddenException();
      }
      await this.noteModel.deleteMany({
        folderId: {
          $in: idList,
        },
      });
      const result = await this.folderModel.deleteMany({
        _id: {
          $in: idList,
        },
        authorId,
      });
      return {
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
        isDeleted: result.deletedCount > 0,
      };
    } catch (error) {
      throw error;
    }
  }

  async findNotes(folder: Folder): Promise<Note[]> {
    try {
      const notes = await this.noteModel
        .find({ folderId: folder.id })
        .sort({ createdAt: "desc" })
        .exec();
      return notes;
    } catch (error) {
      throw error;
    }
  }
}
