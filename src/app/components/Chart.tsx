"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
    myPieChart?: any;
  }
}

export default function CDNPieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    if (window.myPieChart) {
      window.myPieChart.destroy();
    }

    window.myPieChart = new window.Chart(ctx!, {
      type: "pie",
      data: {
        labels: ["Sayur", "Buah", "Daging"],
        datasets: [
          {
            data: [40, 30, 30],
            backgroundColor: ["#4ade80", "#60a5fa", "#f87171"],
            borderColor: "#000000",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: false },
          legend: { display: false },
        },
      },
    });
    
  }, []);

  return (
    <div className="w-[500px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
