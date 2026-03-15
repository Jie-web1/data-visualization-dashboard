"""基础文件转换：文本编码、换行符。"""

from pathlib import Path
from typing import Union

# 常见编码
ENCODINGS = ("utf-8", "utf-8-sig", "gbk", "gb2312", "latin-1", "cp1252")


def convert_text_encoding(
    input_path: Union[str, Path],
    output_path: Union[str, Path],
    from_encoding: str = "utf-8",
    to_encoding: str = "utf-8",
) -> Path:
    """
    转换文本文件的编码。

    Args:
        input_path: 输入文件路径。
        output_path: 输出文件路径。
        from_encoding: 源编码。
        to_encoding: 目标编码。

    Returns:
        输出文件的 Path。
    """
    inp = Path(input_path).resolve()
    out = Path(output_path).resolve()

    if not inp.is_file():
        raise FileNotFoundError(f"输入文件不存在: {inp}")

    out.parent.mkdir(parents=True, exist_ok=True)
    data = inp.read_bytes()
    text = data.decode(from_encoding)
    out.write_text(text, encoding=to_encoding)
    return out


def convert_line_endings(
    input_path: Union[str, Path],
    output_path: Union[str, Path],
    to_lf: bool = True,
    encoding: str = "utf-8",
) -> Path:
    """
    转换换行符为 LF (Unix) 或 CRLF (Windows)。

    Args:
        input_path: 输入文件路径。
        output_path: 输出文件路径。
        to_lf: True 转为 \\n (LF)，False 转为 \\r\\n (CRLF)。
        encoding: 文件编码。

    Returns:
        输出文件的 Path。
    """
    inp = Path(input_path).resolve()
    out = Path(output_path).resolve()

    if not inp.is_file():
        raise FileNotFoundError(f"输入文件不存在: {inp}")

    out.parent.mkdir(parents=True, exist_ok=True)
    text = inp.read_text(encoding=encoding)
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    newline = "\n" if to_lf else "\r\n"
    out.write_text(normalized.replace("\n", newline), encoding=encoding)
    return out
