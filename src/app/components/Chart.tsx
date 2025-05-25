// app/components/Chart.tsx
'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export default function CDNPieChart({ data }: { data: PieDataItem[] }) {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Pie data={chartData} options={options} />
    </div>
  );
}

// "use client";

// import { useEffect, useRef } from "react";

// declare global {
//   interface Window {
//     Chart: any;
//     myPieChart?: any;
//   }
// }

// export default function CDNPieChart() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!window.Chart || !canvasRef.current) return;

//     const ctx = canvasRef.current.getContext("2d");

//     if (window.myPieChart) {
//       window.myPieChart.destroy();
//     }

//     window.myPieChart = new window.Chart(ctx!, {
//       type: "pie",
//       data: {
//         labels: ["Sayur", "Buah", "Daging"],
//         datasets: [
//           {
//             data: [40, 30, 30],
//             backgroundColor: ["#4ade80", "#60a5fa", "#f87171"],
//             borderColor: "#000000",
//             borderWidth: 2,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           title: { display: false },
//           legend: { display: false },
//         },
//       },
//     });
    
//   }, []);

//   return (
//     <div className="w-[500px]">
//       <canvas ref={canvasRef} className="w-40 h-40" />
//     </div>
//   );
// }
