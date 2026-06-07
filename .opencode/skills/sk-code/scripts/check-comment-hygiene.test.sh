#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECKER="$SCRIPT_DIR/check-comment-hygiene.sh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

failures=0

run_case() {
  local expected_exit="$1"
  local name="$2"
  local extension="$3"
  local content="$4"
  local file_path="$TMP_DIR/${name}.${extension}"
  local output
  local actual_exit

  printf '%s\n' "$content" > "$file_path"

  set +e
  output="$(python3 "$CHECKER" "$file_path" 2>&1)"
  actual_exit=$?
  set -e

  if [[ "$actual_exit" -ne "$expected_exit" ]]; then
    printf 'FAIL %s: expected exit %s, got %s\n%s\n' "$name" "$expected_exit" "$actual_exit" "$output" >&2
    failures=$((failures + 1))
  else
    printf 'PASS %s\n' "$name"
  fi
}

run_case 1 "rc_ref" "js" "// RC-2 x"
run_case 1 "dr_single" "js" "// DR-005 x"
run_case 1 "phase_hyphen" "js" "// phase-004 x"
run_case 1 "council_seat" "js" "// P1-Seat2 x"
run_case 1 "adr_ref" "js" "// ADR-7 x"
run_case 1 "inline_req" "js" "const a = 1; // REQ-3"

run_case 0 "cwe_allowed" "js" "// CWE-79"
run_case 0 "rfc_allowed" "js" "// RFC 2616"
run_case 0 "posix_allowed" "js" "// POSIX"
run_case 0 "schema_allowed" "js" "// V16: schema"
run_case 0 "rc_words_only" "js" "// RC tank"
run_case 0 "normal_comment" "js" "// a normal comment"
run_case 0 "hygiene_ok_inline" "js" "code(); // hygiene-ok DR-9"

if [[ "$failures" -gt 0 ]]; then
  printf '%s comment hygiene test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All comment hygiene test cases passed\n'
