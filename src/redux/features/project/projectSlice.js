import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
  },
  reducers: {
    createProject: (state, action) => {
      // const { project } = action.payload;

      state.projects = action.payload.projects;
    },
    storeProjects: (state, { payload }) => {
      // console.log(payload);
      state.projects = payload;
    },
    deleteProjects: (state, { payload }) => {
      console.log("redux delete payload", payload);
      const projectIdToDelete = payload; // Assuming payload is the ID to delete
      state.projects = state.projects.filter(
        (project) => project._id !== projectIdToDelete
      );
    },
    editProjects: (state, { payload }) => {
      state.projects = payload;
    },
  },
});

export const { createProject, storeProjects, deleteProjects } =
  projectSlice.actions;

export default projectSlice.reducer;
