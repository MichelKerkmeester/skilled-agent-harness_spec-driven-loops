#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ALIGNMENT DRIFT VERIFIER
# ───────────────────────────────────────────────────────────────

"""Lightweight recurring alignment checks for OpenCode codebases.

This verifier is intentionally behavior-neutral: it only inspects files and
reports actionable findings. It exits non-zero when violations are found.

Coverage:
- TypeScript (.ts, .tsx)
- JavaScript (.js, .mjs, .cjs)
- Python (.py)
- Shell (.sh)
- JSON (.json)
- JSONC (.jsonc)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from typing import Dict, Iterable, List, Tuple


SUPPORTED_EXTENSIONS: Dict[str, str] = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".js": "javascript",
    ".mjs": "javascript",
    ".cjs": "javascript",
    ".py": "python",
    ".sh": "shell",
    ".json": "json",
    ".jsonc": "jsonc",
}

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".next",
    ".venv",
    "venv",
}


@dataclass
class Finding:
    path: str
    rule_id: str
    message: str
    fix_hint: str
    line: int = 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Verify recurring alignment drift across languages.")
    parser.add_argument(
        "--root",
        action="append",
        default=[],
        help="Root directory to scan (repeatable). Defaults to current directory.",
    )
    return parser.parse_args()


def iter_code_files(roots: Iterable[str]) -> Iterable[str]:
    for root in roots:
        for current_root, dirs, files in os.walk(root):
            dirs[:] = [entry for entry in dirs if entry not in EXCLUDED_DIRS]
            for filename in files:
                extension = os.path.splitext(filename)[1].lower()
                if extension in SUPPORTED_EXTENSIONS:
                    yield os.path.join(current_root, filename)


def first_nonempty_line(lines: List[str]) -> Tuple[int, str]:
    for index, value in enumerate(lines, start=1):
        if value.strip():
            return index, value.strip()
    return 1, ""


def find_line(lines: List[str], pattern: str) -> int:
    regex = re.compile(pattern)
    for index, value in enumerate(lines, start=1):
        if regex.search(value):
            return index
    return 0


def strip_jsonc_comments(content: str) -> str:
    result: List[str] = []
    in_string = False
    string_delim = ""
    escaping = False
    in_line_comment = False
    in_block_comment = False
    i = 0
    length = len(content)

    while i < length:
        char = content[i]
        next_char = content[i + 1] if i + 1 < length else ""

        if in_line_comment:
            if char == "\n":
                in_line_comment = False
                result.append(char)
            i += 1
            continue

        if in_block_comment:
            if char == "*" and next_char == "/":
                in_block_comment = False
                i += 2
            else:
                i += 1
            continue

        if in_string:
            result.append(char)
            if escaping:
                escaping = False
            elif char == "\\":
                escaping = True
            elif char == string_delim:
                in_string = False
            i += 1
            continue

        if char in {'"', "'"}:
            in_string = True
            string_delim = char
            result.append(char)
            i += 1
            continue

        if char == "/" and next_char == "/":
            in_line_comment = True
            i += 2
            continue

        if char == "/" and next_char == "*":
            in_block_comment = True
            i += 2
            continue

        result.append(char)
        i += 1

    return "".join(result)


def check_javascript(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    strict_line = find_line(lines[:40], r"^\s*['\"]use strict['\"];\s*$")
    if strict_line == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="JS-USE-STRICT",
                message="Missing `'use strict';` near file top.",
                fix_hint="Add `'use strict';` within the first 40 lines for JS runtime scripts.",
            )
        )
    return findings


def check_typescript(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    module_marker = find_line(lines[:40], r"MODULE:")
    if module_marker == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="TS-MODULE-HEADER",
                message="Missing TypeScript module header marker (`MODULE:`) near file top.",
                fix_hint="Add the standard TS header block with `MODULE:` in the first 40 lines.",
            )
        )
    return findings


def check_python(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    first_line = lines[0].strip() if lines else ""
    if first_line != "#!/usr/bin/env python3":
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="PY-SHEBANG",
                message="Missing canonical Python shebang.",
                fix_hint="Set first line to `#!/usr/bin/env python3`.",
            )
        )

    content = "".join(lines[:80])
    if not re.search(r'"""|\'\'\'', content):
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="PY-DOCSTRING",
                message="Missing top-level module docstring near file top.",
                fix_hint="Add a short module docstring describing purpose and usage.",
            )
        )
    return findings


def check_shell(path: str, lines: List[str]) -> List[Finding]:
    findings: List[Finding] = []
    first_line = lines[0].strip() if lines else ""
    if first_line != "#!/usr/bin/env bash":
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="SH-SHEBANG",
                message="Missing canonical bash shebang.",
                fix_hint="Set first line to `#!/usr/bin/env bash`.",
            )
        )

    strict_line = find_line(lines[:80], r"^\s*set\s+-euo\s+pipefail\s*$")
    if strict_line == 0:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="SH-STRICT-MODE",
                message="Missing `set -euo pipefail` strict mode declaration.",
                fix_hint="Add `set -euo pipefail` near the top of the script.",
            )
        )
    return findings


def check_json(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    try:
        json.loads(content)
    except json.JSONDecodeError as error:
        findings.append(
            Finding(
                path=path,
                line=error.lineno,
                rule_id="JSON-PARSE",
                message=f"Invalid JSON: {error.msg}",
                fix_hint="Fix JSON syntax so standard parsers can load this file.",
            )
        )
    return findings


def check_jsonc(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    cleaned = strip_jsonc_comments(content)
    try:
        json.loads(cleaned)
    except json.JSONDecodeError as error:
        findings.append(
            Finding(
                path=path,
                line=error.lineno,
                rule_id="JSONC-PARSE",
                message=f"Invalid JSONC structure after comment stripping: {error.msg}",
                fix_hint="Fix JSONC commas/braces/quotes while keeping comments JSONC-compatible.",
            )
        )
    return findings


def check_common(path: str, content: str) -> List[Finding]:
    findings: List[Finding] = []
    if "\r\n" in content:
        findings.append(
            Finding(
                path=path,
                line=1,
                rule_id="COMMON-LINE-ENDINGS",
                message="CRLF line endings detected.",
                fix_hint="Normalize to LF line endings for deterministic cross-platform diffs.",
            )
        )
    return findings


def check_file(path: str) -> List[Finding]:
    extension = os.path.splitext(path)[1].lower()
    findings: List[Finding] = []

    try:
        with open(path, "r", encoding="utf-8") as handle:
            content = handle.read()
    except UnicodeDecodeError:
        return [
            Finding(
                path=path,
                line=1,
                rule_id="COMMON-UTF8",
                message="File is not valid UTF-8 text.",
                fix_hint="Re-encode the file as UTF-8.",
            )
        ]

    lines = content.splitlines(keepends=True)
    findings.extend(check_common(path, content))

    if extension in {".js", ".mjs", ".cjs"}:
        findings.extend(check_javascript(path, lines))
    elif extension in {".ts", ".tsx"}:
        findings.extend(check_typescript(path, lines))
    elif extension == ".py":
        findings.extend(check_python(path, lines))
    elif extension == ".sh":
        findings.extend(check_shell(path, lines))
    elif extension == ".json":
        findings.extend(check_json(path, content))
    elif extension == ".jsonc":
        findings.extend(check_jsonc(path, content))

    return findings


def relpath(path: str) -> str:
    try:
        return os.path.relpath(path, os.getcwd())
    except ValueError:
        return path


def main() -> int:
    args = parse_args()
    roots = args.root or [os.getcwd()]
    findings: List[Finding] = []
    scanned = 0

    for file_path in sorted(iter_code_files(roots)):
        scanned += 1
        findings.extend(check_file(file_path))

    if findings:
        print("[alignment-drift] FAIL")
        print(f"Scanned files: {scanned}")
        print(f"Violations: {len(findings)}")
        print("")
        print("Actionable findings:")
        for item in findings:
            print(
                f"- {relpath(item.path)}:{item.line} [{item.rule_id}] {item.message} "
                f"Fix: {item.fix_hint}"
            )
        return 1

    print("[alignment-drift] PASS")
    print(f"Scanned files: {scanned}")
    print("Violations: 0")
    return 0


if __name__ == "__main__":
    sys.exit(main())
