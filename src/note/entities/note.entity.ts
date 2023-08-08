import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Folder } from "src/folder/entities/folder.entity";

@ObjectType()
@Schema({ timestamps: true })
export class Note {
  @Field()
  id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ default: "<p></p>" })
  content: string;

  @Field()
  @Prop({ required: true })
  folderId: string;

  @Field(() => Folder)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Folder" })
  folder: Folder;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
export const NoteSchema = SchemaFactory.createForClass(Note);
