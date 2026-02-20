"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import FixedBackground from "../Components/FixedBackground/FixedBackground";

export default function NotFound() {
  return (
    <section className="relative min-h-screen mb-12 bg-slate-950 flex items-center justify-center overflow-hidden px-4">
      {/* Background Effects */}
      <FixedBackground />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              404
            </span>
          </h1>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-5 py-2.5 rounded-full mb-6"
        >
          <BsStars className="text-purple-400" size={18} />
          <span className="text-purple-400 text-sm font-semibold">
            PAGE NOT FOUND
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
        >
          Oops! Lost in Space
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved
          to another galaxy. Don&apos;t worry, we&lsquo;ll help you find your
          way back home.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white text-lg overflow-hidden shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FiHome size={24} />
                Back to Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>

          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl font-bold text-white text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-3"
            >
              <FiSearch size={24} />
              Browse Products
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 pt-8 border-t border-slate-800"
        >
          <p className="text-slate-400 text-sm mb-4">Popular Pages:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { name: "Home", href: "/" },
              { name: "Products", href: "/products" },
              { name: "Deals", href: "/deal" },
              { name: "Brands", href: "/brands" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-purple-400 transition-colors text-sm font-semibold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-purple-600/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-16 h-16 bg-pink-600/20 rounded-full blur-xl"
        />
      </div>
    </section>
  );
}
