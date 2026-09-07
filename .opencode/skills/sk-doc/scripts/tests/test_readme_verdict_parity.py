#!/usr/bin/env python3
"""Prove the opt-in branch leaves the existing README verdicts unchanged.

Run with --write to rebuild the baseline from every tracked README after a
deliberate validator or tree change; the next plain run then measures drift
from that point.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
BASELINE = TESTS / "code-folder/baseline-readme-verdicts.json"


def current_verdict(path: str) -> dict:
    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), path, "--type", "readme", "--json"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
    )
    payload = json.loads(proc.stdout)
    return {
        "file": path,
        "return_code": proc.returncode,
        "valid": payload.get("valid"),
        "document_type": payload.get("document_type"),
        "total_issues": payload.get("total_issues"),
        "auto_fixable_count": payload.get("auto_fixable_count"),
        "blocking_errors": payload.get("blocking_errors", []),
        "warnings": payload.get("warnings", []),
    }


def tracked_readmes() -> list[str]:
    """Every tracked README.md, the set the baseline describes; vendored trees are never tracked."""
    proc = subprocess.run(
        ["git", "ls-files", "--", "README.md", "*/README.md"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=True,
    )
    return sorted(line for line in proc.stdout.splitlines() if line and "/node_modules/" not in line)


def write_baseline() -> int:
    """Rebuild the baseline from the current tree; the parity run then measures drift from here."""
    previous = json.loads(BASELINE.read_text(encoding="utf-8"))
    files = tracked_readmes()
    results = [current_verdict(path) for path in files]
    payload = {
        "count": len(results),
        "mode": previous.get("mode", "readme"),
        "results": results,
        "schema": previous.get("schema"),
        "source": previous.get("source"),
    }
    BASELINE.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"PARITY baseline rewritten: {len(results)} tracked README files")
    return 0


def main() -> int:
    if "--write" in sys.argv[1:]:
        return write_baseline()
    baseline = json.loads(BASELINE.read_text(encoding="utf-8"))
    mismatches = []
    for expected in baseline["results"]:
        actual = current_verdict(expected["file"])
        if actual != expected:
            mismatches.append({"file": expected["file"], "expected": expected, "actual": actual})
    print(f"PARITY baseline_files={baseline['count']} post_files={len(baseline['results'])} diff_entries={len(mismatches)}")
    if mismatches:
        for mismatch in mismatches:
            print(json.dumps(mismatch, sort_keys=True))
        return 1
    print("PARITY PASS: verdict diff is empty")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
