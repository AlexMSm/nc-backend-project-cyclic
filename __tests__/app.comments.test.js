const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("app.js", () => {
  describe("GET /api/articles/:article_id/comments - returns array of comments for an article - date DESC", () => {
    test("200: returns array of comment objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(11);
          expect(body).toBeSortedBy("created_at", { descending: true });
          body.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("404 - Not Found: should return error if no comments found", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("No comments found.");
        });
    });
    test("404 - Not Found: should return error for unmatched article id", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .get("/api/articles/articletest/comments")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid article ID");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments - adds a comment with username and body to a given article", () => {
    test("201 - Comment Posted: Posts new comment to the table for article (1) already with comments (11)", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "icellusedkars", body: "This is a test comment." })
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.author).toBe("icellusedkars");
          expect(body.body).toBe("This is a test comment.");
          expect(body.votes).toBe(0);
          return request(app).get("/api/articles/1/comments");
        })
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(12);
          body.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("201 - Comment Posted: Posts new comment to the table for article (2) with no comments", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", body: "Second test comment." })
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.author).toBe("lurker");
          expect(body.body).toBe("Second test comment.");
          expect(body.votes).toBe(0);
          return request(app).get("/api/articles/2/comments");
        })
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(1);
        });
    });
    test("400 - Bad request: should return error for invalid comment object keys", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({ user: "icellusedkars", body: "This is a test comment." })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format '{username: <string>, body: <string>}'"
          );
        });
    });
    test("400 - Bad request: should return error for invalid comment object values", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({ user: "icellusedkars", body: 1000 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format '{username: <string>, body: <string>}'"
          );
        });
    });
    test("404 - Not Found: should return error for unmatched article id", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({ username: "icellusedkars", body: "This is a test comment." })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .post("/api/articles/notAnArticle/comments")
        .send({ username: "icellusedkars", body: "This is a test comment." })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid article ID");
        });
    });
  });
});
