import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateNoteInput {
  @Field({ nullable: false })
  folderId: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: true })
  content: string;
}
