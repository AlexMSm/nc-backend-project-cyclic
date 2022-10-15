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

  describe("DELETE /api/comments/:comment_id - deletes a comment returns 204", () => {
    test("204 - No content: Deletes comment from article 1, leaving 10 comments", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then((response) => {
          const { body } = response;
          expect(body).toEqual({});
          return request(app).get("/api/articles/1/comments");
        })
        .then((response) => {
          const { body } = response;
          expect(body).toHaveLength(10);
          body.forEach((comment) => {
            expect(comment.comment_id).not.toBe(2);
          });
        });
    });
    test("204 - No content: Deletes comment from article 6, leaving 0 comments", () => {
      return request(app)
        .delete("/api/comments/16")
        .expect(204)
        .then((response) => {
          const { body } = response;
          return request(app).get("/api/articles/6/comments");
        })
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("No comments found.");
        });
    });
    test("404 - Not Found: should return error for unmatched comment id", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Comment not found.");
        });
    });
    test("400 - Bad Request: should return error for invalid comment id", () => {
      return request(app)
        .delete("/api/comments/notAComment")
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid comment ID");
        });
    });
  });
  describe("PATCH /api/comments/:comment_id - in/decrement comment vote by given {inc_votes} property value", () => {
    test("200: Correctly updates vote property, returns the comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 5 })
        .then(201)
        .then((response) => {
          const {body} = response;
          expect(body.votes).toBe(21);
        });
    });
    test("200: Correctly updates vote property, returns the comment", () => {
      return request(app)
        .patch("/api/comments/4")
        .send({ inc_votes: 100 })
        .expect(201)
        .then((response) => {
          const { body } = response;
          expect(body.votes).toBe(0);
        });
    });
    test("400 - Bad request: incorrect object key format", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ vote_increase: 5 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe(
            "Bad request - please use format '{inc_vote : <integer>}'"
          );
        });
    });
    test("400 - Bad request: incorrect object value format", () => {
      return request(app)
        .patch("/api/comments/1")
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
        .patch("/api/comments/10000")
        .send({ inc_votes: 5 })
        .expect(404)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Comment not found.");
        });
    });
    test("400 - Bad Request: should return error for incorrect article id", () => {
      return request(app)
        .patch("/api/comments/commenttest")
        .send({ inc_votes: 5 })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe("Bad request - Invalid comment ID");
        });
    });
  });

});
