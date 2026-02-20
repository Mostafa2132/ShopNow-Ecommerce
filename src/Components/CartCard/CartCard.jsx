import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
export default function CartCard({
  item,
  index,
  handleUpdateQuantity,
  handleRemoveItem,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group"
    >
      <div className="flex gap-6">
        {/* Product Image */}
        <Link
          href={`/product/${item?.product._id}`}
          className="relative w-32 h-32 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0 group/img"
        >
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
            fill
            className="object-cover group-hover/img:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item?.product._id}`}>
                <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all cursor-pointer">
                  {item.product.title}
                </h3>
              </Link>
              <p className="text-sm text-slate-400">
                {item.product.brand?.name}
              </p>
            </div>

            <button
              onClick={() => handleRemoveItem(item?.product._id)}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-4 disabled:opacity-50"
            >
              <FiTrash2 size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product._id, item.count - 1)
                }
                disabled={item.count <= 1 || loading}
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiMinus size={16} />
              </button>

              <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                {item.count}
              </span>

              <button
                onClick={() =>
                  handleUpdateQuantity(item.product._id, item.count + 1)
                }
                disabled={loading}
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiPlus size={16} />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">
                ${item.price.toFixed(2)} each
              </p>
              <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ${(item.count * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
