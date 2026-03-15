# 文件转换器 (File Converter)

图片转 PDF、图片格式/缩放、文本编码与换行符转换。支持 **Web 前端** 与命令行。

## 功能

- **img2pdf**：多张图片合并为一个 PDF（支持 PNG、JPG、GIF、BMP、TIFF、WebP）
- **图片转换**：格式转换（PNG/JPEG/WebP/BMP/TIFF）、按比例或最大宽高缩放
- **文本编码**：UTF-8、GBK 等编码互转
- **换行符**：LF ↔ CRLF 转换

## 环境要求

- Python 3.8+
- 依赖见 `requirements.txt`

## 安装

```bash
git clone https://github.com/YOUR_USERNAME/file-converter.git
cd file-converter
pip install -r requirements.txt
```

## Web 前端（本地运行）

```bash
python app.py
```

浏览器打开 http://127.0.0.1:5000 ，使用页面上的表单完成图片转 PDF、图片格式/缩放、编码与换行符转换，结果会直接下载。文件仅在本地临时处理，不会上传到外部。

## 命令行使用

### 图片转 PDF

```bash
# 多张图片 → 一个 PDF
python -m src.cli img2pdf image1.png image2.jpg -o output.pdf

# 指定目录，递归收集图片
python -m src.cli img2pdf ./photos -o album.pdf -r
```

### 图片转换

```bash
# 格式转换（由输出扩展名决定）
python -m src.cli image photo.png -o photo.jpg

# 指定最大尺寸（保持比例）
python -m src.cli image large.png -o small.png --max-size 800x600

# 按比例缩放
python -m src.cli image large.png -o half.png --scale 0.5

# 强制输出格式
python -m src.cli image input.bmp -o out.webp -f webp
```

### 文本编码转换

```bash
python -m src.cli encoding file.txt -o file_utf8.txt --from-encoding gbk --to-encoding utf-8
```

### 换行符转换

```bash
# 转为 LF (Unix)
python -m src.cli line-endings win.txt -o unix.txt

# 转为 CRLF (Windows)
python -m src.cli line-endings unix.txt -o win.txt --to-crlf
```

## 项目结构

```
file/
├── README.md
├── requirements.txt
├── app.py                  # Web 服务入口
├── run.py                  # CLI 入口
├── templates/
│   └── index.html         # 前端页面
├── static/
│   ├── style.css          # 样式
│   └── app.js             # 前端逻辑
└── src/
    ├── __init__.py
    ├── cli.py             # 命令行入口
    └── converters/
        ├── __init__.py
        ├── image_to_pdf.py
        ├── image_convert.py
        └── file_convert.py
```

## License

MIT
