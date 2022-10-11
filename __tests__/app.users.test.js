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
