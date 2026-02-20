import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/cart";

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

// Get Cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        return rejectWithValue("Please login to view cart");
      }

      const { data } = await axios.get(BASE_URL, {
        headers: { token },
      });

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add To Cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        toast.error("Please login to add items to cart");
        return rejectWithValue("Authentication required");
      }

      const request = axios.post(
        BASE_URL,
        { productId },
        { headers: { token } }
      );

      const { data } = await withToast(request, {
        pending: "Adding item to cart...",
        success: "Item added successfully 🛒",
        error: "Failed to add item ❌",
      });

      return data.data; // ✅ Always return data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add item to cart";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Quantity
export const updateItemQuantity = createAsyncThunk(
  "cart/updateItem",
  async ({ productId, count, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        toast.error("Please login to update cart");
        return rejectWithValue("Authentication required");
      }

      const request = axios.put(
        `${BASE_URL}/${productId}`,
        { count },
        { headers: { token } }
      );

      const { data } = await withToast(request, {
        pending: "Updating quantity...",
        success: "Cart updated ✔",
        error: "Failed to update ❌",
      });

      return data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update quantity";
      return rejectWithValue(errorMessage);
    }
  }
);

// Remove Item
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        toast.error("Please login to remove items");
        return rejectWithValue("Authentication required");
      }

      const request = axios.delete(`${BASE_URL}/${productId}`, {
        headers: { token },
      });

      const { data } = await withToast(request, {
        pending: "Removing item...",
        success: "Item removed 🗑",
        error: "Failed to remove ❌",
      });

      return data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove item";
      return rejectWithValue(errorMessage);
    }
  }
);

// Clear Cart
export const clearUserCart = createAsyncThunk(
  "cart/clearCart",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        toast.error("Please login to clear cart");
        return rejectWithValue("Authentication required");
      }

      const request = axios.delete(BASE_URL, {
        headers: { token },
      });

      await withToast(request, {
        pending: "Clearing cart...",
        success: "Cart cleared 🧹",
        error: "Failed to clear cart ❌",
      });

      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to clear cart";
      return rejectWithValue(errorMessage);
    }
  }
);

// ==========================
// Initial State
// ==========================

const initialState = {
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  cartId: null,
  loading: false,
  error: null,
};

// ==========================
// Helper Function
// ==========================

const setCartState = (state, cart) => {
  state.cartItems = cart.products || [];
  state.cartCount = cart.products?.length || 0;
  state.cartTotal = cart.totalCartPrice || 0;
  state.cartId = cart._id || null;
};

// ==========================
// Slice
// ==========================

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ===== Get Cart =====
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          setCartState(state, action.payload);
        }
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Add Item =====
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          setCartState(state, action.payload);
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Update Item =====
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          setCartState(state, action.payload);
        }
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Remove Item =====
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          setCartState(state, action.payload);
        }
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== Clear Cart =====
      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        return { ...initialState };
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;