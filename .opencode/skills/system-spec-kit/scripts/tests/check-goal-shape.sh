#!/usr/bin/env bash
# Unit tests for the GOAL_SHAPE rule.
#
# Each case pins a way a goal document stops being usable: a directive that
# cannot be told from its log, a parent that binds a child it does not have, or
# a durable slice too long for an operator to paste into a session objective.

set -uo pipefail
RULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rules" && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PASS=0; FAIL=0

mkspec() { mkdir -p "$1"; printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n' > "$1/spec.md"; }
goal() { printf '%s\n' "$2" > "$1/goal.md"; }

DUR='## 1. DURABLE DIRECTIVE

**Objective:** Short and checkable.
'
COMP='## 3. COMPLETION CRITERIA

- [ ] A check
'
LOG='## 4. LOG

Progress goes here.
'
BIND='## 2. BINDING

| Phase | Goal document |
|-------|---------------|
| 001-a | `001-a/goal.md` |
'

expect() {
    local name="$1" want="$2" dir="$3" lvl="${4:-2}"
    local got
    got="$( set +e
        RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_NAME=""; RULE_REMEDIATION=""
        is_phase_parent() { return 1; }
        source "$RULE_DIR/check-goal-shape.sh"
        run_check "$dir" "$lvl" >/dev/null 2>&1
        printf '%s' "${RULE_STATUS:-ERROR}" )"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

echo "CASE                                                   STATUS"
echo "------------------------------------------------------ ------"

d="$TMP/none";   mkspec "$d";                                            expect "no goal document is a no-op"            pass "$d"
d="$TMP/ok";     mkspec "$d"; goal "$d" "$DUR$COMP$LOG";                 expect "well-formed leaf passes"                pass "$d"
d="$TMP/nodur";  mkspec "$d"; goal "$d" "$COMP$LOG";                     expect "missing durable heading is reported"    warn "$d"
d="$TMP/nolog";  mkspec "$d"; goal "$d" "$DUR$COMP";                     expect "missing log heading is reported"        warn "$d"
d="$TMP/nocomp"; mkspec "$d"; goal "$d" "$DUR$LOG";                      expect "missing completion criteria reported"   warn "$d"

# a parent that names a child it does not have
d="$TMP/badchild"; mkspec "$d"; goal "$d" "$DUR$BIND$COMP$LOG";          expect "parent binding a missing child fails"   warn "$d" phase
# same parent once the child exists
d="$TMP/goodchild"; mkspec "$d"; mkdir -p "$d/001-a"; : > "$d/001-a/goal.md"
                    goal "$d" "$DUR$BIND$COMP$LOG";                      expect "parent binding an existing child passes" pass "$d" phase
# a parent with no binding block at all
d="$TMP/nobind"; mkspec "$d"; goal "$d" "$DUR$COMP$LOG";                 expect "phase parent without binding reported"  warn "$d" phase

# durable budget
d="$TMP/big"; mkspec "$d"
big="## 1. DURABLE DIRECTIVE

$(head -c 2500 < /dev/zero | tr '\0' 'x')
$COMP$LOG"
goal "$d" "$big";                                                        expect "over-budget durable slice reported"     warn "$d"
# the same slice that busts the leaf budget fits a parent's larger one, so the
# only difference between these two cases is the shape, not the content
d="$TMP/bigparent"; mkspec "$d"; mkdir -p "$d/001-a"; : > "$d/001-a/goal.md"
bigparent="## 1. DURABLE DIRECTIVE

$(head -c 2500 < /dev/zero | tr '\0' 'x')
$BIND$COMP$LOG"
goal "$d" "$bigparent";                                                  expect "same slice fits the larger parent budget" pass "$d" phase

# flag off
d="$TMP/off"; mkspec "$d"; goal "$d" "$COMP"
SPECKIT_GOAL_SHAPE=false expect "disabled flag silences the rule"        pass "$d"

printf '\n  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
