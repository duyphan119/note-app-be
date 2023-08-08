import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Author } from "src/author/entities/author.entity";
import { Note } from "src/note/entities/note.entity";

@ObjectType()
@Schema({ timestamps: true })
export class Folder {
  @Field()
  id: string;

  @Prop({ required: true, unique: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  authorId: string;

  @Field(() => [Author])
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Author" })
  author: Author;

  @Field(() => [Note])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }] })
  notes: Note[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
export const FolderSchema = SchemaFactory.createForClass(Folder);
