"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiPackage } from "react-icons/fi";

import { motion, useReducedMotion } from "framer-motion";

import Link from "next/link";
import SimpleLoad from "../../Components/SimpleLoad/SimpleLoad";
import OrderCard from "../../Components/OrderCard/OrderCard";
import SimpleError from "../../Components/SimpleError/SimpleError";
import { Helmet } from "react-helmet";

async function getUserOrders(userId, token) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
    {
      headers: { token },
    },
  );
  return data;
}

// Get User ID from token or API
async function getUserData(token) {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/users/getMe",
    {
      headers: { token },
    },
  );
  return data.data;
}

export default function Orders() {
  const { token } = useSelector((store) => store.authReducer);
  const shouldReduceMotion = useReducedMotion();

  // Get User Data to extract userId
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(token),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  // Get Orders
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userOrders", userData?._id],
    queryFn: () => getUserOrders(userData._id, token),
    staleTime: 1000 * 60 * 5,
    enabled: !!userData?._id && !!token,
  });

  // Loading State
  if (isLoading) return <SimpleLoad />;

  // Error State
  if (isError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | Orders </title>
      </Helmet>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="space-y-6">
          {/* Header */}
          <header className="mb-8 p-2">
            <h1 className="text-3xl font-black text-white mb-2">My Orders</h1>
            <p className="text-slate-400" aria-live="polite">
              {orders.length > 0
                ? `You have ${orders.length} ${orders.length === 1 ? "order" : "orders"}`
                : "No orders yet"}
            </p>
          </header>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6" aria-label="Order list">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl"
              aria-live="polite"
            >
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <FiPackage className="text-slate-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                No Orders Yet
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Start shopping to see
                your orders here!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 hover:shadow-lg"
              >
                Start Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
