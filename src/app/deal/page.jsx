"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiZap, FiClock, FiTrendingUp } from "react-icons/fi";
import { BsLightning } from "react-icons/bs";
import ProductCard from "../../Components/ProductCard/ProductCard";
import Pagination from "../../Components/Pagination/Pagination";
import SimpleLoad from "../../Components/SimpleLoad/SimpleLoad";
import SimpleError from "../../Components/SimpleError/SimpleError";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../Components/FixedHeader/FixedHeader";
import DealStats from "../../Components/DealStats/DealStats";
import CountdownTimer from "../../Components/CountdownTimer/CountdownTimer";
import useProducts from "../../hooks/useProducts/useProducts";
import { Helmet } from "react-helmet";

export default function DealsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get products with high discount (low price + high rating)
  const { products, metadata, isLoading, isError } = useProducts({
    limit: productsPerPage,
    page: currentPage,
    sort: "-sold", // Best selling
  });

  // Calculate deals (products with imagined discount)
  const dealsProducts = products
    .map((product) => ({
      ...product,
      originalPrice: Math.round(product.price * 1.4), // 40% discount
      discount: 40,
      soldCount: product.sold || Math.floor(Math.random() * 500) + 50,
    }))
    .slice(0, productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <SimpleLoad />;
  if (isError) return <SimpleError />;

  // Deal end time (24 hours from now)
  const dealEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <>
      <Helmet>
        <title>ShopNow | Deals Page </title>
      </Helmet>

      <section className="relative py-20 overflow-x-hidden bg-slate-950 min-h-screen">
        <FixedBackground />

        <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FixedHeader
            header={"LIMITED TIME"}
            subTitle={"Grab amazing deals before they're gone!"}
            title={"Flash Deals"}
            word={"Hot"}
            Icon={FiZap}
          />

          {/* Deal Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side */}
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
                  <BsLightning
                    className="text-pink-400 animate-pulse"
                    size={20}
                  />
                  <span className="text-purple-400 font-bold text-sm">
                    FLASH SALE
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Up to{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    70% OFF
                  </span>
                </h2>

                <p className="text-slate-300 text-lg mb-6">
                  Limited time offers on our best products. Don't miss out!
                </p>

                <CountdownTimer endTime={dealEndTime} />
              </div>

              {/* Right Side - Stats */}
              <DealStats products={dealsProducts} />
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealsProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} showDiscount />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {dealsProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={metadata.numberOfPages || 1}
              onPageChange={handlePageChange}
            />
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-8 text-center"
          >
            <FiTrendingUp className="text-purple-400 mx-auto mb-4" size={48} />
            <h3 className="text-3xl font-black text-white mb-3">
              More Deals Coming Soon!
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified about exclusive deals
              and early access to sales.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
              Subscribe Now
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
