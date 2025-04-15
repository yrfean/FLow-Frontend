import { useEffect, useState } from "react";

const ProgressiveCircleBar = ({ progress = 75 }: { progress: number }) => {
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const progressOffset = ((100 - progress) / 100) * circumference;
      setOffset(progressOffset);
    }, 300); // smooth entry

    return () => clearTimeout(timeout);
  }, [progress, circumference]);

  return (
    <svg
      width={140}
      height={140}
      style={{ transform: "rotate(-90deg)" }}
      viewBox="0 0 100 100"
    >
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="lightgray"
        fill="none"
        strokeWidth={strokeWidth}
      />

      {/* Progress Circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#8b5cf6" // violet-500
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1s ease-out",
        }}
      />

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="18"
        fill="#8b5cf6"
        transform="rotate(90, 50, 50)"
        style={{ fontWeight: "bold" }}
      >
        {progress}%
      </text>
    </svg>
  );
};

export default ProgressiveCircleBar;
