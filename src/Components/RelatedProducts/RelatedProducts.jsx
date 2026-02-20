"use client";

import axios from "axios";
import ProductCard from "../ProductCard/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { useQuery } from "@tanstack/react-query";
import SimpleLoad from "../SimpleLoad/SimpleLoad";
import SimpleError from "../SimpleError/SimpleError";
import FixedBackground from "../FixedBackground/FixedBackground";
import FixedHeader from "../FixedHeader/FixedHeader";

export default function RelatedProducts({ categoryId, currentProductId }) {
  async function getRelatedProducts() {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/products?category=${categoryId}`,
      );
      return data.data.filter((p) => p.id !== currentProductId);
    } catch {
      return [];
    }
  }

  const {
    data: products = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["relatedProducts", categoryId],
    queryFn: getRelatedProducts,
    staleTime: 1000 * 60 * 5,
    enabled: !!categoryId,
  });

  // Loading State
  if (isLoading) {
    return <SimpleLoad />;
  }

  // Error State
  if (isError || !products || products.length === 0) return <SimpleError />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-16"
    >
      {/* Background Effects */}
      <FixedBackground />

      {/* Header */}
      <FixedHeader
        Icon={FiPackage}
        title={"Products"}
        header={"YOU MAY ALSO LIKE"}
        subTitle={"Discover more products from the same category"}
        word={"Related"}
      />

      {/* Swiper Container */}
      <div className="related-products-swiper">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={products.length > 4}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
          }}
          className="!pb-4"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
}
