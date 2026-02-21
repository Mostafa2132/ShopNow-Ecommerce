"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";
import { FiMail, FiPhone, FiSave, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import * as yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import SimpleLoad from "../../../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../../../Components/SimpleError/SimpleError";
import FixedHeader from "../../../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

// Update User Data
async function updateUserData(values, token) {
  if (!token) throw new Error("No token provided");

  const { data } = await axios.put(
    "https://ecommerce.routemisr.com/api/v1/users/updateMe",
    values,
    {
      headers: {
        token: token,
      },
    },
  );

  return data.data;
}

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

export default function UpdateUserInfo() {
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const queryClient = useQueryClient();
  const { token } = useSelector((store) => store.authReducer);
  const shouldReduceMotion = useReducedMotion();

  // Get User Data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: () => getUserData(token),
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (values) => updateUserData(values, token),
    onSuccess: (data) => {
      toast.success("Information updated successfully! ✅");
      queryClient.setQueryData(["userData"], data);
      queryClient.invalidateQueries(["userData"]);
      queryClient.invalidateQueries(["userInfo"]);
      setApiError(null);
      setFieldErrors({});
    },
    onError: (error) => {
      console.error("Update error:", error.response?.data);

      // ✅ Handle API errors array
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        // Map errors to fields
        const newFieldErrors = {};
        errors.forEach((err) => {
          if (err.param) {
            newFieldErrors[err.param] = err.msg;
          }
        });
        setFieldErrors(newFieldErrors);

        // Show first error in toast
        toast.error(errors[0].msg);
      } else {
        // Generic error
        const errorMessage =
          error.response?.data?.message || "Failed to update information";
        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    },
  });

  // Validation Schema
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
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      setApiError(null);
      setFieldErrors({});
      const updatedValues = { ...values };
      // لو الإيميل هو نفسه القديم → امسحه من البودي
      if (values.email === user.email) {
        delete updatedValues.email;
      }
      updateMutation.mutate(updatedValues);
    },
  });

  // ... loading and error states ...
  if (isLoading) return <SimpleLoad />;
  if (isError) return <SimpleError />;
  return (
    <>
      <Helmet>
        <title>ShopNow | Updata User Info </title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
      >
        {/* Header */}

        <FixedHeader
          header={"ACCOUNT SETTINGS"}
          title={"Information"}
          word={"Update Your"}
          subTitle={"Keep your account information up to date"}
        />

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {/* General API Error */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
              role="alert"
              aria-live="polite"
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
                placeholder="Enter your full name"
                {...formik.getFieldProps("name")}
                aria-invalid={!!((formik.errors.name && formik.touched.name) || fieldErrors.name)}
                aria-describedby={(formik.errors.name && formik.touched.name) || fieldErrors.name ? "name-error" : undefined}
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  (formik.errors.name && formik.touched.name) ||
                  fieldErrors.name
                    ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                }`}
              />
            </div>
            {((formik.errors.name && formik.touched.name) ||
              fieldErrors.name) && (
              <motion.p
                id="name-error"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
                role="alert"
                aria-live="polite"
              >
                <MdErrorOutline size={16} aria-hidden="true" />
                {fieldErrors.name || formik.errors.name}
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
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                aria-invalid={!!((formik.errors.email && formik.touched.email) || fieldErrors.email)}
                aria-describedby={(formik.errors.email && formik.touched.email) || fieldErrors.email ? "email-error" : undefined}
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  (formik.errors.email && formik.touched.email) ||
                  fieldErrors.email
                    ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                }`}
              />
            </div>
            {((formik.errors.email && formik.touched.email) ||
              fieldErrors.email) && (
              <motion.p
                id="email-error"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
                role="alert"
                aria-live="polite"
              >
                <MdErrorOutline size={16} aria-hidden="true" />
                {fieldErrors.email || formik.errors.email}
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
                placeholder="01XXXXXXXXX"
                {...formik.getFieldProps("phone")}
                aria-invalid={!!((formik.errors.phone && formik.touched.phone) || fieldErrors.phone)}
                aria-describedby={(formik.errors.phone && formik.touched.phone) || fieldErrors.phone ? "phone-error phone-hint" : "phone-hint"}
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  (formik.errors.phone && formik.touched.phone) ||
                  fieldErrors.phone
                    ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                    : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                }`}
              />
            </div>
            {((formik.errors.phone && formik.touched.phone) ||
              fieldErrors.phone) && (
              <motion.p
                id="phone-error"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
                role="alert"
                aria-live="polite"
              >
                <MdErrorOutline size={16} aria-hidden="true" />
                {fieldErrors.phone || formik.errors.phone}
              </motion.p>
            )}
            <p id="phone-hint" className="text-slate-500 text-xs mt-2">
              Egyptian format: 01XXXXXXXXX
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setFieldErrors({});
              }}
              disabled={updateMutation.isPending}
              className="flex-1 px-6 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Reset
            </button>

            <motion.button
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
              type="submit"
              disabled={updateMutation.isPending || !formik.dirty}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-pink-500"
            >
              <FiSave size={20} aria-hidden="true" />
              <span className="relative z-10">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </span>
              <div
                className={`absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 ${
                  shouldReduceMotion ? "hidden" : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                }`}
              />
            </motion.button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-lg" aria-hidden="true">ℹ️</span>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold text-sm mb-1">
                  Account Security
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Your personal information is encrypted and secure. To change
                  your password, please visit the{" "}
                  <Link
                    href="/profile/change-password"
                    className="text-blue-400 hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Change Password
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
