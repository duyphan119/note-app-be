import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateFolderInput {
  @Field({ nullable: false })
  name: string;
}
