# Interactive Global Data Dashboard

基于 React 的交互式数据看板：全球经济与人口趋势图表与数据展示。

**GitHub 仓库：** https://github.com/Jie-web1/data-visualization-dashboard  
**在线访问（部署后）：** https://jie-web1.github.io/data-visualization-dashboard/

---

## 功能

- **GDP 趋势（折线图）**：多国 GDP 对比、悬停提示与国家选择
- **人口排名（柱状图）**：Top 15 国家、年份选择、排序与动画
- **GDP vs 预期寿命（散点图）**：关系探索与国家详情

## 技术栈

- 前端：React 18、Vite
- 图表：Chart.js、react-chartjs-2
- 数据：PapaParse (CSV)，World Bank 风格数据集

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。

## 部署到 GitHub Pages

1. `package.json` 中 `homepage` 已指向：`https://Jie-web1.github.io/data-visualization-dashboard`

2. 部署：

```bash
npm run deploy
```

3. 仓库 **Settings → Pages → Source** 选择 **gh-pages** 分支。

## 项目结构

```
├── index.html         # Vite 入口
├── package.json
├── vite.config.js
├── public/
│   └── data.csv
└── src/
    ├── App.jsx
    ├── index.jsx
    ├── App.css
    ├── index.css
    └── components/
        ├── LineChart.jsx
        ├── BarChart.jsx
        └── ScatterPlot.jsx
```

## License

MIT

---

*文件转换器（图片转 PDF 等）已拆分为独立仓库： [image_to_PDF](https://github.com/Jie-web1/image_to_PDF)*
