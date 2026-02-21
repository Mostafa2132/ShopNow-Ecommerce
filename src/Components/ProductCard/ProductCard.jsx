"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../store/slices/cartSlice";
import { addToWishlist } from "../../store/slices/wishlistSlice";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Use provided product or sample data
  const data = product || sampleProduct;
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.authReducer);

  // Calculate discount (if any)
  const originalPrice = data.price * 1.3; // Simulated original price
  const discountPercentage = Math.round(
    ((originalPrice - data.price) / originalPrice) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Image Section */}
        <div className="relative h-80 overflow-hidden bg-slate-800">
          {/* Main Image */}
          <Link href={`/productDetails/${data.id}`} className="absolute w-full h-full inset-0 z-0 outline-none focus-visible:ring-4 focus-visible:ring-purple-500">
             <span className="sr-only">Go to detailed product page for {data.title}</span>
            <Image
              src={data.images?.[currentImage] || data.imageCover}
              alt={data.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={shouldReduceMotion ? "object-cover" : "object-cover group-hover:scale-110 transition-transform duration-700"}
            />
          </Link>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-10">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div
                initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg"
              >
                -{discountPercentage}%
              </motion.div>
            )}

            {/* Trending Badge */}
            {data?.sold > 10000 && (
              <motion.div
                initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.1 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
              >
                <FiTrendingUp size={12} aria-hidden="true" />
                Trending
              </motion.div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-12 right-4 flex flex-col gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-all duration-300 translate-x-4 focus-within:translate-x-0 group-hover:translate-x-0 z-20">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(addToWishlist({token, productId:product.id}));
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-purple-500 ${
                isWishlisted
                  ? "bg-pink-600 border-pink-500 text-white"
                  : "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
              }`}
            >
              <FiHeart
                size={18}
                aria-hidden="true"
                className={isWishlisted ? "fill-current" : ""}
              />
            </motion.button>

            {/* Quick View Button */}
            <Link
              href={`/products/${data.id}`}
              aria-label="Quick view product details"
              className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full text-white hover:bg-slate-800 transition-all duration-300 shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-purple-500"
            >
              <FiEye size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Image Thumbnails */}
          {data.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300 z-20" role="tablist" aria-label="Product Images">
              {data.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={currentImage === idx}
                  aria-label={`View image ${idx + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImage(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 focus-visible:ring-offset-purple-500 ${
                    currentImage === idx
                      ? "bg-purple-500 w-6"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stock Indicator */}
          {data.quantity < 50 && (
            <div className="absolute bottom-4 left-4 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
              Only {data.quantity} left!
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4 relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative rounded-lg overflow-hidden bg-white/5" aria-hidden="true">
              <Image
                src={data.brand?.image || ''}
                alt=""
                fill
                sizes="32px"
                className="object-contain p-1"
              />
            </div>
            <Link href={`/brands/${data.brand?._id}`} className="text-purple-400 text-sm font-semibold outline-none focus-visible:underline">
              {data.brand?.name}
            </Link>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white line-clamp-2 transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text">
            {data.title}
          </h3>

          {/* Category */}
          <p className="text-slate-400 text-sm">
            {data.category?.name} {data.subcategory?.[0]?.name ? ` • ${data.subcategory[0].name}` : ''}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2" aria-label={`Rated ${data.ratingsAverage} out of 5 stars based on ${data.ratingsQuantity} reviews`}>
            <div className="flex items-center gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(data.ratingsAverage || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-slate-600"
                  }
                />
              ))}
            </div>
            <span className="text-slate-400 text-sm" aria-hidden="true">
              {data.ratingsAverage} ({data.ratingsQuantity})
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-end justify-between pt-4 border-t border-white/10">
            <div>
              {discountPercentage > 0 && (
                <div className="text-slate-500 text-sm line-through">
                   <span className="sr-only">Original price: </span> ${originalPrice.toFixed(2)}
                </div>
              )}
              <div className="text-3xl font-black text-white">
                <span className="sr-only">Current price: </span> ${data.price}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(addItemToCart({ productId: data?.id, token }));
              }}
              aria-label={`Add ${data.title} to cart`}
              className="group/btn relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white overflow-hidden shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-purple-500"
            >
              <span className="relative flex items-center gap-2">
                <FiShoppingCart size={18} aria-hidden="true" />
                Add
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-0 transition-opacity duration-300" aria-hidden="true" />
            </motion.button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" aria-hidden="true" />
      </div>
    </motion.div>
  );
}
