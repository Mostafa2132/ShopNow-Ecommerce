"use client";

import { useState, useRef } from "react";
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
  const sectionRef = useRef(null);

  // ✅ Use the custom hook
  const { products, metadata, isLoading, isError } = useProducts({
    limit: productsPerPage,
    page: currentPage,
  });

  // Scroll to section when page changes instead of a hardcoded pixel value
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      // Small delay to ensure the DOM is ready if products are still fetching
      setTimeout(() => {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  if (isLoading) return <SimpleLoad />;

  if (isError) return <SimpleError />;

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-slate-950 overflow-hidden"
      aria-labelledby="featured-products-heading"
    >
      {/* Background Effects - Hidden from screen readers */}
      <div aria-hidden="true">
        <FixedBackground />
      </div>

      <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div id="featured-products-heading">
          <FixedHeader
            title={"Products"}
            subTitle={`Discover our handpicked selection of premium products at unbeatable prices`}
            Icon={FiPackage}
            word={"Featured"}
            header={"PREMIUM COLLECTION"}
          />
        </div>

        {/* aria-live used to notify screen readers when pagination changes product content */}
        <div aria-live="polite" aria-atomic="true">
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

          {/* Products Count */}
          <p className="text-slate-500 text-center text-sm mt-8 mb-4">
            Showing {metadata.currentPage ? (metadata.currentPage - 1) * productsPerPage + 1 : 1}-
            {Math.min(metadata.currentPage * productsPerPage, metadata.numberOfProducts || products.length)} of{" "}
            {metadata.numberOfProducts || products.length} products
          </p>
        </div>

        {/* Pagination Container */}
        <nav aria-label="Products pagination" className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={metadata.numberOfPages || 1}
            onPageChange={handlePageChange}
          />
        </nav>
      </div>

      {/* Bottom Fade - Hidden from screen readers */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
}