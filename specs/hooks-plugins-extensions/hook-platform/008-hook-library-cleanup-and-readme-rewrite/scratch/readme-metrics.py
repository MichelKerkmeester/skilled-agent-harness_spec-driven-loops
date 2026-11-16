#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: README SENTENCE METRICS
# ───────────────────────────────────────────────────────────────

"""
Measure sentence and paragraph length in the prose of Markdown files.

Frontmatter, fenced blocks, headings, tables and HTML comments are left out.
Each bullet is its own unit. Inline code counts as one word.

Usage: python3 readme-metrics.py [--detail] <file-or-directory> [...]
Output: one PASS or FAIL line per file, a TOTAL line and a SUMMARY line.
        Exit 0 when every file passes, 1 when one fails, 2 on a bad path.

Options:
    --detail    Also print each sentence over the long-sentence limit and
                each prose paragraph over the paragraph limit.
"""

import argparse
import re
import statistics
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

MEDIAN_WORDS_MAX = 14
LONG_SENTENCE_WORDS = 30
LONG_SENTENCE_SHARE_MAX = 0.03
PARAGRAPH_WORDS_MAX = 80
README_NAME = "README.md"
SKIPPED_DIRECTORY = "node_modules"

FENCE = re.compile(r"^\s*(```|~~~)")
HEADING = re.compile(r"^\s{0,3}#{1,6}\s")
TABLE_ROW = re.compile(r"^\s*\|")
RULE = re.compile(r"^\s*([-*_])(\s*\1){2,}\s*$")
BULLET = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+(.*)$")
QUOTE = re.compile(r"^\s*>\s?")
HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)
INLINE_CODE = re.compile(r"`[^`\n]+`")
IMAGE_OR_LINK = re.compile(r"!?\[([^\]]*)\]\([^)]*\)")
BARE_URL = re.compile(r"https?://\S+")
SENTENCE_END = re.compile(r"(?<=[.!?])\s+")
WORD_CHARACTER = re.compile(r"[A-Za-z0-9]")

# ───────────────────────────────────────────────────────────────
# 2. PARSING
# ───────────────────────────────────────────────────────────────


def strip_frontmatter(text: str) -> str:
    """Return the text without a leading YAML frontmatter block."""
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---", 4)
    if end == -1:
        return text
    newline = text.find("\n", end + 1)
    return "" if newline == -1 else text[newline + 1:]


def collect_units(text: str) -> List[Tuple[str, str]]:
    """
    Split Markdown into prose units.

    Args:
        text: The file content without frontmatter

    Returns:
        List of (kind, text) pairs, where kind is "prose" or "bullet"
    """
    units: List[Tuple[str, List[str]]] = []
    current: List[str] = []
    kind = "prose"
    in_fence = False

    def close() -> None:
        nonlocal current, kind
        if current:
            units.append((kind, current))
        current = []
        kind = "prose"

    for line in HTML_COMMENT.sub("", text).splitlines():
        if FENCE.match(line):
            in_fence = not in_fence
            close()
            continue
        if in_fence:
            continue
        if not line.strip() or HEADING.match(line) or TABLE_ROW.match(line) or RULE.match(line):
            close()
            continue
        bullet = BULLET.match(line)
        if bullet:
            close()
            kind = "bullet"
            current = [bullet.group(1)]
            continue
        current.append(QUOTE.sub("", line).strip())

    close()
    return [(unit_kind, " ".join(lines)) for unit_kind, lines in units]


def plain_text(text: str) -> str:
    """Reduce inline Markdown to words, with inline code as one token."""
    text = INLINE_CODE.sub("CODE", text)
    text = IMAGE_OR_LINK.sub(r"\1", text)
    text = BARE_URL.sub("URL", text)
    # A full stop inside these two abbreviations does not end a sentence.
    text = text.replace("e.g.", "eg").replace("i.e.", "ie")
    return text.replace("*", "")


def count_words(text: str) -> int:
    """Count the whitespace-separated tokens that hold a letter or a digit."""
    return sum(1 for token in text.split() if WORD_CHARACTER.search(token))


def split_sentences(text: str) -> List[str]:
    """Split plain text on sentence ends and drop pieces with no word."""
    return [piece for piece in SENTENCE_END.split(text) if count_words(piece)]


# ───────────────────────────────────────────────────────────────
# 3. MEASUREMENT
# ───────────────────────────────────────────────────────────────


def measure(path: Path) -> Dict[str, object]:
    """
    Measure one Markdown file.

    Args:
        path: The file to read

    Returns:
        Dict with the sentence lengths, the long sentences and the long paragraphs
    """
    text = strip_frontmatter(path.read_text(encoding="utf-8"))
    lengths: List[int] = []
    long_sentences: List[Tuple[int, str]] = []
    long_paragraphs: List[Tuple[int, str]] = []
    words = 0

    for kind, raw in collect_units(text):
        unit = plain_text(raw)
        unit_words = count_words(unit)
        words += unit_words
        if kind == "prose" and unit_words > PARAGRAPH_WORDS_MAX:
            long_paragraphs.append((unit_words, unit))
        for sentence in split_sentences(unit):
            length = count_words(sentence)
            lengths.append(length)
            if length > LONG_SENTENCE_WORDS:
                long_sentences.append((length, sentence))

    return {
        "lengths": lengths,
        "long_sentences": long_sentences,
        "long_paragraphs": long_paragraphs,
        "words": words,
    }


def passes(lengths: List[int], long_count: int, paragraph_count: int) -> bool:
    """Apply the three limits. A file with no prose sentence passes."""
    if not lengths:
        return True
    if statistics.median(lengths) > MEDIAN_WORDS_MAX:
        return False
    if long_count / len(lengths) > LONG_SENTENCE_SHARE_MAX:
        return False
    return paragraph_count == 0


def describe(lengths: List[int], long_count: int, paragraph_count: int) -> str:
    """Format the counts of one file, or of all files together."""
    if not lengths:
        return "sentences=0 median=0 over30=0 (0.0%) max=0 para_over80=0"
    share = 100 * long_count / len(lengths)
    return (
        f"sentences={len(lengths)} median={statistics.median(lengths):g} "
        f"over30={long_count} ({share:.1f}%) max={max(lengths)} para_over80={paragraph_count}"
    )


def expand(arguments: List[str]) -> Tuple[List[Path], List[str]]:
    """
    Turn the path arguments into a list of files.

    Args:
        arguments: Files, or directories to search for README files

    Returns:
        Tuple of (files, arguments that are neither a file nor a directory)
    """
    files: List[Path] = []
    missing: List[str] = []
    for argument in arguments:
        path = Path(argument)
        if path.is_dir():
            files.extend(
                sorted(p for p in path.rglob(README_NAME) if SKIPPED_DIRECTORY not in p.parts)
            )
        elif path.is_file():
            files.append(path)
        else:
            missing.append(argument)
    return files, missing


# ───────────────────────────────────────────────────────────────
# 4. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Measure every file named on the command line and print the verdicts."""
    parser = argparse.ArgumentParser(description="Sentence and paragraph length of Markdown prose.")
    parser.add_argument("paths", nargs="+", help="Markdown files, or directories holding README.md files")
    parser.add_argument("--detail", action="store_true", help="print each long sentence and paragraph")
    options = parser.parse_args()

    files, missing = expand(options.paths)
    if missing or not files:
        print(f"Error: no file to measure at: {', '.join(missing) or 'the given paths'}", file=sys.stderr)
        return 2

    all_lengths: List[int] = []
    all_long = 0
    all_paragraphs = 0
    all_words = 0
    failed = 0

    for path in files:
        result = measure(path)
        lengths = result["lengths"]
        long_sentences = result["long_sentences"]
        long_paragraphs = result["long_paragraphs"]
        verdict = "PASS" if passes(lengths, len(long_sentences), len(long_paragraphs)) else "FAIL"
        failed += verdict == "FAIL"
        print(f"{verdict} {path}: {describe(lengths, len(long_sentences), len(long_paragraphs))}")
        if options.detail:
            for length, sentence in long_sentences:
                print(f"  SENTENCE {length} words: {sentence[:110]}")
            for length, paragraph in long_paragraphs:
                print(f"  PARAGRAPH {length} words: {paragraph[:110]}")
        all_lengths.extend(lengths)
        all_long += len(long_sentences)
        all_paragraphs += len(long_paragraphs)
        all_words += result["words"]

    print(f"TOTAL {describe(all_lengths, all_long, all_paragraphs)} prose_words={all_words}")
    print(f"SUMMARY files={len(files)} pass={len(files) - failed} fail={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
