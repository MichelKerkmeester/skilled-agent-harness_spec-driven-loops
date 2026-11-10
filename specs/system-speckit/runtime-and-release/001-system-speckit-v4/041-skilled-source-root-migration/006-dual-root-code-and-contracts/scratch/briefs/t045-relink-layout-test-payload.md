## File 1

File: `.opencode/bin/tests/relink-local-specs.test.sh`

CONTENT:

~~~~text
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Relink Local Specs Test
# ───────────────────────────────────────────────────────────────
# Runs the relinker from every source-root layout a checkout can hold: a real
# .opencode tree, a real .skilled tree, and a real .skilled tree with .opencode
# linked to it. The script finds the checkout two directories above its own, so
# each pointer must land under that checkout's specs/ whichever name it ran through.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
RELINKER="$SCRIPT_DIR/relink-local-specs.sh"

PASS=0
FAIL=0
expect() {
  local desc="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    PASS=$((PASS+1))
  else
    FAIL=$((FAIL+1))
    echo "FAIL: $desc"
  fi
}

ROOT="$(mktemp -d)"
trap 'rm -rf "$ROOT"' EXIT
# Physical paths: the relinker compares the link text with the targets it derives.
ROOT="$(cd "$ROOT" && pwd -P)"

for layout in today skilled-only whole-link; do
  real=".skilled"
  entries=".skilled"
  case "$layout" in
    today) real=".opencode"; entries=".opencode" ;;
    whole-link) entries=".opencode .skilled" ;;
  esac
  for entry in $entries; do
    development="$ROOT/$layout-${entry#.}/Development"
    code_environment="$development/Code_Environment"
    checkout="$code_environment/Public"
    mkdir -p "$code_environment/Barter/specs" "$code_environment/Websites/anobel.com/specs" \
      "$development/AI_Systems/Barter/specs" "$checkout/$real/bin"
    cp "$RELINKER" "$checkout/$real/bin/relink-local-specs.sh"
    [ "$layout" != "whole-link" ] || ln -s .skilled "$checkout/.opencode"

    set +e
    bash "$checkout/$entry/bin/relink-local-specs.sh" >"$ROOT/$layout-${entry#.}.out" 2>&1
    rc=$?
    set -e

    expect "$layout through $entry: relinker exits 0" test "$rc" -eq 0
    expect "$layout through $entry: barter pointer lands under the checkout's specs" \
      test "$(readlink "$checkout/specs/barter")" = "$code_environment/Barter/specs"
    expect "$layout through $entry: anobel.com pointer lands under the checkout's specs" \
      test "$(readlink "$checkout/specs/anobel.com")" = "$code_environment/Websites/anobel.com/specs"
    expect "$layout through $entry: ai-systems pointer lands under the checkout's specs" \
      test "$(readlink "$checkout/specs/ai-systems")" = "$development/AI_Systems/Barter/specs"
    expect "$layout through $entry: no pointer lands inside the source tree" \
      test ! -e "$checkout/$real/specs"
  done
done

echo "relink-local-specs tests: PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
~~~~
