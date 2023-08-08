import { UseGuards } from "@nestjs/common";
import { Args, Context, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginGuard } from "src/author/guards/login.guard";
import { CreateNoteInput } from "./dto/create-note.input";
import { NoteQueryParamsInput } from "./dto/note-query-params.input";
import { UpdateNoteInput } from "./dto/update-note.input";
import { Note } from "./entities/note.entity";
import { NoteService } from "./note.service";
import { NoteResponse } from "./types/NoteResponse";
import { NotesResponse } from "./types/NotesResponse";
import { RemoveNoteResponse } from "./types/RemoveNoteResponse";
import { UpdateNoteResponse } from "./types/UpdateNoteResponse";

@Resolver(() => Note)
export class NoteResolver {
  constructor(private readonly noteService: NoteService) {}

  @Mutation(() => NoteResponse)
  @UseGuards(LoginGuard)
  createNote(
    @Args("createNoteInput") createNoteInput: CreateNoteInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.noteService.create(createNoteInput, author.uid);
  }

  @Query(() => NotesResponse, { name: "notes" })
  @UseGuards(LoginGuard)
  findAll(
    @Args("noteQueryParamsInput")
    noteQueryParamsInput: NoteQueryParamsInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.noteService.findAll(noteQueryParamsInput, author.uid);
  }

  @Query(() => NoteResponse, { name: "note" })
  @UseGuards(LoginGuard)
  findOne(@Args("id") id: string, @Context() context) {
    const author = context.req.user;
    return this.noteService.findOne(id, author.uid);
  }

  @Mutation(() => UpdateNoteResponse)
  @UseGuards(LoginGuard)
  updateNote(
    @Args("updateNoteInput") updateNoteInput: UpdateNoteInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.noteService.update(updateNoteInput, author.uid);
  }

  @Mutation(() => RemoveNoteResponse)
  @UseGuards(LoginGuard)
  removeNotes(
    @Args("idList", { type: () => [String] }) idList: string[],
    @Context() context
  ) {
    const author = context.req.user;
    return this.noteService.removeNotes(idList, author.uid);
  }
}
