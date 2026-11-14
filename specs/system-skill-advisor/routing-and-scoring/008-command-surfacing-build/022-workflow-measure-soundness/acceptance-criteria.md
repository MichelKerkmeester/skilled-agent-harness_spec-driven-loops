---
title: "Acceptance Criteria: Phase 22: workflow-measure-soundness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "workflow measure soundness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/022-workflow-measure-soundness"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 once phases 019 and 021 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-022-workflow-measure-soundness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 22: workflow-measure-soundness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 022-workflow-measure-soundness
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the rescored final arm, When each `workflow` block is read, Then it still holds `share`, `loadRate` and `noneActed`, no line of the scorer diff removes a `loadRate` or `share` field, and each `loadRate` denominator equals its value before the phase | The `jq` check and the two `cmp` checks in T016 pass and CHK-011 prints nothing and 1 | Unmet | - |
| AC-002 | REQ-002 | Given a shell read of the owner's entry document, a shell read of the command document and a read of each prompt mirror, When `workflowPath` classifies each, Then it returns `skill`, `command`, `command` and `command` | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed and the unit probe's first four lines read `skill`, `command`, `command`, `command` | Unmet | - |
| AC-003 | REQ-003 | Given both after files, When the count identity runs, Then it prints `true` for each | `SUMOK` over `scratch/workflow-after-pre.json` and `scratch/workflow-after-final.json` | Unmet | - |
| AC-004 | REQ-004 | Given a load of another mode's document under the owner hub, When the row names a mode, Then the value is `otherMode`, and a hub-level or right-mode document gives `skill` | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed and the probe's fifth line reads `otherMode` | Unmet | - |
| AC-005 | REQ-005 | Given an ask row whose run reported the offer or ended on a question naming the command and wrote nothing, When it is classified, Then the value is `asked`, and the same text on a start row gives `none` | The probe's seventh line reads `asked` and the test file reports 0 failed | Unmet | - |
| AC-006 | REQ-006 | Given a first write to a temp file followed by an owner load and a repository write, When the run is classified, Then the value is `skill` | The probe's sixth line reads `skill` | Unmet | - |
| AC-007 | REQ-007 | Given `/create:sk-skill` and a confirm read after the first write, When `followedBeforeWrite` runs, Then it returns `false`, and every confirm asset on disk maps to a tracked command | `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed | Unmet | - |
| AC-008 | REQ-008 | Given a head whose command sits after ` vs ` and a session whose only head is inside a tool result, When `parseOffer` and `briefDelivered` run, Then they return `offeredAs` `partner` and `false` | `npx vitest run tests/command-offer.vitest.ts` reports 0 failed | Unmet | - |
| AC-009 | REQ-009 | Given the before and after files, When the delta is written, Then it holds one line per runtime and arm with a reason for each changed count | `rg -c -e '^(claude|codex|devin|dsh|opencode|pi) (pre|post) ' scratch/workflow-delta.txt` prints 11 | Unmet | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment lines are searched for a spec path or an id, Then nothing is found, five files changed and phase 019's folder is untouched | The checks in T018 | Unmet | - |

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

**Closeable:** No

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
