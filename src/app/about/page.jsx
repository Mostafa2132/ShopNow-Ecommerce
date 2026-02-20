"use client";

import { motion } from "framer-motion";
import {
  FiTarget,
  FiAward,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiGlobe,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

export default function About() {
  const stats = [
    { icon: FiUsers, value: "50K+", label: "Happy Customers" },
    { icon: FiAward, value: "15K+", label: "Products" },
    { icon: FiGlobe, value: "100+", label: "Countries" },
    { icon: FiTrendingUp, value: "98%", label: "Satisfaction" },
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Customer First",
      description:
        "We prioritize our customers' needs and satisfaction above everything else.",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: FiShield,
      title: "Quality Guarantee",
      description:
        "Every product is carefully selected and verified for authenticity and quality.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: FiZap,
      title: "Fast Delivery",
      description:
        "Lightning-fast shipping with real-time tracking for all your orders.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiAward,
      title: "Best Prices",
      description:
        "Competitive pricing with regular deals and exclusive member discounts.",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>ShopNow | About Page </title>
      </Helmet>
      <section className="relative py-20 bg-slate-950 min-h-screen">
        <FixedBackground />

        <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FixedHeader
            header={"ABOUT US"}
            subTitle={"Learn more about our story, mission, and values"}
            title={"Our Story"}
            word={"Discover"}
            Icon={BsStars}
          />

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 border border-purple-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />

            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <FiTarget className="text-white" size={40} />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Building the Future of{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Online Shopping
                </span>
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Founded in 2020, we started with a simple mission: make premium
                products accessible to everyone. Today, we're proud to serve
                over 50,000 happy customers across 100+ countries, delivering
                quality, authenticity, and exceptional service with every order.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl px-6 py-3">
                  <p className="text-purple-400 font-bold text-sm">
                    ✨ Premium Quality
                  </p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl px-6 py-3">
                  <p className="text-pink-400 font-bold text-sm">
                    🚀 Fast Delivery
                  </p>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-xl px-6 py-3">
                  <p className="text-indigo-400 font-bold text-sm">
                    💯 100% Authentic
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="text-purple-400" size={24} />
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-400 text-sm font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <FixedHeader
              header={"OUR VALUES"}
              word={"What We"}
              title={"Stand For"}
              subTitle={` Our core values guide everything we do and shape the experience we
              deliver`}
            />

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${value.color} bg-opacity-20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <value.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiHeart className="text-white" size={32} />
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Join Our Journey
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Be part of our growing community and experience shopping like
                never before
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                  Start Shopping
                </button>
                <button className="px-8 py-4 bg-slate-900 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
