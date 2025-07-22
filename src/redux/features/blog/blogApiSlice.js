import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "../../api/apiSlice";

const baseEndPoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

export const createBlogApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (credentials) => ({
        url: `/blog/create`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});
export const blogImageApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    blogImageUpload: builder.mutation({
      query: (credentials) => ({
        url: `/blog/upload`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const userImageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogImageUploadUrl: builder.query({
      query: (id) => ({
        url: `/blog/getuploadUrl`,
      }),
    }),
  }),
});

export const editBlogApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    editBlog: builder.mutation({
      query: (credentials) => ({
        url: `/blog/update`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const deleteBlogApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    deleteBlog: builder.mutation({
      query: (credentials) => ({
        url: `/blog/delete/:id`,
        method: "DELETE",
        body: { ...credentials },
      }),
    }),
  }),
});

export const getAllBlogsApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: `/blog/get`,
      }),
    }),
    getSingleBlog: builder.query({
      query: (id) => ({
        url: `/blog/get/${id}`,
      }),
    }),
  }),
});

export const { useCreateBlogMutation } = createBlogApiSlice;

export const { useBlogImageMutation } = blogImageApiSlice;

export const { useEditBlogMutation } = editBlogApiSlice;

export const { useDeleteBlogMutation } = deleteBlogApiSlice;

export const { useGetAllBlogsQuery, useGetSingleBlogQuery } =
  getAllBlogsApiSlice;

export const { useGetBlogImageUploadUrlQuery } = userImageSlice;
