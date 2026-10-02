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
run_case 1 "feature_catalog" "js" "// Feature catalog: cache invalidation"
run_case 1 "phase_path_short" "js" "// phase-19-gate"
run_case 1 "generic_phase_zero" "js" "// Phase 0 external artifact"
run_case 1 "generic_spec_zero_padded" "js" "// spec 019 external artifact"

run_case 0 "cwe_allowed" "js" "// CWE-79"
run_case 0 "rfc_allowed" "js" "// RFC 2616"
run_case 0 "posix_allowed" "js" "// POSIX"
run_case 0 "schema_allowed" "js" "// V16: schema"
run_case 0 "rc_words_only" "js" "// RC tank"
run_case 0 "normal_comment" "js" "// a normal comment"
run_case 0 "hygiene_ok_inline" "js" "code(); // hygiene-ok DR-9"
run_case 0 "feature_catalog_without_pointer" "js" "// Feature catalog is a durable concept"
run_case 0 "durable_phase_label" "js" "// Phase 2 protocol stage"
run_case 0 "string_literal" "js" "const pointer = \"spec 019\";"
run_case 0 "url_literal" "js" "// See https://example.test/spec 019"

# Several files in one run: any violation decides the exit, and each file is reported.
printf '%s\n' "// RC-2 x" > "$TMP_DIR/multi_bad.js"
printf '%s\n' "// a normal comment" > "$TMP_DIR/multi_good.js"
printf '%s\n' "plain" > "$TMP_DIR/multi_skip.txt"
set +e
multi_output="$(python3 "$CHECKER" "$TMP_DIR/multi_good.js" "$TMP_DIR/multi_bad.js" "$TMP_DIR/multi_skip.txt" 2>&1)"
multi_exit=$?
python3 "$CHECKER" "$TMP_DIR/multi_good.js" "$TMP_DIR/multi_skip.txt" >/dev/null 2>&1
clean_exit=$?
python3 "$CHECKER" "$TMP_DIR/multi_skip.txt" "$TMP_DIR/multi_skip.txt" >/dev/null 2>&1
skip_exit=$?
set -e
if [[ "$multi_exit" -eq 1 && "$multi_output" == *"multi_bad.js:1:"* && "$clean_exit" -eq 0 && "$skip_exit" -eq 2 ]]; then
  printf 'PASS multi_file\n'
else
  printf 'FAIL multi_file: exits %s/%s/%s\n%s\n' "$multi_exit" "$clean_exit" "$skip_exit" "$multi_output" >&2
  failures=$((failures + 1))
fi

if [[ "$failures" -gt 0 ]]; then
  printf '%s comment hygiene test case(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'All comment hygiene test cases passed\n'
