"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin, FiPhone, FiHome } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Add_Address_Modal({ isOpen, setIsOpen, onSuccess }) {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((store) => store.authReducer);

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Address name is required")
      .min(3, "Name must be at least 3 characters"),
    details: yup
      .string()
      .required("Address details are required")
      .min(10, "Details must be at least 10 characters"),
    phone: yup
      .string()
      .required("Phone is required")
      .matches(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number",
      ),
    city: yup
      .string()
      .required("City is required")
      .min(3, "City must be at least 3 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      details: "",
      phone: "",
      city: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      toast.loading("Adding address...");

      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        values,
        {
          headers: { token },
        },
      );

      toast.success("Address added successfully!", { id: toastId });
      formik.resetForm();
      onSuccess?.(); // Refresh addresses list
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add address. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    formik.resetForm();
    setApiError(null);
    setIsOpen(false);
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
            onClick={handleClose}
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
              className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl my-8"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all duration-300 z-10"
              >
                <FiX size={24} />
              </button>

              {/* Header */}
              <div className="p-8 pb-6">
                <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                  <BsStars className="text-purple-400" size={16} />
                  <span className="text-purple-400 text-sm font-semibold">
                    NEW ADDRESS
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                  Add{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Address
                  </span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Add a new delivery address to your account
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

                {/* Name */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Address Name
                  </label>
                  <div className="relative">
                    <FiHome
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="e.g., Home, Office, etc."
                      {...formik.getFieldProps("name")}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        formik.errors.name && formik.touched.name
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                          : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                      }`}
                    />
                  </div>
                  {formik.errors.name && formik.touched.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm mt-2"
                    >
                      <MdErrorOutline size={16} />
                      {formik.errors.name}
                    </motion.p>
                  )}
                </div>

                {/* Details */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Address Details
                  </label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-4 top-4 text-slate-400"
                      size={20}
                    />
                    <textarea
                      rows={4}
                      placeholder="Street address, building number, floor, etc."
                      {...formik.getFieldProps("details")}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        formik.errors.details && formik.touched.details
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                          : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                      }`}
                    />
                  </div>
                  {formik.errors.details && formik.touched.details && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm mt-2"
                    >
                      <MdErrorOutline size={16} />
                      {formik.errors.details}
                    </motion.p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                          formik.errors.phone && formik.touched.phone
                            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                            : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {formik.errors.phone && formik.touched.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm mt-2"
                      >
                        <MdErrorOutline size={16} />
                        {formik.errors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">
                      City
                    </label>
                    <div className="relative">
                      <FiMapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="e.g., Cairo, Giza"
                        {...formik.getFieldProps("city")}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          formik.errors.city && formik.touched.city
                            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                            : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                        }`}
                      />
                    </div>
                    {formik.errors.city && formik.touched.city && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm mt-2"
                      >
                        <MdErrorOutline size={16} />
                        {formik.errors.city}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isLoading ? "Adding..." : "Add Address"}
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
