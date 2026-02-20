"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiPackage } from "react-icons/fi";

import { motion } from "framer-motion";

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

      <section className="max-w-7xl mx-auto py-12">
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8 p-2">
            <h2 className="text-3xl font-black text-white mb-2">My Orders</h2>
            <p className="text-slate-400">
              {orders.length > 0
                ? `You have ${orders.length} ${orders.length === 1 ? "order" : "orders"}`
                : "No orders yet"}
            </p>
          </div>

          {/* Orders List */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl"
            >
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-slate-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Orders Yet
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Start shopping to see
                your orders here!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
