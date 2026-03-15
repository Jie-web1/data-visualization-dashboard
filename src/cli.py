"""命令行入口：图片转 PDF、图片转换、基础文件转换。"""

import argparse
from pathlib import Path

from .converters import (
    convert_image,
    convert_line_endings,
    convert_text_encoding,
    images_to_pdf,
)


def cmd_img2pdf(args: argparse.Namespace) -> None:
    paths = [Path(p) for p in args.input]
    out = Path(args.output)
    images_to_pdf(paths, out, recursive=args.recursive)
    print(f"已生成 PDF: {out}")


def cmd_image(args: argparse.Namespace) -> None:
    inp = Path(args.input)
    out = Path(args.output)
    kw = {}
    if args.max_size:
        w, h = map(int, args.max_size.split("x"))
        kw["max_size"] = (w, h)
    if args.scale is not None:
        kw["scale_factor"] = args.scale
    if args.format:
        kw["format_hint"] = args.format
    convert_image(inp, out, **kw)
    print(f"已保存: {out}")


def cmd_encoding(args: argparse.Namespace) -> None:
    convert_text_encoding(
        args.input,
        args.output,
        from_encoding=args.from_encoding,
        to_encoding=args.to_encoding,
    )
    print(f"已保存: {args.output}")


def cmd_line_endings(args: argparse.Namespace) -> None:
    convert_line_endings(
        args.input,
        args.output,
        to_lf=args.to_lf,
        encoding=args.encoding,
    )
    print(f"已保存: {args.output}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="文件转换器：图片转 PDF、图片格式/缩放、文本编码与换行符"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # img2pdf
    p_img2pdf = sub.add_parser("img2pdf", help="多张图片合并为一个 PDF")
    p_img2pdf.add_argument("input", nargs="+", help="图片文件或目录")
    p_img2pdf.add_argument("-o", "--output", required=True, help="输出 PDF 路径")
    p_img2pdf.add_argument("-r", "--recursive", action="store_true", help="目录内递归收集图片")
    p_img2pdf.set_defaults(func=cmd_img2pdf)

    # image 转换
    p_img = sub.add_parser("image", help="图片格式转换与缩放")
    p_img.add_argument("input", help="输入图片路径")
    p_img.add_argument("-o", "--output", required=True, help="输出图片路径")
    p_img.add_argument(
        "--max-size",
        metavar="WxH",
        help="最大宽高，如 800x600，保持比例",
    )
    p_img.add_argument("--scale", type=float, help="缩放比例，如 0.5")
    p_img.add_argument("-f", "--format", help="强制格式: png, jpg, webp, bmp, tiff")
    p_img.set_defaults(func=cmd_image)

    # 文本编码
    p_enc = sub.add_parser("encoding", help="文本文件编码转换")
    p_enc.add_argument("input", help="输入文件")
    p_enc.add_argument("-o", "--output", required=True, help="输出文件")
    p_enc.add_argument("--from-encoding", default="utf-8", help="源编码")
    p_enc.add_argument("--to-encoding", default="utf-8", help="目标编码")
    p_enc.set_defaults(func=cmd_encoding)

    # 换行符
    p_le = sub.add_parser("line-endings", help="换行符 LF/CRLF 转换")
    p_le.add_argument("input", help="输入文件")
    p_le.add_argument("-o", "--output", required=True, help="输出文件")
    p_le.add_argument("--to-crlf", action="store_true", help="转为 CRLF (默认转为 LF)")
    p_le.add_argument("--encoding", default="utf-8", help="文件编码")
    p_le.set_defaults(func=cmd_line_endings)

    args = parser.parse_args()
    if args.command == "line-endings":
        args.to_lf = not getattr(args, "to_crlf", False)
    args.func(args)


if __name__ == "__main__":
    main()
