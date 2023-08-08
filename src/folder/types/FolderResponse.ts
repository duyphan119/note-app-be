import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";
import { Folder } from "../entities/folder.entity";

@ObjectType({ implements: IResponse })
export class FolderResponse implements IResponse {
  statusCode: number;
  message: string;

  @Field(() => Folder)
  folder: Folder;
}
