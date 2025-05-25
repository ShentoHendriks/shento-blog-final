import { useState } from "react";

export const CustomSlider = ({ opt, values, update }) => {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((values[opt.name] - opt.min) / (opt.max - opt.min)) * 100;

  return (
    <div className="flex items-center space-x-3 flex-1">
      <div className="relative flex-1">
        {/* Track Container */}
        <div className="relative w-full h-2 py-3">
          {/* Background Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#363F72] rounded-full">
            {/* Filled Track */}
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Custom Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-200 ${
              isDragging ? "scale-125 shadow-xl" : "hover:scale-110"
            }`}
            style={{ left: `calc(${percentage}% - 10px)` }}>
            {/* Inner circle for better visual */}
            <div className="absolute inset-1 bg-white rounded-full" />
          </div>

          {/* Invisible Range Input */}
          <input
            type="range"
            min={opt.min}
            max={opt.max}
            step={opt.step || 1}
            value={values[opt.name]}
            onChange={(e) => update(Number(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>

      {/* Value Display */}
      <div className="min-w-[60px] text-sm font-mono text-white px-2 py-1 rounded">
        {values[opt.name]}
        {opt.unit || ""}
      </div>
    </div>
  );
};
