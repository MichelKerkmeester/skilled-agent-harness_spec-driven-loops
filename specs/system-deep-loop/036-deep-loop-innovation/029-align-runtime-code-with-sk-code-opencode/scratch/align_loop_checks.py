#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ALIGNMENT LOOP CHECKS
# ───────────────────────────────────────────────────────────────

"""Target listing and edit verification for the runtime alignment loop.

Usage:
    align_loop_checks.py targets <worktree> <runtime-root> <mode>
    align_loop_checks.py comment-only <before-file> <after-file>
    align_loop_checks.py has-header <file>

Output:
    targets       one repo-relative path per line
    comment-only  exit 0 when the two files differ only in comments and
                  whitespace, exit 1 with a reason otherwise
    has-header    exit 0 when a MODULE:/COMPONENT: marker sits in the first 40 lines
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from typing import List, Set


JS_TS_EXTENSIONS = (".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs")
EXCLUDED_PARTS = {"node_modules", "dist", ".git"}
HEADER_RE = re.compile(r"\b(?:MODULE|COMPONENT):")
# A comment that changes what the compiler or linter does is not a neutral edit.
DIRECTIVE_RE = re.compile(r"@ts-|eslint-disable|eslint-enable|istanbul ignore|c8 ignore|prettier-ignore|/\s*<reference")
CHECKER = ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
MODE_RULES = {
    "sections": ("--check-sections", ("SECTIONS-MISSING", "SECTIONS-DIVIDER-SHAPE", "SECTIONS-MIXED-FORMAT")),
    "readme": ("--check-folders", ("FOLDER-README-MISSING",)),
}
FINDING_RE = re.compile(r"^- (?P<path>.+?):\d+ \[(?P<rule>[A-Z-]+)\]")


def tracked_files(worktree: str, runtime_root: str) -> List[str]:
    completed = subprocess.run(
        ["git", "-C", worktree, "ls-files", "--", runtime_root],
        capture_output=True,
        text=True,
        check=True,
    )
    return [line for line in completed.stdout.splitlines() if line]


def header_targets(worktree: str, runtime_root: str) -> List[str]:
    targets: List[str] = []
    for rel in tracked_files(worktree, runtime_root):
        if not rel.endswith(JS_TS_EXTENSIONS) or rel.endswith(".d.ts"):
            continue
        if EXCLUDED_PARTS & set(rel.split("/")):
            continue
        path = os.path.join(worktree, rel)
        if not os.path.isfile(path) or os.path.islink(path):
            continue
        with open(path, encoding="utf-8", errors="replace") as handle:
            head = "".join(handle.readline() for _ in range(40))
        if not HEADER_RE.search(head):
            targets.append(rel)
    return targets


def checker_targets(worktree: str, runtime_root: str, mode: str) -> List[str]:
    flag, rules = MODE_RULES[mode]
    completed = subprocess.run(
        [sys.executable, CHECKER, "--root", runtime_root, flag],
        cwd=worktree,
        capture_output=True,
        text=True,
        check=False,
    )
    seen: Set[str] = set()
    targets: List[str] = []
    for line in completed.stdout.splitlines():
        match = FINDING_RE.match(line)
        if not match or match.group("rule") not in rules:
            continue
        rel = os.path.relpath(os.path.join(worktree, match.group("path")), worktree)
        # The checker resolves symlinks, so a linked file can report its real home
        # outside this runtime; editing it here would reach another package.
        if not (rel + "/").startswith(runtime_root.rstrip("/") + "/"):
            continue
        if rel not in seen:
            seen.add(rel)
            targets.append(rel)
    return targets


def strip_js_comments(content: str) -> str:
    """Remove comments and all whitespace, keeping string contents intact.

    Deterministic on both sides of a comparison, so a misread regex literal makes
    the two sides differ and the edit is rejected: the safe direction.
    """
    out: List[str] = []
    i, length = 0, len(content)
    quote = ""
    last_significant = ""
    while i < length:
        char = content[i]
        nxt = content[i + 1] if i + 1 < length else ""
        if quote:
            out.append(char)
            if char == "\\" and nxt:
                out.append(nxt)
                i += 2
                continue
            if char == quote:
                quote = ""
            i += 1
            continue
        if char in "'\"`":
            quote = char
            out.append(char)
            i += 1
            continue
        if char == "/" and nxt == "/":
            end = content.find("\n", i)
            i = length if end == -1 else end
            continue
        if char == "/" and nxt == "*":
            end = content.find("*/", i + 2)
            if end == -1:
                return "\0UNCLOSED-BLOCK-COMMENT"
            i = end + 2
            continue
        # A slash after an operator, an opening bracket or a keyword starts a regex
        # literal, whose quotes and slashes must not be read as strings or comments.
        if char == "/" and (last_significant in REGEX_PRECEDERS or preceded_by_keyword(out)):
            end = regex_end(content, i)
            if end != -1:
                out.append(content[i:end])
                last_significant = "/"
                i = end
                continue
        if not char.isspace():
            out.append(char)
            last_significant = char
        i += 1
    return "".join(out)


REGEX_PRECEDERS = set("(,=:[!&|?{};+-*%<>~^") | {""}
REGEX_KEYWORD_RE = re.compile(r"(?:^|[^\w$])(?:return|typeof|case|in|of|delete|void|throw|new|else)$")


def preceded_by_keyword(out: List[str]) -> bool:
    # `out` has whitespace removed, so `return /x/` arrives as "...;return"; the
    # boundary check keeps an identifier such as `margin` from reading as `in`.
    return bool(REGEX_KEYWORD_RE.search("".join(out[-12:])))


def regex_end(content: str, start: int) -> int:
    """Index just past a regex literal's flags, or -1 when the line has no closing slash."""
    i, in_class = start + 1, False
    while i < len(content):
        char = content[i]
        if char == "\n":
            return -1
        if char == "\\":
            i += 2
            continue
        if char == "[":
            in_class = True
        elif char == "]":
            in_class = False
        elif char == "/" and not in_class:
            i += 1
            while i < len(content) and content[i].isalpha():
                i += 1
            return i
        i += 1
    return -1


def added_comment_lines(before: str, after: str) -> List[str]:
    before_lines = set(before.splitlines())
    return [line for line in after.splitlines() if line not in before_lines]


def comment_only(before_path: str, after_path: str) -> int:
    with open(before_path, encoding="utf-8", errors="replace") as handle:
        before = handle.read()
    with open(after_path, encoding="utf-8", errors="replace") as handle:
        after = handle.read()
    if before == after:
        print("no change")
        return 1
    if strip_js_comments(before) != strip_js_comments(after):
        print("code changed, not only comments")
        return 1
    for line in added_comment_lines(before, after):
        if DIRECTIVE_RE.search(line):
            print(f"added a tool directive: {line.strip()}")
            return 1
    return 0


def has_header(path: str) -> int:
    with open(path, encoding="utf-8", errors="replace") as handle:
        head = "".join(handle.readline() for _ in range(40))
    return 0 if HEADER_RE.search(head) else 1


def main(argv: List[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    command = argv[1]
    if command == "targets" and len(argv) == 5:
        worktree, runtime_root, mode = argv[2], argv[3], argv[4]
        targets = header_targets(worktree, runtime_root) if mode == "header" else checker_targets(worktree, runtime_root, mode)
        print("\n".join(targets))
        return 0
    if command == "comment-only" and len(argv) == 4:
        return comment_only(argv[2], argv[3])
    if command == "has-header" and len(argv) == 3:
        return has_header(argv[2])
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
