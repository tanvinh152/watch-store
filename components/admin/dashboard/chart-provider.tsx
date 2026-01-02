'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Set global defaults
ChartJS.defaults.font.family = 'var(--font-inter), system-ui, sans-serif';
ChartJS.defaults.plugins.tooltip.backgroundColor = 'hsl(var(--popover))';
ChartJS.defaults.plugins.tooltip.titleColor = 'hsl(var(--popover-foreground))';
ChartJS.defaults.plugins.tooltip.bodyColor = 'hsl(var(--popover-foreground))';
ChartJS.defaults.plugins.tooltip.borderColor = 'hsl(var(--border))';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;

export { ChartJS };
