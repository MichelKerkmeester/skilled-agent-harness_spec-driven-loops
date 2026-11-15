---
title: "Acceptance Criteria: Phase 4: advisor-council-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor council removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/004-advisor-council-removal"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-advisor-council-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: advisor-council-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-ai-council-mode-deprecation/004-advisor-council-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. AC ids come from the criteria list this phase had before it was split, so a criterion keeps its id in the child that owns it. Ids from AC-018 up were added at the split. A new row takes the highest AC-ID across the five children plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-019 | REQ-019 | Given the council prompt, When stage one replays it, Then no deep-loop mode row is printed | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "convene an ai council to compare three migration plans" --threshold 0.5 \| rg '"mode": "(ai-council\|research\|review)"' \| wc -l` prints 0. Observed: prints `0`, exit 0. Evidence at `tasks.md:60` | Met | - |
| AC-014 | REQ-014 | Given the advisor with two deep modes, When its suite, typecheck and drift guard run, Then they pass or match the baseline and any recaptured corpus keeps its thresholds | `cd .skilled/skills/system-skill-advisor/runtime && npm test && npm run typecheck` exits 0 and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0, with deltas in `goal.md`. Observed: `npm test && npm run typecheck` exits 0 with 178 files and 1708 tests passed, and the drift guard test passes 7 tests when run from the advisor runtime folder. `goal.md` logs the holdout delta. Evidence at `tasks.md:61` | Met | - |
| AC-020 | REQ-020 | Given the final tree of this child, When the advisor runtime is searched for the deep council mode, Then no file names it | `rg -l 'deep-ai-council\|/deep:ai-council' .skilled/skills/system-skill-advisor/runtime -g '!**/node_modules/**' -g '!**/changelog/**'` prints nothing. Observed: prints nothing, exit 1. Evidence at `tasks.md:48` | Met | - |

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

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
