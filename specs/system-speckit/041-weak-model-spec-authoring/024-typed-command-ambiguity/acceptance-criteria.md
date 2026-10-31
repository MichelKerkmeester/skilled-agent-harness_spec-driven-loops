---
title: "Acceptance Criteria: Phase 24: typed-command-ambiguity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "typed command ambiguity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/024-typed-command-ambiguity"
    last_updated_at: "2026-10-27T08:30:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-024-typed-command-ambiguity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 24: typed-command-ambiguity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `024-typed-command-ambiguity`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the typed prompt "Run /deep:research :auto --max-iterations=8 on the routing packet", When the advisor scores it, Then system-deep-loop is first and `ambiguous` is false | Harness: `rr-iter3-168: system-deep-loop ambiguous false`; live probe: system-deep-loop 0.56469, `ambiguous: false` | Met | - |
| AC-002 | REQ-001 | Given a top that earned its confidence and a member that only reached a floor, When the cluster is built, Then the member joins only on the score margin | `advisor-quality-049-003.vitest.ts` prints `1 failed \| 17 passed (18)` with the exception off and passes with it on | Met | - |
| AC-003 | REQ-002 | Given the 261 labelled routing prompts, When they are scored, Then no top skill changes and correct stays at 202 | Harness: flags 110 to 78, correct 202 to 202, top changes 0 | Met | - |
| AC-004 | REQ-002 | Given the P0 regression set and the Python twin, When they run, Then both pass unchanged | `overall_pass: true`, `failures: []`; `pass=85, fail=0` | Met | - |
| AC-005 | REQ-003 | Given a scorer result with a boolean `ambiguous`, When the brief renders, Then it uses that boolean and names a cluster member after "vs" | `advisor-renderer.vitest.ts` precomputed and "vs" cases pass | Met | - |
| AC-006 | REQ-002 | Given the full advisor suite, When it runs, Then no file fails | `Test Files 150 passed (150)`, `Tests 1253 passed \| 8 skipped (1261)`, rc 0 | Met | - |

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

Every criterion is Met, and recursive strict validation of the packet decides the close.
<!-- /ANCHOR:closure -->
