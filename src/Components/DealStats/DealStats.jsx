
import { FiShoppingBag, FiTrendingUp, FiUsers } from "react-icons/fi";

export default function DealStats({ products }) {
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
  const avgDiscount =
    products.reduce((sum, p) => sum + (p.discount || 0), 0) / products.length;

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        {
          icon: FiShoppingBag,
          value: `${products.length}+`,
          label: "Hot Deals",
          color: "from-purple-500 to-pink-500",
        },
        {
          icon: FiUsers,
          value: `${Math.floor(totalSold / 10^6)}K+`,
          label: "Items Sold",
          color: "from-pink-500 to-purple-500",
        },
        {
          icon: FiTrendingUp,
          value: `${Math.round(avgDiscount)}%`,
          label: "Avg Savings",
          color: "from-purple-500 to-indigo-500",
        },
      ].map((stat, index) => (
        <div
          key={stat.label}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 text-center hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <stat.icon className="text-purple-400" size={24} />
          </div>
          <div
            className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
          >
            {stat.value}
          </div>
          <p className="text-slate-400 text-xs font-semibold">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}