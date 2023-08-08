import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "src/constants";
import { CreateAuthorInput } from "./dto/create-author.input";
import { LoginInput } from "./dto/login.input";
import { UpdateAuthorInput } from "./dto/update-author.input";
import { Author } from "./entities/author.entity";
import { AuthorResponse } from "./types/AuthorResponse";

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>
  ) {}
  async login(loginInput: LoginInput): Promise<AuthorResponse> {
    try {
      const { uid, ...input } = loginInput;
      let existingAuthor = await this.getByUID(uid);
      if (!existingAuthor) {
        const createdAuthor = new this.authorModel({ uid, ...input });
        existingAuthor = await createdAuthor.save();
      }
      return {
        author: await existingAuthor.save(),
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async getByUID(uid: string) {
    return this.authorModel.findOne({ uid }).exec();
  }

  create(createAuthorInput: CreateAuthorInput) {
    return "This action adds a new author";
  }

  findAll() {
    return `This action returns all author`;
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorInput: UpdateAuthorInput) {
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
