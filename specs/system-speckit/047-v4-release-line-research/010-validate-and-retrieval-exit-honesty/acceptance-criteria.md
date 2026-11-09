---
title: "Acceptance Criteria: Phase 10: validate-and-retrieval-exit-honesty"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "validate and retrieval exit honesty acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/010-validate-and-retrieval-exit-honesty"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: validate-and-retrieval-exit-honesty

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `010-validate-and-retrieval-exit-honesty`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture packet whose SOURCE_TAGS helper cannot run, When `validate.sh --strict` runs, Then it prints `RESULT: FAILED`, and without `--strict` it prints a warning | `validation-exit-honesty.vitest.ts` strict and non-strict cases pass | Met | - |
| AC-002 | REQ-002 | Given any packet, When `validate.sh` runs without a routing payload, Then CROSS_ANCHOR_CONTAMINATION prints a non-pass, non-error marker | validate on phase 001 prints no `+ CROSS_ANCHOR` line and `i CROSS_ANCHOR_CONTAMINATION` under `--verbose` | Met | - |
| AC-003 | REQ-003 | Given the committed index, When the lookup runs a misspelled query with and without `--scoring-only`, Then both exit 1, and a real phrase exits 0 | probe exit codes 1, 1 and 0; `trigger-index.vitest.ts` 61/0 | Met | - |
| AC-004 | REQ-004 | Given a findings-only fixture corpus, When `check-goal.cjs --all --root <fixture>` runs, Then it exits 1, and `--help` exits 0 | `check-goal.test.cjs` 35/0 | Met | - |
| AC-005 | REQ-005 | Given a Draft packet with value tokens, When `spec/check-placeholders.sh` runs, Then it exits 0 as PLACEHOLDER_FILLED warns, and a non-Draft packet with tokens, including one only in handover.md, exits 1 | `validation-exit-honesty.vitest.ts` Draft, non-Draft and handover cases pass | Met | - |
| AC-006 | REQ-006 | Given the corpus walker, When it walks a fixture with a packet's `research/iterations/` and `research/research.md`, Then only `research.md` is kept | `trigger-index.vitest.ts` walkCorpus case and `retrieval-coverage-parity.vitest.ts` anchor cases pass | Met | - |
| AC-007 | REQ-007 | Given a recorded build older than its source, When the alignment check runs, Then it exits non-zero naming the package | stale cli dist reported 3/4 fresh and failed; after rebuild 4/4; orphans test passes | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
