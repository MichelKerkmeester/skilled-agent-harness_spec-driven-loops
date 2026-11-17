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
| AC-001 | REQ-001 | Given the shipped configs and reducers, When the change lands, Then the research config lists `completed-continue` in `lineage.allowedModes` only and the review reducer keeps `completed-continue` as a lineage mode | `node -e` read printed `allowed: [new, resume, restart, completed-continue]`, `deferred: [fork]`; `rg` finds `LIVE_LINEAGE_MODES = new Set(['new', 'resume', 'restart', 'completed-continue'])` in `reduce-state.cjs`. Cites `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:28` | Met | - |
| AC-002 | REQ-002 | Given a completed fixture run, When `--extend=3` runs, Then the ledger holds exactly one `run_extended` event with every field from `spec.md` REQ-002 and the original sessionId and generation | gateway case in `append-mode-event-legacy-seam.vitest.ts` appends `run_extended` as sequence 2 (`deep-research.ledger.run-extended`) and projects one `extended` row; the workflow case finds exactly one `extended` row and the config keeps the original `sessionId` and generation 1; ledger-schema suites 76 of 76. The live walk is AC-019. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-legacy-seam.vitest.ts:215` | Met | - |
| AC-003 | REQ-003 | Given both workflow YAMLs, When the extension step is added, Then it sits after `step_acquire_lock` and before `step_classify_session`, sets status `initialized`, and the fixture's `createdAt` is byte-identical before and after | `rg` line order: research `step_acquire_lock:423`, `step_extend_completed_run:442`, `step_classify_session:559`; review 444, 463, 573. The workflow case asserts `status: initialized` and `createdAt` unchanged; 33 of 33. Cites `.skilled/commands/deep/assets/deep-research.yaml:442` | Met | - |
| AC-004 | REQ-004 | Given a fixture run that stopped at 7 of 10 iterations, including one error row, When `--extend=3` runs, Then `maxIterations` is 10 and the loop dispatches exactly 3 more iterations | The cap half is proven: 7 runs with one error row plus `--extend=3` give `maxIterations` 10 (workflow case, 33 of 33). That the loop then dispatches exactly 3 iterations needs a live run, which is the T028 playbook walk, deferred to the integration worktree. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:807` | Unmet | - |
| AC-005 | REQ-005 | Given a fixture whose `createdAt` is 300 minutes old with a prior budget of 120, When `--extend=2` runs with no `--extend-minutes`, Then `maxDurationMinutes` is 420 (300 + 120), `step_check_max_duration` reports `reached == false` and the first extension iteration dispatches | duration case with `createdAt` 300 minutes old and a 120-minute budget: `step_check_max_duration` reports `reached: true` before, `maxDurationMinutes >= 420` after with no `--extend-minutes`, and `reached: false` after. Uses `--extend=3`; the minute rule does not depend on N. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:807` | Met | - |
| AC-006 | REQ-006 | Given the new stem, When the guard scripts and the projection case run, Then `check-ledger-stem-producers` and `check-projection-coverage` exit 0, both producer tables list `run_extended` as `spoken`, and the projection case finds the `extended` row in the state log | `check-ledger-stem-producers.cjs` exit 0 (94 registered, 27 spoken, both `run_extended` stems spoken); `check-projection-coverage.cjs` exit 0; the gateway case finds the `extended` row in the state log. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts:220` | Met | - |
| AC-007 | REQ-007 | Given a run extended twice in one generation, When each extension starts, Then two distinct snapshot files exist per loop and neither overwrote the other | research: `synthesis-v1-r2.md` and `synthesis-v1-r3.md` keep their own content; review: `review-report-v1-r4.md` and `review-report-v1-r5.md` likewise; a third snapshot call for an existing name exits non-zero in both; two `extended` rows per loop. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:840` and `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:914` | Met | - |
| AC-008 | REQ-008 | Given an extension landing on `resume`, When the ledger is read, Then it holds the event combination chosen for open question 4 and review used the pre-classify mutation, not an `on_completed_session` branch | both YAMLs carry `extension_override` under `on_resume` and `on_resume_choice` (workflow case per loop), and `deep-review-auto-restart-contract` asserts the extension step sits between the lock and classification while `on_completed_session` still only skips to synthesis and never mentions extend; 18 of 18. The classifier is prose, so the override is a contract read, not an executed branch. Cites `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts:88` | Met | - |
| AC-009 | REQ-009 | Given two `completed` terminal rows for one sessionId, When the telemetry ledger reads them, Then it raises no error | `loop-heartbeat.vitest.ts`: two terminal heartbeats for one session both exit 0 and the ledger holds two `completed` rows; 5 of 5. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-heartbeat.vitest.ts:173` | Met | - |
| AC-010 | REQ-010 | Given the updated docs and synced mirrors, When the REQ-010 command in `spec.md` runs over `.skilled` and the five runtime agent directories, Then it prints nothing for any of deferred, not wired, reserved, MUST NOT be exposed or not exposed | The REQ-010 command prints one line, the feature-catalog `initialization.md` line, and nothing for the five runtime agent directories. That line belongs to T031, which needs `/create:feature-catalog` as `@markdown`. Cites `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/initialization.md:27` | Unmet | - |
| AC-011 | REQ-011 | Given the reworded docs, When the two `system-spec-kit` suites run, Then `deep-review-contract-parity` and `deep-review-reducer-schema` exit 0 and the name-only assertions are unchanged | `npx vitest run --config ../../vitest.config.ts --project cli` on the two suites plus auto-restart: 18 of 18. The `on_restart:`, `note_deferred_branches:`, `on_fork` and options assertions are unchanged; only the two deferred-text assertions moved to the live wording. Cites `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts:126` | Met | - |
| AC-012 | REQ-012 | Given a run without `--extend`, When the existing restart and auto-restart suites run, Then every existing case passes unchanged | `git diff 21c4b325b5a` on `workflow-restart-lifecycle.vitest.ts` and `deep-review-auto-restart-contract.vitest.ts` has 370 insertions and 0 deletions; both suites pass (33 of 33, 18 of 18 with the other two). Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:222` | Met | - |
| AC-013 | REQ-013 | Given `stopPolicy: convergence`, When an operator reads the loop protocol, Then it states that an extension with no new questions re-stops on `all_questions_answered` or `all_dimensions_clean`, names the `off` / `max-iterations` window and inbox injection, and states that a run completed on consecutive failures re-stops even under `off` | `rg` finds the "Convergence window" line at the research `loop-protocol.md` (`all_questions_answered`, `--convergence-mode=off`, `max-iterations`, `research/inbox.jsonl`) and the review one (`all_dimensions_clean`), and the "Consecutive failures" line in both. Cites `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:144` and `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:617` | Met | - |
| AC-014 | REQ-014 | Given a config with fan-out, When `--extend=3` is passed, Then a pre-spawn guard placed above `step_fanout_spawn:` in both YAMLs rejects it with a named usage error before any lineage spawns | fan-out case per loop: `step_reject_extend_with_fanout` sits after `step_apply_lifecycle_request` and before `step_fanout_spawn`, halts, and names `Usage error (extend-with-fanout)`. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:779` | Met | - |
| AC-015 | REQ-015 | Given a completed run whose state log ends with `synthesis_complete` then an `extended` row, When each reducer runs, Then neither reports a terminal stop and review keeps `continuedFromRun` | one case per reducer passes (51 of 51). Negative control: with both `reduce-state.cjs` files restored from `32d56a21455`, before the reducer change, the two cases fail (2 failed, 49 passed). Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts:1567` and `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:582` | Met | - |
| AC-016 | REQ-016 | Given both presentation assets, When the binding case reads them, Then each binds `--extend` and `--extend-minutes` beside `lineage_mode` | binding case per loop finds `--extend=N -> extend = N, lineage_mode = completed-continue`, `--extend-minutes=M -> extend_minutes = M` and the `extend` table row in each presentation, plus the command-doc rows and the preflight `extend_values` check. Cites `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts:768` | Met | - |
| AC-017 | REQ-017 | Given every digested source edit in this phase, When the contracts are regenerated, Then `check-contract-drift.cjs` exits 0 | both `compile-command-contracts.cjs --write` runs exit 0; `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`, exit 0, at `ac4151f027f`. Cites `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:190` | Met | - |
| AC-018 | REQ-018 | Given the edited agent definitions, When `/doctor:runtime-mirrors` runs, Then it reports no drift for `deep-research` and `deep-review` | every checker `doctor-runtime-mirrors.yaml` lists exits 0 in check mode after the repairs, including `check-agent-mirror-sync.cjs`, agent-roster `STATUS=OK` and command-catalog `STATUS=OK`. The checkers ran directly from the fork, not through the slash command. Cites `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:161` | Met | - |
| AC-019 | REQ-019 | Given the shipped flag, When the playbook packages are read, Then each `entry-points-and-modes/` category holds an `--extend=N` scenario written by `/create:manual-testing-playbook` and the package index lists it | Deferred: `/create:manual-testing-playbook` requires `@markdown`, and per the parent goal log the scenarios are written and walked in the integration worktree after this phase merges. Cites `.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt:10` | Unmet | - |

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
