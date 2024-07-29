import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import AddBlog from "./AddBlogForm";

test("Displaying title and author but not likes and url", () => {
  const blog = {
    id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: { name: "test" },
  };

  const userObj = {
    username: "test",
    password: "test",
  };

  let mockLikeBlog = vi.fn();
  let mockDeleteBlog = vi.fn();

  const cont = render(
    <Blog
      blog={blog}
      addLike={mockLikeBlog}
      deleteBlog={mockDeleteBlog}
      user={userObj}
    />
  ).container;
  const titleAndAuthor = blog.title + " " + blog.author;
  const titleElement = cont.querySelector(".blogInfo");
  const expandedBlogInfo = cont.querySelector(".blogInfoExpanded");
  expect(titleElement).toHaveTextContent(titleAndAuthor);
  expect(expandedBlogInfo).toHaveStyle("display: none");
});

test("URL and Likes shown when clicking view button", async () => {
  const blog = {
    id: "6657022b85c259a65e9b750m",
    title: "test",
    author: "test",
    url: "https://test.com/",
    likes: 0,
    user: { name: "test" },
  };

  const userObj = {
    username: "test",
    password: "test",
  };

  const user = userEvent.setup();
  let mockLikeBlog = vi.fn();
  let mockDeleteBlog = vi.fn();

  const cont = render(
    <Blog
      blog={blog}
      addLike={mockLikeBlog}
      deleteBlog={mockDeleteBlog}
      user={userObj}
    />
  ).container;
  const button = screen.getByText("view");
  await user.click(button);
  const expandedBlogInfo = cont.querySelector(".blogInfoExpanded");
  expect(expandedBlogInfo).not.toHaveStyle("display: none");
});

test("Props component called twice when like button is clicked twice", async () => {
  const blog = {
    id: "6657022b85c259a65e9b750m",
    title: "test",
    author: "test",
    url: "https://test.com/",
    likes: 0,
    user: { name: "test" },
  };

  const userObj = {
    username: "test",
    password: "test",
  };

  const user = userEvent.setup();
  let mockLikeBlog = vi.fn();
  let mockDeleteBlog = vi.fn();

  render(
    <Blog
      blog={blog}
      addLike={mockLikeBlog}
      deleteBlog={mockDeleteBlog}
      user={userObj}
    />
  ).container;
  const button = screen.getByText("like");
  await user.click(button);
  expect(mockLikeBlog.mock.calls).toHaveLength(1);
});

test("submit button calls event handler correctly", async () => {
  const mockAddBlogHandler = vi.fn();
  render(<AddBlog addBlog={mockAddBlogHandler} />).container;
  const user = userEvent.setup();
  const button = screen.getByText("create");
  const title = screen.getByTestId("title");
  const author = screen.getByTestId("author");
  const url = screen.getByTestId("url");
  await user.type(title, "testing title");
  await user.type(author, "testing author");
  await user.type(url, "testing url");
  await user.click(button);
  const callContent = mockAddBlogHandler.mock.calls[0];
  expect(mockAddBlogHandler.mock.calls).toHaveLength(1);
  expect(callContent).toContain("testing title");
  expect(callContent).toContain("testing author");
  expect(callContent).toContain("testing url");
});
