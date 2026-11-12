---
title: "Acceptance Criteria: Phase 2: bind-single-entry-executors-to-single-path"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "executor matrix acceptance criteria"
  - "single-lineage executor acceptance"
  - "research review contract acceptance"
  - "executor routing closure criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path"
    last_updated_at: "2026-11-12T00:16:34Z"
    last_updated_by: "codex"
    recent_action: "Verified the pre-edit baseline, task evidence, and acceptance criteria"
    next_safe_action: "Continue with phase 003-refuse-single-lineage-fanout-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-bind-single-entry-executors-to-single-path"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 2: bind-single-entry-executors-to-single-path

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-bind-single-entry-executors-to-single-path
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four maintained research and review policy sources are ready to update, When an --executors matrix expands to exactly one lineage, Then the sources select config.executor, send two or more lineages to config.fanout and preserve the repeated-flag and count-above-one fan-out triggers | T002-T008 printed OK, T007 also printed 1, and T011 printed 11 then `no old policy wording` (all exit 0); see tasks.md:44-50 and :60 | Met | - |
| AC-002 | REQ-002 | Given the four maintained policy sources have been updated, When the research and review contracts are regenerated from those sources, Then both generated contracts contain the same one-lineage and two-or-more-lineage branches | Both `--write` commands exited 0 in the build record; this closeout's fresh T009/T010 comparisons each printed 2 and `diff -q` emitted no difference, and T011 printed 11 then `no old policy wording` (all exit 0); see tasks.md:51-52, :60, and ../scratch/build-evidence.md:50 | Met | - |

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

Both criteria are Met with the task evidence above. Final strict validation printed RESULT: PASSED (errors=0 warnings=0) (exit 0).
<!-- /ANCHOR:closure -->
