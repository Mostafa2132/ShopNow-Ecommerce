"use client";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
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

export default function Signup() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const router = useRouter();

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
    phone: yup
      .string()
      .required("Phone is required")
      .matches(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number",
      ),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
        "Password must contain at least 6 characters, 1 number & 1 special character",
      ),
    rePassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      toastId = toast.loading("Creating your account...");
      const res = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        values,
      );

      if (res.data.message === "success") {
        toast.success("Account created successfully!", { id: toastId });

        setTimeout(() => {
          toast.info("Redirecting to login...");
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      if (errorMessage == "Account Already Exists") {
        toast.info("Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>ShopNow | SignUp Page </title>
      </Helmet>
      <main className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-20">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="relative p-8 md:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
            {/* Header */}
            <FixedHeader
              word={"Create"}
              title={"Account"}
              subTitle={"Sign up to start your shopping journey"}
              header={"Join Us Today"}
            />

            <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
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

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-slate-300 text-sm font-semibold mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    {...formik.getFieldProps("name")}
                    placeholder="Enter your full name"
                    aria-invalid={!!(formik.errors.name && formik.touched.name)}
                    aria-describedby={formik.errors.name && formik.touched.name ? "name-error" : undefined}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.name && formik.touched.name
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                    }`}
                  />
                </div>
                {formik.errors.name && formik.touched.name && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="name-error"
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={14} aria-hidden="true" />
                    {formik.errors.name}
                  </motion.p>
                )}
              </div>

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
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
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
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={14} aria-hidden="true" />
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-slate-300 text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    {...formik.getFieldProps("phone")}
                    placeholder="01XXXXXXXXX"
                    aria-invalid={!!(formik.errors.phone && formik.touched.phone)}
                    aria-describedby={formik.errors.phone && formik.touched.phone ? "phone-error" : undefined}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.phone && formik.touched.phone
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                    }`}
                  />
                </div>
                {formik.errors.phone && formik.touched.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="phone-error"
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={14} aria-hidden="true" />
                    {formik.errors.phone}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-slate-300 text-sm font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    name="password"
                    {...formik.getFieldProps("password")}
                    placeholder="Create a password"
                    aria-invalid={!!(formik.errors.password && formik.touched.password)}
                    aria-describedby={formik.errors.password && formik.touched.password ? "password-error" : undefined}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.password && formik.touched.password
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-pink-500/50 focus:border-pink-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded p-1"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <FiEyeOff size={20} aria-hidden="true" /> : <FiEye size={20} aria-hidden="true" />}
                  </button>
                </div>
                {formik.values.password.length > 0 && (
                  <div className="mt-2" aria-hidden="true">
                    <PasswordStrengthBar password={formik.values.password} />
                  </div>
                )}
                {formik.errors.password && formik.touched.password && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="password-error"
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={14} aria-hidden="true" />
                    {formik.errors.password}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="rePassword" className="block text-slate-300 text-sm font-semibold mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="rePassword"
                    type={showRePass ? "text" : "password"}
                    name="rePassword"
                    {...formik.getFieldProps("rePassword")}
                    placeholder="Confirm your password"
                    aria-invalid={!!(formik.errors.rePassword && formik.touched.rePassword)}
                    aria-describedby={formik.errors.rePassword && formik.touched.rePassword ? "rePassword-error" : undefined}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      formik.errors.rePassword && formik.touched.rePassword
                        ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                        : "border-slate-700 focus:ring-pink-500/50 focus:border-pink-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePass(!showRePass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 rounded p-1"
                    aria-label={showRePass ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showRePass ? <FiEyeOff size={20} aria-hidden="true" /> : <FiEye size={20} aria-hidden="true" />}
                  </button>
                </div>
                {formik.errors.rePassword && formik.touched.rePassword && (
                  <motion.p
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="rePassword-error"
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                    role="alert"
                  >
                    <MdErrorOutline size={14} aria-hidden="true" />
                    {formik.errors.rePassword}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-6 focus:outline-none focus:ring-4 focus:ring-pink-500"
              >
                <span className="relative z-10">
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </span>
                <div className={`absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-opacity duration-300 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-500">OR</span>
              </div>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-slate-400 text-sm">
              Already have an account?{" "}
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
