---
title: "Acceptance Criteria: Phase 1: template-drift-census-and-baseline"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template drift census and baseline acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline"
    last_updated_at: "2026-10-23T11:27:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: template-drift-census-and-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline
**Level:** 3
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the lanes returned, When T006 has run, Then `scratch/ledger/ledger.jsonl` parses and every line has the ten schema fields | `jq -e 'has("id") and has("lane") and has("file") and has("locator") and has("defect_class") and has("observed") and has("expected_text") and has("owner_phase") and has("evidence_cmd") and has("evidence_expect")' scratch/ledger/ledger.jsonl \| grep -c false` prints `0` | Unmet | - |
| AC-002 | REQ-002 | Given `ledger.jsonl`, When each row's `evidence_cmd` runs on the start commit, Then its output contains its `evidence_expect` | T006 script rerun prints the same `ledger.jsonl` line count and an empty `dropped.jsonl` delta | Unmet | - |
| AC-003 | REQ-003 | Given `ledger.jsonl`, When T007 runs, Then the leaked-description count is at least 18 and the other four counts are each at least 1 | T007 output saved in `goal.md` section 4 | Unmet | - |
| AC-004 | REQ-004 | Given three baseline runs, When T010 has run after the third, Then `baseline.json` holds three runs, each with its run number and five metrics | `jq '.runs \| length' scratch/baseline/baseline.json` prints `3` and `jq '.runs[] \| keys \| length' scratch/baseline/baseline.json` prints `6` three times, the run number plus the five metrics | Unmet | - |
| AC-005 | REQ-005 | Given the phase is closing, When `git status --porcelain` is compared with `status-start.txt`, Then only paths inside this phase folder differ | T014 status diff | Unmet | - |
| AC-006 | REQ-006 | Given the ledger, When the frontier review in T011 returns, Then each finding is applied or recorded with a reason | `scratch/review/T011.txt` and the T012 count in `goal.md` section 4 | Unmet | - |

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

The phase has not started. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
