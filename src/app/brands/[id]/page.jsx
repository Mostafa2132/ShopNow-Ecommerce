"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use } from "react";
import { BsStars } from "react-icons/bs";
import { FiPackage, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import { motion } from "framer-motion";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import SimpleError from "../../../Components/SimpleError/SimpleError";
import SimpleLoad from "../../../Components/SimpleLoad/SimpleLoad";
import { Helmet } from "react-helmet";

// Get Brand Details
async function getBrandById(id) {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/brands",
  );
  return data.data.find((brand) => brand._id === id);
}

// Get Brand Products
async function getBrandProducts(brandId) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`,
  );
  return data.data;
}

export default function GetBrandProducts({ params }) {
  const { id } = use(params);

  // Fetch Brand Details
  const {
    data: brand,
    isLoading: isBrandLoading,
    isError: isBrandError,
  } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Brand Products
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["brandProducts", id],
    queryFn: () => getBrandProducts(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!brand,
  });

  // Loading State
  if (isBrandLoading || isProductsLoading) return <SimpleLoad />;

  // Error State - Brand Not Found
  if (isBrandError || !brand || isProductsError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | {brand.name} </title>
      </Helmet>

      <section className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <FiArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={18}
            />
            <span className="font-semibold">Back to Brands</span>
          </Link>

          {/* Brand Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
          >
            {/* Brand Logo */}
            <div className="relative w-32 h-32 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Brand Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                <BsStars className="text-purple-400" size={16} />
                <span className="text-purple-400 text-sm font-semibold">
                  OFFICIAL BRAND
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                {brand.name}
              </h1>

              <p className="text-slate-400 text-lg">
                {products.length > 0
                  ? `Showing ${products.length} ${products.length === 1 ? "product" : "products"}`
                  : "No products available"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {products.length}
                </div>
                <p className="text-slate-400 text-xs font-semibold">Products</p>
              </div>

              <div className="text-center bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  100%
                </div>
                <p className="text-slate-400 text-xs font-semibold">
                  Authentic
                </p>
              </div>
            </div>
          </motion.div>

          {/* Products Section */}
          {products.length > 0 ? (
            <>
              {/* Section Header */}
              <FixedHeader
                Icon={FiPackage}
                word={"Browse"}
                title={"Collection"}
                header={"ALL PRODUCTS"}
              />

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-slate-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Products Available
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                There are currently no products available from {brand.name}.
                Check back later!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Browse All Products
              </Link>
            </motion.div>
          )}

          {/* Brand Features */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BsStars className="text-purple-400" size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Premium Quality</h3>
                <p className="text-slate-400 text-sm">
                  All {brand.name} products are 100% authentic and high quality
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">Verified Products</h3>
                <p className="text-slate-400 text-sm">
                  Each product is verified for authenticity
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">Fast Shipping</h3>
                <p className="text-slate-400 text-sm">
                  Free shipping on all {brand.name} products over $50
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
