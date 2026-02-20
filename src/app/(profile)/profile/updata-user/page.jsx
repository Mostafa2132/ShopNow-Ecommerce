"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* General API Error */}
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

          {/* Name */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Full Name
            </label>
            <div className="relative">
              <FiUser
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter your full name"
                {...formik.getFieldProps("name")}
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
              >
                <MdErrorOutline size={16} />
                {fieldErrors.name || formik.errors.name}
              </motion.p>
            )}
          </div>

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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
              >
                <MdErrorOutline size={16} />
                {fieldErrors.email || formik.errors.email}
              </motion.p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FiPhone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                {...formik.getFieldProps("phone")}
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-2"
              >
                <MdErrorOutline size={16} />
                {fieldErrors.phone || formik.errors.phone}
              </motion.p>
            )}
            <p className="text-slate-500 text-xs mt-2">
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
              className="flex-1 px-6 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={updateMutation.isPending || !formik.dirty}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group flex items-center justify-center gap-2"
            >
              <FiSave size={20} />
              <span className="relative z-10">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-lg">ℹ️</span>
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
                    className="text-blue-400 hover:text-blue-300 underline"
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
