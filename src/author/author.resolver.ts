import { Resolver, Query, Mutation, Args, Int, Context } from "@nestjs/graphql";
import { AuthorService } from "./author.service";
import { Author } from "./entities/author.entity";
import { CreateAuthorInput } from "./dto/create-author.input";
import { UpdateAuthorInput } from "./dto/update-author.input";
import { LoginInput } from "./dto/login.input";
import { AuthorResponse } from "./types/AuthorResponse";
import { UseGuards } from "@nestjs/common";
import { LoginGuard } from "./guards/login.guard";

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => AuthorResponse)
  @UseGuards(LoginGuard)
  login(
    @Args("loginInput")
    loginInput: LoginInput,
    @Context() context
  ) {
    console.log("loginInput", loginInput);
    return this.authorService.login(context.req.body.variables.loginInput);
  }

  @Mutation(() => Author)
  createAuthor(
    @Args("createAuthorInput") createAuthorInput: CreateAuthorInput
  ) {
    return this.authorService.create(createAuthorInput);
  }

  @Query(() => [Author], { name: "author" })
  findAll() {
    return this.authorService.findAll();
  }

  @Query(() => Author, { name: "author" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.authorService.findOne(id);
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args("updateAuthorInput") updateAuthorInput: UpdateAuthorInput
  ) {
    return this.authorService.update(
      +"updateAuthorInput.id",
      updateAuthorInput
    );
  }

  @Mutation(() => Author)
  removeAuthor(@Args("id", { type: () => Int }) id: number) {
    return this.authorService.remove(id);
  }
}
