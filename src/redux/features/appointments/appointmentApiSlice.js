import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { apiSlice } from "../../api/apiSlice";

const baseEndPoint =
  process.env.REACT_APP_NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

export const createAppointmentApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (credentials) => ({
        url: `/appointment/create`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const editAppointmentApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    editAppointment: builder.mutation({
      query: (credentials) => ({
        url: `/appointment/edit`,
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const getAllAppointmentsApiSlice = apiSlice.injectEndpoints({
  baseQuery: fetchBaseQuery({ baseUrl: `${baseEndPoint}` }),
  endpoints: (builder) => ({
    getAllAppointments: builder.query({
      query: () => ({
        url: `/appointment/get`,
      }),
    }),
  }),
});

export const { useCreateAppointmentMutation } = createAppointmentApiSlice;

export const { useEditAppointmentMutation } = editAppointmentApiSlice;

export const { useGetAllAppointmentsQuery } = getAllAppointmentsApiSlice;
