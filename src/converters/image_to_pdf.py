"""将多张图片合并为单个 PDF 文件。"""

from pathlib import Path
from typing import List, Union

import img2pdf


# Pillow 支持的图片格式
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".tif", ".webp"}


def _collect_image_paths(
    paths: List[Union[str, Path]], recursive: bool = False
) -> List[Path]:
    """从路径列表中收集所有图片文件路径，保持顺序。"""
    result: List[Path] = []
    seen = set()

    for p in paths:
        path = Path(p).resolve()
        if not path.exists():
            continue
        if path.is_file():
            if path.suffix.lower() in IMAGE_EXTENSIONS and path not in seen:
                result.append(path)
                seen.add(path)
        elif path.is_dir() and recursive:
            for ext in IMAGE_EXTENSIONS:
                for f in sorted(path.glob(f"*{ext}")):
                    if f.is_file() and f not in seen:
                        result.append(f)
                        seen.add(f)
    return result


def images_to_pdf(
    image_paths: List[Union[str, Path]],
    output_pdf: Union[str, Path],
    recursive: bool = False,
) -> Path:
    """
    将多张图片合并为一个 PDF。

    Args:
        image_paths: 图片文件路径或目录路径列表。
        output_pdf: 输出 PDF 路径。
        recursive: 若路径为目录，是否递归收集子目录中的图片。

    Returns:
        输出 PDF 的 Path。

    Raises:
        ValueError: 没有找到任何图片时。
    """
    collected = _collect_image_paths(image_paths, recursive=recursive)
    if not collected:
        raise ValueError("未找到任何支持的图片文件")

    out = Path(output_pdf).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    with open(out, "wb") as f:
        f.write(img2pdf.convert([str(p) for p in collected]))

    return out
