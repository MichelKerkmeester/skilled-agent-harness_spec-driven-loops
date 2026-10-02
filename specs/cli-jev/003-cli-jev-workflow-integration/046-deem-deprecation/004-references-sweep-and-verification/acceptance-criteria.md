---
title: "Acceptance Criteria: Phase 4: references-sweep-and-verification"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Met every criterion"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-004-references-sweep-and-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: references-sweep-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification
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
| AC-001 | REQ-001 | Given the final state, When both greps run, Then the inventory pattern prints only keep rows and generated files holding spec or changelog text, and the `--deem` grep prints nothing | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:96` two keep files and five generated files with spec and changelog text only, criterion amended at `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/goal.md:92`, and `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:97` `--deem` prints nothing | Met | - |
| AC-002 | REQ-002 | Given every suite in 001's inventory, When each runs from the final state, Then 0 fail | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:100` 24 of 24 inventory suites 0 failing | Met | - |
| AC-003 | REQ-003 | Given each changed doc and the hub, When `validate_document.py` and the hub check run, Then each passes | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:98` 135 of 135 docs valid and `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:99` hub check OK | Met | - |
| AC-004 | REQ-004 | Given each changed skill, When its `changelog/` is listed, Then it has one new entry for the removal | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:103` 13 new entries, two metadata-only skills explained at `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/goal.md:95` | Met | - |
| AC-005 | REQ-005 | Given the whole removal, When the cross-family review reads it, Then no P0 or P1 stays open | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/implementation-summary.md:104` P0 fixed in `0c1ca648e8`, P1 rejected with evidence at `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/goal.md:94` | Met | - |
| AC-006 | REQ-001 to REQ-005 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/004-references-sweep-and-verification/tasks.md:58` T008: `validate.sh --strict` RESULT: PASSED and `check-goal.cjs` RESULT: PASSED (5/5 checks) | Met | - |

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

Every row is `Met` with evidence observed from the final state.
<!-- /ANCHOR:closure -->
