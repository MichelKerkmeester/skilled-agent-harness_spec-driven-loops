---
title: "Implementation Plan: Phase 1: deterministic-stop-decision"
description: "Extend convergence.cjs with a --stop-decision mode that computes the research and review stop vote, guards, gates and final reason from the config, state log and registry. The four deep workflow files then branch on its stop_decision JSON. Vitest unit, contract and integration tests prove it."
trigger_phrases:
  - "deterministic stop decision plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: deterministic-stop-decision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script run through the `tsx` loader, plus YAML workflow assets |
| **Framework** | None. The workflows are YAML read by the orchestrating model. |
| **Storage** | The coverage graph SQLite database read by `convergence.cjs`, plus the loop config JSON, `state.jsonl` and `findings-registry.json` |
| **Testing** | Vitest 4.1.12 through `node_modules/.bin/vitest run --no-coverage` in `.skilled/skills/system-deep-loop/runtime/` |

### Overview
The change adds a `--stop-decision` mode to `runtime/scripts/convergence.cjs` and moves the vote, the guards, the gates and the final reason out of workflow prose into that mode. The four `step_check_convergence` steps then read `decision`, `stopReason` and `reasonDetail` from the JSON and do nothing else. New Vitest files fail on today's tree and pass after the change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -c checkQualityGuards .skilled/skills/system-deep-loop/runtime` exits 1 with no output, which confirms F02 on the start tree.
- [ ] `node_modules/.bin/vitest run --no-coverage` in the runtime folder has a recorded baseline passed and failed count in `goal.md`.
- [ ] `rg -n 'stop if avg <= 0\.08' .skilled/commands/deep/assets/deep-review-*.yaml` prints 2 lines.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `node_modules/.bin/vitest run --no-coverage` in the runtime folder reports 0 failed and the baseline passed count plus the new tests.
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files and requirement ids.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Script decides, workflow branches.

### Key Components
- **`runtime/scripts/convergence.cjs`**: gains `--stop-decision` plus the input flags `--config-path`, `--state-log`, `--registry-path`, `--iteration-count`, `--security-sensitive-fix-scope`, `--fix-replay-required-rows` and `--fix-replay-passing-rows`, all added to `CONVERGENCE_FLAGS`. New exported pure functions: `computeStopSignals`, `mapReviewThresholds`, `evaluateResearchQualityGuards`, `evaluateReviewLegalStopGates`, `combineGraphDecision` and `buildStopDecision`.
- **`step_check_convergence` in the four workflow files**: becomes a branch on `stop_decision.decision`. It sets `reason` from `stop_decision.stopReason` and passes `stop_decision.reasonDetail` to the divergent-pivot `branch_on` line.

Why extend and not add a script (D1): `convergence.cjs` already parses flags through `assertKnownFlags`, already opens the graph and already runs in `step_graph_convergence` once per iteration. A second script would need a second graph read, and research's `buildNoveltyCorroboration` compares against the snapshot the first call just persisted, so a second read could return a different graph decision than the first. Extending keeps one read and one decision. Nothing fails by extending, so no new script is added.

### Data Flow
`step_graph_convergence` runs `convergence.cjs` once with `--stop-decision` and the input paths. The script reads the graph as today, then reads the config for `maxIterations`, `minIterations`, `convergenceThreshold`, `stopPolicy`, `stuckThreshold` and `convergenceMode`, reads `state.jsonl` for the evidence iterations and the latest `claim_adjudication` event and reads the registry for questions, dimensions and search coverage. It evaluates in this fixed order: max-iteration cap, stuck threshold, `convergenceMode off` and `stopPolicy max-iterations`, STOP candidates (`all_questions_answered` or `all_dimensions_clean` and the composite vote), minimum-iteration floor, research quality guards or review legal-stop gates (including the claim-adjudication veto), then the graph rule. The payload gains `stop_decision` and the workflow branches on it.

Graph rule (D4): a graph decision of `STOP_ALLOWED` lets a STOP candidate stand, `STOP_BLOCKED` turns it into `BLOCKED` with `blockedStop`. `CONTINUE` or a missing decision turns it into `CONTINUE`. The missing case uses `reasonDetail` `graphDecisionMissing`. Recommendation: fail closed. Trade-off: a run whose graph evaluation always errors spends iterations up to `maxIterations` instead of stopping early, in exchange for never ending on coverage nobody checked. This matches today's empty-graph behavior for the composite vote, where `convergence.cjs` already returns `CONTINUE`. The rule applies to every STOP candidate below the cap, so research `all_questions_answered` now passes the graph check as review `all_dimensions_clean` already does. That conflicts with `deep-research/references/convergence/convergence.md` §3 step 7, which evaluates graph blockers only when graph events exist. Phase 005 owns that doc line.

Quality guards (F02): `sourceDiversity` passes when every answered question links to at least two distinct source nodes through question to finding to source edges in the coverage graph, the rule the DR-020 playbook scenario names. `focusAlignment` passes when every `answeredQuestions` entry in the evidence iteration records appears in that record's `keyQuestions`. `singleWeakSource` reports `notEvaluated` and does not block, because no state field marks a tentative source today.

Threshold mapping (D3): the review rolling-average cutoff is `0.8 x convergenceThreshold`, and the no-progress mark and stuck counter use `0.5 x convergenceThreshold`. The review default `0.10` reproduces today's `0.08` and `0.05`. Per-loop weights and comparison operators stay as they are: research compares the rolling average with `<` and the weighted score with `>`, and review uses `<=` and `>=`.

Stop reasons (D2): `stopReason` takes only the frozen eight values or `null` on `CONTINUE`. The eighth value, `maxDurationReached`, is appended to `STOP_REASONS` in `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` after `userPaused`, because that file's comment makes insertion order contractual. This phase only adds the member. Phase 003 emits it. `reasonDetail` carries `composite_converged`, `all_questions_answered`, `all_dimensions_clean`, `minIterationsNotReached`, `qualityGuardFailed`, `graphDecisionMissing`, `graph_convergence_continue` and the gate names.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/scripts/convergence.cjs` | Producer of the graph decision only | update | `tests/unit/stop-decision.vitest.ts` and `tests/integration/convergence-script.vitest.ts` pass |
| `step_check_convergence` in the four workflow files | Producer of the vote, guards, gates and reason in prose | update | `tests/unit/stop-decision-yaml-contract.vitest.ts` passes |
| Review stuck counter in `deep-review-auto.yaml` and `deep-review-confirm.yaml` | Same-class producer of the `0.05` literal | update | `rg -n '0\.05\b' .skilled/commands/deep/assets/deep-review-*.yaml` prints nothing |
| `step_handle_convergence` `branch_on` in the four workflow files | Consumer of fine reasons for the divergent pivot | update | `rg -n 'stop_decision.reasonDetail' .skilled/commands/deep/assets/deep-*-*.yaml` prints one `branch_on` line per file |
| `deep-research/scripts/divergent-research-pivot.ts` and `deep-review/scripts/divergent-review-pivot.ts` | Consumers of `triggerReason` | unchanged | They receive `reasonDetail`, whose values match their `triggerReason` types |
| `step_normalize_pause_events` | Owner of the frozen enum | unchanged | The enum line still prints in the Measured Behavior command |
| `tests/unit/stop-policy-yaml-parity.vitest.ts` | Consumer of `step_check_convergence` text | update | The test passes against the new step body |
| `deep-research/SKILL.md` line 271 | Third stop-reason vocabulary | update | `rg -n 'Stop reason \(' .skilled/skills/system-deep-loop/deep-research/SKILL.md` prints the seven enum values |
| `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Runtime owner of `STOP_REASONS` | update | `tests/unit/lifecycle-taxonomy.vitest.ts` and `tests/unit/lifecycle-taxonomy-yaml-parity.vitest.ts` pass |
| `deep-research/references/convergence/convergence.md` §2 and §3 | Fourth list, missing `manualStop`, and a graph rule that conflicts with D4 | not in this phase | Operator decision 2026-11-14: phase 005 owns both sections |

Required inventories:
- Same-class producers: `rg -n '0\.08|0\.05|checkQualityGuards|graph_decision is absent|Skip hard stops' .skilled/commands/deep/assets/deep-research-*.yaml .skilled/commands/deep/assets/deep-review-*.yaml`.
- Consumers of changed symbols: `rg -n 'composite_converged|all_questions_answered|all_dimensions_clean|minIterationsNotReached|graph_convergence_continue' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.yaml' --glob '*.md'`.
- Matrix axes: loop type (research, review) x graph decision (`STOP_ALLOWED`, `STOP_BLOCKED`, `CONTINUE`, missing) x candidate source (composite, questions or dimensions, none) x cap state (below cap, at cap) x claim adjudication (passed, failed, review only). The unit test covers every graph-decision row for both loops and both cap states.
- Algorithm invariant: at or past the cap the result is always `STOP` with `maxIterationsReached`. Below the cap no STOP leaves the script unless the graph decision is `STOP_ALLOWED`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the runtime Vitest baseline and reruns the Measured Behavior command. Implementation writes the failing tests, then extends `runtime/scripts/convergence.cjs` and rewrites `step_check_convergence` in the four workflow files and line 271 of `deep-research/SKILL.md`. Verification runs the four named Vitest files, the full runtime suite and the Measured Behavior command. `tasks.md` holds the ordered tasks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `computeStopSignals`, `mapReviewThresholds`, `evaluateResearchQualityGuards`, `evaluateReviewLegalStopGates`, `combineGraphDecision` and `buildStopDecision` | Vitest, `tests/unit/stop-decision.vitest.ts` |
| Integration | `convergence.cjs --stop-decision` over seeded state and graph fixtures, run twice for determinism | Vitest, `tests/integration/convergence-script.vitest.ts` |
| Manual | The four workflow files carry no vote arithmetic | Vitest, `tests/unit/stop-decision-yaml-contract.vitest.ts`, plus the Measured Behavior command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `vitest` 4.1.12 and `tsx` 4.22.4 in the runtime `package.json` | Internal | Green | Tests and the script loader cannot run |
| An owner decision on `sourceStrength` | Internal | Yellow | The single-weak-source guard stays `notEvaluated` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deep-research or deep-review run whose `stop_decision` disagrees with the documented order, or a runtime suite failure after merge.
- **Procedure**: `git revert <implementation-commit>` restores the script, the four workflow files and the tests together. No state file format changes, so existing `state.jsonl` files need no repair.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | The Setup baseline and the failing tests | Verification |
| Verification | Implementation | Close and the phase 002 handoff |
<!-- /ANCHOR:phase-deps -->

---
