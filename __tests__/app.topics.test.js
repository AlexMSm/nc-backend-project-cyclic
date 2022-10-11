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
});
