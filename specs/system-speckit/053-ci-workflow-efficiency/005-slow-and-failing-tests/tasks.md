---
title: "Tasks: Phase 5: slow-and-failing-tests"
description: "Task Format: T### [P?] Description (file path). Forty ordered tasks for the slow-and-failing-tests phase: the reference timing and the provisioned tree, the probe header, the serial baseline, the probe config and three parallel runs, the deleted probe config and the recorded outcome, the config flip or the two-way shard, the three 40-run pulls and the re-check tables, the failed-log reads and the root causes, the deep-loop drift fix and its fast-fail step with a negative proof, the two conditional fixes, the five stale confirmations, the no-retry proof, the gates, two commits, the post-change step measurement, the 5- and 10-run streaks, the acceptance rows, the packet validation and the closure commit."
trigger_phrases:
  - "slow and failing tests tasks"
  - "phase 5 slow and failing tests tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: slow-and-failing-tests

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

**Task Format**: `T### [P?] Description (file path)`

Every task below names one file, quotes the anchor text it edits, gives that anchor's current line number, puts every command in a fenced block, states the expected result, names the acceptance criterion it satisfies, gives a rollback, and gives one concrete stop condition.

Line numbers are the values on disk when this plan was written. `003-trigger-and-job-hygiene` and `004-setup-caching-provisioning` may shift the lines in `spec-kit-check.yml` and `deep-loop-runtime.yml` before this phase runs, so every task quotes the step name as well as the line: re-read the file and locate the anchor text before editing. A stale line is not a stale change.

No operator decision gates this phase. Every branch point is resolved by a measurement: T010 records the probe outcome, and T023 records the contract-drift verdict.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### T001 [x] Record the reference step timing and the baseline source (AC-003)

Done: `gh run view 39909844384` returned `{"conclusion":"success","seconds":791}`; checks returned `1` and `1` with `baseline-source: 001-dataset`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md` (new file). Anchor: none; the file does not exist yet.

Change: read the reference run, then write the file with this shape: the heading `# R20 CLI vitest step`, the table header `| when | run id | step seconds |`, the divider `|---|---|---|`, one row `| reference | 39909844384 | 791 |`, and one line `baseline-source: 002-baseline` or `baseline-source: 001-dataset`.

```bash
gh run view 39909844384 --json jobs --jq '.jobs[] | select(.name | startswith("Typecheck")) | .steps[] | select(.name == "CLI vitest project") | {conclusion, seconds: (((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)))}'
test -f specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md && echo BASELINE_PRESENT || echo BASELINE_MISSING
mkdir -p specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch
cat > specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md <<'EOF'
# R20 CLI vitest step

| when | run id | step seconds |
|---|---|---|
| reference | 39909844384 | 791 |

baseline-source: 002-baseline
EOF
```

Expected: `{"conclusion":"success","seconds":791}`; then `BASELINE_MISSING` today, in which case replace the last line with `baseline-source: 001-dataset`.

Check:

```bash
grep -c '^| reference | 39909844384 | 791 |$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md
grep -cE '^baseline-source: (002-baseline|001-dataset)$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md
```

Expected: `1` and `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md`.

Stop and escalate if: the `gh` output does not read `"seconds":791`, or the file already exists with an `after` row.

---

### T002 [x] Build and install the trees this phase runs (AC-001, AC-003, AC-004, AC-009)

Done: checks printed `CLI_DIST_PRESENT`, `DEEP_LOOP_INSTALLED`, `ADVISOR_INSTALLED` and `vitest/4.1.11`; the runtime install succeeded with a packet-local cache after the default cache returned `EPERM`.

File: the dependency trees under `.skilled/` and the build output at `.skilled/skills/system-spec-kit/runtime/cli/dist` (no tracked file is edited; both are gitignored). Anchor: none.

Change: run the nine install and build commands once, in this order.

```bash
npm --prefix .skilled/skills/system-spec-kit ci
( cd .skilled/skills/system-spec-kit/shared && ../node_modules/.bin/tsc --build )
npm --prefix .skilled/skills/system-spec-kit/runtime run build
npm --prefix .skilled/skills/system-spec-kit/runtime/cli run build
npm --prefix .skilled ci
npm --prefix .skilled/skills/system-deep-loop ci
npm --prefix .skilled/skills/system-deep-loop/runtime ci
npm --prefix .skilled/skills/system-skill-advisor/runtime ci
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

Expected: every command exits `0`. The worktree that authored this plan already has `.skilled/skills/system-spec-kit/node_modules` with vitest 4.1.11, but it has no `runtime/cli/dist` and no deep-loop or advisor tree.

Check:

```bash
test -d .skilled/skills/system-spec-kit/runtime/cli/dist && echo CLI_DIST_PRESENT
test -d .skilled/skills/system-deep-loop/runtime/node_modules && echo DEEP_LOOP_INSTALLED
test -d .skilled/skills/system-skill-advisor/runtime/node_modules && echo ADVISOR_INSTALLED
( cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest --version )
```

Expected: `CLI_DIST_PRESENT`, `DEEP_LOOP_INSTALLED`, `ADVISOR_INSTALLED`, `4.1.11`.

Rollback: no tracked file changes. If a build is corrupt, `rm -rf .skilled/skills/system-spec-kit/runtime/cli/dist` and rerun the fourth command.

Stop and escalate if: any command exits non-zero twice, or the vitest version is not `4.1.11`.

---

### T003 [x] Create the probe record with its table header (AC-001)

Done: the probe header checks returned `1`, `1` and `2`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md` (new file). Anchor: none; the file does not exist yet.

Change: write exactly these five lines and nothing else.

```bash
cat > specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md <<'EOF'
# R19 probe

| mode | run | exit | seconds | log |
|---|---|---|---|---|
EOF
```

Check:

```bash
grep -c '^| mode | run | exit | seconds | log |$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -c '^|---|---|---|---|---|$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -c '^|' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `1`, `1`, `2`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`.

Stop and escalate if: the file already holds a `| serial |` or a `| parallel |` row.

---

### T004 [x] Run the serial baseline and append its row (AC-001)

Done after a failed first attempt: the first run, inside the codex sandbox, ended `exit=1 real=743.57` with `Test Files  1 failed | 179 passed | 3 skipped (183)`, because `tests/trigger-index-rebuild-workflow.vitest.ts > ... reads the token from a readable parent as yes` returned `false` at line 1084 (the sandbox blocks parent-process inspection). That is the Stop-if below (exit not `0`), and it fired; it is recorded in `scratch/r19-probe.md` under `## T004 first attempt, failed in the sandbox`. The rerun outside the sandbox gave `exit=0 real=625.44` with `Test Files  180 passed | 3 skipped (183)`, and the task checks returned `1`, `1`, and that line. The failing test file was then run alone outside the sandbox on 2026-10-24: `Tests  60 passed | 1 skipped (61)`, exit 0, with the readable-parent test passing. Each run's environment is in `## Run environments` in `scratch/r19-probe.md`: the serial row and the rebalanced-split runs are outside the sandbox; the three parallel runs and the two shard halves were not logged and are inferred to be outside it.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md:4`, anchor: `|---|---|---|---|---|`.

Change: run the `cli` project once with the real config and append one row `| serial | 1 | <exit> | <seconds> | r19-serial.log |`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
( cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.ts --project cli > "$PHASE/scratch/r19-serial.log" 2>&1 )
code=$?
real=$(awk '/^real /{print $2}' "$PHASE/scratch/r19-serial.log" | tail -1)
printf '| serial | 1 | %s | %s | r19-serial.log |\n' "$code" "$real" >> "$PHASE/scratch/r19-probe.md"
echo "exit=$code real=$real"
```

Expected: `exit=0 real=<a number>`; the log's `Test Files` line names `183` files.

Check:

```bash
grep -c '^| serial | 1 |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -c '^| serial | 1 | 0 | [0-9]' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -E 'Test Files' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-serial.log | tail -1
```

Expected: `1`, `1`, and a line naming `183`.

Rollback: delete the `| serial |` row and `scratch/r19-serial.log`.

Stop and escalate if: the exit code is not `0`, or the collected file count is not `183`.

---

### T005 [x] Create the probe config with one setting flipped (AC-001)

Done: probe config written; checks returned `PROBE_PRESENT`, `1`, `1`, and an empty `diff`.

File: `.skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` (new file). Anchor: none; the file does not exist yet.

Change: copy `.skilled/skills/system-spec-kit/vitest.config.ts` and replace the `cli` project's `fileParallelism: false,` with `fileParallelism: true,`. Nothing else changes.

```bash
node <<'NODE'
const fs = require('node:fs');
const file = '.skilled/skills/system-spec-kit/vitest.config.ts';
const text = fs.readFileSync(file, 'utf8');
const cli = text.indexOf("name: 'cli'");
const at = cli < 0 ? -1 : text.lastIndexOf('fileParallelism: false,', cli);
if (at < 0) throw new Error('cli fileParallelism line not found');
fs.writeFileSync(
  '.skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts',
  text.slice(0, at) + 'fileParallelism: true,' + text.slice(at + 'fileParallelism: false,'.length),
);
console.log('probe config written');
NODE
```

Check:

```bash
test -f .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts && echo PROBE_PRESENT
grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts
grep -c 'fileParallelism: false' .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts
diff <(sed 's/fileParallelism: true/fileParallelism: false/' .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts) .skilled/skills/system-spec-kit/vitest.config.ts
```

Expected: `PROBE_PRESENT`, `1`, `1`, and no diff output.

Rollback: `rm .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts`.

Stop and escalate if: the node script throws, or the diff prints anything.

---

### T006 [x] Run the first parallel probe and append its row (AC-001)

Done: `exit=0 real=292.33`; check returned `1`; `Test Files 180 passed | 3 skipped (183)`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`, anchor: the `| serial | 1 |` row written by T004.

Change: run the `cli` project through the probe config and append one row `| parallel | 1 | <exit> | <seconds> | r19-run-1.log |`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
( cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.parallel-probe.ts --project cli > "$PHASE/scratch/r19-run-1.log" 2>&1 )
code=$?
real=$(awk '/^real /{print $2}' "$PHASE/scratch/r19-run-1.log" | tail -1)
printf '| parallel | 1 | %s | %s | r19-run-1.log |\n' "$code" "$real" >> "$PHASE/scratch/r19-probe.md"
echo "exit=$code real=$real"
```

Expected: `exit=0 real=<a number>`, and the log names `183` files.

Check:

```bash
grep -c '^| parallel | 1 |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `1`.

Rollback: delete the `| parallel | 1 |` row and `scratch/r19-run-1.log`.

Stop and escalate if: the log names neither a collision token nor an assertion failure, so the run cannot be classified.

---

### T007 [x] Run the second parallel probe and append its row (AC-001)

Done: row check returned `1`; run returned `exit=1 real=305.59` with `Test Files 1 failed | 179 passed | 3 skipped (183)`; one test timed out at `30000ms`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`, anchor: the `| parallel | 1 |` row written by T006.

Change: run the probe config again and append one row `| parallel | 2 | <exit> | <seconds> | r19-run-2.log |`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
( cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.parallel-probe.ts --project cli > "$PHASE/scratch/r19-run-2.log" 2>&1 )
code=$?
real=$(awk '/^real /{print $2}' "$PHASE/scratch/r19-run-2.log" | tail -1)
printf '| parallel | 2 | %s | %s | r19-run-2.log |\n' "$code" "$real" >> "$PHASE/scratch/r19-probe.md"
echo "exit=$code real=$real"
```

Expected: `exit=0 real=<a number>`, and the log names `183` files.

Check:

```bash
grep -c '^| parallel | 2 |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `1`.

Rollback: delete the `| parallel | 2 |` row and `scratch/r19-run-2.log`.

Stop and escalate if: the log names neither a collision token nor an assertion failure.

---

### T008 [x] Run the third parallel probe and append its row (AC-001)

Done: row check returned `1`; run returned `exit=1 real=311.91` with `Test Files 1 failed | 179 passed | 3 skipped (183)`; one test timed out at `30000ms`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`, anchor: the `| parallel | 2 |` row written by T007.

Change: run the probe config a third time and append one row `| parallel | 3 | <exit> | <seconds> | r19-run-3.log |`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
( cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.parallel-probe.ts --project cli > "$PHASE/scratch/r19-run-3.log" 2>&1 )
code=$?
real=$(awk '/^real /{print $2}' "$PHASE/scratch/r19-run-3.log" | tail -1)
printf '| parallel | 3 | %s | %s | r19-run-3.log |\n' "$code" "$real" >> "$PHASE/scratch/r19-probe.md"
echo "exit=$code real=$real"
```

Expected: `exit=0 real=<a number>`, and the log names `183` files.

Check:

```bash
grep -c '^| parallel | 3 |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `1`.

Rollback: delete the `| parallel | 3 |` row and `scratch/r19-run-3.log`.

Stop and escalate if: the log names neither a collision token nor an assertion failure.

---

### T009 [x] Delete the probe config (AC-001)

Done: checks returned `PROBE_ABSENT`; `git status --short .skilled/skills/system-spec-kit/` printed nothing.

File: `.skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts`, anchor: none; the file is deleted.

Change: delete the probe config, so no untracked config survives into the real edit.

```bash
rm .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts
test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts && echo PROBE_REMOVED
```

Expected: `PROBE_REMOVED`.

Check:

```bash
test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts && echo PROBE_ABSENT
git status --short .skilled/skills/system-spec-kit/
```

Expected: `PROBE_ABSENT`, and `git status` prints nothing.

Rollback: rerun T005 to recreate the config.

Stop and escalate if: the file still exists after two `rm` attempts.

---

### T010 [x] Record the probe outcome (AC-001)

Done by operator ruling, not by the script below: the script as planned would have printed `UNCLASSIFIED: a parallel run failed without a collision token` and exited 1, because parallel rows 2 and 3 carry exit `1` and the collision log is empty (the failures are `Test timed out in 30000ms`, not an `EEXIST`, `EADDRINUSE` or `SQLITE_BUSY` token). That is the Stop-if below, and it fired. The operator then ruled on 2026-10-24, after the data was in, that a 30 s timeout that appears only in the parallel rows while the serial row passed all 183 files counts as a concurrency result, and that the outcome is `shard`. The `## Outcome` section of `scratch/r19-probe.md` was written by hand on that ruling and labels the classification as written after the data; the greps in the script were used for the collision and failure logs only. Task checks returned `1`, `1`, and `1`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`, anchor: the `| parallel | 3 |` row written by T008.

Change: append the heading `## Outcome`, the collision and failure greps' output, and exactly one line, `outcome: parallel` or `outcome: shard`.

Apply these two rules, in this order:
- `outcome: parallel` when all three `parallel` rows carry exit `0`.
- `outcome: shard` when any `r19-run-*.log` holds `EEXIST`, `EADDRINUSE` or `SQLITE_BUSY`, or names a path, port or database another test file owns.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
grep -nE 'EEXIST|EADDRINUSE|SQLITE_BUSY' "$PHASE"/scratch/r19-run-*.log > "$PHASE/scratch/r19-collisions.log" || true
grep -nE 'FAIL ' "$PHASE"/scratch/r19-run-*.log > "$PHASE/scratch/r19-failures.log" || true
nonzero=$(grep -cE '^\| parallel \| [123] \| [1-9]' "$PHASE/scratch/r19-probe.md")
if [ "$nonzero" -gt 0 ] && [ ! -s "$PHASE/scratch/r19-collisions.log" ]; then
  echo "UNCLASSIFIED: a parallel run failed without a collision token"; exit 1
fi
outcome=parallel
[ -s "$PHASE/scratch/r19-collisions.log" ] && outcome=shard
{
  printf '\n## Outcome\n\n'
  cat "$PHASE/scratch/r19-collisions.log" "$PHASE/scratch/r19-failures.log"
  printf '\noutcome: %s\n' "$outcome"
} >> "$PHASE/scratch/r19-probe.md"
echo "outcome=$outcome"
```

Expected: `outcome=parallel` on the current tree, with both greps empty.

Check:

```bash
grep -c '^## Outcome$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -cE '^outcome: (parallel|shard)$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -cE '^\| parallel \| [123] \| 0 \| [0-9]' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `1`, `1`, and `3` when the outcome is `parallel`.

Rollback: delete the `## Outcome` section and the two `scratch/r19-collisions.log` and `scratch/r19-failures.log` files.

Stop and escalate if: the block prints `UNCLASSIFIED`, because a parallel row failed on an assertion with no collision token and that is a pre-existing red test, not a concurrency result.

---

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### T011 [x] Rewrite the config comment so it stops claiming both projects are serial (AC-002)

Done: outcome and skip-record checks returned `1` each; `git status` printed nothing for the vitest config.

File: `.skilled/skills/system-spec-kit/vitest.config.ts:14-17`, anchor:

```typescript
// gets its own project rooted at runtime/cli instead. Both projects
// carry the same timeout/parallelism settings as runtime/vitest.config.ts so a
// project picked up through this config never silently falls back to vitest's
// bare 5s default.
```

Change: replace those four lines with these six.

```typescript
// gets its own project rooted at runtime/cli instead. Both projects carry the
// same timeouts as runtime/vitest.config.ts so a project picked up through this
// config never silently falls back to vitest's bare 5s default.
// Only the CLI project runs its files in parallel: its suites that write build
// their own fixture roots, and serial execution made the project the longest
// step in the check job.
```

Run only when T010 recorded `outcome: parallel`. When it recorded `outcome: shard`, record `comment-rewrite: skipped` in `scratch/r19-probe.md` and go to T013.

Check:

```bash
grep -c 'Both projects carry the' .skilled/skills/system-spec-kit/vitest.config.ts
grep -c 'Only the CLI project runs its files in parallel' .skilled/skills/system-spec-kit/vitest.config.ts
grep -c 'parallelism' .skilled/skills/system-spec-kit/vitest.config.ts
```

Expected: `1`, `1`, `0`.

Rollback: replace the six new lines with the four anchor lines.

Stop and escalate if: the anchor text is not on the file, or `grep -c 'parallelism'` is not `0` after the edit.

---

### T012 [x] Set the CLI project to run its files in parallel (AC-002)

Done: skipped for `outcome: shard`; the outcome check returned `1`, and both project settings remained `fileParallelism: false` at lines `50` and `67`.

File: `.skilled/skills/system-spec-kit/vitest.config.ts:69-72`, the `cli` project's block. The line numbers are two higher than the file on disk today, because T011 replaced a four-line comment with six. Anchor: these four lines, which are unique because the last one names the project.

```typescript
          fileParallelism: false,
          testTimeout: TEST_TIMEOUT_MS,
          teardownTimeout: TEARDOWN_TIMEOUT_MS,
          name: 'cli',
```

Change: replace those four lines with these seven. The `fileParallelism: false` line at `:52` belongs to the `root` project and must not change.

```typescript
          // The suites that write build their own fixture roots under the OS
          // temp directory, and three consecutive parallel runs passed; serial
          // execution made this project the check job's longest step.
          fileParallelism: true,
          testTimeout: TEST_TIMEOUT_MS,
          teardownTimeout: TEARDOWN_TIMEOUT_MS,
          name: 'cli',
```

Run only when T010 recorded `outcome: parallel`. Leave the root project's `fileParallelism: false` at `:52` untouched.

Check:

```bash
grep -c 'fileParallelism: true' .skilled/skills/system-spec-kit/vitest.config.ts
grep -c 'fileParallelism: false' .skilled/skills/system-spec-kit/vitest.config.ts
.skilled/skills/system-spec-kit/node_modules/.bin/esbuild .skilled/skills/system-spec-kit/vitest.config.ts --loader=ts --outfile=/dev/null
grep -n -B4 'fileParallelism' .skilled/skills/system-spec-kit/vitest.config.ts
```

Expected: `1`, `1`, exit `0` from esbuild, and the `-B4` output shows `true` under `name: 'cli'` and `false` under `name: 'root'`.

Rollback: replace the four new lines with the anchor line.

Stop and escalate if: either count is not `1`, or esbuild exits non-zero.

---

### T013 [x] Replace the CLI vitest step's run block with two shards (AC-002)

Done: YAML parsing printed `YAML_OK`; shard, first-wait, second-wait and shell-option counts returned `2`, `1`, `1` and `1` for the count-based `--shard` block committed in `b2a1663ee9`. That block was later replaced, by operator ruling, with a hand-balanced split (the heavy `upgrade-legacy` file alone, and every other file through `--exclude`) with the same wait-and-propagate lines; the current counts are `--shard=` `0`, `--exclude` `1`, first-wait `1`, second-wait `1`, shell-option `1`.

File: `.github/workflows/spec-kit-check.yml:126-128`, step `CLI vitest project`, anchor:

```yaml
          set -euo pipefail
          cd .opencode/skills/system-spec-kit/runtime/cli
          npx vitest run --config ../../vitest.config.ts --project cli
```

Change: replace those three lines with these ten. `set -e` is deliberately absent: the guarded `wait ... || status=1` lines already collect both statuses, and an unguarded failure between launching the shards and the waits would abort the step while a shard still runs unobserved.

```yaml
          set -uo pipefail
          cd .opencode/skills/system-spec-kit/runtime/cli
          npx vitest run --config ../../vitest.config.ts --project cli --shard=1/2 &
          first=$!
          npx vitest run --config ../../vitest.config.ts --project cli --shard=2/2 &
          second=$!
          status=0
          wait "$first" || status=1
          wait "$second" || status=1
          exit "$status"
```

Run only when T010 recorded `outcome: shard`. Leave the `cli` project's `fileParallelism: false` at `vitest.config.ts:67` in place.

Check:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/spec-kit-check.yml'))" && echo YAML_OK
grep -c -- '--shard=' .github/workflows/spec-kit-check.yml
grep -c 'wait "\$first" || status=1' .github/workflows/spec-kit-check.yml
grep -c 'wait "\$second" || status=1' .github/workflows/spec-kit-check.yml
grep -c 'set -uo pipefail' .github/workflows/spec-kit-check.yml
```

Expected: `YAML_OK`, `2`, `1`, `1`, `1`.

Rollback: replace the ten new lines with the three anchor lines.

Stop and escalate if: the anchor text is not on the file, or any count differs.

---

### T014 [x] Prove both shard halves pass locally (AC-002)

Done: `half=1/2 exit=0` and `half=2/2 exit=0`; shard checks returned `2` and `2`, with logs showing `91 passed | 1 skipped` and `89 passed | 2 skipped`. The halves ran one after the other locally (145.13 s then 561.58 s) and run concurrently on the CI runner, so these seconds do not predict the CI step time.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md`, anchor: the `outcome: shard` line written by T010.

Change: run each half once, sequentially, and append two rows `| shard | 1/2 | <exit> | <seconds> | r19-shard-1-2.log |` and `| shard | 2/2 | <exit> | <seconds> | r19-shard-2-2.log |`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
for half in 1/2 2/2; do
  name=$(echo "$half" | tr '/' '-')
  ( cd .skilled/skills/system-spec-kit/runtime/cli && /usr/bin/time -p npx vitest run --config ../../vitest.config.ts --project cli --shard="$half" > "$PHASE/scratch/r19-shard-$name.log" 2>&1 )
  code=$?
  real=$(awk '/^real /{print $2}' "$PHASE/scratch/r19-shard-$name.log" | tail -1)
  printf '| shard | %s | %s | %s | r19-shard-%s.log |\n' "$half" "$code" "$real" "$name" >> "$PHASE/scratch/r19-probe.md"
  echo "half=$half exit=$code"
done
```

Expected: `half=1/2 exit=0` and `half=2/2 exit=0`.

Check:

```bash
grep -c '^| shard |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
grep -cE '^\| shard \| [12]/2 \| 0 \| [0-9]' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md
```

Expected: `2` and `2`.

Rollback: delete the two `| shard |` rows and the two `scratch/r19-shard-*.log` files.

Stop and escalate if: either half exits non-zero.

---

### T015 [x] Pull the latest 40 deep-loop-runtime runs (AC-004)

Done: `40 ['failure', 'success']`; task check printed `RUNS_40`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-runs.json` (new file). Anchor: none; the file does not exist yet.

Change: write the run list to that file.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
gh run list --workflow deep-loop-runtime.yml --limit 40 --json databaseId,headSha,createdAt,conclusion > "$PHASE/scratch/r21-deep-loop-runtime-runs.json"
python3 -c "import json; d=json.load(open('$PHASE/scratch/r21-deep-loop-runtime-runs.json')); print(len(d), sorted({r['conclusion'] for r in d}))"
```

Expected: `40 ['failure', 'success']`.

Check:

```bash
python3 -c "import json,sys; d=json.load(open('specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-runs.json')); sys.exit(0 if len(d)==40 else 1)" && echo RUNS_40
```

Expected: `RUNS_40`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-runs.json`.

Stop and escalate if: `gh` exits non-zero, or the length is not `40`.

---

### T016 [x] Pull the latest 40 diagram-corpus runs (AC-004)

Done: `40 ['failure', 'success']`; task check printed `RUNS_40`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-runs.json` (new file). Anchor: none; the file does not exist yet.

Change: write the run list to that file.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
gh run list --workflow diagram-corpus.yml --limit 40 --json databaseId,headSha,createdAt,conclusion > "$PHASE/scratch/r21-diagram-corpus-runs.json"
python3 -c "import json; d=json.load(open('$PHASE/scratch/r21-diagram-corpus-runs.json')); print(len(d), sorted({r['conclusion'] for r in d}))"
```

Expected: `40 ['failure', 'success']`.

Check:

```bash
python3 -c "import json,sys; d=json.load(open('specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-runs.json')); sys.exit(0 if len(d)==40 else 1)" && echo RUNS_40
```

Expected: `RUNS_40`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-runs.json`.

Stop and escalate if: `gh` exits non-zero, or the length is not `40`.

---

### T017 [x] Pull the latest 40 skill-advisor-stress runs (AC-004)

Done: `39 ['failure', 'success']`; task check printed `RUNS_IN_RANGE`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-runs.json` (new file). Anchor: none; the file does not exist yet.

Change: write the run list to that file.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
gh run list --workflow skill-advisor-stress.yml --limit 40 --json databaseId,headSha,createdAt,conclusion > "$PHASE/scratch/r21-skill-advisor-stress-runs.json"
python3 -c "import json; d=json.load(open('$PHASE/scratch/r21-skill-advisor-stress-runs.json')); print(len(d), sorted({r['conclusion'] for r in d}))"
```

Expected: `36 ['failure', 'success']` today, because the workflow holds 36 runs in its history.

Check:

```bash
python3 -c "import json,sys; d=json.load(open('specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-runs.json')); sys.exit(0 if 36 <= len(d) <= 40 else 1)" && echo RUNS_IN_RANGE
```

Expected: `RUNS_IN_RANGE`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-runs.json`.

Stop and escalate if: `gh` exits non-zero, or the length is below `36`.

---

### T018 [x] Write the re-check tables (AC-004)

Done: `{'deep-loop-runtime': (40, 14, 0), 'diagram-corpus': (40, 12, 3), 'skill-advisor-stress': (39, 10, 6)}` at the first pull; skill-advisor-stress was re-pulled later on 2026-10-24 and now reads `(40, 10, 7)`; checks returned `3`, `3`, `3`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md` (new file). Anchor: none; the file does not exist yet.

Change: write the heading, one summary table with one row per workflow, and one run table per workflow. The script computes the counts and the newest green streak from the three JSON files.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
python3 - "$PHASE" <<'PY'
import json, sys
from pathlib import Path

phase = Path(sys.argv[1])
workflows = ['deep-loop-runtime', 'diagram-corpus', 'skill-advisor-stress']
out = ['# R21 re-check', '', '## Summary', '',
       '| workflow | runs | failures | newest green streak |',
       '|---|---|---|---|']
rows = {}
for wf in workflows:
    runs = json.loads((phase / f'scratch/r21-{wf}-runs.json').read_text())
    failures = sum(1 for r in runs if r['conclusion'] == 'failure')
    streak = 0
    for r in runs:
        if r['conclusion'] != 'success':
            break
        streak += 1
    rows[wf] = (len(runs), failures, streak)
    out.append(f'| {wf} | {len(runs)} | {failures} | {streak} |')
for wf in workflows:
    out += ['', f'## {wf} runs', '',
            '| run id | createdAt | headSha | conclusion |',
            '|---|---|---|---|']
    for r in json.loads((phase / f'scratch/r21-{wf}-runs.json').read_text()):
        out.append(f"| {r['databaseId']} | {r['createdAt']} | {r['headSha'][:7]} | {r['conclusion']} |")
out.append('')
(phase / 'scratch/r21-recheck.md').write_text('\n'.join(out))
print(rows)
PY
```

Expected: `{'deep-loop-runtime': (40, 13, 3), 'diagram-corpus': (40, 12, 1), 'skill-advisor-stress': (36, 10, 3)}`.

Check:

```bash
grep -cE '^## (deep-loop-runtime|diagram-corpus|skill-advisor-stress) runs$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
grep -c '^| run id | createdAt | headSha | conclusion |$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
grep -cE '^\| (deep-loop-runtime|diagram-corpus|skill-advisor-stress) \| [0-9]+ \| [0-9]+ \| [0-9]+ \|$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
```

Expected: `3`, `3`, `3`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`.

Stop and escalate if: a JSON file is missing, or the script raises.

---

### T019 [x] Read deep-loop-runtime's failed logs (AC-004)

Done: `wc -l` returned `41`; checks printed `EXTRACT_PRESENT` and `38` `STALE_SOURCE_DIGEST` lines naming `deep/ai-council`, `deep/review` and `deep/research`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-failures.log` (new file). Anchor: none; the file does not exist yet.

Change: extract the terminal failure lines from every failed run in the window.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
: > "$PHASE/scratch/r21-deep-loop-runtime-failures.log"
for id in $(python3 -c "import json;print(' '.join(str(r['databaseId']) for r in json.load(open('$PHASE/scratch/r21-deep-loop-runtime-runs.json')) if r['conclusion']=='failure'))"); do
  gh run view "$id" --log-failed 2>/dev/null | sed $'s/\x1b\[[0-9;]*m//g' | grep -E 'FAIL |Error:|STALE_|RESULT: FAILED' | tail -3 >> "$PHASE/scratch/r21-deep-loop-runtime-failures.log"
done
wc -l < "$PHASE/scratch/r21-deep-loop-runtime-failures.log"
```

Expected: a non-zero line count, and the extract names `check-contract-drift.vitest.ts` and `STALE_SOURCE_DIGEST`.

Check:

```bash
test -s specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-failures.log && echo EXTRACT_PRESENT
grep -c 'STALE_SOURCE_DIGEST' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-failures.log
```

Expected: `EXTRACT_PRESENT` and at least `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-deep-loop-runtime-failures.log`.

Stop and escalate if: the extract is empty.

---

### T020 [x] Read diagram-corpus's failed logs (AC-004)

Done: `wc -l` returned `34`; checks printed `EXTRACT_PRESENT`, `11` `outside the anchor's` lines and `11` `scripts/README.md` lines.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-failures.log` (new file). Anchor: none; the file does not exist yet.

Change: extract the terminal failure lines from every failed run in the window.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
: > "$PHASE/scratch/r21-diagram-corpus-failures.log"
for id in $(python3 -c "import json;print(' '.join(str(r['databaseId']) for r in json.load(open('$PHASE/scratch/r21-diagram-corpus-runs.json')) if r['conclusion']=='failure'))"); do
  gh run view "$id" --log-failed 2>/dev/null | sed $'s/\x1b\[[0-9;]*m//g' | grep -E 'FAIL \[|RESULT: FAILED|Summary: errors' | tail -3 >> "$PHASE/scratch/r21-diagram-corpus-failures.log"
done
wc -l < "$PHASE/scratch/r21-diagram-corpus-failures.log"
```

Expected: a non-zero line count, and the extract names `scripts/README.md` and `outside the anchor's`.

Check:

```bash
test -s specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-failures.log && echo EXTRACT_PRESENT
grep -c "outside the anchor's" specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-failures.log
```

Expected: `EXTRACT_PRESENT` and at least `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-diagram-corpus-failures.log`.

Stop and escalate if: the extract is empty.

---

### T021 [x] Read skill-advisor-stress's failed logs (AC-004)

Done: `wc -l` returned `28`; checks printed `EXTRACT_PRESENT`, `21` `default is not a function` lines and `1` `opencode-plugin-bridge-stress.vitest.ts` line.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-failures.log` (new file). Anchor: none; the file does not exist yet.

Change: extract the terminal failure lines from every failed run in the window.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
: > "$PHASE/scratch/r21-skill-advisor-stress-failures.log"
for id in $(python3 -c "import json;print(' '.join(str(r['databaseId']) for r in json.load(open('$PHASE/scratch/r21-skill-advisor-stress-runs.json')) if r['conclusion']=='failure'))"); do
  gh run view "$id" --log-failed 2>/dev/null | sed $'s/\x1b\[[0-9;]*m//g' | grep -E 'FAIL |TypeError|AssertionError' | tail -3 >> "$PHASE/scratch/r21-skill-advisor-stress-failures.log"
done
wc -l < "$PHASE/scratch/r21-skill-advisor-stress-failures.log"
```

Expected: a non-zero line count, and the extract names `opencode-plugin-bridge-stress.vitest.ts` and `default is not a function`.

Check:

```bash
test -s specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-failures.log && echo EXTRACT_PRESENT
grep -c 'default is not a function' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-failures.log
```

Expected: `EXTRACT_PRESENT` and at least `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-skill-advisor-stress-failures.log`.

Stop and escalate if: the extract is empty.

---

### T022 [x] Write the root-cause table (AC-004)

Done: oldest failures `b4d4e90`, `f3b4e90`, `7c65ed8` as expected; checks returned `1` and `4` (one row per distinct class — deep-loop-runtime carries both `STALE_SOURCE_DIGEST` and a new `dependency-seams` zod-pin assertion first seen at `e4af508`, which is already aligned on this tree).

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the last `| skill-advisor-stress |` summary row.

Change: append the heading `## Root causes`, the table header `| workflow | failing test | error class | first failing SHA | action |`, the divider, and one row per distinct class the three extracts name. The first failing SHA is the `headSha` of the oldest failed run in that workflow's window that carries the class.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
for wf in deep-loop-runtime diagram-corpus skill-advisor-stress; do
  echo -n "$wf oldest failure: "
  python3 -c "import json;d=json.load(open('$PHASE/scratch/r21-$wf-runs.json'));f=[r for r in d if r['conclusion']=='failure'];print((f[-1]['createdAt'], f[-1]['headSha'][:7]) if f else 'none')"
done
```

Expected today: `deep-loop-runtime` `('2026-10-12T09:01:37Z', 'b4d4e90')`; `diagram-corpus` `('2026-10-12T05:01:38Z', 'f3b4e90')`; `skill-advisor-stress` `('2026-10-05T15:51:09Z', '7c65ed8')`.

Then append the rows, one per workflow whose extract names a class:

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
cat >> "$PHASE/scratch/r21-recheck.md" <<'EOF'

## Root causes

| workflow | failing test | error class | first failing SHA | action |
|---|---|---|---|---|
| deep-loop-runtime | tests/unit/check-contract-drift.vitest.ts | STALE_SOURCE_DIGEST | b4d4e90 | regenerate the contract, then fail fast |
| diagram-corpus | scripts/README.md | version outside the anchor era | f3b4e90 | correct the version line |
| skill-advisor-stress | stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | TypeError: default is not a function | 7c65ed8 | align the default import with the dual export |
EOF
```

Replace any cell with what the extract actually reads. A class that is not in the extract gets no row. The action cells in the shipped `r21-recheck.md` were rewritten to what happened: the drift verdict was `fresh`, and diagram-corpus and skill-advisor-stress closed on green runs with no file change.

Check:

```bash
grep -c '^## Root causes$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
sed -n '/^## Root causes/,/^## /p' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md | grep -cE '^\| (deep-loop-runtime|diagram-corpus|skill-advisor-stress) \|'
```

Expected: `1` and a count equal to the number of failure classes the extracts name, which is `4` today: three workflows have failures, and deep-loop-runtime carries two classes.

Rollback: delete the `## Root causes` section.

Stop and escalate if: a workflow has a non-zero failure count and its extract names no class.

---

### T023 [x] Run the drift checker and record its verdict (AC-009)

Done: checker printed `[CONTRACT DRIFT] OK commands=3` with `exit=0`; checks returned `1` and `1` with `drift-verdict: fresh` recorded.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the last `## Root causes` row.

Change: run the checker on the current tree and append a `## Contract drift` section with the command, its exit code and one line, `drift-verdict: fresh` or `drift-verdict: stale`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs; code=$?
echo "exit=$code"
printf '\n## Contract drift\n\ncommand: node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs\ndrift-verdict: %s\n' "$([ "$code" -eq 0 ] && echo fresh || echo stale)" >> "$PHASE/scratch/r21-recheck.md"
```

Expected on the current tree: `OK commands=3` and `exit=0`, so `drift-verdict: fresh`.

Check:

```bash
grep -c '^## Contract drift$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
grep -cE '^drift-verdict: (fresh|stale)$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
```

Expected: `1` and `1`.

Rollback: delete the `## Contract drift` section.

Stop and escalate if: the checker exits with a code other than `0` or `2`.

---

### T024 [x] Regenerate the compiled contract when the verdict is stale (AC-009)

Done: skipped on `drift-verdict: fresh`; `regeneration: not required` appended to the `## Contract drift` section.

File: `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`, anchor: `  "id": "deep/ai-council",` at line 4 inside the generated header.

Change: regenerate every command the failure extract names, which rewrites the three contract files.

```bash
for c in deep/ai-council deep/review deep/research; do
  node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command "$c" --write
done
node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
echo "exit=$?"
git status --short .skilled/commands/deep/assets/compiled/
```

Run only when T023 recorded `drift-verdict: stale`. When it recorded `fresh`, append `regeneration: not required` to the `## Contract drift` section and go to T025.

Expected: `OK commands=3`, `exit=0`, and at most three modified files under `.skilled/commands/deep/assets/compiled/`.

Check:

```bash
node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
git status --short .skilled/commands/deep/assets/compiled/ | wc -l
```

Expected: `OK commands=3` with exit `0`, and a count of `3` or less.

Rollback: `git checkout -- .skilled/commands/deep/assets/compiled/`.

Stop and escalate if: the checker still exits `2` after the three writes.

---

### T025 [x] Add the fast-fail drift step before the suite (AC-009)

Done: `YAML_OK`; `check-contract-drift` count `1`; checker at line `66`, suite step at `68`.

File: `.github/workflows/deep-loop-runtime.yml:59`, step `Run the deep-loop runtime suites`, anchor:

```yaml
      - name: Run the deep-loop runtime suites
        run: npm --prefix .opencode/skills/system-deep-loop/runtime test
```

Change: insert these four lines immediately before the anchor.

```yaml
      # A stale compiled contract fails the suite after the whole run. Checking
      # the same fact first fails in seconds and names the contract to rebuild.
      - name: Refuse a stale compiled command contract before the full suite
        run: node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
```

Check:

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deep-loop-runtime.yml'))" && echo YAML_OK
grep -c 'check-contract-drift' .github/workflows/deep-loop-runtime.yml
grep -n 'check-contract-drift\|- name: Run the deep-loop runtime suites' .github/workflows/deep-loop-runtime.yml
```

Expected: `YAML_OK`, `1`, and the checker line is above the suite step's line.

Rollback: delete the four inserted lines.

Stop and escalate if: the anchor text is not on the file, or the checker line is below the suite step.

---

### T026 [x] Prove the fast-fail step fails on a stale contract (AC-009)

Done: swapped `b1f6c78` contract printed `class=STALE_SOURCE_DIGEST` for `deep/ai-council` with `exit=2`; restored file printed `OK commands=3` with `exit=0`; `git status --short` empty; checks returned `1` and `0`.

File: `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`, anchor: the `"sha256"` line for `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md`.

Change: write the `b1f6c78` version of the contract over the current one, run the checker, then restore the current file and prove it is byte-identical.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
cp .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/deep-ai-council.contract.current
git show b1f6c78:.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown > .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown
node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs; echo "exit=$?"
cp /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/deep-ai-council.contract.current .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown
node .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs; echo "exit=$?"
git status --short .skilled/commands/deep/assets/compiled/
```

Expected: the first run prints `class=STALE_SOURCE_DIGEST` and `deep/ai-council` with `exit=2`; the second prints `OK commands=3` with `exit=0`; `git status --short` prints nothing.

Then append one line to the `## Contract drift` section:

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
printf 'negative-proof: exit 2 then exit 0\n' >> "$PHASE/scratch/r21-recheck.md"
```

Check:

```bash
grep -c '^negative-proof: exit 2 then exit 0$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
git status --short .skilled/commands/deep/assets/compiled/ | wc -l
```

Expected: `1` and `0`.

Rollback: `cp /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/deep-ai-council.contract.current .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown`, then `git checkout -- .skilled/commands/deep/assets/compiled/`.

Stop and escalate if: the first exit is not `2`, the second is not `0`, or the restored file is not byte-identical.

---

### T027 [x] Close diagram-corpus on its newest run, or correct its version line (AC-004)

Done: newest run `{"conclusion":"success","databaseId":40027063626}`; appended `diagram-corpus: closed on the newest green run 40027063626`; checks returned `1` and `RESULT: PASSED`.

File: `.skilled/skills/sk-design/sk-design-diagram/scripts/README.md:9`, anchor: `version: 1.2.0.1`.

Change: read the newest run. When it is `success`, append `diagram-corpus: closed on the newest green run <run-id>` to `scratch/r21-recheck.md` and edit nothing. When it is `failure`, set the version's major.minor to the anchor's era in `.skilled/skills/sk-design/sk-design-diagram/SKILL.md` (`1.2` today), keeping the patch number.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
RUN=$(gh run list --workflow diagram-corpus.yml --limit 1 --json databaseId --jq '.[0].databaseId')
gh run list --workflow diagram-corpus.yml --limit 1 --json databaseId,conclusion --jq '.[0]'
gh run view "$RUN" --log-failed 2>/dev/null | sed $'s/\x1b\[[0-9;]*m//g' | grep -E 'FAIL \[|RESULT: FAILED' | tail -3
```

Expected today: `{"databaseId":...,"conclusion":"success"}`, so the record line is appended and the README is not edited.

Check:

```bash
grep -c '^version: 1\.2\.' .skilled/skills/sk-design/sk-design-diagram/scripts/README.md
( cd .skilled/skills/sk-design/sk-design-diagram && node scripts/check-diagram-corpus.cjs | tail -1 )
```

Expected: `1` and `RESULT: PASSED`.

Rollback: restore the anchor line, then `git checkout -- .skilled/skills/sk-design/sk-design-diagram/scripts/README.md`.

Stop and escalate if: the newest run is `failure` and the log names a family other than `metadata`, or the checker still prints `RESULT: FAILED` after the version change.

---

### T028 [x] Close skill-advisor-stress on its newest run, or align its default import (AC-004)

Done: newest run `{"conclusion":"success","databaseId":40089725675}`; appended `skill-advisor-stress: closed on the newest green run 40089725675`; stress suite `Test Files 21 passed (21)`, `Tests 65 passed (65)`; import count `1`.

File: `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts:20`, anchor:

```typescript
import skillAdvisorPlugin from '../../../../../plugins/system-skill-advisor.js';
```

Change: read the newest run. When it is `success`, append `skill-advisor-stress: closed on the newest green run <run-id>` to `scratch/r21-recheck.md` and edit nothing. When it fails with `default is not a function`, align the import at `:20` and the three assertions at `:101-104` with the plugin's `export default dualPlugin('system-skill-advisor', MkSkillAdvisorPlugin)` at `.skilled/plugins/system-skill-advisor.js:1624`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
RUN=$(gh run list --workflow skill-advisor-stress.yml --limit 1 --json databaseId --jq '.[0].databaseId')
gh run list --workflow skill-advisor-stress.yml --limit 1 --json databaseId,conclusion --jq '.[0]'
gh run view "$RUN" --log-failed 2>/dev/null | sed $'s/\x1b\[[0-9;]*m//g' | grep -E 'FAIL |TypeError' | tail -3
```

Expected today: `{"databaseId":...,"conclusion":"success"}`, so the record line is appended and the test is not edited.

Check:

```bash
( cd .skilled/skills/system-skill-advisor/runtime && npm run test:stress -- --config vitest.stress.config.ts 2>&1 | tail -5 )
grep -c "import skillAdvisorPlugin from '../../../../../plugins/system-skill-advisor.js';" .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts
```

Expected: the stress run reports no failed file, and the import count is `1`.

Rollback: restore the anchor line and the three assertions, then `git checkout -- .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`.

Stop and escalate if: the newest run fails with a class other than `default is not a function`, or the stress suite still fails after the alignment.

---

### T029 [x] Confirm the five single old failures are stale (AC-005)

Done, Stop-if fired and ruled by the operator: re-pulled on 2026-10-24 with `gh run list --limit 100`. Four workflows match the expected date and SHA (`repo-rules-corpus` 2026-09-18 `6cbaf58`, `chart-corpus` 2026-10-12 `f3b4e90`, `opencode-dual-version` 2026-10-20 `7584ad7`, `strict-pass-freshness-report` 2026-09-07 `bbf1ffa`). `routing-registry-drift` fired the Stop-if (a failure newer than the expected date): it failed on 2026-10-24 at `e3beac6` (run 40089268105) and `db30b0f` (run 40089318887) with `STALE COMPILED: skill-graph.json generated_at 2026-10-17T10:21:42 is older than the newest source stamp 2026-10-24T00:00:00Z (sk-code)`. The fix is `1218b94938`, and all 15 workflow runs on it are `success`, including routing-registry-drift run 40089725657. The operator ruled on 2026-10-24 to close the workflow on this evidence; its row records the 2026-10-24 failures, the cause and the fix (ADR-010 amendment). Checks returned `5` and `5`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the `negative-proof: exit 2 then exit 0` line.

Change: append the heading `## Stale failures`, the table header `| workflow | failure date | failure SHA | failure run | later green run | verdict |`, the divider, and one row per workflow, ending in `closed`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
for w in repo-rules-corpus chart-corpus opencode-dual-version routing-registry-drift strict-pass-freshness-report; do
  echo "=== $w"
  gh run list --workflow "$w.yml" --limit 100 --json databaseId,createdAt,headSha,conclusion --jq '[.[] | select(.conclusion=="failure")][0] | {databaseId, createdAt, sha: .headSha[0:7]}'
  gh run list --workflow "$w.yml" --limit 1 --json databaseId,createdAt,conclusion --jq '.[0] | {databaseId, createdAt, conclusion}'
done
```

Expected at planning time: `repo-rules-corpus` fails on `2026-09-18` at `6cbaf58`; `chart-corpus` on `2026-10-12` at `f3b4e90`; `opencode-dual-version` on `2026-10-20` at `7584ad7`; `routing-registry-drift` on `2026-10-17` at `407de0d`; `strict-pass-freshness-report` on `2026-09-07` at `bbf1ffa`. Every newest run is `success`. Observed on 2026-10-24: the same, except `routing-registry-drift`, whose newest failures are `e3beac6` and `db30b0f` on 2026-10-24.

Check:

```bash
grep -cE '^\| (repo-rules-corpus|chart-corpus|opencode-dual-version|routing-registry-drift|strict-pass-freshness-report) \|' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
grep -c '| closed |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
```

Expected: `5` and `5`.

Rollback: delete the `## Stale failures` section.

Stop and escalate if: a workflow shows no failure in its last 100 runs, or a failure is newer than the date above.

---

### T030 [x] Prove no retry was added (AC-007)

Done: re-run on 2026-10-24 and scoped to the workflow files, because an unscoped `git diff -U0` also matches this packet's own documents. `rg -n 'retry|rerun|continue-on-error'` over the three workflows printed nothing (`wc -l` returned `0`); `git diff -U0 -- .github/workflows | grep -cE '^\+.*(retry|rerun|continue-on-error)'` returned `0`; `## No-retry proof` and `retry-proof: clean` are in `scratch/r21-recheck.md` (count `1`).

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the last `| closed |` row.

Change: append the heading `## No-retry proof`, the two commands' outputs and one line, `retry-proof: clean`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
{
  printf '\n## No-retry proof\n\n'
  rg -n 'retry|rerun|continue-on-error' .github/workflows/deep-loop-runtime.yml .github/workflows/diagram-corpus.yml .github/workflows/skill-advisor-stress.yml || true
  git diff -U0 -- .github/workflows | grep -nE '^\+.*(retry|rerun|continue-on-error)' || true
  printf 'retry-proof: clean\n'
} >> "$PHASE/scratch/r21-recheck.md"
```

Expected: the two searches print nothing, so only the heading and the proof line are appended.

Check:

```bash
grep -c '^retry-proof: clean$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
rg -n 'retry|rerun|continue-on-error' .github/workflows/deep-loop-runtime.yml .github/workflows/diagram-corpus.yml .github/workflows/skill-advisor-stress.yml | wc -l
git diff -U0 -- .github/workflows | grep -cE '^\+.*(retry|rerun|continue-on-error)'
```

Expected: `1`, `0`, and `0`.

Rollback: delete the `## No-retry proof` section.

Stop and escalate if: either search prints a line.

---

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### T031 [x] Run the workflow gates (AC-008)

Done: reran on 2026-10-24. `check-gate-inputs: 54 passed, 0 failed`; the real-tree gate printed `files=45 inputs_resolved=236 dynamic_inputs=9 twin_pairs=340 failures=0` and `RESULT: PASSED`; `YAML_OK`. The three `grep -c` checks on `scratch/gate-run.log` returned `1`, `1`, `1`. The log is gitignored, so the deciding lines are quoted in `scratch/gate-run.md`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/gate-run.log` (new file). Anchor: none; the file does not exist yet.

Change: run the fixture suite, the real-tree gate and the YAML parse, and write all three outputs to the log.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
bash .github/scripts/tests/check-gate-inputs.test.sh 2>&1 | tee "$PHASE/scratch/gate-run.log" | tail -1
bash .github/scripts/check-gate-inputs.sh 2>&1 | tee -a "$PHASE/scratch/gate-run.log" | tail -1
python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]" && echo YAML_OK | tee -a "$PHASE/scratch/gate-run.log"
```

Expected: the fixture suite's last line reads `check-gate-inputs: <N> passed, 0 failed`; the gate's last line reads `RESULT: PASSED`; `YAML_OK`.

Check:

```bash
grep -cE '^check-gate-inputs: [0-9]+ passed, 0 failed$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/gate-run.log
grep -c '^RESULT: PASSED$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/gate-run.log
grep -c '^YAML_OK$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/gate-run.log
```

Expected: `1`, `1`, `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/gate-run.log`.

Stop and escalate if: either script prints `RESULT: FAILED`, or the YAML parse exits non-zero.

---

### T032 [x] Commit the R20 change as one commit (AC-002, AC-010)

Done: committed as `b2a1663ee9`, subject `ci(system-spec-kit): shard the CLI vitest project in the check job`; the diff and the message carry no ephemeral id (`grep -cE` returned `0`). Deviation: the scripted body said the parallel runs "collided on a fixture", but the probe found no collision (the collision log is empty) and two of three parallel runs hit a 30 s test timeout under load. The committed body states that true cause: `two of three parallel runs timed out under load while the serial run passed, so file parallelism is not safe yet and each shard stays serial inside`. Both shard halves run serially inside, so only `--shard=` literals changed in `spec-kit-check.yml`; `vitest.config.ts` is untouched.

File: `.skilled/skills/system-spec-kit/vitest.config.ts`, and under the shard path also `.github/workflows/spec-kit-check.yml`. Anchor: none; this task commits work already on disk.

Change: stage only the R20 files, write the message for the recorded outcome, validate it, prove no ephemeral id entered the diff, then commit.

```bash
if grep -q '^outcome: shard$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r19-probe.md; then
  git add .skilled/skills/system-spec-kit/vitest.config.ts .github/workflows/spec-kit-check.yml
  cat > /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r20-commit.txt <<'MSG'
ci(system-spec-kit): shard the CLI vitest project in the check job

Two shards replace one serial run because three parallel runs collided on a
fixture that the shards now keep apart.

Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
MSG
else
  git add .skilled/skills/system-spec-kit/vitest.config.ts
  cat > /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r20-commit.txt <<'MSG'
ci(system-spec-kit): run the CLI vitest project in parallel

The cli project ran its 183 files one at a time and made the check job's
longest step 791 s. Three consecutive parallel runs passed, so the project
now runs its files in parallel, while the root project stays serial because
its suites share mutable state.

Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
MSG
fi
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r20-commit.txt
git diff --cached | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
git commit -F /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r20-commit.txt
git log -1 --format=%s
```

Expected: the validator exits `0`; the ephemeral-id grep prints nothing; `git log -1 --format=%s` prints the subject.

Check:

```bash
git log -1 --format=%s | grep -cE '^ci\(system-spec-kit\): (run the CLI vitest project in parallel|shard the CLI vitest project in the check job)$'
git status --short .skilled/skills/system-spec-kit/vitest.config.ts .github/workflows/spec-kit-check.yml | wc -l
```

Expected: `1` and `0`.

Rollback: `git reset --soft HEAD~1`, which undoes the commit and keeps the change staged.

Stop and escalate if: the message validator exits non-zero, or the ephemeral-id grep prints a line.

---

### T033 [x] Commit the R21 fixes when they changed a file (AC-004, AC-009, AC-010)

Done: the only R21 file that changed, `.github/workflows/deep-loop-runtime.yml` (T024, T027 and T028 changed nothing), is committed as `e094a852ed` under the subject below. Re-checked 2026-10-25: the message passes `validate-message.mjs --commit` with exit `0`, the ephemeral-id grep prints `0`, the trailer grep prints `1`, and `git status --short -- .skilled/commands/deep/assets/compiled/ .github/workflows/deep-loop-runtime.yml` prints nothing. The message validated with `validate-message.mjs --commit` and carries no ephemeral id:

```text
ci(system-deep-loop): refuse a stale command contract before the full suite

A stale compiled contract failed the suite only after the whole run. The
drift checker now runs first, so the same fact fails in seconds and names
the contract to rebuild.

Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
```

The checker on the current tree printed `[CONTRACT DRIFT] OK commands=3` with `exit=0`, and `.github/workflows/deep-loop-runtime.yml:66` runs it above the suite step.

File: the R21 files that T024, T025, T027 and T028 changed. Anchor: none; this task commits work already on disk.

Change: stage those files and commit them under the deep-loop subject, because T025 always changes `deep-loop-runtime.yml`. When T024 also regenerated the contract, add one body line before the trailer in the heredoc below: `The deep/ai-council contract is regenerated from its sources.` When T027 or T028 changed a file, add one body line naming that fix. When no R21 file changed, append `r21-commit: none` to `scratch/r21-recheck.md` and go to T034.

```bash
if git status --short .skilled/commands/deep/assets/compiled/ .github/workflows/deep-loop-runtime.yml .skilled/skills/sk-design/sk-design-diagram/scripts/README.md .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | grep -q .; then
  git add .skilled/commands/deep/assets/compiled/ .github/workflows/deep-loop-runtime.yml .skilled/skills/sk-design/sk-design-diagram/scripts/README.md .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts
  cat > /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r21-commit.txt <<'MSG'
ci(system-deep-loop): refuse a stale command contract before the full suite

A stale compiled contract failed the suite only after the whole run. The
drift checker now runs first, so the same fact fails in seconds and names
the contract to rebuild.

Spec: system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
MSG
  node .skilled/skills/sk-git/scripts/validate-message.mjs --commit /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r21-commit.txt
  git diff --cached | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]' || true
  git commit -F /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/r21-commit.txt
  git log -1 --format=%s
else
  echo "r21-commit: none" >> specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
fi
```

Expected: the validator exits `0`, the ephemeral-id grep prints nothing, and `git log -1 --format=%s` prints `ci(system-deep-loop): refuse a stale command contract before the full suite`.

Check:

```bash
git log -1 --format=%s | grep -cE '^ci\(system-deep-loop\): refuse a stale command contract before the full suite$'
git status --short .skilled/commands/deep/assets/compiled/ .github/workflows/deep-loop-runtime.yml | wc -l
```

Expected: `1` and `0`.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the message validator exits non-zero, or the ephemeral-id grep prints a line.

---

### T034 [x] Measure the CLI step on the post-change runs and judge its median (AC-003)

Done, with the bar not met and the row waived. The operator ruled on 2026-10-24 (decision-record ADR-003 amendment) that AC-003 is judged on the median of the five green `Spec-Kit Check` runs on main that T035 collects, and not on the first run alone. The count-based split read 643 s (run 40090109005) and 482 s (run 40094302049), both over 400 s and superseded. Five runs have used the rebalanced split and all are green: 40102448836 at 75b27df21c read 459 s, 40107239895 at e00fef3e76 read 299 s, 40123498034 at 1c0c3534cf read 313 s, 40125544852 at 666844f806 read 451 s and 40147796034 at 8ff7da700d read 467 s, against 791 s in run 39909844384. Every head contains 04d9b0c84f. The median is 451 s and the awk check below prints `NOT_MET` with exit `1`. The five `| after |` rows are written in `scratch/r20-ci-step.md`. The Stop-if below fired, and the operator ruled on 2026-10-25 to close AC-003 by waiver (ADR-011) instead of a further re-measure, so the Expected line below is the original bar and was not reached.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md`, anchor: the `post-change-runs:` line.

Change: for each `Spec-Kit Check` push run on main since 75b27df21c, oldest first, whose head contains 04d9b0c84f and which is green, append one row `| after | <run id> | <head sha> | <conclusion> | <seconds> |`. Stop at five rows.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
gh run list --workflow spec-kit-check.yml --branch main --event push --limit 30 --json databaseId,headSha,conclusion,createdAt --jq 'sort_by(.createdAt) | .[] | "\(.databaseId) \(.headSha)"'
RUN=<run id>
gh run view "$RUN" --json jobs --jq '.jobs[] | select(.name | startswith("Typecheck")) | .steps[] | select(.name == "CLI vitest project") | {conclusion, seconds: (((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601)))}'
git merge-base --is-ancestor 04d9b0c84f <head sha> && echo COUNTS
```

Expected: `"conclusion":"success"` and `COUNTS` for each row appended, and five rows in all.

Check:

```bash
grep -c '^| after |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md
awk -F'[|]' '/^\| after \|/ {gsub(/ /,"",$6); v[++n]=$6+0} END {for(i=2;i<=n;i++){x=v[i];j=i-1;while(j>0&&v[j]>x){v[j+1]=v[j];j--};v[j+1]=x} if(n==5&&v[3]<400){print "MEDIAN_UNDER_400";exit 0} print "NOT_MET";exit 1}' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md
```

Expected: `5` and `MEDIAN_UNDER_400`.

Rollback: delete the `| after |` rows.

Stop and escalate if: the median of five reads `400` s or more, because the shard in T013 and T014 is then re-measured and the ceiling is not relaxed.

---

### T035 [x] Confirm 5 consecutive green Spec-Kit Check runs (AC-003)

Done: five runs exist (`post-change-runs: 5 of 5` in `scratch/r20-ci-step.md`, runs 40102448836, 40107239895, 40123498034, 40125544852 and 40147796034, all green, every head containing 04d9b0c84f). The `## Green streak` section and `all_green: true` were written from those five run ids with `gh run view`, not with the `gh run list --limit 5` command in the block below, because the five newest runs of the workflow now include a red run (40149635448) and a later green run (40170908787) that are not part of the five. The check returned `1` and `5`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md`, anchor: the `| after |` row.

Change: append the heading `## Green streak`, one row per run `| <run id> | <createdAt> | <headSha> | <conclusion> |`, and one line `all_green: true`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
{
  printf '\n## Green streak\n\n| run id | createdAt | headSha | conclusion |\n|---|---|---|---|\n'
  gh run list --workflow spec-kit-check.yml --limit 5 --json databaseId,createdAt,headSha,conclusion --jq '.[] | "| \(.databaseId) | \(.createdAt) | \(.headSha[0:7]) | \(.conclusion) |"'
  gh run list --workflow spec-kit-check.yml --limit 5 --json conclusion --jq '"all_green: \(([.[].conclusion] | all(. == "success")))"'
} >> "$PHASE/scratch/r20-ci-step.md"
```

Expected: five rows, all `success`, and `all_green: true`.

Check:

```bash
grep -c '^all_green: true$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md
sed -n '/^## Green streak/,/^all_green/p' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r20-ci-step.md | grep -c '^| [0-9]\{6,\} |'
```

Expected: `1` and `5`.

Rollback: delete the `## Green streak` section.

Stop and escalate if: `all_green` is not `true`, or a run predates the R20 commit.

---

### T036 [x] Confirm 10 consecutive green runs for the three workflows (AC-006)

Done through the filed branch. diagram-corpus had 3 consecutive greens, so seven serial `workflow_dispatch` runs on main were dispatched and each waited on (40094359622, 40094481195, 40094626777, 40094771974, 40094888712, 40095003840, 40095154965, all `success`). Those seven are dispatched reruns of the workflow, not natural runs. Neither deep-loop-runtime nor skill-advisor-stress has `workflow_dispatch`, and no failed run was rerun. The closure read on 2026-10-25 (`scratch/r21-recheck.md`, section Window re-pull at closure) has diagram-corpus and skill-advisor-stress at ten `success` each, and deep-loop-runtime at nine `success` and one `failure` (run 40107240026, `tests/unit/jsonl-repair.vitest.ts:461`) with the four later main runs `success`. The literal check below returns `1`, not `3`, because deep-loop-runtime stays red and the 2026-10-24 readings are kept as written. AC-006 accepts a filed root cause for a workflow that stays red, which T037 holds.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the `retry-proof: clean` line.

Change: append the heading `## Green streaks` and one line per workflow, `workflow: all_green=true count=<n>` or `workflow: all_green=false count=<n>`.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
{
  printf '\n## Green streaks\n\n'
  for w in deep-loop-runtime diagram-corpus skill-advisor-stress; do
    gh run list --workflow "$w.yml" --limit 10 --json conclusion --jq "\"$w: all_green=\(([.[].conclusion] | all(. == \"success\"))) count=\(length)\""
  done
} >> "$PHASE/scratch/r21-recheck.md"
```

Expected: `deep-loop-runtime: all_green=true count=10`, `diagram-corpus: all_green=true count=10`, `skill-advisor-stress: all_green=true count=10`. Observed on 2026-10-24: only the diagram-corpus line.

When diagram-corpus has fewer than 10 runs since its last failure, dispatch it one run at a time with `gh workflow run diagram-corpus.yml --ref main` and wait for each run. deep-loop-runtime and skill-advisor-stress have no `workflow_dispatch`, so they wait for natural runs. Never rerun a failed run.

Check:

```bash
grep -cE '^(deep-loop-runtime|diagram-corpus|skill-advisor-stress): all_green=true count=10$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
```

Expected: `3`.

Rollback: delete the `## Green streaks` section.

Stop and escalate if: a workflow reports `count=0`, or a workflow has no way to reach 10 runs in this repository's traffic.

---

### T037 [x] File a root cause for a workflow that stays red (AC-006)

Done: `grep -E ': all_green=false'` prints the deep-loop-runtime line and the 2026-10-24 skill-advisor-stress line. Only deep-loop-runtime is red at closure. Its Root causes row for `tests/unit/dependency-seams.vitest.ts`, `AssertionError: expected '4.6.6' to be '4.4.3'`, first failing SHA `e4af508`, carries the `filed:` action (Dependabot pull request 72, `OPEN` on 2026-10-25). Its row for `tests/unit/jsonl-repair.vitest.ts`, `AssertionError: expected 9 records, got 8 (line 461)`, first failing SHA `e00fef3`, carries a `filed:` action naming `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`, a separate change by the operator's ruling of 2026-10-25 (the folder exists as a scaffold). skill-advisor-stress is not red, so no filed row applies to it. `grep -c '[|] filed:'` returns `2`, and both rows are deep-loop-runtime's. The cause of the writer-lock failure stays INFERRED, not reproduced.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md`, anchor: the last `## Green streaks` line.

Change: for each workflow whose line reads `all_green=false`, append a row to the `## Root causes` table with the failing test, the error class, the first failing SHA, and an action cell that starts with `filed:` and carries one sentence on why the fix is not in this phase.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
grep -E ': all_green=false' "$PHASE/scratch/r21-recheck.md"
```

Expected: no output when all three are green; otherwise one line per workflow whose window holds a failure. On 2026-10-24 it prints deep-loop-runtime (red) and skill-advisor-stress (windowed, not red).

Check:

```bash
grep -c '| filed:' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/r21-recheck.md
```

Expected: `0` when every workflow is green, otherwise one per red workflow, and AC-006 then passes through its filed-root-cause branch.

Rollback: delete the `filed` rows.

Stop and escalate if: a workflow is red and its failing test cannot be named from the extract.

---

### T038 [x] Close the acceptance rows with evidence (AC-001 to AC-011)

Done. History: three rows were first left Unmet by their own rule: `grep -c '| Unmet |'` read `11` before the edit; afterwards `grep -c '| Met |'` returns `8` and `grep -c '| Unmet |'` returns `3`. AC-003 stays Unmet, awaiting CI measurement after the rebalanced split is committed. AC-006 stays Unmet: skill-advisor-stress is not red and needs three more natural runs, and deep-loop-runtime is red on an open pull request. AC-010 stays Unmet until the commits are made. Update 2026-10-25: AC-010 is now Met (commits `04d9b0c84f` and `e094a852ed`). Final state 2026-10-25: `grep -c '| Met |'` returns `10`, `grep -c '| Waived |'` returns `1` and `grep -c '| Unmet |'` returns `0`. AC-003 is Waived by the operator's ruling (ADR-011) because the median of five green runs is 451 s against the 400 s bar. AC-006 is Met through its filed-root-cause branch (deep-loop-runtime, `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`). AC-004 now reads `5` root-cause rows. The stored proof commands were rewritten to run as pasted: literal pipes are written `[\|]` (a bracket expression, with the backslash only escaping the table cell), alternations use repeated `-e` patterns, and the counts match the delivered files (AC-004 reads `4` root-cause rows, AC-002 counts the `--exclude` split). AC-005 carries the routing-registry-drift date of 2026-10-24 under the operator ruling.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md`, anchor: the `| AC-001 |` row.

Change: for each row AC-001 to AC-011, replace `Unmet` in the Status cell with `Met` and paste the observed check output into the Verification cell. Leave a row `Unmet` when its evidence is missing.

```bash
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md
```

Expected before the edit: `11`.

Check:

```bash
grep -c '| Met |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md
grep -c '| Waived |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md
grep -c '| Unmet |' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/acceptance-criteria.md
```

Expected: `10`, `1` and `0` (AC-003 is Waived under ADR-011).

Rollback: restore `Unmet` in the rows whose evidence was not observed.

Stop and escalate if: a row has no observed output to paste.

---

### T039 [x] Validate the packet (AC-008)

Done: `repair-derived.cjs --folder <phase> --apply` then `validate.sh <phase> --strict --no-recursive` printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`; `grep -c '^RESULT: PASSED$' scratch/validate.log` returned `1`. The first run failed on a long `next_safe_action` and a `Planned` status in `spec.md` against `In progress` in the summary; both were fixed, not waived. The log is gitignored, so the line is quoted in `scratch/validate.md`.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/validate.log` (new file). Anchor: none; the file does not exist yet.

Change: run the strict validator and write its output to the log.

```bash
PHASE="$PWD/specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PHASE" --strict --no-recursive 2>&1 | tee "$PHASE/scratch/validate.log" | tail -3
```

Expected: `RESULT: PASSED`.

Check:

```bash
grep -c '^RESULT: PASSED$' specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/validate.log
```

Expected: `1`.

Rollback: `rm specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/validate.log`.

Stop and escalate if: the validator prints `RESULT: FAILED` for any reason other than `GENERATED_METADATA_*`, `METADATA_DISK_PATH` or packet identity, which the orchestrator owns.

---

### T040 [ ] Commit the closure (AC-010)

Not done, by instruction: the orchestrator stages and commits after an independent review. The message is written in `scratch/commit-message-closure.txt` and validates with exit `0`. The phase is closeable (see `acceptance-criteria.md` section 3), so the subject may say the criteria are closed.

File: `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests` (the packet folder). Anchor (read): `.skilled/skills/sk-git/scripts/validate-message.mjs:1`, the line `#!/usr/bin/env node`.

Change: stage the packet folder, including the acceptance criteria, the task statuses and the scratch evidence, validate the message, and commit, so the closure edits T038 made and the validation output T039 wrote are not left uncommitted.

```bash
node .skilled/skills/sk-git/scripts/validate-message.mjs --commit specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/commit-message-closure.txt
git add specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
git commit -F specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/commit-message-closure.txt
git status --porcelain -- specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests
```

Expected: `validate-message.mjs` exits `0`, `git log -1 --format=%s` prints `docs(spec): close the slow and failing test criteria` and `git status --porcelain` prints nothing.

Rollback: `git reset --soft HEAD~1`.

Stop and escalate if: the validator exits non-zero twice, or the commit stages a path outside the packet folder.

---

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:401-428` for R19 to R21, `:571-577` for the phase plan)
- **Baseline**: See `../001-research/scratch/ci-run-data/summary.md` and `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`

| R-id | Requirements | Tasks | Acceptance criteria |
|------|--------------|-------|---------------------|
| R19 | REQ-001 | T002, T003, T004, T005, T006, T007, T008, T009, T010 | AC-001 |
| R20 | REQ-002, REQ-003 | T001, T011, T012, T013, T014, T032, T034, T035 | AC-002, AC-003, AC-011 |
| R21 | REQ-004, REQ-005, REQ-006 | T002, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026, T027, T028, T029, T030, T033, T036, T037 | AC-004, AC-005, AC-006, AC-007, AC-009 |
| Gates | REQ-007 | T031, T038, T039, T040 | AC-008, AC-010 |
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

- [x] CHK-001 [P0] Requirements documented in spec.md - planned as REQ-001 to REQ-007, each naming R19, R20, R21 or the gates [EVIDENCE: spec.md rows REQ-001 to REQ-007 at lines 129-140, each naming R19, R20, R21 or the gates, read 2026-10-25]
- [x] CHK-002 [P0] Technical approach defined in plan.md - the probe config, the config flip or the shard, and the re-check-first triage [EVIDENCE: plan.md sections 1 to 4 and the Affected Surfaces addendum (lines 74-93) hold the probe config, the shard and the re-check-first triage, read 2026-10-25]
- [x] CHK-003 [P1] Dependencies identified and available - `gh` with the `repo` scope, T002's install and build, the 002 baseline (T001) [EVIDENCE: `gh run view` and `gh run list` ran with the existing token on 2026-10-25, T002 is marked done in this file and `ls specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` found the file on 2026-10-25, and `scratch/r20-ci-step.md` still reads `baseline-source: 001-dataset` for the 791 s reference, which the spec limits to the after-R1 figure]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - the vitest runs, `node --test scripts/tests/` and `check-gate-inputs.sh` are the checks this change touches (T004, T006 to T008, T027, T031) [EVIDENCE: reran 2026-10-25: `bash .github/scripts/tests/check-gate-inputs.test.sh` prints `check-gate-inputs: 57 passed, 0 failed` (exit 0); `bash .github/scripts/check-gate-inputs.sh` prints `failures=0` then `RESULT: PASSED`; `yaml.safe_load` of `spec-kit-check.yml` prints `YAML_OK`. The vitest runs are recorded in `scratch/r19-probe.md` and `scratch/r20-ci-step.md` and were not rerun]
- [x] CHK-011 [P0] No console errors or warnings - each probe log ends with a passed-file count and no unhandled rejection, and the gate prints `failures=0` (T006 to T008, T031) [EVIDENCE: gate rerun 2026-10-25 prints `failures=0`; `grep -il unhandled scratch/*.log` lists no file]
- [x] CHK-012 [P1] Error handling implemented - the shard block propagates both halves' status through `wait ... || status=1` and `exit "$status"` (T013, T014) [EVIDENCE: `.github/workflows/spec-kit-check.yml:148-150` read 2026-10-25: `wait "$first" || status=1`, `wait "$second" || status=1`, `exit "$status"`]
- [x] CHK-013 [P1] Code follows project patterns - the config reason explains behaviour, the fast-fail step mirrors the existing step comments, and no comment carries a packet id (T011, T012, T025, T032, T033) [EVIDENCE: added lines of `04d9b0c84f` and `e094a852ed` read 2026-10-25: the comments state behaviour, and the ephemeral-label search over them prints `0`; the config comment part does not apply because `vitest.config.ts` is unmodified]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - `acceptance-criteria.md` rows AC-001 to AC-011 (T038) [EVIDENCE: re-run 2026-10-25: `grep -c '| Met |'` returns `10`, `grep -c '| Waived |'` returns `1`, `grep -c '| Unmet |'` returns `0`. This item holds by waiver for AC-003, not because the bar was met: the median of 451 s misses the bar of under 400 s, and the operator waived the row on 2026-10-25 (ADR-011)]
- [x] CHK-021 [P0] Manual testing complete - three probe runs, the CI step measurement, the 5- and 10-run streaks, and the five stale confirmations (T004, T006 to T008, T034 to T036) [EVIDENCE: re-run 2026-10-25: the probe greps return `1`, `3`, `4`, `1` with the probe config gone. `scratch/r20-ci-step.md` holds five `after` rows (median 451 s, waived under ADR-011), `all_green: true` count `1` and `5` streak rows. diagram-corpus and skill-advisor-stress read ten `success` each and deep-loop-runtime nine `success` with one failure filed to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`, so the 10-run streak holds for two workflows and the filed branch holds for the third. The stale `closed` count is `5`]
- [x] CHK-022 [P1] Edge cases tested - the probe's collision grep, the shard halves when the outcome is shard, and the stale-contract negative proof (T010, T014, T026) [EVIDENCE: read 2026-10-25: `scratch/r19-collisions.log` is empty (0 bytes), the local halves (313.90 s and 356.56 s, exit 0) are in `scratch/r20-ci-step.md`, and `scratch/r21-recheck.md:171` reads `negative-proof: exit 2 then exit 0`]
- [x] CHK-023 [P1] Error scenarios validated - a failed shard half fails the step, and a stale contract fails the fast-fail step with exit 2 (T013, T026) [EVIDENCE: a failed half failed the step on CI: `gh run view 40149635448 --json jobs` reads the `CLI vitest project` step conclusion `failure`, and its failed log shows `Test Files 1 failed | 178 passed | 3 skipped` in the `--exclude` process while the heavy-file process printed `Test Files 1 passed (1)`. The stale-contract case is `negative-proof: exit 2 then exit 0` in `scratch/r21-recheck.md` (count `1`) and the T026 note]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - test-isolation for R19 and R20, class-of-bug for the deep-loop stale contract, instance-only for the diagram and stress failures already fixed [EVIDENCE: read 2026-10-25: R19 and R20, the parallel-only 30 s timeouts that took the shard, are test-isolation (decision-record ADR-001 amendment). The deep-loop stale contract is class-of-bug and the Root causes row names the fast-fail step that catches it in seconds. The diagram-corpus and skill-advisor-stress rows read `none needed: closed on the newest green run` with no file changed, which is instance-only. The Dependabot pin drift is instance-only and filed to its bump pull request. The writer-lock race is a concurrency class-of-bug filed to `specs/system-deep-loop/041-writer-lock-stale-reclaim-race`, INFERRED because it was not reproduced]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed - `rg -n 'fileParallelism' .skilled/skills --glob 'vitest.config.ts'` finds 5 sites in 4 files, and only the cli site changes (plan.md, Affected Surfaces) [EVIDENCE: `rg -c fileParallelism .skilled/skills --glob 'vitest.config.ts'` run 2026-10-25 lists 4 files with 5 sites; `rg -c 'fileParallelism: false'` lists the same 5 and `fileParallelism: true` finds none (exit 1)]
- [x] CHK-FIX-003 [P0] Consumer inventory completed - the check job, the CLI package's `test` script, the deep-loop suite, the diagram checker and the stress suite, each with its verification in plan.md [EVIDENCE: plan.md lines 82-91 list the check job step, the deep-loop workflow, the README and the consumers search, read 2026-10-25]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - not applicable: no path, parser or redaction code changes; the fixture-collision matrix is in plan.md [EVIDENCE: n/a because the two commits change only `.github/workflows/spec-kit-check.yml` and `.github/workflows/deep-loop-runtime.yml`; no path, parser or redaction code changed]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - project (2) x setting (2) x mode (3), with 7 required rows, in plan.md [EVIDENCE: plan.md line 92 lists the axes (project x setting x mode) and the required rows, read 2026-10-25]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the parallel probe is that variant, and the stale-contract copy is the second (T006 to T008, T026) [EVIDENCE: read 2026-10-25: the parallel probe rows in `scratch/r19-probe.md` (292.33 s exit 0, 305.59 s exit 1, 311.91 s exit 1) and `scratch/r21-recheck.md:171` for the stale-contract copy]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range - the probe logs, the 40-run JSONs, the run ids and the two commit subjects are recorded in `scratch/` [EVIDENCE: `scratch/` holds the probe logs, the 40-run JSON files, the run ids, and the two commit hashes `04d9b0c84f` and `e094a852ed` are recorded in the AC-010 row]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - the change adds a config value, a comment and fixed shard literals; no token, key or PAT value appears in any edited file [EVIDENCE: `git show 04d9b0c84f e094a852ed -U0` piped to a search for token, `ghp_`, `github_pat` and password over added lines prints `0`]
- [x] CHK-031 [P0] Input validation implemented - not applicable: the shard arguments are the fixed literals `1/2` and `2/2`, and no input reaches a shell [EVIDENCE: n/a because the shard literals are gone: the split passes a fixed file path and `--exclude` with a fixed path, and no input reaches a shell]
- [x] CHK-032 [P1] Auth/authz working correctly - `gh` reads use the existing `repo` scope; this phase adds no permission to any workflow [EVIDENCE: `git diff -U0 04d9b0c84f^ e094a852ed -- .github/workflows | grep -c permissions` prints `0`, so no permission was added]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - R19 to R21 map to REQ-001 to REQ-007 and to AC-001 to AC-011 in the cross-reference table above [EVIDENCE: the cross-reference table above maps R19 to R21 to REQ-001 to REQ-007 and AC-001 to AC-011; spec.md and plan.md now carry the AC-003 ruling pointer, read 2026-10-25]
- [x] CHK-041 [P1] Code comments adequate - the config comment states why the CLI files are independent and why the root project stays serial [EVIDENCE: n/a because `vitest.config.ts` is unmodified on the shard branch]
- [x] CHK-042 [P2] README updated (if applicable) - not applicable: no check name, trigger or job count changes, so `.github/workflows/README.md` stays as it is [EVIDENCE: n/a because the two commits change no check name, trigger or job count, so `.github/workflows/README.md` stays as it is]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - the probe logs, the 40-run JSONs, the failed-log extracts and the measurements live under `specs/system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests/scratch/` [EVIDENCE: `ls scratch/` 2026-10-25 shows the probe logs, run JSON files, failed-log extracts and measurement tables under the phase folder]
- [x] CHK-051 [P1] scratch/ cleaned before completion - the probe config is deleted in T009; the logs and tables stay as the phase's evidence [EVIDENCE: `test ! -e .skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts` exits 0 on 2026-10-25]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
