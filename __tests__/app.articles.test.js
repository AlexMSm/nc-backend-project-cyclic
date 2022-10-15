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

describe("/api/articles", () => {
  describe("GET /api/articles/:article_id - returns an article object with the following properties - author, title, article_id, body, topic, created_at, votes", () => {
    test("200: returns article object", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.title).toBe(
            "UNCOVERED: catspiracy to bring down democracy"
          );
          expect(body.topic).toBe("cats");
          expect(body.author).toBe("rogersop");
          expect(body.body).toBe(
            "Bastet walks amongst us, and the cats are taking arms!"
          );
          const date = new Date(1596464040000);
          expect(body.created_at).toBe("2020-08-03T06:14:00.000Z");
          expect(body.votes).toBe(0);
        });
    });
    test("404 - Not Found: should return error for unmatched article id", () => {
      return request(app)
        .get("/api/articles/10000")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .get("/api/articles/articletest")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid article ID");
        });
    });
  });
  describe("PATCH /api/articles/:article_id - in/decrement article vote by given {inc_votes} property value", () => {
    test("200: Correctly updates vote property, returns the article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5 })
        .then(201)
        .then((response) => {
          const { body } = response;
          expect(body.votes).toBe(105);
        });
    });
    test("200: Correctly updates vote property, returns the article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.votes).toBe(50);
        });
    });
    test("400 - Bad request: ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ vote_increase: 5 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format '{inc_vote : <integer>}'"
          );
        });
    });
    test("400 - Bad request: ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "five" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format '{inc_vote : <integer>}'"
          );
        });
    });
    test("404 - Not Found: should return error for unmatched article id", () => {
      return request(app)
        .patch("/api/articles/10000")
        .send({ inc_votes: 5 })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Article not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .patch("/api/articles/articletest")
        .send({ inc_votes: 5 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid article ID");
        });
    });
  });
  describe("GET /api/articles/:article_id - should now include comment_count", () => {
    test("200: returns article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.title).toBe("Living in the shadow of a great man");
          expect(body.comment_count).toBe(11);
        });
    });
    test("200: returns article object with 0 comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.title).toBe("Sony Vaio; or, The Laptop");
          expect(body.comment_count).toBe(0);
        });
    });
  });
  describe("GET /api/articles?topic=<topic> - returns array of article objects with optional topic filter", () => {
    test("200: returns array of all article objects DATE DSC", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(12);
          expect(body).toBeSortedBy("created_at", { descending: true });
          body.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("200: returns array of all article objects of specified topic DATE DSC", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(11);
          expect(body).toBeSortedBy("created_at", { descending: true });
          body.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("404 - Not found: returns error when queried topic returns no results", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("No articles found on this topic.");
        });
    });
    test("400 - Bad request: returns error when queried topic does not exists", () => {
      return request(app)
        .get("/api/articles?topic=barnacles")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "barnacles is not a valid topic - available topics: mitch,cats,paper"
          );
        });
    });
  });
  describe("GET /api/articles?topic=<topic>&sort_by=<column>&order=<order>", () => {
    test("200: returns array of all article objects sorted by vote, DESC by default", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("votes", { descending: true });
        });
    });
    test("200: returns array of all article objects sorted by vote, ASC", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=ASC")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("votes");
        });
    });
    test("200: returns array of all article objects sorted by author, ASC", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=ASC")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("author");
        });
    });
    test("200: returns array of all article objects sorted by title, DESC by default", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toBeSortedBy("title", { descending: true });
        });
    });
    test("400 - Bad request: returns error for invalid query", () => {
      return request(app)
        .get("/api/articles?sort=title")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - sort is not a valid query.");
        });
    });
    test("400 - Bad request: returns error for invalid sort catergory", () => {
      return request(app)
        .get("/api/articles?sort_by=author_age")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - invalid sort_by catergory.");
        });
    });
    test("400 - Bad request: prevent sort_by body", () => {
      return request(app)
        .get("/api/articles?sort_by=body")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - invalid sort_by catergory.");
        });
    });
    test("400 - Bad request: returns error for invalid order catergory", () => {
      return request(app)
        .get("/api/articles?order=smallToBig")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - invalid order catergory.");
        });
    });
  });
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
  describe("POST /api/articles - adds a article with author (username) title, body, topic, returning article object", () => {
    test("201 - Article Posted: Posts new comment to the table for article (1) already with comments (11)", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars", title: "This is a test article.", body: "Test words for a fake article blah blah blah.", topic: "cats" })
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.author).toBe("icellusedkars");
          expect(body.title).toBe("This is a test article.");
          expect(body.body).toBe("Test words for a fake article blah blah blah.");
          expect(body.topic).toBe("cats");
          expect(body.votes).toBe(0);
          return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(13);
        })
    });});
    test("400 - Bad request: should return error for invalid article object keys test 1", () => {
      return request(app)
        .post("/api/articles")
        .send({ name: "icellusedkars", title: "This is a test article.", body: "Test words for a fake article blah blah blah.", topic: "cats" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {username: <string>, title: <string>, body: <string>, topic:<string>}"
          );
        });
    });
    test("400 - Bad request: should return error for invalid article object keys test 2", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars", title: "This is a test article.", body: "Test words for a fake article blah blah blah.", topic: "cats", extra: 'Not allowed'})
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {username: <string>, title: <string>, body: <string>, topic:<string>}"
          );
        });
    });
    test("400 - Bad request: should return error for invalid article object keys test 3", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars", title: "This is a test article.", body: "Test words for a fake article blah blah blah."})
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {username: <string>, title: <string>, body: <string>, topic:<string>}"
          );
        });
    });
    test("400 - Bad request: should return error for invalid topic", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars", title: "This is a test article.", body: "Test words for a fake article blah blah blah.", topic: 'notATopic' })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "notATopic is not a valid topic - available topics: mitch,cats,paper"
          );
        });
    });
    test("400 - Bad request: should return error for invalid title", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "icellusedkars", title: true, body: "Test words for a fake article blah blah blah.", topic: "cats" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {username: <string>, title: <string>, body: <string>, topic:<string>}"
          );
        });
    });
    test("404 - Not Found: should return error for unmatched username id", () => {
      return request(app)
        .post("/api/articles")
        .send({ username: "busterboy", title: "This is a test article.", body: "Test words for a fake article blah blah blah.", topic: "cats" })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("busterboy is not a valid user - available users: butter_bridge,icellusedkars,rogersop,lurker");
        });
    });
  });
});

/* sort_by, which sorts the articles by any valid column (defaults to date)
order, which can be set to asc or desc for ascending or descending (defaults to descending) */
