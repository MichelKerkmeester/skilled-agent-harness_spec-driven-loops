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

- [x] T001 Confirm that `002-builtin-runner` and `003-config-and-doctor` landed, so the functions this phase edits exist at the branch head (`$Q/scripts`). Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs && rg -n 'function takeSnapshot|function withGuard' $Q/scripts/lib/run-check.cjs` prints three lines, one for `probePreCommit`, one for `takeSnapshot` and `withGuard`. Evidence 2026-10-26: the Verify printed `1559:function probePreCommit(context) {`, `217:function takeSnapshot({ root, git, files, env }) {` and `255:function withGuard(context, work, before) {`, so phases 002 and 003 are on the branch head `f1732e4d95`.
- [x] T002 [P] Record the baseline of the `node:test` suite and the four quality shell suites, before the first source edit (`$T`, `$Q/scripts/check-comment-hygiene.test.sh`, `$Q/scripts/ceiling-report.test.sh`, `$Q/scripts/typo-flags.test.sh`, `$Q/scripts/hooks/claude-posttooluse.test.sh`). Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# (tests|fail)'` prints `# tests 27` and `# fail 0` at this tree, and `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo quality-suites-green` prints `quality-suites-green`. Evidence 2026-10-26: `node --test --test-reporter=tap $T` printed `# tests 29` and `# fail 0`, two more cases than the 27 written here because phase 003 added them, and the whole `$Q/scripts/tests` suite printed `# tests 60`, `# fail 0`. The shell suites printed `quality-suites-green`.
- [x] T003 Record the baseline of the dist freshness suite before any edit to the library, because one case is already red at this tree (`$K/runtime/cli/tests/test-dist-freshness.sh`). Verify: `bash $K/runtime/cli/tests/test-dist-freshness.sh 2>&1 | rg '^Totals'` prints `Totals: 1 passed, 1 failed`, and the one failure is `[FAIL] validate.sh stale-dist backstop`. Record both lines, so a library change is judged against this baseline rather than against zero failures. Evidence 2026-10-26: the Verify printed `Totals: 1 passed, 1 failed`, and the one failure is `[FAIL] validate.sh stale-dist backstop`.
- [x] T004 Record the timing baseline for REQ-003 over five runs with the command `plan.md` section 4 step 3 names, before the first source edit (`$Q/scripts/quality-gate.cjs`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines. On 2026-10-26 this tree printed `real 2.89`, `real 5.29`, `real 3.61`, `real 3.27` and `real 2.92` with the machine under load, against the `2.01` to `2.28` the plan records at `f69e5cd2e8`, so record `git rev-parse --short HEAD` and the load beside the five lines. Evidence 2026-10-26: at `f1732e4d95`, load average `5.03 3.89 4.40`, the five runs printed `real 2.32`, `real 1.99`, `real 1.98`, `real 1.97` and `real 2.04`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Resolve the checker a hook names against the repository that owns the hook and the source roots under it, and report `broken` unless one candidate is a regular file with the execute bit (REQ-001) (`$Q/scripts/quality-gate.cjs`). Verify: `node $Q/scripts/quality-gate.cjs --files $Q/scripts/lib/run-check.cjs --format json | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).layers.pre_commit_hygiene"` prints `present`, so this repository's own hook still reads as installed. Evidence 2026-10-26: the Verify printed `present`, so this repository's own hook still reads as installed.
- [x] T006 Add the three probe cases: a present checker, a missing checker and a checker without the execute bit (REQ-001) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the Verify printed `# pass 1` and `# fail 0`, and the whole `$Q/scripts/tests` suite printed `# fail 0`.
- [x] T007 Define `broken` as installed but not runnable, name the resolution rule and the repair line it carries (REQ-001) (`$Q/references/runner-contract.md`). Verify: `rg -c 'installed but not runnable' $Q/references/runner-contract.md` prints `1`. Evidence 2026-10-26: the Verify printed `1`.
- [x] T008 Add the read-only option to `checkPackageFreshness` and `checkAllFreshness`, skipping the cache record write and keeping the verdict, with the writable default unchanged (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: dist read-only' $T` prints `# fail 0`. Evidence 2026-10-26: the Verify printed `# fail 0` (the read-only case returns the same verdict with no cache record, and the writable default then writes one).
- [x] T009 Add the `--no-write` flag to the library CLI, so a shell caller can ask for the same mode (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `rg -n 'no-write' $K/runtime/cli/lib/dist-freshness.cjs` prints one line. Evidence 2026-10-26: `rg -n 'no-write' $K/runtime/cli/lib/dist-freshness.cjs` printed `921:    else if (arg === '--no-write') parsed.readOnly = true;`, and the dist freshness suite still printed `Totals: 1 passed, 1 failed` with only the known `[FAIL] validate.sh stale-dist backstop`.
- [x] T010 Pass the read-only switch on the per-file `check-file` call when the environment asks for it, leaving `--all` and the session-start path on the writable default (REQ-002) (`$Q/scripts/check-dist-staleness.sh`). Verify: `rg -n 'SPECKIT_DIST_READ_ONLY' $Q/scripts/check-dist-staleness.sh` prints one line. Evidence 2026-10-26: `rg -n 'SPECKIT_DIST_READ_ONLY' $Q/scripts/check-dist-staleness.sh` printed one line.
- [x] T011 Set `SPECKIT_DIST_READ_ONLY=1` in `runDistAdapter` beside `SPECKIT_DIST_AUTO_REBUILD=0` (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `rg -c 'SPECKIT_DIST_READ_ONLY' $Q/scripts/quality-gate.cjs` prints `1`. Evidence 2026-10-26: the Verify printed `1`.
- [x] T012 Declare the eight `generated` rows this repository holds, and keep the `mcp-code-mode` entry out because its build is absent (REQ-002) (`$Q/assets/quality-defaults.json`). Verify: `node -p "require('./$Q/assets/quality-defaults.json').generated.length"` prints `8`. Evidence 2026-10-26: the Verify printed `8`.
- [x] T013 Read a path that matches a declared `generated` row as a generated file rather than as excluded, so it reaches the dist adapter and no other check (REQ-002) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F20' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: the Verify printed `# pass 1` and `# fail 0`.
- [x] T014 Record the modification time in `describeEntry` and take the dist folders as extra roots in `assertSnapshotUnchanged`, so a rewrite that reproduces the bytes still fails (REQ-002) (`$Q/scripts/tests/fixtures.cjs`). Verify: `rg -c 'mtimeMs' $Q/scripts/tests/fixtures.cjs` prints a count of 2 or more. Evidence 2026-10-26: the Verify printed `4`.
- [x] T015 Add fixture F20 and the `unit: dist read-only` case (REQ-002) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist read-only' $T` prints `# pass 2` and `# fail 0`. Evidence 2026-10-26: the Verify printed `# pass 2` and `# fail 0`, and the whole runner suite printed `# tests 62` and `# fail 0`.
- [x] T016 State the read-only dist path and the declared generated rows in the adapter section (REQ-002) (`$Q/references/runner-contract.md`). Verify: `rg -c 'read-only' $Q/references/runner-contract.md` prints a count of 1 or more. Evidence 2026-10-26: the Verify printed `1`. The contract edition moved from `1.0.1.0` to `1.0.2.0`.
- [x] T017 Read the workspace listing once per run and hand it to `collectScope` and to both snapshots (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: guard snapshot source' $T` prints `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: guard snapshot source'` printed `# pass 1` and `# fail 0`. The scope listing is handed to the before-snapshot. The after-snapshot keeps its own bounded listing so a path a check creates during the run is still seen, which AC-008 now states.
- [x] T018 Bound the untracked listing to the folders the scope reaches, and take no listing for the scope itself on a `--files` run (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: scope listing' $T` prints `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: scope listing'` printed `# pass 1` and `# fail 0`. A worktree run lists twice, once for the scope and once bounded for the after-snapshot. A `--files` run takes no listing for its scope, and the review fix round gives each of its guard snapshots one bounded listing over the folder its named file sits in, which T050 records.
- [x] T019 Reuse the scope listing in `takeSnapshot`, hashing only the entries the snapshot adds (REQ-003) (`$Q/scripts/lib/run-check.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: guard snapshot source' $T` prints `# fail 0`. Evidence 2026-10-26: the guard snapshot case printed `# pass 1` and `# fail 0`, and the whole suite printed `# tests 64` and `# fail 0`.
- [x] T020 Add the `unit: scope listing` and `unit: guard snapshot source` cases, which assert one listing for a worktree scope, a bounded guard listing and no scope listing for `--files` (REQ-003) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: scope listing|^unit: guard snapshot source' $T` prints `# pass 2` and `# fail 0`. Evidence 2026-10-26: the two-case pattern printed `# pass 2` and `# fail 0`.
- [x] T021 Record the after numbers with the same five-run command and state the listing count in the contract (REQ-003) (`$Q/references/runner-contract.md`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, each under `2.00`. Evidence 2026-10-26: the five-run command printed `real 0.94`, `0.72`, `0.77`, `0.98` and `0.84` against the before numbers 2.32, 1.99, 1.98, 1.97 and 2.04. Measured under a load average of 4.9 to 6.5, so T035 re-measures on the final tree.
- [x] T022 Keep the write case, where a stand-in check writes an untracked file inside the scope and the run still ends with exit 3, so the set of paths a snapshot hashes never shrinks (REQ-003) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: argv spawn and guard' $T` prints `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: argv spawn and guard'` printed `# fail 0`, so a write inside the scope still ends with exit 3.
- [x] T023 Measure the ignored listing at both bounds and keep both numbers (REQ-004) (`$Q/scripts/lib/run-check.cjs`). Verify: `git ls-files --others --ignored --exclude-standard | wc -l` prints a whole-tree count that moves with the ignored tree, `91562` on the read that corrected this row, and `git ls-files --others --ignored --exclude-standard -- $K/runtime/cli/dist | wc -l` prints `447`, the two numbers the ADR weighs against its 50 ms budget. Evidence 2026-10-26: the whole-tree count drifts with the ignored tree, which carries runtime state a validation run writes under `.skilled/skills/.state` and the ignored dist output, so each number names when it was taken. It printed `91555` when the plan was written at `f69e5cd2e8`, `91558` when this task first ran on this tree at `f1732e4d95`, and `91561`, then `91562` after a validation run added a state file, when the row was corrected after the review fix round. The dist-bound listing printed `447` at every read. Five timed runs of listing plus hashing gave 33 to 98 ms at the dist folder, 327 to 1232 ms at the skill folder the scope reaches and 10782 to 12786 ms for the whole tree.
- [x] T024 Write the guard boundary ADR with both measured numbers and the decision rule: add the bounded watch when its cost stays under 50 ms and it hashes only folders the scope reads, otherwise the target-repository boundary stands (REQ-004) (`$P/decision-record.md`). Verify: `rg -n '^## ADR-001' $P/decision-record.md` prints one line, and `rg -c '91555|447' $P/decision-record.md` prints `2`. Evidence 2026-10-26: `rg -n '^## ADR-001'` printed one line and `rg -c '91555|447'` printed `2`. ADR-004 applies the rule: the watch misses the 50 ms budget at the folders the scope reaches, so the target-repository boundary stands and `run-check.cjs` gains no ignored watch.
- [x] T025 State the resulting boundary in the contract, which sees the tracked diff, the untracked files inside the scope, and either the ignored paths inside the scope or the reason they stay outside (REQ-004) (`$Q/references/runner-contract.md`). Verify: `rg -n 'ignored' $Q/references/runner-contract.md` prints the boundary sentence. Evidence 2026-10-26: `rg -n 'ignored'` printed the boundary sentence at contract line 55, which says no ignored path is hashed and why.
- [x] T026 Add the guard boundary cases, including a write outside the scope that the stated boundary places outside the watch (REQ-004) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: argv spawn and guard' $T` prints `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: argv spawn and guard'` printed `# fail 0`, the three `unit: guard boundary` cases printed `# pass 3` and `# fail 0`, and the whole suite printed `# tests 67` and `# fail 0`.
- [x] T027 Correct Known Limitations items 1, 3, 4 and 5 to say what closed each of them (REQ-005) (`specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md`). Verify: `rg -c 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `4`. Evidence 2026-10-26: the Verify printed `4`.
- [x] T028 Point Known Limitations item 8 at phase 005 and move the continuity block, changing nothing else in that file (REQ-005) (`specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md`). Verify: `rg -c 'phase 005' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `1`. Evidence 2026-10-26: the Verify printed `1`; the diff touches only the item 8 line and the continuity block.
- [x] T029 Give the spec-folder checklist row the repository condition and leave the three `.js` and `.css` rows matching by path alone (REQ-006) (`$Q/assets/quality-defaults.json`). Verify: `node -p "require('./$Q/assets/quality-defaults.json').checklists.filter((row) => row.hubRepo).length"` prints `1`, and `node -p "require('./$Q/assets/quality-defaults.json').checklists.filter((row) => (row.extensions || []).length && !row.hubRepo).length"` prints `3`. Evidence 2026-10-26: the two Verify commands printed `1` and `3`.
- [x] T030 Match a base-layer row's repository condition against the file's repository and the repository that owns the declaration hub, so `resolveChecklists` lists the row only for this repository's own tree (REQ-006) (`$Q/scripts/quality-gate.cjs`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F21' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^F21'` printed `# pass 1` and `# fail 0`. A probe with the hub inside the fixture repository listed the spec-folder checklist and the same files with the hub outside did not, so the condition is what drops the row.
- [x] T031 Name the repository condition in the Target-Path Checklist Map row and in the paragraph above the map (REQ-006) (`$Q/SKILL.md`). Verify: `rg -c 'the repository that owns the hub' $Q/SKILL.md` prints `1`. Evidence 2026-10-26: the Verify printed `1`.
- [x] T032 State the repository condition in the contract's checklist-row selection sentence, where the `paths`, `extensions` and `contentMarkers` selectors are named (REQ-006) (`$Q/references/runner-contract.md`). Verify: `rg -c 'the repository that owns the hub' $Q/references/runner-contract.md` prints `1`. Evidence 2026-10-26: the Verify printed `1`.
- [x] T033 Add fixture F21, a foreign repository with a `specs/` folder that lists no spec-folder checklist, and fixture F22, which reads this repository's own spec files and still lists it (REQ-006) (`$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F21|^F22' $T` prints `# pass 2` and `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^F21|^F22'` printed `# pass 2` and `# fail 0`, and the whole suite printed `# tests 69` and `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T034 Run the whole quality suite, so no case from phases 002, 003 and 005 regressed (REQ-001 to REQ-006) (`$T`). Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# fail'` prints `# fail 0`. Evidence 2026-10-26: the Verify printed `# fail 0`, and at that time `$T` printed `# tests 38` while the whole `$Q/scripts/tests` suite printed `# tests 69`. The review fix round adds the four cases T049 to T052 name, so `$T` printed `# tests 41` and the whole suite `# tests 72`, still with `# fail 0`. The fifth round adds the nine cases T053 and T054 name, so `$T` now prints `# tests 50` and the whole suite `# tests 81`.
- [x] T035 Run the five-run timing command on the changed tree and read the five lines (REQ-003) (`$Q/scripts/quality-gate.cjs`). Verify: `for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, each under `2.00`. Evidence 2026-10-26: the five runs printed `real 0.93`, `0.74`, `0.74`, `0.74` and `0.75` on the changed tree, each under `2.00`, at a load average of 6.28. The before numbers at the base were 2.32, 1.99, 1.98, 1.97 and 2.04. The review fix round re-measured on the final tree and printed `real 1.06`, `real 0.80`, `real 0.77`, `real 0.76` and `real 0.83` at a load average of 5.70, and a re-run while the row was corrected printed `real 1.19`, `real 1.14`, `real 0.93`, `real 0.80` and `real 0.81` at a load average of 5.13. The fifth round measured on the final tree and printed `real 1.23`, `real 0.86`, `real 0.87`, `real 0.83` and `real 0.90` at a load average of 8.69, and the run before it printed `real 1.10`, `real 0.84`, `real 0.82`, `real 0.97` and `real 0.99`.
- [x] T036 Run the four quality shell suites again after the change (REQ-002) (`$Q/scripts`). Verify: `bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo quality-suites-green` prints `quality-suites-green`. Evidence 2026-10-26: the Verify printed `quality-suites-green`.
- [x] T037 Run the comment hygiene check on every code file this phase changed (REQ-006) (`$Q/scripts/quality-gate.cjs`, `$Q/scripts/lib/run-check.cjs`, `$Q/scripts/tests/fixtures.cjs`, `$T`, `$K/runtime/cli/lib/dist-freshness.cjs`). Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T $K/runtime/cli/lib/dist-freshness.cjs && echo clean` prints `clean`. Evidence 2026-10-26: the Verify printed `clean`.
- [x] T038 Confirm that no code comment in a changed file names a packet path, a phase number, a REQ, an ADR or a task id (REQ-006) (`$Q/scripts`, `$Q/assets/quality-defaults.json`, `$Q/references/runner-contract.md`). Verify: `rg -n 'REQ-[0-9]|ADR-[0-9]|T[0-9]{3}|015-quality|008-runner' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T` prints nothing. Evidence 2026-10-26: the `rg` printed nothing and exited 1.
- [x] T039 Bump `$Q/SKILL.md` to the version this phase lands with and write its changelog entry (REQ-001, REQ-006) (`$Q/SKILL.md`, `$Q/changelog/`). Verify: `rg -n '^version: ' $Q/SKILL.md` prints one line, and `ls $Q/changelog | tail -1` prints the changelog file whose number matches it. Evidence 2026-10-26: `rg -n '^version: ' $Q/SKILL.md` printed `5:version: 1.10.0.0`. Plain `ls $Q/changelog | tail -1` printed `v1.8.0.0.md`, because a plain `ls` sorts the names as text. The same listing read with `sort -V | tail -1` printed `v1.10.0.0.md`, so the newest entry by version matches the version.
- [x] T040 Bump the hub version in the three hub-root JSON files and in the hub `SKILL.md`, and write the hub changelog entry (All) (`$H/SKILL.md`, `$H/description.json`, `$H/mode-registry.json`, `$H/hub-router.json`, `$H/changelog/`). Verify: `node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints one version three times, and `rg -n '^version: ' $H/SKILL.md` prints the same number. Evidence 2026-10-26: `node -p` printed `3.6.0.0,3.6.0.0,3.6.0.0`, and `rg -n '^version: ' $H/SKILL.md` printed `5:version: 3.6.0.0`.
- [x] T041 Bump `$K/SKILL.md` and write the `system-spec-kit` changelog entry for the freshness library change (REQ-002) (`$K/SKILL.md`, `$K/changelog/`). Verify: `rg -n '^version: ' $K/SKILL.md` prints one line, and `ls $K/changelog | tail -1` prints the changelog file whose number matches it. Evidence 2026-10-26: `rg -n '^version: ' $K/SKILL.md` printed `5:version: 2.10.0.0`. Plain `ls $K/changelog | tail -1` printed `v2.9.2.0.md` for the same sort reason, and `sort -V | tail -1` printed `v2.10.0.0.md`.
- [x] T042 Update the newest-entry row and the document version in the hub README (All) (`$H/README.md`). Verify: `rg -c 'changelog/v' $H/README.md` prints a count of 1 or more, and `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $H/README.md --type readme | tail -3` prints `Total issues: 0`. Evidence 2026-10-26: `rg -c 'changelog/v' $H/README.md` printed `1`, and the document validator printed `✅ VALID: .skilled/skills/sk-code/README.md`, `Document type: readme` and `Total issues: 0`, exit 0.
- [x] T043 Regenerate the three Hermes copies of the edited `SKILL.md` files with their generator, never by hand (All) (`.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` regenerates the copies, then `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync` and exits 0. Evidence 2026-10-26: the generator printed `Wrote 0 of 67 Hermes skill copies` and `pruned 0`, exit 0, the copies already being in sync, and `--check` printed `PASS: 67 Hermes skill copies in sync`, exit 0.
- [x] T044 Regenerate the leaf manifest if this phase added or removed a skill resource (All) (`$H/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check $H` prints `leaf-manifest.json OK` and exits 0. Evidence 2026-10-26: the command printed `leaf-manifest.json OK (6f80ee80c90908e4afb52bdbc110742c2a3045ecb2b856003c2f08d8517f9428)` and exited 0.
- [x] T045 Fill the parent phase map row and regenerate the derived metadata for the parent and this phase (All) (`specs/sk-code/015-quality-agnostic-gate/spec.md`, both `graph-metadata.json` files). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/015-quality-agnostic-gate --folder $P --apply` writes the drift, and `rg -n '008-runner-limit-closeout' specs/sk-code/015-quality-agnostic-gate/spec.md` prints the phase map row. Evidence 2026-10-26: `repair-derived.cjs --apply` printed `inspected=2 repaired=0 failed=0` before the status change, exit 0, and after it printed `repaired specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout` with `inspected=2 repaired=1 failed=0`, exit 0. `rg -n '008-runner-limit-closeout' specs/sk-code/015-quality-agnostic-gate/spec.md` printed the phase map row at line 176 and the handoff row at line 194.
- [x] T046 Write the packet changelog with the nested changelog generator at the phase folder (All) (`specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-008-runner-limit-closeout.md`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js $P --write` exits 0, and `ls specs/sk-code/015-quality-agnostic-gate/changelog/` lists `changelog-015-008-runner-limit-closeout.md`. Evidence 2026-10-26: `nested-changelog.js $P --write` exited 0, and `ls specs/sk-code/015-quality-agnostic-gate/changelog/` lists `changelog-015-008-runner-limit-closeout.md`.
- [x] T047 Validate the packet with the strict validator and read the final line (All) (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict | tail -1` prints `RESULT: PASSED`. Evidence 2026-10-26: the command printed `RESULT: PASSED`, exit 0.
- [x] T048 Remove every probe and log this phase wrote and confirm that `scratch/` holds only its placeholder (All) (`$P/scratch/`). Verify: `ls -A $P/scratch` prints `.gitkeep`. Evidence 2026-10-26: `ls -A $P/scratch` printed `.gitkeep`, with no probe or log left there.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review fix round

The read-only review that ran after Phase 3 raised four findings, and this round fixes each at its cause. A second read-only review confirmed four more, and the two tasks at the end of this round close those. Every case both rounds add stays in the suite the verification tasks above run.

- [x] T049 Map a dist entry back to its package in the freshness library, and read an `unmatched` verdict for a declared path as `ERROR`, so the eight declared generated paths are really checked rather than reported clean (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`, `$Q/scripts/quality-gate.cjs`, `$K/runtime/cli/tests/test-dist-freshness.sh`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F20' $T` prints `# pass 2` and `# fail 0`, and `bash $K/runtime/cli/tests/test-dist-freshness.sh 2>&1 | rg '^Totals'` prints `Totals: 4 passed, 0 failed`. Evidence 2026-10-26: `--test-name-pattern='^F20'` printed `# pass 2` and `# fail 0`, F20 asserting a real `fresh` verdict and F20b a stale one. Every one of the eight declared paths read through `checkFileFreshness` printed `fresh` beside its package, for example `.skilled/skills/system-spec-kit/runtime/cli/dist/spec/is-phase-parent.js | system-spec-kit/runtime/cli | is-phase-parent | fresh`, where each path read `unmatched` before the change. The library suite printed `[PASS] check-file maps a dist entry back to its package` and `Totals: 2 passed, 1 failed`, with only the baseline `[FAIL] validate.sh stale-dist backstop` left. T053 then closed that baseline case, so the suite prints `Totals: 4 passed, 0 failed`.
- [x] T050 Bound the guard's own untracked listing to the folders the named files sit in at both snapshots of a `--files` run, so a file a check creates beside one is still caught while the scope itself still lists nothing (REQ-003, REQ-004) (`$Q/scripts/lib/run-check.cjs`, `$Q/scripts/quality-gate.cjs`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: files scope guard' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: files scope guard'` printed `# pass 1` and `# fail 0`. The case has a check create `src/new.txt` during a `--files src/a.go` run and pins exit 3 with `CHECK_MUTATED_WORKSPACE` naming `src/new.txt`, which the run missed while both snapshots took no listing at all.
- [x] T051 Keep a declared generated path away from every repository-configured check, and read the repository's own `exclude` list before the declared rows, so a repository can still take its build output out of a run (REQ-002) (`$Q/scripts/quality-gate.cjs`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: configured skips generated' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: configured skips generated'` printed `# pass 1` and `# fail 0`. A configured check matching `**/*.js` reads `NOT_APPLICABLE` over a declared generated path while `dist-staleness` reads `RAN_CLEAN`, and the same path under a repository `exclude` reads `NOT_APPLICABLE` for `dist-staleness` with an `excluded` unchecked reason.
- [x] T052 Resolve a checker path a hook quotes, so a quoted `$NAME`, `${NAME}` or `$(...)` prefix reads `present` under each root instead of `broken` (REQ-001) (`$Q/scripts/quality-gate.cjs`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# pass 1` and `# fail 0`. Evidence 2026-10-26: `--test-name-pattern='^unit: layers'` printed `# pass 1` and `# fail 0`, and the case covers the quoted `"$ROOT"/tools/check-comment-hygiene.sh` form and a quoted `"$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh` form, both reading `present`. The fifth round widened the reading beyond a prefix, and T054 records the spellings it now proves.
- [x] T053 Read a provisioned package through a `node_modules` hoisted to any ancestor up to the workspace root, and read every dist check that cannot assess its package as `ERROR` in the read-only mode (REQ-002) (`$K/runtime/cli/lib/dist-freshness.cjs`, `$K/runtime/cli/tests/test-dist-freshness.sh`, `$Q/scripts/check-dist-staleness.sh`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F3[0-3]' $T` prints `# pass 4` and `# fail 0`, and `bash $K/runtime/cli/tests/test-dist-freshness.sh 2>&1 | rg '^Totals'` prints `Totals: 4 passed, 0 failed`. Evidence 2026-10-26: the first command printed `# tests 4`, `# pass 4` and `# fail 0` for F30 a throwing checker, F31 a checker that exits 64, F32 an unprovisioned checker and F33 a silent checker, each asserting the adapter reads `ERROR` and the `DIST FRESHNESS CHECK ERROR:` banner names the file and the reason. The second command printed `Totals: 4 passed, 0 failed`, up from `Totals: 2 passed, 1 failed`, and its new `[PASS] a package whose dependencies hoisted to an ancestor reports its stale build` covers the hoisted shape.
- [x] T054 Read every checker spelling a hook can carry, read a mention inside a shell comment as no checker at all, and let a repository's own `generated` row run on the paths it declares (REQ-001, REQ-002) (`$Q/scripts/quality-gate.cjs`, `$Q/references/runner-contract.md`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F3[4-8]' $T` prints `# pass 5` and `# fail 0`. Evidence 2026-10-26: the command printed `# tests 5`, `# pass 5` and `# fail 0`. F34 reads `present` for a plain path, a `./` path, and a path after `sh`, `bash`, a trailing `|| true` and a `cd ... &&` form. F35 reads `present` for `${ROOT:-.}` bare and quoted, a nested substitution and a `$(cd ... && pwd)` spelling. F36 keeps the quoted and unquoted `$ROOT` and `git rev-parse` forms at `present`, then reads `broken` once the checker is removed. F37 reads `absent` when the only mention sits in a comment. F38 reads `RAN_FAIL` with one file, exit 7 and `BLOCKED` for a repository `generated` row on its declared path.
- [x] T055 Let a repository's own `generated` row reach every in-scope file its `paths` match, wherever the file sits, and read a backslash escape outside quotes as escaping one character, so a quote after it opens nothing (REQ-001, REQ-002) (`$Q/scripts/quality-gate.cjs`, `$Q/references/runner-contract.md`, `$T`). Verify: `node --test --test-reporter=tap --test-name-pattern='^F3[4-9]|^F4[01]' $T` prints `# fail 0`. Evidence 2026-10-26: the command printed `# pass 8` and `# fail 0`. F39 reads `RAN_FAIL` with one file and `BLOCKED` for a repository row on `gen/schema.js`, F40 does the same for `gen/out.txt`, and F41 reads `absent` for a hook whose comment follows `echo don\'t`. The whole suite printed `# tests 84`, `# pass 84` and `# fail 0` on two serial runs.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence 2026-10-26: every task row T001 to T055 reads `[x]` in this file.
- [x] No `[B]` blocked tasks remaining. Evidence 2026-10-26: `rg -n '^- \[B\]' $P/tasks.md` printed nothing, exit 1.
- [x] The six requirements pass on the branch head, each with its evidence in `acceptance-criteria.md`. Evidence 2026-10-26: AC-001 to AC-015 all read `Met` with their evidence in that file, and the strict validator printed `RESULT: PASSED`.
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

- [x] CHK-001 [P0] `002-builtin-runner` and `003-config-and-doctor` landed. T001 prints three lines. Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs && rg -n 'function takeSnapshot|function withGuard' $Q/scripts/lib/run-check.cjs` prints three lines. Evidence 2026-10-26: the command printed `1662:function probePreCommit(context) {`, `220:function takeSnapshot({ root, git, files, env, folders, untracked }) {` and `274:function withGuard(context, work, before) {`, three lines.
- [x] CHK-002 [P0] The requirement list is frozen at six in `spec.md`. Verify: `grep -cE '^\| REQ-' $P/spec.md` prints `6`. Evidence 2026-10-26: the command printed `6`.
- [x] CHK-003 [P1] Every citation `plan.md` section 8 repeats was re-read at the landed tree, because phase 003 moves two of those files. Verify: `rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs` prints one line, and `rg -n '"generated":' $Q/assets/quality-defaults.json` prints one line. Evidence 2026-10-26: the first command printed `1662:function probePreCommit(context) {`, and the second printed `17:  "generated": [`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every code file this phase changed passes the comment hygiene checker. T037 prints `clean`. Verify: `python3 $Q/scripts/check-comment-hygiene.sh $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T $K/runtime/cli/lib/dist-freshness.cjs && echo clean` prints `clean`. Evidence 2026-10-26: the command printed `clean` and exited 0.
- [x] CHK-011 [P0] No changed code block carries a packet path, a step number, a REQ, an ADR or a task id in a comment. T038 prints nothing. Verify: `rg -n 'REQ-[0-9]|ADR-[0-9]|T[0-9]{3}|015-quality|008-runner' $Q/scripts/quality-gate.cjs $Q/scripts/lib/run-check.cjs $Q/scripts/tests/fixtures.cjs $T` prints nothing. Evidence 2026-10-26: the command printed nothing and exited 1.
- [x] CHK-012 [P1] The two changed modules keep their export lists, so no caller breaks. Verify: `node -p "Object.keys(require('./$Q/scripts/lib/run-check.cjs')).join(',')"` prints `findTool,runGit,spawnArgv,spawnGroup,withGuard`, and `node -p "Object.keys(require('./$Q/scripts/quality-gate.cjs')).join(',')"` prints `CHECK_IDS,USAGE_TEXT,decideGate,probeLayers,runDistAdapter`. Evidence 2026-10-26: the two commands printed `findTool,runGit,spawnArgv,spawnGroup,withGuard` and `CHECK_IDS,USAGE_TEXT,decideGate,probeLayers,runDistAdapter`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every requirement has a criterion in `acceptance-criteria.md`. Verify: `rg -c '^\| AC-[0-9]' $P/acceptance-criteria.md` prints `15`. Evidence 2026-10-26: the command printed `15`.
- [x] CHK-021 [P0] The whole quality suite prints `# fail 0`. T034 prints `# fail 0`. Verify: `node --test --test-reporter=tap $T 2>&1 | rg '^# fail'` prints `# fail 0`. Evidence 2026-10-26: the command printed `# fail 0`.
- [x] CHK-022 [P1] Every L2 edge case in `spec.md` has one fixture or one unit case. Verify: `rg -c '^test\(' $T` prints a count of 30 or more. Evidence 2026-10-26: the command printed `50`.
- [x] CHK-023 [P1] The python-absent path and the mutation path still behave as they did. T022 prints `# fail 0` for the write case, and F17 keeps `SKIPPED_ABSENT`. Verify: `node --test --test-reporter=tap --test-name-pattern='^F17|^unit: argv spawn and guard' $T` prints `# fail 0`. Evidence 2026-10-26: the command printed `# pass 2` and `# fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each change names one finding class: `path-resolution`, `write-path`, `cost`, `boundary` or `surface-scope`. Verify: `rg -c 'REQ-00[1-6]' $P/plan.md` prints a count of 6 or more, one per class above. Evidence 2026-10-26: the command printed `22`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, so no second untracked walk stays behind. Verify: `rg -n 'ls-files|status --porcelain' $Q/scripts --glob '*.cjs' --glob '!**/tests/**'` prints three lines or fewer, and every one is bounded to the scope it was given. Evidence 2026-10-26: the command printed three lines, at `quality-gate.cjs:787`, `quality-gate.cjs:812` and `run-check.cjs:249`, each bounded to the scope it was given.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the freshness library and the dist adapter. Verify: `rg -ln 'check-file|dist-freshness' $Q $K/runtime/cli` prints two files or more, the checker, the library and their suites. Evidence 2026-10-26: the command printed 23 files, among them the checker, the adapter script, the library and the two suites.
- [x] CHK-FIX-004 [P0] The path work carries adversarial cases: a missing checker, a directory, a checker without the execute bit and a hook that names the checker through a shell variable. Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T` prints `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0`.
- [x] CHK-FIX-005 [P1] The matrix axes are listed in `plan.md` FIX ADDENDUM before completion is claimed, the repository axis included. Verify: `rg -c 'repository \(this one, a foreign one\)' $P/plan.md` prints `1`. Evidence 2026-10-26: the command printed `1`.
- [x] CHK-FIX-006 [P1] No case mutates this process's environment or global state, so every variable is handed to the child it starts. Verify: `rg -n 'process\.env\.[A-Z_]+ =|delete process\.env' $T $Q/scripts/tests/fixtures.cjs` prints nothing. Evidence 2026-10-26: the command printed nothing and exited 1.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the commit that carries this file, not to a moving branch range. Verify: `git rev-parse --short HEAD` prints the commit the evidence names. Evidence 2026-10-26: `git rev-parse --short HEAD` printed `f1732e4d95`, the commit the evidence names.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The fixtures join their fragments at run time, so no literal key reaches the repository. Verify: `rg -n 'AKIA|ghp_|BEGIN [A-Z ]*PRIVATE KEY' $T $Q/scripts $K/runtime/cli/lib/dist-freshness.cjs --glob '!**/quality-gate.cjs'` prints nothing, because the detector pattern table holds the signatures by necessity and is the one file the scan skips. Evidence 2026-10-26: the command printed nothing and exited 1.
- [x] CHK-031 [P0] Every `--files` path is resolved and checked against the repository root before any spawn, and every spawn is an argv array with no shell. Verify: `node --test --test-reporter=tap --test-name-pattern='^F10' $T` prints `# fail 0`. Evidence 2026-10-26: the command printed `# pass 1` and `# fail 0`.
- [x] CHK-032 [P1] N/A: the runner has no authentication or authorization surface. It reads files and runs built-in checks only. Verify: `rg -n '\bauth(n|z|entication|orization)?\b' $Q/scripts/quality-gate.cjs` prints nothing, so the module names no authentication path at all. Evidence 2026-10-26: the command printed nothing and exited 1.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every REQ id in `spec.md` appears in `acceptance-criteria.md`. Verify: `diff <(rg -o 'REQ-0[0-9]{2}' $P/spec.md | sort -u) <(rg -o 'REQ-0[0-9]{2}' $P/acceptance-criteria.md | sort -u)` prints nothing. Evidence 2026-10-26: the command printed nothing and exited 0.
- [x] CHK-041 [P1] The contract keeps its eight sections and states the new boundary, the read-only path and the checklist condition. Verify: `rg -c '^## ' $Q/references/runner-contract.md` prints `8`. Evidence 2026-10-26: the command printed `8`.
- [x] CHK-042 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same six requirements and the same fixture names. Verify: `rg -c 'F2[12]' $P/plan.md $P/tasks.md $P/acceptance-criteria.md` prints one count per file. Evidence 2026-10-26: the command printed one count per file, a count of 1 for `acceptance-criteria.md`, 4 for `plan.md` and 2 for `tasks.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only. T004 writes its timing log there. Verify: `rg -l '' $P/scratch 2>/dev/null | wc -l` prints a count of 1 or fewer. Evidence 2026-10-26: the command printed `0`, so `scratch/` holds only its placeholder.
- [x] CHK-051 [P1] `scratch/` cleaned before completion. T048 prints `.gitkeep`. Verify: `ls -A $P/scratch` prints `.gitkeep`. Evidence 2026-10-26: the command printed `.gitkeep`.
- [x] CHK-052 [P0] No file outside the scope in `spec.md` section 3 changed. Verify: `git status --porcelain` lists only the files that section names. Evidence 2026-10-26: the command listed the phase change set and this packet's own documents. The only entries section 3 does not name are the two live-activation manifests, at `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/`. Both are regenerated runtime state that follows the hub version bump, and `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code` printed `"fresh":true` and exited 0. No authored source file outside section 3 changed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

