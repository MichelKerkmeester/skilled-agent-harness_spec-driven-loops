---
title: "Acceptance Criteria: Phase 4: template-section-fill-guidance"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "template section fill guidance acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance"
    last_updated_at: "2026-10-23T14:00:00Z"
    last_updated_by: "planning-session"
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
# Acceptance Criteria: Phase 4: template-section-fill-guidance

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance
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
| AC-001 | REQ-001 | Given the four core templates, When T011 runs, Then every `## ` section holds exactly one fill line and every anchor count is unchanged | `npx vitest run runtime/cli/tests/template-fill-guidance.vitest.ts` prints `Tests  16 passed (16)` | Unmet | - |
| AC-002 | REQ-002 | Given the ten addon templates, When T008 is done, Then each template holds the fill count in the T008 table | `rg -c '<!-- FILL: ' $S/templates/addons/*.tmpl` prints 3, 5, 5, 1, 4, 5, 20, 11, 4 and 3 | Unmet | - |
| AC-003 | REQ-003 | Given the anchor baseline, When T013 reruns the count loop, Then the two files are identical | `diff scratch/baseline/anchor-counts.txt scratch/baseline/anchor-counts-after.txt` exits 0 with no output | Unmet | - |
| AC-004 | REQ-004 | Given every `.tmpl` under `templates`, When the awk crossing command runs, Then it prints no line | the command in `plan.md` section 3 prints nothing on every file | Unmet | - |
| AC-005 | REQ-005 | Given the aligned examples, When the drift guard runs, Then every description is a full sentence and every anchor set matches the contract | `bash runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` | Unmet | - |
| AC-006 | REQ-006 | Given the refreshed snapshots, When the golden test runs without `-u`, Then all 12 tests pass | `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` prints `Tests  12 passed (12)` | Unmet | - |
| AC-007 | REQ-007 | Given the phase is closing, When `git status --porcelain` is compared with `status-start.txt`, Then only the files in `spec.md` section 3 and this phase folder differ | T014 status diff | Unmet | - |
| AC-008 | REQ-008 | Given the fill text, When the frontier review in T015 returns, Then each finding is applied or recorded with a reason | `scratch/review/T015.txt` and the T015 entry in `goal.md` section 4 | Unmet | - |
| AC-009 | REQ-009 | Given the guards, When T006 runs on the unedited tree, Then both guards fail with the named messages | `scratch/test/failing-first.txt` holds the fill count and the drift line | Unmet | - |

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
