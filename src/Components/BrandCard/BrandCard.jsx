import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function BrandCard({brand,index}) {
  return (
     <Link
                   
                    href={`/brands/${brand._id}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer animate-fadeInUp"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all duration-500" />
    
                    {/* Brand Image Container */}
                    <div className="relative aspect-square mb-4 bg-white/5 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        className="object-contain p-4"
                      />
    
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
    
                    {/* Brand Name */}
                    <h3 className="text-center text-white font-bold text-sm mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 truncate">
                      {brand.name}
                    </h3>
    
                    {/* View Products Link */}
                    <div className="flex items-center justify-center gap-1 text-slate-400 group-hover:text-purple-400 transition-colors text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-semibold">View Products</span>
                      <FiArrowRight
                        className="group-hover:translate-x-1 transition-transform"
                        size={12}
                      />
                    </div>
    
                    {/* Top Right Badge */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping" />
                    </div>
                  </Link>
  )
}
