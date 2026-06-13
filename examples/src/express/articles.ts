import type { Request } from "express";
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

export const articleResource = createResource<Article, Request>("articles", {
  attributes: (a) => ({ title: a.title, body: a.body }),
  relationships: (a) => ({
    author: belongsTo("authors", a.authorId),
  }),
});

export const authorResource = createResource<Author>("authors", {
  attributes: (author) => ({ name: author.name }),
});

export function fetchArticles(): Article[] {
  return mockArticles;
}

export function fetchArticleById(id: string): Article | undefined {
  return mockArticles.find((a) => a.id === id);
}
