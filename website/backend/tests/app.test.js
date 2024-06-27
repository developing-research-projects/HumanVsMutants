const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    let response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("Test the users path", () => {
  test("It should response the GET method", async () => {
    let response = await request(app).get("/users");
    expect(response.statusCode).toBe(401);
  });
});

describe("Test the mutants path", () => {
  test("It should response the GET method", async () => {
    let response = await request(app).get("/mutants");
    expect(response.statusCode).toBe(401);
  });
});
