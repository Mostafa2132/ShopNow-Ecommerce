export default function SimpleError() {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">⚠️</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        Failed to load Data
      </h3>
      <p className="text-slate-400">Please try again later</p>
    </div>
  );
}
