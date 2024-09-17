import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSliece";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  keepUnusedDataFor: 30,
  tagTypes: ["user"],
  endpoints: (builder) => ({
    getME: builder.query({
      query: (id) => `/me`,
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));

        } catch (error) {dispatch(setLoading(false));
          console.log(error);
        }
      },
      providesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "/me/update",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["user"],
    }),

    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "/me/ipload_avatar",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["user"],
    }),

    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "/password/update",
          method: "PUT",
          body,
        };
      },
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "/password/forgot",
          method: "POST",
          body,
        };
      },
    }),
    resetPassword: builder.mutation({
        query({token, body}) {
          return {
            url: `/password/reset/${token}`,
            method: "PUT",
            body,
          };
        },
      }),
      
  }),
});

export const { useGetMEQuery,
     useUpdateProfileMutation,
     useForgotPasswordMutation,
     useUpdatePasswordMutation,
     useResetPasswordMutation,
     useUploadAvatarMutation,
    } = userApi;
