"""图片格式转换与基础处理（缩放、格式转换）。"""

from pathlib import Path
from typing import Optional, Tuple, Union

from PIL import Image


# 输出格式与 Pillow 保存参数
OUTPUT_FORMATS = {
    "png": {"format": "PNG"},
    "jpg": {"format": "JPEG", "quality": 95},
    "jpeg": {"format": "JPEG", "quality": 95},
    "webp": {"format": "WEBP", "quality": 90},
    "bmp": {"format": "BMP"},
    "tiff": {"format": "TIFF"},
    "tif": {"format": "TIFF"},
}


def convert_image(
    input_path: Union[str, Path],
    output_path: Union[str, Path],
    *,
    max_size: Optional[Tuple[int, int]] = None,
    scale_factor: Optional[float] = None,
    format_hint: Optional[str] = None,
) -> Path:
    """
    转换图片格式并可选的缩放。

    Args:
        input_path: 输入图片路径。
        output_path: 输出图片路径。
        max_size: 可选，(宽, 高) 最大尺寸，保持比例缩放。
        scale_factor: 可选，缩放比例，如 0.5 表示缩小一半。
        format_hint: 可选，强制格式（如 'png','jpg'），否则由 output_path 后缀决定。

    Returns:
        输出文件的 Path。
    """
    inp = Path(input_path).resolve()
    out = Path(output_path).resolve()

    if not inp.is_file():
        raise FileNotFoundError(f"输入文件不存在: {inp}")

    out.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(inp).convert("RGB" if out.suffix.lower() in (".jpg", ".jpeg") else "RGBA")

    if max_size:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
    elif scale_factor is not None and scale_factor != 1.0:
        w, h = img.size
        new_size = (int(w * scale_factor), int(h * scale_factor))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    fmt = (format_hint or out.suffix.lstrip(".")).lower()
    save_kw = OUTPUT_FORMATS.get(fmt, {"format": "PNG"})
    img.save(out, **save_kw)

    return out
