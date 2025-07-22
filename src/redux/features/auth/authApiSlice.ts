// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { apiSlice } from "../../api/apiSlice";

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface LoginResponse {
//   user: {
//     id: string;
//     email: string;
//     role?: string;
//   };
//   token: string;
// }

// interface CreateAccountCredentials {
//   email: string;
//   password: string;
// }

// interface User {
//   id: string;
//   email: string;
// }

// const baseEndPoint =
//   process.env.REACT_APP_NODE_ENV === "production"
//     ? process.env.REACT_APP_BACKEND_PROD
//     : process.env.REACT_APP_BACKEND_DEV;

// export const authApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginCredentials>({
//       query: (credentials) => ({
//         url: `/user/login`,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// export const userCreateApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     createAccount: builder.mutation<LoginResponse, CreateAccountCredentials>({
//       query: (credentials) => ({
//         url: `/user/create`,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// export const createAdminApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     createAdminAccount: builder.mutation<LoginResponse, CreateAccountCredentials>({
//       query: (credentials) => ({
//         url: `/user/createadmin`,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// interface RemoveUserArg {
//   id: string;
// }

// interface UpdateUserArg {
//   id: string;
//   credentials: Partial<User>;
// }

// export const removeUserApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     removeUser: builder.mutation<{ success: boolean }, RemoveUserArg>({
//       query: ({ id }) => ({
//         url: `/user/delete/${id}`,
//         method: "DELETE",
//       }),
//     }),
//     updateUser: builder.mutation<LoginResponse, UpdateUserArg>({
//       query: ({ id, credentials }) => ({
//         url: `/user/update/${id}`,
//         method: "PUT",
//         body: credentials,
//       }),
//     }),
//   }),
// });

// export const getAllUsersApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllUsers: builder.query<User[], void>({
//       query: () => ({
//         url: `/user/admin/all-users`,
//       }),
//     }),
//     getUser: builder.query<User, string>({
//       query: (id) => ({
//         url: `/user/get/${id}`,
//       }),
//     }),
//   }),
// });

// export const {
//   useLoginMutation,
// } = authApiSlice;

// export const {
//   useCreateAccountMutation,
// } = userCreateApiSlice;

// export const {
//   useCreateAdminAccountMutation,
// } = createAdminApiSlice;

// export const {
//   useGetAllUsersQuery,
//   useGetUserQuery,
// } = getAllUsersApiSlice;

// export const {
//   useRemoveUserMutation,
//   useUpdateUserMutation,
// } = removeUserApiSlice;
