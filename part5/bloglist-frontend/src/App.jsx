import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlog from "./components/AddBlog";
import AddBlogForm from "./components/AddBlogForm";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [notificationClass, setNotificationClass] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [updatedBlogs, setUpdatedBlogs] = useState(false);
  const [user, setUser] = useState(null);

  const addBlogForm = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const userLocal = window.localStorage.getItem("loggedBlogUser");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      console.log("logging in with", username);
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
      setErrorMessage(`Login Successful! Welcome ${user.name}`);
      setNotificationClass("successful");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    } catch (exception) {
      console.log("this is our ERROR", exception);
      const errorText = JSON.parse(exception.request.responseText);
      if (errorText && errorText.error) {
        setErrorMessage(errorText.error);
      }
      setNotificationClass("error");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    }
  };

  const handleLogout = () => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser", JSON.stringify(user));
    setUser(null);
  };

  const handleBlogCreation = async (title, author, url) => {
    addBlogForm.current.toggleVisibility();
    try {
      await blogService.addBlog({
        title: title,
        author: author,
        url: url,
      });
      setUpdatedBlogs(!updatedBlogs);
      setErrorMessage(`a new blog ${title} by ${author} added`);
      blogService.getAll().then((blogs) => setBlogs(blogs));
      setNotificationClass("successful");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    } catch (exception) {
      const errorText = JSON.parse(exception.request.responseText);
      if (errorText && errorText.error) {
        setErrorMessage(errorText.error);
      } else {
        setErrorMessage(
          "An error occurred when creating trying to create the new blog. Make sure the input is correct and try again."
        );
      }
      setNotificationClass("error");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    }
  };

  const handleLike = async (blog, blogId) => {
    try {
      await blogService.updateBlog(blog, blogId);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    } catch (exception) {
      setErrorMessage("Could not update blog");
      setNotificationClass("error");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    try {
      if (window.confirm(`Do you want to delete ${blog.title} permanently?`)) {
        await blogService.deleteBlog(blog.id);
        setErrorMessage(`${blog.title} by ${blog.author} successfully deleted`);
        setUpdatedBlogs(!updatedBlogs);
        setNotificationClass("successful");
        setTimeout(() => {
          setErrorMessage("");
          setNotificationClass("");
        }, 5000);
      }
      blogService.getAll().then((blogs) => setBlogs(blogs));
    } catch (exception) {
      setErrorMessage(
        "Not able to delete blog " + blog.title + " by " + blog.author
      );
      setNotificationClass("error");
      setTimeout(() => {
        setErrorMessage("");
        setNotificationClass("");
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <>
        <Notification message={errorMessage} classVal={notificationClass} />
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </>
    );
  } else {
    return (
      <div>
        <Notification message={errorMessage} classVal={notificationClass} />
        <h2>blogs</h2>
        logged in as {user.name} <button onClick={handleLogout}>logout</button>
        <AddBlog buttonText="new blog" ref={addBlogForm}>
          <AddBlogForm addBlog={handleBlogCreation} />
        </AddBlog>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            addLike={handleLike}
            deleteBlog={handleDelete}
          />
        ))}
      </div>
    );
  }
};

export default App;
