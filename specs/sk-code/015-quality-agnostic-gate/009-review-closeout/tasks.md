---
title: "Tasks: Phase 9: review-closeout"
description: "Ordered tasks for the review closeout: the baselines, one or more tasks per requirement with the command that decides each, the release work and the packet gates."
trigger_phrases:
  - "review closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 9: review-closeout

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

**Task Format**: `T### [P?] Description (REQ-00N) (file path)`, then `Verify:` and the command, then the output it must print.

Shell variables for every command in this list. Run each command from the repository root.
- `Q=.skilled/skills/sk-code/sk-code-quality`
- `H=.skilled/skills/sk-code`
- `D=.skilled/commands/doctor/scripts`
- `R=specs/sk-code/015-quality-agnostic-gate`
- `P=$R/009-review-closeout`

Every task is open. The conductor ticks each one with its evidence. Comments in every changed code block state the durable reason only. No packet path, phase number, REQ, ADR or task id appears in a code comment.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the quality suite baseline before the first source edit (`$Q/scripts/tests`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/*.test.cjs 2>&1 | rg '^# (tests|fail)'` prints a `# tests` count and `# fail 0`, recorded here. Amended 2026-10-26: a run before the first source edit could not hold because the edits landed before any baseline was recorded; the same command run in a `git archive HEAD` copy of HEAD `002c94662f`, the unedited tree since every edit here is uncommitted, tests the same intent. Evidence 2026-10-26: that run printed `# tests 100`, `# pass 99` and `# fail 1`. The one failure is F22, which reads `specs/`, and the archive copy has no `specs/` folder (ENOENT on scandir `specs`), so it is the copy's environment, not the code. The baseline is 100 tests.
- [x] T002 [P] Record the doctor and sk-code-skilled suite baselines (`$D/tests/sk-code-quality-config.test.cjs`, `$H/sk-code-skilled/scripts/tests`). Verify: `node --test --test-reporter=tap $D/tests/sk-code-quality-config.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`. Amended 2026-10-26: a pre-edit run could not hold for the reason in T001; the same commands run in the `git archive HEAD` copy of `002c94662f` test the same intent. Evidence 2026-10-26: the doctor suite printed `# tests 7` and `# fail 0`, and the sk-code-skilled suite printed `# tests 29` and `# fail 0`.
- [x] T003 [P] List every place the two outside-skill codes are raised (`$Q/scripts/quality-gate.cjs`). Verify: `rg -n 'CHECKLIST_OUTSIDE_SKILL|CHECKLIST_ROW_INVALID' $Q/scripts/quality-gate.cjs` prints the raise sites, recorded here. Evidence 2026-10-26: the command printed lines 208 and 209 (the two repair strings), 1111 and 1112 (the `invalid` and `outside` row builders) and 1205 (the block-fault report). Every fault these build reaches `resolveChecklists`, which routes it into `errors` or `warnings` at lines 1272 to 1293. Read after the edit, not before it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A, first on `quality-gate.cjs`
- [x] T004 Raise `CHECKLIST_OUTSIDE_SKILL` and `CHECKLIST_ROW_INVALID` into `errors[]` only when the faulty skill's surface applies to a file in scope, and into a new `config.warnings` array otherwise (REQ-001) (`$Q/scripts/quality-gate.cjs`). Verify: `rg -n 'warnings' $Q/scripts/quality-gate.cjs` prints the new array. Evidence 2026-10-26: the command printed 11 lines, among them `742: warnings: [],`, `1272: const warnings = [];`, `1276: else warnings.push(entry);`, `1293: return { checklists, errors, warnings };`, the two verdict merges at 2442 and 2489 and the text line at 2560.
- [x] T005 Add two cases: a fault on a surface no file in scope reaches gives `config.warnings` and an unchanged gate, and the same fault with a file of that surface in scope gives `ERROR` (REQ-001) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/quality-gate.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`. Evidence 2026-10-26: the run printed `# tests 74`, `# pass 74` and `# fail 0`. The two cases are `outside skill fault: a malformed row whose surface reaches no scoped file never gates` (line 728) and `outside skill fault: the same malformed row with a scoped file its surface reaches gates` (line 744), with the `--explain` case at line 758.
- [x] T006 State the scoped rule and the `config.warnings` array (REQ-001) (`$Q/references/runner-contract.md`). Verify: `rg -c 'config.warnings' $Q/references/runner-contract.md` prints `1` or more. Evidence 2026-10-26: the command printed `3`.

### Lane B, after lane A
- [x] T007 Read the trust grant once per run, before any configured spawn: `--config` named, `skcode.qualityConfig` stored in the repository's own `.git/config` and not through an include, `skilled.trustRepoChecks` true in local git config, or the repository under test sharing its git common dir with the runner's checkout. Without one, mark each configured check `SKIPPED_UNTRUSTED` with the repair line, and make a required one `UNVERIFIED` (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `rg -c 'SKIPPED_UNTRUSTED' $Q/scripts/quality-gate.cjs` prints `1` or more, and `rg -c 'git config --local skilled.trustRepoChecks true' $Q/scripts/quality-gate.cjs` prints `1`. Open 2026-10-26: the first command printed `2`. The second printed nothing, because the repair line is built from a constant: line 64 holds `const TRUST_KEY = 'skilled.trustRepoChecks';` and line 65 holds ``const TRUST_REPAIR = `git config --local ${TRUST_KEY} true`;``, so the literal text never appears in the file. The behaviour holds, since T008's no-grant case and the doctor case assert the full repair string, but the Verify as written fails. Amended 2026-10-26: `rg -c 'git config --local skilled.trustRepoChecks true' $Q/scripts/quality-gate.cjs` could not hold because the repair line is built from `TRUST_KEY`; ``rg -n 'const TRUST_REPAIR = `git config --local \$\{TRUST_KEY\} true`' $Q/scripts/quality-gate.cjs`` plus `rg -c "TRUST_KEY = 'skilled.trustRepoChecks'" $Q/scripts/quality-gate.cjs` tests the same intent. Evidence 2026-10-26: the first printed line 65, the second printed `1`, and `rg -c 'SKIPPED_UNTRUSTED'` printed `2`.
- [x] T008 Add the trust cases: the hub repository runs, `skilled.trustRepoChecks` true in local git config runs, `--config` runs, `skcode.qualityConfig` stored in the repository's own `.git/config` runs, and none of them gives `SKIPPED_UNTRUSTED` with exit 4 for a required check (REQ-002) (`$Q/scripts/tests/configured-checks.test.cjs`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/configured-checks.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`. Evidence 2026-10-26: the run printed `# tests 23`, `# pass 23` and `# fail 0`. The cases are 5 (no grant, status 4, gate `UNVERIFIED`, `SKIPPED_UNTRUSTED`), 6 (local `skilled.trustRepoChecks true`), 8 (`--config`), 9 (`skcode.qualityConfig` in `.git/config`), 12 (the hub repository by shared common dir), and the hostile cases 7, 10, 11 and 13 to 15 (non-boolean value refused, global key refused, include refused, `--no-run`, not required, generated row).
- [x] T009 Name the grant, the four ways to hold it and the repair line in section 8, and define `SKIPPED_UNTRUSTED` and its exit (REQ-002) (`$Q/references/quality-config.md`, `$Q/references/runner-contract.md`). Verify: `rg -c 'trustRepoChecks' $Q/references/quality-config.md $Q/references/runner-contract.md` prints `1` or more for each file. Evidence 2026-10-26: the command printed `quality-config.md:1` and `runner-contract.md:2`.
- [x] T010 Report the trust state and the grant that holds in `status`, and write no git config (REQ-002) (`$D/sk-code-quality-config.cjs`, `$D/tests/sk-code-quality-config.test.cjs`). Verify: `node --test --test-reporter=tap $D/tests/sk-code-quality-config.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`, and the case asserts the git config is unchanged after `status`. Evidence 2026-10-26: the run printed `# tests 9`, `# pass 9` and `# fail 0`. Cases 6 and 7 read `TRUST=untrusted` and `TRUST=trusted`, and case 7 wraps `status` in `assertSnapshotUnchanged`, whose `snapshotTree` walks the whole fixture repository, `.git/config` included, and fails on any changed entry.
- [x] T011 Confirm the hook trust key is untouched (REQ-002) (`.skilled/scripts/git-hooks`). Verify: `rg -c 'trustRepoChecks' .skilled/scripts/git-hooks` prints nothing. Evidence 2026-10-26: the command printed nothing.

### Lane C, after lane B
- [x] T012 Record the timing baseline over five full runs before the pool change (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, recorded here with `git rev-parse --short HEAD`. Amended 2026-10-26: the `/usr/bin/time` loop could not hold because the baseline was taken on the unedited runner over a temporary repository of 50 changed `.js` files and written to `evidence/timing.json`, not printed as `real` lines; `node -p "require('./$P/evidence/timing.json').before.runs_ms.length"` tests the same intent. Evidence 2026-10-26: it printed `5`. The before runs read 1845, 1849, 1599, 1546 and 1473 ms, median 1599, with `syntax-node` at 1188 to 1504 ms. `git rev-parse --short HEAD` printed `002c94662f`, the unedited runner's tree.
- [x] T013 Run the per-file `node --check` calls as a pool bounded by the core count, gathering results by input index (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `rg -n 'availableParallelism' $Q/scripts/quality-gate.cjs` prints the bound. Evidence 2026-10-26: the command printed line 1508, inside `nodeCheckPoolLimit`, which returns `Math.max(1, Math.min(NODE_CHECK_MAX_PARALLEL, cores - 1))` with the ceiling 8. The pool itself runs in `$Q/scripts/lib/parallel-node-check.cjs`, where `runPool` writes `records[index]` at each file's input index (line 168).
- [x] T014 Add the pool parity case: a list longer than the bound with one syntax error in the middle gives the same findings in the same order as the sequential loop (REQ-003) (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/quality-gate.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`. Open 2026-10-26: the case `unit: node pool: twelve changed files keep both syntax errors and the reasons a sequential check produced` (line 1909) runs twelve files, past the bound of 8, and asserts each finding equals a direct `node --check`. Its two faulty files, `src/bad-end.js` and `src/bad-token.js`, sort ahead of `src/clean-1.js` to `src/clean-10.js`, so the errors sit at input index 0 and 1, not in the middle. The case as written does not test the mid-list error. Evidence 2026-10-26: the new case `unit: node pool: a syntax error in the middle of a long list matches a sequential check file by file` (line 1954) runs eleven files past the bound of 8 with the fault in `src/part-06.js`, sorted index 5 of 11 (asserted at line 1959), and matches the finding's file, line and reason to a reference built from a direct `node --check` per file. The Verify printed `# tests 77`, `# pass 77`, `# fail 0`, with the case `ok 75`.
- [x] T015 Measure five full runs after the change and write each run's wall time and per-check `duration_ms`, with the machine, the core count and the HEAD (REQ-003) (`$P/evidence/timing.json`). Verify: `node -p "require('./$P/evidence/timing.json').runs.length"` prints `5`, and each wall time reads under 2000 ms. Amended 2026-10-26: `.runs.length` could not hold because the file keeps the runs under `before` and `after`; `node -p "require('./$P/evidence/timing.json').after.runs_ms.length"` tests the same intent. Open 2026-10-26: that check printed `5`, the after runs read 723, 704, 725, 668 and 620 ms (max 725, under 2000), `checks_ms` holds each check per run, and `reference_machine` names the Apple M5 Max with 18 cores. The file held no HEAD field, so the HEAD part of this task was not met. Evidence 2026-10-26: the file now holds `head` `002c94662f`, which `git rev-parse --short HEAD` prints, and `tree` says the after runs measured the uncommitted working tree on top of it. The amended check printed `5`, and the after runs read 723, 704, 725, 668 and 620 ms, max 725, under 2000.

### Lane D, in parallel
- [x] T016 [P] Add the parity test that runs the hub reader and the plugin copy on the same inputs and fails on any label difference (REQ-004) (`$H/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs`). Verify: `node --test $H/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` exits 0. Evidence 2026-10-26: the run printed `tests 2`, `pass 2`, `fail 0`, and the tool reported no non-zero exit. The live-hub case compares one declared surface today (`fallback:SKILLED`), and the throwaway-hub case compares four.
- [x] T017 [P] Prove the test can fail: change one reader's label in a temporary copy and run the test against it (REQ-004) (scratch copy only). Verify: the test exits non-zero against the copy, and the tracked readers stay unchanged in `git status --porcelain`. Evidence 2026-10-26: the test and the plugin were copied to the session scratchpad (outside the repository, so not under `scratch/`), the copy's `PLUGIN_PATH` pointed at the copied plugin, and the copied `surfaceEntry` returned `block.label.toLowerCase()` in place of `toUpperCase()`. `node --test` on the copy printed `fail 2` with `Exit code 1`, the diffs reading `fallback:skilled` against `fallback:SKILLED` and `specific:alpha` against `specific:ALPHA`. Afterwards `git diff HEAD --stat` on the plugin, the replay library and the parity test listed only the plugin's earlier 7-line change, and `rg -c 'toUpperCase\(\), role: block.role' .opencode/plugins/system-skill-advisor.js` printed `1`.

### Lane E, in parallel
- [x] T018 [P] Name the runner in the QUALITY step by the loaded sk-code skill's location, not by a path from the repository root (REQ-005) (`.skilled/agents/code.md`). Verify: `rg -c 'node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md` prints `0`. Open 2026-10-26: the command printed `1`. Line 68 now names the runner as `sk-code-quality/scripts/quality-gate.cjs` inside the sk-code skill loaded in step 3, and then keeps a worked example, `(in this repository: node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs, ...)`. The example is what the count finds. The intent holds and the Verify as written fails. Amended 2026-10-26: `rg -c 'node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md` printing `0` could not hold because the step keeps a worked example labelled `in this repository:`; ``rg -c 'inside the sk-code skill loaded in step 3' .skilled/agents/code.md`` printing `1`, plus ``rg -c 'in this repository: `node .skilled/skills/sk-code/sk-code-quality' .skilled/agents/code.md`` printing the same count as the unlabelled search, tests the same intent: the step names the runner by the loaded skill's location, and a root path appears only as a labelled example. Evidence 2026-10-26: the three commands printed `1`, `1` and `1`.
- [x] T019 [P] Carry the same wording into each mirror through the mirror tooling (REQ-005) (`.claude/agents/code.md`, `.pi/agents/code.md`, `.codex/agents/code.toml`, `.hermes/skills/agent-code/SKILL.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0. Evidence 2026-10-26: the command printed that 11 agents were checked, all mirrors in sync, OK, and the tool reported no non-zero exit.

### Lane F, in parallel
- [x] T020 [P] Record the operator confirmation of 2026-10-26 on every decision that waited for it, and mark the 005 outside-skill fault rule amended by this phase (REQ-006) (`$R/00[1-8]-*/decision-record.md`, `implementation-summary.md`, `spec.md`, `acceptance-criteria.md`). Verify: `rg -n 'pending operator confirmation|pending confirmation' $R/00[1-8]-*` prints no line, and `rg -c 'amended' $R/005-consumers-and-routing/decision-record.md` prints `1` or more. Open 2026-10-26: the second command printed `3`. The first printed two lines, both inside closed task evidence that quotes the old status as history: `004-doctrine/tasks.md:81` (T021, "with ADR-003 set to Accepted, pending operator confirmation at program end. Confirmed by the operator 2026-10-26.") and `007-checker-debt-closeout/tasks.md:212` (CHK-041, which quotes the earlier Status row in its Verify text). Neither is a live pending status, but the Verify as written fails. Amended 2026-10-26: the bare search could not print no line because closed evidence quotes the old status as history; `rg -n 'pending operator confirmation|pending confirmation' $R/00[1-8]-* | rg -v 'Confirmed by the operator 2026-10-26'` tests the same intent, since each history line carries its confirmation. Evidence 2026-10-26: it printed no line (exit 1), and the `amended` count printed `3`.
- [x] T021 [P] Restore 006 AC-021 to a scope check over `git diff --name-only` for 006's commit range against 006 `plan.md`'s files-to-change list (REQ-007) (`$R/006-measurement/acceptance-criteria.md`). Verify: `rg -n 'AC-021' $R/006-measurement/acceptance-criteria.md` prints a row naming `git diff --name-only`. Open 2026-10-26: the command printed the row at line 75 (and the closure line 102), and the row is a scope check again, `Met` with T037. It does not name `git diff --name-only`: it uses `git show --name-only --format= 262c059c6f 7bc9a30300 85af77b676 97aedb6f82 002c94662f | sort -u`, and it compares against `spec.md` section 3, because the row records that `plan.md` holds no files list. The substance holds and the Verify text does not match. Amended 2026-10-26: a row naming `git diff --name-only` and `plan.md` could not hold because 006's `plan.md` holds no files list and the five commits are named one by one; ``rg -n 'AC-021' $R/006-measurement/acceptance-criteria.md | rg -c 'git show --name-only'``, ``rg -n 'AC-021' $R/006-measurement/acceptance-criteria.md | rg -c "spec.md\` section 3"`` and `rg -c '^\| AC-021 .*\| Met \| - \|$' $R/006-measurement/acceptance-criteria.md` test the same intent, a scope check over the files 006's commits changed. Evidence 2026-10-26: the three commands printed `1`, `1` and `1`.
- [x] T022 [P] Label 006 NFR-P01 a reference-machine figure with five runs (REQ-007) (`$R/006-measurement/spec.md`). Verify: `rg -n 'NFR-P01' $R/006-measurement/spec.md` prints a line naming the reference machine and five runs. Evidence 2026-10-26: line 183 reads "Built-in checks finish in under 2000 ms for 50 changed `.js` files on each of five full runs. The 2000 ms target is a reference-machine figure, measured on an Apple M5 Max with 18 cores".
- [x] T023 [P] Say that report folders dated before the renderer are legacy and `--check` does not apply to them (REQ-007) (`$H/benchmark/README.md`). Verify: `rg -n 'legacy' $H/benchmark/README.md` prints the line. Evidence 2026-10-26: line 133 reads "Folders written before the renderer existed are legacy. They do not reproduce from their records, and `render-report.cjs --check` does not apply to them." and names the seven folders.
- [x] T024 [P] Narrow criterion 3 to the CodeQL workflow's `dynamic` runs by workflow name, and update its amendment note (REQ-008) (`specs/system-speckit/053-ci-workflow-efficiency/goal.md`). Verify: `rg -n 'CodeQL' specs/system-speckit/053-ci-workflow-efficiency/goal.md` prints criterion 3 with a workflow-name filter, and `git diff --stat` for that file shows only those lines. Open 2026-10-26: the first half holds, line 90 reads `select(.event != "dynamic" or .workflowName != "CodeQL")` and line 129 is the new amendment row. `git diff HEAD` on the file shows three changed places, criterion 3, the new amendment row, and the Phase 008 row of the status table, where "pending the operator's check" became "confirmed by the operator on 2026-10-26". That third line is the D8 confirmation the closeout asked for, but it falls outside "only those lines", so the Verify as written fails. Amended 2026-10-26: "only those lines" could not hold because REQ-006 also asks that the D8 confirmation be recorded, and it lives in that goal's Phase 008 row; a diff that touches only criterion 3, its amendment row and the Phase 008 row tests the same intent. Evidence 2026-10-26: `git diff HEAD -U0` on the file printed three hunks, at lines 90, 117 and 129, and `git diff HEAD --stat` printed `3 insertions(+), 2 deletions(-)`.
- [x] T025 [P] Name the four UNKNOWN rule sources in ADR-001, name the phases that exist in the purpose line, and set every section 5 status to `Accepted, confirmed by the operator 2026-10-26` with a note that none was reversed (REQ-009) (`$R/spec.md`). Verify: `rg -c 'confirmed by the operator 2026-10-26' $R/spec.md` prints `6` or more, and `rg -c 'all seven phases' $R/spec.md` prints `0`. Evidence 2026-10-26: the first command printed `7`, the second printed nothing (no match). Line 228 names the four rule sources, and line 223 reads "None was reversed."

### Lane G, last
- [x] T026 Bump the sk-code hub, sk-code-quality and sk-code-skilled versions at the numbers the conductor picks, and write one changelog entry per packet (REQ-010) (`$H/SKILL.md`, `$H/description.json`, `$H/mode-registry.json`, `$H/hub-router.json`, `$H/README.md`, `$Q/SKILL.md`, `$H/sk-code-skilled/SKILL.md`, the three `changelog/` folders). Verify: `rg -n '^version' $H/SKILL.md $Q/SKILL.md $H/sk-code-skilled/SKILL.md` prints the new numbers, and each `changelog/` folder holds a file at that number. Evidence 2026-10-26: the command printed `sk-code/SKILL.md:5:version: 3.9.0.0`, `sk-code-skilled/SKILL.md:5:version: 2.1.2.0` and `sk-code-quality/SKILL.md:5:version: 1.13.0.0`. `git status --porcelain --untracked-files=all` lists the new `sk-code/changelog/v3.9.0.0.md`, `sk-code-quality/changelog/v1.13.0.0.md` and `sk-code-skilled/changelog/v2.1.2.0.md`, plus `system-skill-advisor/changelog/v0.17.2.0.md` for the plugin change.
- [x] T027 Regenerate the Hermes copies of the edited `SKILL.md` files (REQ-010) (`.hermes/skills/`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0. Evidence 2026-10-26: the command printed that 11 agents were checked, all mirrors in sync, OK, and `git diff HEAD --stat` lists the four regenerated `.hermes/skills/` copies (`sk-code`, `sk-code-quality`, `sk-code-skilled`, `system-skill-advisor`).
- [x] T028 Write the packet changelog (REQ-010) (`$R/changelog/changelog-015-009-review-closeout.md`). Verify: `ls $R/changelog/changelog-015-009-review-closeout.md` lists the file. Evidence 2026-10-26: `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js $P --write` exited 0, and `ls -la` lists the file at 23798 bytes. The generator is rerun after the last tick so the file matches the final rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T029 Run the whole quality suite on the final tree (`$Q/scripts/tests`). Verify: `node --test --test-reporter=tap $Q/scripts/tests/*.test.cjs 2>&1 | rg '^# (tests|fail)'` prints a count at or above the T001 baseline and `# fail 0`. Evidence 2026-10-26, on the final tree (HEAD `002c94662f` plus the uncommitted change set, the R3 hardening landed): the command printed `# tests 123`, `# pass 123` and `# fail 0`, above the T001 baseline of 100, and `pgrep -fl 'node --check'` afterwards printed nothing (exit 1), so no syntax child outlived the run.
- [x] T030 Run this repository's own config through the gate, so the hub-repository grant holds (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/quality-gate.cjs --format json | rg -c 'SKIPPED_UNTRUSTED'` prints `0`. Evidence 2026-10-26: the command printed nothing, which is how `rg -c` reports a zero count on piped input, and the full JSON run read gate `NO_BLOCKER_FOUND`, exit_code 0. One caveat: this repository holds no `.sk-code/quality.json`, so `config.trust` read `{"checks":"none","reason":"no configured check is declared"}`. The run proves no configured check is refused here, and the hub-repository grant itself is proven by case 12 in `configured-checks.test.cjs`, not by this run.
- [x] T031 Validate this phase folder (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict | tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26, after the final-tree rows landed and `repair-derived.cjs --folder $P --apply` printed `inspected=1 repaired=1 failed=0`: the strict run printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
- [x] T032 Validate the whole packet (`$R`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $R --recursive --strict | tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26, in the same pass as T031: the recursive strict run printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`: T001 to T032 are ticked. One checklist item, CHK-FIX-007, stays open below, because the fix SHA it pins to exists only once the commit lands.
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `evidence/timing.json` holds five runs under 2000 ms on the reference machine, and the recursive validator printed `RESULT: PASSED`. Evidence 2026-10-26: the after runs read 723, 704, 725, 668 and 620 ms (see T015), and T032 printed `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with the reason and the command that showed it, and a P0 task stays blocking until it is unblocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The ten requirements are in `spec.md` section 4, one per accepted item: `rg -c '^\| REQ-0' $P/spec.md` prints `10`. Evidence 2026-10-26: the command printed `10`.
- [x] CHK-002 [P0] The lane order is in `plan.md` section 4, with A, B and C in sequence. Evidence 2026-10-26: `plan.md` lines 107 to 115 give A first on `quality-gate.cjs`, B after A, C after B, and G last.
- [x] CHK-003 [P1] The baselines in T001 and T002 are recorded before the first source edit. Amended 2026-10-26: "recorded before the first source edit" could not hold because no run was taken before the edits; a baseline reconstructed from the unedited HEAD tree `002c94662f` tests the same intent. Evidence 2026-10-26: see T001 (quality `# tests 100`, one environment failure in F22) and T002 (doctor `# tests 7` `# fail 0`, sk-code-skilled `# tests 29` `# fail 0`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node $Q/scripts/quality-gate.cjs --files $Q/scripts/quality-gate.cjs $D/sk-code-quality-config.cjs --format json` reads no P0 finding on the changed files. Evidence 2026-10-26, on the final tree: the command was run over all 12 changed code files, a superset of the two the Verify names (`.opencode/plugins/system-skill-advisor.js`, `$D/sk-code-quality-config.cjs`, `$D/tests/sk-code-quality-config.test.cjs`, and under `$Q/scripts/` `lib/parallel-node-check.cjs`, `lib/quality-config.cjs`, `lib/run-check.cjs`, `quality-gate.cjs`, `tests/configured-checks.test.cjs`, `tests/fixtures.cjs`, `tests/parallel-node-check.test.cjs`, `tests/quality-gate.test.cjs`, plus `$H/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs`). It exited 0 with gate `NO_BLOCKER_FOUND`, 0 findings and 0 P0.
- [x] CHK-011 [P0] `node --check` exits 0 for every changed `.cjs` file. Evidence 2026-10-26, on the final tree: the same 12-file run read `syntax-cjs` `RAN_CLEAN` over 11 files, `parallel-node-check.cjs` among them, and `syntax-node` `RAN_CLEAN` over the plugin.
- [x] CHK-012 [P1] A pool call that crashes reports its file and lets the others finish, as T014 asserts. Open 2026-10-26: no test asserts it. The pool tests cover a deadline that stops every child (`quality-gate.test.cjs` line 1928, all four files `TIMEOUT`), a SIGTERM to the helper (`parallel-node-check.test.cjs` line 93) and a long stderr (line 123). None makes one child crash while the others finish and checks that the crashed file is reported. Amended 2026-10-26: "as T014 asserts" could not hold because the crash case lives in the helper's own test file, not in T014's parity case; `node --test --test-reporter=tap $Q/scripts/tests/parallel-node-check.test.cjs` with the crash case passing tests the same intent. Evidence 2026-10-26: `unit: node pool helper: a child killed mid-list keeps one record per file and the rest still run` (`parallel-node-check.test.cjs` line 154, skipped on win32) kills the child for `crash.js` at index 3 of 7 with a limit of 2, and asserts one record per file in input order, `{status: null, timedOut: false, error: 'killed by SIGKILL'}` for the crashed file, statuses `[0, 0, 0, null, 1, 0, 0]` and the later faulty file's message. It printed `ok 26` within `# tests 26`, `# pass 26`, `# fail 0` (run with `configured-checks.test.cjs`). The runner's side is asserted too: `nodeCheckRecords` and `nodeCheckResult` are exported for tests, and `unit: node pool: a killed child reads ERROR and a short record list is refused` (`quality-gate.test.cjs`) maps that record to `ERROR`, a timed-out one to `TIMEOUT`, and refuses a short or malformed record list. The quality suite printed `# tests 123`, `# pass 123`, `# fail 0`.
- [x] CHK-013 [P1] No code comment names a packet path, phase number or REQ, ADR or task id: `bash $Q/scripts/check-comment-hygiene.sh` over the changed files prints nothing. Evidence 2026-10-26, on the final tree: the 12-file gate run, which runs the same hygiene script as its `comment-hygiene` check, read `comment-hygiene` `RAN_CLEAN` over all 12 files, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met`. Evidence 2026-10-26: `rg -c '\| Met \| - \|$' $P/acceptance-criteria.md` counts the sixteen rows AC-001 to AC-016, each `Met`, with no `Pending`, `Unmet`, `Waived` or `Superseded` row.
- [x] CHK-021 [P0] The quality, doctor and sk-code-skilled suites print `# fail 0`. Evidence 2026-10-26, on the final tree: quality `# tests 123`, `# pass 123`, `# fail 0`; the whole doctor suite (`.skilled/commands/doctor/scripts/tests/*.test.cjs`) `# tests 470`, `# pass 470`, `# fail 0`; sk-code-skilled `# tests 31`, `# pass 31`, `# fail 0`.
- [x] CHK-022 [P1] The edge cases in `spec.md` are covered: no `.js` file, a non-boolean grant, a fault on one applying file of many. Open 2026-10-26: the code handles all three, and no test covers two of them. No `.js` file: `runNodeCheck` returns before it starts the helper when its file list is empty, and no test asserts `syntax-node` reads `NOT_APPLICABLE` for a change with no `.js` file. Non-boolean grant: the read is `git config --local --bool skilled.trustRepoChecks` compared with `'true'` (line 722), so a value that is not a git boolean grants nothing, and no test sets one. One applying file of many: `resolveChecklists` errors when `scoped.some(...)` applies (line 1275), and the applying case at line 744 scopes one file, not several. Evidence 2026-10-26: three cases now cover them, each printing `ok`. No `.js` file: `unit: node pool: a change with no .js or .mjs file never starts the helper and reads NOT_APPLICABLE` (`quality-gate.test.cjs` line 1977, `ok 76`). Non-boolean grant: `trust: a skilled.trustRepoChecks value that is not a git boolean is no grant and the check never starts` (`configured-checks.test.cjs` line 205, `ok 7`), asserting `SKIPPED_UNTRUSTED`, the repair line and no canary file. One applying file of many: `outside skill fault: one scoped file the surface reaches among several it does not still gates` (`quality-gate.test.cjs` line 758, `ok 24`), asserting `ERROR`, exit 3 and empty warnings with one reaching file of four. The full quality suite printed `# tests 123`, `# pass 123`, `# fail 0`.
- [x] CHK-023 [P1] The parity test was seen to fail against a changed copy, as T017 records. Evidence 2026-10-26: see T017, `fail 2` with `Exit code 1`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each accepted item has a finding class: REQ-001 and REQ-002 `class-of-bug`, REQ-003 `algorithmic`, REQ-004 `cross-consumer`, REQ-005 `instance-only`, REQ-006 to REQ-009 `matrix/evidence`. Evidence 2026-10-26: this item records the class for each of the ten requirements, and `plan.md` carries the inventory each class needs: the producer and consumer inventories for the two class-of-bug items (lines 94 and 95), the algorithm invariant for REQ-003 (line 97), the parity test row for REQ-004 (line 89) and the mirror row for REQ-005 (line 90).
- [x] CHK-FIX-002 [P0] The same-class producer inventory in `plan.md` was run, and every raise site of the two outside-skill codes is scoped. Evidence 2026-10-26: `rg -n 'CHECKLIST_OUTSIDE_SKILL|CHECKLIST_ROW_INVALID' $Q/scripts` printed the code sites 208, 209 (repairs), 1111, 1112 (row builders) and 1205 (block faults), plus test lines. Every fault goes through `report` (line 1201), which pushes it to `faults` with the declaring `skillRoot`, and `resolveChecklists` sends each fault to `errors` only when a scoped file's `skillRoots` holds that root (lines 1273 to 1277), else to `warnings`. Hub rows raise neither code.
- [x] CHK-FIX-003 [P0] The consumer inventory for `config.warnings` and `trustRepoChecks` was run, and no reader fails on the added field. Evidence 2026-10-26: `rg -l 'trustRepoChecks' .skilled` listed the runner, the two references, the quality README, two changelogs, the three test files and the doctor test, and nothing under `.skilled/scripts/git-hooks`. `rg -l 'config\.errors' .skilled/skills/sk-code` listed only the runner, its references, its tests, one playbook scenario and an old changelog. The only code that reads `config.warnings` is the runner itself (merges at 2447 and 2494, text line 2565), so no reader parses a shape the new field breaks.
- [x] CHK-FIX-004 [P0] The trust gate has a case for each grant and for none of them. Evidence 2026-10-26: `configured-checks.test.cjs` cases 5 (none), 6 (local key), 8 (`--config`), 9 (`skcode.qualityConfig`) and 12 (hub repository) all print `ok` in the 23-test run, see T008.
- [x] CHK-FIX-005 [P1] The matrix axes in `plan.md` are listed with their row count before completion is claimed. Evidence 2026-10-26: `plan.md` section "Required inventories" now gives the row count, 11 rows over four axes tested one axis at a time, and the case that covers each row, with the two rows that rest on code reading named.
- [x] CHK-FIX-006 [P1] The trust cases run with a hostile environment: a global `skilled.trustRepoChecks` set to true grants nothing, because only the local key counts. Evidence 2026-10-26: case 10 `trust: the same key at global scope does not trust the committed config` and case 11 `trust: a value reached through an include in .git/config is not trusted` print `ok`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA, not a moving branch range. Open 2026-10-26: the evidence here is pinned to HEAD `002c94662f` plus the uncommitted working tree. The fix SHA does not exist until the commit lands, so it is filled after commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No configured command runs without a grant, as T008 asserts. Evidence 2026-10-26: case 5 runs a canary that would write a file, wraps the run in `assertSnapshotUnchanged` and prints `ok`, with status 4 and gate `UNVERIFIED`.
- [x] CHK-031 [P0] The doctor writes no git config, as T010 asserts. Evidence 2026-10-26: see T010, `# fail 0` with `status` wrapped in a snapshot that covers `.git/config`.
- [x] CHK-032 [P1] The repair line names the local key only, never a global one. Evidence 2026-10-26: `quality-gate.cjs` line 65 builds ``git config --local ${TRUST_KEY} true``, and the doctor test asserts the repair `git config --local skilled.trustRepoChecks true`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same key, state and file paths. Evidence 2026-10-26: `skilled.trustRepoChecks` counts 5, 1 and 4, `SKIPPED_UNTRUSTED` 8, 3 and 4, and `config.warnings` 7, 4 and 4 across the three, and no misspelled variant of the key or state matched. The one path that differs, the plugin, reads `.skilled/plugins/system-skill-advisor.js` in `spec.md` and `plan.md` and `.opencode/plugins/system-skill-advisor.js` in `tasks.md`, and `stat` shows both names on one inode (791533721), so it is one file.
- [x] CHK-041 [P1] `runner-contract.md` and `quality-config.md` state the trust rule in the same terms. Evidence 2026-10-26: `runner-contract.md` line 103 and `quality-config.md` line 148 each name the same four rules (`--config`, `skcode.qualityConfig` in the repository's own `.git/config` with no include, `git config --local --bool skilled.trustRepoChecks` printing `true`, a shared git common dir), the state `SKIPPED_UNTRUSTED`, the repair `git config --local skilled.trustRepoChecks true` and the unverified required check.
- [x] CHK-042 [P2] The sk-code README names the new hub changelog entry. Evidence 2026-10-26: `rg -n '3\.9\.0\.0' $H/README.md` printed line 202, the `changelog/v3.9.0.0.md` row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary copies for T017 live under `scratch/` only. Amended 2026-10-26: "under `scratch/` only" could not hold because the copies went to the session scratchpad outside the repository, as the conductor's command rules set; "temporary copies live outside tracked repository paths" tests the same intent. Evidence 2026-10-26: `git status --porcelain --untracked-files=all -- .skilled .opencode | rg 'declared-surfaces-parity|system-skill-advisor\.js'` printed two lines, the tracked plugin edit and the new parity test itself, and no copy.
- [x] CHK-051 [P1] `scratch/` holds no task output at completion. Evidence 2026-10-26: `ls -la $P/scratch` lists only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26, on the final tree. One P1 item is open: CHK-FIX-007, which pins the evidence to the fix SHA and is closed once the commit lands.
<!-- /ANCHOR:summary -->

---
