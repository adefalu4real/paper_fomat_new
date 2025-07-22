import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import TokenService from "../../../service/TokenService";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: TokenService.getUser(),
    token: TokenService.getToken(),
    isLoggedIn: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { response } = action.payload;

      //decode and store current user
      const decodedUser = jwtDecode(response?.accessToken);
      //store user in state
      state.user = decodedUser;
      state.token = response.accessToken;
      if (state.user === decodedUser) {
        state.isLoggedIn = true;
      }

      TokenService.updateLocalAccessToken(response);
    },
    logOut: (state, action) => {
      state.user = TokenService.removeUser();
      state.token = TokenService.removeUser();
    },
  },
});

export const { setCredentials, logOut, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => {
  if (state?.auth?.user) return state.auth.user;

  return null;
};
export const selectCurentToken = (state) => {
  if (state?.auth?.token) return state.auth.token;

  return null;
};
