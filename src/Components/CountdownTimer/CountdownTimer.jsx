"use client";

import { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";

export default function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-4">
      <FiClock className="text-red-400" size={24} />
      <div className="flex gap-2">
        {[
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <div key={item.label} className="flex items-center">
            <div className="bg-slate-900 border border-red-500/30 rounded-xl px-4 py-3 min-w-[70px] text-center">
              <div className="text-3xl font-black text-white">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-xs text-slate-400 font-semibold mt-1">
                {item.label}
              </div>
            </div>
            {index < 2 && (
              <span className="text-2xl font-bold text-red-400 mx-1">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}