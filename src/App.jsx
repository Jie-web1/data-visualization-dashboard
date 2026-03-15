import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import ScatterPlot from './components/ScatterPlot';
import './App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const csvPath = `${import.meta.env.BASE_URL}data.csv`;
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (res.errors?.length) setError(res.errors[0].message);
        else setData(res.data || []);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Interactive Global Data Dashboard</h1>
        </header>
        <div className="loading">Loading data…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="header">
          <h1>Interactive Global Data Dashboard</h1>
        </header>
        <div className="error">Failed to load data: {error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Interactive Global Data Dashboard</h1>
        <p className="intro">
          This dashboard explores global economic and population trends using interactive data
          visualization. Data is derived from World Bank–style indicators (GDP, population, life
          expectancy).
        </p>
      </header>

      <main className="main">
        <section className="charts">
          <LineChart data={data} />
          <BarChart data={data} />
          <ScatterPlot data={data} />
        </section>

        <section className="insights">
          <h2>Insights</h2>
          <p>
            <strong>High GDP countries generally show higher life expectancy.</strong> The scatter
            plot illustrates the positive relationship between economic output and life expectancy
            at birth. Population rankings highlight the largest countries by population; combining
            these views helps compare economic size, demographic weight, and health outcomes across
            the world.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>
          Data: GDP from World Bank / datasets (e.g.&nbsp;
          <a
            href="https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv"
            target="_blank"
            rel="noopener noreferrer"
          >
            gdp.csv
          </a>
          ); population and life expectancy aligned with World Bank–style metrics.
        </p>
      </footer>
    </div>
  );
}
