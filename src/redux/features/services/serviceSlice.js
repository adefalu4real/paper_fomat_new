import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    service: [],
  },
  reducers: {
    storeAllServices: () => {},
  },
});

export const { storeAllServices } = serviceSlice.actions;

export default serviceSlice.reducer;
