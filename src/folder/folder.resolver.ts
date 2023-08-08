import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { LoginGuard } from "src/author/guards/login.guard";
import { Note } from "src/note/entities/note.entity";
import { CreateFolderInput } from "./dto/create-folder.input";
import { FolderQueryParamsInput } from "./dto/folder-query-params.input";
import { UpdateFolderInput } from "./dto/update-folder.input";
import { Folder } from "./entities/folder.entity";
import { FolderService } from "./folder.service";
import { FolderResponse } from "./types/FolderResponse";
import { FoldersResponse } from "./types/FoldersResponse";
import { RemoveFolderResponse } from "./types/RemoveFolderResponse";
import { UpdateFolderResponse } from "./types/UpdateFolderResponse";

@Resolver(() => Folder)
export class FolderResolver {
  constructor(private readonly folderService: FolderService) {}

  @Mutation(() => FolderResponse)
  @UseGuards(LoginGuard)
  createFolder(
    @Args("createFolderInput") createFolderInput: CreateFolderInput,
    @Context() context
  ): Promise<FolderResponse> {
    const author = context.req["user"];
    return this.folderService.create(createFolderInput, author.uid);
  }

  @UseGuards(LoginGuard)
  @Query(() => FoldersResponse, { name: "folders" })
  findAll(
    @Args("folderQueryParamsInput")
    folderQueryParamsInput: FolderQueryParamsInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.folderService.findAll(folderQueryParamsInput, author.uid);
  }

  @Query(() => Folder, { name: "folder" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.folderService.findOne(id);
  }

  @Mutation(() => UpdateFolderResponse)
  @UseGuards(LoginGuard)
  updateFolder(
    @Args("updateFolderInput") updateFolderInput: UpdateFolderInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.folderService.update(updateFolderInput, author.uid);
  }

  @Mutation(() => RemoveFolderResponse)
  @UseGuards(LoginGuard)
  removeFolders(
    @Args("idList", { type: () => [String] }) idList: string[],
    @Context() context
  ) {
    const author = context.req.user;
    return this.folderService.removeFolders(idList, author.uid);
  }

  @ResolveField(() => [Note])
  notes(@Parent() folder: Folder) {
    return this.folderService.findNotes(folder);
  }
}
