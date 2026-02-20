"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        
        <div className="text-6xl mb-4">🚨</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {error?.message || "Unexpected error occurred. Please try again."}
        </p>

        <button
          onClick={() => reset()}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 active:scale-95"
        >
          Try Again
        </button>

      </div>
    </div>
  );
}
