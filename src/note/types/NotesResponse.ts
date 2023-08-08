import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";
import { Note } from "../entities/note.entity";

@ObjectType({ implements: IResponse })
export class NotesResponse implements IResponse {
  statusCode: number;
  message: string;

  @Field(() => [Note])
  notes: Note[];

  @Field()
  count: number;

  @Field()
  totalPages: number;
}
