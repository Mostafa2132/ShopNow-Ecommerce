"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiGrid,
  FiList,
  FiStar,
} from "react-icons/fi";
import Pagination from "../../../Components/Pagination/Pagination";
import ProductCard from "../../../Components/ProductCard/ProductCard";
import SimpleLoad from "../../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../../Components/SimpleError/SimpleError";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import useProducts from "../../../hooks/useProducts/useProducts";
import { Helmet } from "react-helmet";

export default function GetAllProducts() {
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("default");
  const [minRating, setMinRating] = useState(0);

  const productsPerPage = 12;

  const { products, isLoading, isError } = useProducts({});

  // Get unique categories and brands
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ];
  const brands = [
    "all",
    ...new Set(products.map((p) => p.brand?.name).filter(Boolean)),
  ];

  // Filter Products
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === "all" || product.category?.name === selectedCategory;

    // Brand filter
    const matchesBrand =
      selectedBrand === "all" || product.brand?.name === selectedBrand;

    // Price filter
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    // Rating filter
    const matchesRating = product.ratingsAverage >= minRating;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesRating
    );
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.ratingsAverage - a.ratingsAverage;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 10000]);
    setSortBy("default");
    setMinRating(0);
    setCurrentPage(1);
  };

  if (isLoading) return <SimpleLoad />;

  if (isError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | All Products </title>
      </Helmet>

      <section className="relative py-20 bg-slate-950 min-h-screen">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}

          <FixedHeader
            header={"EXPLORE"}
            subTitle={"Discover our wide range of premium products"}
            title={"Products"}
            word={"Shop by"}
          />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <FiFilter size={20} />
                    Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-400 hover:text-pink-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand === "all" ? "All Brands" : brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full accent-purple-500"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">$0</span>
                      <span className="text-white font-semibold">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-3">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          minRating === rating
                            ? "bg-purple-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              className={
                                i < rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : ""
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold"
                >
                  <FiFilter size={18} />
                  Filters
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-slate-400 text-sm">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              {currentProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {currentProducts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 overflow-y-auto lg:hidden"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                      <FiFilter size={24} />
                      Filters
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* Mobile Filters - Same as Desktop */}
                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === "all" ? "All Categories" : cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        Brand
                      </label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand === "all" ? "All Brands" : brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-2">
                        Price Range
                      </label>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([0, parseInt(e.target.value)])
                          }
                          className="w-full accent-purple-500"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">$0</span>
                          <span className="text-white font-semibold">
                            ${priceRange[1]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-slate-300 text-sm font-semibold mb-3">
                        Minimum Rating
                      </label>
                      <div className="space-y-2">
                        {[4, 3, 2, 1, 0].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                              minRating === rating
                                ? "bg-purple-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={14}
                                  className={
                                    i < rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : ""
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-sm">& Up</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Apply Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
