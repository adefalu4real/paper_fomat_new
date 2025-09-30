import { configureStore } from "@reduxjs/toolkit";
// import { apiSlice } from "./api/apiSlice";
// import authReducer from "./features/auth/authSlice";
// import serviceReducer from "./features/services/serviceSlice";
// import projectReducer from "./features/project/projectSlice";
// import appointmentReducer from "./features/appointments/appointmentSlice";

// Configure the Redux store
const store = configureStore({
  reducer: {
    // [apiSlice.reducerPath]: apiSlice.reducer,
    // auth: authReducer,
    // service: serviceReducer,
    // project: projectReducer,
    // appointment: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
  devTools: process.env.REACT_APP_NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
