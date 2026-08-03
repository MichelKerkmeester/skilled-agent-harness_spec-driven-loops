#!/usr/bin/env python3
"""Exercise the opt-in code-folder README contract."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


TESTS = Path(__file__).resolve().parent
REPO = TESTS.parents[4]
VALIDATOR = REPO / ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
FIXTURE_ROOT = TESTS / "code-folder"

NEGATIVE_CASES = {
    "missing-tree": {"code_folder_directory_tree"},
    "incomplete-flat-inventory": {"code_folder_flat_inventory"},
    "missing-separator": {"code_folder_h2_separator"},
    "unnumbered-h2": {"code_folder_h2_numbering"},
    "non-sequential-h2": {"code_folder_h2_sequence"},
    "untagged-fence": {"code_folder_fence_language"},
    "broken-links": {"code_folder_relative_link", "code_folder_inline_path"},
    "durability-leak": {
        "code_folder_packet_id",
        "code_folder_phase_id",
        "code_folder_adr_id",
        "code_folder_commit_hash",
        "code_folder_specs_path",
    },
    "toc-anchor": {"code_folder_no_toc", "code_folder_no_anchor"},
}


def validate(path: Path, doc_type: str = "code_folder") -> dict:
    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(path), "--type", doc_type, "--no-exclude", "--json"],
        cwd=REPO,
        capture_output=True,
        text=True,
        check=False,
    )
    if not proc.stdout.strip():
        raise AssertionError(f"validator returned no JSON for {path}: {proc.stderr}")
    payload = json.loads(proc.stdout)
    payload["process_return_code"] = proc.returncode
    return payload


def main() -> int:
    failures = []
    for name, expected_rules in NEGATIVE_CASES.items():
        payload = validate(FIXTURE_ROOT / "negative" / name / "README.md")
        actual_rules = {item["type"] for item in payload.get("blocking_errors", [])}
        if payload["process_return_code"] != 1 or not expected_rules.issubset(actual_rules):
            failures.append(f"{name}: expected {sorted(expected_rules)}, got {sorted(actual_rules)}")
        print(f"NEGATIVE {name}: rc={payload['process_return_code']} rules={sorted(actual_rules)}")

    for name in ("flat-contents-pass",):
        payload = validate(FIXTURE_ROOT / name / "README.md")
        if payload["process_return_code"] != 0 or payload.get("blocking_errors"):
            failures.append(f"{name}: expected pass, got {payload.get('blocking_errors')}")
        print(f"PASS {name}: rc={payload['process_return_code']} blocking={len(payload.get('blocking_errors', []))}")

    payload = validate(FIXTURE_ROOT / "positive" / "control" / "README.md")
    if payload["process_return_code"] != 0 or payload.get("blocking_errors"):
        failures.append(f"positive/control: expected pass, got {payload.get('blocking_errors')}")
    print(f"POSITIVE control: rc={payload['process_return_code']} blocking={len(payload.get('blocking_errors', []))}")

    if failures:
        print("FAILURES:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print(f"SUMMARY: negatives={len(NEGATIVE_CASES)} flat_table_pass=1 positive_control=1 failures=0")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
