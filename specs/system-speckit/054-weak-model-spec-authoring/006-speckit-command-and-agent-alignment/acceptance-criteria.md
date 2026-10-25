---
title: "Acceptance Criteria: Phase 6: speckit-command-and-agent-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "speckit command and agent alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment"
    last_updated_at: "2026-10-24T22:00:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed phase 006: all eight criteria Met"
    next_safe_action: "Start phase 007"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: speckit-command-and-agent-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 27 frozen rows, When T004 has run, Then `rows.jsonl` parses and every locator occurs exactly once | `jq -c . scratch/audit/rows.jsonl \| wc -l` prints `27`, and T004 prints `27 1` | Met | - |
| AC-002 | REQ-002 | Given `rows.jsonl`, When T006 has run, Then every row was applied by the script and changed only the file it names | T006 printed `78`, `78` and `78` (27 frozen rows plus 51 extra rows), and `grep -c '^CHECK R-.* extra_paths=0$' scratch/audit/applied.txt` printed `78` | Met | - |
| AC-003 | REQ-003 | Given the corrected tree, When T007 has run, Then the four A1 to A4 searches print nothing and six files name a guard script | `scratch/audit/searches.txt` holds `A1_rc=1`, `A2_rc=1`, `A3_rc=1`, `A4_rc=1`, `GUARD_REFS=6` and `A6_rc=1` (the widened search of the 16 extra-row files) | Met | - |
| AC-004 | REQ-004 | Given the regenerated trees, When T008 has run, Then all eight mirror checks exit 0 | `grep -c 'rc=0$' scratch/mirrors/summary.txt` prints `8` | Met | - |
| AC-005 | REQ-005 | Given the doctor:speckit checks, When T009 has run, Then the lookup and the gate pointer check pass and the index staleness set is unchanged | T009 prints `INDEX_STALENESS_SAME`, `gate1_exit=0` and a lookup exit of 0 or 1 | Met | - |
| AC-006 | REQ-006 | Given the suite at the phase start and at close, When T012 has run, Then the summary lines and the exit line are identical | T012 prints `SUITE_MATCH` | Met | - |
| AC-007 | REQ-007 | Given this phase folder, When `validate.sh --strict` runs, Then it prints `RESULT: PASSED` with Errors 0 | the T014 validate output | Met | - |
| AC-008 | REQ-008 | Given the diff, When the frontier review returns, Then each finding is applied or recorded with a reason | `scratch/review/T013.txt` and the T014 count in `goal.md` section 4 | Met | - |

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

Every row above is Met. Evidence observed on 2026-10-24:

- AC-001: Observed: `jq -c . rows.jsonl | wc -l` printed 27 and the count check printed `27 1`.
- AC-002: Observed: T006 printed 78, 78, 78 (27 frozen rows plus 51 extra rows), and `grep -c '^CHECK R-.* extra_paths=0$'` printed 78.
- AC-003: Observed: `searches.txt` holds A1_rc=1, A2_rc=1, A3_rc=1, A4_rc=1, A6_rc=1, GUARD_REFS=6.
- AC-004: Observed: `mirrors/summary.txt` holds 8 lines ending rc=0.
- AC-005: Observed: INDEX_STALENESS_SAME, gate1_exit=0, lookup_exit=0.
- AC-006: Observed: SUITE_MATCH, exit=0, after one recompile of the deep/review contract (goal.md section 4).
- AC-007: Observed: `validate.sh --strict` printed `RESULT: PASSED`.
- AC-008: Observed: T013 returned NO FINDINGS and the X2 row review returned NO FINDINGS; both are recorded in goal.md section 4.
<!-- /ANCHOR:closure -->

