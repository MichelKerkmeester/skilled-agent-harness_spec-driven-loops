---
title: "Acceptance Criteria: Phase 11: gateway-enforcement-and-projection-hygiene"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gateway enforcement acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/038-review-and-cli-lineage/011-gateway-enforcement-and-projection-hygiene"
    last_updated_at: "2026-10-19T23:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all five criteria Met with evidence"
    next_safe_action: "Merge worktree 156 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: gateway-enforcement-and-projection-hygiene

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-deep-loop/038-review-and-cli-lineage/011-gateway-enforcement-and-projection-hygiene
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given a state log with a hand-written config row and no `run_initialized` in the ledger, When an event is appended twice, Then both are refused before the ledger and no frame is written | Evidence: `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:331`; `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-run-open.vitest.ts:188`. In the worker's replay, Luna's real iteration event on a copy of its lineage was refused with `STATE_LOG_UNATTRIBUTED` and left 0 frames | Met | - |
| AC-002 | REQ-001 | Given a CLI lineage whose state log has rows and whose ledger has none, When the runner validates it, Then it fails with `unattributed_state_log` and is not retried | Evidence: `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:34`; `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3442` | Met | - |
| AC-003 | REQ-002 | Given a projection failure after a clean append, When the identical event is retried, Then the stored event is replayed and the ledger holds one copy | Evidence: `append-mode-event.ts:186` (`IDEMPOTENCY_CONFLICT`); the gateway README's idempotency paragraph; the replay, conflict and single-store tests in the run-open suites | Met | - |
| AC-004 | REQ-003 | Given a research or review run, When it opens and the reducer, conflict and idea rows are recorded, Then the config row carries the topic and every row survives the next append | Evidence: `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:201`; `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:128`; `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts:657` | Met | - |
| AC-005 | REQ-004 | Given the final state, When the gates run, Then they pass and the pre-phase sources fail the new tests | Evidence: 68 related files, 1331 passed, 2 skipped, exit 0; `npm run typecheck` exit 0; stem census 75 registered, 0 violations; bootstrap 9/9. With HEAD's gateway and runner swapped in, 4 tests fail; both restored and `cmp` matched | Met | - |

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

All five criteria are Met. The gateway rule is enforced in code, a retry is stored once, and the rows a run writes survive its projection.
<!-- /ANCHOR:closure -->
