import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
  },
  reducers: {
    createBlog: (state, action) => {
      // const { Blog } = action.payload;

      state.blogs = action.payload.Blogs;
    },
    storeBlogs: (state, { payload }) => {
      // console.log(payload);
      state.blogs = payload;
    },
    deleteBlogs: (state, { payload }) => {
      console.log("redux delete payload", payload);
      const blogIdToDelete = payload; // Assuming payload is the ID to delete
      state.blogs = state.blogs.filter((blog) => blog._id !== blogIdToDelete);
    },
    editBlogs: (state, { payload }) => {
      state.blogs = payload;
    },
  },
});

export const { createBlog, storeBlogs, deleteBlogs } = blogSlice.actions;

export default blogSlice.reducer;
