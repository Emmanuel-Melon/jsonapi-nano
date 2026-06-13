import { Injectable, NotFoundException } from "@nestjs/common";
import { belongsTo, createResource } from "@emelon/jsonapi-nano";

export interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
}

export interface Author {
  id: string;
  name: string;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Say Hello to jsonapi-nano",
    body: "A zero-dependency presentation engine.",
    authorId: "99",
  },
  {
    id: "2",
    title: "Why local testing matters",
    body: "Using yalc makes life incredibly easy.",
    authorId: "100",
  },
];

export const mockAuthors: Author[] = [
  { id: "99", name: "Naruto Uzumaki" },
  { id: "100", name: "Sasuke Uchiha" },
];

export const articleResource = createResource<Article>("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
  relationships: (a) => ({
    author: belongsTo("authors", a.authorId),
  }),
});

export const authorResource = createResource<Author>("authors", {
  attributes: (author) => ({ name: author.name }),
});

@Injectable()
export class ArticlesService {
  findAll(): Article[] {
    return mockArticles;
  }

  findOne(id: string): Article {
    const article = mockArticles.find((a) => a.id === id);
    if (!article) {
      throw new NotFoundException(`Article ${id} does not exist.`);
    }
    return article;
  }

  getAuthors() {
    return mockAuthors;
  }
}
