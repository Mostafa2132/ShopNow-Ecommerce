"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BsStars } from "react-icons/bs";
import SimpleLoad from "../../Components/SimpleLoad/SimpleLoad";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../Components/FixedHeader/FixedHeader";
import BrandCard from "../../Components/BrandCard/BrandCard";
import SimpleError from "../../Components/SimpleError/SimpleError";
import { Helmet } from "react-helmet";

async function getBrands() {
  try {
    const options = {
      method: "GET",
      url: "https://ecommerce.routemisr.com/api/v1/brands",
    };
    const res = await axios.request(options);
    return res.data.data;
  } catch (error) {
    return [];
  }
}

export default function Brands() {
  const {
    data: brands = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: 60 * 24 * 60,
  });

  if (isLoading) return <SimpleLoad />;
  if (isError) return <SimpleError />;

  return (
    <>
      <Helmet>
        <title>ShopNow | Brands </title>
      </Helmet>

      <main className="relative min-h-screen overflow-x-hidden bg-slate-950 py-20">
        {/* Background Effects */}
        <div aria-hidden="true">
          <FixedBackground />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}

          <FixedHeader
            header={"PREMIUM BRANDS"}
            subTitle={` Discover products from your favorite brands - ${brands.length}+
            premium brands available`}
            word={`Shop by`}
            title={"Brand"}
          />

          {/* Brands Grid */}
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6" aria-label="Brands Grid">
              {brands.map((brand, index) => (
                <BrandCard key={brand._id} index={index} brand={brand} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20" aria-live="polite">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                <BsStars className="text-slate-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No Brands Available
              </h3>
              <p className="text-slate-400 mb-6">
                Brands will appear here soon. Check back later!
              </p>
            </div>
          )}

          {/* Stats Section */}
          {brands.length > 0 && (
            <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8" aria-label="Brand Statistics">
              <div className="text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2" aria-hidden="true">
                  {brands.length}+
                </div>
                <p className="text-slate-400 font-semibold">
                  <span className="sr-only">Over {brands.length} </span>Premium Brands
                </p>
              </div>

              <div className="text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2" aria-hidden="true">
                  100%
                </div>
                <p className="text-slate-400 font-semibold">
                  <span className="sr-only">100 percent </span>Authentic Products
                </p>
              </div>

              <div className="text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2" aria-hidden="true">
                  24/7
                </div>
                <p className="text-slate-400 font-semibold"><span className="sr-only">24 hours a day, 7 days a week </span>Customer Support</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
