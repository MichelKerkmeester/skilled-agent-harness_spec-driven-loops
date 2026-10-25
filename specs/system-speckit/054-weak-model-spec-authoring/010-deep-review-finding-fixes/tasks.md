---
title: "Tasks: Phase 10: deep-review-finding-fixes"
description: "Ordered tasks for the three fix lanes and the close, each with one file and one verify command."
trigger_phrases:
  - "deep review finding fixes tasks"
  - "054 review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 10: deep-review-finding-fixes

<!-- SPECKIT_LEVEL: 3 -->

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

Two shell variables shorten the paths below. `S` is `.skilled/skills/system-spec-kit`. `P` is `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes`. Every command runs from the repository root, and every `git` command carries `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. The census covers every folder under `specs/` outside packet 054, which this phase edits. Packet 054 is covered by its own recursive strict run in T123.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the strict census of every folder outside packet 054 (`$P/scratch/baseline/b-before-*.tsv`). Verify: `cat $P/scratch/baseline/b-before-*.tsv | wc -l` prints 4719.
- [x] T002 Merge the three census shards in folder order (`$P/scratch/baseline/b-before.tsv`). Verify: `cut -f1 $P/scratch/baseline/b-before.tsv | diff - $P/scratch/baseline/folders.txt` prints nothing.
- [x] T003 Record the status of six rules per folder (`$P/scratch/baseline/rules-before.tsv`). Verify: `wc -l < $P/scratch/baseline/rules-before.tsv` prints 4719.
- [x] T004 Record the runtime suite baseline (`$P/scratch/baseline/suite-runtime-before.txt`). Verify: `tail -2 $P/scratch/baseline/suite-runtime-before.txt` prints an `exit=` line.
- [x] T005 Record the CLI suite baseline (`$P/scratch/baseline/suite-cli-before.txt`). Verify: `tail -2 $P/scratch/baseline/suite-cli-before.txt` prints an `exit=` line.
- [x] T006 Merge the three P2 ledgers into one (`$P/scratch/p2-ledger.md`). Verify: `rg -c '^\| R' $P/scratch/p2-ledger.md` prints 63.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: gate code

- [x] T010 [P] Write the track containment test, which fails on the unchanged script (`$S/runtime/cli/tests/create-track-containment.vitest.ts`). Verify: `(cd $S && npx vitest run runtime/cli/tests/create-track-containment.vitest.ts --config vitest.config.ts)` prints a failing `..` case.
- [x] T011 Reject a `--track` value that leaves `specs/` before the `mkdir` runs (`$S/runtime/cli/spec/create.sh`). Verify: the T010 command prints `Test Files  1 passed`.
- [x] T012 [P] Add a v2.3 parity cell for every matrix shape in the plan (`$S/runtime/cli/tests/placeholder-token-gate.vitest.ts`). Verify: its run prints the mixed-line and fence cells failing before T013.
- [x] T013 Scan every marker on a v2.3 line with the code-span, fence and title rules (`$S/runtime/lib/validation/orchestrator.ts`). Verify: after `npm --prefix $S/runtime run build`, the orchestrator side of every T012 cell passes.
- [x] T014 Mirror the v2.3 scan in the shell rule (`$S/runtime/cli/rules/check-placeholders.sh`). Verify: `(cd $S && npx vitest run runtime/cli/tests/placeholder-token-gate.vitest.ts --config vitest.config.ts)` prints `Test Files  1 passed`.
- [x] T015 [P] Write the post-edit scan test, which fails on the unchanged script (`$S/runtime/cli/tests/post-edit-placeholder-scan.vitest.ts`). Verify: its run prints the token-folder case failing with 0 placeholders.
- [x] T016 Rebuild the post-edit scan on the strict gate's marker set (`$S/runtime/cli/spec/check-placeholders.sh`). Verify: `bash $S/runtime/cli/spec/check-placeholders.sh specs/system-speckit/054-weak-model-spec-authoring --json` prints `"placeholders":0`.
- [x] T017 [P] Write the required-anchor test with the template parity cases (`$S/runtime/cli/tests/required-template-anchors.vitest.ts`). Verify: its run fails on the missing-anchor case before T018.
- [x] T018 Report each template-required anchor a v2.3 doc lacks (`$S/runtime/lib/validation/orchestrator.ts`). Verify: after the build, the T017 file prints `Test Files  1 passed`.
- [x] T019 Describe the v2.3 required-anchor error in the ANCHORS_VALID entry (`$S/runtime/cli/lib/validator-registry.json`). Verify: `rg -n 'v2.3' $S/runtime/cli/lib/validator-registry.json` prints the ANCHORS_VALID description line.
- [x] T020 Check `spec.md` for a template title in a v2.3 packet (`$S/runtime/cli/rules/check-scaffold-never-touched.sh`). Verify: a v2.3 fixture with a `[template:` title in `spec.md` fails SCAFFOLD_NEVER_TOUCHED and its v2.2 copy passes.
- [x] T021 Read every Status row of a v2.3 `spec.md` (`$S/runtime/cli/lib/status-classifier.sh`). Verify: a v2.3 fixture with a Draft row and then a Complete row classifies as complete, and its v2.2 copy as planned.
- [x] T022 Apply the same every-row read to the orchestrator's Draft test (`$S/runtime/lib/validation/orchestrator.ts`). Verify: PLACEHOLDER_FILLED does not treat the T021 fixture as Draft.
- [x] T023 Add the scaffold-title and Status-row cases (`$S/runtime/cli/tests/validation-gate-hardening.vitest.ts`). Verify: `(cd $S && npx vitest run runtime/cli/tests/validation-gate-hardening.vitest.ts --config vitest.config.ts)` prints `Test Files  1 passed`.
- [x] T024 [P] Add the clause-cut cases, which fail on the unchanged cut (`$S/runtime/cli/tests/generated-metadata-drift.vitest.ts`). Verify: its run prints the clause case failing before T025.
- [x] T025 End a long synopsis at a clause boundary before falling back to a word boundary (`$S/runtime/lib/description/packet-synopsis.ts`). Verify: the T024 file prints `Test Files  1 passed`. Decision 2026-10-25: the cut runs for v2.3 specs only, because an unconditional cut moved 39 drift verdicts in the census (`scratch/evidence/lane-a/T025-before.txt`); the gated cut moves 0 (`T025-after.txt`).
- [x] T026 [P] Add the fsmonitor case, which fails on the unchanged walker (`$S/runtime/cli/tests/trigger-index.vitest.ts`). Verify: its run prints the fsmonitor case failing before T027.
- [x] T027 Pass `core.fsmonitor=false` to the corpus walker's one git call (`$S/runtime/cli/retrieval/lib/corpus.mjs`). Verify: the T026 file prints `Test Files  1 passed`.
- [x] T028 Scope the parity sentence to the shapes the parity test pins (`$S/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md`). Verify: `rg -n 'parity' $S/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md` prints the scoped sentence.
- [x] T029 Rebuild the runtime and the CLI (`$S/runtime/dist`). Verify: `bash $S/runtime/cli/spec/validate.sh specs/agents/001-terminal-proof-discipline --strict --no-recursive | tail -1` prints `RESULT: PASSED`.
- [x] T030 Rerun the six-rule census on the lane A tree (`$P/scratch/baseline/rules-after.tsv`). Verify: `diff $P/scratch/baseline/rules-before.tsv $P/scratch/baseline/rules-after.tsv` prints nothing.

### Lane B: guidance and guards

- [x] T040 [P] Narrow the card's example claim to section shape (`$S/references/workflows/spec-authoring-card.md`). Verify: `rg -n 'safe to imitate' $S/references/workflows/spec-authoring-card.md` prints the narrowed line.
- [x] T041 Count task lines in every state in the card's task check (`$S/references/workflows/spec-authoring-card.md`). Verify: the corrected check prints two equal counts on `$S/templates/examples/level-2/tasks.md` after T047.
- [x] T042 Count tokens across every packet doc in the card's token check (`$S/references/workflows/spec-authoring-card.md`). Verify: on a scratch copy of the Level 2 example with one token added to `acceptance-criteria.md`, the corrected command prints 1.
- [x] T043 Name the track metadata write that `create.sh` makes (`$S/references/workflows/spec-authoring-card.md`). Verify: `rg -n 'graph-metadata' $S/references/workflows/spec-authoring-card.md` prints the scaffold step line.
- [x] T044 Name the condition that sends a reader to the long guide (`$S/references/workflows/spec-authoring-card.md`). Verify: `rg -n 'template-guide' $S/references/workflows/spec-authoring-card.md` prints a line naming that condition.
- [x] T045 Hand continuity and metadata refresh to the checklist in a close line (`$S/references/workflows/spec-authoring-card.md`). Verify: `rg -c 'spec-folder-authoring-checklist' $S/references/workflows/spec-authoring-card.md` prints 1 or more.
- [x] T046 [P] Give every task line a `Verify:` clause (`$S/templates/examples/level-1/tasks.md`). Verify: `rg -c '^- \[[ xB]\] T[0-9].*Verify: '` and `rg -c '^- \[[ xB]\] T[0-9]'` on the file print the same number.
- [x] T047 [P] Give every task line a `Verify:` clause (`$S/templates/examples/level-2/tasks.md`). Verify: the two T046 counts on this file print the same number.
- [x] T048 [P] Give every task line a `Verify:` clause (`$S/templates/examples/level-3/tasks.md`). Verify: the two T046 counts on this file print the same number.
- [x] T049 [P] Give every task line a `Verify:` clause (`$S/templates/examples/level-3+/tasks.md`). Verify: the two T046 counts on this file print the same number.
- [x] T050 Add a GOOD and a WEAK example to the links note (`$S/templates/core/spec.md.tmpl`). Verify: `rg -c '<!-- FILL:'` and `rg -c '<!-- FILL:.*GOOD:.*WEAK:'` on the file print the same number.
- [x] T051 Add a GOOD and a WEAK example to the checklist note (`$S/templates/core/tasks.md.tmpl`). Verify: the two T050 counts on this file print the same number.
- [x] T052 Add the L3+ clarifier to the three plan notes under `L3+:` headings (`$S/templates/core/plan.md.tmpl`). Verify: `rg -c 'L3\+ means Level 3 and above' $S/templates/core/plan.md.tmpl` prints 3. Decision 2026-10-25: not reproduced. These sections render only at Level 3+ (`<!-- IF level:3+ -->`), so the label is never ambiguous there, and ADR-006 keeps the 45 words out; evidence `scratch/evidence/conductor/T052-not-reproduced.txt`.
- [x] T053 Replace the retired `/spec_kit:` prefix (`$S/templates/packet-types/phase-parent.spec.md.tmpl`). Verify: `rg -n 'spec_kit:' $S/templates/packet-types/phase-parent.spec.md.tmpl` prints nothing.
- [x] T054 Update the scaffold snapshots for the changed template lines only (`$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Verify: the snapshot diff holds only lines T050 to T053 changed, and `(cd $S && npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts)` prints `Test Files  1 passed`.
- [x] T055 Assert GOOD and WEAK on each core note and check every add-on note (`$S/runtime/cli/tests/template-fill-guidance.vitest.ts`). Verify: its run prints `Test Files  1 passed`, and it fails on a scratch template note that lacks WEAK.
- [x] T056 Teach the v2.3 token form in place of `[PLACEHOLDER]` (`$S/assets/template-mapping.md`). Verify: `rg -n '\[PLACEHOLDER\]' $S/assets/template-mapping.md` prints nothing.
- [x] T057 Describe `decision-record.md` as created on request at Level 3 (`$S/assets/template-mapping.md`). Verify: `rg -n 'REQUIRED at Level 3|Hard block if' $S/assets/template-mapping.md` prints nothing.
- [x] T058 Fail the drift guard without `rg`, on reordered anchors and on a missing level (`$S/runtime/cli/spec/check-example-drift.sh`). Verify: each seeded copy exits 1, and the tree prints `EXAMPLE_DRIFT_OK`.
- [x] T059 Fail the card guard without `rg`, require the checklist's example route and read every mode (`$S/runtime/cli/spec/check-card-sync.sh`). Verify: each seeded root exits 1, and the tree prints `CARD SYNC OK`.
- [x] T060 Add the seeded-defect cases (`$S/runtime/cli/tests/example-drift.vitest.ts`). Verify: `(cd $S && npx vitest run runtime/cli/tests/example-drift.vitest.ts --config vitest.config.ts)` prints `Test Files  1 passed`.
- [x] T061 Add the seeded-defect cases (`$S/runtime/cli/tests/card-sync.vitest.ts`). Verify: `(cd $S && npx vitest run runtime/cli/tests/card-sync.vitest.ts --config vitest.config.ts)` prints `Test Files  1 passed`.
- [x] T062 Say that the card guard runs every check (`$S/feature-catalog/tooling-and-scripts/spec-authoring-card.md`). Verify: `rg -n 'first disagreement' $S/feature-catalog $S/runtime/cli/spec/check-card-sync.sh` prints nothing.
- [x] T063 Name the card and the token rule in the plan prompt contract (`.skilled/commands/speckit/assets/speckit-plan.yaml`). Verify: `rg -n 'spec-authoring-card' .skilled/commands/speckit/assets/speckit-plan.yaml` prints a line.
- [x] T064 Name the card and the token rule in the implement prompt contract (`.skilled/commands/speckit/assets/speckit-implement.yaml`). Verify: `rg -n 'spec-authoring-card' .skilled/commands/speckit/assets/speckit-implement.yaml` prints a line.
- [x] T065 Name the card in the plan entry point (`.skilled/commands/speckit/plan.md`). Verify: `rg -n 'spec-authoring-card' .skilled/commands/speckit/plan.md` prints a line.
- [x] T066 Name the card in the implement entry point (`.skilled/commands/speckit/implement.md`). Verify: `rg -n 'spec-authoring-card' .skilled/commands/speckit/implement.md` prints a line.
- [x] T067 Name the token rule and the two guards in the spec-doc row (`.skilled/agents/markdown.md`). Verify: `rg -n 'YOUR_VALUE_HERE' .skilled/agents/markdown.md` prints the spec-doc row.
- [x] T068 Sync the agent's runtime mirrors (`.claude/agents/markdown.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, and the Codex, Pi and Hermes generators' `--check` runs exit 0.

### Lane C: playbook, records and review tooling

- [x] T070 Check containment with `git status --porcelain` before the cleanup step (`$S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md`). Verify: `rg -n 'git status --porcelain' $S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` prints a line above the cleanup step.
- [x] T071 Remove the output folder and the pointer in the cleanup step (`$S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md`). Verify: `rg -n 'rm -rf.*OUT' $S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` prints a line.
- [x] T072 Add `--with-goal` to the scaffold step (`$S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md`). Verify: `rg -n 'create.sh.*--with-goal' $S/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` prints a line.
- [x] T073 Add `rg` and `awk` to the preconditions (`$S/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md`). Verify: `rg -n 'awk' $S/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md` prints the preconditions line.
- [x] T074 Add `rg` and `awk` to the preconditions (`$S/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md`). Verify: `rg -n 'awk' $S/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` prints the preconditions line.
- [x] T075 Replace the retired `/spec_kit:` prefix (`$S/references/structure/sub-folder-versioning.md`). Verify: `rg -n 'spec_kit:' $S/references/structure/sub-folder-versioning.md` prints nothing.
- [x] T076 Replace the retired prefix and the bare `spec_kit:deep-review` name (`$S/references/workflows/auto-mode-contract.md`). Verify: `rg -n 'spec_kit:' $S/references/workflows/auto-mode-contract.md` prints nothing.
- [x] T077 Replace the retired `/spec_kit:` prefix (`$S/references/workflows/nested-changelog.md`). Verify: `rg -n 'spec_kit:' $S/references/workflows/nested-changelog.md` prints nothing.
- [x] T078 Replace the retired `/spec_kit:` prefix (`$S/references/workflows/worked-examples.md`). Verify: `rg -n 'spec_kit:' $S/references/workflows/worked-examples.md` prints nothing.
- [x] T079 Replace the retired `/spec_kit:` prefix (`$S/references/workflows/intake-contract.md`). Verify: `rg -n 'spec_kit:' $S/references/workflows/intake-contract.md` prints nothing.
- [x] T080 Name the deciding subject in the report subtitle and note the fourth set (`$S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md`). Verify: `rg -n 'four final sets' $S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md` prints the dated note.
- [x] T081 Add the second fresh set's delta row (`$S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/source.md`). Verify: `rg -n 'fresh2/delta.json' $S/benchmark/reports/2026-10-25--model-eval--authoring-baseline/source.md` prints the row.
- [x] T082 Add a dated supersession clause to precondition 4 (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n 'Superseded 2026-10-25' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints the precondition line.
- [x] T083 Reword the doctor row as audited and unchanged (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n 'doctor' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints the row with `unchanged`.
- [x] T084 Point the parent and decision pointers at files that exist (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n '\.\./spec\.md|phase 003 decision record' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints nothing.
- [x] T085 Add a dated note on the operator-directed push beside the Out of Scope line (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n 'operator-directed push' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints the note.
- [x] T086 Add a dated note that the two open findings were applied (`specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md`). Verify: `rg -n '12522be61c' specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md` prints the note.
- [x] T087 Add a dated note naming the one agent that got the card (`specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md`). Verify: `rg -n 'Correction 2026-10-25' specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md` prints the note.
- [x] T088 Add a dated note on how the removal evidence was assembled (`specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/acceptance-criteria.md`). Verify: `rg -n 'Correction 2026-10-25' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/acceptance-criteria.md` prints the note.
- [x] T089 Add a dated note on the missing branch-tip guard after the removal block (`specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md`). Verify: `rg -n 'rev-list --count' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/tasks.md` prints the note.
- [x] T090 Add dated notes on the tip guard and the missing `--with-goal` (`specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md`). Verify: `rg -c 'Correction 2026-10-25' specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/plan.md` prints 2.
- [x] T091 Add a dated note naming the deciding evidence files (`specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/acceptance-criteria.md`). Verify: `rg -n 'fresh2' specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/acceptance-criteria.md` prints the note.
- [x] T092 Add a dated note naming the deciding set for the handoff gate (`specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/spec.md`). Verify: `rg -n 'fresh2' specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/spec.md` prints the note.
- [x] T093 Add a dated note naming the deciding anchor scorer beside M3 (`specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/plan.md`). Verify: `rg -n 'justified-anchors.sh' specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/plan.md` prints the note.
- [x] T094 Log the anchor-count scoring and the map of each `baseline.json` to its set (`specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/goal.md`). Verify: `rg -n 'baseline.json' specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/goal.md` prints the log row written by `goal.cjs packet-log`.
- [x] T095 [P] Add the fan-out root case, which fails on the unchanged step (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-root-resource-map.vitest.ts`). Verify: its run fails before T096.
- [x] T096 Skip the root resource-map reducer when the run is a fan-out root (`.skilled/commands/deep/assets/deep-review-auto.yaml`). Verify: the T095 file passes.
- [x] T097 Apply the same skip in the confirm workflow when it runs that step (`.skilled/commands/deep/assets/deep-review-confirm.yaml`). Verify: the confirm-variant parity census in `render-command-contract.vitest.ts` passes.
- [x] T098 Recompile every deep contract whose sources changed (`.skilled/commands/deep/assets/compiled/`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0.
- [x] T099 Add a dated note that defines `$PHASE` for the AC-008 command (`specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md`). Verify: `rg -n 'PHASE. is' specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/acceptance-criteria.md` prints the note.
- [x] T100 Name the worktree branch the phases ran on in the Branch row (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n 'Branch.*worktrees/217-weak-model-spec-authoring' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints the metadata row.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T110 Rebuild the runtime and the CLI from the final tree (`$S/runtime/dist`). Verify: `bash $S/runtime/cli/spec/validate.sh specs/agents/001-terminal-proof-discipline --strict --no-recursive | tail -1` prints `RESULT: PASSED`.
- [x] T111 Run the runtime suite on the final tree (`$P/scratch/baseline/suite-runtime-after.txt`). Verify: no test file fails that passed in `suite-runtime-before.txt`. Result (`SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`, as the baseline ran): 1 failed, 276 passed, 3 skipped (280 files) against 1 failed, 275 passed, 3 skipped (279); the one failing file, `resource-map-extractor.vitest.ts` (2 tests), failed in the baseline too. Two earlier attempts at the 600 s default bound were stopped by the runner.
- [x] T112 Run the CLI suite on the final tree (`$P/scratch/baseline/suite-cli-after.txt`). Verify: no test file fails that passed in `suite-cli-before.txt`. Result: every part exits 0; vitest 187 passed and 3 skipped (190 files, was 184 and 3), 0 failed; validation 84/84.
- [x] T113 Rerun the strict census on the final tree (`$P/scratch/baseline/b-after.tsv`). Verify: `diff <(cut -f1,2 $P/scratch/baseline/b-before.tsv) <(cut -f1,2 $P/scratch/baseline/b-after.tsv)` prints nothing. Result: sorted by folder, `diff` of path and verdict prints nothing; every full row (errors, warnings, placeholder status) is identical across 4,719 folders.
- [x] T114 Rerun the six-rule census on the final tree (`$P/scratch/baseline/rules-final.tsv`). Verify: `diff $P/scratch/baseline/rules-before.tsv $P/scratch/baseline/rules-final.tsv` prints nothing. Result: `diff` exits 0 over 4,719 rows; 0 CRASH.
- [x] T115 Regenerate the phase 008 and 009 descriptions with their generator (`specs/system-speckit/054-weak-model-spec-authoring/008-playbook-run-in-worktree/description.json`). Verify: `rg -n 'Phase 7:|Phase 8:' specs/system-speckit/054-weak-model-spec-authoring/00{8,9}-*/description.json` prints nothing.
- [x] T116 Refresh the stale continuity blocks through the continuity writer (`specs/system-speckit/054-weak-model-spec-authoring/spec.md`). Verify: `rg -n 'Meet the launch preconditions' specs/system-speckit/054-weak-model-spec-authoring/spec.md` prints nothing. Deviation 2026-10-25: the continuity writer refreshes only a leaf implementation summary and derived metadata (a run on the parent changed no continuity field), so the eight blocks were set in their frontmatter directly; see the goal log.
- [x] T117 Log the operator-directed push of 2026-10-25 (`specs/system-speckit/054-weak-model-spec-authoring/goal.md`). Verify: `rg -n 'operator-directed push' specs/system-speckit/054-weak-model-spec-authoring/goal.md` prints the row `goal.cjs packet-log` wrote.
- [x] T118 Write the system-spec-kit release record and raise its version carriers (`$S/changelog/`). Verify: the new version appears in `$S/SKILL.md` and `.hermes/skills/system-spec-kit/SKILL.md`, and `node $S/runtime/cli/hermes/sync-skills-hermes.cjs --check` exits 0.
- [x] T119 Write the system-deep-loop release record and raise its version carriers (`.skilled/skills/system-deep-loop/changelog/`). Verify: the new version appears once in each of `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` and the Hermes copy.
- [x] T120 Recompile the deep contracts after the version change (`.skilled/commands/deep/assets/compiled/`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0.
- [x] T121 Run the deep-loop contract and fan-out tests (`.skilled/skills/system-deep-loop/runtime/tests/unit/`). Verify: `check-contract-drift.vitest.ts`, `render-command-contract.vitest.ts` and the T095 file all pass.
- [x] T122 Generate the phase changelog (`specs/system-speckit/054-weak-model-spec-authoring/changelog/`). Verify: `ls specs/system-speckit/054-weak-model-spec-authoring/changelog/` lists the phase 010 file.
- [x] T123 Validate packet 054 recursively in strict mode (`specs/system-speckit/054-weak-model-spec-authoring`). Verify: `bash $S/runtime/cli/spec/validate.sh specs/system-speckit/054-weak-model-spec-authoring --recursive --strict | tail -1` prints `RESULT: PASSED`. Result: exit 0, 13 folders `RESULT: PASSED`.
- [x] T124 Run the read-only closing review with cli-devin (`$P/scratch/review/cli-devin.md`). Verify: the reply's findings list holds no P0 or P1. Result 2026-10-25: P0=0, P1=1, P2=7. The P1 was checked and refuted: ADR-003 chose the four-marker scan, and the strict gate flags the same comment marker (`scratch/review/cli-devin-p1-verdict.md`). P2 outcomes: `scratch/review/cli-devin-p2-outcomes.md`.
- [x] T125 Run the read-only closing review with cli-codex luna (`$P/scratch/review/cli-codex-luna.md`). Verify: the reply's findings list holds no P0 or P1. Result 2026-10-25: first pass P0=1, P1=1, P2=1. The P1 and P2 were fixed; a focused cli-codex recheck refuted the P0 itself and confirmed both fixes, `NEW: none` (`scratch/review/cli-codex-luna-recheck.md`).
- [x] T126 Write the implementation summary and mark the criteria with evidence (`$P/implementation-summary.md`). Verify: `rg -c '\| Met \|' $P/acceptance-criteria.md` prints 12.
- [x] T127 Commit the phase on the worktree branch (`worktrees/217-weak-model-spec-authoring`). Verify: `git status --porcelain` lists no file this phase changed. Result: `d5ce52ffac` (gate code), `7a721f4388` (scanners, identical to main), `b7268e491b` (guidance, guards and docs), `bfcd44634a` (commands, mirrors and release), `b0070fd179` (contracts recompiled after the doc-version hook), then this folder's docs commit. The mirror-parity hook required every mirror output in one commit, so the command, agent, deep and release files share `bfcd44634a`.
- [x] T128 Recheck contract drift after the commit hook raises doc versions (`.skilled/commands/deep/assets/compiled/`). Verify: `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0, or a follow-up commit recompiles and it then exits 0. Result: the hook raised `auto-mode-contract.md`, drift showed `STALE_SOURCE_DIGEST`, the recompile went into `b0070fd179`, and drift now prints `OK commands=3`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the `create.sh` sandbox run and a read-through of scenario 483
- [x] `acceptance-criteria.md` reads `Closeable: Yes` with 12 rows `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds ADR-001 to ADR-005
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
- **Review**: See `../review/review-report.md` and `../review/deep-review-findings-registry.json`
- **P2 outcomes**: See `scratch/p2-ledger.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

The sections below hold the checks that decide whether the work above is done. Each one names the command or record that answers it.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]`, and its blocker is written as a deviation row in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The before census and the six-rule census hold 4,719 rows each, recorded before the first edit
- [x] CHK-002 [P0] Both suite baselines end with an `exit=` line, recorded before the first edit
- [x] CHK-003 [P1] `scratch/p2-ledger.md` gives each of the 63 registry entries a verdict
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 on every changed shell script
- [x] CHK-011 [P0] `npm run build` exits 0 in the runtime and in the CLI
- [x] CHK-012 [P1] No changed code comment carries a finding id, phase number or spec path: `rg -n 'P1-0|R[0-9]+-P[12]-|054-weak' <changed code files>` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every P1 check failed before its fix, with the failing output saved in `scratch/evidence/`
- [x] CHK-021 [P0] No suite file fails after the phase that passed in the baseline
- [x] CHK-022 [P0] The after census and the final six-rule census match their baselines
- [x] CHK-023 [P1] Each guard exits non-zero on each seeded defect and on a `PATH` without `rg`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `create.sh` rejects every adversarial track in the plan's invariant list and creates nothing outside `specs/`
- [x] CHK-031 [P0] No fix or test writes outside the repository or the session scratchpad
- [x] CHK-032 [P1] No brief sent to a lane or a reviewer carries a credential
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same files and lanes
- [x] CHK-041 [P1] Each catalog or reference claim this phase touched matches the code it describes
- [x] CHK-042 [P2] Both skills' release records name every changed behavior
- [x] CHK-043 [P1] ADR-006: the card and each core template stay within their word budgets against `scratch/baseline/words-before.txt`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixtures and copies live in the session scratchpad or in `scratch/`
- [x] CHK-051 [P1] `git status --porcelain` shows no temporary output after the commit
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 19 | 0/19 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001: the required-anchor check reads the rendered template, and the parity test matches `template-structure.js` for every level and core doc
- [x] CHK-101 [P0] ADR-002: each changed gate tests the v2.3 stamp, and the census shows no v2.2 verdict change
- [x] CHK-102 [P1] ADR-003: the post-edit scan's markers equal the orchestrator's four markers
- [x] CHK-103 [P1] ADR-005: every closed-phase correction is a dated note beside the original
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01: strict validation of packet 054 takes no more than 10% longer than the timed baseline run
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Both closing reviews ran read-only on the phase diff
- [x] CHK-131 [P1] No new package or dependency was added
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `plan.md` and `tasks.md` agree on the three lanes and their files
- [x] CHK-141 [P1] The parent's phase map row and this phase's status agree at close
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor (this session) | Runs every task and every check | [ ] Approved | |
| Operator | Approves the push and the merge | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
