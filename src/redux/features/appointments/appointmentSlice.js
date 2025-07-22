import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointment: [],
  },
  reducers: {
    storeAllAppointments: (state, { payload }) => {
      state.appointment = payload;
    },
  },
});

export const { storeAllAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;
