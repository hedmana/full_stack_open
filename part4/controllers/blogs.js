const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {  
  try {
    const body = request.body;
    const user = request.user;

    if (!body.title || !body.url) {
      return response.status(400).json({ error: "title or url missing" });
    }

    if(!user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author || "",
      url: body.url,
      likes: body.likes || 0,
      user: user,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author || "",
    url: body.url,
    likes: body.likes || 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  });
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response, next) => {
  const user = request.user;
  const blogToDelete = await Blog.findById(request.params.id);

  if (user) {
    if (user.id.toString() === blogToDelete.user.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({ error: "Unauthorized" });
    }
  } else {
    response.status(401).json({ error: "Invalid token" });
  }
});

module.exports = blogsRouter;
