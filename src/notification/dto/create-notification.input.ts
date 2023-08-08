import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateNotificationInput {
  @Field()
  content: string;
}
