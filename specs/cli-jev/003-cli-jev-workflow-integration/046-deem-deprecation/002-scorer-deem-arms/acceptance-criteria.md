---
title: "Acceptance Criteria: Phase 2: scorer-deem-arms"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "scorer deem arms acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms"
    last_updated_at: "2026-10-02T10:45:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Met every criterion"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-046-002-scorer-deem-arms"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: scorer-deem-arms

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms
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
| AC-001 | REQ-001 | Given the files 001 assigns to 002, When the Deem pattern is searched over them, Then only keep rows match | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/implementation-summary.md:311` the grep prints nothing over the 99 assigned files | Met | - |
| AC-002 | REQ-002 | Given each scorer and its recorded input, When the default run's stdout is compared before and after, Then `diff` shows only removed Deem lines or fields | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/scratch/default-diff.txt:3` to `:38`, summarized at `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/implementation-summary.md:312`: 16 identical, three lose only a Deem planned-calls field, 019 differs only in timing | Met | - |
| AC-003 | REQ-003 | Given every suite that covered a removed arm, When it runs from the final state, Then 0 fail | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/implementation-summary.md:314` 24 inventory suites 0 fail and the 14 changed suites 446 of 446 | Met | - |
| AC-004 | REQ-004 | Given each scorer, When it runs with `--deem`, Then it exits non-zero through its unknown-flag path | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/scratch/deem-flag.txt:1` to `:20`, every scorer exit 2, and `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/implementation-summary.md:313` | Met | - |
| AC-005 | REQ-005 | Given the changes, When a reviewer from the other worker family reads them, Then no P0 or P1 stays open | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/implementation-summary.md:315` no P0, P1 fixed, P2 logged at `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/goal.md:95` | Met | - |
| AC-006 | REQ-001 to REQ-005 | Given the final state, When the phase closes, Then `validate.sh --strict` prints `RESULT: PASSED` and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)` | `specs/cli-jev/003-cli-jev-workflow-integration/046-deem-deprecation/002-scorer-deem-arms/tasks.md:59` T009: `validate.sh --strict` RESULT: PASSED and `check-goal.cjs` RESULT: PASSED (5/5 checks) | Met | - |

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
