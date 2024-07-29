import { useState } from "react";
import PropTypes from "prop-types";

const AddBlog = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog(title, author, url);
    setAuthor("");
    setUrl("");
    setTitle("");
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input id="title" data-testid="title" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author:{" "}
          <input id="author" data-testid="author" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url:
          <input value={url} id="url" data-testid="url" onChange={handleUrlChange} />
        </div>
        <button id="submit" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

AddBlog.propTypes = {
  addBlog: PropTypes.func.isRequired,
};

export default AddBlog;