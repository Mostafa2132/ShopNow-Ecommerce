import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { cartReducer } from "./slices/cartSlice";
import { wishlistReducer } from "./slices/wishlistSlice";

export const myStore = configureStore({
  reducer: {
    authReducer,
    cartReducer,
    wishlistReducer,
  },
});
