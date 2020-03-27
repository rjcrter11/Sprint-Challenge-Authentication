const request = require("supertest");
const server = require("./server");
const Users = require("../users/users-model");
const db = require("../database/dbConfig");

// afterAll(async () => {
//   await db("users").truncate();
// });

describe("server.js", () => {
  describe("GET /", () => {
    it("should return 200", () => {
      return request(server)
        .get("/")
        .expect(200);
    });
    it("should return json", () => {
      return request(server)
        .get("/")
        .then((res) => {
          expect(res.body.api).toBe("up");
        });
    });
  });
});

describe("auth-router.js", () => {
  beforeEach(() => {
    return db("users").truncate();
  });
  afterEach(() => {
    return db("users").truncate();
  });
  describe("POST /auth/register", () => {
    it("should return 201 on adding a user", () => {
      return request(server)
        .post("/api/auth/register")
        .send({
          username: "user",
          password: "pass"
        })
        .expect(201);
    });
    it("should add user to database", async () => {
      const users = await db("users");
      expect(users).toHaveLength(0);
      await Users.add({
        username: "user",
        password: "pass"
      });
      const newUser = await db("users");
      expect(newUser).toHaveLength(1);
    });
  });
  describe("POST /auth/login", () => {
    it("should throw an error if username or password is missing", async () => {
      res = await request(server)
        .post("/api/auth/register")
        .send({
          username: "user",
          password: "pass"
        })
        .expect(201);
      res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "user"
        })
        .expect(500);
    });
    it("should return 200 on successful login", async () => {
      res = await request(server)
        .post("/api/auth/register")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(201);
      res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(200);
    });
    it("should return a token", async () => {
      res = await request(server)
        .post("/api/auth/register")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(201);
      res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeTruthy();
    });
  });
  describe("GET /jokes", () => {
    it("should return a 401 without token", async () => {
      res = await request(server)
        .get("/api/jokes")
        .expect(401);
    });
    it("should return list of jokes on successful login", async () => {
      res = await request(server)
        .post("/api/auth/register")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(201);
      res = await request(server)
        .post("/api/auth/login")
        .send({
          username: "user",
          password: "pass"
        });
      expect(res.status).toBe(200);
      const token = res.body.token;
      expect(token.length).toBeGreaterThan(10);

      res = await request(server)
        .get("/api/jokes")
        .set({ authorization: token, Accept: "application/json" });
      expect(res.body).toBeInstanceOf(Array);
      expect(res.status).toBe(200);
    });
  });
});
