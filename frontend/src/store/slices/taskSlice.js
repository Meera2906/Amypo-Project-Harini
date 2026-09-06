import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await taskService.getAllTasks();
      if (data && data.content && Array.isArray(data.content)) {
        return data.content;
      }
      if (data && data.tasks && Array.isArray(data.tasks)) {
        return data.tasks;
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to fetch tasks';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: ''
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setTasks: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchQuery, setTasks } = taskSlice.actions;

export default taskSlice.reducer;
