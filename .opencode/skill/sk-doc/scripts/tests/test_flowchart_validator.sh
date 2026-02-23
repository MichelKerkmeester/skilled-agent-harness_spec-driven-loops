#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="$SCRIPT_DIR/../validate_flowchart.sh"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

assert_exit_code() {
  local expected="$1"
  local actual="$2"
  local message="$3"
  if [[ "$expected" -ne "$actual" ]]; then
    echo "FAIL: $message (expected exit $expected, got $actual)"
    exit 1
  fi
}

assert_contains() {
  local needle="$1"
  local file="$2"
  local message="$3"
  if ! grep -q "$needle" "$file"; then
    echo "FAIL: $message"
    echo "Output:"
    cat "$file"
    exit 1
  fi
}

assert_not_contains() {
  local needle="$1"
  local file="$2"
  local message="$3"
  if grep -q "$needle" "$file"; then
    echo "FAIL: $message"
    echo "Output:"
    cat "$file"
    exit 1
  fi
}

echo "Running flowchart validator regression tests..."

# 1) No-arg usage path should be safe.
NO_ARG_OUT="$TMP_DIR/no_arg.out"
set +e
"$VALIDATOR" >"$NO_ARG_OUT" 2>&1
NO_ARG_EXIT=$?
set -e
assert_exit_code 1 "$NO_ARG_EXIT" "No-arg invocation should return usage error"
assert_contains "Usage:" "$NO_ARG_OUT" "No-arg invocation should print usage"
assert_not_contains "unbound variable" "$NO_ARG_OUT" "No-arg invocation must not trigger unbound variable"

# 2) Simple flow should pass and avoid decision parsing syntax errors.
SIMPLE_FILE="$TMP_DIR/simple.md"
cat >"$SIMPLE_FILE" <<'EOF'
# Simple flow

Verification step only.

┌──────────┐
│ Start    │
└──────────┘
   ↓
┌──────────┐
│ End      │
└──────────┘
EOF

SIMPLE_OUT="$TMP_DIR/simple.out"
set +e
"$VALIDATOR" "$SIMPLE_FILE" >"$SIMPLE_OUT" 2>&1
SIMPLE_EXIT=$?
set -e
assert_exit_code 0 "$SIMPLE_EXIT" "Simple flowchart should pass"
assert_not_contains "syntax error in expression" "$SIMPLE_OUT" "Simple flowchart should not produce arithmetic syntax errors"

# 3) Decision flow without labels should fail.
NO_LABELS_FILE="$TMP_DIR/decision_no_labels.md"
cat >"$NO_LABELS_FILE" <<'EOF'
# Decision flow

┌──────────┐
│ Decision │
└──────────┘
   ↓
┌──────────┐
│ Path A   │
└──────────┘
EOF

NO_LABELS_OUT="$TMP_DIR/no_labels.out"
set +e
"$VALIDATOR" "$NO_LABELS_FILE" >"$NO_LABELS_OUT" 2>&1
NO_LABELS_EXIT=$?
set -e
assert_exit_code 1 "$NO_LABELS_EXIT" "Decision flow without labels should fail"
assert_contains "Decision points detected but no YES/NO labels found" "$NO_LABELS_OUT" "Missing decision labels should be reported"

# 4) Decision flow with labels should pass.
WITH_LABELS_FILE="$TMP_DIR/decision_with_labels.md"
cat >"$WITH_LABELS_FILE" <<'EOF'
# Decision flow

┌──────────┐
│ Decision │
└──────────┘
 [YES] ↓ [NO]
┌──────────┐
│ Path A   │
└──────────┘
EOF

WITH_LABELS_OUT="$TMP_DIR/with_labels.out"
set +e
"$VALIDATOR" "$WITH_LABELS_FILE" >"$WITH_LABELS_OUT" 2>&1
WITH_LABELS_EXIT=$?
set -e
assert_exit_code 0 "$WITH_LABELS_EXIT" "Decision flow with labels should pass"

echo "PASS: flowchart validator regression tests"
