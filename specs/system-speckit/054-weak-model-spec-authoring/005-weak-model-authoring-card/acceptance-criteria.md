---
title: "Acceptance Criteria: Phase 5: weak-model-authoring-card"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "weak model authoring card acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card"
    last_updated_at: "2026-10-23T14:30:00Z"
    last_updated_by: "author"
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
# Acceptance Criteria: Phase 5: weak-model-authoring-card

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card
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
| AC-001 | REQ-001 | Given the card file, When T004 has run, Then it is at most 260 lines and carries none of the four banned words, no em dash and no semicolon | `wc -l < $S/references/workflows/spec-authoring-card.md` prints `172`, and the four scans in T004 print nothing | Unmet | - |
| AC-002 | REQ-002 | Given `SKILL.md`, When T005 has run, Then the four authoring intents load the card and the guide appears in `ON_DEMAND` and in no intent list | `check-card-sync.sh` prints `PASS intent-PLAN`, `PASS intent-IMPLEMENT`, `PASS intent-INTAKE`, `PASS intent-TEMPLATE_AUTHORING` and `PASS guide-on-demand-only` | Unmet | - |
| AC-003 | REQ-003 | Given the two generated inventory files, When T008 has run, Then both list the card and the generator's own check passes | `generate-leaf-manifest.cjs --check $S` prints `leaf-manifest.json OK`, and the two `jq` counts in T008 print `1` | Unmet | - |
| AC-004 | REQ-004 | Given the authoring checklist, When T006 has run, Then it sends a reader to a rendered example and no longer to the templates root | `rg -c 'Read one rendered example'` prints `1` and `rg -c 'Read templates from'` prints nothing | Unmet | - |
| AC-005 | REQ-005 | Given the tasks template, When T007 has run, Then its task format declares the `Verify:` slot | `rg -c 'Verify: <command> prints <expected output>' $S/templates/core/tasks.md.tmpl` prints `1` | Unmet | - |
| AC-006 | REQ-006 | Given the guard, When T009 has run, Then it exits 0 on the changed tree and exits 1 on a copy without the card | `bash $S/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`, and the copy run in T009 prints `FAIL card-exists` and `exit=1` | Unmet | - |
| AC-007 | REQ-007 | Given the card as an extra path, When T011 has run, Then the vocabulary test passes | the T011 command prints `Tests  2 passed (2)` | Unmet | - |
| AC-008 | REQ-008 | Given three Level 1 smoke runs, When T013 has run after the third, Then `baseline.json` holds three runs with five metrics each and one run records a strict pass with zero tokens | `jq '.runs \| length' $PHASE/scratch/card-bench/baseline.json` prints `3`, `jq '.runs[] \| keys \| length'` prints `6` three times, and `jq '[.runs[] \| select(.strict_passed == 1 and .leftover_tokens == 0)] \| length'` prints at least `1` | Unmet | - |
| AC-009 | REQ-009 | Given the phase diff, When the frontier review in T014 returns, Then each finding is applied or recorded with a reason | `scratch/review/T014.txt` exists and the applied-or-recorded count is written in `goal.md` section 4 | Unmet | - |

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
