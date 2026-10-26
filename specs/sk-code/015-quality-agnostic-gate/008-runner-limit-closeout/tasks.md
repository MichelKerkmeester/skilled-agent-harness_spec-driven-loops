---
title: "Tasks: Runner limit closeout"
description: "Ordered tasks for the runner closeout: the baselines, one task per change for the six requirements, the release work and the packet gates."
trigger_phrases:
  - "runner limit closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Runner limit closeout

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
- `K=.skilled/skills/system-spec-kit`
- `P=specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout`
- `T=$Q/scripts/tests/quality-gate.test.cjs`

The phase headings below group the tasks. They are not the seven design steps of `plan.md`. This packet is design Phase 8 only. Comments in every changed code block state the durable reason only. No packet path, step number, REQ, ADR or task id appears in a code comment.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm that `002-builtin-runner` and `003-config-and-doctor` landed, so the functions this phase edits exist at the branch head (`$Q/scripts`). Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs && rg -n 'function takeSnapshot|function withGuard' $Q/scripts/lib/run-check.cjs` prints three lines, one for `probePreCommit`, one for `takeSnapshot` and `withGuard`.
- [ ] T002 [P] Record the baseline of the `node:test` suite and the four quality shell suites, before the first source edit (`$T`, `$Q/scripts/check-comment-hygiene.test.sh`, `$Q/scripts/ceiling-report.test.sh`, `$Q/scripts/typo-flags.test.sh`, `$Q/scripts/hooks/claude-posttooluse.test.sh`). Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# (tests|fail)'` prints `# tests 27` and `# fail 0` at this tree, and `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo quality-suites-green` prints `quality-suites-green`.
- [ ] T003 Record the baseline of the dist freshness suite before any edit to the library, because one case is already red at this tree (`$K/runtime/cli/tests/test-dist-freshness.sh`). Verify: `bash $K/runtime/cli/tests/test-dist-freshness.sh 2>&1 | rg '^Totals'` prints `Totals: 1 passed, 1 failed`, and the one failure is `[FAIL] validate.sh stale-dist backstop`. Record both lines, so a library change is judged against this baseline rather than against zero failures.
- [ ] T004 Record the timing baseline for REQ-003 over five runs with the command `plan.md` section 4 step 3 names, before the first source edit (`$Q/scripts/quality-gate.cjs`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines. On 2026-10-26 this tree printed `real 2.89`, `real 5.29`, `real 3.61`, `real 3.27` and `real 2.92` with the machine under load, against the `2.01` to `2.28` the plan records at `f69e5cd2e8`, so record `git rev-parse --short HEAD` and the load beside the five lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Resolve the checker a hook names against the repository that owns the hook and the source roots under it, and report `broken` unless one candidate is a regular file with the execute bit (REQ-001) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/lib/run-check.cjs --format json | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).layers.pre_commit_hygiene"` prints `present`, so this repository's own hook still reads as installed.
- [ ] T006 Add the three probe cases: a present checker, a missing checker and a checker without the execute bit (REQ-001) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# pass 1` and `# fail 0`.
- [ ] T007 Define `broken` as installed but not runnable, name the resolution rule and the repair line it carries (REQ-001) (`$Q/references/runner-contract.md`). Verify: `rg -c 'installed but not runnable' $Q/references/runner-contract.md` prints `1`.
- [ ] T008 Add the read-only option to `checkPackageFreshness` and `checkAllFreshness`, skipping the cache record write and keeping the verdict, with the writable default unchanged (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: dist read-only' $T` prints `# fail 0`.
- [ ] T009 Add the `--no-write` flag to the library CLI, so a shell caller can ask for the same mode (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `rg -n 'no-write' $K/runtime/cli/lib/dist-freshness.cjs` prints one line.
- [ ] T010 Pass the read-only switch on the per-file `check-file` call when the environment asks for it, leaving `--all` and the session-start path on the writable default (REQ-002) (`$Q/scripts/check-dist-staleness.sh`). Verify: `rg -n 'SPECKIT_DIST_READ_ONLY' $Q/scripts/check-dist-staleness.sh` prints one line.
- [ ] T011 Set `SPECKIT_DIST_READ_ONLY=1` in `runDistAdapter` beside `SPECKIT_DIST_AUTO_REBUILD=0` (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `rg -c 'SPECKIT_DIST_READ_ONLY' $Q/scripts/quality-gate.cjs` prints `1`.
- [ ] T012 Declare the eight `generated` rows this repository holds, and keep the `mcp-code-mode` entry out because its build is absent (REQ-002) (`$Q/assets/quality-defaults.json`). Verify: `node -p "require('./$Q/assets/quality-defaults.json').generated.length"` prints `8`.
- [ ] T013 Read a path that matches a declared `generated` row as a generated file rather than as excluded, so it reaches the dist adapter and no other check (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F20' $T` prints `# pass 1` and `# fail 0`.
- [ ] T014 Record the modification time in `describeEntry` and take the dist folders as extra roots in `assertSnapshotUnchanged`, so a rewrite that reproduces the bytes still fails (REQ-002) (`$Q/scripts/tests/fixtures.cjs`). Verify: `rg -c 'mtimeMs' $Q/scripts/tests/fixtures.cjs` prints a count of 2 or more.
- [ ] T015 Add fixture F20 and the `unit: dist read-only` case (REQ-002) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist read-only' $T` prints `# pass 2` and `# fail 0`.
- [ ] T016 State the read-only dist path and the declared generated rows in the adapter section (REQ-002) (`$Q/references/runner-contract.md`). Verify: `rg -c 'read-only' $Q/references/runner-contract.md` prints a count of 1 or more.
- [ ] T017 Read the workspace listing once per run and hand it to `collectScope` and to both snapshots (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: guard snapshot source' $T` prints `# fail 0`.
- [ ] T018 Bound the untracked listing to the folders the scope reaches, and take no untracked listing at all for `--files` (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: scope listing' $T` prints `# fail 0`.
- [ ] T019 Reuse the scope listing in `takeSnapshot`, hashing only the entries the snapshot adds (REQ-003) (`$Q/scripts/lib/run-check.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: guard snapshot source' $T` prints `# fail 0`.
- [ ] T020 Add the `unit: scope listing` and `unit: guard snapshot source` cases, which assert one listing per run and no listing for `--files` (REQ-003) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: scope listing|^unit: guard snapshot source' $T` prints `# pass 2` and `# fail 0`.
- [ ] T021 Record the after numbers with the same five-run command and state the listing count in the contract (REQ-003) (`$Q/references/runner-contract.md`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, each under `2.00`.
- [ ] T022 Keep the write case, where a stand-in check writes an untracked file inside the scope and the run still ends with exit 3, so the set of paths a snapshot hashes never shrinks (REQ-003) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: argv spawn and guard' $T` prints `# fail 0`.
- [ ] T023 Measure the ignored listing at both bounds and keep both numbers (REQ-004) (`$Q/scripts/lib/run-check.cjs`). Verify: `git ls-files --others --ignored --exclude-standard | wc -l` prints `91555`, and `git ls-files --others --ignored --exclude-standard -- $K/runtime/cli/dist | wc -l` prints `447`, the two numbers the ADR weighs against its 50 ms budget.
- [ ] T024 Write the guard boundary ADR with both measured numbers and the decision rule: add the bounded watch when its cost stays under 50 ms and it hashes only folders the scope reads, otherwise the target-repository boundary stands (REQ-004) (`$P/decision-record.md`). Verify: `rg -n '^## ADR-001' $P/decision-record.md` prints one line, and `rg -c '91555|447' $P/decision-record.md` prints `2`.
- [ ] T025 State the resulting boundary in the contract, which sees the tracked diff, the untracked files inside the scope, and either the ignored paths inside the scope or the reason they stay outside (REQ-004) (`$Q/references/runner-contract.md`). Verify: `rg -n 'ignored' $Q/references/runner-contract.md` prints the boundary sentence.
- [ ] T026 Add the guard boundary cases, including a write outside the scope that the stated boundary places outside the watch (REQ-004) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: argv spawn and guard' $T` prints `# fail 0`.
- [ ] T027 Correct Known Limitations items 1, 3, 4 and 5 to say what closed each of them (REQ-005) (`specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md`). Verify: `rg -c 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `4`.
- [ ] T028 Point Known Limitations item 8 at phase 005 and move the continuity block, changing nothing else in that file (REQ-005) (`specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md`). Verify: `rg -c 'phase 005' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `1`.
- [ ] T029 Give the spec-folder checklist row the repository condition and leave the three `.js` and `.css` rows matching by path alone (REQ-006) (`$Q/assets/quality-defaults.json`). Verify: `node -p "require('./$Q/assets/quality-defaults.json').checklists.filter((row) => row.hubRepo).length"` prints `1`, and `node -p "require('./$Q/assets/quality-defaults.json').checklists.filter((row) => (row.extensions || []).length && !row.hubRepo).length"` prints `3`.
- [ ] T030 Match a base-layer row's repository condition against the file's repository and the repository that owns the declaration hub, so `resolveChecklists` lists the row only for this repository's own tree (REQ-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F21' $T` prints `# pass 1` and `# fail 0`.
- [ ] T031 Name the repository condition in the Target-Path Checklist Map row and in the paragraph above the map (REQ-006) (`$Q/SKILL.md`). Verify: `rg -c 'the repository that owns the hub' $Q/SKILL.md` prints `1`.
- [ ] T032 State the repository condition in the contract's checklist-row selection sentence, where the `paths`, `extensions` and `contentMarkers` selectors are named (REQ-006) (`$Q/references/runner-contract.md`). Verify: `rg -c 'the repository that owns the hub' $Q/references/runner-contract.md` prints `1`.
- [ ] T033 Add fixture F21, a foreign repository with a `specs/` folder that lists no spec-folder checklist, and fixture F22, which reads this repository's own spec files and still lists it (REQ-006) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F21|^F22' $T` prints `# pass 2` and `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T034 Run the whole quality suite, so no case from phases 002, 003 and 005 regressed (REQ-001 to REQ-006) (`$T`). Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# fail'` prints `# fail 0`.
- [ ] T035 Run the five-run timing command on the changed tree and read the five lines (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, each under `2.00`.
- [ ] T036 Run the four quality shell suites again after the change (REQ-002) (`$Q/scripts`). Verify: `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo quality-suites-green` prints `quality-suites-green`.
- [ ] T037 Run the comment hygiene check on every code file this phase changed (REQ-006) (`$Q/scripts/quality-gate.cjs`, `$Q/scripts/lib/run-check.cjs`, `$Q/scripts/tests/fixtures.cjs`, `$T`, `$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T $K/runtime/cli/lib/dist-freshness.cjs && echo clean` prints `clean`.
- [ ] T038 Confirm that no code comment in a changed file names a packet path, a phase number, a REQ, an ADR or a task id (REQ-006) (`$Q/scripts`, `$Q/assets/quality-defaults.json`, `$Q/references/runner-contract.md`). Verify: `rg -n 'REQ-[0-9]|ADR-[0-9]|T[0-9]{3}|015-quality|008-runner' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T` prints nothing.
- [ ] T039 Bump `$Q/SKILL.md` to the version this phase lands with and write its changelog entry (REQ-001, REQ-006) (`$Q/SKILL.md`, `$Q/changelog/`). Verify: `rg -n '^version: ' $Q/SKILL.md` prints one line, and `ls $Q/changelog | tail -1` prints the changelog file whose number matches it.
- [ ] T040 Bump the hub version in the three hub-root JSON files and in the hub `SKILL.md`, and write the hub changelog entry (All) (`$H/SKILL.md`, `$H/description.json`, `$H/mode-registry.json`, `$H/hub-router.json`, `$H/changelog/`). Verify: `node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints one version three times, and `rg -n '^version: ' $H/SKILL.md` prints the same number.
- [ ] T041 Bump `$K/SKILL.md` and write the `system-spec-kit` changelog entry for the freshness library change (REQ-002) (`$K/SKILL.md`, `$K/changelog/`). Verify: `rg -n '^version: ' $K/SKILL.md` prints one line, and `ls $K/changelog | tail -1` prints the changelog file whose number matches it.
- [ ] T042 Update the newest-entry row and the document version in the hub README (All) (`$H/README.md`). Verify: `rg -c 'changelog/v' $H/README.md` prints a count of 1 or more, and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $H/README.md --type readme | tail -3` prints `Total issues: 0`.
- [ ] T043 Regenerate the three Hermes copies of the edited `SKILL.md` files with their generator, never by hand (All) (`.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` regenerates the copies, then `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync` and exits 0.
- [ ] T044 Regenerate the leaf manifest if this phase added or removed a skill resource (All) (`$H/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $H` prints `leaf-manifest.json OK` and exits 0.
- [ ] T045 Fill the parent phase map row and regenerate the derived metadata for the parent and this phase (All) (`specs/sk-code/015-quality-agnostic-gate/spec.md`, both `graph-metadata.json` files). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/015-quality-agnostic-gate --folder $P --apply` writes the drift, and `rg -n '008-runner-limit-closeout' specs/sk-code/015-quality-agnostic-gate/spec.md` prints the phase map row.
- [ ] T046 Write the packet changelog with the nested changelog generator at the phase folder (All) (`specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-008-runner-limit-closeout.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js $P --write` exits 0, and `ls specs/sk-code/015-quality-agnostic-gate/changelog/` lists `changelog-015-008-runner-limit-closeout.md`.
- [ ] T047 Validate the packet with the strict validator and read the final line (All) (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict | tail -1` prints `RESULT: PASSED`.
- [ ] T048 Remove every probe and log this phase wrote and confirm that `scratch/` holds only its placeholder (All) (`$P/scratch/`). Verify: `ls -A $P/scratch` prints `.gitkeep`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The six requirements pass on the branch head, each with its evidence in `acceptance-criteria.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`. Its requirements REQ-001 to REQ-006 are the list this file implements.
- **Plan**: See `plan.md`. Its seven steps group the tasks above, step 0 to step 6.
- **Decisions**: See `decision-record.md`. Its ADR settles the guard boundary with the measurement T023 takes.
- **Acceptance**: See `acceptance-criteria.md`. Each AC row names the command that proves it and the task that runs it.
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

- [ ] CHK-001 [P0] `002-builtin-runner` and `003-config-and-doctor` landed. T001 prints three lines. Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs && rg -n 'function takeSnapshot|function withGuard' $Q/scripts/lib/run-check.cjs` prints three lines.
- [ ] CHK-002 [P0] The requirement list is frozen at six in `spec.md`. Verify: `grep -cE '^\| REQ-' $P/spec.md` prints `6`.
- [ ] CHK-003 [P1] Every citation `plan.md` section 8 repeats was re-read at the landed tree, because phase 003 moves two of those files. Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs` prints one line, and `rg -n 'generated' $Q/assets/quality-defaults.json` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every code file this phase changed passes the comment hygiene checker. T037 prints `clean`. Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T $K/runtime/cli/lib/dist-freshness.cjs && echo clean` prints `clean`.
- [ ] CHK-011 [P0] No changed code block carries a packet path, a step number, a REQ, an ADR or a task id in a comment. T038 prints nothing. Verify: `rg -n 'REQ-[0-9]|ADR-[0-9]|T[0-9]{3}|015-quality|008-runner' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T` prints nothing.
- [ ] CHK-012 [P1] The two changed modules keep their export lists, so no caller breaks. Verify: `node -p "Object.keys(require('./$Q/scripts/lib/run-check.cjs')).join(',')"` prints `findTool,runGit,spawnArgv,withGuard`, and `node -p "Object.keys(require('./$Q/scripts/quality-gate.cjs')).join(',')"` prints `decideGate,runDistAdapter`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every requirement has a criterion in `acceptance-criteria.md`. Verify: `rg -c '^\| AC-[0-9]' $P/acceptance-criteria.md` prints `15`.
- [ ] CHK-021 [P0] The whole quality suite prints `# fail 0`. T034 prints `# fail 0`. Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# fail'` prints `# fail 0`.
- [ ] CHK-022 [P1] Every L2 edge case in `spec.md` has one fixture or one unit case. Verify: `rg -c '^test\(' $T` prints a count of 30 or more.
- [ ] CHK-023 [P1] The python-absent path and the mutation path still behave as they did. T022 prints `# fail 0` for the write case, and F17 keeps `SKIPPED_ABSENT`. Verify: `node --test --test-reporter=tap --test-name-pattern='^F17|^unit: argv spawn and guard' $T` prints `# fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each change names one finding class: `path-resolution`, `write-path`, `cost`, `boundary` or `surface-scope`. Verify: `rg -c 'REQ-00[1-6]' $P/plan.md` prints a count of 6 or more, one per class above.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, so no second untracked walk stays behind. Verify: `rg -n 'ls-files|status --porcelain' $Q/scripts --glob '*.cjs'` prints three lines or fewer, and every one is bounded to the scope it was given.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the freshness library and the dist adapter. Verify: `rg -ln 'check-file|dist-freshness' $Q $K/runtime/cli` prints two files or more, the checker, the library and their suites.
- [ ] CHK-FIX-004 [P0] The path work carries adversarial cases: a missing checker, a directory, a checker without the execute bit and a hook that names the checker through a shell variable. Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# fail 0`.
- [ ] CHK-FIX-005 [P1] The matrix axes are listed in `plan.md` FIX ADDENDUM before completion is claimed, the repository axis included. Verify: `rg -c 'repository \(this one, a foreign one\)' $P/plan.md` prints `1`.
- [ ] CHK-FIX-006 [P1] No case mutates this process's environment or global state, so every variable is handed to the child it starts. Verify: `rg -n 'process\.env\.[A-Z_]+ =|delete process\.env' $T $Q/scripts/tests/fixtures.cjs` prints nothing.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the commit that carries this file, not to a moving branch range. Verify: `git rev-parse --short HEAD` prints the commit the evidence names.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. The fixtures join their fragments at run time, so no literal key reaches the repository. Verify: `rg -n 'AKIA|ghp_|BEGIN [A-Z ]*PRIVATE KEY' $T $Q/scripts $K/runtime/cli/lib/dist-freshness.cjs` prints nothing.
- [ ] CHK-031 [P0] Every `--files` path is resolved and checked against the repository root before any spawn, and every spawn is an argv array with no shell. Verify: `node --test --test-reporter=tap --test-name-pattern='^F10' $T` prints `# fail 0`.
- [ ] CHK-032 [P1] N/A: the runner has no authentication or authorization surface. It reads files and runs built-in checks only. Verify: `rg -n 'auth' $Q/scripts/quality-gate.cjs` prints nothing, so the module names no authentication path at all.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Every REQ id in `spec.md` appears in `acceptance-criteria.md`. Verify: `diff <(rg -o 'REQ-0[0-9]{2}' $P/spec.md | sort -u) <(rg -o 'REQ-0[0-9]{2}' $P/acceptance-criteria.md | sort -u)` prints nothing.
- [ ] CHK-041 [P1] The contract keeps its eight sections and states the new boundary, the read-only path and the checklist condition. Verify: `rg -c '^## ' $Q/references/runner-contract.md` prints `8`.
- [ ] CHK-042 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same six requirements and the same fixture names. Verify: `rg -c 'F2[12]' $P/plan.md $P/tasks.md $P/acceptance-criteria.md` prints one count per file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only. T004 writes its timing log there. Verify: `rg -l '' $P/scratch 2>/dev/null | wc -l` prints a count of 1 or fewer.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion. T048 prints `.gitkeep`. Verify: `ls -A $P/scratch` prints `.gitkeep`.
- [ ] CHK-052 [P0] No file outside the scope in `spec.md` section 3 changed. Verify: `git status --porcelain` lists only the files that section names.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

