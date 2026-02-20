import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("Token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // تحديث الـ Redux state
      if (typeof window !== "undefined") {
        localStorage.setItem("Token", action.payload); // تخزين في localStorage
      }
    },
    logout: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("Token");
      }
    },
  },
});

export const authReducer = authSlice.reducer;
export const { setToken, logout } = authSlice.actions;
