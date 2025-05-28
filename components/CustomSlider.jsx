import React, { useState, useMemo, useCallback } from "react";

export const CustomSlider = React.memo(({ opt, values, update }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const percentage = useMemo(() => {
    return ((values[opt.name] - opt.min) / (opt.max - opt.min)) * 100;
  }, [values[opt.name], opt.min, opt.max]);

  const thumbPosition = useMemo(() => {
    const thumbWidth = 20;
    const position = (percentage / 100) * (100 - thumbWidth / 4);
    return position;
  }, [percentage]);

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
      <div
        className="relative flex-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="relative w-full h-2 py-3">
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#363F72] rounded-full transition-all duration-200 ${
              isHovered ? "h-[4px]" : ""
            }`}>
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{
                width: `${percentage}%`,
                transition: isDragging ? "none" : "all 0.2s ease",
              }}
            />
          </div>

          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-200 ${
              isDragging ? "scale-125 shadow-xl" : isHovered ? "scale-110" : ""
            }`}
            style={{
              left: `${thumbPosition}%`,
              transition: isDragging ? "none" : "all 0.2s ease",
            }}>
            <div
              className={`absolute inset-1 bg-white rounded-full transition-all duration-200 ${
                isHovered || isDragging ? "inset-1.5" : ""
              }`}
            />
          </div>

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

      <div
        className={`min-w-[60px] text-sm font-mono text-white px-2 py-1 rounded transition-all duration-200 ${
          isHovered ? "bg-white/10 scale-105" : ""
        }`}>
        {values[opt.name]}
        {opt.unit || ""}
      </div>
    </div>
  );
});

CustomSlider.displayName = "CustomSlider";
