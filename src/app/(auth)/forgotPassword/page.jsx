"use client";

import { FiMail, FiArrowLeft } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";

export default function ForgotPassword() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);

    const toastId = toast.loading("Sending reset code...");

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        values,
      );

      console.log("Response:", data); // ✅ للـ debugging

      // ✅ Check for success
      if (data.statusMsg === "success" || data.message === "success") {
        toast.success("Reset code sent to your email!", { id: toastId });
        setIsSuccess(true);

        // Store email in localStorage for verify page
        localStorage.setItem("resetEmail", values.email);

        setTimeout(() => {
          router.push("/verify-code");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to send reset code");
      }
    } catch (err) {
      console.error("Error:", err); // ✅ للـ debugging

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";

      setApiError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-20">
      {/* Background Effects */}
      <FixedBackground />

      {/* Forgot Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative p-8 md:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
          {/* Back Button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <FiArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={18}
            />
            <span className="text-sm font-semibold">Back to Login</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
              <FiMail className="text-purple-400" size={16} />
              <span className="text-purple-400 text-sm font-semibold">
                PASSWORD RECOVERY
              </span>
            </div>

            <h1 className="text-4xl font-black text-white mb-2">
              Forgot{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Password?
              </span>
            </h1>
            <p className="text-slate-400">
              No worries! Enter your email and we'll send you a reset code
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* API ERROR */}
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

              {/* Email */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...formik.getFieldProps("email")}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                    }`}
                  />
                </div>

                {formik.errors.email && formik.touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm mt-2"
                  >
                    <MdErrorOutline size={16} />
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </form>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Check Your Email!
              </h3>
              <p className="text-slate-400 mb-6">
                We've sent a verification code to{" "}
                <span className="text-purple-400 font-semibold">
                  {formik.values.email}
                </span>
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-300">
                <p className="mb-2">📧 Please check your inbox</p>
                <p className="text-slate-500">
                  Didn't receive the email? Check your spam folder
                </p>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-500">OR</span>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="text-center space-y-2">
            <p className="text-slate-400 text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-pink-400 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-purple-400 hover:text-pink-400 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </motion.div>
    </main>
  );
}
