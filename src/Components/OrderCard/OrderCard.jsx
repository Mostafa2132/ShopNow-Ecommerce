import Image from "next/image";
import { FiCalendar, FiCheckCircle, FiDollarSign, FiPackage, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";
export default function OrderCard({order,index}) {

  // Get Status Color
  const getStatusColor = (isPaid, isDelivered) => {
    if (isDelivered) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    if (isPaid) return "text-blue-400 bg-blue-400/10 border-blue-400/30";
    return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  };

  // Get Status Text
  const getStatusText = (isPaid, isDelivered) => {
    if (isDelivered) return "Delivered";
    if (isPaid) return "Processing";
    return "Pending Payment";
  };

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Order Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.isPaid,
                          order.isDelivered
                        )}`}
                      >
                        {getStatusText(order.isPaid, order.isDelivered)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPackage size={16} />
                        {order.cartItems?.length || 0} items
                      </div>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="text-right">
                    <p className="text-slate-400 text-sm mb-1">Total Amount</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ${order.totalOrderPrice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                {/* Products */}
                <div className="space-y-4 mb-6">
                  {order.cartItems?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-4"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product?.imageCover || "/placeholder.png"}
                          alt={item.product?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                          {item.product?.title}
                        </h4>
                        <p className="text-slate-400 text-xs mb-1">
                          Quantity: {item.count}
                        </p>
                        <p className="text-purple-400 font-bold text-sm">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Payment Method */}
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiDollarSign className="text-purple-400" size={18} />
                      <p className="text-slate-400 text-xs">Payment</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {order.paymentMethodType === "cash" ? "Cash" : "Card"}
                    </p>
                  </div>

                  {/* Shipping Price */}
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiTruck className="text-emerald-400" size={18} />
                      <p className="text-slate-400 text-xs">Shipping</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      ${order.shippingPrice || 0}
                    </p>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiCheckCircle
                        className={order.isPaid ? "text-emerald-400" : "text-amber-400"}
                        size={18}
                      />
                      <p className="text-slate-400 text-xs">Paid</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {order.isPaid ? "Yes" : "No"}
                    </p>
                  </div>

                  {/* Delivery Status */}
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FiPackage
                        className={order.isDelivered ? "text-emerald-400" : "text-amber-400"}
                        size={18}
                      />
                      <p className="text-slate-400 text-xs">Delivered</p>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {order.isDelivered ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-6 bg-slate-800/30 rounded-xl p-4">
                    <p className="text-slate-400 text-xs mb-2">Shipping Address</p>
                    <p className="text-white font-semibold text-sm">
                      {order.shippingAddress.details}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {order.shippingAddress.city}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
  )
}
