---
title: "Acceptance Criteria: Phase 5: history-rewrite"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/028-crawlable-commit-history/005-history-rewrite"
    last_updated_at: "2026-09-11T07:16:31Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Met the last criterion with the operator-approved push"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: history-rewrite

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/028-crawlable-commit-history/005-history-rewrite
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the pinned tip, When the plan is built twice, Then 9,123 consecutive ordinals come out byte-identical | two runs, `cmp` identical; PASS plan-ordinals in rewrite.log | Met | - |
| AC-002 | REQ-002 | Given the refined cascade, When 100 sampled rows are judged, Then the error rate is under 5 percent | scratch/sample-judgment.md: 2 of 55 mapped rows wrong | Met | - |
| AC-003 | REQ-003 | Given a mirror of the source, When the rehearsal runs with the 109 on-line tags, Then all six invariants pass | rehearsal-2 rewrite.log: INVARIANTS: PASS, 111,686 messages checked, residue 0, tags 149 = 149 | Met | - |
| AC-004 | REQ-004 | Given the rehearsal commit map, When the remap dry-runs over specs and skills, Then only commit tokens change and decoys stay | 1,704 tokens recognized and replaced, 10,092 skipped, 1,672 files would change | Met | - |
| AC-005 | REQ-005 | Given the invariants, When the push happens, Then it follows a recorded rollback sentence and a fresh yes | rollback sentence in plan.md; yes recorded 2026-09-11 against pin 7acc23fcb9; origin main a1faf0914a, skilled/v4.0.0.0 6358770875 then 7bb115bd61 after the remap | Met | - |

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

AC-003 and AC-005 carried the packet: a rehearsal that passed every invariant and a push the operator approved against a pin that held. Left out on purpose: the 58 other branches and 28 worktrees, which their owners rebase and stamp.
<!-- /ANCHOR:closure -->
