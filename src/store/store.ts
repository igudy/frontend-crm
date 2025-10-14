import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import crmReducer from "../slices/crmSlice";
import { crmApi } from "../services/crmApi";

export const store = configureStore({
  reducer: {
    crm: crmReducer,
    [crmApi.reducerPath]: crmApi.reducer,
    // [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crmApi.middleware),
  //   .concat(dashboardApi.middleware),
});

setupListeners(store.dispatch);
