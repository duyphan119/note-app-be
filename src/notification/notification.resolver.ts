import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { LoginGuard } from "src/author/guards/login.guard";
import { CreateNotificationInput } from "./dto/create-notification.input";
import { NotificationQueryParamsInput } from "./dto/notification-query-params.input";
import { Notification } from "./entities/notification.entity";
import { NotificationService } from "./notification.service";
import { NotificationResponse } from "./types/NotificationResponse";
import { NotificationsResponse } from "./types/NotificationsResponse";
import { UpdateNotificationResponse } from "./types/UpdateNotificationResponse";

const pubSub = new PubSub();

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => NotificationResponse)
  async createNotification(
    @Args("createNotificationInput")
    createNotificationInput: CreateNotificationInput
  ) {
    const response = await this.notificationService.create(
      createNotificationInput
    );
    const { notification } = response;
    pubSub.publish("notificationAdded", { notificationAdded: notification });
    return response;
  }

  @Mutation(() => UpdateNotificationResponse)
  @UseGuards(LoginGuard)
  async seenNotification(
    @Args("idList", { type: () => [String] })
    idList: string[],
    @Context() context
  ) {
    const author = context.req.user;
    return this.notificationService.seen(idList, author.uid);
  }

  @Query(() => NotificationsResponse, { name: "authorNotifications" })
  @UseGuards(LoginGuard)
  findAllByAuthor(
    @Args("authorNotificationQueryParamsInput")
    notificationQueryParamsInput: NotificationQueryParamsInput,
    @Context() context
  ) {
    const author = context.req.user;
    return this.notificationService.findAll(
      notificationQueryParamsInput,
      author.uid
    );
  }

  @Query(() => NotificationsResponse, { name: "notifications" })
  findAll(
    @Args("notificationQueryParamsInput")
    notificationQueryParamsInput: NotificationQueryParamsInput
  ) {
    return this.notificationService.findAll(notificationQueryParamsInput);
  }

  // @Query(() => Notification, { name: "notification" })
  // findOne(@Args("id") id: string) {
  //   return this.notificationService.findOne(id);
  // }

  // @Mutation(() => Notification)
  // removeNotification(@Args("id", { type: () => Int }) id: number) {
  //   return this.notificationService.remove(id);
  // }

  @Subscription(() => Notification)
  notificationAdded() {
    return pubSub.asyncIterator("notificationAdded");
  }
}
