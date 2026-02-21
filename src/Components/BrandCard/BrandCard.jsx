import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useReducedMotion } from "framer-motion";

export default function BrandCard({brand,index}) {
  const shouldReduceMotion = useReducedMotion();

  return (
     <Link
                    href={`/brands/${brand._id}`}
                    style={{ animationDelay: shouldReduceMotion ? "0s" : `${index * 0.05}s` }}
                    className={`group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 transition-all duration-500 cursor-pointer block focus:outline-none focus:ring-4 focus:ring-purple-500 ${shouldReduceMotion ? '' : 'hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 animate-fadeInUp'}`}
                    aria-label={`View products by ${brand.name}`}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 rounded-2xl transition-all duration-500 ${shouldReduceMotion ? '' : 'group-hover:from-purple-600/10 group-hover:to-pink-600/10'}`} aria-hidden="true" />
    
                    {/* Brand Image Container */}
                    <div className={`relative aspect-square mb-4 bg-white/5 rounded-xl overflow-hidden transition-transform duration-500 ${shouldReduceMotion ? '' : 'group-hover:scale-105'}`}>
                      <Image
                        src={brand.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        className="object-contain p-4"
                        aria-hidden="true"
                      />
    
                      {/* Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent transition-opacity duration-500 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true" />
                    </div>
    
                    {/* Brand Name */}
                    <h3 className={`text-center text-white font-bold text-sm mb-2 transition-all duration-300 truncate ${shouldReduceMotion ? '' : 'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text'}`}>
                      {brand.name}
                    </h3>
    
                    {/* View Products Link */}
                    <div className={`flex items-center justify-center gap-1 text-slate-400 transition-colors text-xs transition-opacity duration-300 ${shouldReduceMotion ? '' : 'group-hover:text-purple-400 opacity-0 group-hover:opacity-100'}`} aria-hidden="true">
                      <span className="font-semibold">View Products</span>
                      <FiArrowRight
                        className={shouldReduceMotion ? '' : "group-hover:translate-x-1 transition-transform"}
                        size={12}
                        aria-hidden="true"
                      />
                    </div>
    
                    {/* Top Right Badge */}
                    <div className={`absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full transition-opacity duration-300 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true">
                      <div className={`absolute inset-0 bg-emerald-400 rounded-full ${shouldReduceMotion ? '' : 'animate-ping'}`} />
                    </div>
                  </Link>
  )
}
