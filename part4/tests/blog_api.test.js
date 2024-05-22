const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

describe("Formatting", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("the correct amount of blogs are returned", async () => {
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("the unique identifier property of blog posts is named id", async () => {
    blogsAtEnd = await helper.blogsInDb();
    blogsAtEnd.forEach((blog) => {
      assert.ok(blog.id);
      assert.strictEqual(blog._id, undefined);
    });
  });
});

describe("Adding and deleting blogs", () => {
  test("a valid blog can be added ", async () => {
    const currentToken = await helper.getToken(api);

    const newBlog = {
      _id: "5a422bc61b54a676234d17fo",
      title: "Test Blog",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${currentToken}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    assert(contents.includes("Test Blog"));
  });

  test("if the likes property is missing, it will default to 0", async () => {
    const currentToken = await helper.getToken(api);

    const newBlog = {
      _id: "5a422bc61b54a676234d17gu",
      title: "Test Blog 2",
      author: "John Doe",
      url: "https://testblog2.com",
    };

    await api
      .post("/api/blogs")
      .set({ Authorization: `Bearer ${currentToken}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });

  test("if the title and url properties are missing, the backend responds with a 400 Bad Request", async () => {
    const newBlog1 = {
      _id: "5a422bc61b54a676234d17fo",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };

    const newBlog2 = {
      _id: "5a422bc61b54a676234d17fo",
      title: "Test Blog",
      author: "John Doe",
      likes: 5,
    };

    const newBlog3 = {
      _id: "5a422bc61b54a676234d17fo",
      author: "John Doe",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlog1).expect(400);
    await api.post("/api/blogs").send(newBlog2).expect(400);
    await api.post("/api/blogs").send(newBlog3).expect(400);
  });

  test("deleting a blog post", async () => {
    const currentToken = await helper.getToken(api);
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };
    
    await api
    .post("/api/blogs")
    .set({ Authorization: `Bearer ${currentToken}` })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

    const blogToDelete = await Blog.findOne({ title
      : newBlog.title });

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${currentToken}` })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test("Adding a blog post without token", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };

    await api.post("/api/blogs").set(
      { Authorization: `Bearer ` }
    ).send(newBlog).expect(401);
  });
});

describe("Updating a blog post", () => {
  test("updating the likes of a blog post", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );
    assert.strictEqual(updatedBlogAtEnd.likes, updatedBlog.likes);
  });

  test("updating a blog post without likes property defaults to 0", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = { ...blogToUpdate, likes: undefined };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    );
    assert.strictEqual(updatedBlogAtEnd.likes, 0);
  });
});

after(async () => {
  await mongoose.connection.close();
});

describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("Create user when password is shorter than 3 characters", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "test",
      name: "test",
      password: "..",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("invalid password"));
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("Create user when username is shorter than 3 characters", async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: "te",
      name: "test",
      password: "test",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3)."
      )
    );
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
