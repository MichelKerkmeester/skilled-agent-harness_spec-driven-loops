#!/usr/bin/env python3
"""Generate the Remote for OpenCode mark.

The letterforms sit on the same modular grid OpenCode's own wordmark uses:
every glyph is a 4-wide x 5-tall arrangement of square cells, no curves, no
diagonals. That grid is what gives their logotype its analog-clock/segment-
display character, and building on it is how this mark reads as a sibling
rather than an imitation.

    OC
    RM

Two rows, two letters each — OpenCode above, ReMote below — one blank cell
between letters and between rows. Everything below is expressed in grid
cells; the pixel size of a cell is the only scaling knob.

Usage:
    python3 generate.py out.png --size 1024
    python3 generate.py out.svg
"""

import argparse
import subprocess
import sys
from pathlib import Path

# Glyphs on a 4x5 grid. '#' is an inked cell. Forms match RemoteKit's
# Glyphs table — M's twin peaks become a filled second row, the grid's
# concession at four cells wide.
GLYPHS = {
    "O": ["####", "#..#", "#..#", "#..#", "####"],
    "P": ["####", "#..#", "####", "#...", "#..."],
    "E": ["####", "#...", "####", "#...", "####"],
    "N": ["#..#", "##.#", "#.##", "#..#", "#..#"],
    "C": ["####", "#...", "#...", "#...", "####"],
    "D": ["###.", "#..#", "#..#", "#..#", "###."],
    "F": ["####", "#...", "####", "#...", "#..."],
    "R": ["####", "#..#", "####", "#.#.", "#..#"],
    "M": ["#..#", "####", "#..#", "#..#", "#..#"],
    "T": ["####", ".#..", ".#..", ".#..", ".#.."],
}

ROWS = [["O", "C"], ["R", "M"]]

# The README/banner lockup: the product name in primary ink over its
# qualifier in the quieter tone — the same two-tone split as the icon.
BANNER_ROWS = ["REMOTE", "FOR OPENCODE"]

GLYPH_W, GLYPH_H = 4, 5
GAP = 1              # between letters, and between the two rows
PAD = 2              # margin around the mark, in cells

# Between OpenCode's greyscale wordmark and Anthropic's warm restraint: a
# near-white ink on a deep warm-neutral ground, with the second row dropped
# to a quieter tone the way "open"/"code" are split in their logotype.
INK_PRIMARY = "#F4F0EC"
INK_SECONDARY = "#B8AFA6"
GROUND = "#1A1815"


def layout():
    """Yield (col, row, glyph_index) for every inked cell, plus the extent."""
    cells = []
    width = GLYPH_W * 2 + GAP
    for row_index, row in enumerate(ROWS):
        y0 = row_index * (GLYPH_H + GAP)
        for letter_index, letter in enumerate(row):
            x0 = letter_index * (GLYPH_W + GAP)
            for dy, line in enumerate(GLYPHS[letter]):
                for dx, char in enumerate(line):
                    if char == "#":
                        cells.append((x0 + dx, y0 + dy, row_index))
    height = GLYPH_H * 2 + GAP
    return cells, width, height


def text_width(text):
    """Width in cells of a line of lettering, gaps included."""
    total = 0
    for index, char in enumerate(text):
        if index:
            total += GAP
        total += GAP + 2 if char == " " else GLYPH_W
    return total


def text_cells(text):
    """Every inked cell of a line as (col, row)."""
    cells = []
    x = 0
    for index, char in enumerate(text):
        if index:
            x += GAP
        glyph = GLYPHS.get(char)
        if glyph is None:
            x += GAP + 2  # space
            continue
        for dy, line in enumerate(glyph):
            for dx, mark in enumerate(line):
                if mark == "#":
                    cells.append((x + dx, dy))
        x += GLYPH_W
    return cells


def banner_svg(cell_px=20):
    """The wide README lockup: each BANNER_ROWS line centred, two cells of
    air between rows. Row 0 takes the primary ink, the rest the quieter
    tone — the icon's vertical split restated at banner proportions."""
    row_gap = 2
    pad_x, pad_y = 6, 4
    widths = [text_width(line) for line in BANNER_ROWS]
    block_w = max(widths)
    canvas_w = (block_w + pad_x * 2) * cell_px
    rows_h = len(BANNER_ROWS) * GLYPH_H + (len(BANNER_ROWS) - 1) * row_gap
    canvas_h = (rows_h + pad_y * 2) * cell_px

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{canvas_w}" '
        f'height="{canvas_h}" viewBox="0 0 {canvas_w} {canvas_h}" '
        'shape-rendering="crispEdges">',
        f'<rect width="{canvas_w}" height="{canvas_h}" fill="{GROUND}"/>',
    ]
    for row_index, line in enumerate(BANNER_ROWS):
        fill = INK_PRIMARY if row_index == 0 else INK_SECONDARY
        offset_x = (pad_x + (block_w - widths[row_index]) / 2) * cell_px
        offset_y = (pad_y + row_index * (GLYPH_H + row_gap)) * cell_px
        for col, row in text_cells(line):
            parts.append(
                f'<rect x="{offset_x + col * cell_px}" y="{offset_y + row * cell_px}" '
                f'width="{cell_px}" height="{cell_px}" fill="{fill}"/>'
            )
    parts.append("</svg>")
    return "\n".join(parts)


def to_svg(cell_px=64, square=True):
    """The mark as SVG. Square by default — an app icon's canvas is fixed,
    and the grid must be centred in it rather than distorted to fill it."""
    cells, width, height = layout()
    span = max(width, height) if square else width
    canvas_w = (span + PAD * 2) * cell_px
    canvas_h = ((max(width, height) if square else height) + PAD * 2) * cell_px
    # Centre the glyph block on whichever axis has slack.
    offset_x = ((span - width) / 2 + PAD) * cell_px
    offset_y = (((max(width, height) if square else height) - height) / 2 + PAD) * cell_px

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{canvas_w}" '
        f'height="{canvas_h}" viewBox="0 0 {canvas_w} {canvas_h}" '
        # Without this, adjacent cells anti-alias against each other and
        # the solid strokes show hairline seams.
        'shape-rendering="crispEdges">',
        f'<rect width="{canvas_w}" height="{canvas_h}" fill="{GROUND}"/>',
    ]
    for col, row, row_index in cells:
        x = offset_x + col * cell_px
        y = offset_y + row * cell_px
        fill = INK_PRIMARY if row_index == 0 else INK_SECONDARY
        parts.append(
            f'<rect x="{x}" y="{y}" width="{cell_px}" height="{cell_px}" fill="{fill}"/>'
        )
    parts.append("</svg>")
    return "\n".join(parts)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("out", type=Path)
    parser.add_argument("--size", type=int, default=1024,
                        help="output width in px (png only)")
    parser.add_argument("--banner", action="store_true",
                        help="render the wide BANNER_ROWS lockup instead of the icon")
    args = parser.parse_args()

    if args.banner:
        cell_px = max(1, args.size // (max(text_width(l) for l in BANNER_ROWS) + 12))
        svg = banner_svg(cell_px)
    else:
        _, width, height = layout()
        cell_px = max(1, args.size // (max(width, height) + PAD * 2))
        svg = to_svg(cell_px)

    if args.out.suffix == ".svg":
        args.out.write_text(svg)
        print(f"wrote {args.out}")
        return

    tmp = args.out.with_suffix(".tmp.svg")
    tmp.write_text(svg)
    # qlmanage is always present on macOS; no extra dependency for a mark
    # that is regenerated approximately never.
    subprocess.run(
        ["qlmanage", "-t", "-s", str(args.size), "-o", str(args.out.parent), str(tmp)],
        check=True, capture_output=True,
    )
    rendered = args.out.parent / f"{tmp.name}.png"
    if not rendered.exists():
        sys.exit("render failed")
    rendered.replace(args.out)
    tmp.unlink()
    print(f"wrote {args.out}")


if __name__ == "__main__":
    main()
