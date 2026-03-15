"""Web 服务：文件转换器前端与 API。"""

import io
import os
import tempfile
from pathlib import Path

from flask import Flask, render_template, request, send_file, jsonify

# 确保从项目根加载 src
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.converters import (
    convert_image,
    convert_line_endings,
    convert_text_encoding,
    images_to_pdf,
)

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100MB

ALLOWED_IMAGE = {"png", "jpg", "jpeg", "gif", "bmp", "tiff", "tif", "webp"}


def allowed_image(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/img2pdf", methods=["POST"])
def api_img2pdf():
    files = request.files.getlist("images")
    if not files or not any(f.filename for f in files):
        return jsonify({"error": "请至少上传一张图片"}), 400
    paths = []
    tmpdir = tempfile.mkdtemp()
    try:
        for f in files:
            if not f.filename or not allowed_image(f.filename):
                continue
            path = Path(tmpdir) / f.filename
            f.save(path)
            paths.append(path)
        if not paths:
            return jsonify({"error": "没有有效的图片文件"}), 400
        out_path = Path(tmpdir) / "output.pdf"
        images_to_pdf(paths, out_path)
        return send_file(
            out_path,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="converted.pdf",
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        for p in paths:
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
        try:
            (Path(tmpdir) / "output.pdf").unlink(missing_ok=True)
        except Exception:
            pass
        try:
            os.rmdir(tmpdir)
        except Exception:
            pass


@app.route("/api/image", methods=["POST"])
def api_image():
    f = request.files.get("image")
    if not f or not f.filename:
        return jsonify({"error": "请上传一张图片"}), 400
    if not allowed_image(f.filename):
        return jsonify({"error": "不支持的图片格式"}), 400
    out_format = (request.form.get("format") or "png").strip().lower()
    if out_format not in {"png", "jpg", "jpeg", "webp", "bmp", "tiff", "tif"}:
        out_format = "png"
    max_size = request.form.get("max_size", "").strip()
    scale = request.form.get("scale", "").strip()
    tmpdir = tempfile.mkdtemp()
    try:
        inp = Path(tmpdir) / f.filename
        f.save(inp)
        out_path = Path(tmpdir) / f"out.{out_format}"
        kw = {"format_hint": out_format}
        if max_size and "x" in max_size:
            try:
                w, h = map(int, max_size.lower().split("x"))
                kw["max_size"] = (w, h)
            except ValueError:
                pass
        if scale:
            try:
                kw["scale_factor"] = float(scale)
            except ValueError:
                pass
        convert_image(inp, out_path, **kw)
        return send_file(
            out_path,
            mimetype=f"image/{out_format}" if out_format != "jpg" else "image/jpeg",
            as_attachment=True,
            download_name=f"converted.{out_format}",
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        for p in Path(tmpdir).iterdir():
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
        try:
            os.rmdir(tmpdir)
        except Exception:
            pass


@app.route("/api/encoding", methods=["POST"])
def api_encoding():
    f = request.files.get("file")
    if not f or not f.filename:
        return jsonify({"error": "请上传一个文件"}), 400
    from_enc = request.form.get("from_encoding", "utf-8") or "utf-8"
    to_enc = request.form.get("to_encoding", "utf-8") or "utf-8"
    tmpdir = tempfile.mkdtemp()
    try:
        inp = Path(tmpdir) / f.filename
        f.save(inp)
        out_path = Path(tmpdir) / ("out_" + f.filename)
        convert_text_encoding(inp, out_path, from_encoding=from_enc, to_encoding=to_enc)
        return send_file(
            out_path,
            as_attachment=True,
            download_name=f.filename,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        for p in Path(tmpdir).iterdir():
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
        try:
            os.rmdir(tmpdir)
        except Exception:
            pass


@app.route("/api/line-endings", methods=["POST"])
def api_line_endings():
    f = request.files.get("file")
    if not f or not f.filename:
        return jsonify({"error": "请上传一个文件"}), 400
    to_crlf = request.form.get("to_crlf") == "1"
    encoding = request.form.get("encoding", "utf-8") or "utf-8"
    tmpdir = tempfile.mkdtemp()
    try:
        inp = Path(tmpdir) / f.filename
        f.save(inp)
        out_path = Path(tmpdir) / ("out_" + f.filename)
        convert_line_endings(inp, out_path, to_lf=not to_crlf, encoding=encoding)
        return send_file(
            out_path,
            as_attachment=True,
            download_name=f.filename,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        for p in Path(tmpdir).iterdir():
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
        try:
            os.rmdir(tmpdir)
        except Exception:
            pass


if __name__ == "__main__":
    app.run(debug=True, port=5000)
