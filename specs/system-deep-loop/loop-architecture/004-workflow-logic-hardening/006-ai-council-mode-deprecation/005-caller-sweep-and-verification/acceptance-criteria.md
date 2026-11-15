---
title: "Acceptance Criteria: Phase 5: caller-sweep-and-verification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "caller sweep and verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/005-caller-sweep-and-verification"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-caller-sweep-and-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: caller-sweep-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-ai-council-mode-deprecation/005-caller-sweep-and-verification
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
| AC-004 | REQ-004 | Given the prompt "convene an ai council to compare three migration plans", When both routing stages replay it, Then neither stage selects the council, research or review | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5 \| rg '"mode": "(ai-council\|research\|review)"' \| wc -l` prints 0 and `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "<prompt>" \| rg '"packetId":"deep-' \| wc -l` prints 0. Observed with the council prompt: the `skill_advisor.py` count prints `0` and the `compiled-route.cjs` count prints `0`. Stage two returns `defer`. Evidence at `tasks.md:65` | Met | - |
| AC-005 | REQ-005 | Given one research and one review prompt, When both stages replay them, Then each routes to its own mode | Task T081 output logged in `goal.md`, with mode `research` and `packetId` `deep-research` for the first and mode `review` and `packetId` `deep-review` for the second. `goal.md` has the `Route replay T080 and T081` row: mode `research` and `packetId` `deep-research` for the first prompt, mode `review` and `packetId` `deep-review` for the second. Evidence at `tasks.md:66` | Met | - |
| AC-015 | REQ-015 | Given the vocabulary sweep, When it runs outside `specs/`, Then it finds only allowlisted history files | Task T086 output matches `scratch/exceptions.md`. The T086 sweep, filtered against `scratch/exceptions.md`, prints 0 paths. Evidence at `tasks.md:68` | Met | - |
| AC-016 | REQ-016 | Given the start SHA, When the diff of spec-folder council artifacts is listed, Then nothing changed and the plan names the revert path | `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing and `rg -n 'git revert' plan.md` prints at least 1 line. Observed: the `git diff` prints nothing, and `rg -n 'git revert' plan.md` in this folder prints line 138. Evidence at `tasks.md:69` | Met | - |
| AC-021 | REQ-021 | Given the gate baseline and the final tree, When every gate is rerun and the doc drift guard runs, Then no gate is worse than its start value and the guard passes | `../scratch/gate-baseline.md` holds a start and a final value for every gate with none worse, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 with `"errors": []`. Observed: all 58 gates have a start and a final value with none worse, and the drift check exits 0 with `"errors": []`. Evidence at `tasks.md:70` | Met | - |

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
