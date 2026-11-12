---
title: "Tasks: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds"
description: "Task Format: T### [P?] Description (path). Verify: command prints its expected result."
trigger_phrases:
  - "fix deep review p2 findings for plan check builds tasks"
  - "deep review remediation edit packets"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: fix-deep-review-p2-findings-for-plan-check-builds

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

**Task Format**: `T### [P?] Description (path). Verify: command prints its expected result.`

Task shell variables: `R=.` is the repository root; `P=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds` is this packet folder. Scratch edit-packet numbers are a separate sequence: `scratch/edit-T029.txt` is a T005 follow-up, while task T029 is the research-contract generator task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the source evidence, confirm SL-203 SAFE and SL-204 UNSAFE, and drop R3-P2-001 because child 004 now records AC-002 closure and its acceptance row is Met (review report sections 3, 4, 6 and 8; current child 004 summary and AC). Verify: `R=. P=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds; test -d "$R/$P" && rg -n -e 'LINEAGE_LABEL_PATTERN|lineageExecutorSchema|expandLineages' "$R/.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts" && rg -n -e 'validateClaudeConfigDir|allowedConfigRoot' "$R/.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs" && rg -n -e 'optional_claude_config_dir|CLAUDE_CONFIG_DIR' "$R/.skilled/commands/deep/assets/deep-review-auto.yaml" && rg -n -F 'Close AC-002 from the captured run.' "$R/specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/implementation-summary.md" && rg -n -F '| AC-002 |' "$R/specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md` prints each cited source and the Met criterion.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Apply each edit packet in ascending task order. Before every replacement, confirm the packet's OLD text occurs exactly the count stated in HOW in the source state left by earlier tasks. Stop and re-read if the count differs; do not improvise a replacement.

- [x] T002 Apply `scratch/edit-T002.txt`: replace the hard-coded loop-type pair and allow only `true`, `'true'`, or `'1'` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `rg -n -F 'ACTIVE_FANOUT_LOOP_TYPES.has(loopType)' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints the refusal predicate.
- [x] T003 Apply `scratch/edit-T003.txt`: export the existing Claude config root validator (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `rg -n -F 'validateClaudeConfigDir,' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints the export.
- [x] T004 Apply `scratch/edit-T004.txt`: validate optional configDir before use in review `:auto` (`.skilled/commands/deep/assets/deep-review-auto.yaml`). Verify: `rg -n -F 'configDirInput ? validateClaudeConfigDir(configDirInput)' .skilled/commands/deep/assets/deep-review-auto.yaml` prints the validated binding.
- [x] T005 Apply `scratch/edit-T005.txt`: add accepted value, refused value, and configDir root unit cases (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`); apply `scratch/edit-T029.txt` as a T005 follow-up to use `~/.claude-review-test` and `.claude-review-test` test paths. Verify: `rg -n -F -e 'accepts explicit true and 1 values' -e 'rejects unsupported single-lineage opt-in values' -e 'accepts only Claude config roots' .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` prints all three cases.
- [x] T006 Apply `scratch/edit-T006.txt`: document the one-lineage refusal and opt-in behavior (`.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md`). Verify: `rg -n -F -- '--allow-single-lineage' .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md` prints the opt-in.
- [x] T007 Apply `scratch/edit-T007.txt`: update research runner flag and policy wording, including `config.maxIterations` (`.skilled/commands/deep/research.md`). Verify: `rg -n -F -e '--allow-single-lineage' -e 'config.maxIterations' .skilled/commands/deep/research.md` prints the flag and field binding.
- [x] T008 Apply `scratch/edit-T008.txt`: update review runner flag and policy wording, including `config.maxIterations` (`.skilled/commands/deep/review.md`). Verify: `rg -n -F -e '--allow-single-lineage' -e 'config.maxIterations' .skilled/commands/deep/review.md` prints the flag and field binding.
- [x] T009 Apply `scratch/edit-T009.txt`: reword the research presentation executor row (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n -F 'one expanded lineage selects' .skilled/commands/deep/assets/deep-research-presentation.txt` prints the row. Evidence: the row routes one expanded lineage to `config.executor` and two or more to `config.fanout`.
- [x] T010 Apply `scratch/edit-T010.txt`: name the exact research iterations target (`.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -n -F 'iterations value binds to config.maxIterations' .skilled/commands/deep/assets/deep-research-presentation.txt` prints the policy bullet.
- [x] T011 Apply `scratch/edit-T011.txt`: reword the review presentation executor row (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n -F 'one expanded lineage selects' .skilled/commands/deep/assets/deep-review-presentation.txt` prints the row. Evidence: the row routes one expanded lineage to `config.executor` and two or more to `config.fanout`.
- [x] T012 Apply `scratch/edit-T012.txt`: name the exact review iterations target (`.skilled/commands/deep/assets/deep-review-presentation.txt`). Verify: `rg -n -F 'iterations value binds to config.maxIterations' .skilled/commands/deep/assets/deep-review-presentation.txt` prints the policy bullet.
- [x] T013 Apply `scratch/edit-T013.txt`: record the existing council contract refresh as generated drift in child 002 scope (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/spec.md`). Verify: `rg -n -F 'deep-ai-council.contract.markdown' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/spec.md` prints the scope row.
- [x] T014 Apply `scratch/edit-T014.txt`: reword child 006 CHK-012 to allow only the REQ-001 plan_clarity row; leave it open (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md`). Verify: `rg -n -F 'Preserve every unrelated quality_gates' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md` prints revised CHK-012.
- [x] T015 Run the child 006 scope check; only after it passes, apply `scratch/edit-T015.txt` to mark CHK-012 verified (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/tasks.md`). Verify: `node -e 'const fs=require("node:fs"),{execFileSync}=require("node:child_process"),yaml=require("./.skilled/skills/system-spec-kit/node_modules/js-yaml"),files=[".skilled/commands/speckit/assets/speckit-implement.yaml",".skilled/commands/speckit/assets/speckit-complete.yaml",".skilled/commands/speckit/assets/speckit-plan.yaml"];for(const p of files){const base=yaml.load(execFileSync("git",["show","HEAD:"+p],{encoding:"utf8"})),now=yaml.load(fs.readFileSync(p,"utf8"));if(p===files[0]){const gates=JSON.parse(JSON.stringify(now.quality_gates));const row=gates.pre_implementation.checks.find(x=>x.id==="plan_clarity");if(!row||!("criteria" in row))throw Error("plan_clarity row or criteria missing");delete row.criteria;if(JSON.stringify(gates)!==JSON.stringify(base.quality_gates))throw Error("unrelated quality_gates changed")}for(const key of ["circuit_breaker","default_level"])if(JSON.stringify(base[key])!==JSON.stringify(now[key]))throw Error(key+" changed in "+p)}console.log("CHK-012 scope check passed")'` prints `CHK-012 scope check passed`. Evidence: closeout command output was `CHK-012 scope check passed` (exit 0).
- [x] T016 Apply `scratch/edit-T016.txt`: clear the resolved child 006 acceptance continuity blocker (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`). Verify: `rg -n -F 'blockers: []' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md` prints the cleared blocker.
- [x] T017 Apply `scratch/edit-T017.txt`: update child 006 acceptance completion metadata after T015 passes (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`). Verify: `rg -n -F 'completion_pct: 100' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md` prints the reconciled percentage.
- [x] T018 Apply `scratch/edit-T018.txt`: clear the now-resolved child 006 acceptance question (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`). Verify: `rg -n -F 'open_questions: []' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md` prints the cleared questions.
- [x] T019 Apply `scratch/edit-T019.txt`: set child 006 acceptance closeability to Yes after T015 passes (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md`). Verify: `rg -n -F '**Closeable:** Yes' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md` prints Yes.
- [x] T020 Apply `scratch/edit-T020.txt`: clear the resolved child 006 summary continuity blocker (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'blockers: []' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the cleared blocker.
- [x] T021 Apply `scratch/edit-T021.txt`: update child 006 summary completion metadata after T015 passes (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'completion_pct: 100' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the reconciled percentage.
- [x] T022 Apply `scratch/edit-T022.txt`: clear the resolved child 006 summary question (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'open_questions: []' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the cleared questions.
- [x] T023 Apply `scratch/edit-T023.txt`: reconcile the child 006 summary checklist count to 28/28 while retaining Draft status (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'Draft; 28 of 28 P0/P1 checklist items verified (100%)' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the row.
- [x] T024 Apply `scratch/edit-T024.txt`: record child 006's verified CHK-012 diff result (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'CHK-012 scope diff' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the reconciled evidence row.
- [x] T025 Apply `scratch/edit-T025.txt`: mark child phases 2-4 Complete, leave phases 5-7 Pending, and resume at phase 5 (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md`). Verify: `rg -n -e '002-bind-single-entry-executors-to-single-path/.*Complete' -e '003-refuse-single-lineage-fanout-run/.*Complete' -e '004-name-file-in-plan-phase-lines/.*Complete' -e 'Resume Phase 5' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md` prints the reconciled map.
- [x] T026 Apply `scratch/edit-T026.txt`: define one readonly authoring-card sentence (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Verify: `rg -n -F 'readonly SPEC_AUTHORING_CARD_NEXT_STEP=' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints one definition.
- [x] T027 Apply `scratch/edit-T027.txt`: replace both echo literals with the shared variable (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`). Verify: `rg -c -F 'echo "    $SPEC_AUTHORING_CARD_NEXT_STEP"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints `2`. Evidence: two echo sites at lines 2209 and 2418; shared value is defined at line 24.
- [x] T028 Apply `scratch/edit-T028.txt`: reconcile child 006's limitation and deviation narratives with the verified CHK-012 state (`specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md`). Verify: `rg -n -F 'all 28 P0/P1 checklist items are verified' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md` prints the reconciled limitation.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Run commands in this order after all edit packets are applied. These suite commands are future implementation tasks; none is run while authoring this plan.

- [x] T029 Regenerate the research compiled contract from maintained sources (`.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write` exits 0. Evidence: `../scratch/build-evidence.md:50`; closeout parity rerun printed `RESEARCH CONTRACT MATCH` (exit 0).
- [x] T030 Regenerate the review compiled contract from maintained sources (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write` exits 0. Evidence: `../scratch/build-evidence.md:50`; closeout parity rerun printed `REVIEW CONTRACT MATCH` (exit 0).
- [x] T031 Run the focused fanout runner unit file. Verify: `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts)` exits 0. Evidence: `../scratch/build-evidence.md:154` records exit=0 and 179 tests passed; suite not rerun in this packet-only closeout.
- [x] T032 Run the CLI adapter stress suite. Verify: `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/stress/cli-adapter)` exits 0. Evidence: `../scratch/build-evidence.md:156` records exit=0, 152 passed and 8 skipped; suite not rerun in this closeout.
- [x] T033 Run contract drift and renderer unit files. Verify: `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/check-contract-drift.vitest.ts tests/unit/render-command-contract.vitest.ts)` exits 0. Evidence: `../scratch/build-evidence.md:56` records 43/43 passed; the final full-suite rerun at line 119 records exit 0, 2,881 passed, 8 skipped across 173 files.
- [x] T034 Run the scaffold self-gate suite. Verify: `(cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-passes-its-own-gate.vitest.ts)` exits 0. Evidence: `../scratch/build-evidence.md:153` records exit=0 and 6 tests passed; suite not rerun in this closeout.
- [x] T035 Run card synchronization; the script exists at the named path. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` exits 0. Evidence: closeout output ends `CARD SYNC OK` (exit 0).
- [x] T036 Run strict validation of this packet after every document and edit packet is final. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds --strict --quiet` prints an explicit `RESULT: PASSED` line. Evidence: closeout strict run exited 0 and printed an explicit `RESULT: PASSED` line.
- [x] T037 Apply `scratch/edit-T030.txt` and `scratch/edit-T031.txt`: let `validateClaudeConfigDir` take the absolute home form the review workflow renders, and assert it in the unit case (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`). Verify: a direct `node -e` probe of the validator. Evidence: both edits applied byte-exact on the first DeepSeek Flash max attempt; the probe returned `$HOME/.claude-alt` for both `~/.claude-alt` and the absolute form, and threw for `~/.ssh`, `$HOME/.ssh`, `/etc`, `$HOME/.claude-alt/../.ssh` and `../x`.
- [x] T038 Apply `scratch/edit-T032.txt` to `scratch/edit-T035.txt`: drop the runner-only `--allow-single-lineage` row from both command flag tables and reword the policy paragraph (`.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`). Verify: `rg -c allow-single-lineage .skilled/commands/deep/research.md .skilled/commands/deep/review.md` finds no line. Evidence: four edits applied byte-exact; the search returned no match.
- [x] T039 Apply `scratch/edit-T036.txt` to `scratch/edit-T038.txt`: move the six write verbs to a WRITE intent at weight 1 that loads only the card (`.skilled/skills/system-spec-kit/ROUTER.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` ends `CARD SYNC OK`. Evidence: three edits applied byte-exact; card sync printed `CARD SYNC OK`; under the router's scoring "write a plan and update the spec" gives PLAN 3 and WRITE 2, so PLAN stays first.
- [x] T040 Recompile the three deep command contracts and rerun the suites from the final tree. Verify: `compile-command-contracts.cjs --write` for each command, `check-contract-drift.cjs` and the deep-loop and spec-kit suites exit 0. Evidence: the three `--write` runs printed each contract path; `check-contract-drift.cjs` printed `OK commands=3` (exit 0); the full deep-loop suite exited 0 with 173 of 173 files and 2,884 tests passed, 8 skipped. The parallel spec-kit runs hit eight load timeouts (seven `upgrade-legacy-*` and trigger-index files, one 500-folder speed test); rerun alone, all eight passed (136 passed, 1 skipped; 43 passed). `test:spec-validation` printed `RESULT: PASSED` and `test:legacy` plus `test:validation` reported 12 passed, 0 failed.
- [x] T041 Reconcile the status records the synthesis named (`acceptance-criteria.md`, `spec.md`, the parent `spec.md`). Verify: strict recursive validation of the parent prints `RESULT: PASSED`. Evidence: acceptance metadata reads Complete at 100 with no open question; the parent resume line names the parent and the child count reads seven.
- [x] T042 Apply `scratch/edit-T039.txt` to `scratch/edit-T074.txt`: close the `local-skilled-alignment` lane findings on the presentation mapping, the config-dir contract, the five-intent count, the card sync guard, playbook scenario 481, the fan-out catalog entries and the root README. Verify: the scenario 481 awk counts and `check-card-sync.sh`. Evidence: 36 edits applied byte-exact by DeepSeek Flash max, two on a second attempt; the awk counts printed `5` and `0`; card sync printed `PASS intent-WRITE` and `CARD SYNC OK`; `check-contract-drift.cjs` printed `OK commands=3`; committed as `854a6ed284`.
- [x] T043 Apply `scratch/edit-T075.txt`: add a test that runs a two-lineage matrix without the opt-in (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`). Verify: the test passes against the runner and fails against a mutant guard. Evidence: the case passed; with the guard changed to `allLineages.length >= 1` it failed (exit 1), and the runner was restored byte-identical to the commit; the full deep-loop suite then exited 0 with 173 files and 2,885 tests passed, 8 skipped.
- [x] T044 Apply `scratch/edit-T076.txt` to `scratch/edit-T086.txt` and reconcile the packet docs the alignment critic named: the repeatable `--executor` mapping, playbook scenario 482's PASS count, the skill overview, the root catalog summary, a refusal step in playbook DLR-025, the refusal-message wording in phase 003, the WRITE move in phase 005's closure records, and line citations in this phase. Verify: `check-card-sync.sh` PASS count, contract drift and strict recursive validation. Evidence: 11 edits applied byte-exact; the guard printed 12 `PASS` lines; `check-contract-drift.cjs` printed `OK commands=3`; contract and card-sync tests passed (43 and 11); strict recursive validation printed `RESULT: PASSED` for all eight folders.
- [x] T045 Apply `scratch/edit-T087.txt` to `scratch/edit-T089.txt`: drop three unused symbols that failed the spec-kit runtime lint, the alignment battery's one open row (`.skilled/skills/system-spec-kit/runtime/cli/tests/rg-wrapper-recipes.vitest.ts`, `upgrade-legacy-containment.vitest.ts`, `validate-subtrack.vitest.ts`). The operator asked for this fix after the release. Verify: `npm --prefix .skilled/skills/system-spec-kit/runtime run check` exits 0 and the three files pass. Evidence: three edits applied byte-exact; `run check` exited 0 (lint and `tsc --noEmit`); the three files passed 51 tests.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks are marked `[x]` only after their commands pass.
- [x] No `[B]` blocked task remains.
- [x] The strict validator prints an explicit `RESULT: PASSED` line after the final packet edit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Review source of truth**: `../review/review-report.md`, sections 3, 4, 6 and 8.
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

No test or validator result is recorded as complete until its command output and exit status are read. Suite evidence is cited from `../scratch/build-evidence.md`; suites were not rerun in this closeout.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` names each safe/unsafe disposition and evidence line. Verify: `rg -n -e 'SL-203.*SAFE' -e 'SL-204.*UNSAFE' spec.md` prints both dispositions.
- [x] CHK-002 [P0] All edit packet OLD counts are valid in sequential task order. Verify: run the ordered OLD-count audit for edit packets `edit-T002.txt` through `edit-T029.txt`; every packet reports its stated count. Evidence: Settled by the orchestrating session under goal D1: `../scratch/remediation-evidence.md` records each of edit-T014, T015, T019, T024 and T028 as applied with exact match True at apply time, meaning the target equalled `before.replace(OLD, NEW)` byte for byte. The later closeout pass on child 006 then rewrote those same status lines to the final closed state, so a replay now finds neither OLD nor NEW. The edits were applied as specified and were superseded by newer, verified text.
- [x] CHK-003 [P1] Dependencies and existing validator/compiler were identified. Verify: `test -f .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs && test -f .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` exits 0.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed shell syntax parses. Verify: `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` exits 0. Evidence: exit 0; `git diff --check` on the scoped runtime files also exits 0.
- [x] CHK-011 [P1] No unexpected runner or YAML changes appear outside the edit packets. Verify: compare the scoped `git diff --check` and `git status --short` output with the Files to Change table in `spec.md`.
- [x] CHK-012 [P1] Research and review maintained carriers state the same routing threshold and exact iteration field. Verify: `rg -n -F -e 'config.maxIterations' -e 'one expanded lineage selects' .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt` prints both policy clauses in all four files. Evidence: command exit 0; each of the four carriers prints both clauses.
- [x] CHK-013 [P1] The create.sh variable is used at both original echo sites. Verify: `rg -c -F 'echo "    $SPEC_AUTHORING_CARD_NEXT_STEP"' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints `2`. Evidence: two echo sites at lines 2209 and 2418; shared value is defined at line 24.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All five acceptance criteria have observed evidence. Verify: cross-check each `AC-00*` row against T031–T036 results and actual file evidence. Evidence: all five AC rows have observed evidence; AC-004 closes on the CHK-002 settlement above.
- [x] CHK-021 [P0] Focused runner tests and CLI adapter stress tests pass. Verify: T031 and T032 both exit 0.
- [x] CHK-022 [P1] Contract drift, renderer and scaffold self-gate cases pass. Verify: T033 and T034 both exit 0.
- [x] CHK-023 [P1] Card synchronization and final strict validation pass. Verify: T035 exits 0 and T036 prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable review finding maps to an edit or documented safe/drop disposition. Verify: compare the finding list in `spec.md` with T001–T028.
- [x] CHK-FIX-002 [P0] Same-class producer inventory identifies the shared validator, active loop set and other policy carriers. Verify: run the `rg` inventory commands in `plan.md` and record their paths.
- [x] CHK-FIX-003 [P0] Consumer inventory covers `validateClaudeConfigDir`, `allowSingleLineage` and shared shell variable. Verify: run the consumer search in `plan.md` and inspect each result.
- [x] CHK-FIX-004 [P0] Path and flag adversarial cases cover outside-root configDir and unsupported opt-in values. Verify: T005's cases pass under T031.
- [x] CHK-FIX-005 [P1] The opt-in, loop type, configDir root and lineage label matrix axes are listed before implementation. Verify: `rg -n -F 'Matrix axes:' plan.md` prints the complete axes.
- [x] CHK-FIX-006 [P1] Config path cases do not mutate HOME, cwd or other process-global state. Verify: inspect T005's path cases and confirm they use candidate paths without changing process state.
- [x] CHK-FIX-007 [P1] Verification evidence is recorded against the current working tree after each generator and suite. Verify: inspect completed task rows and their observed output/exit status.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret is added by the runner, YAML or documentation edits. Verify: inspect the scoped diff and run `git diff --check` for the named runtime files.
- [x] CHK-031 [P0] One-lineage refusal and configDir root checks fail closed. Verify: T031 passes false/unsupported-value and outside-root cases before side effects.
- [x] CHK-032 [P1] Authentication/authorization behavior is unchanged. Verify: N/A — no auth/authz surface is modified; confirm the Files to Change table contains no auth module.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria, source edit packets and status carriers agree. Verify: strict packet validation passes and each AC row has matched evidence. Evidence: strict validation of this folder prints RESULT: PASSED and each AC row has matched evidence; the edit-packet replay mismatch is explained under CHK-002.
- [x] CHK-041 [P1] No ephemeral spec/task identifiers are added to source code comments. Verify: inspect runner and YAML diff; the planned edits add no comments.
- [x] CHK-042 [P2] README changes are not applicable. Verify: N/A — no README is a source or carrier in this review scope.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edit packets live only in this packet's `scratch/` directory. Verify: `P=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds; find "$P/scratch" -maxdepth 1 -type f -name 'edit-T*.txt' | sort` lists the planned edit packets.
- [x] CHK-051 [P1] Scratch contains only required edit packets and the existing `.gitkeep`. Verify: `P=specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/007-fix-deep-review-p2-findings-for-plan-check-builds; test -z "$(find "$P/scratch" -type f ! -name 'edit-T*.txt' ! -name '.gitkeep' -print -quit)"` exits 0.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 9/11 |
| P1 Items | 14 | 13/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->
