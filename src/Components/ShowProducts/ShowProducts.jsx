"use client";

import { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import Pagination from "../Pagination/Pagination";
import { FiPackage } from "react-icons/fi";
import SimpleLoad from "../SimpleLoad/SimpleLoad";
import SimpleError from "../SimpleError/SimpleError";
import FixedBackground from "../FixedBackground/FixedBackground";
import FixedHeader from "../FixedHeader/FixedHeader";
import useProducts from "../../hooks/useProducts/useProducts";

export default function ShowProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // ✅ Use the custom hook
  const { products, metadata, isLoading, isError } = useProducts({
    limit: productsPerPage,
    page: currentPage,
  });

  // Scroll to top when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 2000, behavior: "smooth" });
  };

  if (isLoading) return <SimpleLoad />;

  if (isError) return <SimpleError />;

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <FixedBackground />

      <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FixedHeader
          title={"Products"}
          subTitle={`Discover our handpicked selection of premium products at unbeatable prices`}
          Icon={FiPackage}
          word={"Featured"}
          header={"PREMIUM COLLECTION"}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product, index) => (
            <div
              key={product.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-fadeInUp"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={metadata.numberOfPages || 1}
          onPageChange={handlePageChange}
        />

        {/* Products Count */}
        <p className="text-slate-500 text-center text-sm mt-4">
          Showing {metadata.currentPage ? (metadata.currentPage - 1) * productsPerPage + 1 : 1}-
          {Math.min(metadata.currentPage * productsPerPage, metadata.numberOfProducts || products.length)} of{" "}
          {metadata.numberOfProducts || products.length} products
        </p>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}