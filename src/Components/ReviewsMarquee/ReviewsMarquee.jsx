"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Marquee from "react-fast-marquee";
import ReviewCard from "./ReviewCard";
import SimpleLoad from "../SimpleLoad/SimpleLoad";
import SimpleError from "../SimpleError/SimpleError";
import FixedBackground from "../FixedBackground/FixedBackground";
import FixedHeader from "../FixedHeader/FixedHeader";

async function getReviews() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/reviews",
  );
  return data.data;
}

export default function ReviewsMarquee() {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allReviews"],
    queryFn: getReviews,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return <SimpleLoad />;

  if (isError || reviews.length === 0) return <SimpleError />;

  return (
    <section className="relative py-16 bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <FixedBackground />

      <FixedHeader
        title={"Customers Say"}
        header={"TESTIMONIALS"}
        subTitle={`Real reviews from real customers - ${reviews.length}+ reviews`}
        word={"What Our"}
      />

      {/* Marquee */}
      <div className="relative">
        <Marquee gradient={false} speed={40} className="py-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </Marquee>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
