---
title: "Acceptance Criteria: Phase 13: ux-and-alignment-pass"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ux and alignment pass acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/013-ux-and-alignment-pass"
    last_updated_at: "2026-11-21T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the evidence for each criterion"
    next_safe_action: "Close the review and merged-main rows"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ac-013-ux-and-alignment-pass"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: ux-and-alignment-pass

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 013-ux-and-alignment-pass
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the branch, When `node --test .skilled/commands/doctor/scripts/tests/overlay-engine*.test.cjs` runs, Then it passes 362 or more tests with 0 failing, and each engine fix names a red run | The engine suite on the merged main, recorded in `implementation-summary.md` Verification. Red runs are named in the commit bodies | Unmet | - |
| AC-002 | REQ-002 | Given the merged main, When `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` runs, Then it exits 0 | The drift row in `implementation-summary.md` Verification | Unmet | - |
| AC-003 | REQ-003 | Given the whole branch `65751f8d61a..HEAD`, When `@review` runs over it, Then every slice's final line reads `Review status: APPROVED` with no P0 or P1 | The review rounds table in `implementation-summary.md` | Unmet | - |
| AC-004 | REQ-004 | Given the three alignment runs on `65751f8d61a`, When each finding is checked at the branch tip, Then each is fixed or overturned with a reason | 75 findings: 72 fixed, 3 overturned by the critic as duplicates of fixed findings, the last 3 open ones fixed in `49fe267503f` and `d1e45c3776e` | Met | - |
| AC-005 | REQ-005 | Given a changed refusal, When it prints, Then its first line is unchanged and a why line and a `Next:` line follow, naming the folder to run from | `overlay-engine-next-lines.test.cjs`, `overlay-engine-ux.test.cjs` and the git hook suites assert the first lines and the `Next:` lines | Met | - |
| AC-006 | REQ-006 | Given the merged main, When the deep-loop vitest suite runs, Then it passes in full, including `retries a salvage-miss lineage once` | The deep-loop row in `implementation-summary.md` Verification. Base main failed this one case | Unmet | - |
| AC-007 | REQ-007 | Given the six handoff items, When each is checked, Then each is fixed or recorded with a reason | The handoff table in `implementation-summary.md` | Met | - |

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

**Closeable:** No

The final review and the merged-main gate runs decide closure now.
<!-- /ANCHOR:closure -->
