import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Notification {
  @Field()
  id: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  @Field(() => [String])
  seenIds: string[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
