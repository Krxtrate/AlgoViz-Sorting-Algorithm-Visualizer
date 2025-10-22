import { useState, useEffect, useRef } from "react";

interface VisualizerProps {
  array: number[];
  comparingIndices: number[];
  sortedIndices: number[];
  swappingIndices: number[];
}

export const AlgorithmVisualizer = ({
  array,
  comparingIndices,
  sortedIndices,
  swappingIndices,
}: VisualizerProps) => {
  const maxValue = Math.max(...array);
  const containerRef = useRef<HTMLDivElement>(null);

  const getBarClass = (index: number) => {
    if (sortedIndices.includes(index)) return "gradient-sorted";
    if (swappingIndices.includes(index)) return "gradient-accent animate-pulse";
    if (comparingIndices.includes(index)) return "gradient-comparing";
    return "gradient-primary";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] bg-card border border-border rounded-xl p-6 flex items-end justify-center gap-1 animate-fade-in shadow-accent"
    >
      {array.map((value, index) => (
        <div
          key={index}
          className={`flex-1 ${getBarClass(index)} rounded-t-md transition-all duration-300 ease-out relative group`}
          style={{
            height: `${(value / maxValue) * 100}%`,
            minWidth: "4px",
          }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
};
