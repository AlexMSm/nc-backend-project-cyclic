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
  describe("POST /api/topics - will add a new topic to the topics table", () => {
    test("201: Correctly updates vote property, returns the comment", () => {
      return request(app)
        .post("/api/topics")
        .send({
          "slug": "aNewTopic",
          "description": "A new test topic to post."
        })
        .then(201)
        .then((response) => {
          const {body} = response;
          expect(body.slug).toBe('aNewTopic');
          expect(body.description).toBe("A new test topic to post.");
          return request(app).get("/api/topics")
          .expect(200)
          .then((response) => {
            const { body } = response;
            expect(body).toHaveLength(4);
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
    test("400 - Bad request: incorrect object key format", () => {
      return request(app)
        .post("/api/topics")
        .send({
          "Slug": "aNewTopic",
          "description": "A new test topic to post."
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {slug: <string>, description: <string>}"
          );
        });
    });
    test("400 - Bad request: incorrect object key format - missing key-value", () => {
      return request(app)
        .post("/api/topics")
        .send({
          "description": "A new test topic to post."
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {slug: <string>, description: <string>}"
          );
        });
    });
    test("400 - Bad request: incorrect object key format - extra key value", () => {
      return request(app)
        .post("/api/topics")
        .send({
          "slug": "aNewTopic",
          "description": "A new test topic to post.",
          "extra": "Not allowed."
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format {slug: <string>, description: <string>}"
          );
        });
    });
  });
});
