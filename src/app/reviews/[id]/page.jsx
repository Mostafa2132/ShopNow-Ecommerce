"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiStar, FiCalendar, FiArrowLeft } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";
import Link from "next/link";
import SimpleLoad from "../../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../../Components/SimpleError/SimpleError";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import { use } from "react";
import { Helmet } from "react-helmet";

async function getReviews(id) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products/${id}/reviews`,
  );
  return data.data;
}

async function getProduct(id) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products/${id}`,
  );
  return data.data;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function AllReviews({ params }) {
  const { id } = use(params);

  // Get product info
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 1000 * 60 * 5,
  });

  // Get all reviews
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["allReviews", id],
    queryFn: () => getReviews(id),
    staleTime: 1000 * 60 * 5,
  });

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  // Rating distribution
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    ratingCounts[r.rating - 1]++;
  });

  if (reviewsLoading || productLoading) return <SimpleLoad />;
  if (reviewsError || productError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title> shopNow | All Reviews </title>
      </Helmet>

      <section className="relative py-20 bg-slate-950 min-h-screen">
        <FixedBackground />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href={`/products/${id}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <FiArrowLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={20}
              />
              <span className="font-semibold">Back to Product</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <BsStars className="text-purple-400" size={16} />
              <span className="text-purple-400 text-sm font-semibold">
                ALL REVIEWS
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Customer{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reviews
              </span>
            </h1>

            <p className="text-slate-400 text-lg mb-6">{product?.title}</p>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">
                  {averageRating}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600"
                      }
                    />
                  ))}
                </div>
                <p className="text-slate-400 text-sm">Average Rating</p>
              </div>

              <div className="h-16 w-px bg-slate-700" />

              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">
                  {reviews.length}
                </div>
                <p className="text-slate-400 text-sm">
                  Total {reviews.length === 1 ? "Review" : "Reviews"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rating Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
          >
            <h3 className="text-white font-bold text-xl mb-6">
              Rating Distribution
            </h3>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((star, index) => {
                const count = ratingCounts[star - 1];
                const percentage = reviews.length
                  ? (count / reviews.length) * 100
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-20">
                      <span className="text-white font-semibold">{star}</span>
                      <FiStar
                        size={16}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    </div>
                    <div className="flex-1 h-4 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <span className="text-slate-400 w-16 text-right">
                      {count} {count === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* All Reviews */}
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {review.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {/* User Info */}
                    <div>
                      <h4 className="text-white font-semibold">
                        {review.user?.name || "Anonymous"}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FiCalendar size={14} />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-full">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-slate-300 leading-relaxed mb-4">
                  {review.review}
                </p>

                {/* Verified Badge */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <BsStars size={12} />
                    Verified Purchase
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {reviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl"
            >
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiStar className="text-slate-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Reviews Yet
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Be the first to share your thoughts about this product.
              </p>
              <Link
                href={`/products/${id}`}
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
              >
                Back to Product
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
