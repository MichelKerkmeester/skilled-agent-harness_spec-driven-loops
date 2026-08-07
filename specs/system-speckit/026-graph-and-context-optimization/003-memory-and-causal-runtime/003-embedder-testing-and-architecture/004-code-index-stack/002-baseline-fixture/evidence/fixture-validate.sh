#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
FIXTURE="$SCRIPT_DIR/code-retrieval-fixture.json"
SETTINGS="$REPO_ROOT/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"

cd "$REPO_ROOT"

python3 - "$FIXTURE" "$SETTINGS" <<'PY'
import ast
import json
import re
import sys
from collections import Counter
from fnmatch import fnmatch
from pathlib import Path

fixture_path = Path(sys.argv[1])
settings_path = Path(sys.argv[2])
repo = Path.cwd()

fixture = json.loads(fixture_path.read_text())
if not isinstance(fixture, list):
    raise SystemExit("fixture must be a JSON array")
if not (10 <= len(fixture) <= 20):
    raise SystemExit(f"fixture must contain 10-20 pairs, got {len(fixture)}")

settings_text = settings_path.read_text()
match = re.search(r"DEFAULT_INCLUDED_PATTERNS:\s*list\[str\]\s*=\s*(\[[\s\S]*?\n\])", settings_text)
if not match:
    raise SystemExit("DEFAULT_INCLUDED_PATTERNS not found")
include_patterns = ast.literal_eval(match.group(1))

required = {"id", "query", "expected_source_path", "expected_symbol", "difficulty", "category"}
seen_ids: set[int] = set()
counts: Counter[str] = Counter()

for index, item in enumerate(fixture, 1):
    if not isinstance(item, dict):
        raise SystemExit(f"pair {index}: must be an object")
    missing = required - item.keys()
    if missing:
        raise SystemExit(f"pair {index}: missing fields {sorted(missing)}")

    pair_id = item["id"]
    if not isinstance(pair_id, int) or pair_id <= 0:
        raise SystemExit(f"pair {index}: id must be a positive integer")
    if pair_id in seen_ids:
        raise SystemExit(f"pair {index}: duplicate id {pair_id}")
    seen_ids.add(pair_id)

    difficulty = item["difficulty"]
    if difficulty not in {"easy", "medium", "hard"}:
        raise SystemExit(f"pair {pair_id}: invalid difficulty {difficulty!r}")
    counts[difficulty] += 1

    rel = item["expected_source_path"]
    if not isinstance(rel, str) or rel.startswith("/") or ".." in Path(rel).parts:
        raise SystemExit(f"pair {pair_id}: expected_source_path must be a safe repo-relative path")

    full_path = repo / rel
    if not full_path.exists():
        raise SystemExit(f"pair {pair_id}: expected path does not exist: {rel}")

    if not any(fnmatch(rel, pattern) for pattern in include_patterns):
        raise SystemExit(f"pair {pair_id}: path does not match DEFAULT_INCLUDED_PATTERNS: {rel}")

    query = item["query"]
    if not isinstance(query, str) or len(query.strip()) < 12:
        raise SystemExit(f"pair {pair_id}: query is too short")

if counts["easy"] < 5 or counts["medium"] < 5 or counts["hard"] < 5:
    raise SystemExit(f"difficulty distribution must include at least 5 each, got {dict(counts)}")

print(f"fixture ok: {len(fixture)} pairs; distribution={dict(sorted(counts.items()))}")
PY
