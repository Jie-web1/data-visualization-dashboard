import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function formatPopulation(value) {
  if (!value) return '0';
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return String(value);
}

export default function BarChart({ data }) {
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [year, setYear] = useState(() => {
    if (!data?.length) return 2022;
    const years = [...new Set(data.map((d) => d.Year))].sort((a, b) => b - a);
    return years[0] ?? 2022;
  });

  const { years, barData } = useMemo(() => {
    if (!data?.length) return { years: [], barData: [] };
    const years = [...new Set(data.map((d) => d.Year))].sort((a, b) => b - a);
    const byCountry = {};
    data.forEach((row) => {
      if (row.Year !== year) return;
      const name = row['Country Name'];
      const pop = Number(row.Population);
      if (!name || isNaN(pop)) return;
      byCountry[name] = (byCountry[name] ?? 0) + pop;
    });
    let list = Object.entries(byCountry)
      .map(([country, population]) => ({ country, population }))
      .sort((a, b) => (sortOrder === 'desc' ? b.population - a.population : a.population - b.population))
      .slice(0, 15);
    return { years, barData: list };
  }, [data, year, sortOrder]);

  const chartData = useMemo(() => {
    if (!barData.length) return null;
    return {
      labels: barData.map((d) => d.country),
      datasets: [
        {
          label: `Population (${year})`,
          data: barData.map((d) => d.population),
          backgroundColor: 'rgba(88, 166, 255, 0.7)',
          borderColor: '#58a6ff',
          borderWidth: 1,
          borderRadius: 4,
          animation: { duration: 800 },
        },
      ],
    };
  }, [barData, year]);

  const options = useMemo(
    () => ({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#161b22',
          titleColor: '#e6edf3',
          bodyColor: '#8b949e',
          borderColor: '#30363d',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${formatPopulation(ctx.raw)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: '#30363d' },
          ticks: {
            color: '#8b949e',
            callback: (v) => formatPopulation(v),
          },
        },
        y: {
          grid: { color: '#30363d' },
          ticks: { color: '#8b949e' },
        },
      },
      animation: {
        duration: 800,
      },
    }),
    []
  );

  if (!data?.length) return <div className="chart-placeholder">Loading data…</div>;

  return (
    <div className="chart-card">
      <h3>2. Population Ranking</h3>
      <p className="chart-desc">Top 15 countries by population. Change year and sort order.</p>
      <div className="bar-controls">
        <label>
          Year:{' '}
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort:{' '}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Highest first</option>
            <option value="asc">Lowest first</option>
          </select>
        </label>
      </div>
      <div className="chart-container">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="chart-placeholder">No data for this year.</div>
        )}
      </div>
    </div>
  );
}
