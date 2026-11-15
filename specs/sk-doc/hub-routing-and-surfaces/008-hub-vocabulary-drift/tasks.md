---
title: "Tasks: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub vocabulary drift tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. `A` is `.skilled/skills/system-skill-advisor/runtime`. Every command runs from the repository root on branch `worktrees/372-hub-vocabulary-drift`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the failing check output on main before any edit (`scratch/measured-before.txt`). Verify: `rg -c 'drift=9' scratch/measured-before.txt` prints 1.
- [x] T002 Record the advisor suite baseline before any edit (`A/tests/parity/`). Verify: the suites `routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council`, `routing-golden-prompts` and `tests/parity/` print 12 files and 123 tests passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Append six keywords to the `AGENT_CREATION`, `COMMAND_CREATION`, `DIFF` and `GOAL_AUTHORING` intents (`.skilled/skills/sk-doc/ROUTER.md`). Verify: `node S/ci-hub-vocabulary-source.cjs` prints no `DRIFT sk-doc` line.
- [x] T004 Append three keywords to the `RESEARCH`, `REVIEW` and `AI_COUNCIL` intents (`.skilled/skills/system-deep-loop/ROUTER.md`). Verify: `node S/ci-hub-vocabulary-source.cjs` prints no `DRIFT system-deep-loop` line.
- [x] T005 Regenerate the sk-doc hub intent signals with `node S/generate-router-intent-signals.cjs --write` (`.skilled/skills/sk-doc/graph-metadata.json`). Verify: `node S/generate-router-intent-signals.cjs --check` prints `missing=0, orphans=0`.
- [x] T006 Regenerate the system-deep-loop hub intent signals in the same `--write` run (`.skilled/skills/system-deep-loop/graph-metadata.json`). Verify: `node S/generate-router-intent-signals.cjs --check` prints `RESULT: PASSED`.
- [x] T007 Refresh the manifest with `node .skilled/bin/compiled-route-manifest.cjs refresh --hub system-deep-loop --skill-root .skilled/skills/system-deep-loop` (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json`). Verify: `node .skilled/bin/compiled-route-guard.cjs` reports system-deep-loop fresh and exits 0.
- [x] T008 Copy the refreshed manifest over its archive copy, which the refresh itself does not write (`specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json`). Verify: `git status --short` lists the file as modified.
- [x] T009 Recompile the advisor graph with `skill_graph_compiler.py --export-json` (`A/scripts/skill-graph.json`). Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` reports no SIGNAL DRIFT and exits 0.
- [x] T010 Recapture the divergence ledger with `capture-local-native-divergence-ledger.mjs --write` (`A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: `git diff` on the file shows one changed entry, `harder:4c8fe4462488`, with native top moved from sk-doc to system-deep-loop.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Run the hub vocabulary source check (`S/ci-hub-vocabulary-source.cjs`). Verify: `node S/ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` and `RESULT: PASSED` and exits 0.
- [x] T012 Run the intent-signal carry check (`S/generate-router-intent-signals.cjs`). Verify: `node S/generate-router-intent-signals.cjs --check` prints `checked=7 hub(s), missing=0, orphans=0` and `RESULT: PASSED` and exits 0.
- [x] T013 Run the compiled-route guard and admission (`.skilled/bin/compiled-route-guard.cjs`). Verify: the guard reports all hubs fresh and exits 0, and `node .skilled/bin/compiled-route-admission.cjs --hub system-deep-loop` reports 16 pass and exits 0.
- [x] T014 Run the skill graph checks (`A/scripts/skill_graph_compiler.py`). Verify: `skill-graph-freshness.cjs --strict` reports SIGNAL DRIFT none and exits 0, and `skill_graph_compiler.py --validate-only` prints `VALIDATION PASSED` and exits 0.
- [x] T015 Run the hub package checks (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: `parent-skill-check.cjs` prints OK for all seven hubs and `validate_skill_package.py` prints PASS for sk-doc and system-deep-loop, each with exit 0.
- [x] T016 Run the three freshness checks (`S/ci-skill-root-metadata.cjs`). Verify: `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs` and `ci-skill-derived-freshness.cjs` report 14 of 14 and exit 0.
- [x] T017 Rerun the advisor suites of T002 (`A/tests/parity/scorer-eval-baseline-ratchet.vitest.ts`). Verify: 122 of 123 tests pass, and the one failure is the ratchet with `holdout_top1.correct: live=51 baseline=50. improvement detected`.
- [x] T018 Confirm the packet is listed under its parent (`specs/sk-doc/hub-routing-and-surfaces/graph-metadata.json`). Verify: `rg -c '008-hub-vocabulary-drift' specs/sk-doc/hub-routing-and-surfaces/graph-metadata.json` prints 1 or more.
- [x] T019 Superseded 2026-11-14: the operator chose to land from main directly. The baseline is recaptured by T023 (`A/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: on the merged branch `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` passes and `node S/ci-hub-vocabulary-source.cjs` prints `drift=0`.
- [x] T020 Merge the branch tip 6d96d8f1d2 into worktree branch `worktrees/387-hub-vocabulary-drift-landing` and rebuild the conflicted generated files with their writers. Verify: `node S/ci-hub-vocabulary-source.cjs` prints `drift=0`.
- [x] T021 Swap "agent definition" for "new agent definition" and "confirm flag" for "reusable prompt shortcut" in both `.skilled/skills/sk-doc/ROUTER.md` and `.skilled/skills/sk-doc/hub-router.json`, then rerun `generate-router-intent-signals.cjs --write`, `skill_graph_compiler.py --export-json` and the sk-doc manifest refresh with its archive copy. Verify: drift=0, `missing=0, orphans=0`, every hub fresh.
- [x] T022 Score the review's probe prompts and the command-routing corpus against main (`scratch/landing-probes.txt`). Verify: no probe top-1 differs from main, and `capture-command-routing-baseline.mjs` shows no metric different from main.
- [x] T023 Recapture the scorer baseline (`A/scripts/routing-accuracy/scorer-eval-baseline.json`). Verify: `capture-scorer-eval-baseline.mjs` then reads holdout 51 against 51.
- [x] T024 Correct the reason of ledger entry `harder:4c8fe4462488` (`A/tests/parity/fixtures/local-native-approved-divergences.json`). Verify: the reason names the single words stop and several.
- [x] T025 Recapture the routing corpus pin against main's corpus (`specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json`): `skill_graph_compiler.py --validate-only`, `score-routing-corpus.py --out`, `capture-scorer-eval-baseline.mjs` and `capture-top3.mjs`, stdout only. Verify: every run step of `.github/workflows/routing-registry-drift.yml` exits 0 locally, 15 of 15.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node S/ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` and `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
