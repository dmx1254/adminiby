/* @ts-nocheck */
/* eslint-disable */

import { configureStore, combineReducers } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import userReducer from "../features/userSlices";
import serversReducer from "../features/serverSlices";
import euroRateReducer from "../features/rateEuroSlice";
import dollarRateReducer from "../features/rateDollarSlices";
import usdtRaChangeReducer from "../features/rateUsdtSlices";
import exchangeReducer from "../features/ExchangesSlice";
import rateReducer from "../features/rateSlice";
import soldeReducer from "../features/soldesSlices";
import soldeHistoryReducer from "../features/dataSoldeSlice";
import orderReducer from "../features/ordersSlice";
import notifReducer from "../features/notifAdd";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducers = combineReducers({
  user: userReducer,
  servers: serversReducer,
  eurorate: euroRateReducer,
  usdtra: usdtRaChangeReducer,
  dollarate: dollarRateReducer,
  exchange: exchangeReducer,
  rate: rateReducer,
  solde: soldeReducer,
  soldes: soldeHistoryReducer,
  orders: orderReducer,
  dataNotif: notifReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    devTools: process.env.NODE_ENV === "development",
});

export let persistor = persistStore(store);
