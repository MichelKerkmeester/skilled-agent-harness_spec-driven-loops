#!/usr/bin/env bash
set -euo pipefail

# Self-contained test for check-rule-copies.js. Runnable from anywhere — paths
# are resolved relative to this script, not the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKER="$SCRIPT_DIR/check-rule-copies.js"
# scripts -> sk-code-review -> skills -> .opencode -> repo root
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

# Real target files the canary reads. The tamper cases seed ALL of them into a
# throwaway tree so the resulting failure is attributable to the one mutation,
# not to incidentally-missing files.
TARGETS=(
  ".opencode/skills/sk-code-review/SKILL.md"
  ".opencode/skills/sk-code-review/README.md"
  ".opencode/skills/sk-code-review/changelog/v1.3.0.0.md"
  ".opencode/skills/sk-code-review/references/pr_state_dedup.md"
  ".opencode/skills/sk-code/SKILL.md"
  "CLAUDE.md"
)

seed_tree() {
  local dest="$1"
  local rel
  for rel in "${TARGETS[@]}"; do
    mkdir -p "$dest/$(dirname "$rel")"
    cp "$REPO_ROOT/$rel" "$dest/$rel"
  done
}

run_case() {
  local expected_exit="$1"
  local name="$2"
  shift 2
  local output
  local actual_exit

  set +e
  output="$("$@" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

# PASS: the real, consistent repo tree (exercises the default-CWD root path).
real_repo_run() {
  ( cd "$REPO_ROOT" && node "$CHECKER" )
}
run_case 0 "real_repo_root_consistent" real_repo_run

# FAIL: tampered tree with an exact-substring invariant deleted.
CASE_DELETED="$TMP_DIR/deleted_status"
seed_tree "$CASE_DELETED"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("Review status: APPROVED",""));' \
  "$CASE_DELETED/.opencode/skills/sk-code-review/SKILL.md"
run_case 1 "missing_review_status_approved" node "$CHECKER" --root "$CASE_DELETED"

# FAIL: tampered tree whose CLAUDE.md Iron Law line is reworded to drop "verification".
CASE_REWORDED="$TMP_DIR/reworded_iron_law"
seed_tree "$CASE_REWORDED"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("stack-appropriate verification","stack-appropriate checks"));' \
  "$CASE_REWORDED/CLAUDE.md"
run_case 1 "iron_law_dropped_verification" node "$CHECKER" --root "$CASE_REWORDED"

if [[ "$failures" -gt 0 ]]; then
  printf '%s rule-canary test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All rule-canary test cases passed\n'
