"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useProducts(options = {}) {
  const {
    limit,
    page = 1,
    sort,
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    enabled = true,
  } = options;

  async function getProducts() {
    // Build query params
    const params = new URLSearchParams();
    
    if (limit) params.append("limit", limit);
    if (page) params.append("page", page);
    if (sort) params.append("sort", sort);
    if (category) params.append("category", category);
    if (brand) params.append("brand", brand);
    if (search) params.append("keyword", search);
    if (minPrice) params.append("price[gte]", minPrice);
    if (maxPrice) params.append("price[lte]", maxPrice);

    const url = `https://ecommerce.routemisr.com/api/v1/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const { data } = await axios.get(url);
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products", options],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled,
  });

  return {
    products: data?.data || [],
    metadata: data?.metadata || {},
    results: data?.results || 0,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}