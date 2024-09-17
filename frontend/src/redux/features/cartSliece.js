import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],

    shippingInfo:localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.product === newItem.product
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        state.cartItems[existingItemIndex] = newItem;
      } else {
        // Add new item
        state.cartItems.push(newItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state?.cartItems?.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      localStorage.removeItem("cartItems")
      state.cartItems = [];
    },
    saveShippingInfo:(state, action) => {
state.shippingInfo = action.payload
localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));

    }
  },
});

export const { setCartItem, removeCartItem, saveShippingInfo, clearCart } = cartSlice.actions;

export default cartSlice.reducer;