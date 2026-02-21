"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BsStars } from "react-icons/bs";
import {
  FiBell,
  FiLock,
  FiEye,
  FiGlobe,
  FiTrash2,
  FiShield,
  FiMoon,
  FiSmartphone,
} from "react-icons/fi";
import Link from "next/link";
import { Helmet } from "react-helmet";

const ToggleSwitch = ({ enabled, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={ariaLabel}
    onClick={() => onChange(!enabled)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
      enabled ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-slate-700"
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
        enabled ? "left-7" : "left-1"
      }`}
      aria-hidden="true"
    />
  </button>
);

export default function Settings() {
  const shouldReduceMotion = useReducedMotion();
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    smsNotifications: false,
    // Privacy
    profileVisible: true,
    showActivity: false,
    // Preferences
    darkMode: true,
    language: "en",
    currency: "USD",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Helmet>
        <title>ShopNow | Setting </title>
      </Helmet>

      <section className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full mb-4">
            <BsStars className="text-purple-400" size={16} />
            <span className="text-purple-400 text-sm font-semibold">
              PREFERENCES
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            Account{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Settings
            </span>
          </h2>
          <p className="text-slate-400 text-sm">
            Manage your account preferences and privacy settings
          </p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <FiBell className="text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Notifications</h3>
              <p className="text-slate-400 text-sm">
                Control how you receive notifications
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                key: "emailNotifications",
                label: "Email Notifications",
                desc: "Receive updates via email",
                icon: FiBell,
              },
              {
                key: "orderUpdates",
                label: "Order Updates",
                desc: "Get notified about your order status",
                icon: FiShield,
              },
              {
                key: "promotions",
                label: "Promotions & Offers",
                desc: "Receive special deals and discounts",
                icon: BsStars,
              },
              {
                key: "newArrivals",
                label: "New Arrivals",
                desc: "Be the first to know about new products",
                icon: FiEye,
              },
              {
                key: "smsNotifications",
                label: "SMS Notifications",
                desc: "Receive updates via text message",
                icon: FiSmartphone,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                    <item.icon className="text-slate-400" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {item.label}
                    </p>
                    <p className="text-slate-400 text-xs">{item.desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings[item.key]}
                  onChange={(val) => updateSetting(item.key, val)}
                  ariaLabel={`Toggle ${item.label}`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <FiEye className="text-emerald-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Privacy</h3>
              <p className="text-slate-400 text-sm">
                Manage your privacy preferences
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                key: "profileVisible",
                label: "Public Profile",
                desc: "Make your profile visible to others",
              },
              {
                key: "showActivity",
                label: "Show Activity",
                desc: "Let others see your recent activity",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0"
              >
                <div>
                  <p className="text-white font-semibold text-sm">
                    {item.label}
                  </p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
                <ToggleSwitch
                  enabled={settings[item.key]}
                  onChange={(val) => updateSetting(item.key, val)}
                  ariaLabel={`Toggle ${item.label}`}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
              <FiGlobe className="text-amber-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Preferences</h3>
              <p className="text-slate-400 text-sm">
                Customize your experience
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Dark Mode */}
            <div className="flex items-center justify-between py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                  <FiMoon className="text-slate-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Dark Mode</p>
                  <p className="text-slate-400 text-xs">
                    Use dark theme across the app
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.darkMode}
                onChange={(val) => updateSetting("darkMode", val)}
                ariaLabel="Toggle Dark Mode"
              />
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                  <FiGlobe className="text-slate-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Language</p>
                  <p className="text-slate-400 text-xs">
                    Select your preferred language
                  </p>
                </div>
              </div>
              <select
                aria-label="Language"
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-slate-400 text-sm font-bold">$</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Currency</p>
                  <p className="text-slate-400 text-xs">
                    Select your preferred currency
                  </p>
                </div>
              </div>
              <select
                aria-label="Currency"
                value={settings.currency}
                onChange={(e) => updateSetting("currency", e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="EGP">EGP (£)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <FiLock className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Security</h3>
              <p className="text-slate-400 text-sm">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/profile/change-password"
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 hover:border-purple-500/50 border border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <FiLock className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Change Password
                  </p>
                  <p className="text-slate-400 text-xs">
                    Update your account password
                  </p>
                </div>
              </div>
              <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>

            <Link
              href="/profile/update-info"
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 hover:border-purple-500/50 border border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                  <FiShield className="text-emerald-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Update Personal Info
                  </p>
                  <p className="text-slate-400 text-xs">
                    Update your name, email, and phone
                  </p>
                </div>
              </div>
              <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <FiTrash2 className="text-red-400" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Danger Zone</h3>
              <p className="text-slate-400 text-sm">
                Irreversible and destructive actions
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div>
              <p className="text-white font-semibold text-sm">Delete Account</p>
              <p className="text-slate-400 text-xs">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold rounded-xl transition-all text-sm"
            >
              Delete Account
            </button>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-red-500/20"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTrash2 className="text-red-400" size={32} aria-hidden="true" />
              </div>
              <h2 id="delete-dialog-title" className="text-2xl font-black text-white text-center mb-3">
                Delete Account?
              </h2>
              <p id="delete-dialog-description" className="text-slate-400 text-sm text-center mb-8">
                This action cannot be undone. All your data, orders, and reviews
                will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold transition-all hover:opacity-90"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}
