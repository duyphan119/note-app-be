import { Field, InterfaceType } from "@nestjs/graphql";

@InterfaceType()
export abstract class IResponse {
  @Field()
  statusCode: number;

  @Field((_type) => String)
  message: string;
}
