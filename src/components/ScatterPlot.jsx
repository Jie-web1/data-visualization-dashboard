import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Filler);

function formatGDP(value) {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value?.toFixed(0) ?? 0}`;
}

export default function ScatterPlot({ data }) {
  const latestYear = useMemo(() => {
    if (!data?.length) return 2022;
    return Math.max(...data.map((d) => d.Year));
  }, [data]);

  const scatterData = useMemo(() => {
    if (!data?.length) return null;
    const byCountry = {};
    data.forEach((row) => {
      if (row.Year !== latestYear) return;
      const name = row['Country Name'];
      const gdp = Number(row.GDP);
      const life = Number(row.LifeExpectancy);
      if (!name || isNaN(gdp) || isNaN(life)) return;
      byCountry[name] = { x: gdp, y: life, country: name, gdp, life };
    });
    const points = Object.values(byCountry).filter((p) => p.y > 0 && p.x > 0);
    return {
      datasets: [
        {
          label: `GDP vs Life Expectancy (${latestYear})`,
          data: points,
          backgroundColor: 'rgba(88, 166, 255, 0.6)',
          borderColor: '#58a6ff',
          borderWidth: 1,
          pointRadius: 8,
          pointHoverRadius: 12,
          pointHoverBackgroundColor: '#58a6ff',
        },
      ],
    };
  }, [data, latestYear]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
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
            title: (items) => items[0]?.raw?.country ?? '',
            label: (ctx) => {
              const r = ctx.raw;
              return [
                `GDP: ${formatGDP(r.gdp ?? r.x)}`,
                `Life expectancy: ${(r.life ?? r.y)?.toFixed(1)} years`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'GDP (USD)', color: '#8b949e' },
          grid: { color: '#30363d' },
          ticks: {
            color: '#8b949e',
            callback: (v) => formatGDP(v),
          },
        },
        y: {
          title: { display: true, text: 'Life Expectancy (years)', color: '#8b949e' },
          grid: { color: '#30363d' },
          ticks: { color: '#8b949e' },
        },
      },
    }),
    []
  );

  if (!data?.length) return <div className="chart-placeholder">Loading data…</div>;
  if (!scatterData?.datasets?.[0]?.data?.length)
    return <div className="chart-placeholder">No data for scatter.</div>;

  return (
    <div className="chart-card">
      <h3>3. GDP vs Life Expectancy</h3>
      <p className="chart-desc">
        Relationship between GDP and life expectancy by country. Hover for details.
      </p>
      <div className="chart-container">
        <Scatter data={scatterData} options={options} />
      </div>
    </div>
  );
}
