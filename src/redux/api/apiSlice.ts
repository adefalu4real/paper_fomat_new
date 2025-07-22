// import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import TokenService from "../features/services/TokenService";
// import { logOut, setCredentials } from "../features/auth/authSlice";
// import type { RootState } from "../store"; // Make sure this path correctly imports your RootState type

// const apiLink =
//   process.env.REACT_APP_NODE_ENV === "production"
//     ? process.env.REACT_APP_BACKEND_PROD
//     : process.env.REACT_APP_BACKEND_DEV;

// const baseQuery = fetchBaseQuery({
//   baseUrl: apiLink,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const state = getState() as RootState;
//     const token = state.auth?.token;
//     const tokenExpired = TokenService.isAccessExpired();
//     if (token) {
//       headers.set("authorization", `Bearer ${token.accessToken}`);
//       if (tokenExpired) {
//         headers.set("x-refresh", `${token.refreshToken}`);
//       }
//     }
//     return headers;
//   },
// });

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
//   args,
//   api,
//   extraOptions
// ) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.originalStatus === 403) {
//     console.log("sending refresh token");
//     const refreshResult = await baseQuery("/refresh", api, extraOptions);
//     console.log(refreshResult);
//     if (refreshResult?.data) {
//       api.dispatch(setCredentials({ response: refreshResult.data }));
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logOut());
//     }
//   }

//   return result;
// };

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: baseQueryWithReauth,
//   endpoints: (builder) => ({
//     getProject: builder.query<any, void>({
//       query: () => ({
//         url: "/project/get",
//       }),
//     }),
//   }),
// });
