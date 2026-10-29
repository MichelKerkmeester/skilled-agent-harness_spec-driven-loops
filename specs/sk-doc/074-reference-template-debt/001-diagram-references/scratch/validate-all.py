#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: VALIDATE ALL REFERENCES
# ───────────────────────────────────────────────────────────────

"""
Run validate_document.py over a list of files and write one TSV row per file.

Usage: python validate-all.py <file-list> <out.tsv> [--repo <dir>]
Output: TSV with columns file, status, total_issues, blocking_codes
"""

import argparse
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import List, Tuple

VALIDATOR = ".skilled/skills/sk-doc/shared/scripts/validate_document.py"
PYTHON = "/opt/homebrew/bin/python3"

TOTAL_RE = re.compile(r"Total issues:\s*(\d+)")
CODE_RE = re.compile(r"^\s+- \[([a-z0-9_]+)\]", re.MULTILINE)


def validate_one(repo: Path, rel: str) -> Tuple[str, str, str, str]:
    """Return (file, status, total, blocking codes) for one file."""
    proc = subprocess.run(
        [PYTHON, str(repo / VALIDATOR), rel],
        cwd=repo,
        capture_output=True,
        text=True,
        check=False,
    )
    out = proc.stdout + proc.stderr
    if "SKIPPED" in out:
        return rel, "SKIPPED", "0", ""
    match = TOTAL_RE.search(out)
    total = match.group(1) if match else "?"
    status = "OK" if proc.returncode == 0 and total == "0" else "FAIL"
    codes = sorted(set(CODE_RE.findall(out)))
    return rel, status, total, ",".join(codes)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("file_list")
    parser.add_argument("out")
    parser.add_argument("--repo", default=".")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    files: List[str] = [
        line.strip() for line in Path(args.file_list).read_text().splitlines() if line.strip()
    ]
    with ThreadPoolExecutor(max_workers=8) as pool:
        rows = list(pool.map(lambda rel: validate_one(repo, rel), files))

    lines = ["\t".join(row) for row in rows]
    Path(args.out).write_text("\n".join(lines) + "\n")
    failing = [row for row in rows if row[1] != "OK"]
    print(f"files={len(rows)} failing={len(failing)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
