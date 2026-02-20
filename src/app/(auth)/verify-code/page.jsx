"use client";

import { MdErrorOutline } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

export default function VerifyCode() {
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const router = useRouter();

  const validationSchema = yup.object({
    resetCode: yup
      .string()
      .required("Verification code is required")
      .matches(/^\d{6}$/, "Code must be 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    setIsLoading(true);
    setApiError(null);
    let toastId;

    try {
      toastId = toast.loading("Verifying code...");
      const res = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        values,
      );

      if (res.data.status === "Success") {
        toast.success("Code verified successfully!", { id: toastId });

        setTimeout(() => {
          toast.info("Redirecting to reset password...");
          router.push("/reset-password");
        }, 1500);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage =
        err.response?.data?.message || "Invalid code. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  }

  // Handle code input changes
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Update formik value
    formik.setFieldValue("resetCode", newCode.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("");
    setCode([...newCode, ...Array(6 - newCode.length).fill("")]);
    formik.setFieldValue("resetCode", pastedData);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // Resend code function
  const handleResendCode = async () => {
    const email = localStorage.getItem("resetEmail"); // Save email in forgot-password page

    if (!email) {
      toast.error("Please start from forgot password page");
      router.push("/forgotPassword");
      return;
    }

    try {
      const toastId = toast.loading("Resending code...");
      await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        { email },
      );
      toast.success("New code sent to your email!", { id: toastId });
    } catch (err) {
      toast.error("Failed to resend code");
    }
  };

  return (
    <>
      <Helmet>
        <title>ShopNow | Verify Code </title>
      </Helmet>

      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-20">
        {/* Background Effects */}
        <FixedBackground />

        {/* Verify Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="relative p-8 md:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
            {/* Back Button */}
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            >
              <FiArrowLeft
                className="group-hover:-translate-x-1 transition-transform"
                size={18}
              />
              <span className="text-sm font-semibold">Back</span>
            </Link>

            {/* Header */}

            <FixedHeader
              word={"Enter"}
              title={"Code"}
              subTitle={"We've sent a 6-digit verification code to your email"}
              header={"Verification"}
            />

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

              {/* Code Inputs */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-4 text-center">
                  Verification Code
                </label>
                <div
                  className="flex gap-3 justify-center"
                  onPaste={handlePaste}
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-14 h-14 text-center text-2xl font-bold rounded-xl bg-slate-800/50 border text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                        formik.errors.resetCode && formik.touched.resetCode
                          ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                          : "border-slate-700 focus:ring-purple-500/50 focus:border-purple-500"
                      }`}
                    />
                  ))}
                </div>

                {formik.errors.resetCode && formik.touched.resetCode && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-400 text-sm mt-4"
                  >
                    <MdErrorOutline size={16} />
                    {formik.errors.resetCode}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || code.join("").length !== 6}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? "Verifying..." : "Verify Code"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-purple-400 hover:text-pink-400 font-semibold text-sm transition-colors"
                >
                  Resend Code
                </button>
              </div>
            </form>

            {/* Tips */}
            <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs text-center">
                💡 <span className="font-semibold">Tip:</span> You can paste the
                entire code from your email
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-500">OR</span>
              </div>
            </div>

            {/* Bottom Link */}
            <p className="text-center text-slate-400 text-sm">
              Back to{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-pink-400 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
        </motion.div>
      </section>
    </>
  );
}
