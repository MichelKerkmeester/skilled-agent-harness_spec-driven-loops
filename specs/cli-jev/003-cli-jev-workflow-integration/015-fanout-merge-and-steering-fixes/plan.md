---
title: "Implementation Plan: Fan-out Merge Under-count and Per-Iteration Steering"
description: "Diagnose the merge shortfall on the committed lineage files of three research rounds, then let fanout-merge.cjs rebuild a short registry from markdown, graph and delta evidence per iteration with a counted gap, and add one steer.md instruction to the CLI lineage prompt."
trigger_phrases:
  - "fanout merge fix plan"
  - "short registry reconstruction plan"
  - "delta finding records merge"
  - "steer.md prompt line plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fan-out Merge Under-count and Per-Iteration Steering

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts (`.cjs`), Node 20.11 or later per `runtime/package.json` |
| **Framework** | None. Plain `fs` and `path` |
| **Storage** | Files: lineage registries, `deep-research-state.jsonl`, `iterations/*.md`, `deltas/iter-NNN.jsonl` |
| **Testing** | vitest 4.1.11, run from `.skilled/skills/system-deep-loop/runtime` with `npx vitest run --no-coverage` |

### Overview
The build first replays the current merge over temp copies of the three rounds' committed lineages and records why each lineage came up short. It then changes one gate and the evidence reader in `fanout-merge.cjs`, so a short registry is rebuilt per iteration from markdown, graph or delta records and the rest is counted as a gap. Last, it adds one conditional line to `buildLoopPrompt` in `fanout-run.cjs` that points each CLI lineage iteration at its `steer.md`. All four changed code files belong to `system-deep-loop`, and the build follows its `SKILL.md`, its state format reference and its existing tests. Code comments carry the durable reason only, with no spec path, no packet or phase number and no REQ or task id.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The REQ-001 diagnosis table is in `implementation-summary.md` and reproduces 85, 74 and 65
- [x] The build tree holds both Grok roster commits, `ac156a7112` and `9fe8526284`
- [x] A baseline run of `fanout-merge.vitest.ts` and `fanout-run.vitest.ts` is recorded with its pass count

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is Met with observed output
- [x] The two test files pass with the baseline count plus the new tests
- [x] The replay prints the REQ-007 numbers, and the three committed `research/` directories show no change
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Monolith scripts. `fanout-merge.cjs` is a CLI with exported pure helpers. `fanout-run.cjs` builds prompt text with an exported pure function.

### Key Components
- **`researchCandidatesFromIteration`** (`fanout-merge.cjs:1040-1079`): picks one evidence source per iteration by exact count. It gains the delta source and returns an unmatched marker instead of throwing when nothing matches
- **`reconstructResearchRegistryFromState`** (`:1092-1124`): gathers per-iteration candidates. It also returns how many counted findings went unrebuilt
- **The reconstruction gate in `main`** (`:1210-1233`): runs reconstruction when the registry is empty or short, compares counts and sets `sourceFindings` and `reconstructionGaps` from the result
- **`buildLoopPrompt`** (`fanout-run.cjs:1406-1525`): gains one conditional steering line

### Data Flow
The merge loads each lineage's registry, state log, iteration files and now its delta files. For a lineage that needs it, it rebuilds findings per iteration and compares the rebuilt total with the registry's. It writes the merged registry with per-lineage sums of `sourceFindings` and `reconstructionGaps` (`:760-767`). The convergence check in `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:347-359` reads those two metrics and raises the `synthesis_incomplete` invariants, unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-merge.cjs` reconstruction gate and helpers | Producer of `keyFindings`, `metrics.sourceFindings` and `metrics.reconstructionGaps` | Update | New and existing tests in `fanout-merge.vitest.ts`, plus the three-round replay |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:347-359` (the planning premise placed this check in `deep-research-auto.yaml` and `deep-research-confirm.yaml`, where it is not) | Consumer. Turns the two metrics into `synthesis_incomplete` invariants | Unchanged | The replay's round 1 metrics clear both invariants, since `sourceFindings` 134 is at least `countOnlyFindingCount` 112 and the gap is 0 |
| `reconstructReviewRegistryFromState` and the review merge | Same file, review loop | Unchanged | `rg -n "loopType === 'review'" fanout-merge.cjs` shows the edited branch is research-only |
| `reduce-state.cjs` lineage delta aggregation | Reads the same delta files for the resource map | Unchanged, not a consumer of the merge change | Its existing tests stay green in the full runtime suite |
| `requireRealDirectory` and `resolveOptionalRealFile` (`fanout-merge.cjs:120-146`) | Path guards for lineage files | Unchanged, gain the delta directory as a caller | The existing symlink tests for iteration sources still pass |
| `buildLoopPrompt` | Producer of the CLI lineage prompt | Update | New test in `fanout-run.vitest.ts`. Existing prompt tests in `fanout-run.vitest.ts`, `fanout-loop-prompt-in-process.test.ts`, `stress/cli-adapter/fanout.vitest.ts` and `workflow-session-id-parity.vitest.ts` still pass |
| `buildNativeCommandInput` | Native lineage input | Unchanged | Out of scope, see spec section 3 |

Required inventories:
- Same-class producers: `rg -n 'hasUsableResearchFindings|reconstructionGaps|sourceFindings' .skilled/skills/system-deep-loop/runtime/scripts` lists every writer of the two metrics before the edit.
- Consumers of changed symbols: `rg -n 'reconstructResearchRegistryFromState|reconstructionGaps|sourceFindings' .skilled --glob '*.cjs' --glob '*.ts' --glob '*.yaml' --glob '*.md'`, excluding `node_modules` and changelogs.
- Matrix axes: registry state (missing, empty, short, full) against evidence per iteration (markdown match, graph match, delta match, no match). The regression tests cover short with delta match and short with no match anywhere. Existing tests cover the missing and empty rows.
- Algorithm invariant: for every lineage, rebuilt findings plus `reconstructionGaps` equals the count-only `findingsCount` sum whenever the rebuild is used. When the registry is kept, `reconstructionGaps` equals that sum minus the registry's finding count, floored at 0.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step and its observable check:

| Step | What | Observable check |
|------|------|------------------|
| 1. Diagnose | Replay the current merge over temp copies of each round's `lineages/`. Tabulate per lineage the registry count, count-only sum and per-iteration evidence match | The replay prints `sourceFindings` 85, 74 and 65 with `reconstructionGaps` 0, and the table is in `implementation-summary.md` |
| 2. Gate | Reconstruct when the registry is empty or short | A short-registry unit test fails before the edit and passes after |
| 3. Delta source | Read `deltas/iter-NNN.jsonl` finding records through the existing path guards | The same test rebuilds findings whose text comes from delta `label` fields |
| 4. Per-iteration gaps | Return unmatched counts instead of throwing, and keep the registry when it holds more | The no-match edge test keeps the registry and reports the counted gap |
| 5. Steering line | Add the conditional `steer.md` line to `buildLoopPrompt` | The prompt test finds the absolute `steer.md` path and the words "when it exists" |
| 6. Replay | Rerun step 1 on the fixed code | Round 1 prints at least 112 with gap 0, rounds 2 and 3 print gaps equal to the table's unmatched totals |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Short registry rebuilt from delta records, copied from round 1 deepseek (happy path). No iteration matches, copied from round 3 grok, so the registry is kept and the gap counted (edge). Steering line present with conditional wording | vitest, `fanout-merge.vitest.ts` and `fanout-run.vitest.ts` |
| Integration | The merge CLI over temp copies of all three rounds' lineages, before and after the fix | `node fanout-merge.cjs --loop-type research --artifact-dir <temp>` |
| Manual | None. The parent goal allows no model call, so no live fan-out run | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Committed lineage files of rounds 1 to 3 | Internal | Green: tracked in this worktree | No diagnosis and no fixture source |
| `system-deep-loop` runtime `node_modules` with vitest | Internal | Green: `runtime/node_modules` exists | Tests cannot run |
| Both Grok roster commits in the build tree | Internal | Green: both are ancestors of the build base `6f47c32dce`, and `fanout-run.cjs` matches `main` there | A merge conflict in `fanout-run.cjs` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any existing test in the runtime suite fails after the change, or the replay prints a lower `sourceFindings` than the step 1 baseline for any round
- **Procedure**: `git revert <fix commit>` restores both scripts and both test files. Nothing else changes, because the phase writes no data, schema or config
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline + diagnosis) ──► Merge fix ──► Replay ──► Verify
                            └──► Steering line ────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Merge fix, Steering line |
| Merge fix | Setup | Replay |
| Steering line | Setup | Verify |
| Verify | Merge fix, Steering line, Replay | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour (baseline tests, diagnosis replay and table) |
| Core Implementation | Med | 2 to 3 hours (merge gate, delta source, gaps, prompt line, tests) |
| Verification | Low | 1 hour (full runtime suite, replay, docs) |
| **Total** | | **4 to 5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed. The phase changes no data file, and the replay runs on temp copies only
- [ ] No feature flag. The merge change is a correctness fix, and the prompt line is conditional on the file existing
- [ ] No monitoring. The next fan-out run's `step_convergence_report` event is the signal

### Rollback Procedure
1. Stop using the fixed merge for new runs by checking out the prior `fanout-merge.cjs` if a run's merged registry looks wrong
2. `git revert <fix commit>` on the branch that carries it
3. Rerun `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts tests/unit/fanout-run.vitest.ts` and the step 1 replay, and expect the baseline numbers
4. Tell the operator. The only user-facing effect is the synthesis event of later research runs

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
