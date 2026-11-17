---
title: "Acceptance Criteria: Completed-Run Extension (--extend=N)"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "completed run extension acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/001-completed-run-extension"
    last_updated_at: "2026-11-17T14:35:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-completed-run-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Completed-Run Extension (--extend=N)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `001-completed-run-extension`
**Level:** 2
**Status:** Planned
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the shipped configs and reducers, When the change lands, Then the research config lists `completed-continue` in `lineage.allowedModes` only and the review reducer keeps `completed-continue` as a lineage mode | `node -e` read of `deep-research-config.json`; `rg -n 'LIVE_LINEAGE_MODES = ' runtime/scripts/reduce-state.cjs` | Unmet | - |
| AC-002 | REQ-002 | Given a completed fixture run, When `--extend=3` runs, Then the ledger holds exactly one `run_extended` event with every field from `spec.md` REQ-002 and the original sessionId and generation | ledger-schema suite case; playbook entry (T028) | Unmet | - |
| AC-003 | REQ-003 | Given both workflow YAMLs, When the extension step is added, Then it sits after `step_acquire_lock` and before `step_classify_session`, sets status `initialized`, and the fixture's `createdAt` is byte-identical before and after | `rg -n` line order in both YAMLs; `workflow-restart-lifecycle` extension case | Unmet | - |
| AC-004 | REQ-004 | Given a fixture run that stopped at 7 of 10 iterations, including one error row, When `--extend=3` runs, Then `maxIterations` is 10 and the loop dispatches exactly 3 more iterations | cap case in `workflow-restart-lifecycle.vitest.ts` | Unmet | - |
| AC-005 | REQ-005 | Given a fixture whose `createdAt` is 300 minutes old with a prior budget of 120, When `--extend=2` runs with no `--extend-minutes`, Then `maxDurationMinutes` is 420 (300 + 120), `step_check_max_duration` reports `reached == false` and the first extension iteration dispatches | duration-ceiling case in `workflow-restart-lifecycle.vitest.ts` | Unmet | - |
| AC-006 | REQ-006 | Given the new stem, When the guard scripts and the projection case run, Then `check-ledger-stem-producers` and `check-projection-coverage` exit 0, both producer tables list `run_extended` as `spoken`, and the projection case finds the `extended` row in the state log | `node` guard scripts; projection case (T023) | Unmet | - |
| AC-007 | REQ-007 | Given a run extended twice in one generation, When each extension starts, Then two distinct snapshot files exist per loop and neither overwrote the other | second-extension case; `ls research/synthesis-v*` for research and `ls review/review-report-v*` for review | Unmet | - |
| AC-008 | REQ-008 | Given an extension landing on `resume`, When the ledger is read, Then it holds the event combination chosen for open question 4 and review used the pre-classify mutation, not an `on_completed_session` branch | `workflow-restart-lifecycle` and `deep-review-auto-restart-contract` cases | Unmet | - |
| AC-009 | REQ-009 | Given two `completed` terminal rows for one sessionId, When the telemetry ledger reads them, Then it raises no error | double-terminal telemetry case | Unmet | - |
| AC-010 | REQ-010 | Given the updated docs and synced mirrors, When the REQ-010 command in `spec.md` runs over `.skilled` and the five runtime agent directories, Then it prints nothing for any of deferred, not wired, reserved, MUST NOT be exposed or not exposed | the `rg` pipeline; changelogs, benchmark reports and fixtures are excluded as history | Unmet | - |
| AC-011 | REQ-011 | Given the reworded docs, When the two `system-spec-kit` suites run, Then `deep-review-contract-parity` and `deep-review-reducer-schema` exit 0 and the name-only assertions are unchanged | `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-review-reducer-schema.vitest.ts` | Unmet | - |
| AC-012 | REQ-012 | Given a run without `--extend`, When the existing restart and auto-restart suites run, Then every existing case passes unchanged | `git diff` shows no edit to existing cases; both suites exit 0 | Unmet | - |
| AC-013 | REQ-013 | Given `stopPolicy: convergence`, When an operator reads the loop protocol, Then it states that an extension with no new questions re-stops on `all_questions_answered` or `all_dimensions_clean`, names the `off` / `max-iterations` window and inbox injection, and states that a run completed on consecutive failures re-stops even under `off` | `rg -n` on both `loop-protocol.md` files | Unmet | - |
| AC-014 | REQ-014 | Given a config with fan-out, When `--extend=3` is passed, Then a pre-spawn guard placed above `step_fanout_spawn:` in both YAMLs rejects it with a named usage error before any lineage spawns | fan-out rejection case in `workflow-restart-lifecycle.vitest.ts` (T035) | Unmet | - |
| AC-015 | REQ-015 | Given a completed run whose state log ends with `synthesis_complete` then an `extended` row, When each reducer runs, Then neither reports a terminal stop and review keeps `continuedFromRun` | `deep-research-reduce-state.vitest.ts` and `deep-review-state-reducer.vitest.ts` cases (T034) | Unmet | - |
| AC-016 | REQ-016 | Given both presentation assets, When the binding case reads them, Then each binds `--extend` and `--extend-minutes` beside `lineage_mode` | binding case in `workflow-restart-lifecycle.vitest.ts` (T035) | Unmet | - |
| AC-017 | REQ-017 | Given every digested source edit in this phase, When the contracts are regenerated, Then `check-contract-drift.cjs` exits 0 | `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` (T033) | Unmet | - |
| AC-018 | REQ-018 | Given the edited agent definitions, When `/doctor:runtime-mirrors` runs, Then it reports no drift for `deep-research` and `deep-review` | `/doctor:runtime-mirrors` output (T032) | Unmet | - |
| AC-019 | REQ-019 | Given the shipped flag, When the playbook packages are read, Then each `entry-points-and-modes/` category holds an `--extend=N` scenario written by `/create:manual-testing-playbook` and the package index lists it | package index and scenario file per loop (T028) | Unmet | - |

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

Implementation has not started, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
