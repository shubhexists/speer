const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const Note = require("../src/models/Note");
const User = require("../src/models/User");
require("dotenv").config();

const testUser = {
  username: "testuser",
  fullname: "Test User",
  password: "testpassword",
};

const testNote = {
  title: "test title",
  content: "test content",
};

let authToken;
let noteId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({ username: "testuser" });
  await Note.deleteMany({ title: "test title" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Authentication Endpoints", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/auth/signup").send(testUser);
    console.log(response.body);
    expect(response.statusCode).toBe(201);
  });

  it("should login a user", async () => {
    const response = await request(app).post("/auth/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    authToken = response.body.token;
  });
});

describe("Note Endpoints", () => {
  it("should create a new note", async () => {
    const response = await request(app)
      .post("/api/notes")
      .set("authorization", authToken)
      .send(testNote);
    expect(response.statusCode).toBe(201);
    expect(response.body.note).toBeDefined();
    noteId = response.body.note._id;
  });

  it("should get all notes", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("authorization", authToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.notes.length).toBe(1);
  });

  it("should get a note by id", async () => {
    const response = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("authorization", authToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.note).toBeDefined();
  });

  it("should update a note", async () => {
    const response = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("authorization", authToken)
      .send({ title: "updated title", content: "updated content" });
    expect(response.statusCode).toBe(200);
    expect(response.body.note.title).toBe("updated title");
  });

  it("should delete a note", async () => {
    const response = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("authorization", authToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
  });

    it("should not get a note by id as it is now deleted", async () => {
        const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set("authorization", authToken);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBeDefined();
    });
});
