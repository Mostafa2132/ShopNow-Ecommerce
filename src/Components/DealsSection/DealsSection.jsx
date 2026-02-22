"use client";

import { motion } from "framer-motion";
import { FiZap, FiArrowRight } from "react-icons/fi";
import { BsLightning } from "react-icons/bs";
import Link from "next/link";
import ProductCard from "../ProductCard/ProductCard";
import useProducts from "../../hooks/useProducts/useProducts";
import FixedBackground from "../FixedBackground/FixedBackground";
import FixedHeader from "../FixedHeader/FixedHeader";

export default function DealsSection() {
  const { products, isLoading } = useProducts({
    limit: 8,
    sort: "-sold",
  });

  if (isLoading || products.length === 0) return null;

  // Add discount info
  const dealsProducts = products.slice(0, 8).map((product) => ({
    ...product,
    originalPrice: Math.round(product.price * 1.4),
    discount: 40,
  }));

  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <FixedBackground />

      <div className="relative max-w-[87rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}

        <FixedHeader
          Icon={BsLightning}
          title={"Offers"}
          header={"FLASH DEALS"}
          word={"Limited Time"}
          subTitle={"Grab these amazing deals before they're gone!"}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dealsProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} showDiscount />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
 <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="text-center"
>
  <Link
    href="/deal"
    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 group"
  >
    View All Deals
    <FiArrowRight
      className="group-hover:translate-x-1 transition-transform"
      size={20}
    />
  </Link>
</motion.div>
      </div>
    </section>
  );
}
 
// bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden