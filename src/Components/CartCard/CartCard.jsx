import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";

export default function CartCard({
  item,
  index,
  handleUpdateQuantity,
  handleRemoveItem,
  loading,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -100 }}
      transition={{ duration: 0.3, delay: shouldReduceMotion ? 0 : index * 0.05 }}
      className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 transition-all group ${
        shouldReduceMotion ? "hover:border-purple-500/50" : "hover:border-purple-500/50"
      }`}
      aria-label={`Cart item: ${item.product.title}`}
    >
      <div className="flex gap-6">
        {/* Product Image */}
        <Link
          href={`/products/${item?.product._id}`}
          className="relative w-32 h-32 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 group/img focus:outline-none focus:ring-4 focus:ring-purple-500 block"
          aria-label={`View details for ${item.product.title}`}
          tabIndex={-1} // Prevent double tabbing if the heading is also a link
        >
          <Image
            src={item.product.imageCover}
            alt="" // Decorative since we have aria-label on the link or heading
            fill
            sizes="(max-width: 768px) 128px, 128px"
            className={`object-cover ${
              shouldReduceMotion
                ? ""
                : "group-hover/img:scale-110 transition-transform duration-500"
            }`}
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item?.product._id}`}
                className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded block"
              >
                <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all cursor-pointer">
                  {item.product.title}
                </h3>
              </Link>
              <p className="text-sm text-slate-400">
                {item.product.brand?.name || "Unknown Brand"}
              </p>
            </div>

            <button
              onClick={() => handleRemoveItem(item?.product._id)}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-4 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Remove ${item.product.title} from cart`}
            >
              <FiTrash2 size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Quantity Controls */}
            <fieldset className="flex items-center gap-3">
              <legend className="sr-only">Quantity for {item.product.title}</legend>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product._id, item.count - 1)
                }
                disabled={item.count <= 1 || loading}
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={`Decrease quantity of ${item.product.title}`}
              >
                <FiMinus size={16} aria-hidden="true" />
              </button>

              <span
                className="text-white font-bold text-lg min-w-[2rem] text-center"
                aria-live="polite"
              >
                {item.count}
              </span>

              <button
                onClick={() =>
                  handleUpdateQuantity(item.product._id, item.count + 1)
                }
                disabled={loading}
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={`Increase quantity of ${item.product.title}`}
              >
                <FiPlus size={16} aria-hidden="true" />
              </button>
            </fieldset>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">
                <span className="sr-only">Price per item:</span>
                ${item.price.toFixed(2)} each
              </p>
              <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <span className="sr-only">Total price:</span>
                ${(item.count * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
