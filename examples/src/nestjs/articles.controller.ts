import { Controller, Get, Param, UseInterceptors, Query } from "@nestjs/common";
import { serialize, fieldsFromQuery } from "@emelon/jsonapi-nano";
import {
  ArticlesService,
  articleResource,
  authorResource,
} from "./articles.service.js";
import { JsonApiInterceptor } from "./jsonapi.interceptor.js";

@Controller("articles")
@UseInterceptors(JsonApiInterceptor)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(@Query() query: Record<string, unknown>) {
    const articles = this.articlesService.findAll();
    const authors = this.articlesService.getAuthors();

    return serialize(articles, articleResource, {
      include: {
        author: [authors, authorResource],
      },
      fields: fieldsFromQuery(query),
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Query() query: Record<string, unknown>) {
    const article = this.articlesService.findOne(id);
    const authors = this.articlesService.getAuthors();

    return serialize(article, articleResource, {
      include: {
        author: [authors, authorResource],
      },
      fields: fieldsFromQuery(query),
    });
  }
}
