const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("app.js", () => {
  describe("/api/topics", () => {
    describe("GET /api/topics - returns an array of topic objects, each of which should have the following properties: slug and description", () => {
      test("200: should return a json object containing array of objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            const { body } = response;
            expect(body).toHaveLength(3);
            body.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String),
                })
              );
            });
          });
      });
    });
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
      test("200: Correctly updates vote property when negative vote given, returns the article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -50 })
          .expect(200)
          .then((response) => {
            const { body } = response;
            expect(body.votes).toBe(50);
          });
      });
      test("304 - Not modified: Doesn't allow votes to go into negatives", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -110 })
          .expect(400)
          .then((response) => {
            const { body } = response;
            expect(body.msg).toBe(
              "Not possible to reduce votes below 0 - current vote is 0"
            );
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
              "Bad request received please use format '{inc_vote : <integer>}'"
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
              "Bad request received please use format '{inc_vote : <integer>}'"
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
  });

  describe("/api/users", () => {
    describe("GET /api/users - returns array of user objects with properties: ", () => {
      test("200: returns an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((response) => {
            const { body } = response;
            expect(body.length).toBe(4);
            body.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
});
