import express from "express";
import { serialize, serializeErrors } from "@emelon/jsonapi-nano";
import {
  fetchArticles,
  fetchArticleById,
  articleResource,
  authorResource,
  mockAuthors,
} from "./articles.js";

const app = express();
const PORT = 3000;

app.get("/articles", (req, res) => {
  const articles = fetchArticles();
  const jsonapiResponse = serialize(articles, articleResource, {
    include: {
      author: [mockAuthors, authorResource],
    },
  });

  res.setHeader("Content-Type", "application/vnd.api+json");
  res.json(jsonapiResponse);
});

app.get("/articles/:id", (req, res) => {
  const article = fetchArticleById(req.params.id);

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
    include: {
      author: [mockAuthors, authorResource],
    },
  });

  res.setHeader("Content-Type", "application/vnd.api+json");
  res.json(jsonapiResponse);
});

app.listen(PORT, () => {
  console.log(
    `🚀 JSON:API test server running at http://localhost:${PORT}/articles`,
  );
});
