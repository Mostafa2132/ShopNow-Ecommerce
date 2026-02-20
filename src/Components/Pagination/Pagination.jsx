'use client'

import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 2 // عدد الأرقام اللي هتظهر

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-3 rounded-xl font-bold transition-all duration-300 ${
          currentPage === 1
            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
            : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg'
        }`}
      >
        <FiChevronLeft size={20} />
      </motion.button>

      {/* First Page */}
      {pages[0] > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(1)}
            className="px-4 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
          >
            1
          </motion.button>
          {pages[0] > 2 && (
            <span className="text-slate-500 font-bold">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
            currentPage === page
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {page}
        </motion.button>
      ))}

      {/* Last Page */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-slate-500 font-bold">...</span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
          >
            {totalPages}
          </motion.button>
        </>
      )}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-3 rounded-xl font-bold transition-all duration-300 ${
          currentPage === totalPages
            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
            : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg'
        }`}
      >
        <FiChevronRight size={20} />
      </motion.button>
    </div>
  )
}