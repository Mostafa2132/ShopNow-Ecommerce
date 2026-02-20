"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import PasswordStrengthBar from "react-password-strength-bar";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function ChangePassword() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    password: yup
      .string()
      .required("New password is required")
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
      currentPassword: "",
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
      const token = getCookie("token");
      toastId = toast.loading("Changing password...");

      await axios.put(
        "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
        values,
        {
          headers: { token },
        },
      );

      toast.success("Password changed successfully!", { id: toastId });
      formik.resetForm();
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>ShopNow | Change Password </title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-black text-white mb-6">Change Password</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {apiError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              <MdErrorOutline size={20} />
              <span>{apiError}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Current Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type={showCurrent ? "text" : "password"}
                {...formik.getFieldProps("currentPassword")}
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  formik.errors.currentPassword &&
                  formik.touched.currentPassword
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-slate-700 focus:ring-purple-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showCurrent ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formik.errors.currentPassword &&
              formik.touched.currentPassword && (
                <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                  <MdErrorOutline size={16} />
                  {formik.errors.currentPassword}
                </p>
              )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type={showNew ? "text" : "password"}
                {...formik.getFieldProps("password")}
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-slate-700 focus:ring-pink-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formik.values.password.length > 0 && (
              <div className="mt-3">
                <PasswordStrengthBar password={formik.values.password} />
              </div>
            )}
            {formik.errors.password && formik.touched.password && (
              <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                <MdErrorOutline size={16} />
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <FiLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type={showConfirm ? "text" : "password"}
                {...formik.getFieldProps("rePassword")}
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  formik.errors.rePassword && formik.touched.rePassword
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : "border-slate-700 focus:ring-pink-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formik.errors.rePassword && formik.touched.rePassword && (
              <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                <MdErrorOutline size={16} />
                {formik.errors.rePassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </motion.div>
    </>
  );
}
