"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import SimpleLoad from "../../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../../Components/SimpleError/SimpleError";
import { Helmet } from "react-helmet";

// Get User Data
async function getUserData(token) {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/users/getMe",
    {
      headers: { token },
    },
  );
  // console.log(data.data)
  return data.data;
}

// Get User Orders
async function getUserOrders(userId, token) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
    {
      headers: { token },
    },
  );
  return data;
}

// Get User Reviews
async function getUserReviews(token) {
  try {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/reviews",
      {
        headers: { token },
      },
    );
    // Filter reviews by current user
    return data.data;
  } catch (error) {
    return [];
  }
}

// Get User Addresses
async function getUserAddresses(token) {
  try {
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/addresses",
      {
        headers: { token },
      },
    );
    return data.data;
  } catch (error) {
    return [];
  }
}

export default function Profile() {
  const { token } = useSelector((store) => store.authReducer);
  const wishListCount = useSelector(
    (state) => state.wishlistReducer.wishlistCount,
  );

  // Get User Data
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(token),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  // Get Orders
  const { data: orders = [] } = useQuery({
    queryKey: ["userOrders", user?._id],
    queryFn: () => getUserOrders(user._id, token),
    staleTime: 1000 * 60 * 5,
    enabled: !!user?._id && !!token,
  });

  // Get Reviews
  const { data: allReviews = [] } = useQuery({
    queryKey: ["userReviews"],
    queryFn: () => getUserReviews(token),
    staleTime: 1000 * 60 * 5,
    enabled: !!user?._id && !!token,
  });

  // Filter reviews by current user
  const userReviews = allReviews.filter(
    (review) => review.user?._id === user?._id,
  );

  // Get Addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => getUserAddresses(token),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  // Loading State
  if (isUserLoading) return <SimpleLoad />;

  // Error State
  if (isUserError || !user) return <SimpleError />;

  // Calculate total spending
  const totalSpent = orders.reduce(
    (sum, order) => sum + order.totalOrderPrice,
    0,
  );

  return (
    <>
      <Helmet>
        <title>ShopNow | Profile </title>
      </Helmet>

      <section className="space-y-6 ">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50  backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex items-center  gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-purple-500/50">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-2">
                {user.name}
              </h2>
              <p className="text-slate-400">
                Member since {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiUser className="text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Full Name</p>
                <p className="text-white font-semibold">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMail className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Email Address</p>
                <p className="text-white font-semibold break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-pink-400" size={20} />
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Phone Number</p>
                  <p className="text-white font-semibold">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiShoppingBag className="text-purple-400" size={24} />
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">
              {orders.length}
            </div>
            <p className="text-slate-400 text-sm font-semibold">Total Orders</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-pink-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiHeart className="text-pink-400" size={24} />
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent mb-2">
              {wishListCount}
            </div>
            <p className="text-slate-400 text-sm font-semibold">
              Wishlist Items
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiMapPin className="text-emerald-400" size={24} />
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-2">
              {addresses.length}
            </div>
            <p className="text-slate-400 text-sm font-semibold">Addresses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 text-center hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiStar className="text-amber-400" size={24} />
            </div>
            <div className="text-4xl font-black bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-2">
              {userReviews.length}
            </div>
            <p className="text-slate-400 text-sm font-semibold">
              Reviews Written
            </p>
          </motion.div>
        </div>

        {/* Activity Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/50  backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-black text-white mb-6">
            Activity Overview
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Total Spent */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-semibold">
                  Total Spent
                </p>
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">Across all orders</p>
            </div>

            {/* Average Order Value */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-semibold">
                  Avg Order
                </p>
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">
                $
                {orders.length > 0
                  ? (totalSpent / orders.length).toFixed(2)
                  : "0.00"}
              </p>
              <p className="text-xs text-slate-500">Per order value</p>
            </div>

            {/* Review Score */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-400 text-sm font-semibold">
                  Avg Rating
                </p>
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-1">
                {userReviews.length > 0
                  ? (
                      userReviews.reduce((sum, r) => sum + r.rating, 0) /
                      userReviews.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-xs text-slate-500">Your review average</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50  backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-black text-white mb-6">
            Recent Activity
          </h3>

          <div className="space-y-4 ">
            {/* Last Order */}
            {orders.length > 0 && (
              <div className="flex items-center gap-4  bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiShoppingBag className="text-purple-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Latest Order</p>
                  <p className="text-slate-400 text-sm">
                    ${orders[0].totalOrderPrice} •{" "}
                    {new Date(orders[0].createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    orders[0].isDelivered
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : orders[0].isPaid
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {orders[0].isDelivered
                    ? "Delivered"
                    : orders[0].isPaid
                      ? "Processing"
                      : "Pending"}
                </span>
              </div>
            )}

            {/* Last Review */}
            {userReviews.length > 0 && (
              <div className="flex items-center  gap-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiStar className="text-amber-400" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Latest Review</p>
                  <p className="text-slate-400 text-sm line-clamp-1">
                    {userReviews[0].review}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(userReviews[0].rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {orders.length === 0 && userReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">No recent activity yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
}
