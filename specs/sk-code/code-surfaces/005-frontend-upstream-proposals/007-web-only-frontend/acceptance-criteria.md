---
title: "Acceptance Criteria: Phase 7: web-only-frontend"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "web only frontend acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/005-frontend-upstream-proposals/007-web-only-frontend"
    last_updated_at: "2026-11-03T18:25:28Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: web-only-frontend

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/code-surfaces/005-frontend-upstream-proposals/007-web-only-frontend`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final state, When `rg -n "FRONTEND_NATIVE\|NATIVE_(A11Y\|LAYOUT_TEXT\|INPUTS\|LISTS_MOTION\|PLATFORM)\|react-native-layout\|native-(accessibility\|inputs\|layout\|lists\|platform)" .skilled/skills/sk-code` runs, Then it prints nothing | No output, exit 1; the earlier broad pattern also matched the unrelated `NATIVE_DIST_MISSING` advisor banner, so the pattern names the six removed intents | Met | - |
| AC-002 | REQ-002 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` and `compiled-route-admission.cjs --all` run, Then both pass with `fail 0` | `scratch/final-suites.txt`: 101/101 exit 0; every hub passes admission | Met | - |
| AC-003 | REQ-003 | Given the last edit, When reach runs on every hub at concurrency 2, Then each prints `outranked=  0` and `wrong-hub=  0` | `scratch/reach-final.txt`: seven hubs, `RESULT: PASSED` | Met | - |
| AC-004 | REQ-004 | Given the hub docs, When the unsupported lists and the router ownership sentence are read, Then React Native is unsupported and lives in a project fork | `ROUTER.md:189` and `:213`, the quality floor UNKNOWN row and `unknown-fallback.md:11` | Met | - |
| AC-005 | REQ-005 | Given the two decision records, When they are read, Then this phase's ADR-001 is Accepted and phase 001's ADR-001 is Superseded | `001-frontend-surface-mode/decision-record.md:41` | Met | - |
| AC-006 | REQ-006 | Given the packet, When `validate.sh --strict --recursive` runs on the parent, Then every folder prints `RESULT: PASSED` | Validator output at phase close | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with evidence observed from the final state.
<!-- /ANCHOR:closure -->
