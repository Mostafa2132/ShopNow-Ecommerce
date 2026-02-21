"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { use } from "react";
import { BsStars } from "react-icons/bs";
import { FiPackage, FiArrowLeft, FiGrid } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import { motion, useReducedMotion } from "framer-motion";
import SimpleLoad from "../../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../../Components/SimpleError/SimpleError";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import { Helmet } from "react-helmet";

// Get Category Details
async function getCategoryById(id) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
  );
  return data.data;
}

// Get Subcategories
async function getSubcategories(id) {
  try {
    const { data } = await axios.get(
      `https://ecommerce.routemisr.com/api/v1/categories/${id}/subcategories`,
    );
    return data.data;
  } catch (error) {
    return [];
  }
}

// Get Category Products
async function getCategoryProducts(categoryId) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`,
  );
  return data.data;
}

export default function CategoryProducts({ params }) {
  const { id } = use(params);
  const shouldReduceMotion = useReducedMotion();

  // Fetch Category Details
  const {
    data: category,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Subcategories
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => getSubcategories(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!category,
  });

  // Fetch Category Products
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ["categoryProducts", id],
    queryFn: () => getCategoryProducts(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!category,
  });

  // Loading State
  if (isCategoryLoading || isProductsLoading) {
    return <SimpleLoad />;
  }

  // Error State - Category Not Found
  if (isCategoryError || !category || isProductsError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | {category.name} Products </title>
      </Helmet>

      <main className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
            aria-label="Back to Categories"
          >
            <FiArrowLeft
              className={`${shouldReduceMotion ? "" : "group-hover:-translate-x-1 transition-transform"}`}
              size={18}
              aria-hidden="true"
            />
            <span className="font-semibold" aria-hidden="true">Back to Categories</span>
          </Link>

          {/* Category Header */}
          <header>
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
            >
              {/* Category Image */}
              <div className="relative w-32 h-32 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                  aria-hidden="true"
                />
              </div>

              {/* Category Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                  <BsStars className="text-purple-400" size={16} aria-hidden="true" />
                  <span className="text-purple-400 text-sm font-semibold">
                    CATEGORY
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                  {category.name}
                </h1>

                <p className="text-slate-400 text-lg" aria-live="polite">
                  {products.length > 0
                    ? `${products.length} ${products.length === 1 ? "product" : "products"} available`
                    : "No products available"}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6" aria-label="Category Statistics">
                <div className="text-center bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1" aria-hidden="true">
                    {products.length}
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">
                    <span className="sr-only">Total</span> Products
                    <span className="sr-only">: {products.length}</span>
                  </p>
                </div>

                {subcategories.length > 0 && (
                  <div className="text-center bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-4">
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1" aria-hidden="true">
                      {subcategories.length}
                    </div>
                    <p className="text-slate-400 text-xs font-semibold">
                      <span className="sr-only">Total</span> Subcategories
                      <span className="sr-only">: {subcategories.length}</span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </header>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="mb-16"
              aria-labelledby="subcategories-heading"
            >
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-purple-600/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 mb-4">
                  <FiGrid className="text-purple-400" size={16} aria-hidden="true" />
                  <span className="text-purple-400 text-sm font-semibold">
                    SUBCATEGORIES
                  </span>
                </div>

                <h2 id="subcategories-heading" className="text-3xl md:text-4xl font-black text-white">
                  Explore{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Subcategories
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {subcategories.map((sub, index) => (
                  <motion.div
                    key={sub._id}
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                    className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer focus-within:ring-2 focus-within:ring-purple-500"
                  >
                    <h3 className="text-white font-semibold text-sm text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 outline-none">
                      {sub.name}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Products Section */}
          {products.length > 0 ? (
            <section aria-labelledby="all-products-heading">
              {/* Section Header */}
              <div id="all-products-heading">
                <FixedHeader
                  Icon={FiPackage}
                  header={"ALL PRODUCTS"}
                  word={"Browse"}
                  title={"Products"}
                  subTitle={`Discover our wide range of premium products across ${category.name}`}
                />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
              className="text-center py-20"
              aria-live="polite"
            >
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <FiPackage className="text-slate-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Products Available
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                There are currently no products available in {category.name}.
                Check back later!
              </p>
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500"
              >
                Browse All Products
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
