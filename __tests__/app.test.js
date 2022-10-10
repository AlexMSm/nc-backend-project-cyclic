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
    describe("/api/articles/:article_id - returns an article object with the following properties - author, title, article_id, body, topic, created_at, votes", () => {
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
  });
  describe("/api/users", () => {});
});
