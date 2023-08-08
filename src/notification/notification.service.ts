import {
  Injectable,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Author } from "src/author/entities/author.entity";
import { Message } from "src/constants";
import { CreateNotificationInput } from "./dto/create-notification.input";
import { NotificationQueryParamsInput } from "./dto/notification-query-params.input";
import { Notification } from "./entities/notification.entity";
import { NotificationResponse } from "./types/NotificationResponse";
import { NotificationsResponse } from "./types/NotificationsResponse";
import { UpdateNotificationResponse } from "./types/UpdateNotificationResponse";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(Author.name)
    private readonly authorModel: Model<Author>
  ) {}

  async create(
    createNotificationInput: CreateNotificationInput
  ): Promise<NotificationResponse> {
    try {
      const createdNotification = new this.notificationModel({
        ...createNotificationInput,
      });

      const savedNotification = await createdNotification.save();

      return {
        message: Message.SUCCESS,
        statusCode: HttpStatus.CREATED,
        notification: savedNotification,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    notificationQueryParamsInput: NotificationQueryParamsInput,
    authorId?: string
  ): Promise<NotificationsResponse> {
    const { limit, p, sortBy, sortType } = notificationQueryParamsInput;
    try {
      const count = await this.notificationModel.count();

      let author = null;

      if (authorId) {
        author = await this.authorModel.findOne({ uid: authorId });
        if (!author) {
          throw new ForbiddenException();
        }
      }

      let totalPages = 1;
      let query = this.notificationModel.find({
        ...(author
          ? {
              createdAt: {
                $gte: new Date(author.createdAt),
              },
            }
          : {}),
      });

      if (limit) {
        if (p) {
          query = query.skip((p - 1) * limit);
        }
        query = query.limit(limit);
        totalPages = Math.ceil(count / limit);
      }

      if (sortBy && sortType) {
        query = query.sort({
          [sortBy]:
            sortType === "asc" || sortType === "ascending" ? "asc" : "desc",
        });
      }

      let notifications = await query.exec();
      if (author) {
        notifications.map((item) => {
          const seenIds = item.seenIds.find((id) => id === author.uid)
            ? [author.uid]
            : [];

          return {
            ...item,
            seenIds,
          };
        });
      }

      return {
        count,
        totalPages,
        statusCode: HttpStatus.OK,
        message: Message.SUCCESS,
        notifications,
      };
    } catch (error) {
      throw error;
    }
  }

  async seen(
    idList: string[],
    authorId: string
  ): Promise<UpdateNotificationResponse> {
    try {
      const author = await this.authorModel.findOne({ uid: authorId });
      if (!author) throw new ForbiddenException();
      const existingNotifications = await this.notificationModel.find({
        _id: {
          $in: idList,
        },
        createdAt: {
          $gte: new Date(author.createdAt),
        },
      });
      existingNotifications.forEach((existingNotification) => {
        if (!existingNotification.seenIds.includes(authorId)) {
          existingNotification.seenIds.push(authorId);
        }
      });
      await Promise.all(existingNotifications.map((item) => item.save()));
      return {
        message: Message.SUCCESS,
        statusCode: HttpStatus.OK,
        isUpdated: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const existingNotification = await this.notificationModel.findById(id);

      if (!existingNotification) throw new NotFoundException();

      return existingNotification;
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
