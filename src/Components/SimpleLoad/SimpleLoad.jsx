
export default function SimpleLoad() {
  return (
      <div className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/20 rounded-full animate-ping" />
            </div>
          </div>
        </div>
      </div>
  )
}
