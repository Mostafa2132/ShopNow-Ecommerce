import { FiMapPin, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
export default function AddressCard({ address, handleDeleteAddress ,deleteMutation}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <FiMapPin className="text-purple-400" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-2">{address.name}</h3>
          <p className="text-slate-400 text-sm mb-1">{address.details}</p>
          <p className="text-slate-400 text-sm mb-1">{address.city}</p>
          <p className="text-slate-400 text-sm">{address.phone}</p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteAddress(address._id, address.name)}
          disabled={deleteMutation.isPending}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete address"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
