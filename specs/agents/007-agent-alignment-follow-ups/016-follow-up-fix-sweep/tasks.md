---
title: "Tasks: Phase 16: follow-up-fix-sweep"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "follow up fix sweep tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: follow-up-fix-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `R` is `.skilled/skills/system-deep-loop/runtime`. `Y` is `.skilled/commands/deep/assets`. `L` is `R/lib/deep-review-ledger-schema`. Commands run from the worktree root unless they `cd` into `R`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the runtime suite, the typecheck, the stem census and the agent mirror check before any edit (`scratch/baseline.txt`). Verify: the file holds the `Tests` line and exit status of `(cd R && npm test)` and `npm run typecheck`, the census counts, and `node .skilled/bin/check-agent-mirror-sync.cjs` exit status.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Widen `TerminalGatesRecordedData.stopReason` to `'converged' | 'maxIterationsReached' | 'manualStop' | 'error'` (`L/deep-review-ledger-types.ts`). Verify: `rg -n "'manualStop' \| 'error'" L/deep-review-ledger-types.ts` prints one line.
- [x] T003 Widen the `stopReason` enum rule to the same four values and refuse a terminal record whose gate results hold any status other than `pass` or `fail` (`L/deep-review-ledger-schema.ts`). Verify: `(cd R && npm run typecheck)` exits 0.
- [x] T004 [P] Add accept cases for `manualStop` and `error` and a refuse case for an `unknown` gate (`R/tests/unit/deep-review-ledger-schema.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/deep-review-ledger-schema.vitest.ts)` prints a `Tests` line with no failure.
- [x] T005 In the auto workflow, pass `manualStop` and `error` through the `terminal_stop_reason` rule, and make `error_recovery.consecutive_failures` run `record_terminal_gates` with stop reason `error` before synthesis (`Y/deep-review-auto.yaml`). Verify: `rg -n "consecutive_failures" Y/deep-review-auto.yaml` shows `record_terminal_gates`.
- [x] T006 In the confirm workflow, pass the reasons through, set the reason before the record in both pivot `on_C` branches, and add `run_first: record_terminal_gates` with stop reason `manualStop` to the `on_C` of `gate_pre_iteration` and of the post-iteration gate (`Y/deep-review-confirm.yaml`). Verify: every `gate_pre_synthesis` entry from the loop carries `run_first: record_terminal_gates`.
- [x] T007 Recompile the deep-review contract (`Y/compiled/deep-review.contract.markdown`). Verify: `node R/scripts/check-contract-drift.cjs --command deep/review` prints `OK`.
- [x] T008 Keep a lineage whose state log holds a terminal row and no findings: compute the terminal row before the empty check and return null only when both are absent (`R/scripts/fanout-merge.cjs`). Verify: `node --check R/scripts/fanout-merge.cjs` exits 0.
- [x] T009 [P] Add a merge case: one lineage with no registry and a state log holding only a `terminal_gates` row with `['coverage']` makes the merged verdict FAIL (`R/tests/unit/fanout-merge.vitest.ts`). Verify: `(cd R && npx vitest run tests/unit/fanout-merge.vitest.ts)` prints a `Tests` line with no failure.
- [x] T010 [P] Comment the terminal case in the typed reducer (`R/lib/deep-review-reducers/deep-review-reducer.ts`). Verify: typecheck exits 0. Superseded by T022 and T023: the comment's claim was wrong.
- [x] T011 Extend the existing @review checklist line so a pass with LOW confidence surfaces the `Not checked:` line and re-dispatches @review once, then regenerate the `.claude` fork (`.skilled/agents/orchestrate.md`). Verify: `wc -l < .skilled/agents/orchestrate.md` prints 600 or less and the mirror check exits 0.
- [x] T012 [P] Limit `DQI=n/a` to outputs that are not markdown and require a named substitute check with its exit status in NOTES, in both places the rule appears, then regenerate the fork (`.skilled/agents/markdown.md`). Verify: the mirror check exits 0.
- [x] T013 [P] Set the TEST line to `TEST: NOT RUN` (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`). Verify: `rg -n '<ran:' <card>` exits 1.
- [x] T014 [P] In the crosswalk, name `gpt-6-luna` for Codex, say a pin is read by any invocation that passes no model, and add `.devin` beside `.cursor` where the reach of `prompt-improver.md` is named (`.skilled/bin/agent-mirror-crosswalk.md`). Verify: `rg -n 'gpt-5.5' <crosswalk>` exits 1.
- [x] T015 [P] Point the debug scaffold's schema comment at the `### Context Handoff Format` heading, drop the dead folder pointer, and make the same pointer change on the playbook page (`.skilled/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh`, its playbook page). Verify: `rg -n 'lines 60-89' .skilled` exits 1.
- [x] T016 [P] Name `ai-council.md` in place of `deep-ai-council.md` and drop the mirror count (`.skilled/skills/system-deep-loop/deep-ai-council/references/structure/folder-layout.md`). Verify: `rg -n 'deep-ai-council\.md' <file>` exits 1.
- [x] T017 [P] Prefix every `check-prerequisites.sh` call with `SPECIFY_FEATURE=<track>/<NNN-name>` naming an existing packet (`.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md`). Verify: running the prefixed call exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Rerun the suite, typecheck, census, parity suites, drift check and mirror check (`scratch/after.txt`). Verify: no failure `scratch/baseline.txt` lacks.
- [x] T019 Re-run the SC-002 probe with `claude -p --model opus --output-format stream-json --verbose` from the primary checkout (`scratch/sc-002.jsonl`). Verify: the record states pass or not, from the sub-agent's `message.model` and its first line.
- [x] T020 Run strict validation on this folder (`spec.md`). Verify: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- [x] T021 [P] Name the agent `ai-council` in the council feature catalog row, feature page, playbook scenario and index, and search `.opencode/agents/` in the scenario (`deep-ai-council/feature-catalog/`, `deep-ai-council/manual-testing-playbook/`). Verify: `rg -n 'mirrors use deep-ai-council' <skill>` exits 1.
- [x] T022 Add reducer cases: a blocked stop then a passing terminal record lets `synthesis_started` fold; a failing record stays blocked (`R/tests/unit/deep-review-reducers.vitest.ts`). Verify: the passing case fails before T023.
- [x] T023 A passing terminal record resolves the `gate:` obligations, drops the gate blockers, sets `converged` only for a `converged` stop (else `active`) and moves the status to active; add the max-iterations case (`R/lib/deep-review-reducers/deep-review-reducer.ts`). Verify: `(cd R && npx vitest run tests/unit/deep-review-reducers.vitest.ts)` prints `93 passed`; full gates in `scratch/after-fix-open.txt`.
- [x] T024 Apply the @review round-1 fixes: the DAC-001 objective names `ai-council`; the leftover `@deep-ai-council` handles in `output-schema.md`, `depth-dispatch.md`, `folder-layout.md` and one link title name `@ai-council`; a passing record clears each blocked-stop gate blocker, bare or prefixed; the status returns to active only from blocked; the fixture uses the production gate name `dimensionCoverageGate`, and two tests are added (`R/lib/deep-review-reducers/deep-review-reducer.ts`, its test, the council docs). Verify: reducer tests pass 95/95, and each new test fails on its mutation (`scratch/after-fix-open.txt`).
- [x] T025 Merge `origin/main`. Upstream retired the council skill (`adbba5a06a9`), so its deletion wins over the T021 and T024 doc edits. Upstream also folded the two review workflows into `deep-review.yaml`, so port the stop-reason pass-through and the two ordinary manual-stop records into it, add `run_first` to the divergent pivot's accept-gate manual stop, and recompile the review contract (`.skilled/commands/deep/assets/deep-review.yaml`). Verify: suite, typecheck, census, drift and mirrors in `scratch/after-merge.txt`.
- [x] T026 Apply the port review's fixes: the stop-reason rule reads `reason`, not `stopReason`, and the override gate's `order` and `on_A` name the branch's `run_first` (`deep-review.yaml`). Verify: drift `OK commands=2`, contract tests 33/33.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/after.txt` shows the suite, census, drift and mirror checks with no new failure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Origin**: the 2026-11-15 Fable 5.2 review of the items 015 and children 008 to 014 left open, and the operator's answers Q1 A, Q2 A and Q3 B
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task that cannot pass is marked `[B]` with its failing output in `scratch/after.txt`, and the packet stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] `scratch/baseline.txt` holds the T001 output
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `(cd R && npm run typecheck)` shows no error the baseline lacks
- [x] CHK-011 [P0] `(cd R && npm test)` shows no failure the baseline lacks
- [x] CHK-012 [P1] The gateway refuses a terminal record with an `unknown` gate and accepts `manualStop` and `error`
- [x] CHK-013 [P1] `check-ledger-stem-producers.cjs` and `check-agent-mirror-sync.cjs` exit 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] A registry-less lineage with a failed gate makes the merged verdict FAIL
- [x] CHK-022 [P1] Every loop exit into `gate_pre_synthesis` or `phase_synthesis` carries `run_first: record_terminal_gates`
- [x] CHK-023 [P1] The SC-002 probe result is recorded
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The terminal-record gap is class `cross-consumer`: several stop paths reach one verdict rule.
- [x] CHK-FIX-002 [P0] The same-class producer inventory in `plan.md` lists every entry into synthesis, and each writes the record or is recorded as out of scope.
- [x] CHK-FIX-003 [P0] The `stopReason` consumer inventory names only readers that pass the value through.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction surface changes.
- [x] CHK-FIX-005 [P1] The enum widening, the unknown refusal and the registry-less merge each have a test case.
- [x] CHK-FIX-006 [P1] N/A: no test or code reads process-wide state.
- [x] CHK-FIX-007 [P1] `scratch/after.txt` names the commit it was taken at.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret is read or written by any changed file
- [x] CHK-031 [P0] N/A: no new ledger field; the terminal record keeps its four data keys
- [x] CHK-032 [P1] N/A: no auth surface changes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same four stop reasons and the same stop paths
- [x] CHK-041 [P1] No code comment carries a packet, phase or task id
- [x] CHK-042 [P2] Each stale string named in T013 to T017 has no remaining match
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baseline and after output live in `scratch/` only
- [x] CHK-051 [P1] `scratch/` holds no file the build did not need
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
