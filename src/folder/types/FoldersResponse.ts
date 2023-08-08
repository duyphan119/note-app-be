import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";
import { Folder } from "../entities/folder.entity";

@ObjectType({ implements: IResponse })
export class FoldersResponse implements IResponse {
  statusCode: number;
  message: string;

  @Field(() => [Folder])
  folders: Folder[];

  @Field()
  count: number;

  @Field()
  totalPages: number;
}
