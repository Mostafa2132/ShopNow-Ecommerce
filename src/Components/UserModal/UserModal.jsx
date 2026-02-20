import {
  FiHeart,
  FiLogOut,
  FiSettings,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios"; // ✅ Missing import
import { logout } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

async function getUserData(token) {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/users/getMe",
    {
      headers: { token },
    },
  );
  return data.data;
}

export default function UserModal({ state, setState }) {
  const { token } = useSelector((store) => store.authReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserData(token),
    enabled: !!token && state, // Only fetch when modal is open and token exists
    staleTime: 1000 * 60 * 5,
  });

  const handleLogout = () => {
    dispatch(logout());
    setState(!state);
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-4 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-slate-700">
            {isLoading ? (
              <>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-24 mb-2" />
                <div className="h-3 bg-slate-700 rounded animate-pulse w-32" />
              </>
            ) : (
              <>
                <p className="text-white font-bold text-sm line-clamp-1 truncate">
                  {user?.name ? `Welecome ${user?.name}` : "My Account"}
                </p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </>
            )}
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            <li>
              <Link
                href="/profile"
                onClick={() => setState(!state)}
                className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3 group"
              >
                <FiUser
                  className="text-purple-400 group-hover:text-pink-400 transition-colors"
                  size={18}
                />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/allorders"
                 onClick={() => setState(!state)}
                className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3 group"
              >
                <FiShoppingBag
                  className="text-purple-400 group-hover:text-pink-400 transition-colors"
                  size={18}
                />
                <span className="text-sm font-medium">Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/wishlist"
                 onClick={() => setState(!state)}
                className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3 group"
              >
                <FiHeart
                  className="text-purple-400 group-hover:text-pink-400 transition-colors"
                  size={18}
                />
                <span className="text-sm font-medium">Wishlist</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile/setting"
                 onClick={() => setState(!state)}
                className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3 group"
              >
                <FiSettings
                  className="text-purple-400 group-hover:text-pink-400 transition-colors"
                  size={18}
                />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <div className="border-t border-slate-700"></div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3 group"
            >
              <FiLogOut
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
