import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false);
  const [buttonText, setButtonText] = useState("view");
  const show = { display: visible ? "" : "none" };

  const buttonStyle = {
    display: blog.user.username === user.username ? "" : "none",
  };

  const handleViewChange = () => {
    const buttonText = !visible ? "hide" : "view";
    setVisible(!visible);
    setButtonText(buttonText);
  };

  const deleteClick = () => {
    deleteBlog(blog);
  };

  const handleAddLike = () => {
    const newBlog = {
      user: blog.user,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    };
    addLike(newBlog, blog.id);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog" style={blogStyle}>
      <div className="blogInfo">
        {blog.title} {blog.author}
        <button id={blog.title + "-viewButton"} onClick={handleViewChange}>
          {buttonText}
        </button>
      </div>
      <div className="blogInfoExpanded" style={show}>
        <div><a href="url">{blog.url}</a></div>
        <div>
          {"likes: " + blog.likes}
          <button id={blog.title + "-likeButton"} onClick={handleAddLike}>
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        <button
          style={buttonStyle}
          id={blog.title + "-removeButton"}
          onClick={deleteClick}
        >
          remove
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
