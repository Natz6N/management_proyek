import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';

interface ChartProps {
  type: ChartType;
  data: any;
  options?: any;
  className?: string;
  height?: number;
  width?: number;
}

export function Chart({ type, data, options, className, height, width }: ChartProps) {
  const chartProps = { data, options, className, height, width };
  switch (type) {
    case 'bar':
      return <Bar {...chartProps} />;
    case 'line':
      return <Line {...chartProps} />;
    case 'pie':
      return <Pie {...chartProps} />;
    case 'doughnut':
      return <Doughnut {...chartProps} />;
    case 'radar':
      return <Radar {...chartProps} />;
    case 'polarArea':
      return <PolarArea {...chartProps} />;
    case 'bubble':
      return <Bubble {...chartProps} />;
    case 'scatter':
      return <Scatter {...chartProps} />;
    default:
      return null;
  }
}
