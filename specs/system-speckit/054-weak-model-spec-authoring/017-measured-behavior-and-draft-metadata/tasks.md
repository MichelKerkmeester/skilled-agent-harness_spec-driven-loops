---
title: "Tasks: Phase 17: measured-behavior-and-draft-metadata"
description: "Count the metadata rounds, take the census and suite baselines, add the Measured behavior block and its warning rule, add Draft-only derived-metadata auto-repair, update the docs, then build, test, rerun the census, sync Hermes, review and validate."
trigger_phrases:
  - "measured behavior and draft metadata tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 17: measured-behavior-and-draft-metadata

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/017-measured-behavior-and-draft-metadata`. `B` is `P/scratch/baseline`. `T` is `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch/tools`, and `L` is the shard-list folder `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch/baseline`. `O` is `S/runtime/dist/lib/validation/orchestrator.js`. `R6` is `PLACEHOLDER_FILLED,ANCHORS_VALID,SCAFFOLD_NEVER_TOUCHED,STATUS_CROSS_DOC_CONSISTENCY,GENERATED_METADATA_DRIFT,SPEC_DOC_SUFFICIENCY`, the rule set phase 013 censused. Every command runs from the repository root. The build and any test run never overlap.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 Count the validator rounds in the 24 author runs and record which failed only on derived-metadata rules (`P/scratch/metadata-rounds.md`). Verify: `python3 P/scratch/count-metadata-rounds.py specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/results 20261026T050500Z-67716 20261026T140632Z-79914 | tail -1` prints `TOTAL runs=24 rounds=122 failed=36 derived_only=33 content=0 unknown=3 final_passed=24 runs_with_derived_round=19`. Done during planning, output as stated.
- [x] T002 Confirm phases 015 and 016 are committed and record the stamp this phase takes, the next minor after the current one (`P/goal.md`). Verify: `rg -n 'SPECKIT_TEMPLATE_SOURCE: spec-core' S/templates/core/spec.md.tmpl` prints three lines with one version, and `rg -n 'Stamp taken' P/goal.md` prints the next one. Done as a recorded deviation: the template prints three lines at `v2.4`, and the goal.md `Stamp taken` row reads Done at v2.4 for the spec, plan, tasks, implementation-summary and acceptance-criteria templates. Phases 015, 016 and 017 were built in parallel in one uncommitted tree and are committed together after this closeout, so 015 and 016 could not be committed first; the stamp was set once for all five templates.
- [x] T003 Build the runtime so the census reads the current orchestrator (`S/runtime/dist/`). Verify: `npm --prefix S/runtime run build` exits 0. Done as a recorded deviation: no separate build was logged before the census, but the census ran on a build `validate.sh` accepted as fresh (it exits 3 on a stale compiled orchestrator, and it did not); the final-tree build is T019.
- [x] T004 [P] Take the strict census baseline and merge it (`B2/census-before.tsv`, where `B2` is `specs/system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim/scratch/baseline`). Verify: `wc -l < B2/census-before.tsv` prints 4757. Done: prints 4757. The conductor ran one census for phases 016 and 017 together over `B2/census-list.txt` (every folder except 054 phases 015 to 018, four shards `B2/list-0` to `B2/list-3`), not over the three 010 shard lists of 4719 folders.
- [x] T005 [P] Take the six-rule census baseline (`B2/rules-before.tsv`). Verify: `wc -l < B2/rules-before.tsv` prints 4757. Done: prints 4757, from the same shared census as T004.
- [x] T006 Record the tree state the census must not change, and the suite baseline after T004 and T005 finish (`B/specs-status-before.txt`, `B/suite-before.txt`). Verify: `git status --porcelain specs/ | rg -v '017-measured-behavior' > B/specs-status-before.txt` exits 0, and `npm --prefix S/runtime test > B/suite-before.txt 2>&1; tail -5 B/suite-before.txt` prints the pass and fail totals, copied into `P/goal.md` section 4. Done as a recorded deviation: no before-snapshot of either kind was taken. The tree-status half is settled retroactively by T025. For the suite, the nearest baseline is phase 013's whole CLI run, `../013-addon-removal-and-speed-refinements/scratch/baseline/cli-after.txt`, the tree right before phases 015 to 017 (014 changed docs and one test comment): `Test Files 2 failed | 186 passed | 3 skipped (191)`, failures `recursive-child-manifest` and `repo-era`. No pre-phase runtime-project baseline exists; the after run has no failure at all, so it lists none a baseline could lack.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T007 Add the `measured-behavior` anchor with `### Measured Behavior`, a fill note and an empty command-and-output fence right after the line that closes the `problem` anchor, and bump the three spec-core stamps to the T002 version (`S/templates/core/spec.md.tmpl`). Verify: `rg -c 'ANCHOR:measured-behavior' S/templates/core/spec.md.tmpl` prints 2, and `rg -n '^## .*[Mm]easured' S/templates/core/spec.md.tmpl` prints nothing. Done: prints 2; the H2 `rg` printed nothing; the anchor opens at line 109, after `/ANCHOR:problem` at 107; the stamps on lines 36, 39 and 43 read `v2.4`.
- [x] T008 Add a filled block to one example per level (`S/templates/examples/level-*/spec.md`). Verify: `bash S/runtime/cli/spec/check-example-drift.sh` exits 0. Done: `EXAMPLE_DRIFT_OK`, exit 0. Every example measures a `404` for the missing login route.
- [x] T009 Write the warning rule: not applicable below the T002 stamp; warn on a missing anchor, or on a block with no non-empty fenced output line and no `N/A:` line with a reason; never error (`S/runtime/cli/rules/check-measured-behavior.sh`). Verify: `bash -n S/runtime/cli/rules/check-measured-behavior.sh` exits 0. Done: exits 0; minimum stamp v2.4, applies only to a `spec-core` stamp, shell rule only (the registry bridge runs it, no TypeScript twin).
- [x] T010 Register `MEASURED_BEHAVIOR` with severity `warn` and category `authored_template` (`S/runtime/cli/lib/validator-registry.json`). Verify: `node -e "const r=require('./S/runtime/cli/lib/validator-registry.json');console.log(r.length, r.find(x=>x.rule_id==='MEASURED_BEHAVIOR').severity)"` prints `42 warn`. Done: prints `42 warn`.
- [x] T011 Write the rule test for missing, empty fence, filled fence, `N/A:` with reason, a v2.3 stamp and no `error` status (`S/runtime/cli/tests/measured-behavior-rule.vitest.ts`). Verify: `cd S && npx vitest run --config vitest.config.ts --project cli tests/measured-behavior-rule.vitest.ts` prints every test passed. Done: `Tests 7 passed (7)`, exit 0. The earlier form `cd S/runtime && npx vitest run cli/tests/...` finds no file, because `runtime/vitest.config.ts` excludes `runtime/cli/**`.
- [x] T012 Add the Draft auto-repair to the CLI entry only: failed report, `specStatusIsDraft`, every error in `DERIVABLE` less `SPEC_DOC_INTEGRITY`, switch on and `CI` unset; spawn `repair-derived.cjs --folder <packet> --apply` from the repository root with `SPECKIT_DRAFT_AUTO_REPAIR=0`, print its rewrites (stderr in `--json` and `--quiet`), revalidate once (`S/runtime/lib/validation/orchestrator.ts`). Verify: `rg -n 'SPECKIT_DRAFT_AUTO_REPAIR' S/runtime/lib/validation/orchestrator.ts` prints at least one line, and `rg -n 'repair-derived' S/runtime/lib/validation/orchestrator.ts` shows no call inside `validateFolder`. Done: the switch prints at line 1517; `repair-derived` appears only at 1495, 1519 and 1643, all after `validateFolder` ends, and the call sits in the CLI entry at 1676. `tsc --noEmit` on the runtime passes.
- [x] T013 Write the auto-repair test: a Draft packet with only stale `graph-metadata.json` passes in one run and names the file; switch off, `CI=1`, Status In Progress, a mixed content error and a direct `validateFolder` call each leave the packet's file hashes unchanged; the repair runs once; `--json` stdout parses (`S/runtime/cli/tests/draft-auto-repair.vitest.ts`). Verify: `cd S && npx vitest run --config vitest.config.ts --project cli tests/draft-auto-repair.vitest.ts` prints every test passed. Done: `Tests 15 passed (15)`, exit 0. Beyond the listed cases it covers the `false` and `off` switch values, a narrowed rule set, a run without `--strict`, a failing repair child, a `--recursive` parent and a `repair-derived.cjs` dry run that leaves the packet unchanged.
- [x] T014 List the rule and the switch in the help text (`S/runtime/cli/spec/validate.sh`). Verify: `bash S/runtime/cli/spec/validate.sh --help | rg -c 'MEASURED_BEHAVIOR|SPECKIT_DRAFT_AUTO_REPAIR'` prints 2. Done: prints 2; the rule line comes from the registry printer, the switch is in ENVIRONMENT.
- [x] T015 Say in card section 9 that a Draft run repairs derived metadata itself and prints what it rewrote, and in section 5 that every number about current behavior quotes the Measured Behavior block (`S/references/workflows/spec-authoring-card.md`). Verify: `bash S/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`. Done: `CARD SYNC OK`, exit 0; the card states the block rule at line 82 and the repair at line 147.
- [x] T016 Describe the rule, the auto-repair and the switch (`S/SKILL.md`, `S/references/validation/validation-rules.md`, `S/runtime/ENV-REFERENCE.md`). Verify: `rg -l 'SPECKIT_DRAFT_AUTO_REPAIR' S/SKILL.md S/references/validation/validation-rules.md S/runtime/ENV-REFERENCE.md` prints three paths. Done: prints the three paths.
- [x] T017 Change every "41-rule registry" to "42-rule registry" (`S/README.md`, `S/runtime/cli/README.md`, `S/SKILL.md`). Verify: `rg -n '41-rule registry' S` prints nothing. Done: prints nothing, exit 1; `S/README.md` holds five `42-rule registry` lines.
- [x] T018 Sync the Hermes copies of the edited skill docs (`.hermes/skills/`). Verify: `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67 Hermes skill copies in sync`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T019 Rebuild the runtime, alone (`S/runtime/dist/`). Verify: `npm --prefix S/runtime run build` exits 0. Done: the conductor ran it on the final tree and it succeeded. Not rerun at closeout; there `dist/lib/validation/orchestrator.js` is newer than every runtime source `.ts`, and `validate.sh` did not exit 3, its stale-build code.
- [x] T020 Run the targeted tests after the build finishes (`S/runtime/cli/tests/`). Verify: `for t in measured-behavior-rule draft-auto-repair repair-derived placeholder-token-gate template-structure example-drift validator-registry-doc-count validate-help-lists-every-rule; do (cd S && npx vitest run --config vitest.config.ts --project cli tests/$t.vitest.ts); done` prints every test passed. Done: one file at a time, every run exit 0: 7, 15, 36, 48, 8, 6, 1 and 2 passed.
- [x] T021 Run the full suite and compare with the baseline (`B/suite-after.txt`). Verify: `npm --prefix S/runtime test > B/suite-after.txt 2>&1; tail -5 B/suite-after.txt` prints no failure that `B/suite-before.txt` does not list. Done: both projects ran on the final tree, saved as `B/suite-after-runtime.txt` and `B/suite-after-cli.txt`. Runtime (`npx vitest run` in `S/runtime`): `Test Files 279 passed | 3 skipped (282)`, `Tests 4184 passed | 21 skipped (4205)`, `vitest_exit=0`. CLI (`npx vitest run --config vitest.config.ts --project cli` in `S`): `Test Files 1 failed | 189 passed | 3 skipped (193)`, `Tests 1 failed | 2202 passed | 20 skipped (2223)`; the one failure is `recursive-child-manifest` > "checks manifest membership against git and fails closed without git", whose fixture script runs a bare `git ls-files` that hung on fsmonitor for 853 s until the conductor ended that git process. That test also fails in the T006 baseline, so no failure is new; `repo-era` now passes, with two more test files and 23 more passing tests.
- [x] T022 Rerun the strict census and compare (`B/census-after.tsv`). Verify: `diff <(sort B2/census-before.tsv) <(sort B2/census-after.tsv)` prints nothing. Done: prints nothing, exit 0; 4562 PASS and 195 FAIL on both sides.
- [x] T023 Rerun the six-rule census and compare (`B2/rules-after.tsv`). Verify: `diff <(sort B2/rules-before.tsv) <(sort B2/rules-after.tsv)` prints nothing. Done: prints nothing, exit 0.
- [x] T024 Census the new rule over the shard lists (`B2/measured-after.tsv`). Verify: `rg -c '=warn|=error' B2/measured-after.tsv` prints nothing. Done: prints nothing, exit 1; all 4757 rows read `MEASURED_BEHAVIOR=pass`.
- [x] T025 Confirm the census wrote nothing (`B/specs-status-after.txt`). Verify: `git status --porcelain specs/ | rg -v '017-measured-behavior' > B/specs-status-after.txt; diff B/specs-status-before.txt B/specs-status-after.txt` prints nothing. Done retroactively, as a recorded deviation (no before-snapshot was taken): `git status --porcelain specs/` outside `specs/system-speckit/054-weak-model-spec-authoring/` prints 0 lines. Inside 054 the only changed docs outside phases 015 to 018 and the changelog are the parent `spec.md`, `goal.md`, `graph-metadata.json` and 014's `spec.md` successor row, all conductor edits, plus the speed-loop files; the untracked 001 to 004 scratch folders predate this session. The census tools call `validateFolder` in-process and the Draft auto-repair lives only in the CLI entry (CHK-011), so the census path cannot repair.
- [x] T026 Have a fresh Opus medium agent review the phase diff, with the write-path risk named in its brief (`P/scratch/review.md`). Verify: `rg -n '^Blockers: none' P/scratch/review.md` prints at least one line. Done: prints lines 82 (first review) and 100 (re-review). Findings F1 to F6 were fixed afterwards.
- [x] T027 Validate this folder (`P`). Verify: `bash S/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`. Done: after `repair-derived.cjs --folder P --apply`, prints `Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: `scratch/metadata-rounds.md`, `../015-template-example-neutralization/scratch/insight-review.md`
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

A blocked task is marked `[B]` with its reason, and the phase stays In Progress.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The metadata-round count exists before any code edit: `scratch/metadata-rounds.md` reads 33 derived-only of 36 failed rounds, 0 content.
- [x] CHK-002 [P0] Both census baselines and the suite baseline exist before any code edit: `ls B` lists `census-before.tsv`, `rules-before.tsv` and `suite-before.txt`. Done as a recorded deviation: both census baselines exist in `B2` (T004, T005); no suite baseline was taken before the edits, and phase 013's whole CLI run stands in for it (T006).
- [x] CHK-003 [P1] Phases 015 and 016 are committed before T007, and the stamp is recorded in `goal.md` section 4. Done as a recorded deviation: the three phases were built in parallel in one uncommitted tree and are committed together after this closeout, so 015 and 016 were not committed before T007; the `Stamp taken` row reads Done at v2.4 (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `bash -n S/runtime/cli/rules/check-measured-behavior.sh` exits 0 and `npm --prefix S/runtime run build` exits 0. Done: `bash -n` exits 0; build as in T019.
- [x] CHK-011 [P0] `validateFolder` holds no write path: `rg -n 'repair-derived|writeFileSync' S/runtime/lib/validation/orchestrator.ts` shows the spawn only in the CLI entry. Done: no `writeFileSync`; `repair-derived` appears at 1495 (hint text) and 1519 (path constant), and the spawn at 1641 sits in `runDraftAutoRepair`, which only the CLI entry at 1687 calls; `validateFolder` starts at 1320.
- [x] CHK-012 [P1] No code comment names a phase, packet or task id: `rg -n '017|054|T0[0-9][0-9]' S/runtime/cli/rules/check-measured-behavior.sh` prints nothing. Done: prints nothing, exit 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Done: AC-001 to AC-009 read Met, and the closure statement reads Closeable: Yes.
- [x] CHK-021 [P0] Both new test files pass, and the full suite has no failure the baseline lacks. Done: both files pass (7 and 15); the full runtime suite has no failure, and the full CLI suite's one failure (`recursive-child-manifest`) is in the phase 013 baseline too (T021).
- [x] CHK-022 [P0] The strict and six-rule census diffs print nothing, and the new-rule census holds no `warn` or `error`. Done: T022 to T024.
- [x] CHK-023 [P1] The review in `scratch/review.md` reports no blocker. Done: `Blockers: none` at line 82.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each change names its class: the wrong-shape statements are `class-of-bug` across authors, closed by the template block; the metadata rounds are `class-of-bug` across runs, closed by the auto-repair. Done: as stated in spec.md section 2 and `scratch/metadata-rounds.md`.
- [x] CHK-FIX-002 [P0] Same-class inventory: every rule `repair-derived.cjs` can settle is either in the auto-repair set or excluded with a reason (`SPEC_DOC_INTEGRITY`, repaired only in part). Done: `DRAFT_AUTO_REPAIR_RULES` in `orchestrator.ts` holds the five `DERIVABLE` rules from `repair-derived.cjs` less `SPEC_DOC_INTEGRITY`, and its comment gives that reason.
- [x] CHK-FIX-003 [P0] Consumer inventory: every importer of `validateFolder` is listed and shown read-only: `rg -ln 'validateFolder' S/runtime specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch/tools` is covered by the review. Done: the `rg` lists the two census tools, `api/index.ts`, `folder-detector.ts`, `spec-folder/index.ts`, `alignment-validator.ts`, three tests and three READMEs; all are read-only because `validateFolder` itself writes nothing (CHK-011, and the library case in `draft-auto-repair.vitest.ts`). The review adds the shell callers, which F2 fixed.
- [x] CHK-FIX-004 [P0] The write path has adversarial tests: switch off, `CI` set, non-Draft, mixed errors, library call and recursion each leave the packet unchanged or repair once. Done: every one is a passing case in `draft-auto-repair.vitest.ts` (T013).
- [x] CHK-FIX-005 [P1] Matrix axes are listed in `draft-auto-repair.vitest.ts`: status (Draft, In Progress), error set (derived only, mixed), switch (on, off), `CI` (unset, set), caller (CLI, library), output mode (text, `--json`, `--quiet`). Done: each axis value has its own named case; they are listed by case name, not in a separate comment.
- [x] CHK-FIX-006 [P1] The tests set and restore `SPECKIT_DRAFT_AUTO_REPAIR` and `CI` per case, so a value in the runner's environment cannot change a result. Done: `cleanEnv()` deletes both from a copy of the environment for every spawn, and each case passes its own overrides; the test never changes `process.env`.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA in `implementation-summary.md`. Open: the work is not committed yet, so there is no SHA; the conductor pins the SHA after the commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] The auto-repair writes only inside the validated packet: the test hashes the parent folder before and after a repair. Done: `draft-auto-repair.vitest.ts` case "judges each child of a --recursive parent on its own status" reads every top-level file of the phase parent before the Draft child's repair and asserts each one is unchanged afterwards, and the base repair case finds only `graph-metadata.json` changed inside the packet.
- [x] CHK-031 [P0] The spawn passes the folder as one argument, never through a shell, so a path with spaces or `|` cannot run a command. Done: `spawnSync(process.execPath, [script, '--folder', folder, '--apply'], ...)` at `orchestrator.ts:1641` passes an argument array and sets no `shell` option.
- [x] CHK-032 [P1] N/A: no credential or auth surface; the dispatch briefs carry no secret.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `goal.md` name the same switch, `SPECKIT_DRAFT_AUTO_REPAIR`, and the same anchor, `measured-behavior`. Done: `rg -c` finds the switch in all three (3, 2, 1) and the anchor in all three (7, 7, 6).
- [x] CHK-041 [P1] `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`, and `bash S/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`. Done: `PASS: 67` and `CARD SYNC OK`.
- [x] CHK-042 [P2] `rg -n '41-rule registry' S` prints nothing. Done: T017.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Baselines, briefs and the review live under `P/scratch/` only. Done as a recorded deviation: briefs, runs, the review and the suite outputs are in `P/scratch/`; the census baselines live in phase 016's `scratch/baseline/`, shared by both phases, because one census served both.
- [x] CHK-051 [P1] Test fixtures are made in a temp directory and removed by the tests. Done: both new test files build fixtures under `mkdtemp` and remove them with `rmSync` after the run.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 10/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26. No P0 is open. Open P1: CHK-FIX-007, which the conductor closes by pinning the commit SHA after the commit.
<!-- /ANCHOR:summary -->

---
