import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiStar, FiTrash2 } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";

export default function WishlistCard({ product,index, handleAddToCart ,handleRemove }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
      className={`group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${shouldReduceMotion ? '' : 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20'}`}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product._id}`}
        className="relative aspect-square bg-white/5 overflow-hidden block focus:outline-none focus:ring-4 focus:ring-purple-500"
        aria-label={`View details of ${product.title}`}
      >
        <Image
          src={product.imageCover}
          alt="" // Decorative since the link has aria-label
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`object-cover transition-transform duration-700 ${shouldReduceMotion ? '' : 'group-hover:scale-110'}`}
          aria-hidden="true"
        />

        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent transition-opacity duration-500 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true" />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1.5 flex items-center gap-1">
          <FiStar size={14} className="text-yellow-400 fill-yellow-400" aria-hidden="true" />
          <span className="text-white font-semibold text-sm">
            <span className="sr-only">Rating: </span>
            {product.ratingsAverage}
          </span>
        </div>

        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1.5">
            <span className="text-purple-400 font-semibold text-xs">
              <span className="sr-only">Brand: </span>
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
            <span className="sr-only">Category: </span>
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <Link 
          href={`/products/${product._id}`}
          className="block focus:outline-none focus:underline"
        >
          <h3 className={`text-white font-bold text-base line-clamp-2 transition-all duration-300 min-h-[3rem] ${shouldReduceMotion ? '' : 'hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text'}`}>
            {product.title}
          </h3>
        </Link>

        {/* Price & Reviews */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <span className="sr-only">Price: </span>
            ${product.price}
          </div>
          <div className="text-slate-400 text-xs">
            <span className="sr-only">Based on </span>
            {product.ratingsQuantity} reviews
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleAddToCart(product.id)}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Add ${product.title} to cart`}
          >
            <FiShoppingCart size={18} aria-hidden="true" />
            Add to Cart
          </button>

          <button
            onClick={() => handleRemove(product._id)}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-semibold rounded-xl transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Remove ${product.title} from wishlist`}
            title="Remove from wishlist"
          >
            <FiTrash2 size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl transition-opacity duration-500 -z-10 ${shouldReduceMotion ? 'hidden' : 'opacity-0 group-hover:opacity-20'}`} aria-hidden="true" />
    </motion.article>
  );
}
