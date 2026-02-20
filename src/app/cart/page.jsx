"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiTag, FiChevronDown, FiShoppingCart, FiAlertTriangle } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  clearUserCart,
} from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import CartCard from "../../Components/CartCard/CartCard";
import SimpleLoad from "../../Components/SimpleLoad/SimpleLoad";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems, cartCount, cartTotal, loading } = useSelector(
    (state) => state.cartReducer,
  );
  const { token } = useSelector((state) => state.authReducer);

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(null);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart on mount
  useEffect(() => {
    if (token) {
      dispatch(getCart(token));
    }
  }, [token, dispatch]);

  // Mock discount codes
  const validCodes = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    WELCOME: 0.15,
  };

  const handleApplyDiscount = () => {
    setError("");

    if (!discountCode.trim()) {
      setError("Please enter a discount code");
      return;
    }

    const upperCode = discountCode.toUpperCase();

    if (!validCodes[upperCode]) {
      setError("Invalid discount code");
      return;
    }

    setDiscountApplied({
      code: upperCode,
      percentage: validCodes[upperCode] * 100,
    });
    setDiscountCode("");
    setShowDiscountInput(false);
    toast.success(`${upperCode} applied successfully!`);
  };

  const handleUpdateQuantity = (productId, newCount) => {
    if (newCount < 1) return;
    dispatch(updateItemQuantity({ productId, count: newCount, token }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeItemFromCart({ productId, token }));
  };

  const handleClearCart = () => {
    dispatch(clearUserCart(token));
    setShowClearModal(false);
  };

  const discountAmount = discountApplied
    ? (cartTotal * validCodes[discountApplied.code]).toFixed(2)
    : 0;
  const finalTotal = (cartTotal - discountAmount).toFixed(2);

  // Loading State
  if (loading && cartItems.length === 0) return <SimpleLoad />;

  return (
    <>
      <section className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <BsStars className="text-purple-400" size={16} />
              <span className="text-purple-400 text-sm font-semibold">
                SHOPPING CART
              </span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                  Your{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Cart
                  </span>
                </h1>
                <p className="text-slate-400 text-lg">
                  {cartCount > 0
                    ? `${cartCount} ${cartCount === 1 ? "item" : "items"} in your cart`
                    : "Your cart is empty"}
                </p>
              </div>

              {cartCount > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="px-6 py-3 bg-red-600/20 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 transition-all flex items-center gap-2"
                >
                  <FiTrash2 size={18} />
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          {cartCount === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiShoppingCart className="text-slate-600" size={64} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Your cart is empty
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start
                shopping to fill it up!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems?.map((item, index) => (
                    <CartCard
                      key={item?.product._id}
                      item={item}
                      loading={loading}
                      index={index}
                      handleUpdateQuantity={handleUpdateQuantity}
                      handleRemoveItem={handleRemoveItem}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Discount Code */}
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
                    <div
                      onClick={() => setShowDiscountInput(!showDiscountInput)}
                      className="p-6 cursor-pointer hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                            <FiTag className="text-amber-400" size={20} />
                          </div>
                          <div>
                            <p className="text-white font-bold">
                              Discount Code
                            </p>
                            <p className="text-xs text-slate-400">
                              {discountApplied
                                ? `${discountApplied.code} Applied`
                                : "Add a code to save"}
                            </p>
                          </div>
                        </div>
                        <FiChevronDown
                          className={`text-slate-400 transition-transform ${
                            showDiscountInput ? "rotate-180" : ""
                          }`}
                          size={20}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {showDiscountInput && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-800 p-6"
                        >
                          <input
                            type="text"
                            placeholder="Enter code (e.g., SAVE10)"
                            value={discountCode}
                            onChange={(e) => {
                              setDiscountCode(e.target.value);
                              setError("");
                            }}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-3"
                          />
                          <button
                            onClick={handleApplyDiscount}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                          >
                            Apply Code
                          </button>
                          {error && (
                            <p className="text-red-400 text-sm mt-2">{error}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-3">
                            Try: SAVE10, SAVE20, or WELCOME
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {discountApplied && (
                      <div className="px-6 py-4 bg-emerald-600/10 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-emerald-400">
                            Discount ({discountApplied.percentage}%)
                          </span>
                          <span className="font-bold text-emerald-400">
                            -${discountAmount}
                          </span>
                        </div>
                        <button
                          onClick={() => setDiscountApplied(null)}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Remove code
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl shadow-purple-500/30">
                    <h3 className="text-white font-black text-2xl mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                      <div className="flex justify-between text-white/80">
                        <span>Subtotal ({cartCount} items)</span>
                        <span className="font-semibold">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>

                      {discountApplied && (
                        <div className="flex justify-between text-emerald-200">
                          <span>Discount</span>
                          <span className="font-semibold">
                            -${discountAmount}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-white/80">
                        <span>Shipping</span>
                        <span className="font-semibold">FREE</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                      <span className="text-white text-xl font-bold">
                        Total
                      </span>
                      <span className="text-white text-4xl font-black">
                        ${finalTotal}
                      </span>
                    </div>

                    <Link
                      href={"/check-out"}
                      className="block text-center bg-white text-purple-600 font-black py-4 rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      Proceed to Checkout
                    </Link>

                    <p className="text-center text-white/70 text-xs mt-4">
                      🎉 You&apos;re saving{" "}
                      {discountApplied
                        ? `$${discountAmount}`
                        : "with free shipping"}
                      !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Clear Cart Modal */}
      <AnimatePresence>
        {showClearModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-b border-slate-800 p-6">
                  <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiAlertTriangle className="text-red-400" size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-white text-center">
                    Clear Your Cart?
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-300 text-center mb-6">
                    Are you sure you want to remove all{" "}
                    <span className="text-white font-bold">{cartCount}</span>{" "}
                    {cartCount === 1 ? "item" : "items"} from your cart? This
                    action cannot be undone.
                  </p>

                  {/* Items Preview */}
                  <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm">Total Items</span>
                      <span className="text-white font-bold">{cartCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Total Value</span>
                      <span className="text-white font-bold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClearModal(false)}
                      className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}