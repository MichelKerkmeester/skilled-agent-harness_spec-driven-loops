#!/usr/bin/env python3
"""Prose census and fact extraction for the v4 release notes.

The census counts paragraphs that carry more than four sentences or more than
500 characters. The document writes one paragraph per line, so a paragraph is
a prose line: not a heading, list item, table row, quote, fence or frontmatter
key.

The extraction pulls the fact-bearing tokens a rewrite must preserve and
groups them, so a diff can name exactly what moved instead of asserting that
nothing did.

Usage:
    changelog-prose-audit.py census <file>
    changelog-prose-audit.py extract <file> [--out <json>]
    changelog-prose-audit.py diff <before.json> <after.json>
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter

FRONTMATTER_PREFIXES = (
    "title:",
    "description:",
    "trigger_phrases:",
    "importance_tier:",
    "contextType:",
    "_memory:",
)

NUMBER_WORDS = (
    "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|"
    "fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|"
    "fifty|sixty|seventy|eighty|ninety|hundred|thousand"
)


def prose_lines(text: str):
    for number, line in enumerate(text.split("\n"), 1):
        stripped = line.strip()
        if not stripped:
            continue
        if stripped[0] in "#|>":
            continue
        if stripped.startswith("```"):
            continue
        if stripped.startswith("- ") or stripped.startswith("<!--"):
            continue
        if set(stripped) <= set("-="):
            continue
        if stripped.startswith(FRONTMATTER_PREFIXES) or stripped.startswith('- "'):
            continue
        yield number, stripped


def count_sentences(line: str) -> int:
    return len([part for part in re.split(r"(?<=[.!?])\s+", line) if part])


def census(text: str):
    walls = []
    for number, line in prose_lines(text):
        sentences = count_sentences(line)
        if sentences > 4 or len(line) > 500:
            walls.append({"line": number, "sentences": sentences, "chars": len(line)})
    return walls


def extract(text: str):
    lines = text.split("\n")
    return {
        "backticks": Counter(re.findall(r"`([^`\n]+)`", text)),
        "hex": Counter(re.findall(r"\b[0-9a-f]{7,}\b", text)),
        "numerals": Counter(re.findall(r"\d+(?:[.,]\d+)*", text)),
        "number_words": Counter(
            word.lower() for word in re.findall(r"\b(?:" + NUMBER_WORDS + r")\b", text, re.I)
        ),
        "headings": Counter(line for line in lines if line.startswith("#")),
        "table_rows": Counter(line for line in lines if line.startswith("|")),
    }


def as_json(counter: Counter) -> list:
    return [[key, count] for key, count in sorted(counter.items())]


def diff(before: dict, after: dict) -> int:
    changed = 0
    for category in sorted(set(before) | set(after)):
        left = Counter(before.get(category, {}))
        right = Counter(after.get(category, {}))
        added = right - left
        removed = left - right
        if not added and not removed:
            print(f"== {category}: identical")
            continue
        changed += 1
        print(f"== {category}: {sum(removed.values())} removed, {sum(added.values())} added")
        for token, count in sorted(removed.items()):
            print(f"   - ({count}x) {token}")
        for token, count in sorted(added.items()):
            print(f"   + ({count}x) {token}")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("census", "extract", "diff"))
    parser.add_argument("target")
    parser.add_argument("other", nargs="?")
    parser.add_argument("--out")
    args = parser.parse_args()

    if args.command == "census":
        walls = census(open(args.target, encoding="utf-8").read())
        for wall in walls:
            print(f"line {wall['line']:>4}  sentences={wall['sentences']:>2}  chars={wall['chars']:>5}")
        print(f"walls: {len(walls)}")
        return 0

    if args.command == "extract":
        data = extract(open(args.target, encoding="utf-8").read())
        payload = {category: as_json(counter) for category, counter in data.items()}
        if args.out:
            with open(args.out, "w", encoding="utf-8") as handle:
                json.dump(payload, handle, indent=2)
                handle.write("\n")
        total = sum(len(counter) for counter in data.values())
        print(f"extracted {total} distinct tokens over {len(data)} categories")
        return 0

    before = {k: dict(v) for k, v in json.load(open(args.target, encoding="utf-8")).items()}
    after = {k: dict(v) for k, v in json.load(open(args.other, encoding="utf-8")).items()}
    changed = diff(before, after)
    print(f"categories with differences: {changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
