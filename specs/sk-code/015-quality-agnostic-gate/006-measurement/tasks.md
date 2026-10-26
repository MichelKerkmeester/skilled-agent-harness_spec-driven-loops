---
title: "Tasks: Phase 6: measurement"
description: "Task Format: T### [P?] Description (file path). Verify: command prints expected output."
trigger_phrases:
  - "measurement tasks"
  - "phase 6 task list"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 6: measurement

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

Shell variables used in the Verify clauses below:
- `Q` is `.skilled/skills/sk-code/sk-code-quality`.
- `H` is `.skilled/skills/sk-code`.
- `P` is `specs/sk-code/015-quality-agnostic-gate/006-measurement`.

**Task Format**: `T### [P?] Description (file path). Verify: the command prints the expected output`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phases 001 to 005 are Complete in their spec files (`specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md`). Verify: `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` prints `5`. Evidence 2026-10-26: `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` printed `5`, exit 0.
- [x] T002 Re-check the design line citations this phase repeats: `Q/manual-testing-playbook/quality-gate/quality-checklist.md` line 73, `H/shared/references/stack-detection.md` line 32 and `H/ROUTER.md` line 242. Verify: `sed -n '242p' .skilled/skills/sk-code/ROUTER.md | rg -c 'CODE_QUALITY'` prints `1`. Evidence 2026-10-26: `sed -n '242p' .skilled/skills/sk-code/ROUTER.md | rg -c 'CODE_QUALITY'` printed `1`, exit 0.
- [x] T003 Create the evidence folder and its transcript subfolder (`P/evidence/transcripts/`). Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` prints `transcripts`. Evidence 2026-10-26: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` printed `measurement.json` and `transcripts`, exit 0, because the measurement record was already written by the time of this read.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Step 1: Playbook scenarios

- [x] T004 [P] Write scenario CQ-002, a foreign polyglot change built from fixture F01 (`Q/manual-testing-playbook/quality-gate/foreign-polyglot-change.md`). Verify: `rg -c '^id: CQ-002$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/foreign-polyglot-change.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-002$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/foreign-polyglot-change.md` printed `1`, exit 0.
- [x] T005 [P] Write scenario CQ-003, an unknown language built from fixture F05 (`Q/manual-testing-playbook/quality-gate/unknown-language-change.md`). Verify: `rg -c '^id: CQ-003$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/unknown-language-change.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-003$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/unknown-language-change.md` printed `1`, exit 0.
- [x] T006 [P] Write scenario CQ-004, a CI target built from fixture F14 (`Q/manual-testing-playbook/quality-gate/ci-target-change.md`). Verify: `rg -c '^id: CQ-004$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/ci-target-change.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-004$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/ci-target-change.md` printed `1`, exit 0.
- [x] T007 [P] Write scenario CQ-005, a private surface built from fixture F15, with the private skill named only as a placeholder joined at run time (`Q/manual-testing-playbook/quality-gate/private-surface-change.md`). Verify: `rg -c '^id: CQ-005$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/private-surface-change.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-005$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/private-surface-change.md` printed `1` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on the same file printed `Total issues: 0` (exit 0)
- [x] T008 [P] Write scenario CQ-006, an absent required tool built from fixture F06 (`Q/manual-testing-playbook/quality-gate/absent-required-tool.md`). Verify: `rg -c '^id: CQ-006$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/absent-required-tool.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-006$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/absent-required-tool.md` printed `1` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on the same file printed `Total issues: 0` (exit 0)
- [x] T009 [P] Write scenario CQ-007, an envelope round trip through the verify reader, using the BLOCKED envelope from CQ-002 and the UNVERIFIED envelope from CQ-006 (`Q/manual-testing-playbook/quality-gate/envelope-round-trip.md`). Verify: `rg -c '^id: CQ-007$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/envelope-round-trip.md` prints `1`. Evidence 2026-10-26: `rg -c '^id: CQ-007$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/envelope-round-trip.md` printed `1` (exit 0), and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on the same file printed `Total issues: 0` (exit 0)
- [x] T010 [P] Write scenario CQ-008, the restraint prompt "apply yagni to this change" (`Q/manual-testing-playbook/quality-gate/restraint-prompt.md`). Verify: `rg -c '^id: CQ-008$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` prints `1`. Evidence 2026-10-26: rg -c '^id: CQ-008$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md printed 1 (exit 0), and python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py on the same file printed Total issues: 0 (exit 0)
- [x] T011 Add CQ-002 to CQ-008 to the root playbook index: the section 7 headings, the section 9 rows and the section 7 title range (`Q/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c '^### CQ-00[2-8] \|' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` prints `7`. Evidence 2026-10-26: rg -c '^### CQ-00[2-8] \|' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md printed 7 (exit 0), and python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py --type playbook on the same file printed Total issues: 0 (exit 0)

### Step 2: Routing canaries

- [x] T012 [P] Write canary CB-CR-006, a single route for the agent-file prompt (`H/manual-testing-playbook/compiled-routing/workflow-alone-quality-agent-compiled-routing.md`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` prints `"selectionKind":"single"` and `sk-code-quality`. Evidence 2026-10-26: node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents" printed {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"surface-router","packetId":"sk-code-quality","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-quality"}],"effectivePolicyHash":"60f6fde27de99297241caf04d6f8e2b0f684cf261af0a1506c665c4f91925353","generation":2} (exit 0)
- [x] T013 [P] Write canary CB-CR-007, a single route for the CI prompt to `sk-code-quality`, with the CI standards arriving at stage two (`H/manual-testing-playbook/compiled-routing/quality-ci-surface-evidence-compiled-routing.md`). Amended 2026-10-26: the consumers phase closed its stage-one bundle criterion as a waiver under its ADR-006, so stage one stays a single route and the canary tests the stage-two evidence instead. Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` prints `"selectionKind":"single"` and `sk-code-quality`, and the stage-two replay through `routeSkillResources` prints `["CI_WORKFLOW"]` with the four `sk-code-ci` references. Evidence 2026-10-26: the compiled route printed `"selectionKind":"single"` with the one target `sk-code-quality` (exit 0). The stage-two replay printed `["CI_WORKFLOW"]` and the references `ci-workflow-standards.md`, `trigger-and-filter-rules.md`, `job-shape-rules.md` and `protected-set.md` (exit 0). The document validator printed `Total issues: 0` and the playbook package validator printed `PASS package=sk-code tier=FAIL_CLOSED scenarios=26 categories=9 operator=18 routing_gold_excluded=8 violations=0 warnings=0`.
- [x] T014 [P] Write canary CB-CR-008, a single route for the rails prompt (`H/manual-testing-playbook/compiled-routing/workflow-alone-quality-rails-compiled-routing.md`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` prints `"selectionKind":"single"` and `sk-code-quality`. Evidence 2026-10-26: node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done" printed {"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"surface-router","packetId":"sk-code-quality","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-quality"}],"effectivePolicyHash":"60f6fde27de99297241caf04d6f8e2b0f684cf261af0a1506c665c4f91925353","generation":2} (exit 0)
- [x] T015 Fill the `evidence_*` fields of CB-CR-006 to CB-CR-008 from a live status read. Verify: `node .skilled/bin/compiled-route-status.cjs --hub sk-code` prints a line with `servingAuthority` set to `compiled`. Evidence 2026-10-26: the status read printed `"servingAuthority":"compiled"`, `"causeCode":"compiled-serving"`, `"generation":2` and `"manifestFreshness":{"manifestValid":true,"fresh":true}`, exit 0. The three canaries now carry `evidence_serving_authority: compiled`, `evidence_flag_state: unset` and `evidence_manifest_digest: 8276238f94bb70a65718bc7361919f65a965654db7be3c4d34f1e982e998c738`, which is the SHA-256 of the activation manifest on disk.

### Step 3: Measurements and report

- [x] T016 Build fixture F01 in a temporary repository, run `quality-gate.cjs --format json` on it, and write `catch` and `commit` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').catch"` prints `{ seeded: 7, matched: 7, misses: [] }`. Evidence 2026-10-26: the same read printed `{"seeded":7,"matched":7,"misses":[]}`, exit 0, and `commit` reads `716a1a8ac4e37478835e14e91b804811e686875d`, the 40-character SHA the run measured. The F01 run recorded gate `BLOCKED` at exit 1 with seven findings, one per seeded label.
- [x] T017 [P] Build fixture F02 in a temporary repository, run the same command, and write `false_positives` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').false_positives.f02_findings"` prints `0`. Evidence 2026-10-26: the same read printed `0`, exit 0, and `f01_unseeded` also reads `0`. The F02 run recorded gate `NO_BLOCKER_FOUND` at exit 0 with an empty findings list.
- [x] T018 Build the 50-file timing set (50 changed `.js` files, each with one changed clean comment line) in a temporary repository. Run `quality-gate.cjs --format json` at least three times, each run alone, and write `timing` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').timing.max_ms"` prints a number below `2000`. Evidence 2026-10-26: `timing.max_ms` printed `1661`, exit 0, the largest of five full runs at 1561, 1576.3, 1608.3, 1581 and 1661 ms, against `target_ms` 2000, with `comment-hygiene` and `syntax-node` at `RAN_CLEAN` on every run. The record names the machine and the median 1581 ms. The first measurement used `--no-run`, which starts neither built-in check, so its 178.6 ms maximum timed setup alone; it is kept as `timing_no_run`.
- [x] T019 [P] Run the four intent prompts (the CQ-001 prompt and the three canary prompts) through `compiled-route.cjs`, and write `intent` with `targeted` set to `false` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').intent.prompts"` prints `4`. Evidence 2026-10-26: `intent.prompts` printed `4`, exit 0, with `matched` 4 and `targeted` false, and all four rows routed single to `sk-code-quality`.
- [x] T020 Run CQ-002 to CQ-008 live and save each raw transcript as `P/evidence/transcripts/CQ-00N.md`. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `7`. Evidence 2026-10-26: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` printed `7`, exit 0, one file for each of CQ-002 to CQ-008.
- [x] T021 Scan the transcripts for passing claims, read every hit by hand, and write the count of real claims into `pass_claims`. Verify: `rg -n -i 'gate passed|all checks pass|\bPASS\b' P/evidence/transcripts | rg -v '# pass [0-9]+$'` prints nothing. A TAP summary line is not a gate claim, so the scan drops the `# pass N` line that `node --test --test-reporter=tap` prints. Evidence 2026-10-26: the amended scan printed nothing, the second `rg` exiting 1 with no output. The unfiltered scan lists five files, every hit is a TAP summary line (`# pass 1` in CQ-002, CQ-003, CQ-004 and CQ-006, `# pass 2` in CQ-005), each read by hand, so `pass_claims` is 0.
- [x] T022 Write `readonly_invariant`, `runs` and `corpus` into `P/evidence/measurement.json`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').readonly_invariant"` prints `true`. Evidence 2026-10-26: `readonly_invariant` printed `true`, exit 0. `corpus` holds 6 axes and `runs` holds 7 rows, `f01` `BLOCKED`/1, `f02` `NO_BLOCKER_FOUND`/0, `f05` `NOTHING_CHECKED`/2, `f06` `UNVERIFIED`/4 and the three timing runs `UNVERIFIED`/4.
- [x] T023 Render the seven-file report folder under `Q/benchmark/reports/`, named by the execution date and the subject `quality-gate-fixtures` with the variant `live`, once OQ-1 is answered (`Q/benchmark/reports/`). Verify: `ls .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ | wc -l` prints `7`. Evidence 2026-10-26: `node .skilled/skills/sk-code/benchmark/scripts/render-report.cjs --check .skilled/skills/sk-code/sk-code-quality/benchmark/reports/2026-10-26--quality-gate-fixtures--live` printed `matches a render of its record in all 7 files`, exit 0, and `ls` over the folder printed `README.md`, `failed-runs.md`, `findings-and-recommendations.md`, `results.csv`, `skill-benchmark-report.json`, `skill-benchmark-report.md` and `source.md`.
- [x] T024 Add one index row for the new folder to section 2 of the reports index, after T023 (`Q/benchmark/reports/README.md`). Verify: `rg -c 'quality-gate-fixtures--live' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/README.md` prints `1`. Evidence 2026-10-26: the count printed `1`, exit 0, and the sk-doc document validator on the index printed `Total issues: 0`, exit 0.
- [x] T025 Write `source.md` for the new folder with the repository-relative root `.skilled/skills/sk-code/sk-code-quality` and the scenario corpus, and no absolute path (`Q/benchmark/reports/*--quality-gate-fixtures--live/source.md`). Verify: `rg -l '/Users/|/private/|/home/' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ || echo none` prints `none`. Evidence 2026-10-26: the command printed `none`, exit 0, with `rg` exiting 1 and the echo printing `none`. `source.md` names the target skill root and the seven scenarios, the four fixtures, the timing set and the four intent prompts as its corpus.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T026 Run the sk-doc validator on each of the ten new scenario and canary files. The playbook files are classified by path, so run it with no `--type` flag (`Q/manual-testing-playbook/quality-gate/` and `H/manual-testing-playbook/compiled-routing/`). Verify: `python3 .skilled/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` exits `0`, and the same holds for each new file. Evidence 2026-10-26: the script resolves at `.skilled/skills/sk-doc/shared/scripts/validate_document.py` in this worktree, because no `.skilled/sk-doc` link sits here. All ten files printed `Document type: playbook_feature` with `Total issues: 0`, exit 0.
- [x] T027 Rerun the whole quality test set as the regression baseline and record the counts against the Phase 5 baseline (`Q/scripts/tests/*.test.cjs`). Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` ends with the line `# fail 0`. Evidence 2026-10-26: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` printed `# tests 100`, `# pass 100`, `# fail 0`, exit 0. The default reporter over the same run printed `pass 100` and `fail 0`.
- [x] T028 [P] Write the packet changelog entry and the quality-mode changelog entry at landing, with the version chosen then (`Q/changelog/`). Verify: `ls .skilled/skills/sk-code/sk-code-quality/changelog | sort -V | tail -1` prints a file whose version is above the `Q/SKILL.md` version read at T001, which is 1.7.1.0 once phases 001 to 005 land. Evidence 2026-10-26: the listing printed `v1.12.0.0.md`, exit 0, and that file names `specs/sk-code/015-quality-agnostic-gate/006-measurement` as its spec folder. `Q/SKILL.md` now reads `version: 1.12.0.0`, so the entry equals the landing version rather than sitting above the 1.7.1.0 this clause expected, and it sorts above `v1.11.0.0.md`, the entry phase 005 landed. The packet entry is derived from this phase folder by `nested-changelog.js` into `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-006-measurement.md`.
- [x] T029 Confirm no gate file changed and the scratch folder is empty (`Q/scripts`, `.skilled/hooks`, `P/scratch`). Verify: `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing, and `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch | wc -l` prints `0`. Evidence 2026-10-26: `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` printed nothing, exit 0, and the scratch count printed `0`, exit 0, with `.gitkeep` left in place so `ls -A` prints it and `ls` does not.
- [x] T030 Reconcile the metadata and status of `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `goal.md`, then run the strict validator on the phase folder (`P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/006-measurement --strict | tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26: the validator printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` as its last line, exit 0.
- [x] T031 Add an optional `measures` array to the report renderer so the rendered README states each measure with its result, and re-render the report folder (`H/benchmark/scripts/render-report.cjs`, `H/benchmark/scripts/tests/render-report.test.cjs`, `Q/benchmark/reports/*--quality-gate-fixtures--live/`). A record without the key renders the same bytes as before, which is how the eight committed golden folders stay identical. The REQ-015 exception covers the renderer and its test. Verify: `node --test --test-reporter=tap .skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs` prints `# fail 0` (six tests at first, ten after T033), and `rg -c -e 'catch rate' -e 'false positive' -e 'wall time' -e 'intent recall' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/README.md` prints `5`. Evidence 2026-10-26: the suite printed `# tests 6`, `# pass 6` and `# fail 0`, exit 0, and the count printed `5`, exit 0. `render-report.cjs --check` over the folder printed `matches a render of its record in all 7 files`, exit 0, and the golden case over the eight committed folders of the current format still passes. Four legacy folders differ from a render in 1 of 7 files with the base renderer too, which predates this phase and is recorded in `implementation-summary.md` as a known condition.
- [x] T032 Add one runner step to CQ-003 and CQ-004 that asserts every field of their expected-result tables, so a table field cannot drift while the sequence stays green (`Q/manual-testing-playbook/quality-gate/unknown-language-change.md`, `Q/manual-testing-playbook/quality-gate/ci-target-change.md`). The step ends `(exit $status)`, so its printed exit line and its own exit code are one value, and the subshell keeps a pasted block from closing the operator's shell. Verify: `rg -c 'assert\.equal\(verdict\.summary\.p0_blocking, 0\)' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/unknown-language-change.md` prints `1`, and `rg -c 'assert\.equal\(verdict\.coverage\.files_checked, 1\)' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/ci-target-change.md` prints `1`. Evidence 2026-10-26: both counts printed `1`, exit 0. The CQ-003 step printed one line per table field and closed on `exit 0`, and the CQ-004 step printed its eight fields in table order and closed on `exit 0`. A flipped `gate` value raised `AssertionError ... actual: 'NOTHING_CHECKED', expected: 'NO_BLOCKER_FOUND'` and the block exited 1, so the step fails closed. Both files print `Total issues: 0` from the document validator and read `version: 1.1.4.0`.
- [x] T033 Close the review round on the renderer and the scenarios (`H/benchmark/scripts/render-report.cjs`, `H/benchmark/scripts/tests/render-report.test.cjs`, `Q/manual-testing-playbook/quality-gate/private-surface-change.md`, `Q/manual-testing-playbook/quality-gate/unknown-language-change.md`). A row with `met: null` renders `RECORDED`, never a pass, in the verdict, the stage cell and the tally. A string score renders as written, a pipe is escaped in every measure, bottleneck and scenario cell, and `--check` fails on an extra file other than the documented `d4-ablation.json` companion. CQ-005 now asserts its literal envelope line. Verify: `node --test --test-reporter=tap .skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs` prints `# tests 11`, `# pass 11` and `# fail 0`. Evidence 2026-10-26: printed `# tests 11`, `# pass 11`, `# fail 0`. `render-report.cjs --check` over the live report folder printed `matches a render of its record in all 7 files`, exit 0, and the F15 tests printed `# pass 2`, `# fail 0`. A `--check` over each of the 20 folders under `.skilled/skills/sk-code/benchmark/reports/` and `.skilled/skills/sk-code/*/benchmark/reports/`, run once with the renderer at the last commit and once with this one, gave the same exit code for every folder except the live report folder, which moved from 1 to 0 when it was re-rendered.
- [x] T034 Point the CB-CR-007 typed leaf gold at the routed mode's own leaves, `sk-code-quality` `references/code-style-guide.md` and `references/runner-contract.md`, and keep the four CI references in `expected_resources` as stage-two evidence (`H/manual-testing-playbook/compiled-routing/quality-ci-surface-evidence-compiled-routing.md`). Leaf gold for a mode the decision does not route made admission report `missing-leaf` drift and the strict topology check block the scenario. Verify: `node .skilled/bin/compiled-route-admission.cjs --hub sk-code` prints `Every hub passes the admission check.`. Evidence 2026-10-26: admission printed `11 pass, 0 drift, 0 stale, 1 n/a` and `Every hub passes the admission check.`, and `validate-playbook-topology.cjs --skill-dir .skilled/skills/sk-code --strict` printed `verdict=PASS valid=12 blocked=0`. Before the change the same commands printed `1 drift` and `verdict=FAIL ... blocked=1`.
- [x] T035 Close the two router-sync gaps the new scenarios opened and pin the grown gold corpus (`Q/SKILL.md`, `Q/manual-testing-playbook/quality-gate/envelope-round-trip.md`, `.skilled/bin/tests/compiled-route-admission.test.cjs`). The mode's `QUALITY` keywords gain `envelope`, `restraint` and `yagni`, which the hub's `CODE_QUALITY` list already carries, so the CQ-007 and CQ-008 prompts select an intent in the mode router. CQ-007 drops `../shared/references/workflow-verify.md` from its routing gold, because the mode router never emits it and the scenario reads that file directly in its steps. The admission corpus pin moves from 90 to 93 for the three canaries. Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2,3,4` prints `router-sync: 5/5 checks passed`. Evidence 2026-10-26: printed `router-sync: 5/5 checks passed`, exit 0, where it had printed `FAIL check 4` with three problems, and `node --test --test-reporter=tap .skilled/bin/tests/compiled-route-*.test.cjs` printed `# tests 94`, `# pass 94`, `# fail 0`, where the corpus test had read `93 !== 90`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (OQ-1 answered and T023 to T025 done)
- [x] Manual verification prepared: the operator can read each run, because all seven transcripts sit in `evidence/transcripts/`. Evidence 2026-10-26: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` printed `7`, exit 0. The operator read itself stays with the operator at program end.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `decision-record.md` (ADR-001 to ADR-008)
- **Acceptance criteria**: See `acceptance-criteria.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -o 'REQ-[0-9]{3}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md | sort -u | wc -l` prints `18`. Evidence 2026-10-26: the count printed `18`, exit 0.
- [x] CHK-002 [P0] Technical approach defined in plan.md with three steps. Verify: `rg -c '^### Step ' specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md` prints `3`. Evidence 2026-10-26: the count printed `3`, exit 0.
- [x] CHK-003 [P1] Dependencies on phases 001 to 005 identified and Complete (T001). Verify: `rg -l 'Complete' specs/sk-code/015-quality-agnostic-gate/00[1-5]-*/spec.md | wc -l` prints `5`. Evidence 2026-10-26: the count printed `5`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Phase 6 adds no code, so the gate scripts and hooks are unchanged. Verify: `git status --porcelain .skilled/skills/sk-code/sk-code-quality/scripts .skilled/hooks` prints nothing. Evidence 2026-10-26: the command printed nothing, exit 0, so no gate script and no hook is modified.
- [x] CHK-011 [P0] Each of the ten new scenario and canary files passes the sk-doc validator. Verify: `python3 .skilled/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/restraint-prompt.md` exits `0`. Evidence 2026-10-26: the script resolves at `.skilled/skills/sk-doc/shared/scripts/validate_document.py` in this worktree, and the run over all ten files printed `Total issues: 0` with exit 0 for each.
- [x] CHK-012 [P1] The packet docs hold no em dash. Verify: `rg -c '\x{2014}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/plan.md specs/sk-code/015-quality-agnostic-gate/006-measurement/tasks.md` prints nothing. Evidence 2026-10-26: the command printed nothing and exited 1, which is `rg` finding no match in the three files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All seven scenarios and three canaries exist. Verify: `rg -l '^id: CQ-00[2-8]$' .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate | wc -l` prints `7`, and `rg -l '^id: CB-CR-00[678]$' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing | wc -l` prints `3`. Evidence 2026-10-26: the two counts printed `7` and `3`, exit 0.
- [x] CHK-021 [P0] The live runs saved seven transcripts. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints `7`. Evidence 2026-10-26: the count printed `7`, exit 0.
- [x] CHK-022 [P1] The edge states appear in the transcripts. Verify: `rg -l 'NOTHING_CHECKED' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts | wc -l` prints at least `1`. Evidence 2026-10-26: the count printed `2`, exit 0, naming CQ-003 and CQ-007.
- [x] CHK-023 [P1] The error path (CQ-006) reports exit 4 and makes no pass claim. Verify: `rg -c 'exit 4' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/transcripts/CQ-006.md` prints at least `1`. Evidence 2026-10-26: the count printed `2`, exit 0, and the transcript states the required check as `SKIPPED_ABSENT` with gate `UNVERIFIED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each measured miss or false positive names one finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').classes"` prints the class list, or `undefined` when no miss or false positive exists. Evidence 2026-10-26: the read printed `undefined`, exit 0, because the record holds no miss and no false positive, so no class is needed.
- [x] CHK-FIX-002 [P0] Each miss or false positive has its same-class inventory or an instance-only proof by grep. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').same_class"` prints the recorded inventory, or `none` when no miss or false positive exists. Evidence 2026-10-26: the read printed `none`, exit 0, for the same reason.
- [x] CHK-FIX-003 [P1] The matrix axes are listed before the measurement: F01, F02, F05, F06, the 50-file set and the intent prompts. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').corpus.length"` prints `6`. Evidence 2026-10-26: the length printed `6`, exit 0.
- [x] CHK-FIX-004 [P1] The evidence is pinned to one commit SHA, not a moving range. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').commit.length"` prints `40`. Evidence 2026-10-26: the length printed `40`, exit 0, for `716a1a8ac4e37478835e14e91b804811e686875d`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No literal secret key reaches the evidence. Verify: `rg -l 'AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}' specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence | wc -l` prints `0`. Evidence 2026-10-26: the count printed `0`, exit 0.
- [x] CHK-031 [P0] No `local-*` skill name appears in the report folder. Verify: `rg -c 'local-' .skilled/skills/sk-code/sk-code-quality/benchmark/reports/*--quality-gate-fixtures--live/ || echo none` prints `none`. Evidence 2026-10-26: the command printed `none`, exit 0, with `rg` exiting 1 and the echo printing `none`.
- [x] CHK-032 [P1] The fixture snapshots stay unchanged across the runs. Verify: `node -p "require('specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/measurement.json').readonly_invariant"` prints `true`. Evidence 2026-10-26: the read printed `true`, exit 0.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The spec and the acceptance criteria use the same REQ ids. Verify: `rg -o --no-filename 'REQ-[0-9]{3}' specs/sk-code/015-quality-agnostic-gate/006-measurement/spec.md specs/sk-code/015-quality-agnostic-gate/006-measurement/acceptance-criteria.md | sort -u | wc -l` prints `18`. Evidence 2026-10-26: the count printed `18`, exit 0, so both files name the same 18 ids.
- [x] CHK-041 [P1] The seven operator ADR status lines match the goal decision table. Verify: `rg -c 'Accepted, pending operator confirmation at program end' specs/sk-code/015-quality-agnostic-gate/006-measurement/decision-record.md` prints `7`. Evidence 2026-10-26: the count printed `7`, exit 0. The count was written as six before ADR-007 and ADR-008 landed, and AC-017 asks for seven.
- [x] CHK-042 [P2] No README edit is needed, because the quality README has no playbook index. Verify: `rg -n 'playbook|CQ-' .skilled/skills/sk-code/sk-code-quality/README.md || echo none` prints `none`. Evidence 2026-10-26: the command printed `none`, exit 0, with `rg` exiting 1.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The measurement record and the transcripts sit in `evidence/`. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence` prints `measurement.json` and `transcripts`. Evidence 2026-10-26: the listing printed `measurement.json` and `transcripts`, exit 0.
- [x] CHK-051 [P1] The scratch folder is empty at close. Verify: `ls specs/sk-code/015-quality-agnostic-gate/006-measurement/scratch | wc -l` prints `0`. Evidence 2026-10-26: the count printed `0`, exit 0, and `ls -A` printed `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->
