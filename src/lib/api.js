/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async (headers) => {
      // Get the auth token from Clerk
      try {
        const token = await window.Clerk?.session?.getToken();
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Color', 'Order', 'Sales'],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
        if (params?.colorId) searchParams.append("colorId", params.colorId);
        if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
        if (params?.page) searchParams.append("page", params.page);
        if (params?.limit) searchParams.append("limit", params.limit);
        
        return {
          url: `/api/products?${searchParams.toString()}`,
        };
      },
      transformResponse: (response) => {
        return {
          products: response.products || response,
          pagination: response.pagination,
        };
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (productId) => `/api/products/${productId}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getAllCategories: builder.query({
      query: () => "/api/categories",
      providesTags: ['Category'],
    }),
    getAllColors: builder.query({
      query: () => "/api/colors",
      providesTags: ['Color'],
    }),
    searchProducts: builder.query({
      query: (searchTerm) => `/api/products/search?search=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Product'],
    }),
    getCheckoutSessionStatus: builder.query({
      query: (sessionId) => `/api/payments/session-status?session_id=${sessionId}`,
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: "/api/products",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (updateData) => ({
        url: `/api/products/${updateData.productId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        'Product',
        { type: 'Product', id: productId }
      ],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/api/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),

    // Order queries
    getUserOrders: builder.query({
      query: () => "/api/orders/user",
      providesTags: ['Order'],
    }),

    getAllOrders: builder.query({
      query: () => "/api/orders/admin",
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (orderId) => `/api/orders/${orderId}`,
      providesTags: (result, error, orderId) => [
        'Order',
        { type: 'Order', id: orderId }
      ],
    }),

    // Sales Dashboard
    getSalesData: builder.query({
      query: (period = '7') => `/api/sales/dashboard?period=${period}`,
      providesTags: ['Sales'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetAllCategoriesQuery,
  useGetAllColorsQuery,
  useSearchProductsQuery,
  useGetCheckoutSessionStatusQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetSalesDataQuery,
} = api;
