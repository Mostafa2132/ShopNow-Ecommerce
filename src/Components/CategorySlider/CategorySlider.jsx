"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BiSolidCategoryAlt } from "react-icons/bi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SimpleLoad from "../SimpleLoad/SimpleLoad";
import CategoryCard from "./CategoryCard";
import SimpleError from "../SimpleError/SimpleError";
import FixedBackground from "../FixedBackground/FixedBackground";
import FixedHeader from "../FixedHeader/FixedHeader";

export default function CategorySlider() {
  // get all cate
  async function getCat() {
    const options = {
      method: "GET",
      url: "https://ecommerce.routemisr.com/api/v1/categories",
    };
    const data = await axios.request(options);
    return data.data.data;
  }

  const {
    data = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCat,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) return <SimpleLoad />;

  if (isError) return <SimpleError />;


  return (
    <section className="relative py-20 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <FixedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FixedHeader
          header={"EXPLORE"}
          Icon={BiSolidCategoryAlt}
          word={"Shop by"}
          subTitle={` Discover our wide range of premium products across different
            categories`}
          title={"Category"}
        />

        {/* Categories Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="category-swiper  "
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
          >
            {data?.map((item, idx) => (
              <SwiperSlide key={item._id}>
                <CategoryCard item={item} index={idx} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
