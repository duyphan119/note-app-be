import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateAuthorInput {
  @Field({ nullable: false })
  uid: string;

  @Field({ nullable: false })
  name: string;

  @Field({ nullable: false })
  avatar: string;
}
