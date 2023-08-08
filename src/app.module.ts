import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";
import { AuthorModule } from "./author/author.module";
import { FolderModule } from "./folder/folder.module";
import { NoteModule } from "./note/note.module";
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        installSubscriptionHandlers: true,
        sortSchema: true,
        playground: false,
        debug: configService.get<boolean>("DEBUG"),
        // uploads: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        formatError: (formattedError, error) => {
          const { message, extensions } = formattedError;
          const { code: statusCode } = extensions;
          return {
            message,
            statusCode,
          };
        },
        subscriptions: {
          "graphql-ws": true,
        },
      }),
    }),
    FolderModule,
    AuthorModule,
    NoteModule,
    NotificationModule,
  ],
  controllers: [],
})
export class AppModule {}
