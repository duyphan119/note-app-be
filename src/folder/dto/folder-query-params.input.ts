import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FolderQueryParamsInput {
  @Field({ nullable: true })
  limit: number;

  @Field({ nullable: true })
  p: number;

  @Field({ nullable: true })
  sortBy: string;

  @Field({ nullable: true })
  sortType: string;
}
