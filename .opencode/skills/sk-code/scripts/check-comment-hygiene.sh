#!/usr/bin/env python3
"""
Comment hygiene checker — detects ephemeral-artifact pointers in code comment lines.

Usage: check-comment-hygiene.sh <file>

Exit codes:
  0 — file is clean (no violations found)
  1 — violations found (reported to stdout as FILEPATH:LINE: excerpt)
  2 — file skipped (binary, unknown extension, or in excluded dir)

Escape: add "hygiene-ok" anywhere on a comment line to suppress it.

See: .opencode/skills/sk-code/references/universal/code_style_guide.md §4
"""
import sys
import os
import re

def main():
    if len(sys.argv) < 2:
        print("Usage: check-comment-hygiene.sh <file>", file=sys.stderr)
        sys.exit(2)

    filepath = sys.argv[1]

    # --- Excluded directories and file patterns ---
    abs_path = os.path.abspath(filepath)
    excluded_dirs = ["/dist/", "/node_modules/", "/.git/"]
    for excl in excluded_dirs:
        if excl in abs_path:
            sys.exit(2)

    basename = os.path.basename(filepath)
    if basename.endswith(".vitest.js"):
        sys.exit(2)

    # --- Language detection from extension ---
    _, ext = os.path.splitext(basename)
    ext = ext.lower()

    if ext in (".ts", ".tsx", ".js", ".mjs", ".cjs"):
        lang = "js"
    elif ext == ".py":
        lang = "py"
    elif ext in (".sh", ".bash"):
        lang = "sh"
    elif ext == ".jsonc":
        lang = "jsonc"
    else:
        # Unknown extension — skip silently
        sys.exit(2)

    # --- Read file ---
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
    except (OSError, IOError) as e:
        print(f"WARNING: cannot read {filepath}: {e}", file=sys.stderr)
        sys.exit(0)

    # --- Comment line detection ---
    def is_comment_line(stripped: str, lang: str) -> bool:
        if lang in ("js", "jsonc"):
            return stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("/*")
        elif lang in ("py", "sh"):
            return stripped.startswith("#")
        return False

    # --- Allowed-class patterns (these suppress violation detection) ---
    # Order: check these BEFORE violation patterns.
    ALLOWED_PATTERNS = [
        re.compile(r'\bCWE-\d+\b'),                    # CWE security codes
        re.compile(r'\bRFC\s*-?\d+\b'),                 # RFC references
        re.compile(r'\bPOSIX\b'),                        # POSIX standard
        re.compile(r'\bHTTP\s+\d{3}\b'),                 # HTTP status codes
        re.compile(r'\bWEBFLOW\s*:'),                   # WEBFLOW: platform tag
        re.compile(r'\bMOTION\s*:'),                    # MOTION: platform tag
        re.compile(r'\bLENIS\s*:'),                     # LENIS: platform tag
        re.compile(r'\bV\d+\s*:'),                       # V16: schema tag
    ]

    # --- Violation patterns ---
    # Each is (pattern, description) for clear reporting.
    VIOLATION_PATTERNS = [
        (re.compile(r'\b\d{3}/\d{3}\b'),                 "packet/phase reference"),
        (re.compile(r'\bADR-\d+\b'),                     "ADR reference"),
        (re.compile(r'\bREQ-\d+[-:]'),                   "REQ reference"),
        (re.compile(r'\bCHK-\d+[-:]'),                   "CHK reference"),
        (re.compile(r'\bT\d{3,4}[-/]'),                  "task ID reference"),
        (re.compile(r'\bpacket\s+\d+\b', re.IGNORECASE), "packet number reference"),
        (re.compile(r'\bphase\s+\d{3}\b', re.IGNORECASE), "3-digit phase reference"),
        (re.compile(r'specs/[a-z0-9-]+/\d{3}-'),         "spec path reference"),
        (re.compile(r'\bWS-\d+-\d+\b'),                  "worktree session reference"),
        (re.compile(r'\bDR-\d+-\d+\b'),                  "deep review reference"),
        (re.compile(r'\breview\s+finding\b', re.IGNORECASE), "review finding reference"),
    ]

    violations = []

    for lineno, raw_line in enumerate(lines, start=1):
        stripped = raw_line.strip()

        # Must be a comment line
        if not is_comment_line(stripped, lang):
            continue

        # Hygiene-ok escape: skip this line entirely
        if "hygiene-ok" in raw_line:
            continue

        # Check allowed-class patterns first — if any match, skip violation check
        if any(pat.search(raw_line) for pat in ALLOWED_PATTERNS):
            continue

        # Check violation patterns
        for vpat, _desc in VIOLATION_PATTERNS:
            m = vpat.search(raw_line)
            if m:
                excerpt = raw_line.rstrip()
                violations.append(f"{filepath}:{lineno}: {excerpt}")
                break  # One violation per line is enough

    if violations:
        for v in violations:
            print(v)
        sys.exit(1)

    sys.exit(0)


if __name__ == "__main__":
    main()
