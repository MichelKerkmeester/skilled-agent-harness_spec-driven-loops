---
title: "Acceptance Criteria: Phase 6: cli-opencode-dual-dispatch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "cli opencode dual dispatch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-cli-opencode-dual-dispatch"
    last_updated_at: "2026-10-18T12:45:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-cli-opencode-dual-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: cli-opencode-dual-dispatch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/006-cli-opencode-dual-dispatch
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-004, REQ-008 | Given the version parser, both argv renderers and the availability check, When the new unit suite runs, Then every case passes, and the same cases fail on the pre-change code. | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/opencode-dual-dispatch.vitest.ts` exits 0. The red output from T007 is recorded in the log. | Unmet | - |
| AC-002 | REQ-005 | Given one pinned version each, When a smoke dispatch runs through the builder, Then the exit status is 0, the expected token is in the output, and the lineage file exists. | The smoke command confirmed in T004, run once on 1.19.3 and once on 2.0.32 with `--standalone`. The exit status, token and lineage path are recorded in the log. | Unmet | - |
| AC-003 | REQ-006, REQ-004 | Given a v2 child dispatched through `run --standalone`, When a fixture plugin logs its environment, Then the log contains `AI_SESSION_CHILD=1`. | The T017 log line, recorded in the log. | Unmet | - |
| AC-004 | REQ-007 | Given the deep-loop runtime package, When its full suite runs, Then the failure count is 0, and the pass count is at or above the T001 record. | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage`, reading the `Tests` line and comparing it with T001. | Unmet | - |

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

Not closeable yet. No criterion has run, and the phase has not started. Write this
paragraph when the packet is closed, not before.
<!-- /ANCHOR:closure -->
