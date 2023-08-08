import { Field, ObjectType } from "@nestjs/graphql";
import { IResponse } from "src/common/types/IResponse";
import { Notification } from "../entities/notification.entity";

@ObjectType({ implements: IResponse })
export class UpdateNotificationResponse implements IResponse {
  message: string;
  statusCode: number;

  @Field()
  isUpdated: boolean;
}
