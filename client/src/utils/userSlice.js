import { createSlice } from "@reduxjs/toolkit";

// Try to load user from localStorage on app start
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      return { ...JSON.parse(storedUser), token: storedToken };
    }
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
  }
  return null;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: loadUserFromStorage(),
    isAuthenticated: !!loadUserFromStorage(),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear localStorage on logout
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export default userSlice.reducer;
