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
  describe("GET /api/users/:username - returns a user object with the following properties - username, name, avatar_url", () => {
    test("200: returns user object", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.name).toBe("sam");
          expect(body.username).toBe("icellusedkars");
          expect(body.avatar_url).toBe(
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          );
        });
    });
    test("404 - Not Found: should return error for unmatched username id", () => {
      return request(app)
        .get("/api/users/notAUser")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("User not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .get("/api/users/90")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid username - must contain a letter");
        });
    });
  });
});
