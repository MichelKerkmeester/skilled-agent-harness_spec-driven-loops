---
title: "Acceptance Criteria: Phase 16: cross-session-operator-items"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cross session operator items"
  - "coordinate not overwrite"
  - "spec kit check mirror job"
  - "worktree 046 removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/016-cross-session-operator-items"
    last_updated_at: "2026-09-07T15:05:58Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-cross-session-operator-items"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: cross-session-operator-items

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/016-cross-session-operator-items
**Level:** 2
**Status:** Draft
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five named surfaces, When the opening task runs, Then it reports a clean or dirty status for each one before any other task executes | The task's own printed report, one line per surface, from tasks.md T001 | Unmet | - |
| AC-002 | REQ-002 | Given `.codex/prompts` found clean, When `sync-prompts.cjs` runs, Then `design-chart.md` and `design-diagram.md` exist and `create-chart.md` and `create-diagram.md` do not | `ls .codex/prompts/ \| grep -E "chart\|diagram"` before and after | Unmet | - |
| AC-003 | REQ-003 | Given the README-parity baseline found clean and the 26 verdict-shape mismatches individually read, When the baseline is regenerated, Then `test_readme_verdict_parity.py` reports `diff_entries=0` | `python3 .opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` output | Unmet | - |
| AC-004 | REQ-004 | Given worktree 046's status checked immediately before removal, When it is clean, Then `git worktree remove` succeeds and `git worktree list` no longer names it, and Given it is dirty, When the same check runs, Then the task stops and writes an escalation instead of forcing removal | `git worktree list` output, or the escalation note in implementation-summary.md naming the specific dirty entries | Unmet | - |
| AC-005 | REQ-005 | Given `.opencode/skills/sk-design`, When `parent-skill-check.cjs` and the other four `routing-drift` job checks run, Then all pass and the result is recorded as a correction to the program report's stale "failing" claim | `parent-skill-check.cjs` and the four sibling checks' output, plus the recorded correction | Unmet | - |
| AC-006 | REQ-006 | Given `specs/system-deep-loop/036-deep-loop-innovation`, When `check-goal-file-manifest.sh` and `recursive-child-manifest.vitest.ts` run, Then both pass and the result is recorded as a correction to the program report's stale "stale" claim | The two checks' output, plus the recorded correction | Unmet | - |
| AC-007 | REQ-007 | Given write authority over the program's report is confirmed, When the 36-mismatch and six-invariant-failing figures are read, Then they are updated to the re-verified counts from AC-003 and AC-005 | The updated report text, diffed against its pre-change wording | Unmet | ADR-NNN if write authority is not confirmed |

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

This phase is still in planning. No requirement has been implemented, so every
criterion above stays Unmet until the tasks in `tasks.md` are executed and
re-verified against the repository. AC-004 and AC-007 may close as `Waived`
rather than `Met` if the worktree is still dirty or write authority is absent
at execution time, each requiring its own decision record at that point.
<!-- /ANCHOR:closure -->
