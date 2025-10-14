import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const crmApi = createApi({
  reducerPath: "crmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User", "Jobs", "Messages"],
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => "auth/me",
      providesTags: ["User"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = crmApi;
