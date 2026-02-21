import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "../Components/Hero/Hero";

// Lazy-load components below the fold for better initial load performance (shrinks main JS bundle).
const CategorySlider = dynamic(() => import("../Components/CategorySlider/CategorySlider"));
const ShowProducts = dynamic(() => import("../Components/ShowProducts/ShowProducts"));
const DealsSection = dynamic(() => import("../Components/DealsSection/DealsSection"));
const ReviewsMarquee = dynamic(() => import("../Components/ReviewsMarquee/ReviewsMarquee"));
const DynamicMarquee = dynamic(() => import("../Components/DynmicMarquee/DynmicMarquee"));

export const metadata = {
  title: "ShopNow | Your Premium E-commerce Destination",
  description: "Discover limited time offers, flash sales, top categories, and premium brands at ShopNow.",
};

export default function Home() {
  return (
    // Use semantic <main> landmark instead of <> fragment for better Screen Reader Accessibility (A11y)
    <main>
      {/* Hero Section - Above the fold, loaded synchronously */}
      <Hero />

      {/* Wrapping grouped components in Suspense enables React Server Component streaming 
          and prevents one slow component from blocking the whole page. */}
      <Suspense fallback={<div aria-busy="true" className="w-full h-40 animate-pulse bg-gray-200"></div>}>
        {/* Categories Slider */}
        <CategorySlider />
      </Suspense>

      {/* Free Shipping Announcement */}
      <DynamicMarquee
        title="🎉 Limited Time Offer - Free Shipping On Orders Over $50"
        variant="primary"
      />

      <Suspense fallback={<div aria-busy="true" className="w-full h-96 animate-pulse bg-gray-200"></div>}>
        {/* Products Section */}
        <ShowProducts />
      </Suspense>

      {/* Flash Sale Marquee */}
      <DynamicMarquee
        title="⚡ Flash Sale - Up to 70% Off on Selected Items - Hurry!"
        variant="secondary"
      />

      <Suspense fallback={<div aria-busy="true" className="w-full h-96 animate-pulse bg-gray-200"></div>}>
        <DealsSection />
      </Suspense>

      {/* Premium Brands Marquee */}
      <DynamicMarquee
        title="✨ Shop Premium Brands - 100% Authentic Products - Worldwide Shipping"
        variant="accent"
      />

      <Suspense fallback={<div aria-busy="true" className="w-full h-40 animate-pulse bg-gray-200"></div>}>
        {/* Customer Reviews */}
        <ReviewsMarquee />
      </Suspense>
    </main>
  );
}
