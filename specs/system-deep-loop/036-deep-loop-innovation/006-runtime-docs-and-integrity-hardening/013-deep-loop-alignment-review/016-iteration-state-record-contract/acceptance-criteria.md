---
title: "Acceptance Criteria: Phase 16: iteration-state-record-contract"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "iteration contract acceptance"
  - "iteration record closure gate"
  - "run field acceptance criteria"
  - "state record contract criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/016-iteration-state-record-contract"
    last_updated_at: "2026-09-16T19:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-016-iteration-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: iteration-state-record-contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/016-iteration-state-record-contract
**Level:** 2
**Status:** Complete
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an iteration record carrying only `iteration: 2`, When the review reducer builds the dashboard, Then the progress row reads `\| 2 \| dim-iteration-only \|` and no row reads `\| undefined \|` | `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:173` failed before and passes after the change at `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1884` | Met | - |
| AC-002 | REQ-002 | Given every template, agent, code file and document that writes an iteration record, When searched for a record naming `run` without `iteration`, Then none is found | The last run-only writer, `.opencode/commands/deep/assets/deep-research-auto.yaml:1836`, now writes `iteration`; the multi-line search finds none on the tree and flags that line in the pre-change file | Met | - |
| AC-003 | REQ-003 | Given the deep-research and deep-review state documents, When read, Then `iteration` is the required field, `run` is marked legacy, and event records keep `run` | `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:110` and `.opencode/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:95`; `validate_document.py` reports 0 issues on each | Met | - |
| AC-004 | REQ-004 | Given the deep-loop runtime test suite, When run after the change, Then nothing fails | 154 of 154 test files, 2,681 passed, 8 skipped, 0 failed, recorded at `implementation-summary.md:105` | Met | - |
| AC-005 | REQ-002 | Given the changed command template, When the contract compiler runs, Then its output is identical to the committed compiled contract | `.opencode/commands/deep/assets/compiled/deep-research.contract.md:25` carries the new template hash; compiler dry-run output is byte-identical | Met | - |

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

The regression test and the whole runtime suite carried the packet. Event records' `run` field, the research reducer's inert candidate value and the preference order inside `readIterationNumber()` were consciously left unchanged.
<!-- /ANCHOR:closure -->
