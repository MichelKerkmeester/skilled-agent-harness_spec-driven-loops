---
title: "Changelog: Phase 8: runner-limit-closeout [015-quality-agnostic-gate/008-runner-limit-closeout]"
description: "Chronological changelog for the Phase 8: runner-limit-closeout phase."
trigger_phrases:
  - "quality agnostic gate runner limit closeout changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

The phase's changes sit on branch head f1732e4d95 as one uncommitted change set. A read-only review then read that tree and raised four findings. A second read-only review confirmed four more, and the review fix rounds below record each fix with the verification that proves it. spec.md section 3 lists the files, and tasks.md records each task with its evidence.

### Added

- [P] Record the baseline of the node:test suite and the four quality shell suites, before the first source edit ($T, $Q/scripts/check-comment-hygiene.test.sh, $Q/scripts/ceiling-report.test.sh, $Q/scripts/typo-flags.test.sh, $Q/scripts/hooks/claude-posttooluse.test.sh). Verify: node --test --test-reporter=tap $T 2>&1 | rg '^# (tests|fail)' prints # tests 27 and # fail 0 at this tree, and bash $Q/scripts/check-comment-hygiene.test.sh > /dev/null && bash $Q/scripts/ceiling-report.test.sh > /dev/null && bash $Q/scripts/typo-flags.test.sh > /dev/null && bash $Q/scripts/hooks/claude-posttooluse.test.sh > /dev/null && echo quality-suites-green prints quality-suites-green. Evidence 2026-10-26: node --test --test-reporter=tap $T printed # tests 29 and # fail 0, two more cases than the 27 written here because phase 003 added them, and the whole $Q/scripts/tests suite printed # tests 60, # fail 0. The shell suites printed quality-suites-green.
- Add the three probe cases: a present checker, a missing checker and a checker without the execute bit (REQ-001) ($T). Verify: node --test --test-reporter=tap --test-name-pattern='^unit: layers' $T prints # pass 1 and # fail 0. Evidence 2026-10-26: the Verify printed # pass 1 and # fail 0, and the whole $Q/scripts/tests suite printed # fail 0.
- Add the read-only option to checkPackageFreshness and checkAllFreshness, skipping the cache record write and keeping the verdict, with the writable default unchanged (REQ-002) ($K/runtime/cli/lib/dist-freshness.cjs). Verify: node --test --test-reporter=tap --test-name-pattern='^unit: dist read-only' $T prints # fail 0. Evidence 2026-10-26: the Verify printed # fail 0 (the read-only case returns the same verdict with no cache record, and the writable default then writes one).
- Add the --no-write flag to the library CLI, so a shell caller can ask for the same mode (REQ-002) ($K/runtime/cli/lib/dist-freshness.cjs). Verify: rg -n 'no-write' $K/runtime/cli/lib/dist-freshness.cjs prints one line. Evidence 2026-10-26: rg -n 'no-write' $K/runtime/cli/lib/dist-freshness.cjs printed 921: else if (arg === '--no-write') parsed.readOnly = true;, and the dist freshness suite still printed Totals: 1 passed, 1 failed with only the known [FAIL] validate.sh stale-dist backstop.
- Set SPECKIT_DIST_READ_ONLY=1 in runDistAdapter beside SPECKIT_DIST_AUTO_REBUILD=0 (REQ-002) ($Q/scripts/quality-gate.cjs). Verify: rg -c 'SPECKIT_DIST_READ_ONLY' $Q/scripts/quality-gate.cjs prints 1. Evidence 2026-10-26: the Verify printed 1.
- Declare the eight generated rows this repository holds, and keep the mcp-code-mode entry out because its build is absent (REQ-002) ($Q/assets/quality-defaults.json). Verify: node -p "require('./$Q/assets/quality-defaults.json').generated.length" prints 8. Evidence 2026-10-26: the Verify printed 8.

### Changed

- Confirm that 002-builtin-runner and 003-config-and-doctor landed, so the functions this phase edits exist at the branch head ($Q/scripts). Verify: rg -n 'function probePreCommit' $Q/scripts/quality-gate.cjs && rg -n 'function takeSnapshot|function withGuard' $Q/scripts/lib/run-check.cjs prints three lines, one for probePreCommit, one for takeSnapshot and withGuard. Evidence 2026-10-26: the Verify printed 1559:function probePreCommit(context) {, 217:function takeSnapshot({ root, git, files, env }) { and 255:function withGuard(context, work, before) {, so phases 002 and 003 are on the branch head f1732e4d95.
- Record the baseline of the dist freshness suite before any edit to the library, because one case is already red at this tree ($K/runtime/cli/tests/test-dist-freshness.sh). Verify: bash $K/runtime/cli/tests/test-dist-freshness.sh 2>&1 | rg '^Totals' prints Totals: 1 passed, 1 failed, and the one failure is [FAIL] validate.sh stale-dist backstop. Record both lines, so a library change is judged against this baseline rather than against zero failures. Evidence 2026-10-26: the Verify printed Totals: 1 passed, 1 failed, and the one failure is [FAIL] validate.sh stale-dist backstop.
- Record the timing baseline for REQ-003 over five runs with the command plan.md section 4 step 3 names, before the first source edit ($Q/scripts/quality-gate.cjs). Verify: for run in 1 2 3 4 5; do /usr/bin/time -p node $Q/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real' prints five real lines. On 2026-10-26 this tree printed real 2.89, real 5.29, real 3.61, real 3.27 and real 2.92 with the machine under load, against the 2.01 to 2.28 the plan records at f69e5cd2e8, so record git rev-parse --short HEAD and the load beside the five lines. Evidence 2026-10-26: at f1732e4d95, load average 5.03 3.89 4.40, the five runs printed real 2.32, real 1.99, real 1.98, real 1.97 and real 2.04.
- Resolve the checker a hook names against the repository that owns the hook and the source roots under it, and report broken unless one candidate is a regular file with the execute bit (REQ-001) ($Q/scripts/quality-gate.cjs). Verify: node $Q/scripts/quality-gate.cjs --files $Q/scripts/lib/run-check.cjs --format json | node -p "JSON.parse(require('fs').readFileSync(0, 'utf8')).layers.pre_commit_hygiene" prints present, so this repository's own hook still reads as installed. Evidence 2026-10-26: the Verify printed present, so this repository's own hook still reads as installed.
- Pass the read-only switch on the per-file check-file call when the environment asks for it, leaving --all and the session-start path on the writable default (REQ-002) ($Q/scripts/check-dist-staleness.sh). Verify: rg -n 'SPECKIT_DIST_READ_ONLY' $Q/scripts/check-dist-staleness.sh prints one line. Evidence 2026-10-26: rg -n 'SPECKIT_DIST_READ_ONLY' $Q/scripts/check-dist-staleness.sh printed one line.
- Read a path that matches a declared generated row as a generated file rather than as excluded, so it reaches the dist adapter and no other check (REQ-002) ($Q/scripts/quality-gate.cjs). Verify: node --test --test-reporter=tap --test-name-pattern='^F20' $T prints # pass 1 and # fail 0. Evidence 2026-10-26: the Verify printed # pass 1 and # fail 0.

### Fixed

- Define broken as installed but not runnable, name the resolution rule and the repair line it carries (REQ-001) ($Q/references/runner-contract.md). Verify: rg -c 'installed but not runnable' $Q/references/runner-contract.md prints 1. Evidence 2026-10-26: the Verify printed 1.
- Record the modification time in describeEntry and take the dist folders as extra roots in assertSnapshotUnchanged, so a rewrite that reproduces the bytes still fails (REQ-002) ($Q/scripts/tests/fixtures.cjs). Verify: rg -c 'mtimeMs' $Q/scripts/tests/fixtures.cjs prints a count of 2 or more. Evidence 2026-10-26: the Verify printed 4.
- Add fixture F20 and the unit: dist read-only case (REQ-002) ($T). Verify: node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist read-only' $T prints # pass 2 and # fail 0. Evidence 2026-10-26: the Verify printed # pass 2 and # fail 0, and the whole runner suite printed # tests 62 and # fail 0.
- Bound the untracked listing to the folders the scope reaches, and take no listing for the scope itself on a --files run (REQ-003) ($Q/scripts/quality-gate.cjs). Verify: node --test --test-reporter=tap --test-name-pattern='^unit: scope listing' $T prints # fail 0. Evidence 2026-10-26: --test-name-pattern='^unit: scope listing' printed # pass 1 and # fail 0. A worktree run lists twice, once for the scope and once bounded for the after-snapshot. A --files run takes no listing for its scope, and the review fix round gives each of its guard snapshots one bounded listing over the folder its named file sits in, which T050 records.
- Measure the ignored listing at both bounds and keep both numbers (REQ-004) ($Q/scripts/lib/run-check.cjs). Verify: git ls-files --others --ignored --exclude-standard | wc -l prints a whole-tree count that moves with the ignored tree, 91562 on the read that corrected this row, and git ls-files --others --ignored --exclude-standard -- $K/runtime/cli/dist | wc -l prints 447, the two numbers the ADR weighs against its 50 ms budget. Evidence 2026-10-26: the whole-tree count drifts with the ignored tree, which carries runtime state a validation run writes under .skilled/skills/.state and the ignored dist output, so each number names when it was taken. It printed 91555 when the plan was written at f69e5cd2e8, 91558 when this task first ran on this tree at f1732e4d95, and 91561, then 91562 after a validation run added a state file, when the row was corrected after the review fix round. The dist-bound listing printed 447 at every read. Five timed runs of listing plus hashing gave 33 to 98 ms at the dist folder, 327 to 1232 ms at the skill folder the scope reaches and 10782 to 12786 ms for the whole tree.
- Correct Known Limitations items 1, 3, 4 and 5 to say what closed each of them (REQ-005) (specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md). Verify: rg -c 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md prints 4. Evidence 2026-10-26: the Verify printed 4.

### Verification

- bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict --no-recursive before the authored documents were finished - Baseline: Summary: Errors: 3 Warnings: 0, then RESULT: FAILED, exit 2. The three errors were the six template placeholders in this file and two generated-metadata checks
- bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --strict --no-recursive before any edit under the parent - Baseline: RESULT: PASSED with one warning, GRAPH_METADATA_CHILD_DRIFT: children_ids is missing on-disk phase children: 008-runner-limit-closeout
- node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout before the goal was authored - Baseline: RESULT: FAILED (4/5 checks), exit 1, five placeholder findings
- Phase verification after the sixth review fix round - node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs printed # tests 84, # pass 84 and # fail 0, exit 0, on two serial runs
- The five-run timing command on the final tree - Printed real 1.23, 0.86, 0.87, 0.83 and 0.90 at a load average of 8.69 at HEAD f1732e4d95, every run under 2.00. The round-5 run before it printed real 1.10, 0.84, 0.82, 0.97 and 0.99
- The dist freshness library suite - Totals: 4 passed, 0 failed, exit 0, with ls -d .skilled/skills/system-spec-kit/runtime/node_modules reporting the folder absent. The worktree hoists dependencies to .skilled/skills/system-spec-kit/node_modules, and the library read every package under it as unprovisioned, so the stale-dist case fell back to a clean verdict. The walk now reaches any ancestor up to the workspace root, and the suite gained a case that hoists node_modules to an intermediate ancestor and asserts a stale exit 69. Before the change the suite printed Totals: 2 passed, 1 failed with [FAIL] validate.sh stale-dist backstop
- bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict --no-recursive after the authored documents were finished - Summary: Errors: 0 Warnings: 0, then RESULT: PASSED
- Tasks complete - 85 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `The files spec.md section 3 lists` | Edit, create, regenerate | One requirement per change |
| `runtime/cli/lib/dist-freshness.cjs under the system-spec-kit skill` | Edit | Fix rounds: a dist entry maps back to its package, and a package provisioned through a hoisted ancestor reports its stale build |
| `runtime/cli/tests/test-dist-freshness.sh under the system-spec-kit skill` | Edit | Fix rounds: the shell suite covers the new mapping and the hoisted dependency shape |
| `scripts/check-dist-staleness.sh under the sk-code-quality mode` | Edit | Fix round: a dist check that cannot assess its package prints an error in the read-only mode |
| `scripts/quality-gate.cjs under the sk-code-quality mode` | Edit | Fix rounds: an unmatched declared path is ERROR, a configured check skips a base-declared generated file while a repository's own generated row runs on its declared paths, and every checker spelling a hook can carry resolves |
| `scripts/lib/run-check.cjs under the sk-code-quality mode` | Edit | Fix round: a --files guard bounds its listing to the named files' folders |
| `scripts/tests/fixtures.cjs and scripts/tests/quality-gate.test.cjs under the sk-code-quality mode` | Edit | Fix rounds: unit: files scope guard, unit: configured skips generated, the two quoted hook forms, and fixtures F30 to F38 |

### Follow-Ups

- The commit is the conductor's. The implementation, both review fix rounds and the release work sit on branch head f1732e4d95 as an uncommitted change set, and the conductor owns the commit. Every task row is closed in tasks.md, and the strict validator printed RESULT: PASSED.
- The ignored watch depends on one measurement. Task T023 repeats the ignored listing at both bounds on the landed tree. If the bounded cost exceeds the phase's 50 millisecond budget there, the target-repository boundary stands and runner-contract.md states that instead, as ADR-004 records.
- The timing number is machine specific. The machine and the HEAD are recorded beside the five lines, and the measurement phase runs the same command, so a change reads as a delta rather than as a claim.
