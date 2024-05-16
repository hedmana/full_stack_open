const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs) => {
  let mostLikes = Math.max(...blogs.map((blog) => blog.likes));

  if (mostLikes === -Infinity) {
    return null;
  } else {
    return blogs.find((blog) => blog.likes === mostLikes);
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authors = blogs.map((blog) => blog.author);
  const authorCount = authors.reduce((acc, author) => {
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const mostBlogs = Object.keys(authorCount).reduce((a, b) =>
    authorCount[a] > authorCount[b] ? a : b
  );

  return { author: mostBlogs, blogs: authorCount[mostBlogs] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikes = blogs.reduce((acc, blog) => {
    if (!acc[blog.author]) {
      acc[blog.author] = blog.likes;
    } else {
      acc[blog.author] += blog.likes;
    }
    return acc;
  }, {});

  const mostLikesAuthor = Object.keys(authorLikes).reduce((a, b) =>
    authorLikes[a] > authorLikes[b] ? a : b
  );

  return { author: mostLikesAuthor, likes: authorLikes[mostLikesAuthor] };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
