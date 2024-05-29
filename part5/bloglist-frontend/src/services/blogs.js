import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config = {}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  config = {
    headers: { Authorization: token },
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const addBlog = async (blog) => {
  const res = await axios.post(baseUrl, blog, config)
  return res.data
}

const updateBlog = async (blog, blogId) => {
  const res = await axios.put(baseUrl + '/' + blogId, blog, config)
  return res.data
}

const deleteBlog = async (blogId) => {
  const res = await axios.delete(baseUrl + '/' + blogId, config)
  return res.data
}

export default { getAll, setToken, addBlog, updateBlog, deleteBlog }