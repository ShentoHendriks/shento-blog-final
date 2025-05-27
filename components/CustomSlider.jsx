import React, { useState, useMemo, useCallback } from "react";

export const CustomSlider = React.memo(({ opt, values, update }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Memoize percentage calculation
  const percentage = useMemo(() => {
    return ((values[opt.name] - opt.min) / (opt.max - opt.min)) * 100;
  }, [values[opt.name], opt.min, opt.max]);

  // Calculate thumb position to keep it within bounds
  const thumbPosition = useMemo(() => {
    // Thumb is 20px wide (w-5), so we need to adjust position
    // At 0%, thumb left edge should be at 0
    // At 100%, thumb right edge should be at track end
    const thumbWidth = 20; // w-5 = 20px
    const position = (percentage / 100) * (100 - thumbWidth / 4);
    return position;
  }, [percentage]);

  // Memoize event handlers
  const handleChange = useCallback(
    (e) => {
      update(Number(e.target.value));
    },
    [update]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="flex md:items-center space-x-3 flex-1 max-w-[400px]">
      <div className="relative flex-1">
        {/* Track Container */}
        <div className="relative w-full h-2 py-3">
          {/* Background Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#363F72] rounded-full">
            {/* Filled Track */}
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{
                width: `${percentage}%`,
                transition: isDragging ? "none" : "width 0.1s ease",
              }}
            />
          </div>

          {/* Custom Thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none ${
              isDragging ? "scale-125 shadow-xl" : "hover:scale-110"
            }`}
            style={{
              left: `${thumbPosition}%`,
              transition: isDragging
                ? "none"
                : "left 0.1s ease, transform 0.1s ease",
            }}>
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
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            style={{
              padding: 0,
              margin: 0,
            }}
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
});

// Add display name for better debugging
CustomSlider.displayName = "CustomSlider";
