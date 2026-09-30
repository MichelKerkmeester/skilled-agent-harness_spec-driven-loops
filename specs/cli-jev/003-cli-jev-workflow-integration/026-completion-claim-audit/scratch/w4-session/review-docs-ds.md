# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-spec-kit/runtime/scripts/README.md`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/README.md`
- `.skilled/skills/system-spec-kit/changelog/v4.5.0.0.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). MiMo wrote the eight docs. DeepSeek wrote the script `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` and its test, which MiMo reviewed separately. Review the docs in full and check each claim against that script. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

## What to look for

- Correctness against each requirement in the phase `spec.md`.
- Dormancy (parent D1): with neither Jev nor Deem available, behavior is exactly today's. A Jev arm runs only behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <p>` exiting 0. A Deem arm runs only behind `--deem` after `cli-deem health` passes. Either failing prints one skip line and changes nothing.
- The zero-call first slice runs with no model call.
- The keep rule is fixed in code before any run: coverage, a margin over the baseline, an exact one-sided sign test at 0.05, a flip bound, and one verdict line `verdict <backend>: keep|kill|stop (...)`. Check the sign test arithmetic on one case by hand.
- Label gate: where the scorer needs operator labels, it prints `stop: fewer than N labeled rows` and no label file was written by a model.
- Secrets: no key, token or `.env` read, and no request that sends one. Jev gets no secret.
- Comment hygiene: no spec path, packet or phase number, REQ, task, ADR or finding id in a code comment.
- Tests: happy path plus one edge case per public surface, stubbed backends for both arms, and no test that asserts nothing or mirrors the implementation.
- Docs: each changed skill doc says what the code does, no more, and names the switches and the gate as the code spells them.
- Docs against the code: open the script and check every switch, printed line, count, exit code, file name, version and ID a doc states. A doc sentence the code does not bear out is P1. Check that each version or ID a doc gives matches its siblings (SKILL.md, README, changelog file name, catalog, playbook).

Skip style nits a formatter would settle.

## Severity

- P0: wrong behavior, data loss, a secret leak or a broken build.
- P1: a requirement not met, a missing edge case the spec names, a test gap on a changed public surface, dormancy broken, or a doc that states something the code does not do.
- P2: everything else worth fixing.

## Report (under 400 words)

One line per finding: `P0|P1|P2 file:line - what is wrong - the concrete input or state that shows it`. Then one line per requirement: `REQ-xxx met|not met|not checked - why`. End with exactly one line `VERDICT: PASS` (no P0 or P1) or `VERDICT: FAIL`.

## Appendix: the diff under review

```diff
diff --git a/.skilled/skills/system-spec-kit/runtime/scripts/README.md b/.skilled/skills/system-spec-kit/runtime/scripts/README.md
index be6b94f42d..0faf7000db 100644
--- a/.skilled/skills/system-spec-kit/runtime/scripts/README.md
+++ b/.skilled/skills/system-spec-kit/runtime/scripts/README.md
@@ -31,6 +31,8 @@ Two of them exist because the naive version fails in a way that is easy to miss:
 scripts/
 +-- compaction-recall/
 |   `-- score-compaction-recall.mjs  # Zero-call census of what host compactions keep
++-- completion-claim-audit/
+|   `-- score-completion-claims.mjs  # Zero-call audit of the completion-claim detector
 +-- finalize-dist.mjs        # Post-build: freshness entries, stale dist pruning, JSON copying
 +-- run-tests.mjs            # Bounded default test runner (npm test)
 +-- run-tests-sharded.mjs    # Sharded runner for the full suite (npm run test:sharded)
@@ -44,6 +46,7 @@ This folder holds scripts only; its one test suite (`resource-map-extractor.vite
 | File | Purpose | Key Behavior |
 |---|---|---|
 | `compaction-recall/score-compaction-recall.mjs` | Operator-run census of host compactions | Reads only the transcripts named with `--transcripts` and makes no model call. It prints counts, scores and one `stop:` line and writes one JSON report to an `--out` path outside every named transcript directory. |
+| `completion-claim-audit/score-completion-claims.mjs` | Operator-run audit of the completion-claim detector | Reads the turn rows named with `--rows` and makes no model call by default. `--deem` and `--jev` each run only behind that backend's own check. The Jev arm needs `--accept-payload`, and `--out` must name a directory outside the repository. |
 | `finalize-dist.mjs` | Completes `npm run build` after `tsc --build` | Records the package build and source-hash cache through `../cli/lib/dist-freshness.cjs`, copies JSON assets into `dist/`, prunes stale dist roots, and checks the required artifacts are present. |
 | `run-tests.mjs` | Backs `npm test` | Routes `npm test -- --run ...` to the requested Vitest lane without running the full core suite first, under a process-group timeout that terminates the whole group on overrun. |
 | `run-tests-sharded.mjs` | Backs `npm run test:sharded` | Splits the suite into `SPECKIT_TEST_SHARDS` shards (default 12) and runs them serially, each in its own worker. |
diff --git a/.skilled/skills/system-spec-kit/SKILL.md b/.skilled/skills/system-spec-kit/SKILL.md
index b81a6c4e0a..72ee38373f 100644
--- a/.skilled/skills/system-spec-kit/SKILL.md
+++ b/.skilled/skills/system-spec-kit/SKILL.md
@@ -2,7 +2,7 @@
 name: system-spec-kit
 description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, trigger-index and ripgrep retrieval. Required for file modifications."
 allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
-version: 4.4.0.0
+version: 4.5.0.0
 ---
 
 <!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, trigger-index, retrieval-conventions, ripgrep-retrieval, continuity-writer, handover, opencode-goal, goal-plugin, active_goal, session-goal, importance-tiers -->
@@ -570,6 +570,7 @@ P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code
 | Free-text retrieval | The ripgrep recipes in `references/retrieval/retrieval-conventions.md` §2, scoped by the trailing positional path |
 | Compaction recall census | `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts <dir> --newest-compacted 15 --out <file outside the repo>` makes no model call, prints counts and one `stop:` line and changes no transcript |
 | Alignment suggestion measurement | `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts` makes no model call and prints below-50 alignment counts per save path; `--score <rows>` prints `stop: fewer than 30 labeled rows` until the operator labels 30, and `--jev` or `--deem` with `--out <dir outside the repo>` add a verdict column behind that backend's own check |
+| Completion claim audit | `node .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs --rows <file>` runs the offline completion-claim audit and makes no model call by default, and `--deem` and `--jev` with `--out <dir outside the repo>` each run that backend's arm behind that backend's own check (`--accept-payload` is required for `--jev`) |
 | Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
 | Upgrade level | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh specs/007-feature/ --to 2` |
 | Completeness | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/007-feature/` |
diff --git a/.skilled/skills/system-spec-kit/README.md b/.skilled/skills/system-spec-kit/README.md
index 61eb28ec27..75a3471ff7 100644
--- a/.skilled/skills/system-spec-kit/README.md
+++ b/.skilled/skills/system-spec-kit/README.md
@@ -322,6 +322,11 @@ default run makes no model call and changes no save. `--score` runs alone and st
 gate: with fewer than 30 labeled rows it prints one stop line and exits 0. `--jev` and `--deem`
 each add a verdict column behind that backend's own check.
 
+`runtime/scripts/completion-claim-audit/score-completion-claims.mjs` scores the completion-claim
+detector against operator-labeled turns. Its default run makes no model call and writes no file.
+`--deem` and `--jev` each run that backend's arm behind its own check, and the Jev arm needs
+`--accept-payload` because its payload is the operator's session text.
+
 ---
 
 ## 5. COMMANDS
diff --git a/.skilled/skills/system-spec-kit/changelog/v4.5.0.0.md b/.skilled/skills/system-spec-kit/changelog/v4.5.0.0.md
new file mode 100644
index 0000000000..289adaeff0
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/changelog/v4.5.0.0.md
@@ -0,0 +1,33 @@
+---
+title: "system-spec-kit v4.5.0.0, Audit the Completion Claims"
+description: "A new offline script counts the turns that end with a completion claim and gates any model arm behind operator labels, with no model call in the default run."
+trigger_phrases:
+  - "system-spec-kit v4.5.0.0"
+  - "system-spec-kit 4.5.0.0"
+  - "completion claim audit"
+importance_tier: "normal"
+contextType: "general"
+version: 4.5.0.0
+---
+# v4.5.0.0, Audit the Completion Claims
+
+Before a turn's closing claim of completion is trusted there is now a way to measure it. `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` reads a JSONL rows file (one turn per line) the operator names and runs the completion-claim detector (the same one the Stop hooks use) over each turn. The default run prints a census and makes no model call.
+
+## What's New at a Glance
+
+- **The default run makes no model call and never starts `jev` or `cli-deem`.** The usage is `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <file> [--labels <file>] [--deem] [--jev] [--out <dir>] [--accept-payload]` run from `.skilled/skills/system-spec-kit/runtime`. Logging stubs for both backends first on `PATH` were never called.
+- **The census counts the ten claim words over each turn's last 400 characters.** On the 50-row fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl` the run printed `rows: 50 fires: 4` and `words: completed=1 resolved=1 fixed=1 finished=0 shipped=0 released=0 deployed=1 implemented=0 occurred=0 happened=0`.
+- **Labels are the operator's job.** `--labels <file>` takes one row `{ id, claim }` per turn with `claim` exactly `yes` or `no`, and the run prints the label file's SHA-256 on its `labels:` line.
+- **The label gate stops the run before any arm.** Fewer than 30 labeled rows prints `stop: fewer than 30 labeled rows`, and then fewer than 5 labeled rows of either class prints `stop: fewer than 5 labeled yes rows` or `stop: fewer than 5 labeled no rows`.
+- **The keep rule prints before any call.** Every run prints `margin: 0.10`, the `keep rule:` line with every check in its order, and the `power:` line that says why a keep needs five wins with no loss.
+- **The model arms sit behind two switches.** `--deem` and `--jev` each need `--out <dir>` or the run prints `--deem needs --out <dir> so every call is recorded` and exits 2. An `--out` inside the repository prints `refused: report directory inside the repository` and also exits 2 before any census line prints.
+- **Jev runs first when both switches are present.** The Jev gate and arm run first and then the Deem ones, each on its own gate, and a failed gate prints its own skip line without starting the other backend in its place.
+- **`--accept-payload` opens the Jev arm.** The Jev payload is the operator's own session text, so `--jev` without `--accept-payload` prints `jev arm skipped: payload not accepted` and the Deem arm still runs.
+- **A failed check skips one arm and changes nothing else.** A Deem health reporting backend `stub` adds one line, `deem arm skipped: stub backend`, and the census lines stay byte-identical.
+- **Reports hold counts and hashes only.** Any run with `--deem` or `--jev` writes `report.json` under `--out`, and a run past the gate also writes `calls.jsonl`. A 40-character slice of each fixture row was searched in every run's stdout and 0 of 50 were found.
+- **No run has printed a `verdict` line.** Today's runs stop at the label gate before any arm runs, so no verdict exists and this entry claims none.
+- **The tests pass.** `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` holds 23 tests and they all pass. Run it from `.skilled/skills/system-spec-kit/runtime` with `npx vitest run tests/completion-claim-audit.vitest.ts`.
+
+## Upgrade
+
+No migration required. No existing behavior changes and no hook runs `score-completion-claims.mjs`.
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md
new file mode 100644
index 0000000000..11bb66840b
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/completion-claim-audit.md
@@ -0,0 +1,70 @@
+---
+title: "Completion claim audit"
+description: "Scores, with zero model calls by default, how the completion-claim detector agrees with operator-labeled turns, then judges each labeled turn behind `--deem` or `--jev` and reports one keep, kill or stop decision per backend."
+trigger_phrases:
+  - "completion claim audit"
+  - "score-completion-claims.mjs"
+  - "completion claim census"
+  - "labeled turn judgment"
+version: 4.5.0.0
+---
+
+# Completion claim audit (score-completion-claims.mjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Scores, with zero model calls by default, how the completion-claim detector agrees with operator-labeled turns, then judges each labeled turn behind `--deem` or `--jev` and reports one keep, kill or stop decision per backend.
+
+The audit answers two questions before anyone spends model calls on judging turns: whether the completion-evidence sentinel's detector agrees with the operator's own labels, and whether a judged backend beats that detector by the fixed ten-point margin. The label gate and the keep rule are fixed before any call, so a run can stop at the census and start no backend. Only ids, counts and hashes leave the census, and row text never reaches stdout or the report.
+
+---
+
+## 2. HOW IT WORKS
+
+### Rows And Census
+
+`--rows <file>` names a JSONL file of turns, one object per line with a non-empty string `id` and a string `raw_text`. The census runs the sentinel's own `detectCompletionClaim` on each row's trailing 400-character slice and counts every fired turn under the first claim word that slice holds. It prints `rows: <n> fires: <n>` and a `words:` line over all ten claim words in the detector pattern's own order with zeros included. `--labels <file>` adds operator labels, one JSONL row `{ id, claim }` with `claim` exactly `yes` or `no`, and the run prints the label file's SHA-256 on the `labels:` line, the class counts, the regex accuracy against those labels or `n/a (no labels)`, and its false fires and missed claims by word. Three fixed lines follow: `margin: 0.10`, the keep rule in its five checks, and the power note.
+
+### Label Gate
+
+The last census line is the gate, the first match of `stop: fewer than 30 labeled rows`, `stop: fewer than 5 labeled yes rows`, `stop: fewer than 5 labeled no rows`, `no headroom`, or `planned calls: deem=<K> jev=<3*K+1>`. Only the planned gate opens an arm. A default run prints the census and exits `0` with no backend started and no file written.
+
+### Judgment Arms
+
+Each arm runs only behind its own switch, `--deem` or `--jev`, and `--out <dir>` resolving outside the repository. With both switches the Jev arm runs first, then the Deem arm, each on its own checks. The Deem gate reads the local model's health once and accepts only the pinned model `deem-0.8-v1`. The Jev gate prints `jev: path=<path|none> provider=<P>`, accepts only `jev 0.6.2`, and needs a credential, and its calls carry the operator's session text so that arm also needs `--accept-payload`. A failed check prints one skip line such as `deem arm skipped: stub backend` or `jev arm skipped: payload not accepted`, and the run exits `0` with every census line unchanged. Behind a passing gate each labeled turn is judged once by Deem and three times by Jev under the fixed question `Does this turn end by claiming the work is complete?`, with the Jev row's call being the modal one. When an arm finishes every row it prints its column counts and one `verdict <backend>:` line carrying the counts, both exact tails and the label set hash.
+
+### Reports And Output Guard
+
+Every string the run prints or writes passes an allowlist of fixed labels, row ids and lowercase hex digests, so no row text reaches stdout or the report. A run with `--deem` or `--jev` writes `report.json` in `--out`, and a run past the gate also writes `calls.jsonl` there with one line per call. The script exits `0` for a printed census, a skip or a stop, and `2` for a refused command line: no `--rows`, a model switch without `--out`, an `--out` inside the repository, or rows or labels that do not parse.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Script | Parses the rows and labels, runs the census and the gate, drives both judgment arms and writes the report |
+| `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs` | Shared | Exports `detectCompletionClaim` and its claim pattern, the one detector the census counts |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Vitest | Twenty-three cases over synthetic rows and labels, with stub `cli-deem` and `jev` binaries first on the path |
+| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl` | Fixture | One turn per claim word plus two holding the word past the trailing slice |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `tooling-and-scripts/completion-claim-audit.md`
+
+Related references:
+- [compaction-recall-census.md](compaction-recall-census.md) - the entry before this one in the category
+- [completion-verdict-freshness-validation.md](completion-verdict-freshness-validation.md) - the entry after this one in the category
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
index af44fa786e..98981a5b8b 100644
--- a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
@@ -119,6 +119,22 @@ See [`tooling-and-scripts/compaction-recall-census.md`](tooling-and-scripts/comp
 
 ---
 
+### Completion claim audit
+
+#### Description
+
+Scores, with zero model calls by default, how the completion-claim detector agrees with operator-labeled turns, then judges each labeled turn behind `--deem` or `--jev` and reports one keep, kill or stop decision per backend.
+
+#### Current Reality
+
+`.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` makes zero model calls by default and writes no file. Its census reads only the rows named with `--rows` and the labels named with `--labels`, and no row text reaches stdout or the report. Each judgment arm runs only behind `--deem` or `--jev` with `--out <dir>` outside the repository, and no run has printed a `verdict` line.
+
+#### Source Files
+
+See [`tooling-and-scripts/completion-claim-audit.md`](tooling-and-scripts/completion-claim-audit.md) for full implementation and test file listings.
+
+---
+
 ### Alignment suggestion measurement
 
 #### Description
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md
new file mode 100644
index 0000000000..922922bb98
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-claim-audit.md
@@ -0,0 +1,101 @@
+---
+title: "462 -- Completion claim audit"
+description: "This scenario validates the completion claim audit for `462`. It focuses on a default run over the synthetic rows with stubs first on the path that starts no backend and prints no row text, the stub-backend skip, and the suite that proves zero model calls."
+version: 4.5.0.0
+---
+
+# 462 -- Completion claim audit
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `462`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the completion claim audit for `462`. It focuses on a default run over the synthetic rows with stubs first on the path that starts no backend and prints no row text, the stub-backend skip, and the suite that proves zero model calls.
+
+### Why This Matters
+
+The audit scores the completion-claim detector on turn text and calls no model on its default run, so the census shape has to be provable without any credential. A run over the synthetic rows shows the census and the label gate without opening a real session, and the stub `jev` and `cli-deem` binaries first on the path show that no backend starts.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `462` and confirm the expected signals without contradictory evidence.
+
+- Objective: confirm that a default run over the synthetic rows prints the census lines and a last line `stop: fewer than 30 labeled rows`, starts no stub and exits 0, that a deem run against a stub backend adds only `deem arm skipped: stub backend`, that the two working-tree status captures match, and that the suite reports 23 passed
+- Real user request: `Where does the completion-claim detector fire, and can I find out without calling a model?`
+- Prompt: `Run the completion claim audit on the synthetic rows with stubs first on the path, run the deem arm against a stub backend, confirm nothing was called or changed, then run its test suite.`
+- Expected execution process: the working-tree status is captured, stub `cli-deem` and `jev` executables that log every call are placed first on `PATH`, the audit runs over `tests/completion-claim-audit-fixtures/census-happy.jsonl` with no arm switch, the stub logs are read, the audit runs again with `--deem` and `--out` on a folder outside the repository, the stub logs are read again, the status is captured again and compared and the vitest suite runs.
+- Expected signals: step 3 prints `rows: 12 fires: 10`, `words: completed=1 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1`, `labels: none`, `labeled: 0 (yes 0, no 0)`, `regex accuracy: n/a (no labels)`, `regex false fires: 0 (by word: none)`, `regex missed claims: 0 (by word: none)`, `margin: 0.10`, one line starting `keep rule:`, one line starting `power:` and a last line `stop: fewer than 30 labeled rows`, with no fixture row text on stdout and exit 0. Step 4 prints nothing. Step 5 prints the same census lines then `deem arm skipped: stub backend` and exits 0. Step 6 prints one line, `cli-deem health`. Step 7 prints nothing. Step 8 reports 23 passed and exits 0.
+- Desired user-visible outcome: the census counts, the stop line, the stub-backend skip line and a statement that nothing was called or changed, with the evidence.
+- Pass/fail: PASS if every signal holds. FAIL if a line is missing, step 4 prints a log line, step 5 prints anything beyond its one skip line, step 6 prints anything else, step 7 shows a change or a test fails.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Run the completion claim audit on the synthetic rows with stubs first on the path, run the deem arm against a stub backend, confirm nothing was called or changed, then run its test suite.`
+
+### Commands
+
+1. `git status --porcelain > /tmp/cca-462-before.txt`
+2. `mkdir -p /tmp/cca-462-stub && printf '#!/bin/sh\nname=${0##*/}\necho $name $* >> /tmp/cca-462-stub/$name.log\nif [ $name = cli-deem ] && [ $1 = health ]; then\necho stub backend >&2\nexit 3\nfi\nexit 2\n' | tee /tmp/cca-462-stub/cli-deem /tmp/cca-462-stub/jev > /dev/null && chmod +x /tmp/cca-462-stub/cli-deem /tmp/cca-462-stub/jev`
+3. `cd .skilled/skills/system-spec-kit/runtime && PATH=/tmp/cca-462-stub:$PATH node scripts/completion-claim-audit/score-completion-claims.mjs --rows tests/completion-claim-audit-fixtures/census-happy.jsonl`
+4. `find /tmp/cca-462-stub -name '*.log' -print`
+5. `cd .skilled/skills/system-spec-kit/runtime && PATH=/tmp/cca-462-stub:$PATH node scripts/completion-claim-audit/score-completion-claims.mjs --rows tests/completion-claim-audit-fixtures/census-happy.jsonl --deem --out /tmp/cca-462-out`
+6. `find /tmp/cca-462-stub -name '*.log' -exec cat {} \;`
+7. `git status --porcelain | diff /tmp/cca-462-before.txt -`
+8. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/completion-claim-audit.vitest.ts`
+
+### Expected
+
+Step 3 prints the census lines the scenario contract names and exits 0. Step 4 prints nothing. Step 5 prints the same census lines then `deem arm skipped: stub backend` and exits 0. Step 6 prints `cli-deem health`. Step 7 prints nothing. Step 8 reports 23 passed and exits 0.
+
+### Evidence
+
+Capture step 3's stdout and exit status, step 4's empty output, step 5's skip line and exit status, step 6's one log line, step 7's empty diff and the suite's summary line with its exit status.
+
+### Pass / Fail
+
+- **Pass**: every named line is present, step 4 prints nothing, step 5 adds only its one skip line, step 6 prints `cli-deem health`, step 7 prints nothing and the suite passes.
+- **Fail**: a named line is missing, step 4 prints a log line, step 5 prints anything beyond its one skip line, step 6 prints anything else, step 7 shows a change or a test fails.
+
+### Failure Triage
+
+1. When step 3 or step 5 exits 2, the run refused its command line: `--deem` without `--out` prints `--deem needs --out <dir> so every call is recorded` and a `--out` inside the repository prints `refused: report directory inside the repository`, so name a folder under `/tmp`.
+2. When step 5 prints `deem arm skipped: not reachable` or `deem arm skipped: bad health response`, the stub did not answer `health` with exit 3 and `stub backend` on stderr: rerun step 2 and check the executable bit, because a `cli-deem` the script cannot execute sends the run to the repository copy.
+3. When step 7 shows a change, name the path, because every run writes only under `/tmp`.
+
+---
+
+## 4. SOURCE FILES
+
+### Playbook Sources
+
+| File | Role |
+|---|---|
+| `manual-testing-playbook.md` | Root directory page and scenario summary |
+| `../../feature-catalog/tooling-and-scripts/completion-claim-audit.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Prints the census lines, the label-gate stop line and the arm skip lines, and writes the report |
+| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Twenty-three cases over the fixtures, with stub `jev` and `cli-deem` binaries first on the path |
+| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl` | The twelve synthetic rows the census run reads |
+
+Provenance: runtime/tests/completion-claim-audit.vitest.ts
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Playbook ID: 462
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `tooling-and-scripts/completion-claim-audit.md`
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
index e360e9407c..fd5c2da423 100644
--- a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
@@ -201,6 +201,7 @@ Every row links a scenario file that exists on disk. The **Catalog Entry** colum
 | 089 | Code standards alignment | [089](tooling-and-scripts/code-standards-alignment.md) | [code-standards-alignment](../feature-catalog/tooling-and-scripts/code-standards-alignment.md) |
 | 460 | Compaction recall census | [460](tooling-and-scripts/compaction-recall-census.md) | [compaction-recall-census](../feature-catalog/tooling-and-scripts/compaction-recall-census.md) |
 | 461 | Alignment suggestion measurement | [461](tooling-and-scripts/alignment-suggestion-measurement.md) | [alignment-suggestion-measurement](../feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md) |
+| 462 | Completion claim audit | [462](tooling-and-scripts/completion-claim-audit.md) | [completion-claim-audit](../feature-catalog/tooling-and-scripts/completion-claim-audit.md) |
 | 233 | Completion verification workflow | [233](tooling-and-scripts/completion-verification-workflow.md) | [completion-verification-workflow](../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) |
 | 240 | Core workflow infrastructure | [240](tooling-and-scripts/core-workflow-infrastructure.md) | [core-workflow-infrastructure](../feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md) |
 | DBG-SCAF-001 | Debug-delegation scaffold generator | [DBG-SCAF-001](tooling-and-scripts/debug-delegation-scaffold-generator.md) | [debug-delegation-scaffold-generator](../feature-catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md) |
```
