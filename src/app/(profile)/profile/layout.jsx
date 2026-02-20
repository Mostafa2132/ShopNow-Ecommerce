"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUser,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiRefreshCcw,
  FiSettings,
} from "react-icons/fi";
import FixedBackground from "../../../Components/FixedBackground/FixedBackground";
import FixedHeader from "../../../Components/FixedHeader/FixedHeader";
import GusetRoute from "../../../Components/GusetRoute/GusetRoute";
export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "My Account", href: "/profile", icon: FiUser },
    { name: "My Orders", href: "/allorders", icon: FiShoppingBag },
    { name: "Addresses", href: "/profile/addresses", icon: FiMapPin },
    { name: "Wishlist", href: "/wishlist", icon: FiHeart },
    {
      name: "Update User Info",
      href: "/profile/updata-user",
      icon: FiRefreshCcw,
    },
    { name: "Change Password", href: "/profile/changePassword", icon: FiLock },
    { name: "Setting", href: "/profile/setting", icon: FiSettings },
  ];

  return (
    <section className="relative min-h-screen bg-slate-950 py-20">
      {/* Background Effects */}
      <FixedBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FixedHeader
          header={"MY ACCOUNT"}
          word={"My"}
          title={"Profile"}
          subTitle={"Manage your account settings and preferences"}
        />

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <GusetRoute>{children}</GusetRoute>
          </main>
        </div>
      </div>
    </section>
  );
}
