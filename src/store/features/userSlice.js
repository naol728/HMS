import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      const userId = session?.user?.id;

      if (!userId) return null;

      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("id", userId)
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const persistedUser = JSON.parse(localStorage.getItem("user_data") || "null");

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: persistedUser,
    role: persistedUser?.role || null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;

      // save full user object
      localStorage.setItem("user_data", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("user_data");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.role || null;

        if (action.payload) {
          localStorage.setItem("user_data", JSON.stringify(action.payload));
        }

        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
