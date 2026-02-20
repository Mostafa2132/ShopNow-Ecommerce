"use client";

import Marquee from "react-fast-marquee";
import { IoSparkles } from "react-icons/io5";
import { FiStar, FiTrendingUp, FiZap } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

const variants = {
  primary: {
    bg: "from-purple-600/10 via-pink-600/10 to-indigo-600/10",
    border: "border-purple-500/30",
    text: "from-purple-400 via-pink-400 to-indigo-400",
    icon: IoSparkles,
    iconColor: "text-purple-400",
  },
  secondary: {
    bg: "from-emerald-600/10 via-teal-600/10 to-cyan-600/10",
    border: "border-emerald-500/30",
    text: "from-emerald-400 via-teal-400 to-cyan-400",
    icon: FiZap,
    iconColor: "text-emerald-400",
  },
  accent: {
    bg: "from-amber-600/10 via-orange-600/10 to-red-600/10",
    border: "border-amber-500/30",
    text: "from-amber-400 via-orange-400 to-red-400",
    icon: FiStar,
    iconColor: "text-amber-400",
  },
  gradient: {
    bg: "from-blue-600/10 via-purple-600/10 to-pink-600/10",
    border: "border-blue-500/30",
    text: "from-blue-400 via-purple-400 to-pink-400",
    icon: BsStars,
    iconColor: "text-blue-400",
  },
};

export default function DynamicMarquee({ 
  title, 
  variant = "primary",
  speed = 60,
  pauseOnHover = true 
}) {
  const config = variants[variant] || variants.primary;
  const Icon = config.icon;

  return (
    <div className="relative bg-slate-950 py-6 overflow-hidden">
      {/* Animated Glow Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.bg} blur-2xl animate-pulse`} />

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Main Marquee Container */}
      <div className={`relative border-y ${config.border} bg-slate-900/60 backdrop-blur-xl shadow-2xl`}>
        <Marquee
          speed={speed}
          gradient={false}
          pauseOnHover={pauseOnHover}
          className="py-4"
        >
          {/* Repeat content multiple times for seamless loop */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-6 mx-8">
              {/* Left Icon */}
              <Icon 
                className={`${config.iconColor} animate-pulse`} 
                size={24} 
              />

              {/* Title Text */}
              <p className={`text-lg md:text-xl font-extrabold bg-gradient-to-r ${config.text} bg-clip-text text-transparent tracking-wide whitespace-nowrap`}>
                {title}
              </p>

              {/* Right Icon */}
              <Icon 
                className={`${config.iconColor} animate-pulse`} 
                size={24} 
              />

              {/* Separator Dot */}
              <span className={`w-2 h-2 rounded-full ${config.iconColor} bg-current opacity-50`} />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Decorative Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
    </div>
  );
}