"use client";

import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import UserModal from "../UserModal/UserModal";
import { getCart } from "../../store/slices/cartSlice";
import { getWishlist } from "../../store/slices/wishlistSlice";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const dispatch = useDispatch();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Brands", href: "/brands" },
    { name: "Deals", href: "/deal" },
    { name: "About", href: "/about" },
  ];

  const { token } = useSelector((store) => store.authReducer);
  const cartCount = useSelector((state) => state.cartReducer.cartCount);
  const wishListCount = useSelector(
    (state) => state.wishlistReducer.wishlistCount,
  );

  useEffect(() => {
    if (token) {
      dispatch(getCart(token));
      dispatch(getWishlist(token));
    }
  }, [dispatch, token]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Background with blur */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/10" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5" />

      {/* Main Navbar Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href={"/"}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <FiShoppingCart className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ShopNow
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-slate-300 hover:text-white font-semibold transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}

          <div className="flex items-center gap-4">
            {token ? (
              <>
                {/* Wishlist Icon */}
                <Link
                  href={"/wishlist"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex relative p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <FiHeart
                    className="text-slate-300 group-hover:text-pink-400 transition-colors"
                    size={20}
                  />
                  {wishListCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/50">
                      {wishListCount}
                    </span>
                  )}
                </Link>

                {/* Cart Icon with Badge */}
                <Link
                  href={"/cart"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <FiShoppingCart
                    className="text-slate-300 group-hover:text-purple-400 transition-colors"
                    size={20}
                  />

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/50">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Icon */}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="hidden md:flex p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300"
                >
                  <FiUser className="text-white" size={20} />
                </motion.button>
              </>
            ) : (
              <Link
                whileTap={{ scale: 0.95 }}
                href={"/login"}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            )}
            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {isMenuOpen ? (
                <FiX className="text-white" size={20} />
              ) : (
                <FiMenu className="text-white" size={20} />
              )}
            </motion.button>
          </div>

          {/* User Modal Dropdown */}
          <UserModal state={isUserOpen} setState={setIsUserOpen} />
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3">
            {/* Mobile Links */}
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="block px-4 py-3 text-slate-300 hover:text-white font-semibold bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Actions */}
            {token && (
              <div className="flex gap-3 pt-4">
                <Link href={"/wishlist"} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <FiHeart className="text-pink-400" size={18} />
                  <span className="text-white font-semibold text-sm">
                    Wishlist
                  </span>
                </Link>
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/50"
                >
                  <FiUser className="text-white" size={18} />
                  <span className="text-white font-semibold text-sm">
                    Account
                  </span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </motion.nav>
  );
}
