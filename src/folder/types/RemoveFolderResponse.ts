import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";

@ObjectType({ implements: IResponse })
export class RemoveFolderResponse implements IResponse {
  statusCode: number;
  message: string;

  @Field()
  isDeleted: boolean;
}
