---
title: "Acceptance Criteria: Phase 6: doctor-helper-handoff"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor helper handoff acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/006-doctor-helper-handoff"
    last_updated_at: "2026-10-31T22:05:33Z"
    last_updated_by: "claude-opus"
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "None: the phase is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01RCAMP5r5zyYXUMpd9BfH7Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: doctor-helper-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** commands/005-doctor-symlink-install/006-doctor-helper-handoff
**Level:** 2
**Status:** Complete
**Date:** 2026-10-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given no skill and no bridge phrase matches, When the advisor scores "my AGENTS.md is out of date with the template", Then `command-doctor-helper` is the top pick | Routing slice row `doctor-b-helper-handoff-01` passes; the hook brief starts `Advisor: live; use /doctor:helper` | Met | - |
| AC-002 | REQ-002 | Given the four routing corpora, When every prompt is scored with the change, Then no prompt gains a hand-off and the holdout and ratchet gates hold | Fire count: holdout 0/66, labeled 0/195, doctor 0/74, ambiguity 0/24; `holdout-independent` and `scorer-eval-baseline-ratchet` pass in the full suite | Met | - |
| AC-003 | REQ-003 | Given a passing skill and only a weak cue, When "Use the deep-research workflow, not a manual loop, to investigate routing drift." is scored, Then no doctor line appears | Slice row `doctor-b-helper-handoff-03` passes; DOC-406 brief `pb-doc-406c` prints no `/doctor:` text | Met | - |
| AC-004 | REQ-004 | Given a passing skill and a strong cue, When "my deep research run never converges" is scored, Then `system-deep-loop` stays first and the brief's second line is `Also: /doctor:helper` | Slice row `doctor-b-helper-handoff-02` passes; DOC-406 brief `pb-doc-406b` prints `Also: /doctor:helper` | Met | - |
| AC-005 | REQ-005 | Given the helper's fixtures, When each doctor problem is scored, Then more reach a doctor recommendation in the top three and no non-doctor row gains a hand-off | Held-out 4/48 before, 15/48 after; tune 13/58 before, 26/58 after; non-doctor rows 0/12 and 0/6 | Met | - |
| AC-006 | REQ-006 | Given a workspace without the helper script, When `matchDoctorProblem` runs, Then it returns null and scoring is unchanged | `tests/doctor-helper-handoff.vitest.ts` case `returns null when the workspace has no doctor helper` passes | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is Met with evidence observed on the final state of this phase.
<!-- /ANCHOR:closure -->
