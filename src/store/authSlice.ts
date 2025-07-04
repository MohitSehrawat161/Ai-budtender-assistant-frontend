import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer; 