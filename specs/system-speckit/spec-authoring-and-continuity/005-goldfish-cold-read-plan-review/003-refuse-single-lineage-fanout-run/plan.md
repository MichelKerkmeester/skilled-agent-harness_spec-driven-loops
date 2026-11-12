---
title: "Implementation Plan: Phase 3: refuse-single-lineage-fanout-run"
description: "Add an early one-lineage guard to the existing runner, preserve deliberate direct calls with one explicit flag, and update the known callers."
trigger_phrases:
  - "refuse single lineage fanout run plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: refuse-single-lineage-fanout-run

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS runner and TypeScript runtime helpers |
| **Framework** | Existing deep-loop runtime |
| **Storage** | Filesystem run artifacts; no storage-schema change |
| **Testing** | Vitest from the runtime package |

### Overview
Register `allowSingleLineage` in `fanout-run.cjs`'s known flag list. Immediately after the runner expands the matrix, reject research and review calls with one resulting lineage unless the flag is present; do this before preflight side effects or spawning. Update existing direct-run fixtures and the repin procedure to use the opt-in, and keep Phase 2's single-executor routing as a prerequisite for normal command users.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The Phase 2 single-entry route is implemented and verified. Evidence: T001's route-boundary searches each return 1; the research/review command docs route a one-lineage matrix through `config.executor` at lines 125-127 and 97-99.
- [x] The six implementation files in `spec.md` are still the only files in scope. Evidence: the six-file scope table in `spec.md` and the six phase-specific edit targets in `tasks.md` T002-T012.
- [x] The measured expansion helper and runner boundary are present in `fanout-run.cjs`. Evidence: `fanout-run.cjs:3396-3407`, re-read during closeout.

### Definition of Done
- [x] REQ-001 and REQ-002 acceptance checks pass. Evidence: the focused refusal and opt-in runs at `../scratch/build-evidence.md:77-87`, plus the final full-suite run at line 119.
- [x] The focused unit and stress suites pass: `fanout-run.vitest.ts` reports 179 passed, `lineage-timestamp-window.vitest.ts` reports 5 passed, and `tests/stress/cli-adapter` reports 152 passed and 8 skipped. Evidence: `../scratch/build-evidence.md:89-105`; final full-suite exit 0 at line 119.
- [x] `repin-runbook.md` includes the explicit opt-in in its direct runner command. Evidence: `tasks.md` T012; current flag location is `repin-runbook.md:153`.
- [x] The child packet passes `validate.sh --strict --quiet`. The final validator result is reported in the closeout output.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Preflight refusal in the existing runner.

### Key Components
- **`fanout-run.cjs`**: Owns CLI flag validation and the expanded-lineage boundary; without the guard, direct research/review calls proceed to normal fan-out preflight.
- **Existing direct callers**: Unit/stress fixtures and the repin procedure must opt in when they deliberately test or use one-lineage fan-out.

### Data Flow
`parseArgs` converts the CLI spelling to the camelCase key and validates it against `FANOUT_FLAGS`. The runner expands the executor matrix, then checks loop type, expanded length, and the opt-in before capability preflight and run side effects. An unapproved one-lineage research/review call raises `inputError`; an opted-in direct call continues through the existing path.

### Decisions made in the review pass

These close choices the first draft left to the implementer. Each is written into the task that carries it.

- **Where the refusal sits.** Directly after `const allLineages = expandLineages(fanoutConfig);` at `fanout-run.cjs:3396` and before the stop-policy guard at 3409-3418. Nothing before that line creates a directory or writes a ledger. The first ledger append is at 3436. A one-lineage call is told to leave the runner before it is told its iteration cap is missing.
- **What counts as opting in.** Only the bare flag, `args.allowSingleLineage === true`. `parseArgs` sets a flag to `true` when the next token starts with `--` or is absent, so every edit puts the flag last or before another flag.
- **The message.** `fan-out refused: this <loopType> executor matrix expands to one lineage. Run the single-executor /deep:<loopType> workflow instead; it runs the packet init, synthesis and save phases, which this runner does not.` It names neither the flag nor a count.
- **One helper edit covers ordinary unit launches.** In `fanout-run.vitest.ts`, `spawnCjs` calls flow through `canonicalizeFanoutArgs` (definition at line 98, wrapper at line 143), which appends the flag. The refusal and opt-in tests at lines 2524 and 2560 use `rawSpawnCjs` directly so they can test both flag states.
- **The recorded cassette case uses explicit argv.** It calls `recordScriptRun` at line 3034 and `replayScriptRun` at line 3070, and asserts the argument list at lines 3014-3051. T005 and T006 add the flag to the actual and expected arguments.
- **The refusal test must not pass through the helper.** T007's case calls `rawSpawnCjs`, which the helper does not wrap, and builds its artifact directory with `makeBaseArtifactDir` the way the recorded-run case does.
- **The stress file has three launch helpers.** `fanoutInvocation`, `runReviewFanoutConfig` and `runFanoutFromCwd` in `tests/stress/cli-adapter/fanout.vitest.ts` each build the argument list from the same line. T010 replaces all three occurrences. The flag is harmless on a matrix that expands to more than one lineage.
- **Red tests are not repaired by guessing.** T006 to T008 and T013 to T015 run tests. A failure blocks the task and goes to `goal.md` as an open question.

Known gap, stated and not fixed: a count of 2 passes the refusal, and `deep-research-auto.yaml:1216` tells a `cli-deepseek-harness` caller to rerun with `--count=2`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup inspects `fanout-run.cjs` at its existing expansion boundary and confirms the Phase 2 single-executor route is ready.
Implementation updates `fanout-run.cjs`, `fanout-run.vitest.ts`, `adapter-fixture.ts`, `fanout.vitest.ts`, `lineage-timestamp-window.vitest.ts`, and `repin-runbook.md`.
Verification runs the unit tests in `fanout-run.vitest.ts` and `lineage-timestamp-window.vitest.ts`, the `tests/stress/cli-adapter` suite, and the runbook flag check; the ordered commands are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the scoped runner, timestamp-window, and CLI-adapter stress tests from the runtime package:

```bash
cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts tests/unit/lineage-timestamp-window.vitest.ts tests/stress/cli-adapter
```

Expected result: the command exits 0 and Vitest reports no failed tests. Check the operator procedure separately with the `rg` command in `tasks.md`. The recorded focused results are in `../scratch/build-evidence.md:89-105`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 2 must route a one-lineage `--executors` matrix to `config.executor`; this prevents the legitimate command path from reaching the new fan-out refusal.
- The change uses the existing Node.js/TSX runtime and Vitest package. No new dependency is needed.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an explicitly opted-in direct caller is still refused, or a normal command caller is refused after Phase 2 is verified. Revert the scoped changes to the six implementation files in `spec.md`; do not broaden the guard or add another execution path as a workaround.
<!-- /ANCHOR:rollback -->

---


<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Parses the runner flags and owns the boundary after matrix expansion. | Register the opt-in and refuse an unapproved single-lineage research or review run before capability preflight. | T001-T003; `node --check .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` exits 0. |
| Unit and stress callers, including `adapter-fixture.ts`, `fanout.vitest.ts` and `lineage-timestamp-window.vitest.ts` | Launch direct one-lineage runs or exercise their behavior. | Add the opt-in to intentional direct calls and add negative and positive guard cases. | T004-T011 apply the edits; T013-T015 pass. |
| `repin-runbook.md` | Gives operators a direct one-lineage runner procedure. | Pass the explicit opt-in in the procedure. | T012 finds the flag in the command. |

Same-class producer inventory: `rg -n 'expandLineages\(' .skilled/skills/system-deep-loop/runtime/scripts`. T001 rechecks the runner boundary before implementation.

Consumers of the changed flag: `rg -n 'allowSingleLineage|--allow-single-lineage' .skilled/skills/system-deep-loop/runtime .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md`. T004-T006 and T009-T012 update the known direct consumers.

Matrix axes are loop type (`research` or `review`), expanded count (one or not one) and opt-in state (absent or present). Required one-lineage rows are research without the opt-in, review without it, research with it and review with it. T007 and T008 add the negative and positive cases. The `--count=2` bypass remains outside this packet.

Invariant: reject only a research or review run whose expanded lineage list contains exactly one entry and whose opt-in is absent. Run the check before capability preflight and run side effects.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 2 must route a one-lineage matrix through `config.executor`; T001 confirms the current expansion boundary. | Implementation |
| Implementation | Setup passes and the Phase 2 route is verified. | Verification |
| Verification | The guard, direct callers and runbook changes are implemented. | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
