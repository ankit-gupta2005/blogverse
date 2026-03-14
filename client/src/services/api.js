import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;

export const getBlogs = (page = 1, search = "") => API.get(`/blog?page=${page}&search=${search}`);
export const singleBlog = (id) => API.get(`/blog/${id}`);
export const createBlog = (data) => API.post('/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => API.delete(`/blog/${id}`);
export const updateBlog = (id, data) => API.put(`/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const toggleLike = (id) => API.post(`/blog/like/${id}`);

export const getProfile = (id) => {
  if (id) {
    return API.get(`/user/profile/${id}`);
  }
  return API.get("/user/profile"); 
};

export const updateProfile = (data) => API.put(`/user/profile`, data, { 
  headers: { 'Content-Type': 'multipart/form-data' } 
});

export const getUserBlogs = (id) => API.get(`/user/${id}/blogs`);
export const getMyBlogs = () => API.get(`/user/me/blogs`);
export const toggleSave = (blogId) => API.post(`/user/save/${blogId}`);
export const fetchSavedBlogs = () => API.get('/user/saved-blogs');
export const getMyDrafts = () => API.get("/blog/me/drafts");
export const addComment = (data) => API.post("/comment", data);
export const getComments = (blogId) => API.get(`/comment/${blogId}`);
export const deleteComment = (id) => API.delete(`/comment/${id}`);
export const toggleFollow = (id) => API.post(`/user/follow/${id}`);
export const updatePassword = (data) => API.put("/user/update-password", data);
export const getTrending = () => API.get("/blog/trending");
export const getSuggested = () => API.get("/user/suggested");
