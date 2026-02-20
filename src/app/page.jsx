import ShowProducts from "../Components/ShowProducts/ShowProducts";
import CategorySlider from "../Components/CategorySlider/CategorySlider";
import Hero from "../Components/Hero/Hero";
import ReviewsMarquee from "../Components/ReviewsMarquee/ReviewsMarquee";
import DynamicMarquee from "../Components/DynmicMarquee/DynmicMarquee";
import DealsSection from "../Components/DealsSection/DealsSection";

export const metadata = {
  title: "ShopNow ",
};
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Categories Slider */}
      <CategorySlider />

      {/* Free Shipping Announcement */}
      <DynamicMarquee
        title="🎉 Limited Time Offer - Free Shipping On Orders Over $50"
        variant="primary"
      />

      {/* Products Section */}
      <ShowProducts />

      {/* Flash Sale Marquee */}
      <DynamicMarquee
        title="⚡ Flash Sale - Up to 70% Off on Selected Items - Hurry!"
        variant="secondary"
      />
      <DealsSection />

      {/* Premium Brands Marquee */}
      <DynamicMarquee
        title="✨ Shop Premium Brands - 100% Authentic Products - Worldwide Shipping"
        variant="accent"
      />
      {/* Customer Reviews */}
      <ReviewsMarquee />
    </>
  );
}
