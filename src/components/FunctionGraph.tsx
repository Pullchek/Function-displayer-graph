
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { MathParser } from '@/lib/mathParser';
import { ChartContainer } from '@/components/ui/chart';

interface FunctionGraphProps {
  expression: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  stepSize?: number;
}

export const FunctionGraph: React.FC<FunctionGraphProps> = ({
  expression,
  xMin = -10,
  xMax = 10,
  yMin,
  yMax,
  stepSize = 0.1,
}) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!expression || !canvasRef.current) return;
    
    // Clean up previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    // Create the evaluator function from the expression
    const evaluator = MathParser.createEvaluator(expression);
    
    // Generate data points
    const dataPoints = [];
    const validPoints = [];
    
    for (let x = xMin; x <= xMax; x += stepSize) {
      const roundedX = Math.round(x * 100) / 100; // Round to 2 decimal places
      const y = evaluator(roundedX);
      
      // Only include valid y points
      if (!isNaN(y) && isFinite(y)) {
        dataPoints.push({ x: roundedX, y });
        validPoints.push(y);
      } else {
        // Add a null point to break the line
        dataPoints.push({ x: roundedX, y: null });
      }
    }
    
    // Calculate y-axis bounds if not provided
    const calculatedYMin = yMin ?? Math.min(...validPoints, -1);
    const calculatedYMax = yMax ?? Math.max(...validPoints, 1);
    const yAxisPadding = (calculatedYMax - calculatedYMin) * 0.1;
    
    // Create the chart
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: `f(x) = ${expression}`,
              data: dataPoints,
              showLine: true,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              pointRadius: 0,
              borderWidth: 2,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'center',
              title: {
                display: true,
                text: 'x',
              },
              grid: {
                color: 'rgba(200, 200, 200, 0.3)',
              },
              ticks: {
                stepSize: Math.ceil((xMax - xMin) / 10),
              },
            },
            y: {
              type: 'linear',
              position: 'center',
              title: {
                display: true,
                text: 'f(x)',
              },
              min: calculatedYMin - yAxisPadding,
              max: calculatedYMax + yAxisPadding,
              grid: {
                color: 'rgba(200, 200, 200, 0.3)',
              },
            },
          },
          elements: {
            point: {
              radius: 0, // Hide points
            },
            line: {
              borderWidth: 2,
              tension: 0.1,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function(context) {
                  const x = context[0].parsed.x;
                  return `x = ${x.toFixed(2)}`;
                },
                label: function(context) {
                  const y = context.parsed.y;
                  return `f(x) = ${y !== null ? y.toFixed(4) : 'undefined'}`;
                }
              }
            }
          }
        },
      });
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [expression, xMin, xMax, yMin, yMax, stepSize]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
};
