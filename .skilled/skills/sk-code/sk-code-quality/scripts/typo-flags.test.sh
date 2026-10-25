#!/usr/bin/env bash
# Proves the sk-code helper scripts reject misspelled long flags with a usage-error
# exit, and that an input they cannot read is reported as an error rather than being
# treated as clean or as nothing to check.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL="$(cd "$SCRIPT_DIR/../.." && pwd)"

DIST_STALENESS="$SKILL/sk-code-quality/scripts/check-dist-staleness.sh"
COMMENT_HYGIENE="$SKILL/sk-code-quality/scripts/check-comment-hygiene.sh"
REVIEW_FINAL_LINE="$SKILL/sk-code-review/scripts/check-review-final-line.js"
REVIEW_FINDINGS="$SKILL/sk-code-review/scripts/check-review-findings.js"
RULE_COPIES="$SKILL/sk-code-review/scripts/check-rule-copies.js"
REVIEW_FIXTURE="$SKILL/sk-code-review/scripts/review-output-fixture/heading-shape-valid.md"
ROUTER_SYNC="$SKILL/sk-code-skilled/assets/scripts/verify-router-sync.cjs"

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/typo-flags-XXXXXX")"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

fresh_case_dir() {
  mktemp -d "$TMP_DIR/case.XXXXXX"
}

check_result() {
  local name="$1"
  local expected_exit="$2"
  local expected_token="$3"
  local actual_exit="$4"
  local output="$5"

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  elif [[ -n "$expected_token" && "$output" != *"$expected_token"* ]]; then
    printf 'FAIL %s: exit %s was right but the output does not name %s\n%s\n' "$name" "$actual_exit" "$expected_token" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

run_case() {
  local name="$1"
  local expected_exit="$2"
  local expected_token="$3"
  shift 3
  local output
  local actual_exit

  set +e
  output="$("$@" 2>&1)"
  actual_exit=$?
  set -e

  check_result "$name" "$expected_exit" "$expected_token" "$actual_exit" "$output"
}

run_in_dir() {
  local dir="$1"
  shift
  (cd "$dir" && exec "$@")
}

run_case "check-dist-staleness.sh rejects a misspelled --bogus-xyz flag" 2 "--bogus-xyz" \
  python3 "$DIST_STALENESS" --bogus-xyz

case_dir="$(fresh_case_dir)"
run_case "check-comment-hygiene.sh exits 3 when its input file does not exist" 3 "" \
  python3 "$COMMENT_HYGIENE" "$case_dir/missing.py"
rm -rf "$case_dir"

case_dir="$(fresh_case_dir)"
printf 'x = 1\n' > "$case_dir/clean.py"
run_case "check-comment-hygiene.sh exits 3 when any one input cannot be read" 3 "" \
  python3 "$COMMENT_HYGIENE" "$case_dir/clean.py" "$case_dir/missing.py"
rm -rf "$case_dir"

run_case "check-review-final-line.js rejects a misspelled --bogus-xyz flag" 2 "--bogus-xyz" \
  node "$REVIEW_FINAL_LINE" "$REVIEW_FIXTURE" --bogus-xyz

run_case "check-review-findings.js rejects a misspelled --bogus-xyz flag" 2 "--bogus-xyz" \
  node "$REVIEW_FINDINGS" "$REVIEW_FIXTURE" --bogus-xyz

run_case "check-rule-copies.js rejects a misspelled --bogus-xyz flag" 2 "--bogus-xyz" \
  node "$RULE_COPIES" --bogus-xyz

run_case "check-rule-copies.js rejects --root without a value" 2 "--root" \
  node "$RULE_COPIES" --root

run_case "verify-router-sync.cjs rejects a misspelled --bogus-xyz flag" 2 "--bogus-xyz" \
  node "$ROUTER_SYNC" --bogus-xyz

# The unknown-option usage line must not leak the parser-internal check-id
# suffix, which names an unrelated concern instead of the offending flag.
router_sync_case="verify-router-sync.cjs unknown-option usage line has no check-id suffix"
set +e
router_sync_output="$(node "$ROUTER_SYNC" --bogus-xyz 2>&1)"
set -e
if [[ "$router_sync_output" == *"(unknown: none given)"* ]]; then
  printf 'FAIL %s: the usage line still carries the check-id suffix\n%s\n' "$router_sync_case" "$router_sync_output" >&2
  failures=$((failures + 1))
else
  printf 'PASS %s\n' "$router_sync_case"
fi

if [[ "$failures" -gt 0 ]]; then
  printf '%s typo-flag test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All typo-flag test cases passed\n'
