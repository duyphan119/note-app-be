import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";
import { Author } from "../entities/author.entity";

@ObjectType({ implements: IResponse })
export class AuthorResponse implements IResponse {
  statusCode: number;
  message: string;

  @Field(() => Author, { nullable: true })
  author: Author;
}
