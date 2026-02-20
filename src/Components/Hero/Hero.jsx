"use client";

import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiStar,
  FiArrowRight,
  FiZap,
  FiHeart,
  FiTrendingUp,
} from "react-icons/fi";
import { useSelector } from "react-redux";

export default function Hero() {
  const { token } = useSelector((s) => s.authReducer);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950" />

        {/* Radial Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_50%)]" />

        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600 rounded-full blur-3xl opacity-15"
        />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.15) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1.5px, transparent 1.5px)
          `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-8"
            >
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl border border-purple-400/30 rounded-full px-6 py-3 shadow-lg shadow-purple-500/20">
                <div className="relative">
                  <FiZap className="text-yellow-400 animate-pulse" size={20} />
                  <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50" />
                </div>
                <span className="text-white font-bold text-sm tracking-wide">
                  MEGA SALE - UP TO 70% OFF
                </span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tight">
                <span className="block text-white drop-shadow-2xl">Shop</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Beyond
                </span>
                <span className="block text-white drop-shadow-2xl">Limits</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-xl font-light"
            >
              Experience luxury redefined. Premium products, exclusive deals,
              and worldwide delivery - all in one place.
            </motion.p>

            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {[
                {
                  icon: <FiTruck size={16} />,
                  text: "Free Worldwide Shipping",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: <FiShield size={16} />,
                  text: "100% Secure Checkout",
                  gradient: "from-blue-500 to-indigo-500",
                },
                {
                  icon: <FiStar size={16} />,
                  text: "5-Star Rated Service",
                  gradient: "from-amber-500 to-orange-500",
                },
              ].map((item, i) => (
                <div key={i} className="group relative ">
                  <div
                    className={`absolute overflow-hidden inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
                  />
                  <div className="relative flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <span className="text-white">{item.icon}</span>
                    <span className="text-white text-sm font-semibold">
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-5 mb-12"
            >
              <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg text-white overflow-hidden shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-3">
                  <FiShoppingBag size={24} />
                  Start Shopping
                  <FiArrowRight
                    className="group-hover:translate-x-2 transition-transform duration-300"
                    size={22}
                  />
                </span>
              </button>

              <button className="group px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl font-bold text-lg text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-3">
                <FiTrendingUp size={24} />
                Trending Now
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
            >
              {[
                {
                  value: "500K+",
                  label: "Products",
                  icon: <FiShoppingBag size={24} />,
                },
                { value: "4.9★", label: "Rating", icon: <FiStar size={24} /> },
                {
                  value: "2M+",
                  label: "Customers",
                  icon: <FiHeart size={24} />,
                },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-2 text-purple-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Product Showcase */}
          <div className="relative hidden lg:block">
            <div className="relative h-[700px]">
              {/* Large Feature Card */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="absolute top-10 right-0 w-80 h-[450px] bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group cursor-pointer"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/40 rounded-full blur-3xl group-hover:bg-pink-500/60 transition-all duration-500" />
                <div className="relative h-full p-8 flex flex-col">
                  <div className="flex-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black">
                      NEW
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">
                      Premium Collection
                    </h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Exclusive designer pieces
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-400 line-through">
                          $599
                        </div>
                        <div className="text-3xl font-black text-white">
                          $399
                        </div>
                      </div>
                      <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:scale-110 transition-transform duration-300 shadow-lg">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Small Card 1 */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="absolute top-0 left-0 w-48 h-56 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl p-5 cursor-pointer"
              >
                <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl mb-3" />
                <h4 className="text-white font-bold mb-1">Accessories</h4>
                <p className="text-2xl font-black text-white">$99</p>
              </motion.div>

              {/* Small Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="absolute bottom-20 left-10 w-52 h-60 bg-gradient-to-br from-pink-600/30 to-purple-600/30 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl p-5 cursor-pointer"
              >
                <div className="w-full h-36 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl mb-3" />
                <h4 className="text-white font-bold mb-1">Limited Edition</h4>
                <p className="text-2xl font-black text-white">$599</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  );
}
