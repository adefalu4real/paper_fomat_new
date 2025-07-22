import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "../../api/apiSlice";

const baseEndPoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

export const createProjectApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (credentials) => ({
        url: `/project/create`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});
export const projectImageApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    projectImageUpload: builder.mutation({
      query: (credentials) => ({
        url: `/project/upload`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
  endpoints: (builder) => ({
    projectImageUpload: builder.mutation({
      query: (credentials) => ({
        url: `/project/upload`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const userImageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImageUploadUrl: builder.query({
      query: (id) => ({
        url: `/project/getuploadUrl`,
      }),
    }),
  }),
});

export const editProjectApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    editProject: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/project/update/${id}`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const deleteProjectApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/project/delete/${id}
        `,
        method: "DELETE",
        body: { ...id },
      }),
    }),
  }),
});

export const getAllProjectsApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: () => ({
        url: `/project/get`,
      }),
    }),
    getSingleProject: builder.query({
      query: (id) => ({
        url: `/project/get/${id}`,
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = createProjectApiSlice;

export const { useProjectImageMutation } = projectImageApiSlice;

export const { useEditProjectMutation } = editProjectApiSlice;

export const { useDeleteProjectMutation } = deleteProjectApiSlice;

export const { useGetAllProjectsQuery, useGetSingleProjectQuery } =
  getAllProjectsApiSlice;

export const { useGetImageUploadUrlQuery } = userImageSlice;
