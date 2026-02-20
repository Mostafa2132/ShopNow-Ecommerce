import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist";

// ==========================
// Helper Toast Promise
// ==========================

const withToast = (promise, messages) =>
  toast.promise(promise, {
    pending: messages.pending,
    success: messages.success,
    error: messages.error,
  });

// ==========================
// Async Thunks
// ==========================

// Get Wishlist
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (token, { rejectWithValue }) => {
    try {
      const request = axios.get(BASE_URL, {
        headers: { token },
      });

      const { data } = await request;
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// Add To Wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addItem",
  async ({ productId, token }) => {
    try {
      if (!token) {
        toast.info("You need to Login First");
        setTimeout(() => {
          toast.info("Redirect to login page");
          redirect("/login");
        }, 2000);
      } else {
        const request = axios.post(
          BASE_URL,
          { productId },
          { headers: { token } },
        );

        const { data } = await withToast(request, {
          pending: "Adding to wishlist...",
          success: "Added to wishlist ❤️",
          error: "Failed to add ❌",
        });

        return data.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
);

// Remove From Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeItem",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const request = axios.delete(`${BASE_URL}/${productId}`, {
        headers: { token },
      });

      const { data } = await withToast(request, {
        pending: "Removing from wishlist...",
        loading: "Removing from wishlist...",
        success: "Removed from wishlist 🗑",
        error: "Failed to remove ❌",
      });

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  },
);

// ==========================
// Initial State
// ==========================

const initialState = {
  wishlistItems: [],
  wishlistIds: [], // Array of product IDs for quick lookup
  wishlistCount: 0,
  loading: false,
  error: null,
};

// ==========================
// Slice
// ==========================

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Toggle wishlist (for optimistic UI updates)
    toggleWishlist: (state, action) => {
      const productId = action.payload;
      const index = state.wishlistIds.indexOf(productId);

      if (index > -1) {
        // Remove from wishlist
        state.wishlistIds.splice(index, 1);
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item._id !== productId,
        );
      } else {
        // Add to wishlist
        state.wishlistIds.push(productId);
      }

      state.wishlistCount = state.wishlistIds.length;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===== Get Wishlist =====
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload || [];
        state.wishlistIds = action.payload?.map((item) => item._id) || [];
        state.wishlistCount = action.payload?.length || 0;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Add To Wishlist =====
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistIds = action.payload || [];
        state.wishlistCount = action.payload?.length || 0;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to add to wishlist ❌");
      })

      // ===== Remove From Wishlist =====
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistIds = action.payload || [];
        state.wishlistCount = action.payload?.length || 0;
        // Remove from items array
        state.wishlistItems = state.wishlistItems.filter((item) =>
          state.wishlistIds.includes(item._id),
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to remove from wishlist ❌");
      });
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
