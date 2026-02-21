"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

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
              token, // Make sure token is sent
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
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>ShopNow | Check Out </title>
      </Helmet>
      <main className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

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
            <section
              className="lg:col-span-2"
              aria-labelledby="shipping-address-heading"
            >
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
              >
                <h2
                  id="shipping-address-heading"
                  className="text-2xl font-black text-white mb-6"
                >
                  Shipping Address
                </h2>

                <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-6"
                  noValidate
                >
                  {/* API Error */}
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
                      role="alert"
                      aria-live="assertive"
                    >
                      <MdErrorOutline size={20} aria-hidden="true" />
                      <span>{apiError}</span>
                    </motion.div>
                  )}

                  {/* Address Details */}
                  <div>
                    <label
                      htmlFor="details"
                      className="block text-slate-300 text-sm font-semibold mb-2"
                    >
                      Address Details{" "}
                      <span className="text-red-500" aria-hidden="true">
                        *
                      </span>
                      <span className="sr-only">Required</span>
                    </label>
                    <div className="relative">
                      <FiMapPin
                        className="absolute left-4 top-4 text-slate-400"
                        size={20}
                        aria-hidden="true"
                      />
                      <textarea
                        id="details"
                        rows={4}
                        placeholder="Street address, building number, floor, etc."
                        {...formik.getFieldProps("details")}
                        aria-invalid={
                          !!(formik.errors.details && formik.touched.details)
                        }
                        aria-describedby={
                          formik.errors.details && formik.touched.details
                            ? "details-error"
                            : undefined
                        }
                        className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                          formik.errors.details && formik.touched.details
                            ? "border-red-500/50 focus:ring-red-500/50"
                            : "border-slate-700 focus:ring-purple-500/50"
                        }`}
                      />
                    </div>
                    {formik.errors.details && formik.touched.details && (
                      <p
                        id="details-error"
                        className="flex items-center gap-2 text-red-400 text-sm mt-2"
                        aria-live="polite"
                      >
                        <MdErrorOutline size={16} aria-hidden="true" />
                        {formik.errors.details}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-slate-300 text-sm font-semibold mb-2"
                      >
                        Phone Number{" "}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                        <span className="sr-only">Required</span>
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
                          aria-invalid={
                            !!(formik.errors.phone && formik.touched.phone)
                          }
                          aria-describedby={
                            formik.errors.phone && formik.touched.phone
                              ? "phone-error"
                              : undefined
                          }
                          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            formik.errors.phone && formik.touched.phone
                              ? "border-red-500/50 focus:ring-red-500/50"
                              : "border-slate-700 focus:ring-purple-500/50"
                          }`}
                        />
                      </div>
                      {formik.errors.phone && formik.touched.phone && (
                        <p
                          id="phone-error"
                          className="flex items-center gap-2 text-red-400 text-sm mt-2"
                          aria-live="polite"
                        >
                          <MdErrorOutline size={16} aria-hidden="true" />
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-slate-300 text-sm font-semibold mb-2"
                      >
                        City{" "}
                        <span className="text-red-500" aria-hidden="true">
                          *
                        </span>
                        <span className="sr-only">Required</span>
                      </label>
                      <div className="relative">
                        <FiHome
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          size={20}
                          aria-hidden="true"
                        />
                        <input
                          id="city"
                          type="text"
                          placeholder="e.g., Cairo, Giza"
                          {...formik.getFieldProps("city")}
                          aria-invalid={
                            !!(formik.errors.city && formik.touched.city)
                          }
                          aria-describedby={
                            formik.errors.city && formik.touched.city
                              ? "city-error"
                              : undefined
                          }
                          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            formik.errors.city && formik.touched.city
                              ? "border-red-500/50 focus:ring-red-500/50"
                              : "border-slate-700 focus:ring-purple-500/50"
                          }`}
                        />
                      </div>
                      {formik.errors.city && formik.touched.city && (
                        <p
                          id="city-error"
                          className="flex items-center gap-2 text-red-400 text-sm mt-2"
                          aria-live="polite"
                        >
                          <MdErrorOutline size={16} aria-hidden="true" />
                          {formik.errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Postal Code (Optional) */}
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-slate-300 text-sm font-semibold mb-2"
                    >
                      Postal Code{" "}
                      <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      placeholder="e.g., 12345"
                      {...formik.getFieldProps("postalCode")}
                      className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>

                  {/* Payment Method */}
                  <fieldset>
                    <legend className="block text-slate-300 text-sm font-semibold mb-4">
                      Payment Method
                    </legend>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          paymentMethod === "cash"
                            ? "border-purple-500 bg-purple-600/20"
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                        aria-pressed={paymentMethod === "cash"}
                      >
                        <FiDollarSign
                          className={`mx-auto mb-2 ${
                            paymentMethod === "cash"
                              ? "text-purple-400"
                              : "text-slate-400"
                          }`}
                          size={24}
                          aria-hidden="true"
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
                        className={`p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          paymentMethod === "card"
                            ? "border-purple-500 bg-purple-600/20"
                            : "border-slate-700 hover:border-slate-600"
                        }`}
                        aria-pressed={paymentMethod === "card"}
                      >
                        <FiCreditCard
                          className={`mx-auto mb-2 ${
                            paymentMethod === "card"
                              ? "text-purple-400"
                              : "text-slate-400"
                          }`}
                          size={24}
                          aria-hidden="true"
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
                  </fieldset>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-purple-500"
                    aria-live="polite"
                  >
                    <span className="relative z-10">
                      {isLoading
                        ? "Processing..."
                        : paymentMethod === "cash"
                          ? "Place Order"
                          : "Proceed to Payment"}
                    </span>
                    {!shouldReduceMotion && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </section>

            {/* Order Summary */}
            <aside className="lg:col-span-1" aria-label="Order Summary">
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
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
                    <div
                      className="flex items-center justify-between"
                      aria-live="polite"
                    >
                      <span className="text-white font-bold text-lg">
                        Total
                      </span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        <span className="sr-only">
                          Order total price in dollars
                        </span>
                        ${cartTotal || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                  <p className="text-purple-400 text-sm font-semibold mb-2">
                    <span aria-hidden="true">🎉</span> Special Offer
                  </p>
                  <p className="text-slate-300 text-xs">
                    Free shipping on all orders!
                  </p>
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
