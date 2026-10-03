#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: ROUTE VALIDATE TESTS
# ───────────────────────────────────────────────────────────────
# Exercises route-validate.sh and route-validate.py. The real manifest is only
# read; every edited manifest and every mutated copy of the validator lives in
# a temporary directory. The mutation tests silence one rule at a time and
# require --self-test to notice, so a rule cannot break unseen behind another
# rule that every single-route fixture also trips.
#
# Usage: bash .skilled/commands/doctor/scripts/tests/route-validate.test.sh
#
# Exit Codes:
#   0 - Every test passed
#   1 - At least one test failed

# check() evaluates its condition after the run, so the single quotes are intended.
# shellcheck disable=SC2016
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. HARNESS
# ───────────────────────────────────────────────────────────────

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(cd "$TEST_DIR/.." && pwd)"
DOCTOR_DIR="$(cd "$SCRIPTS_DIR/.." && pwd)"
REPO_DIR="$(cd "$DOCTOR_DIR/../../.." && pwd)"
SCRIPT="$SCRIPTS_DIR/route-validate.sh"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/route-validate-test.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

PASS=0
FAIL=0
OUT=""
RC=0

pass() { printf 'PASS: %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf 'FAIL: %s\n' "$1"; FAIL=$((FAIL + 1)); }

# Run a validator script; env assignments come before "--"
# Args: [VAR=value ...] -- script [script args]
run_rv() {
  local -a env_args=()
  while [[ $# -gt 0 && "$1" != "--" ]]; do
    env_args+=("$1")
    shift
  done
  [[ "${1:-}" == "--" ]] && shift
  RC=0
  OUT="$(env ${env_args[@]+"${env_args[@]}"} bash "$@" 2>&1)" || RC=$?
}

check() {
  local name="$1" condition="$2"
  if eval "$condition"; then
    pass "$name"
  else
    fail "$name"
    printf '%s\n' "exit=$RC" "$OUT" | head -30 | sed 's/^/    | /'
  fi
}

# Copy both validator files into a scratch scripts dir, silencing one rule's
# failure report when a rule id is given. Prints the copied .sh path.
# Args: $1=rule id to silence (optional) $2=raise inside the validator (optional)
mutated_copy() {
  local rule="${1:-}" crash="${2:-}" dir
  dir="$(mktemp -d "$WORK/mutant.XXXXXX")/doctor/scripts"
  mkdir -p "$dir"
  cp "$SCRIPTS_DIR/route-validate.sh" "$SCRIPTS_DIR/route-validate.py" "$dir/"
  if [[ -n "$rule" ]]; then
    sed -E "s/[A-Za-z_]+\\.fail\\((f?\"$rule:)/(lambda *_: None)(\\1/" "$SCRIPTS_DIR/route-validate.py" > "$dir/route-validate.py"
  fi
  if [[ -n "$crash" ]]; then
    printf 'raise RuntimeError("mutant crash")\n' >> "$dir/route-validate.py.head"
    cat "$dir/route-validate.py.head" "$SCRIPTS_DIR/route-validate.py" > "$dir/route-validate.py"
  fi
  printf '%s' "$dir/route-validate.sh"
}

# The copied validator resolves its inputs from these, not from its own location.
REAL_ENV=(
  "ROUTER_FILE=$DOCTOR_DIR/speckit.md"
  "ASSETS_DIR=$DOCTOR_DIR/assets"
  "PRESENTATION_FILE=$DOCTOR_DIR/assets/doctor-speckit-presentation.txt"
  "REPO_ROOT=$REPO_DIR"
)

# ───────────────────────────────────────────────────────────────
# 2. REAL MANIFEST AND SELF-TEST
# ───────────────────────────────────────────────────────────────

run_rv -- "$SCRIPT"
check "the real manifest validates with exit 0" '[[ "$RC" -eq 0 && "$OUT" == *"OK: route-validate"* ]]'

run_rv -- "$SCRIPT" --self-test
check "--self-test passes on the shipped validator" '[[ "$RC" -eq 0 && "$OUT" == *"All self-tests passed"* ]]'

run_rv -- "$SCRIPT" --help
check "--help exits 0" '[[ "$RC" -eq 0 && "$OUT" == *"--self-test"* ]]'

# ───────────────────────────────────────────────────────────────
# 3. ARGUMENTS, OVERRIDES AND MALFORMED MANIFESTS
# ───────────────────────────────────────────────────────────────

run_rv -- "$SCRIPT" --bogus
check "an unknown argument exits 2" '[[ "$RC" -eq 2 && "$OUT" == *"--bogus"* ]]'

EMPTY_REPO="$(mktemp -d "$WORK/empty-repo.XXXXXX")"
run_rv REPO_ROOT="$EMPTY_REPO" -- "$SCRIPT"
check "REPO_ROOT overrides where script_invocations resolve" '[[ "$RC" -eq 1 && "$OUT" == *"FAIL: I1:"* ]]'

: > "$WORK/empty.yaml"
run_rv ROUTES_FILE="$WORK/empty.yaml" -- "$SCRIPT"
check "an empty manifest exits 2 with a message" '[[ "$RC" -eq 2 && "$OUT" == *"ERROR"* && "$OUT" != *Traceback* ]]'

printf -- '- target: memory\n' > "$WORK/list.yaml"
run_rv ROUTES_FILE="$WORK/list.yaml" -- "$SCRIPT"
check "a top-level list manifest exits 2 with a message" '[[ "$RC" -eq 2 && "$OUT" == *"ERROR"* && "$OUT" != *Traceback* ]]'

run_rv ROUTES_FILE="$WORK/missing.yaml" -- "$SCRIPT"
check "a missing manifest exits 2" '[[ "$RC" -eq 2 ]]'

sed 's/^schema_version: 1$/schema_version: 2/' "$DOCTOR_DIR/_routes.yaml" > "$WORK/schema2.yaml"
run_rv ROUTES_FILE="$WORK/schema2.yaml" -- "$SCRIPT"
check "a schema_version failure exits 1" '[[ "$RC" -eq 1 && "$OUT" == *"FAIL: A2:"* ]]'
check "an A2 failure does not hide the B2 pass" '[[ "$OUT" == *"PASS: B2: all routes have required keys"* ]]'

python3 - "$DOCTOR_DIR/_routes.yaml" "$WORK/dupe.yaml" <<'PY'
import sys
import yaml

doc = yaml.safe_load(open(sys.argv[1], encoding="utf-8"))
doc["routes"].append(dict(doc["routes"][0]))
yaml.safe_dump(doc, open(sys.argv[2], "w", encoding="utf-8"), sort_keys=False)
PY
run_rv ROUTES_FILE="$WORK/dupe.yaml" -- "$SCRIPT"
check "a duplicated route is caught as C1 drift" '[[ "$RC" -eq 1 && "$OUT" == *"FAIL: C1:"* ]]'

# ───────────────────────────────────────────────────────────────
# 4. SELF-TEST CATCHES A SILENCED RULE
# ───────────────────────────────────────────────────────────────

for rule in B2 C1 D1 I1 J1 K1 L1; do
  MUTANT="$(mutated_copy "$rule")"
  if ! grep -q '(lambda \*_: None)(f"'"$rule"':' "${MUTANT%.sh}.py"; then
    fail "mutation for $rule applied (no fail call found to silence)"
    continue
  fi
  run_rv "${REAL_ENV[@]}" -- "$MUTANT" --self-test
  check "--self-test fails when rule $rule is silenced" '[[ "$RC" -ne 0 ]]'
done

MUTANT="$(mutated_copy "" crash)"
run_rv "${REAL_ENV[@]}" -- "$MUTANT" --self-test
check "--self-test fails when the validator crashes" '[[ "$RC" -ne 0 ]]'

# ───────────────────────────────────────────────────────────────
# 5. SUMMARY
# ───────────────────────────────────────────────────────────────

printf 'Results: %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
