// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApiSlice = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     // The base URL for all API calls
//     baseUrl: 'https://server-sodmar-concept.onrender.com/api/v1',
//   }),
//   endpoints: (builder) => ({
//     // Defines the 'login' mutation
//     login: builder.mutation({
//       query: (credentials) => ({
//         // The specific path for the login endpoint
//         url: '/user/login', // This gets combined with the baseUrl
//         method: 'POST',
//         body: credentials, // Sends { email, password }
//       }),
//     }),
//     // ...other endpoints like register, logout, etc.
//   }),
// });

// export const { useLoginMutation } = authApiSlice;