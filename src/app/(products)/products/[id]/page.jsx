"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiPackage,
  FiLoader,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import RelatedProducts from "../../../../Components/RelatedProducts/RelatedProducts";
import Link from "next/link";
import RelatedReviews from "../../../../Components/RelatedReviews/RelatedReviews";
import { use, useState } from "react";
import { motion } from "framer-motion";
import SimpleError from "../../../../Components/SimpleError/SimpleError";
import SimpleLoad from "../../../../Components/SimpleLoad/SimpleLoad";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../../../store/slices/cartSlice";
import { addToWishlist } from "../../../../store/slices/wishlistSlice";
import FixedBackground from "../../../../Components/FixedBackground/FixedBackground";
import { Helmet } from "react-helmet";

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.authReducer);

  // Fetch Product Details
  async function getProductDetails() {
    const { data } = await axios.get(
      `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    );
    return data.data;
  }

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: getProductDetails,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  // Loading State
  if (isLoading) return <SimpleLoad />;

  // Error State
  if (isError || !product) return <SimpleError />;

  // Calculate discount
  const originalPrice = product?.price * 1.3;
  const discountPercentage = Math.round(
    ((originalPrice - product?.price) / originalPrice) * 100,
  );

  return (
    <>
      <Helmet>
        <title>ShopNow | {product.title} Details </title>
      </Helmet>
      <section className="relative min-h-screen bg-slate-950 py-20 overflow-hidden">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-purple-400 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">
              {product?.title}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden group">
                <Image
                  src={product?.images?.[selectedImage] || product?.imageCover}
                  alt={product?.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-10">
                  {discountPercentage > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg"
                    >
                      -{discountPercentage}% OFF
                    </motion.div>
                  )}
                  {product?.sold > 10000 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                      <BsStars size={14} />
                      Trending
                    </motion.div>
                  )}
                </div>

                {/* Stock Indicator */}
                {product?.quantity < 50 && product?.quantity > 0 && (
                  <div className="absolute bottom-6 left-6 bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full">
                    Only {product?.quantity} left in stock!
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product?.images && product?.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product?.images?.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square bg-slate-900/50 border rounded-2xl overflow-hidden cursor-pointer transition-all ${
                        selectedImage === idx
                          ? "border-purple-500 ring-2 ring-purple-500/50"
                          : "border-slate-800 hover:border-purple-500/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product?.title} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Brand & Category */}
              <div className="flex items-center gap-4 flex-wrap">
                {product?.brand && (
                  <Link
                    href={`/brands/${product?.brand._id}`}
                    className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2"
                  >
                    <div className="w-6 h-6 relative rounded-full overflow-hidden bg-white/10">
                      <Image
                        src={product?.brand.image}
                        alt={product?.brand.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="text-purple-400 text-sm font-semibold">
                      {product?.brand.name}
                    </span>
                  </Link>
                )}
                {product?.category && (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
                    <span className="text-slate-400 text-sm">
                      {product?.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                {product?.title}
              </h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(product?.ratingsAverage)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-slate-600"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {product?.ratingsAverage}
                  </span>
                  <span className="text-slate-400 text-sm">
                    ({product?.ratingsQuantity} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-end gap-4 flex-wrap">
                  {discountPercentage > 0 && (
                    <div className="text-slate-500 text-xl line-through">
                      ${originalPrice?.toFixed(2)}
                    </div>
                  )}
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${product?.price}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="text-emerald-400 font-bold text-lg">
                      Save ${(originalPrice - product?.price).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-3">
                  Description
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <label className="block text-white font-semibold mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-white hover:bg-slate-700 transition-colors font-bold text-xl"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 text-white font-bold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product?.quantity, quantity + 1))
                      }
                      className="px-4 py-3 text-white hover:bg-slate-700 transition-colors font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {product?.quantity} available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(addItemToCart({ token, id }))}
                  disabled={product?.quantity === 0}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <FiShoppingCart size={24} />
                    {product?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                <button
                  onClick={() => dispatch(addToWishlist({ id, token }))}
                  className="w-full py-4 bg-slate-900/50 border-2 border-slate-700 hover:border-pink-500 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <FiHeart
                    size={24}
                    className="group-hover:text-pink-400 transition-colors"
                  />
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiTruck className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Free Shipping
                    </h4>
                    <p className="text-slate-400 text-xs">On orders over $50</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Secure Payment
                    </h4>
                    <p className="text-slate-400 text-xs">100% protected</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiRefreshCw className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      Easy Returns
                    </h4>
                    <p className="text-slate-400 text-xs">30-day guarantee</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPackage className="text-orange-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">
                      In Stock
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {product?.quantity} available
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mb-16"
          >
            <h3 className="text-2xl font-black text-white mb-6">
              Specifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400">Category</span>
                <span className="text-white font-semibold">
                  {product?.category?.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400">Brand</span>
                <span className="text-white font-semibold">
                  {product?.brand?.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400">Stock Status</span>
                <span
                  className={`font-semibold ${
                    product?.quantity > 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <span className="text-slate-400">SKU</span>
                <span className="text-white font-semibold">{product?.id}</span>
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <div className="mb-16">
            <RelatedReviews id={product?.id} />
          </div>

          {/* Related Products */}
          {product?.category && (
            <RelatedProducts
              categoryId={product?.category?._id}
              currentProductId={product?.id}
            />
          )}
        </div>
      </section>
    </>
  );
}
