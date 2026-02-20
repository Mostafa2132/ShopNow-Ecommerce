"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiHome,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

export default function CheckOut() {
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash or card
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const router = useRouter();
  const { token } = useSelector((store) => store.authReducer);
  const { cartId, cartTotal } = useSelector((store) => store.cartReducer);

  const validationSchema = yup.object({
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
    postalCode: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      details: "",
      phone: "",
      city: "",
      postalCode: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    if (!cartId) {
      toast.error("Cart is empty!");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      const shippingAddress = {
        details: values.details,
        phone: values.phone,
        city: values.city,
        ...(values.postalCode && { postalCode: values.postalCode }),
      };

      if (paymentMethod === "cash") {
        // Cash on Delivery
        toastId = toast.loading("Creating your order...");

        const { data } = await axios.post(
          `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
          { shippingAddress },
          {
            headers: {
              token,
              "Content-Type": "application/json",
            },
          },
        );

        if (data.status === "success") {
          toast.success("Order placed successfully!", { id: toastId });
          setTimeout(() => {
            router.push("/allorders");
          }, 1500);
        }
      } else {
        // Online Payment (Card)
        toastId = toast.loading("Redirecting to payment...");

        const { data } = await axios.post(
          `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
          { shippingAddress },
          {
            headers: {
              token,
            },
          },
        );

        if (data.status === "success") {
          toast.success("Redirecting to payment gateway...", { id: toastId });
          // Redirect to Stripe payment page
          window.location.href = data.session.url;
        }
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create order. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>ShopNow | Check Out </title>
      </Helmet>
      <section className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}

          <FixedHeader
            header={"CHECKOUT"}
            subTitle={"Fill in your shipping details to proceed"}
            title={"Order"}
            word={"Complete Your"}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
              >
                <h2 className="text-2xl font-black text-white mb-6">
                  Shipping Address
                </h2>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
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

                  {/* Address Details */}
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
                            ? "border-red-500/50 focus:ring-red-500/50"
                            : "border-slate-700 focus:ring-purple-500/50"
                        }`}
                      />
                    </div>
                    {formik.errors.details && formik.touched.details && (
                      <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                        <MdErrorOutline size={16} />
                        {formik.errors.details}
                      </p>
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
                              ? "border-red-500/50 focus:ring-red-500/50"
                              : "border-slate-700 focus:ring-purple-500/50"
                          }`}
                        />
                      </div>
                      {formik.errors.phone && formik.touched.phone && (
                        <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                          <MdErrorOutline size={16} />
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        City
                      </label>
                      <div className="relative">
                        <FiHome
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="e.g., Cairo, Giza"
                          {...formik.getFieldProps("city")}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            formik.errors.city && formik.touched.city
                              ? "border-red-500/50 focus:ring-red-500/50"
                              : "border-slate-700 focus:ring-purple-500/50"
                          }`}
                        />
                      </div>
                      {formik.errors.city && formik.touched.city && (
                        <p className="flex items-center gap-2 text-red-400 text-sm mt-2">
                          <MdErrorOutline size={16} />
                          {formik.errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code (Optional) */}
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-2">
                      Postal Code{" "}
                      <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 12345"
                      {...formik.getFieldProps("postalCode")}
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-4">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          paymentMethod === "cash"
                            ? "border-purple-500 bg-purple-600/20"
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <FiDollarSign
                          className={`mx-auto mb-2 ${
                            paymentMethod === "cash"
                              ? "text-purple-400"
                              : "text-slate-400"
                          }`}
                          size={24}
                        />
                        <p
                          className={`font-semibold ${
                            paymentMethod === "cash"
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                        >
                          Cash on Delivery
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          paymentMethod === "card"
                            ? "border-purple-500 bg-purple-600/20"
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        <FiCreditCard
                          className={`mx-auto mb-2 ${
                            paymentMethod === "card"
                              ? "text-purple-400"
                              : "text-slate-400"
                          }`}
                          size={24}
                        />
                        <p
                          className={`font-semibold ${
                            paymentMethod === "card"
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                        >
                          Credit Card
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {isLoading
                        ? "Processing..."
                        : paymentMethod === "cash"
                          ? "Place Order"
                          : "Proceed to Payment"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sticky top-24"
              >
                <h3 className="text-xl font-black text-white mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">
                      ${cartTotal || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-semibold">Free</span>
                  </div>
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-lg">
                        Total
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ${cartTotal || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-purple-400 text-sm font-semibold mb-2">
                    🎉 Special Offer
                  </p>
                  <p className="text-slate-300 text-xs">
                    Free shipping on all orders!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
