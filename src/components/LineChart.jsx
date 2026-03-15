import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COLORS = [
  '#58a6ff',
  '#f0883e',
  '#a371f7',
  '#3fb950',
  '#f85149',
  '#d29922',
  '#79c0ff',
  '#ff7b72',
];

function formatGDP(value) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
  return `$${value?.toFixed(0) ?? 0}`;
}

export default function LineChart({ data }) {
  const [selectedCountries, setSelectedCountries] = useState(['United States', 'China', 'Japan']);

  const { countries, years } = useMemo(() => {
    if (!data?.length) return { countries: [], years: [] };
    const countrySet = new Set(data.map((d) => d['Country Name']));
    const yearSet = new Set(data.map((d) => d.Year));
    return {
      countries: [...countrySet].sort(),
      years: [...yearSet].sort((a, b) => a - b),
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.length || !years.length) return null;
    const labels = years.map(String);
    const datasets = selectedCountries
      .filter((c) => countries.includes(c))
      .map((country, i) => {
        const values = years.map(
          (y) => data.find((r) => r['Country Name'] === country && r.Year === y)?.GDP ?? null
        );
        return {
          label: country,
          data: values,
          borderColor: COLORS[i % COLORS.length],
          backgroundColor: COLORS[i % COLORS.length] + '20',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      });
    return { labels, datasets };
  }, [data, years, selectedCountries, countries]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e6edf3', usePointStyle: true },
        },
        tooltip: {
          backgroundColor: '#161b22',
          titleColor: '#e6edf3',
          bodyColor: '#8b949e',
          borderColor: '#30363d',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${formatGDP(ctx.raw)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: '#30363d' },
          ticks: { color: '#8b949e', maxRotation: 45 },
        },
        y: {
          grid: { color: '#30363d' },
          ticks: {
            color: '#8b949e',
            callback: (v) => formatGDP(v),
          },
        },
      },
    }),
    []
  );

  const toggleCountry = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  if (!data?.length) return <div className="chart-placeholder">Loading data…</div>;
  if (!chartData?.datasets?.length)
    return <div className="chart-placeholder">Select at least one country.</div>;

  return (
    <div className="chart-card">
      <h3>1. GDP Trend</h3>
      <p className="chart-desc">GDP over time. Select countries to compare.</p>
      <div className="country-select">
        {countries.slice(0, 14).map((c) => (
          <label key={c} className="country-check">
            <input
              type="checkbox"
              checked={selectedCountries.includes(c)}
              onChange={() => toggleCountry(c)}
            />
            <span>{c}</span>
          </label>
        ))}
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
