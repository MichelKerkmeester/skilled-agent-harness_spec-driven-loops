---
title: "Tasks: Phase 17: dsh-single-executor-loop"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh single executor loop tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: dsh-single-executor-loop

<!-- SPECKIT_LEVEL: 2 -->

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

`RT` is `.skilled/skills/system-deep-loop/runtime`. `PK` is this packet folder. Commands without a `cd` run from the repository root. `TOUCHED` is the three test files `tests/executor-audit-cli-branch-receipts.test.ts tests/unit/executor-branch-contract.vitest.ts tests/unit/write-containment-yaml-call-sites.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Rerun the touched-test baseline (`$RT/vitest.config.ts`). Verify: `cd $RT && npx vitest run --no-coverage $TOUCHED` prints `Tests  10 passed (10)`. Evidence: the pre-edit touched run printed 10 passed.
- [x] T002 Recount the 19 search texts against the tree (`$PK/plan.md`). Verify: `python3 -I $PK/scratch/apply-edits.py count .` prints `python_count=1 rg_U_c_F=1` on all 19 lines. Evidence: the worker applied all 19 edits through `apply-edits.py` with exit 0, so each search text matched once.
- [x] T003 [P] Rerun typecheck, drift and YAML load baselines (`$RT/package.json`). Verify: `npm run typecheck` exits 0, `check-contract-drift.cjs --command deep/review` and `--command deep/research` each print `[CONTRACT DRIFT] OK commands=1` and both `:auto` YAMLs load. Evidence: typecheck exit 0, both drift checks OK and both YAMLs loaded before the edits.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Apply E1, E2 and E3 (`$RT/lib/deep-loop/executor-audit.ts`). Verify: `cd $RT && npm run typecheck` exits 0 and `rg -c "dispatchEnv|completionCheck" lib/deep-loop/executor-audit.ts` prints 6. Evidence: `rg -c` prints 6 and typecheck exits 0.
- [x] T005 Apply E4 and E5 (`.skilled/commands/deep/assets/deep-review-auto.yaml`). Verify: the YAML loads with `yaml.safe_load` and `rg -c "runs only as a fan-out" .skilled/commands/deep/assets/deep-review-auto.yaml` prints nothing. Evidence: the YAML loads and the refusal text is gone.
- [x] T006 Apply E6 and E7 (`.skilled/commands/deep/assets/deep-research-auto.yaml`). Verify: the YAML loads with `yaml.safe_load` and `rg -c "runs only as a fan-out" .skilled/commands/deep/assets/deep-research-auto.yaml` prints nothing. Evidence: the YAML loads and the refusal text is gone.
- [x] T007 [P] Apply E8, E9 and E10 (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n "fan-out only|exits 2, so give" .skilled/commands/deep/assets/deep-review-presentation.txt` prints nothing. Evidence: the search prints nothing.
- [x] T008 [P] Apply E11, E12 and E13 (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n "fan-out only|exits 2, so give" .skilled/commands/deep/assets/deep-research-presentation.txt` prints nothing. Evidence: the search prints nothing.
- [x] T009 [P] Apply E14 and E15 (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/fanout-executor.md`). Verify: `rg -n "version: 1.1.3.0|workflows have no dsh branch" <file>` prints 2 lines. Evidence: the search prints line 12 and line 115.
- [x] T010 Apply E16 and E17 (`$RT/tests/executor-audit-cli-branch-receipts.test.ts`). Verify: `cd $RT && npx vitest run --no-coverage tests/executor-audit-cli-branch-receipts.test.ts` prints `Tests  5 passed (5)`. Evidence: covered by the touched run, 13 passed across the three files.
- [x] T011 Apply E18 and E19 (`$RT/tests/unit/executor-branch-contract.vitest.ts`). Verify: `cd $RT && npx vitest run --no-coverage tests/unit/executor-branch-contract.vitest.ts` prints `Tests  6 passed (6)`. Evidence: covered by the touched run, 13 passed across the three files.
- [x] T012 Regenerate the review and research contracts with `compile-command-contracts.cjs --write` (`.skilled/commands/deep/assets/compiled/`). Verify: `check-contract-drift.cjs --command deep/review` and `--command deep/research` each print `[CONTRACT DRIFT] OK commands=1`. Evidence: both `--write` compiles exit 0 and both drift checks print `[CONTRACT DRIFT] OK commands=1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Run the touched tests (`$RT/vitest.config.ts`). Verify: `cd $RT && npx vitest run --no-coverage $TOUCHED` prints `Tests  13 passed (13)`. Evidence: `Test Files  3 passed (3)` and `Tests  13 passed (13)`.
- [x] T014 Run the full runtime suite (`$RT/vitest.config.ts`). Verify: `cd $RT && npx vitest run --no-coverage` prints the plan section 5 baseline counts plus 3 passed tests. Evidence: `Test Files  173 passed (173)`, `Tests  2894 passed | 8 skipped (2902)`, 220.57 s, exit 0. Before: 2891 passed.
- [x] T015 Smoke both rendered dsh branches against a stub `dsh` (`$PK/scratch/dsh-branch-smoke.py`). Verify: for each `:auto` YAML, `ok` mode prints `exit 0`, `cwd_is_artifact_dir True`, `home_removed_after_run True`, `"gateDisabled": "1"`, `"promptStart": "REPOSITORY ROOT:"` and `dispatch_failures []`, and `inactive` mode prints `exit 0` and one `crash` failure with detail `reported a plugin that did not activate`. Evidence: all four runs print `exit 0`, `cwd_is_artifact_dir True`, `home_removed_after_run True` and the expected failures. The temp folder must sit inside the worktree. A folder outside it makes write containment exit 1 after the dispatch.
- [x] T016 Run one keyed single-lineage review iteration (`.skilled/commands/deep/assets/deep-review-auto.yaml`). Verify: the AC-009 commands print an `iteration-001.md` path, at least 1 `"type":"iteration"` record and no `dispatch_failure`. Evidence: In the five-iteration `/deep:review` at `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/review/` (built on `1bedb33577`, recorded in `aab544ae11`), `ls iterations/iteration-001.md` exits 0, `rg -c '"type":"iteration"' deep-review-state.jsonl` prints 5, `rg -c dispatch_failure` on the same log prints nothing with exit 1, no `dsh-home-*` folder newer than 2026-11-14 11:00 is in `os.tmpdir()`, and each `dispatch-receipts/dispatch-review-i{1..5}-g1.completion.json` holds `exitStatus` 0, `signal` null and executor kind `cli-deepseek-harness` with the artifact directory as cwd.
- [x] T017 Confirm the tree holds only the planned files (`git status`). Verify: `git status --short` lists the 8 edited files, the 2 regenerated contracts and this packet, and no `specs/smoke` or `dsh-home-*` path. Evidence: `git status --short` lists the 8 edited files, the 2 contracts, the parent `spec.md` and `graph-metadata.json` and this packet, with no `specs/smoke` or `dsh-home-*` path.
- [x] T018 Fill the implementation summary with the files and the verify output (`$PK/implementation-summary.md`). Verify: `rg -o '\[YOUR_VALUE_HERE:' $PK/implementation-summary.md | wc -l` prints 0. Evidence: the count prints 0.
- [x] T019 Validate the packet (`$PK/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PK --strict --quiet` prints `RESULT: PASSED`. Evidence: the strict run prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The touched tests print `Tests  13 passed (13)` and both drift checks print `OK`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, section 3 for edits E1 to E19 and section 5 for the baselines
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocks when a search text counts other than 1. Mark it `[B]`, stop and record the count, because the tree moved since the plan.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements REQ-001 to REQ-009 are in `spec.md`. Check: `rg -c "^\| REQ-" spec.md` prints 9. Evidence: REQ-001 to REQ-009 are in `spec.md`.
- [x] CHK-002 [P0] Edits E1 to E19 are in `plan.md`. Check: `rg -c "^#### E[0-9]+" plan.md` prints 19. Evidence: E1 to E19 are in `plan.md`.
- [x] CHK-003 [P1] Every search text counts 1. Check: T002 output. Evidence: T002.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Typecheck is clean. Check: `cd $RT && npm run typecheck` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] Both `:auto` YAMLs load. Check: `yaml.safe_load` exits 0 on each. Evidence: both print yaml ok.
- [x] CHK-012 [P1] Neither dsh branch holds a bare `dsh` word. Check: the branch contract test reports no `bare dsh word` gap. Evidence: the branch contract test passes with no gap.
- [x] CHK-013 [P1] New code comments carry no spec path, phase number or task id. Check: `rg -n "specs/|Phase 17|T0[0-9]{2}|REQ-" <the 8 edited files>` prints nothing new. Evidence: the added lines of the diff hold no match.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`. Evidence: AC-001 to AC-008 at `1bedb33577` and AC-009 from the live review recorded in `aab544ae11`.
- [x] CHK-021 [P0] The stub-dsh smoke passes for both YAMLs in both modes (T015). Evidence: T015.
- [x] CHK-022 [P1] The new tests fail on the unedited runner and YAMLs. Check: the plan section 5 prototype evidence, `Tests  3 failed | 8 passed (11)`. Evidence: plan section 5.
- [x] CHK-023 [P1] An exit-0 run with an inactive plugin records a `crash` dispatch failure (receipts cell 5 and T015 `inactive` mode). Evidence: receipts test passes and T015 `inactive` prints the `crash` failure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Finding class is `cross-consumer`: one refusal text lives in two YAMLs, two presentation files and two compiled contracts. Evidence: all six copies changed.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "runs only as a fan-out|fan-out only" .skilled --glob '!node_modules'` prints only the new test assertion, the sk-design diagram line and the v1.6.24.0 changelog entry, which records history and stays. Evidence: the search prints those three lines only.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -l -w "dispatchEnv|completionCheck" .skilled --glob '*.ts' --glob '*.yaml' --glob '*.cjs' --glob '!node_modules'` lists `executor-audit.ts`, the two `:auto` YAMLs, the receipts test and `fanout-run.cjs`, whose unrelated local `dispatchEnv` is the baseline's only hit. Evidence: the search lists those five files.
- [x] CHK-FIX-004 [P0] Env adversarial case: an inherited `DSH_INHERITED_PROBE` does not reach the child and an inherited `DSH_SPEC_FOLDER` is overridden (receipts cell 4). Evidence: receipts cell 4 passes.
- [x] CHK-FIX-005 [P1] Matrix axes are env source by exit, listed in `plan.md` affected surfaces. Evidence: `plan.md` affected surfaces.
- [x] CHK-FIX-006 [P1] Hostile env variant: the smoke strips `DSH_HOME` from its own env before the run, and the state-env guard refuses a dsh dispatch whose parent sets it. Evidence: T015 ran with `DSH_HOME` unset.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the implementing commit SHA in `implementation-summary.md`. Evidence: the build is `1bedb33577` and the live review is `aab544ae11`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No key is written to a file or a prompt. Keys reach dsh only through the allowlisted `LLMGATEWAY_` prefix or `OPENCODE_API_KEY`. Evidence: no key appears in the diff or the prompt.
- [x] CHK-031 [P0] The dispatch cwd is the artifact directory. Check: T015 prints `cwd_is_artifact_dir True`. Evidence: T015.
- [x] CHK-032 [P1] `DSH_HOME` is set only in `dispatchEnv`. Check: `rg -n "process.env.DSH_HOME *=" .skilled/commands/deep/assets` prints nothing. Evidence: the search prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name edits E1 to E19 and the 13-test target. Evidence: all three name E1 to E19 and 13 tests.
- [x] CHK-041 [P1] The YAML comments explain the cwd, the home and the bare-word rule without artifact ids. Evidence: CHK-013.
- [x] CHK-042 [P2] `fanout-executor.md` names the single-executor `:auto` path (E15). Evidence: line 115 of `fanout-executor.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Helper scripts live in `scratch/`: `apply-edits.py` and `dsh-branch-smoke.py`. Evidence: both live in `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds only those two helpers and `.gitkeep` at close, and smoke output stays in the system temp folder. Evidence: `ls -a scratch` lists `.gitkeep`, `apply-edits.py` and `dsh-branch-smoke.py`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
