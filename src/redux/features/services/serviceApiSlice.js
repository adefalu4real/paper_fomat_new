import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "../../api/apiSlice";

const baseEndPoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

export const createServiceApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    createService: builder.mutation({
      query: (credentials) => ({
        url: `/service/create`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const editServiceApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    editService: builder.mutation({
      query: (credentials) => ({
        url: `/service/edit`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const getAllServicesApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: `/service/get`,
      }),
    }),
  }),
});

export const { useCreateServiceMutation } = createServiceApiSlice;

export const { useEditServiceMutation } = editServiceApiSlice;

export const { useGetAllServicesQuery } = getAllServicesApiSlice;
