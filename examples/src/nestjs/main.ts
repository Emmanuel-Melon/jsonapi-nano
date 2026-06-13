import { NestFactory } from "@nestjs/core";
import { Module, HttpException } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { ArticlesController } from "./articles.controller.js";
import { ArticlesService } from "./articles.service.js";
import { serializeErrors } from "@emelon/jsonapi-nano";

// Optional Global Exception Filter to turn NestJS exceptions into compliance-ready JSON:API errors
@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 3001; // Running on 3001 to prevent conflicts with Express example

  await app.listen(PORT);
  console.log(
    `🚀 JSON:API Nest.js server running at http://localhost:${PORT}/articles`,
  );
}

bootstrap();
