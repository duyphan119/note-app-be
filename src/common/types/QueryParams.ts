import { Field, InputType } from "@nestjs/graphql";

@InputType("QueryParams")
export class QueryParams {
  @Field({ nullable: true })
  limit?: number | null;

  @Field({ nullable: true })
  p?: number | null;

  @Field({ nullable: true })
  sortBy?: string | null;

  @Field({ nullable: true })
  sortType?: string | null;
}
