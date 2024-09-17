import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//import { stripeChekoutSession } from '../../../../backend/controllers/paymentController';

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    endpoints: (builder) => ({
     createNewOrder:builder.mutation({
        query(body) {
            return{
                url: "/orders/new",
                method: "POST",
                body,
            };
        },
     }),
     stripeChekoutSession:builder.mutation({
        query(body) {
            return{
                url: "/payment/chekout_session",
                method: "POST",
                body,
            };
        },
     }),
myOrders: builder.query({
    query: () => `/me/orders`
        }),
        orderDetails: builder.query({
            query: (id) => `/orders/${id}`,
                }),
    }), 
 
});
    


export const { useCreateNewOrderMutation, useMyOrdersQuery, useOrderDetailsQuery, useStripeChekoutSessionMutation } = orderApi;