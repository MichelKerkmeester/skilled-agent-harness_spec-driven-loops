---
title: "Acceptance Criteria: Phase 1: removal-plan"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "removal plan acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Closed the phase with the inventory and four decisions"
    next_safe_action: "Run phases 002 and 003 from inventory.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-001-removal-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: removal-plan

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the inventory command, When its file list is compared with `inventory.md`, Then each file has exactly one row with an owner and an action | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/inventory.md:28` counts 209 rows, which match `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/scratch/inventory-files.txt:1` to line 209 one for one and in order | Met | - |
| AC-002 | REQ-002 | Given the removal, When its decisions are read, Then ADR-001 to ADR-004 are Accepted | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/decision-record.md:36`, `:121`, `:206` and `:291`, each Status Accepted | Met | - |
| AC-003 | REQ-003 | Given the hub check and the compiled router, When their mode-count rules are read, Then each is cited with `file:line` and the check exits 0 on the unchanged hub | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/inventory.md:32` cites five rules, and `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/inventory.md:44` records the check's exit 0 | Met | - |
| AC-004 | REQ-004 | Given the covering suites, When each runs on the unchanged tree, Then its pass and fail count is recorded | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/inventory.md:48` records 25 suites with their pass and fail counts | Met | - |
| AC-005 | REQ-001 to REQ-004 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/001-removal-plan/tasks.md:57` T007: `validate.sh --strict` RESULT: PASSED and `check-goal.cjs` RESULT: PASSED (5/5 checks) | Met | - |

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

Every row is Met. `inventory.md` holds 209 rows matching `scratch/inventory-files.txt` one for one, `decision-record.md` holds ADR-001 to ADR-004, section 2 cites the five mode-count rules, and section 3 records 25 suite baselines.
<!-- /ANCHOR:closure -->
