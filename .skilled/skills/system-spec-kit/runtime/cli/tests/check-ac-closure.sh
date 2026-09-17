#!/usr/bin/env bash
# Unit tests for the AC_CLOSURE rule.
#
# Each case pins a behaviour that a silent regression would otherwise hide:
# a criterion row that stops parsing, a waiver that stops being verified, or a
# grandfathered packet that starts failing. The gate exists to block a false
# completion claim, so every "should fail" case here is load-bearing.

set -uo pipefail

RULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rules" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

PASS=0; FAIL=0

mkspec() { # mkspec <dir> <created> <status>
    mkdir -p "$1"
    printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n| **Status** | %s |\n| **Created** | %s |\n' "$3" "$2" > "$1/spec.md"
}
mkac() { printf '# Acceptance Criteria\n\n| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |\n|-------|-----|---------------------|--------------|--------|--------|\n%s\n' "$2" > "$1/acceptance-criteria.md"; }
mkdr() { printf '# Decision Record\n\n%s\n' "$2" > "$1/decision-record.md"; }

expect() { # expect <case> <want> <dir>
    local name="$1" want="$2" dir="$3"
    local got
    got="$(
        set +e
        RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_NAME=""; RULE_REMEDIATION=""
        source "$RULE_DIR/check-ac-closure.sh"
        run_check "$dir" "2" >/dev/null 2>&1
        printf '%s' "${RULE_STATUS:-ERROR}"
    )"
    if [[ "$got" == "$want" ]]; then
        PASS=$((PASS+1)); printf '  ok    %-56s %s\n' "$name" "$got"
    else
        FAIL=$((FAIL+1)); printf '  FAIL  %-56s want=%s got=%s\n' "$name" "$want" "$got"
    fi
}

POST="2026-12-01"   # after the default cutoff
ON="2026-08-30"     # exactly the cutoff day
PRE="2026-01-01"

# --- rollout boundary -------------------------------------------------------
d="$TMP/on-cutoff";   mkspec "$d" "$ON"   "In Progress";                      expect "cutoff day itself is grandfathered"        info "$d"
d="$TMP/post-nodoc";  mkspec "$d" "$POST" "In Progress";                      expect "after cutoff, missing document blocks"     fail "$d"
d="$TMP/pre-nodoc";   mkspec "$d" "$PRE"  "In Progress";                      expect "before cutoff, missing document advisory"  info "$d"

# --- grandfathering applies to every branch, not just presence --------------
d="$TMP/pre-unmet";   mkspec "$d" "$PRE"  "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Unmet | - |';   expect "pre-cutoff completion claim stays advisory" info "$d"
d="$TMP/pre-dangle";  mkspec "$d" "$PRE"  "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-777 |'
                      mkdr "$d" '## ADR-001: real';                           expect "pre-cutoff dangling waiver stays advisory" info "$d"

# --- the core gate ----------------------------------------------------------
d="$TMP/post-unmet";  mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Unmet | - |';   expect "completion claim with unmet criterion"     fail "$d"
d="$TMP/post-wip";    mkspec "$d" "$POST" "In Progress"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Unmet | - |';   expect "unmet criterion mid-flight does not block"  info "$d"
d="$TMP/post-met";    mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | ev.sh:1 | Met | - |'; expect "all met is closeable"                    pass "$d"

# --- rows that must never vanish silently -----------------------------------
d="$TMP/bold";        mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| **AC-001** | REQ-001 | g | - | Unmet | - |'; expect "bold id still counts"                    fail "$d"
d="$TMP/tick";        mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| `AC-001` | REQ-001 | g | - | Unmet | - |';   expect "backticked id still counts"              fail "$d"
d="$TMP/lower";       mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| ac-001 | REQ-001 | g | - | Unmet | - |';     expect "lowercase id still counts"               fail "$d"
d="$TMP/dotted";      mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-01.2 | REQ-001 | g | - | Unmet | - |';    expect "unparseable id is reported"              fail "$d"
d="$TMP/fence";       mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | ev:1 | Met | - |
```
| AC-002 | REQ-002 | g | - | Unmet | - |';                                      expect "unbalanced fence is reported"            fail "$d"
d="$TMP/dupe";        mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | ev:1 | Met | - |
| AC-001 | REQ-002 | g | ev:2 | Met | - |';                                     expect "duplicate ids are reported"              fail "$d"

# --- completion detection reads the cell, not the line ----------------------
for s in "Not Complete" "Incomplete" "Abandoned" "Blocked - nothing done yet"; do
    d="$TMP/st-$(echo "$s" | tr -cd '[:alnum:]')"; mkspec "$d" "$POST" "$s"
    mkac "$d" '| AC-001 | REQ-001 | g | - | Unmet | - |'
    expect "status '$s' is not a completion claim" info "$d"
done

# --- column binding by header name ------------------------------------------
d="$TMP/extracol";    mkspec "$d" "$POST" "Complete"
                      printf '# AC\n\n| AC-ID | REQ | Given | Verification | Owner | Status | Waiver |\n|---|---|---|---|---|---|---|\n| AC-001 | REQ-001 | g | ev:1 | me | Met | - |\n' > "$d/acceptance-criteria.md"
                      expect "extra column does not shift Status"             pass "$d"
d="$TMP/esc";         mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | given a\|b | ev:1 | Met | - |'; expect "escaped pipe does not shift Status"  pass "$d"

# --- waiver verification ----------------------------------------------------
d="$TMP/adr-fenced";  mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-001 |'
                      printf '# DR\n\n```\n## ADR-001: only an example\n```\n' > "$d/decision-record.md"
                      expect "fenced ADR does not satisfy a waiver"           fail "$d"
d="$TMP/adr-bold";    mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-001 |'
                      mkdr "$d" '- **ADR-001**: retired on purpose';          expect "bold list ADR satisfies a waiver"           pass "$d"
d="$TMP/adr-table";   mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-001 |'
                      mkdr "$d" '| **ADR-001** | retired on purpose |';       expect "table-row ADR satisfies a waiver"           pass "$d"
d="$TMP/adr-pad";     mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-1 |'
                      mkdr "$d" '## ADR-001: retired on purpose';             expect "ADR-1 and ADR-001 are the same record"      pass "$d"
d="$TMP/adr-miss";    mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | ADR-009 |'
                      mkdr "$d" '## ADR-001: real';                           expect "waiver citing a missing ADR fails"          fail "$d"
d="$TMP/adr-none";    mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | - |'
                      mkdr "$d" '## ADR-001: real';                           expect "waiver naming no ADR fails"                 fail "$d"
d="$TMP/adr-multi";   mkspec "$d" "$POST" "Complete"
                      mkac "$d" '| AC-001 | REQ-001 | g | - | Waived | see ADR-001 and ADR-002 |'
                      mkdr "$d" '## ADR-002: only this one';                  expect "every cited ADR must exist"                 fail "$d"

# --- flag handling ----------------------------------------------------------
d="$TMP/flagbad";     mkspec "$d" "$POST" "In Progress"
                      SPECKIT_AC_CLOSURE=maybe expect "non-boolean flag keeps the gate on" fail "$d"
d="$TMP/cutoffbad";   mkspec "$d" "$POST" "In Progress"
                      SPECKIT_AC_CLOSURE_CUTOFF=notadate expect "malformed cutoff falls back, not grandfather-all" fail "$d"

printf '\n  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
