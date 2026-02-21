"use client";

import { useState } from "react";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

  const shouldReduceMotion = useReducedMotion();

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

      <main className="relative overflow-x-hidden py-20 bg-slate-950 min-h-screen">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

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
            <aside className="hidden lg:block" aria-label="Filters">
              <div className="sticky top-24 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold flex items-center gap-2 m-0 text-base">
                    <FiFilter size={20} aria-hidden="true" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-400 hover:text-pink-400 transition-colors focus:outline-none focus:underline"
                    aria-label="Clear all filters"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div>
                  <label htmlFor="search-input" className="block text-slate-300 text-sm font-semibold mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      id="search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category-select" className="block text-slate-300 text-sm font-semibold mb-2">
                    Category
                  </label>
                  <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_0.75rem_center] pr-10"
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
                  <label htmlFor="brand-select" className="block text-slate-300 text-sm font-semibold mb-2">
                    Brand
                  </label>
                  <select
                    id="brand-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_0.75rem_center] pr-10"
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
                  <label htmlFor="price-range" className="block text-slate-300 text-sm font-semibold mb-2">
                    Price Range (Up to ${priceRange[1]})
                  </label>
                  <div className="space-y-3">
                    <input
                      id="price-range"
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value, 10)])
                      }
                      className="w-full accent-purple-500"
                      aria-valuemin="0"
                      aria-valuemax="10000"
                      aria-valuenow={priceRange[1]}
                    />
                    <div className="flex items-center justify-between text-sm" aria-hidden="true">
                      <span className="text-slate-400">$0</span>
                      <span className="text-white font-semibold">
                        ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <fieldset>
                  <legend className="block text-slate-300 text-sm font-semibold mb-3">
                    Minimum Rating
                  </legend>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        aria-pressed={minRating === rating}
                        aria-label={`${rating} stars and up`}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          minRating === rating
                            ? "bg-purple-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex" aria-hidden="true">
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
                        <span className="text-sm" aria-hidden="true">& Up</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </aside>

            {/* Main Content */}
            <section className="lg:col-span-3" aria-label="Products List">
              {/* Toolbar */}
              <header className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-white"
                  aria-expanded="false"
                  aria-controls="mobile-filter-sidebar"
                >
                  <FiFilter size={18} aria-hidden="true" />
                  Filters
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-slate-400 text-sm">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_0.75rem_center] pr-10"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                {/* View Mode */}
                <div
                  className="flex items-center gap-2 bg-slate-800 rounded-xl p-1"
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-pressed={viewMode === "grid"}
                    aria-label="Grid view"
                    className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      viewMode === "grid"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiGrid size={18} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-pressed={viewMode === "list"}
                    aria-label="List view"
                    className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FiList size={18} aria-hidden="true" />
                  </button>
                </div>
              </header>

              {/* Announcements for Screen Readers */}
              <div aria-live="polite" className="sr-only">
                {currentProducts.length > 0
                  ? `Showing ${currentProducts.length} products on this page.`
                  : "No products found matching your filters."}
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
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
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
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500"
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
            </section>
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
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                aria-hidden="true"
              />

              {/* Sidebar */}
              <motion.aside
                id="mobile-filter-sidebar"
                initial={{ x: shouldReduceMotion ? 0 : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: shouldReduceMotion ? 0 : "-100%" }}
                transition={{ type: "spring", damping: 25, duration: shouldReduceMotion ? 0 : 0.4 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 overflow-y-auto lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Filter Options"
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2 m-0 border-0">
                      <FiFilter size={24} aria-hidden="true" />
                      Filters
                    </h3>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                      aria-label="Close filters"
                    >
                      <FiX size={24} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Mobile Filters - Same as Desktop but with unique IDs for accessibility */}
                  <div className="space-y-6">
                    {/* Search */}
                    <div>
                      <label htmlFor="mobile-search-input" className="block text-slate-300 text-sm font-semibold mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          id="mobile-search-input"
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="mobile-category-select" className="block text-slate-300 text-sm font-semibold mb-2">
                        Category
                      </label>
                      <select
                        id="mobile-category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_0.75rem_center] pr-10"
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
                      <label htmlFor="mobile-brand-select" className="block text-slate-300 text-sm font-semibold mb-2">
                        Brand
                      </label>
                      <select
                        id="mobile-brand-select"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_0.75rem_center] pr-10"
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
                      <label htmlFor="mobile-price-range" className="block text-slate-300 text-sm font-semibold mb-2">
                        Price Range (Up to ${priceRange[1]})
                      </label>
                      <div className="space-y-3">
                        <input
                          id="mobile-price-range"
                          type="range"
                          min="0"
                          max="10000"
                          value={priceRange[1]}
                          onChange={(e) =>
                            setPriceRange([0, parseInt(e.target.value, 10)])
                          }
                          className="w-full accent-purple-500"
                          aria-valuemin="0"
                          aria-valuemax="10000"
                          aria-valuenow={priceRange[1]}
                        />
                        <div className="flex items-center justify-between text-sm" aria-hidden="true">
                          <span className="text-slate-400">$0</span>
                          <span className="text-white font-semibold">
                            ${priceRange[1]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <fieldset>
                      <legend className="block text-slate-300 text-sm font-semibold mb-3">
                        Minimum Rating
                      </legend>
                      <div className="space-y-2">
                        {[4, 3, 2, 1, 0].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating)}
                            aria-pressed={minRating === rating}
                            aria-label={`${rating} stars and up`}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              minRating === rating
                                ? "bg-purple-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            <div className="flex" aria-hidden="true">
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
                            <span className="text-sm" aria-hidden="true">& Up</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Apply Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-500"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
