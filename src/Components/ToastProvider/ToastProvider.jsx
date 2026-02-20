"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      toastClassName={() =>
        "!w-[320px] flex items-center my-4 max-w-none bg-slate-900 border border-purple-500/30 text-white rounded-2xl shadow-lg shadow-purple-500/20 p-4 text-base"
      }
      progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
    />
  );
}
