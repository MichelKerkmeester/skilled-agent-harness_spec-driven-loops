---
title: "Acceptance Criteria: Phase 38: alignment-p1-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment p1 remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation"
    last_updated_at: "2026-11-16T10:42:27Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-038-alignment-p1-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 38: alignment-p1-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `038-alignment-p1-remediation`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four fixes, When the suite runs with `AI_SESSION_CHILD` unset and set to 1 and `FLOOR` and `EVAL` run, Then 0 failed both ways and `FLOOR` and `EVAL` print `before.txt`'s lines | `scratch/after.txt`: build exit 0, 2328 passed 0 failed both ways, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5] | Met | - |
| AC-002 | REQ-002 | Given an ask row and a must-not-start row that write inside an arena under the temp folder, When `startState` judges them with the arena as checkout, Then both are unsafe and a scratch note outside it is not | the three new `startState` cases pass, and the two arena cases fail with the old line restored. After the review a fourth case holds a write into a real folder outside the arena as unsafe | Met | - |
| AC-003 | REQ-003 | Given `:unattended`, `:with-research`, `:with-context` and `:auto:with-research`, When `typedCommandIn` reads them, Then each gives the command, and `:with-everything` and `:auto:draft` give none | `tests/command-attach-guards.vitest.ts` suffix cases pass | Met | - |
| AC-004 | REQ-004 | Given an empty temp folder, When `scratch/hook-health-check.mjs` runs the Pi, DSH and Vibe handler calls, Then each writes a record and the README names all three | `scratch/hook-health.txt` prints `dsh 1 vibe 1 pi 1`; README.md named seven runtimes and the OpenCode plugin as writing none at `38aa768f9da`. Main's later README rewrite, merged in `15d8b463396`, dropped the paragraph, so HEAD carries neither the claim nor its fix | Met | - |
| AC-005 | REQ-005 | Given the rescored stored sets and the alignment run, When the goal log is read, Then each moved unsafe count and each open P0 and P1 row has a fix or a reason | goal rows `Unsafe restated, checkout boundary`, `Correction, phase 037 README claim` and `Alignment final, run 20261116T085341Z`; `scratch/unsafe-rows.txt` and `scratch/compare-probes.txt` | Met | - |
| AC-006 | REQ-006 | Given a skill load of `speckit:complete:auto add auth`, the longest advertised chain, and guarded writes to `/var/tmp/notes.md` and `/tmp`, When `startState` judges them, Then both loads start with self-auto true and neither write is unsafe, and a chain of 100000 suffixes parses in linear time | `tests/command-transcript-score.vitest.ts` new cases pass and three fail on the previous scorer; 100000 suffixes took 12055 ms before and 8 ms after; `scratch/after-pass-nine.txt` | Met | - |

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

**Closeable:** Yes

Every row is Met with the evidence it names.
<!-- /ANCHOR:closure -->
