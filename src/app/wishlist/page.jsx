"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { addItemToCart } from "../../store/slices/cartSlice";
import { FiHeart, FiTrash2, FiShoppingCart, FiStar } from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SimpleLoad from "../../Components/SimpleLoad/SimpleLoad";
import FixedBackground from "../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../Components/FixedHeader/FixedHeader";
import WishlistCard from "../../Components/WishlistCard/WishlistCard";
import { Helmet } from "react-helmet";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.authReducer);
  const { wishlistItems, loading, wishlistCount } = useSelector(
    (store) => store.wishlistReducer,
  );

  useEffect(() => {
    if (token) {
      dispatch(getWishlist(token));
    }
  }, [token, dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist({ productId, token }));
  };

  const handleAddToCart = (productId) => {
    dispatch(addItemToCart({ productId, token }));
  };

  if (loading) return <SimpleLoad />;

  return (
    <>
      <Helmet>
        <title>ShopNow | Wishlist </title>
      </Helmet>

      <section className="relative min-h-screen bg-slate-950 py-20">
        {/* Background Effects */}
        <FixedBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <FixedHeader
              header={"YOUR FAVORITES"}
              word={"My"}
              title={"Wishlist"}
            />

            <div className="flex items-center justify-center gap-2 text-slate-400 text-lg">
              <FiHeart className="text-pink-400" size={20} />
              <span>
                {wishlistCount > 0
                  ? `${wishlistCount} ${wishlistCount === 1 ? "item" : "items"} saved`
                  : "No items yet"}
              </span>
            </div>
          </div>

          {/* Wishlist Content */}
          {wishlistItems.length > 0 ? (
            <>
              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {wishlistCount}
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">
                    Total Items
                  </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    $
                    {wishlistItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(0)}
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">
                    Total Value
                  </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {(
                      wishlistItems.reduce(
                        (sum, item) => sum + item.ratingsAverage,
                        0,
                      ) / wishlistItems.length
                    ).toFixed(1)}
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">
                    Avg Rating
                  </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                    {
                      new Set(wishlistItems.map((item) => item.brand?.name))
                        .size
                    }
                  </div>
                  <p className="text-slate-400 text-xs font-semibold">Brands</p>
                </div>
              </motion.div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((product, index) => (
                  <WishlistCard
                    key={product._id}
                    index={index}
                    product={product}
                    handleAddToCart={handleAddToCart}
                    handleRemove={handleRemove}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiHeart className="text-slate-600" size={60} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">
                Your Wishlist is Empty
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                Start adding products you love and create your perfect
                collection!
              </p>

              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Browse Products
              </Link>

              {/* Quick Links */}
              <div className="mt-12 pt-8 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-4">
                  Popular Categories:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {["Electronics", "Fashion", "Home", "Sports"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/categories/${cat.toLowerCase()}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-sm font-semibold transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
