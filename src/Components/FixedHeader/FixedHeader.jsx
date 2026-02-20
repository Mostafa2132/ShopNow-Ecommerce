import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";
export default function FixedHeader({ header, title, word, subTitle, Icon }) {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-5 py-2.5 rounded-full mb-6"
      >
        {Icon ? (
          <Icon className="text-purple-400 animate-pulse" size={18} />
        ) : (
          <BsStars className="text-purple-400 animate-pulse" size={18} />
        )}
        <span className="text-purple-400 text-sm font-semibold">{header}</span>
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
        {word}{" "}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <p className="text-slate-400 text-sm">{subTitle}</p>
    </div>
  );
}
