---
title: "Acceptance Criteria: Phase 10: config-row-projection-refusal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "config row projection refusal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/038-review-and-cli-lineage/010-config-row-projection-refusal"
    last_updated_at: "2026-10-19T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked all four criteria Met with evidence"
    next_safe_action: "Merge worktree 154 to main"
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
# Acceptance Criteria: Phase 10: config-row-projection-refusal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-deep-loop/038-review-and-cli-lineage/010-config-row-projection-refusal
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
| AC-001 | REQ-001 | Given a CLI research or review lineage, When the runner builds its brief, Then the brief names `append-mode-event.cjs` for every state record from `step_create_state_log` on and forbids creating, appending to or rewriting the state log | Evidence: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1519`, `:1522`; `.skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts:137`. With the HEAD runner swapped in the test fails (1 failed, 6 passed); with the fix it passes (7 passed). The runner was restored and `cmp` matched it to the saved copy | Met | - |
| AC-002 | REQ-002 | Given every instruction a CLI lineage reads, When it is searched, Then none asks for a direct state write or for a `findingsCount` only a direct write could supply | Evidence: `fanout-run.cjs:1545`, `:1553`, `:1554`; `.skilled/commands/deep/assets/deep-research-auto.yaml:1736`; `.skilled/commands/deep/assets/deep-review-auto.yaml:1634`. The test rejects `state record ... directly` and `append the state record` in all four briefs | Met | - |
| AC-003 | REQ-003 | Given the edited workflows, When the fix-mode renderer loads them, Then the compiled contracts are fresh and the related suites pass | Evidence: `.skilled/command-support/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md` rebuilt. 41 deep-loop suites: 834 passed, 2 skipped, exit 0. Before the rebuild, `render-command-contract` failed twice with `STALE_SOURCE_DIGEST` | Met | - |
| AC-004 | REQ-001, REQ-003 | Given the final state, When the gates run, Then they pass | Evidence: `implementation-summary.md` Verification table. `node --check` exit 0, drift guards 4/4, runtime mirrors 192 in sync, strict validation `RESULT: PASSED` | Met | - |

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

All four criteria are Met. The brief no longer contradicts the gateway rule, the test fails without the fix, and the compiled contracts match the edited workflows.
<!-- /ANCHOR:closure -->
