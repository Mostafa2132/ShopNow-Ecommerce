import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export default function CategoryCard({ item, index }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      whileHover={shouldReduceMotion ? {} : { y: -10 }}
      className="group relative py-12 cursor-pointer"
    >
      <Link href={`/categoryProducts/${item._id}`} className="block focus:outline-none focus:ring-4 focus:ring-purple-500 rounded-2xl">
        {/* Card Container */}
        <div className="relative h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-all duration-500">
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={shouldReduceMotion ? "object-contain" : "object-contain group-hover:scale-110 transition-transform duration-700"}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" aria-hidden="true" />
            
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
              {item.name}
            </h3>

            <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" aria-hidden="true">
              <span className="text-sm font-semibold">Explore Collection</span>
              <FiArrowRight
                className={shouldReduceMotion ? "" : "group-hover:translate-x-2 transition-transform duration-300"}
                size={16}
              />
            </div>
          </div>

          {/* Top Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
            NEW
          </div>
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}
