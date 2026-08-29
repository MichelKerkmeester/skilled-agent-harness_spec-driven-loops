#!/usr/bin/env bash
# Unit tests for the AC_COVERAGE rule.
#
# The defect these cases exist to prevent: the total is counted from
# acceptance-criteria.md while the evidence was read from a separate
# traceability table. Two documents, one ratio - so a packet that documented
# every criterion still reported zero coverage. Each case below pins one half
# of that ratio to the same document.

set -uo pipefail
RULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../rules" && pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PASS=0; FAIL=0

# A packet the gate will consider live: Level 2+, and a summary claiming a
# status the lifecycle check accepts.
mkpacket() {
    mkdir -p "$1"
    printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n' > "$1/spec.md"
    printf '# Implementation Summary\n\n| Field | Value |\n|-------|-------|\n| **Status** | Complete |\n' > "$1/implementation-summary.md"
}

ac() { printf '%s\n' "$2" > "$1/acceptance-criteria.md"; }

AC_HEAD='| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|'

# Reports "covered/total" out of the advisory message so a case asserts the
# ratio, not the severity - the rule is advisory and never changes status.
expect() {
    local name="$1" want="$2" dir="$3" lvl="${4:-2}"
    local got
    got="$( set +e
        RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_NAME=""; RULE_REMEDIATION=""
        source "$RULE_DIR/check-ac-coverage.sh"
        run_check "$dir" "$lvl" >/dev/null 2>&1
        if [[ "$RULE_MESSAGE" =~ ([0-9]+)/([0-9]+)\ ACs ]]; then
            printf '%s/%s' "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}"
        elif [[ "$RULE_MESSAGE" == *"not active"* ]]; then printf 'inactive'
        elif [[ "$RULE_MESSAGE" == *"no-op"* ]]; then printf 'noop'
        else printf 'NONE'; fi )"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

# Reports which file the traceability fallback chose.
expect_source() {
    local name="$1" want="$2" dir="$3"
    local got
    got="$( set +e
        source "$RULE_DIR/check-ac-coverage.sh"
        basename "$(_ac_traceability_file "$dir" 2>/dev/null)" 2>/dev/null || printf 'none' )"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

echo "CASE                                                   RESULT"
echo "------------------------------------------------------ ------"

# The pre-fix symptom: every criterion documented, none of it counted.
d="$TMP/prose"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | Case: the thing was checked | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | Live run across five folders | Met | - |"
expect "prose verification counts as no evidence" "0/2" "$d"

d="$TMP/cited"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`scripts/tests/a.sh:35\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | \`lib/b.ts:206\` names the path | Met | - |"
expect "file:line in the Verification cell is evidence" "2/2" "$d"

d="$TMP/waived"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | - | Waived | ADR-004 |"
expect "a waived criterion needs no citation" "2/2" "$d"

d="$TMP/superseded"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | - | Superseded | ADR-007 |"
expect "a superseded criterion needs no citation" "1/1" "$d"

d="$TMP/mixed"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | \`b.sh:2\` | Met | - |
| AC-003 | REQ-003 | Given x, When y, Then z | - | Waived | ADR-001 |
| AC-004 | REQ-004 | Given x, When y, Then z | it was checked by hand | Met | - |
| AC-005 | REQ-005 | Given x, When y, Then z | - | Met | - |"
expect "cited and retired count, prose and blank do not" "3/5" "$d"

# An added column must not shift the read: columns bind by header name.
d="$TMP/shifted"; mkpacket "$d"; ac "$d" '| AC-ID | REQ | Owner | Given / When / Then | Verification | Status | Waiver |
|-------|-----|-------|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | me | Given x, When y, Then z | `a.sh:9` | Met | - |'
expect "an extra column does not shift Verification" "1/1" "$d"

d="$TMP/fenced"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |

\`\`\`text
| AC-999 | REQ-999 | fenced example | \`x.sh:1\` | Met | - |
\`\`\`"
expect "a fenced example is not a criterion" "1/1" "$d"

# The canonical document alone activates the gate; a packet needs no
# traceability table to be measured.
d="$TMP/nolegacy"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |"
expect "canonical doc alone activates the gate" "1/1" "$d"

d="$TMP/empty"; mkpacket "$d"; ac "$d" "$AC_HEAD"
expect "a criteria table with no rows is a no-op" "noop" "$d"

d="$TMP/nothing"; mkpacket "$d"
expect "no criteria and no source is inactive" "inactive" "$d"

d="$TMP/l1"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |"
expect "the gate stays off below Level 2" "inactive" "$d" 1

# Source precedence: the merged document wins, the pre-merge file is fallback.
d="$TMP/both"; mkpacket "$d"
printf '# Tasks\n<!-- ANCHOR:protocol -->\n## Verification Protocol\n<!-- /ANCHOR:protocol -->\n' > "$d/tasks.md"
printf '# Checklist\n' > "$d/checklist.md"
expect_source "merged tasks.md wins over a stale checklist.md" "tasks.md" "$d"

d="$TMP/legacyonly"; mkpacket "$d"; printf '# Checklist\n' > "$d/checklist.md"
expect_source "a pre-merge packet still reads checklist.md" "checklist.md" "$d"

d="$TMP/unmerged"; mkpacket "$d"; printf '# Tasks\n' > "$d/tasks.md"
printf '# Checklist\n' > "$d/checklist.md"
expect_source "tasks.md without the protocol anchor is not a source" "checklist.md" "$d"

echo
printf '  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
