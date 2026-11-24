---
title: "Acceptance Criteria: Build the advisor skill-graph database when provisioning a worktree"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "provision skill graph database acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-provision-skill-graph-database"
    last_updated_at: "2026-11-24T14:39:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-provision-skill-graph-database"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Build the advisor skill-graph database when provisioning a worktree

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-provision-skill-graph-database
**Level:** [2/3/3+]
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given worktree 538 with no database, When `provision` reruns, Then `skill-graph.sqlite` exists and `skill_advisor.py --health` prints `"status": "ok"` | Worktree 538 with the daemon stopped and the database removed: `provision` printed `building the skill-graph database` and `1 built, 0 failed`, `skill-graph.sqlite` exists, health `"status": "ok"` | Met | - |
| AC-002 | REQ-002 | Given a stubbed advisor CLI that exits 1, When `provision` runs, Then it exits non-zero | Failing-scan and no-database-written cases exit 1 in `worktree-naming.test.sh` | Met | - |
| AC-003 | REQ-003 | Given an existing database or no advisor CLI, When `provision` runs, Then the scan is not called and provisioning exits 0 | Existing-database case calls the stub 0 times; no-CLI case creates no database; both exit 0 | Met | - |
| AC-004 | REQ-004 | Given the final tree, When `worktree-naming.test.sh` runs, Then it prints `FAIL=0` with PASS above 178 | `worktree-naming tests: PASS=190 FAIL=0` (baseline 178); with the block removed, `PASS=184 FAIL=6` | Met | - |

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

**Closeable:** Yes. Every criterion is met with observed evidence.

[One sentence: what decides closure now. Name a criterion by id only when it blocks closure.]
<!-- /ANCHOR:closure -->
