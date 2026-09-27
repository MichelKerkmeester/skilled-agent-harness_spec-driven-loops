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
        resolved="$(_ac_traceability_file "$dir" 2>/dev/null)" || resolved=""
        if [[ -n "$resolved" ]]; then basename "$resolved"; else printf 'none'; fi )"
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

# A column BEFORE AC-ID is the case that matters: it shifts the count path, not
# the evidence path, and a zero count short-circuits the gate to "no criteria
# found" - the packet goes unmeasured instead of reporting a low ratio.
d="$TMP/shifted-left"; mkpacket "$d"; ac "$d" '| Owner | AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-------|-----|---------------------|--------------|--------|--------|
| me | AC-001 | REQ-001 | Given x, When y, Then z | `a.sh:1` | Met | - |
| me | AC-002 | REQ-002 | Given x, When y, Then z | `b.sh:2` | Met | - |'
expect "a column before AC-ID does not zero the count" "2/2" "$d"

# "Incomplete" contains "complete"; a substring test on the rendered row
# activates the gate on a packet that says it is not finished.
d="$TMP/incomplete"; mkpacket "$d"
printf '# Implementation Summary\n\n| Field | Value |\n|-------|-------|\n| **Status** | Incomplete |\n' > "$d/implementation-summary.md"
ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |"
expect "an Incomplete packet does not activate the gate" "inactive" "$d"

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

# Source resolution: only the merged document qualifies.
d="$TMP/merged"; mkpacket "$d"
printf '# Tasks\n<!-- ANCHOR:protocol -->\n## Verification Protocol\n<!-- /ANCHOR:protocol -->\n' > "$d/tasks.md"
expect_source "the merged tasks document is the traceability source" "tasks.md" "$d"

# The standalone document is retired: a stray copy must not become a source again.
d="$TMP/strays"; mkpacket "$d"; printf '# Checklist\n' > "$d/checklist.md"
expect_source "a stray pre-merge copy is not a source" "none" "$d"

d="$TMP/unmerged"; mkpacket "$d"; printf '# Tasks\n' > "$d/tasks.md"
expect_source "tasks.md without the protocol anchor is not a source" "none" "$d"

# ── enforcement cutoff and lifecycle fallback ────────────────────────
expect_status() {
    local name="$1" want="$2" dir="$3"
    local got
    got="$( set +e
        RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_NAME=""; RULE_REMEDIATION=""
        source "$RULE_DIR/check-ac-coverage.sh"
        run_check "$dir" 2 >/dev/null 2>&1
        printf '%s' "$RULE_STATUS" )"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}
mkdated() {
    mkpacket "$1"
    printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n| **Created** | %s |\n' "$2" > "$1/spec.md"
}
UNDER="$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | checked by hand | Met | - |
| AC-003 | REQ-003 | Given x, When y, Then z | checked by hand | Met | - |"
d="$TMP/after-cutoff"; mkdated "$d" "2026-09-01"; ac "$d" "$UNDER"
SPECKIT_AC_COVERAGE_ENFORCE=true expect_status "enforce fails a post-cutoff packet under the floor" "fail" "$d"
d="$TMP/before-cutoff"; mkdated "$d" "2026-08-30"; ac "$d" "$UNDER"
SPECKIT_AC_COVERAGE_ENFORCE=true expect_status "enforce stays advisory on or before the cutoff" "pass" "$d"
d="$TMP/undated"; mkpacket "$d"; ac "$d" "$UNDER"
SPECKIT_AC_COVERAGE_ENFORCE=true expect_status "enforce stays advisory with no creation date" "pass" "$d"
d="$TMP/moved-cutoff"; mkdated "$d" "2026-09-01"; ac "$d" "$UNDER"
SPECKIT_AC_COVERAGE_ENFORCE=true SPECKIT_AC_COVERAGE_CUTOFF=2026-09-15 expect_status "a later cutoff grandfathers the packet" "pass" "$d"
SPECKIT_AC_COVERAGE_ENFORCE=true SPECKIT_AC_COVERAGE_CUTOFF=soon expect_status "a malformed cutoff falls back to the default" "fail" "$d"
d="$TMP/no-enforce"; mkdated "$d" "2026-09-01"; ac "$d" "$UNDER"
expect_status "without the switch a post-cutoff packet is advisory" "pass" "$d"
d="$TMP/criteria-status"; mkdir -p "$d"
printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n' > "$d/spec.md"
printf '# Implementation Summary\n\nNo status table here.\n' > "$d/implementation-summary.md"
printf '%s\n' "**Status:** Complete" "" "$AC_HEAD" '| AC-001 | REQ-001 | Given x, When y, Then z | `a.sh:1` | Met | - |' > "$d/acceptance-criteria.md"
expect "a Complete criteria document activates the gate alone" "1/1" "$d"
d="$TMP/criteria-draft"; mkdir -p "$d"
printf '# Spec\n\n| Field | Value |\n|-------|-------|\n| **Level** | 2 |\n' > "$d/spec.md"
printf '%s\n' "**Status:** Draft" "" "$AC_HEAD" '| AC-001 | REQ-001 | Given x, When y, Then z | `a.sh:1` | Met | - |' > "$d/acceptance-criteria.md"
expect "a Draft criteria document with no summary stays inactive" "inactive" "$d"
d="$TMP/manual"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | Manual-infeasible: the behaviour is a live operator observation of the CI dashboard | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | Manual-infeasible | Met | - |"
expect "a Manual-infeasible row with a rationale counts, a bare one does not" "1/2" "$d"

expect_analysis() {
    local name="$1" want="$2" file="$3"
    local got want_display got_display
    got="$( set +e
        source "$RULE_DIR/check-ac-coverage.sh"
        _ac_analyze_canonical "$file" )"
    if [[ "$got" == "$want" ]]; then
        got_display="${got//$'\t'/|}"
        PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got_display"
    else
        want_display="${want//$'\t'/|}"
        got_display="${got//$'\t'/|}"
        FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want_display" "$got_display"
    fi
}

d="$TMP/analysis-cites"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` and \`gone.sh:2\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | checked by hand | Met | - |"
expect_analysis "the parser lists every citation of a counted row" $'2\t1\t1\tAC-002\tAC-001 (a.sh:1), AC-001 (gone.sh:2)' "$d/acceptance-criteria.md"

d="$TMP/analysis-empty"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | - | Superseded | ADR-007 |"
expect_analysis "empty id and citation lists are written as -" $'1\t1\t0\t-\t-' "$d/acceptance-criteria.md"

expect_unresolved() {
    local name="$1" want="$2" folder="$3" root="$4" list="$5"
    local got
    got="$( set +e
        source "$RULE_DIR/check-ac-coverage.sh"
        _ac_unresolved_citations "$folder" "$root" "$list" )"
    if [[ -z "$got" ]]; then got="none"; fi
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

d="$TMP/resolve"; mkdir -p "$d/sub" "$TMP/rootdir/tools"; printf 'one\ntwo\nthree' > "$d/sub/a.sh"; printf 'one\n' > "$TMP/rootdir/tools/r.sh"
expect_unresolved "a citation inside the file resolves" "none" "$d" "" "AC-001 (sub/a.sh:3), AC-002 ($d/sub/a.sh:1)"
expect_unresolved "a missing file and line 0 or past the end do not" "AC-001 (nope.sh:1), AC-002 (sub/a.sh:0), AC-003 (sub/a.sh:4)" "$d" "" "AC-001 (nope.sh:1), AC-002 (sub/a.sh:0), AC-003 (sub/a.sh:4)"
expect_unresolved "a directory and an ellipsis path do not resolve" "AC-001 (./sub:1), AC-002 (.../a.sh:1)" "$d" "" "AC-001 (./sub:1), AC-002 (.../a.sh:1)"
expect_unresolved "the root is tried after the packet folder" "none" "$d" "$TMP/rootdir" "AC-001 (tools/r.sh:1)"
expect_unresolved "an empty list reports nothing" "none" "$d" "" ""

expect_detail() {
    local name="$1" want="$2" dir="$3"
    local got
    got="$( set +e
        RULE_STATUS=""; RULE_MESSAGE=""; RULE_DETAILS=(); RULE_NAME=""; RULE_REMEDIATION=""
        source "$RULE_DIR/check-ac-coverage.sh"
        run_check "$dir" 2 >/dev/null 2>&1
        hit=""
        for detail in "${RULE_DETAILS[@]+"${RULE_DETAILS[@]}"}"; do
            if [[ "$detail" == "Unresolved evidence citation(s):"* ]]; then
                hit="$detail"
                break
            fi
        done
        if [[ -n "$hit" ]]; then printf '%s' "$hit"; else printf 'none'; fi )"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-54s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-54s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

d="$TMP/detail"; mkpacket "$d"; printf 'one\ntwo\n' > "$d/a.sh"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:2\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | \`a.sh:1\` and \`missing-cite.sh:4\` | Met | - |
| AC-003 | REQ-003 | Given x, When y, Then z | \`a.sh:9\` | Met | - |"
expect_detail "unresolved citations are named with their AC id" "Unresolved evidence citation(s): AC-002 (missing-cite.sh:4), AC-003 (a.sh:9)" "$d"
expect "an unresolved citation still counts as coverage" "3/3" "$d"

d="$TMP/detail-clean"; mkpacket "$d"; printf 'one\n' > "$d/a.sh"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`a.sh:1\` | Met | - |"
expect_detail "resolving citations add no detail" "none" "$d"

d="$TMP/later"; mkpacket "$d"; ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`later.sh:1\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | checked by hand | Met | - |"
expect "the ratio before the cited file exists" "1/2" "$d"
printf 'one\n' > "$d/later.sh"
expect "the ratio after the cited file exists is the same" "1/2" "$d"

d="$TMP/repo/specs/p"; mkpacket "$d"; mkdir -p "$TMP/repo/tools"; printf 'one\ntwo\n' > "$TMP/repo/tools/r.sh"
git -C "$TMP/repo" init -q
ac "$d" "$AC_HEAD
| AC-001 | REQ-001 | Given x, When y, Then z | \`tools/r.sh:2\` | Met | - |
| AC-002 | REQ-002 | Given x, When y, Then z | \`tools/r.sh:3\` | Met | - |"
expect_detail "a path from the repository root resolves" "Unresolved evidence citation(s): AC-002 (tools/r.sh:3)" "$d"

d="$TMP/legacy"; mkpacket "$d"; printf 'one\ntwo\n' > "$d/a.sh"
printf '%s\n' '# Tasks' '<!-- ANCHOR:protocol -->' '| AC-ID | Class | Evidence |' '|-------|-------|----------|' \
    '| AC-001 | tested | a.sh:2 |' '| AC-002 | tested | missing-cite.sh:3 |' '<!-- /ANCHOR:summary -->' > "$d/tasks.md"
expect_detail "the legacy table names an unresolved citation" "Unresolved evidence citation(s): AC-002 (missing-cite.sh:3)" "$d"
expect "the legacy ratio is unchanged" "2/2" "$d"

d="$TMP/legacy-clean"; mkpacket "$d"; printf 'one\ntwo\n' > "$d/a.sh"
printf '%s\n' '# Tasks' '<!-- ANCHOR:protocol -->' '| AC-ID | Class | Evidence |' '|-------|-------|----------|' \
    '| AC-001 | tested | a.sh:2 |' '<!-- /ANCHOR:summary -->' > "$d/tasks.md"
expect_detail "a resolving legacy citation adds no detail" "none" "$d"

echo
printf '  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
