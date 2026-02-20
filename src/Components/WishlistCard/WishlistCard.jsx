import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiStar, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
export default function WishlistCard({ product,index, handleAddToCart ,handleRemove }) {
  return (
    <motion.div
      
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
    >
      {/* Product Image */}
      <Link
        href={`/products/${product._id}`}
        className="relative aspect-square bg-white/5 overflow-hidden block"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1.5 flex items-center gap-1">
          <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white font-semibold text-sm">
            {product.ratingsAverage}
          </span>
        </div>

        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1.5">
            <span className="text-purple-400 font-semibold text-xs">
              {product.brand.name}
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-4">
        {/* Category */}
        {product.category && (
          <span className="inline-block text-slate-400 text-xs font-semibold">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={`/products/${product._id}`}>
          <h3 className="text-white font-bold text-base line-clamp-2 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300 min-h-[3rem]">
            {product.title}
          </h3>
        </Link>

        {/* Price & Reviews */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ${product.price}
          </div>
          <div className="text-slate-400 text-xs">
            {product.ratingsQuantity} reviews
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleAddToCart(product.id)}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          >
            <FiShoppingCart size={18} />
            Add to Cart
          </button>

          <button
            onClick={() => handleRemove(product._id)}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-semibold rounded-xl transition-all flex items-center justify-center"
            title="Remove from wishlist"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}
