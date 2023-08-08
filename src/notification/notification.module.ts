import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { NotificationResolver } from "./notification.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Notification,
  NotificationSchema,
} from "./entities/notification.entity";
import { Author, AuthorSchema } from "src/author/entities/author.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [NotificationResolver, NotificationService],
})
export class NotificationModule {}
