import express from "express";
import {
  createResource,
  serialize,
  serializeErrors,
} from "@emelon/jsonapi-nano";

const app = express();
const PORT = 3000;

interface Article {
  id: string;
  title: string;
  body: string;
  authorId: string;
}

interface Author {
  id: string;
  name: string;
}

const mockArticles: Article[] = [
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

const mockAuthors: Author[] = [
  { id: "99", name: "Emmanuel Gatwech" },
  { id: "100", name: "Jane Doe" },
];

const articleResource = createResource<Article, express.Request>("articles", {
  attributes: (article) => ({
    title: article.title,
    body: article.body,
  }),
  links: (article, req) => ({
    self: `${req?.protocol}://${req?.get("host")}/articles/${article.id}`,
  }),
  relationships: (article) => ({
    author: {
      data: { type: "authors", id: article.authorId },
      links: { related: `/articles/${article.id}/author` },
    },
  }),
});

const authorResource = createResource<Author>("authors", {
  attributes: (author) => ({ name: author.name }),
});

function findIncludedAuthors(articles: Article[]) {
  const ids = new Set(articles.map((a) => a.authorId));
  return mockAuthors
    .filter((a) => ids.has(a.id))
    .map((author) => ({
      type: "authors",
      id: author.id,
      attributes: authorResource.attributes(author, undefined),
    }));
}

app.get("/articles", (req, res) => {
  const jsonapiResponse = serialize(mockArticles, articleResource, {
    context: req,
    links: { self: `${req.protocol}://${req.get("host")}${req.originalUrl}` },
    included: findIncludedAuthors(mockArticles),
    jsonapi: { version: "1.1" },
  });

  res.setHeader("Content-Type", "application/vnd.api+json");
  res.json(jsonapiResponse);
});

app.get("/articles/:id", (req, res) => {
  const article = mockArticles.find((a) => a.id === req.params.id);

  if (!article) {
    res.status(404).json(
      serializeErrors({
        status: 404,
        title: "Not Found",
        detail: `Article ${req.params.id} does not exist.`,
      }),
    );
    return;
  }

  const jsonapiResponse = serialize(article, articleResource, {
    context: req,
    included: findIncludedAuthors([article]),
    jsonapi: { version: "1.1" },
  });

  res.setHeader("Content-Type", "application/vnd.api+json");
  res.json(jsonapiResponse);
});

app.listen(PORT, () => {
  console.log(
    `🚀 JSON:API test server running at http://localhost:${PORT}/articles`,
  );
});
