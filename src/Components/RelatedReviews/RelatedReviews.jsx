"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  FiStar,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SimpleLoad from "../SimpleLoad/SimpleLoad";
import AddReviewModal from "./AddReviewModal";
import EditReviewModal from "./EditReviewModal";
import SimpleError from "../SimpleError/SimpleError";
import Link from "next/link";

async function getReviews(id) {
  try {
    const options = {
      method: "GET",
      url: `https://ecommerce.routemisr.com/api/v1/products/${id}/reviews`,
    };
    const res = await axios.request(options);
    return res.data.data;
  } catch (error) {
    return [];
  }
}

async function deleteReview(reviewId, token) {
  const { data } = await axios.delete(
    `https://ecommerce.routemisr.com/api/v1/reviews/${reviewId}`,
    {
      headers: { token },
    },
  );
  return data;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function RelatedReviews({ id }) {
  const [isModelReviewOpen, setIsModalReviewOPen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  const queryClient = useQueryClient();

  const { token } = useSelector((store) => store.authReducer);

  // Get current user data
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      if (!token) return null;
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/users/getMe",
        {
          headers: { token },
        },
      );
      return data.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviews(id),
    staleTime: 1000 * 60 * 5,
  });

  // Delete Review Mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId, token),
    onMutate: () => {
      toast.loading("Deleting review...", { toastId: "delete-review" });
    },
    onSuccess: () => {
      toast.success("Review deleted successfully!", { id: "delete-review" });
      queryClient.invalidateQueries(["reviews", id]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to delete review";
      toast.error(errorMessage, { id: "delete-review" });
    },
    onSettled: () => {
      toast.dismiss("delete-review");
    },
  });

  const handleReviewAdded = () => {
    // Refresh reviews list
    queryClient.invalidateQueries(["reviews", id]);
    // Close modal
    setIsModalReviewOPen(false);
  };

  const handleDeleteClick = (reviewId) => {
    setSelectedReview(reviewId);
    setIsDeleteOpen(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleReviewUpdated = () => {
    queryClient.invalidateQueries(["reviews", id]);
    setEditingReview(null);
  };

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

  // Loading State
  if (isLoading) {
    return <SimpleLoad />;
  }

  // Error State
  if (isError) return <SimpleError />;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
        aria-labelledby="reviews-heading"
      >
        {/* Header */}
        <header className="flex items-center justify-between flex-wrap gap-6 mb-8">
          <div>
            <h2 id="reviews-heading" className="text-3xl md:text-4xl font-black text-white mb-2">
              Customer{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reviews
              </span>
            </h2>
            <p className="text-slate-400" aria-live="polite">
              {reviews.length > 0
                ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`
                : "Be the first to review this product"}
            </p>
          </div>

          {reviews.length > 0 && (
            <motion.div
              initial={{ scale: shouldReduceMotion ? 1 : 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-center bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6"
              aria-label={`Average rating: ${averageRating} out of 5 stars`}
            >
              <div className="text-5xl font-black text-white mb-2" aria-hidden="true">
                {averageRating}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1" aria-hidden="true">
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
              <p className="text-slate-400 text-sm" aria-hidden="true">Average Rating</p>
            </motion.div>
          )}
        </header>

        {/* Rating Distribution */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
            className="mb-8 bg-slate-800/50 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-4">Rating Distribution</h3>
            <div className="space-y-3" aria-label="Rating distribution breakdown">
              {[5, 4, 3, 2, 1].map((star, index) => {
                const count = ratingCounts[star - 1];
                const percentage = reviews.length
                  ? (count / reviews.length) * 100
                  : 0;
                return (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                    aria-label={`${star} star rating: ${count} reviews`}
                  >
                    <div className="flex items-center gap-1 w-16" aria-hidden="true">
                      <span className="text-white text-sm font-semibold">
                        {star}
                      </span>
                      <FiStar
                        size={14}
                        className="text-yellow-400 fill-yellow-400"
                      />
                    </div>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden" aria-hidden="true">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : 0.5 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                    <span className="text-slate-400 text-sm w-12 text-right" aria-hidden="true">
                      {count}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6" role="list" aria-label="Customer reviews list">
            {reviews.slice(0, 3).map((review, index) => {
              const isOwner = userData?._id === review.user?._id;

              return (
                <motion.article
                  key={review._id}
                  role="listitem"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  {/* Review Header */}
                  <header className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* User Avatar */}
                      <div aria-hidden="true" className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold">
                            {review.user?.name || "Anonymous"}
                          </h4>
                          {isOwner && (
                            <span className="bg-purple-600/20 border border-purple-500/30 text-purple-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400" aria-label={`Reviewed on ${formatDate(review.createdAt)}`}>
                          <FiCalendar size={14} aria-hidden="true" />
                          <span aria-hidden="true">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars & Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-900/50 px-3 py-1.5 rounded-full" aria-label={`Rated ${review.rating} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={16}
                            aria-hidden="true"
                            className={
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-600"
                            }
                          />
                        ))}
                      </div>

                      {/* Edit & Delete Buttons (Owner Only) */}
                      {isOwner && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
                            aria-label="Edit your review"
                          >
                            <FiEdit2 size={16} aria-hidden="true" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(review._id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label="Delete your review"
                          >
                            <FiTrash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>
                  </header>

                  {/* Review Text */}
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {review.review}
                  </p>

                  {/* Verified Badge */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full" aria-label="Verified Purchase">
                      <BsStars size={12} aria-hidden="true" />
                      <span aria-hidden="true">Verified Purchase</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <FiStar className="text-slate-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Reviews Yet
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Be the first to share your thoughts about this product. Your
              review helps other customers make informed decisions.
            </p>
            <motion.button
              onClick={() => setIsModalReviewOPen(true)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500"
            >
              Write a Review
            </motion.button>
          </motion.div>
        )}
        <div className="flex items-center flex-wrap gap-4 border-t pt-4 mt-6 border-slate-700 flex-1 justify-center">
          {/* Write Review Button (if reviews exist) */}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className=" text-center"
            >
              <motion.button
                onClick={() => setIsModalReviewOPen(true)}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500"
              >
                Write Your Review
              </motion.button>
            </motion.div>
          )}

          {/* show all reviews */}
          {reviews.length > 3 && (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="  text-center"
            >
              <Link
                href={`/reviews/${id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500"
              >
                Show All Reviews ({reviews.length})
                <FiArrowRight size={20} aria-hidden="true" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Add Review Modal */}

      <AddReviewModal
        isOpen={isModelReviewOpen}
        setIsOpen={setIsModalReviewOPen}
        productId={id}
        onSuccess={handleReviewAdded}
      />

      {/* Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          isOpen={!!editingReview}
          setIsOpen={() => setEditingReview(null)}
          review={editingReview}
          onSuccess={handleReviewUpdated}
        />
      )}
      {/* Delete modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-review-title" aria-describedby="delete-review-description">
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
            className="bg-slate-900 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/10"
          >
            <h2 id="delete-review-title" className="text-xl font-bold text-white mb-3">Delete Review</h2>

            <p id="delete-review-description" className="text-slate-400 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteMutation.mutate(selectedReview);
                  setIsDeleteOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
