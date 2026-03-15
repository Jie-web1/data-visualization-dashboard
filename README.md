# Interactive Global Data Dashboard

A React-based interactive data visualization dashboard that explores **global economic and population trends** using charts and data storytelling.

## Features

- **GDP Trend (Line Chart)** — Compare GDP over time across countries with hover tooltips and selectable countries.
- **Population Ranking (Bar Chart)** — Top 15 countries by population with dynamic year selection, sorting (asc/desc), and smooth animations.
- **GDP vs Life Expectancy (Scatter Plot)** — Explore the relationship between GDP and life expectancy; hover to see country details.

## Tech Stack

- **Front-end:** React 18, Vite
- **Charts:** Chart.js, react-chartjs-2
- **Data:** PapaParse (CSV), World Bank–style dataset (GDP, Population, Life Expectancy)
- **Deploy:** GitHub Pages

## Data Source

- GDP data aligned with [World Bank / datasets GDP](https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv).
- Population and life expectancy aligned with World Bank–style indicators for the same countries and years.

The bundled `public/data.csv` contains combined columns: `Country Name`, `Country Code`, `Year`, `GDP`, `Population`, `LifeExpectancy`.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & Deploy to GitHub Pages

1. In `package.json`, set `homepage` to your repo’s GitHub Pages URL, e.g.  
   `"homepage": "https://<your-username>.github.io/data-visualization-dashboard"`

2. In `vite.config.js`, `base` is already set to `'/data-visualization-dashboard/'` for project pages.

3. Deploy:

```bash
npm run deploy
```

4. In the repo: **Settings → Pages → Source** → choose **gh-pages** branch.

## Project Structure

```
data-visualization-dashboard/
├── public/
│   └── data.csv
├── src/
│   ├── components/
│   │   ├── LineChart.js
│   │   ├── BarChart.js
│   │   └── ScatterPlot.js
│   ├── App.js
│   ├── App.css
│   ├── index.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Insights

High GDP countries generally show higher life expectancy. The scatter plot and line chart help compare economic size, demographic weight, and health outcomes across the world.
