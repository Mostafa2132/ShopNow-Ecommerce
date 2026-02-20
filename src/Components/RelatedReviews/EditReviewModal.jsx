"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiStar } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function EditReviewModal({
  isOpen,
  setIsOpen,
  review,
  onSuccess,
}) {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { token } = useSelector((store) => store.authReducer);

  const validationSchema = yup.object({
    review: yup
      .string()
      .required("Review is required")
      .min(10, "Review must be at least 10 characters")
      .max(500, "Review must be less than 500 characters"),
    rating: yup
      .number()
      .required("Rating is required")
      .min(1, "Please select a rating")
      .max(5, "Rating must be between 1 and 5"),
  });

  const formik = useFormik({
    initialValues: {
      review: review.review || "",
      rating: review.rating || 0,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      toast.loading("Updating your review...");

      await axios.put(
        `https://ecommerce.routemisr.com/api/v1/reviews/${review._id}`,
        {
          review: values.review,
          rating: values.rating,
        },
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("Review updated successfully!", { id: toastId });
      onSuccess?.();
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to update review. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  const handleRatingClick = (rating) => {
    formik.setFieldValue("rating", rating);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all duration-300 z-10"
              >
                <FiX size={24} />
              </button>

              {/* Header */}
              <div className="p-8 pb-6">
                <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                  <BsStars className="text-purple-400" size={16} />
                  <span className="text-purple-400 text-sm font-semibold">
                    EDIT REVIEW
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Update{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Review
                  </span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Update your review and rating
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="px-8 pb-8 space-y-6"
              >
                {/* API Error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
                  >
                    <MdErrorOutline size={20} />
                    <span>{apiError}</span>
                  </motion.div>
                )}

                {/* Rating */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                      >
                        <FiStar
                          size={40}
                          className={`transition-all duration-200 ${
                            star <= (hoveredRating || formik.values.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-600"
                          }`}
                        />
                      </motion.button>
                    ))}
                    {formik.values.rating > 0 && (
                      <span className="ml-2 text-white font-semibold">
                        {formik.values.rating}.0
                      </span>
                    )}
                  </div>
                  {formik.errors.rating && formik.touched.rating && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm mt-2"
                    >
                      <MdErrorOutline size={16} />
                      {formik.errors.rating}
                    </motion.p>
                  )}
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Your Review
                  </label>
                  <textarea
                    name="review"
                    {...formik.getFieldProps("review")}
                    placeholder="Tell us what you think about this product..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                      formik.errors.review && formik.touched.review
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                    }`}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                      {formik.values.review.length}/500 characters
                    </span>
                    {formik.errors.review && formik.touched.review && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-xs"
                      >
                        <MdErrorOutline size={14} />
                        {formik.errors.review}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isLoading ? "Updating..." : "Update Review"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
