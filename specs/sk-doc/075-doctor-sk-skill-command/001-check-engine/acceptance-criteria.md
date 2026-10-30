---
title: "Acceptance Criteria: Phase 1: check-engine"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "check engine acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/001-check-engine"
    last_updated_at: "2026-10-30T06:50:00Z"
    last_updated_by: "claude-opus-worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: check-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/001-check-engine
**Level:** 2
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seven fixtures, When `node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` runs, Then it exits 0 | Test run output and exit status | Unmet | - |
| AC-002 | REQ-002 | Given `scratch/baseline/`, When `sk-skill-check.cjs check --json` runs over the fleet, Then every shipped root reports its baseline verdict | Diff of fleet JSON against the baseline is empty | Unmet | - |
| AC-003 | REQ-003 | Given a clean tree, When a fleet `check` runs, Then `git status --porcelain` prints the same lines before and after | Two `git status --porcelain` captures | Unmet | - |
| AC-004 | REQ-004 | Given the plain, pre-migration, canon and dual-declaration fixtures, When `check --json` runs on each, Then C2 reports plain, older Skilled (`skill-md`), canon (`router-md`) and `dual-declaration` | Fixture assertions in `sk-skill-check.test.cjs` | Unmet | - |
| AC-005 | REQ-005 | Given an advisor stub that exits 75, When C8 runs, Then the row reads UNKNOWN and the run is not a pass | Fixture assertion | Unmet | - |
| AC-006 | REQ-006 | Given the resolver path hidden, When `check` runs, Then it exits 2 and names the missing resolver | Exit status and stderr | Unmet | - |
| AC-007 | REQ-007 | Given any fixture, When `check --json` runs, Then `JSON.parse` accepts the output and it holds rows C1 to C13 | Fixture assertion | Unmet | - |

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

The phase is planned and no criterion has been verified yet.
<!-- /ANCHOR:closure -->
