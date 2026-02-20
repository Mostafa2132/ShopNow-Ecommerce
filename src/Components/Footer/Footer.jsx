import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiGithub,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import FixedBackground from "../FixedBackground/FixedBackground";
import { FaCcMastercard, FaCcVisa, FaCcPaypal, FaCcAmex } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 overflow-hidden">
      {/* Background Effects */}
      <FixedBackground />

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <FiShoppingBag className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ShopNow
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Your trusted destination for premium products at unbeatable
              prices. Shop with confidence and enjoy worldwide shipping.
            </p>

            <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 px-4 py-2 rounded-full">
              <BsStars className="text-purple-400" size={14} />
              <span className="text-purple-400 text-xs font-semibold">
                100% AUTHENTIC
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Categories", href: "/categories" },
                { name: "Brands", href: "/brands" },
                { name: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {[
                { name: "My Account", href: "/account" },
                { name: "Order Tracking", href: "/track-order" },
                { name: "Wishlist", href: "/wishlist" },
                { name: "Help & FAQs", href: "/help" },
                { name: "Returns", href: "/returns" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-purple-400 group-hover:w-4 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Address</p>
                  <p className="text-slate-400 text-sm">
                    123 Shopping St, Commerce City
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-emerald-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Phone</p>
                  <a
                    href="tel:+1234567890"
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-pink-400" size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Email</p>
                  <a
                    href="mailto:support@shopnow.com"
                    className="text-slate-400 hover:text-pink-400 transition-colors text-sm"
                  >
                    support@shopnow.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-slate-400 text-sm">
                Get the latest updates, deals, and exclusive offers delivered to
                your inbox.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} ShopNow. All rights reserved. Made with{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 font-black bg-clip-text text-transparent">
                Mosatfa M.Ebrahem
              </span>{" "}
              ❤️
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: FiFacebook, href: "#", color: "hover:text-blue-400" },
                { icon: FiTwitter, href: "#", color: "hover:text-sky-400" },
                { icon: FiInstagram, href: "#", color: "hover:text-pink-400" },
                { icon: FiGithub, href: "#", color: "hover:text-white" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 ${social.color} transition-all duration-300 hover:scale-110`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Payment Methods */}

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">We Accept:</span>
              <div className="flex items-center gap-2">
                {[
                  { Icon: FaCcVisa, color: "text-blue-400" },
                  { Icon: FaCcMastercard, color: "text-red-400" },
                  { Icon: FaCcPaypal, color: "text-sky-400" },
                  { Icon: FaCcAmex, color: "text-emerald-400" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="w-10 h-7 bg-slate-800 rounded flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <item.Icon size={22} className={item.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-800">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Cookie Policy", href: "/cookies" },
              { name: "Shipping Policy", href: "/shipping" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-500 hover:text-purple-400 transition-colors text-xs"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
