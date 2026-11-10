---
title: "Acceptance Criteria: sk-code surface consistency"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-code surface consistency acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/001-surface-consistency-research"
    last_updated_at: "2026-10-19T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the acceptance criteria for the remediation plan"
    next_safe_action: "Confirm the obsidian grouping, then record the step-1 baseline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-surface-consistency-research"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: sk-code surface consistency

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 019-surface-consistency-research
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the research loops, When they finish, Then every iteration record carries the route-proof fields | Round 1: `research_archive/20261019T081751Z/iterations/iteration-001.md`..`005.md`; round 2: `research/iterations/iteration-001.md`..`003.md`; `verify-iteration.cjs` passed all 8 | Met | - |
| AC-002 | REQ-002 | Given the research, When synthesized, Then a target layout and per-surface gaps are cited | `research_archive/20261019T081751Z/research.md` §7, §8 | Met | - |
| AC-003 | REQ-003 | Given the plan, When read, Then each step names its guarding check | `plan.md` §4, steps 1-15 | Met | - |
| AC-004 | REQ-004 | Given steps 4 and 5, When the moves land, Then drift guards, router-sync, parent-skill and compiled-route checks pass and a hub probe per surface resolves its moved resources | `scratch/after/` logs | Unmet | - |
| AC-005 | REQ-005 | Given the step-1 baseline, When step 7 reruns it, Then no check is worse | `scratch/baseline/` vs `scratch/after/` | Unmet | - |
| AC-006 | REQ-006 | Given the three `SKILL.md` files, When their `## ` headings are listed, Then they follow the shared order of `research_archive/20261019T081751Z/research.md` §7 | Heading diff in `scratch/after/` | Unmet | - |
| AC-007 | REQ-007 | Given the three surfaces, When their `assets/` roots are listed, Then no checklist file sits there | `ls` output in `scratch/after/` | Unmet | - |
| AC-008 | REQ-008 | Given a fourth-surface fixture, When the router-sync tests run, Then it fails before step 8 and passes after, and sk-code-obsidian's map is compared with the hub union | Test output before and after in `scratch/` | Unmet | - |
| AC-009 | REQ-009 | Given an injected violation per new check id, When `parent-skill-check.cjs` runs, Then it fails with that id and `/doctor:sk-code` prints that id's repair; on the migrated tree it prints `STATUS=OK legs=8` | Invariant test output; setup-check output | Unmet | - |
| AC-010 | REQ-010 | Given the surface scaffold, When it is copied into a temp hub, Then the parent check and router sync pass on it | Dry-run log in `scratch/after/` | Unmet | - |
| AC-011 | REQ-011 | Given an Obsidian prompt and a matched-prompt hint per surface, When the replay and hint tests run, Then the prompt classifies as OBSIDIAN and each hint test passes | `compiled-route-surface-hint.test.cjs` and advisor vitest output | Unmet | - |

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

Research and planning are done; the remediation has not started.
<!-- /ANCHOR:closure -->
