# 仓库说明

本仓库包含两个独立项目，可分别运行。

---

## 1. 文件转换器 (File Converter)

图片转 PDF、图片格式/缩放、文本编码与换行符转换。支持 **Web 前端** 与命令行。

### 功能

- **img2pdf**：多张图片合并为一个 PDF（支持 PNG、JPG、GIF、BMP、TIFF、WebP）
- **图片转换**：格式转换（PNG/JPEG/WebP/BMP/TIFF）、按比例或最大宽高缩放
- **文本编码**：UTF-8、GBK 等编码互转
- **换行符**：LF ↔ CRLF 转换

### 环境与安装

- Python 3.8+
- `pip install -r requirements.txt`

### 运行方式

**Web 前端：**

```bash
python app.py
```

浏览器打开 http://127.0.0.1:5000 ，使用页面完成转换，结果直接下载。文件仅在本地临时处理。

**命令行：**

```bash
# 图片 → PDF
python run.py img2pdf 图1.png 图2.jpg -o out.pdf

# 图片格式/缩放
python run.py image photo.png -o photo.jpg --max-size 800x600

# 文本编码
python run.py encoding file.txt -o out.txt --from-encoding gbk --to-encoding utf-8

# 换行符
python run.py line-endings file.txt -o out.txt
python run.py line-endings file.txt -o out.txt --to-crlf
```

---

## 2. 数据可视化看板 (Data Visualization Dashboard)

基于 React 的交互式数据看板：全球经济与人口趋势图表与数据展示。

### 功能

- **GDP 趋势（折线图）**：多国 GDP 对比、悬停提示与国家选择
- **人口排名（柱状图）**：Top 15 国家、年份选择、排序与动画
- **GDP vs 预期寿命（散点图）**：关系探索与国家详情

### 技术栈

- 前端：React 18、Vite  
- 图表：Chart.js、react-chartjs-2  
- 数据：PapaParse (CSV)，World Bank 风格数据集  

### 运行方式

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。

### 部署到 GitHub Pages

1. 在 `package.json` 中把 `homepage` 改为你的 Pages 地址，例如：  
   `"homepage": "https://Jie-web1.github.io/data-visualization-dashboard"`

2. 部署：

```bash
npm run deploy
```

3. 仓库 **Settings → Pages → Source** 选择 **gh-pages** 分支。

---

## 项目结构概览

```
├── app.py              # 文件转换器 Web 服务
├── run.py              # 文件转换器 CLI
├── requirements.txt   # Python 依赖
├── templates/         # 文件转换器前端模板
├── static/            # 文件转换器静态资源 (CSS/JS)
├── index.html         # 数据看板 Vite 入口
├── package.json       # 数据看板依赖与脚本
├── vite.config.js    # Vite 配置
├── public/            # 数据看板静态资源 (如 data.csv)
└── src/               # 两项目共用目录
    ├── __init__.py
    ├── cli.py         # 文件转换器 CLI
    ├── converters/    # 文件转换器逻辑
    ├── App.jsx        # 数据看板主组件
    ├── index.jsx      # 数据看板入口
    └── components/    # 数据看板图表组件
```

## License

MIT
# image_to_PDF
