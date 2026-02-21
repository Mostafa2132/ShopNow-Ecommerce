"use client";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";
import { BsFastForward, BsFastForwardBtn, BsStars } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

export default function ResetPassword() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const router = useRouter();

  const validationSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
    newPassword: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
        "Password must contain at least 6 characters, 1 number & 1 special character",
      ),
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      toastId = toast.loading("Resetting your password...");
      const res = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          email: values.email,
          newPassword: values.newPassword,
        },
      );

      if (res.data.token) {
        toast.success("Password reset successfully!", { id: toastId });

        setTimeout(() => {
          toast.info("Redirecting to login...");
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
    }
  }

  return (
    <>
      <Helmet>
        <title>ShopNow | Reset Password </title>
      </Helmet>

      <main className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-20">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

        {/* Reset Password Card */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="relative p-8 md:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
            {/* Back Button */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
              aria-label="Back to Login"
            >
              <FiArrowLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={18}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold">Back to Login</span>
            </Link>

            {/* Header */}

            <FixedHeader
              header={"Reset Password"}
              word={"New"}
              title={"Password"}
              subTitle={"Create a strong password to secure your account"}
            />

            <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
              {/* API ERROR */}
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
                  role="alert"
                >
                  <MdErrorOutline size={20} aria-hidden="true" />
                  <span>{apiError}</span>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-slate-300 text-sm font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    {...formik.getFieldProps("email")}
                    placeholder="Enter your email"
                    aria-invalid={!!(formik.errors.email && formik.touched.email)}
                    aria-describedby={formik.errors.email && formik.touched.email ? "email-error" : undefined}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.email && formik.touched.email
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                    }`}
                  />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="email-error"
                    className="flex items-center gap-2 text-red-400 text-sm mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={16} aria-hidden="true" />
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-slate-300 text-sm font-semibold mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    {...formik.getFieldProps("newPassword")}
                    placeholder="Create a strong password"
                    aria-invalid={!!(formik.errors.newPassword && formik.touched.newPassword)}
                    aria-describedby={formik.errors.newPassword && formik.touched.newPassword ? "newPassword-error" : undefined}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.newPassword && formik.touched.newPassword
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-pink-500/50 focus:border-pink-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} aria-hidden="true" />
                    ) : (
                      <FiEye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>

                {formik.values.newPassword.length > 0 && (
                  <div className="mt-3" aria-hidden="true">
                    <PasswordStrengthBar password={formik.values.newPassword} />
                  </div>
                )}

                {formik.errors.newPassword && formik.touched.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="newPassword-error"
                    className="flex items-center gap-2 text-red-400 text-sm mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={16} aria-hidden="true" />
                    {formik.errors.newPassword}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-slate-300 text-sm font-semibold mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    {...formik.getFieldProps("confirmPassword")}
                    placeholder="Confirm your password"
                    aria-invalid={!!(formik.errors.confirmPassword && formik.touched.confirmPassword)}
                    aria-describedby={formik.errors.confirmPassword && formik.touched.confirmPassword ? "confirmPassword-error" : undefined}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.confirmPassword &&
                      formik.touched.confirmPassword
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-pink-500/50 focus:border-pink-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded p-1"
                    aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={20} aria-hidden="true" />
                    ) : (
                      <FiEye size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>

                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="confirmPassword-error"
                      className="flex items-center gap-2 text-red-400 text-sm mt-2"
                      role="alert"
                    >
                      <MdErrorOutline size={16} aria-hidden="true" />
                      {formik.errors.confirmPassword}
                    </motion.p>
                  )}
              </div>

              {/* Password Requirements */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4" aria-label="Password Security Requirements">
                <h4 className="text-white font-semibold text-sm mb-3">
                  Password Requirements:
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" aria-hidden="true"></span>
                    At least 6 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" aria-hidden="true"></span>
                    Contains at least one number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" aria-hidden="true"></span>
                    Contains at least one special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-pink-500"
              >
                <span className="relative z-10">
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-opacity duration-300 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true" />
              </motion.button>
            </form>

            {/* Security Note */}
            <div className="mt-6 bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 text-xs text-center flex items-center justify-center gap-2">
                <FiShield size={16} aria-hidden="true" />
                Your password will be encrypted and stored securely
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-500">OR</span>
              </div>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-slate-400 text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-pink-400 font-semibold transition-colors focus:outline-none focus:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Glow Effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl transition-opacity duration-500 -z-10 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true" />
        </motion.div>
      </main>
    </>
  );
}
