import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Folder } from "src/folder/entities/folder.entity";

@ObjectType()
@Schema({ timestamps: true })
export class Author {
  @Field()
  @Prop({ required: true, unique: true })
  uid: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  avatar: string;

  @Field(() => [Folder])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }] })
  folders: Folder[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
