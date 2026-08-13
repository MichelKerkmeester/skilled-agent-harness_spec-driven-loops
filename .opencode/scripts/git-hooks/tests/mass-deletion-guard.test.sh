#!/usr/bin/env bash
# Test harness for the mass-deletion guard shared lib.
#
# WHY: the guard is the last line between a stale-tree `git add -A` snapshot and
# a destroyed branch, so its verdict logic (threshold, override, add-vs-delete,
# fail-open) must stay provably correct. Runs the lib against a throwaway repo
# with its own isolated hooksPath so no machine-global hook interferes.
#
# Exit 0 = all pass, 1 = any failure.

set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GUARD="$HERE/../lib/mass-deletion-guard.sh"

if [[ ! -f "$GUARD" ]]; then
  echo "FAIL: guard lib not found at $GUARD" >&2
  exit 1
fi

pass=0; fail=0
chk() { # <actual-rc> <expected-rc> <name>
  if [[ "$1" == "$2" ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (rc=$1 want $2)"; fail=$((fail + 1)); fi
}

# ── Unit: verdict logic, sourced directly (no git needed) ──
# shellcheck source=/dev/null
. "$GUARD"
( mass_deletion_verdict 50 ); chk "$?" 0 "verdict: 50<=100 allows"
( mass_deletion_verdict 100 ); chk "$?" 0 "verdict: 100==threshold allows"
( mass_deletion_verdict 101 ); chk "$?" 1 "verdict: 101>100 blocks"
( SPECKIT_ALLOW_MASS_DELETION=1 mass_deletion_verdict 9999 ); chk "$?" 0 "verdict: override allows any count"
( SPECKIT_MASS_DELETION_THRESHOLD=10 mass_deletion_verdict 11 ); chk "$?" 1 "verdict: custom threshold blocks"
( mass_deletion_verdict "" ); chk "$?" 0 "verdict: empty count fails open"
( mass_deletion_verdict "abc" ); chk "$?" 0 "verdict: non-numeric fails open"
( SPECKIT_MASS_DELETION_THRESHOLD=bad mass_deletion_verdict 50 ); chk "$?" 0 "verdict: bad threshold defaults to 100 (allows 50)"

# ── Integration: real commits in an isolated repo ──
T="$(mktemp -d "${TMPDIR:-/tmp}/mdg-guard-test.XXXXXX")"
trap 'rm -rf "$T"' EXIT
(
  cd "$T" || exit 1
  git init -q
  git config core.hooksPath "$T/.githooks"   # isolate from any global hooksPath
  git config user.email t@t; git config user.name t; git config commit.gpgsign false
  mkdir -p "$T/.githooks"
  cat > "$T/.githooks/pre-commit" <<EOF
#!/usr/bin/env bash
set -euo pipefail
. "$GUARD"
d="\$(mass_deletion_staged_count)"
if ! mass_deletion_verdict "\$d"; then mass_deletion_report commit "\$d" "(staged)"; exit 1; fi
exit 0
EOF
  chmod +x "$T/.githooks/pre-commit"

  for i in $(seq 1 160); do echo x > "f$i"; done
  git add -A; git commit -qm seed
) ; chk "$?" 0 "integration: add-160 allowed (adds never blocked)"

( cd "$T" && git rm -q f{1..130} && git commit -qm d130 ) >/dev/null 2>&1
chk "$?" 1 "integration: delete-130 blocked (>100)"

( cd "$T" && SPECKIT_ALLOW_MASS_DELETION=1 git commit -qm d130ok ) >/dev/null 2>&1
chk "$?" 0 "integration: override allows delete-130"

( cd "$T" && for i in $(seq 1 60); do echo z > "h$i"; done && git add -A && git commit -qm h60 && git rm -q h{1..40} && git commit -qm d40 ) >/dev/null 2>&1
chk "$?" 0 "integration: delete-40 allowed (<100)"

echo "--- mass-deletion-guard: $pass passed, $fail failed ---"
[[ "$fail" -eq 0 ]]
