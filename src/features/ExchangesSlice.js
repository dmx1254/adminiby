/* @ts-nocheck */
/* eslint-disable */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  products: null,
};

export const exchangeSlice = createSlice({
  name: "exchange",
  initialState,

  reducers: {
    getExchange: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    updateExchange: (state, action) => {
      state.products = state.products.map((product) => {
        if (product._id === action.payload._id) {
          return {
            ...product,
            status: action.payload.status,
          };
        } else {
          return product;
        }
      });
    },

    deleteExchange: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
    },
  },
});

export const { getExchange, updateExchange, deleteExchange } =
  exchangeSlice.actions;
export default exchangeSlice.reducer;
