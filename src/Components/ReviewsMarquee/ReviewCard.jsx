import { FiStar, FiUser } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export default function ReviewCard({ review }) {
  return (
    <div className="w-80 mx-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex-shrink-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {review.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Info */}
          <div>
            <h4 className="text-white font-semibold text-sm">
              {review.user?.name || "Anonymous"}
            </h4>
            <p className="text-slate-400 text-xs">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="flex items-center gap-1 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
          <BsStars size={10} />
          <span>Verified</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={16}
            className={
              i < review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-600"
            }
          />
        ))}
        <span className="text-white font-semibold text-sm ml-1">
          {review.rating}.0
        </span>
      </div>

      {/* Review Text */}
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
        {review.review}
      </p>

      {/* Bottom Gradient */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Review #{review._id.slice(-6)}</span>
          <span className="text-purple-400">•</span>
          <span>Helpful</span>
        </div>
      </div>
    </div>
  );
}