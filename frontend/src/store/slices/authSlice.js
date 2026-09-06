import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      const user = data?.user || {
        username: data?.username || credentials.username,
        role: data?.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      return { token: data?.token, user };
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

let savedUser = null;
try {
  const item = localStorage.getItem('user');
  savedUser = item ? JSON.parse(item) : null;
} catch (e) {
  savedUser = null;
}

const initialState = {
  user: savedUser || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  isAuthenticated: Boolean(localStorage.getItem('token'))
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      const payload = action.payload || {};
      const user = payload.user || payload;
      const token = payload.token || null;
      state.user = user;
      state.token = token;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Authentication failed';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token;
        state.user = action.payload?.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, loginSuccess, loginStart, loginFailure } = authSlice.actions;

export default authSlice.reducer;