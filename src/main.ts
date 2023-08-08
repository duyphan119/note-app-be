import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common/pipes";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "./firebase";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4648);
}
bootstrap();
