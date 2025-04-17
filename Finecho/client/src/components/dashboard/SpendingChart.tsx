import { useEffect, useRef } from 'react';

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartBars = chartRef.current.querySelectorAll('.chart-bar');
      chartBars.forEach((bar) => {
        const originalHeight = (bar as HTMLElement).style.height;
        (bar as HTMLElement).style.height = '0';
        
        setTimeout(() => {
          (bar as HTMLElement).style.height = originalHeight;
        }, 300);
      });
    }
  }, [data]);

  return (
    <div className="h-60 flex items-end space-x-2 px-4" ref={chartRef}>
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="chart-bar w-full bg-primary-500 rounded-t" 
            style={{ height: `${item.percentage}%` }}
          ></div>
          <div className="text-xs mt-2 text-gray-600">{item.category}</div>
        </div>
      ))}
    </div>
  );
};

export default SpendingChart;
