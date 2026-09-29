# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/README.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/README.md`
- `.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/031-debug-next-check/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). The code (the script and its test) passed its own review by Pi MiMo; this review covers the eight docs. Read the script only to check the docs against it. The versions and scenario ID follow orchestrator ruling 2 (4.6.0.0 and 463), not the design's 4.5.0.0 and 462. The synthetic 30-row fixture named in facts.txt is a session proof kept outside the repository, not a label. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-spec-kit/SKILL.md b/.skilled/skills/system-spec-kit/SKILL.md
index 72ee38373f..1f5d908370 100644
--- a/.skilled/skills/system-spec-kit/SKILL.md
+++ b/.skilled/skills/system-spec-kit/SKILL.md
@@ -2,7 +2,7 @@
 name: system-spec-kit
 description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, trigger-index and ripgrep retrieval. Required for file modifications."
 allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
-version: 4.5.0.0
+version: 4.6.0.0
 ---
 
 <!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, trigger-index, retrieval-conventions, ripgrep-retrieval, continuity-writer, handover, opencode-goal, goal-plugin, active_goal, session-goal, importance-tiers -->
@@ -571,6 +571,7 @@ P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code
 | Compaction recall census | `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts <dir> --newest-compacted 15 --out <file outside the repo>` makes no model call, prints counts and one `stop:` line and changes no transcript |
 | Alignment suggestion measurement | `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts` makes no model call and prints below-50 alignment counts per save path; `--score <rows>` prints `stop: fewer than 30 labeled rows` until the operator labels 30, and `--jev` or `--deem` with `--out <dir outside the repo>` add a verdict column behind that backend's own check |
 | Completion claim audit | `node .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs --rows <file>` runs the offline completion-claim audit and makes no model call by default, and `--deem` and `--jev` with `--out <dir outside the repo>` each run that backend's arm behind that backend's own check (`--accept-payload` is required for `--jev`) |
+| Debug next-check measurement | `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture <file outside the repo>` makes no model call by default and changes no debug step, and `--jev` or `--deem` with `--out <dir>` each run that backend's arm behind that backend's own check |
 | Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
 | Upgrade level | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh specs/007-feature/ --to 2` |
 | Completeness | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/007-feature/` |
diff --git a/.skilled/skills/system-spec-kit/README.md b/.skilled/skills/system-spec-kit/README.md
index 75a3471ff7..3a8f59fc89 100644
--- a/.skilled/skills/system-spec-kit/README.md
+++ b/.skilled/skills/system-spec-kit/README.md
@@ -327,6 +327,14 @@ detector against operator-labeled turns. Its default run makes no model call and
 `--deem` and `--jev` each run that backend's arm behind its own check, and the Jev arm needs
 `--accept-payload` because its payload is the operator's session text.
 
+`runtime/scripts/debug-next-check/score-debug-next-check.mjs` measures offline whether a model
+choice of the cheapest next check for a debug hypothesis beats the best constant answer on
+operator-labeled rows. Its default run makes no model call and writes no file. With `--fixture`
+the run stops at the label gate: with fewer than 30 labeled rows it prints one stop line and
+exits 0. Behind the payload gate only rows marked `jev_ok` may leave the machine, and the Jev arm
+skips when none is marked. `--jev` and `--deem` each add a verdict column behind that backend's
+own check. It changes no debug step.
+
 ---
 
 ## 5. COMMANDS
diff --git a/.skilled/skills/system-spec-kit/runtime/scripts/README.md b/.skilled/skills/system-spec-kit/runtime/scripts/README.md
index 30da3e590e..aa5d5d43c0 100644
--- a/.skilled/skills/system-spec-kit/runtime/scripts/README.md
+++ b/.skilled/skills/system-spec-kit/runtime/scripts/README.md
@@ -33,6 +33,8 @@ scripts/
 |   `-- score-compaction-recall.mjs  # Zero-call census of what host compactions keep
 +-- completion-claim-audit/
 |   `-- score-completion-claims.mjs  # Audit of the completion-claim detector, zero-call by default
++-- debug-next-check/
+|   `-- score-debug-next-check.mjs  # Measurement of the debug next check against the best constant answer, zero-call by default
 +-- finalize-dist.mjs        # Post-build: freshness entries, stale dist pruning, JSON copying
 +-- run-tests.mjs            # Bounded default test runner (npm test)
 +-- run-tests-sharded.mjs    # Sharded runner for the full suite (npm run test:sharded)
@@ -47,6 +49,7 @@ This folder holds scripts only; its one test suite (`resource-map-extractor.vite
 |---|---|---|
 | `compaction-recall/score-compaction-recall.mjs` | Operator-run census of host compactions | Reads only the transcripts named with `--transcripts` and makes no model call. It prints counts, scores and one `stop:` line and writes one JSON report to an `--out` path outside every named transcript directory. |
 | `completion-claim-audit/score-completion-claims.mjs` | Operator-run audit of the completion-claim detector | Reads the turn rows named with `--rows` and makes no model call by default. `--deem` and `--jev` each run only behind that backend's own check. The Jev arm needs `--accept-payload`, and `--out` must name a directory outside the repository. |
+| `debug-next-check/score-debug-next-check.mjs` | Operator-run measurement of the debug next check | Reads the operator fixture passed with `--fixture`, which must sit outside the repository, and makes no model call by default. `--jev` and `--deem` each add that backend's verdict column behind its own gate. It writes only under `--out`. |
 | `finalize-dist.mjs` | Completes `npm run build` after `tsc --build` | Records the package build and source-hash cache through `../cli/lib/dist-freshness.cjs`, copies JSON assets into `dist/`, prunes stale dist roots, and checks the required artifacts are present. |
 | `run-tests.mjs` | Backs `npm test` | Routes `npm test -- --run ...` to the requested Vitest lane without running the full core suite first, under a process-group timeout that terminates the whole group on overrun. |
 | `run-tests-sharded.mjs` | Backs `npm run test:sharded` | Splits the suite into `SPECKIT_TEST_SHARDS` shards (default 12) and runs them serially, each in its own worker. |
diff --git a/.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md b/.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md
new file mode 100644
index 0000000000..909ac0cde3
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/changelog/v4.6.0.0.md
@@ -0,0 +1,32 @@
+---
+title: "system-spec-kit v4.6.0.0, Measure the Cheapest Next Check"
+description: "A new offline script measures whether a model's cheapest next debug check beats the best constant answer, with no model call in the default run."
+trigger_phrases:
+  - "system-spec-kit v4.6.0.0"
+  - "system-spec-kit 4.6.0.0"
+  - "debug next-check census"
+importance_tier: "normal"
+contextType: "general"
+version: 4.6.0.0
+---
+# v4.6.0.0, Measure the Cheapest Next Check
+
+When a debug run names a hypothesis the next move is the cheapest check that confirms or rules it out, and this release measures whether a model makes that pick better than always answering the same thing. `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` reads a JSON Lines fixture the operator keeps outside the repository, one labeled row per line, and counts what each constant answer gets right. The default run prints a census and makes no model call.
+
+## What's New at a Glance
+
+- **The default run makes no model call and never starts `jev` or `cli-deem`.** The command is `node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`. Logging stubs for both backends first on `PATH` were never called.
+- **The census reports what a debug corpus holds today.** A seam search over tracked files outside `specs/` prints `seam: none` or one `seam: <path>` per hit, and the mined corpus counts `debug-delegation.md` files and `### Hypothesis <n>` headings. On today's tree the run printed `seam: none`, `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`.
+- **Labels are the operator's job.** `--fixture <file>` takes one row per line with the fields `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`. `label` is one of `read_code`, `run_test`, `reproduce`, `instrument`, and `jev_ok` marks the rows that may leave the machine.
+- **Two stops end the run before any arm.** Fewer than 30 labeled rows prints `stop: fewer than 30 labeled rows`, and a baseline right on more than nine tenths of the rows prints `no headroom`. Neither state calls a backend.
+- **The keep rule prints before any call.** A run past both stops prints `keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M` first, so a verdict can only be read against a rule the operator saw.
+- **The model arms sit behind two switches.** `--jev` and `--deem` each need `--out <dir>` or the run prints `--jev or --deem need --out <dir> so every call is recorded` and exits 2. A `--fixture` path inside the repository prints `refused: fixture path inside the repository` and also exits 2 before any census line prints.
+- **Each arm sits behind its own gate.** Only rows with `jev_ok: true` may leave the machine, and a run with no accepted row prints `jev arm skipped: payload not accepted`. A failed gate prints its own skip line and never runs the other backend in its place.
+- **Reports hold counts and records only.** Any run with `--out <dir>` writes `report.json` there, even a stopped one, and `calls.jsonl` holds one record per call and one per withheld row and order. The script writes nothing else.
+- **No run has printed a `verdict` line.** Today's runs stop at the label gate before any arm runs, so no verdict exists and this entry claims none.
+- **The tests pass.** `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` holds 30 tests and they all pass. Run it from `.skilled/skills/system-spec-kit/runtime` with `npx vitest run tests/debug-next-check.vitest.ts`.
+- **No debug step changes.** The script only measures the choice the debug agent already makes, and the skill docs name the debug next-check census, its switches and its gates.
+
+## Upgrade
+
+No migration required. The script is new, no existing behavior changes and no debug step changes.
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md
new file mode 100644
index 0000000000..d5359de1a2
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/debug-next-check.md
@@ -0,0 +1,68 @@
+---
+title: "Debug next check"
+description: "Scores, with zero model calls by default, how often each constant next-check answer is right on operator-labeled debug rows and whether that leaves headroom, then judges the labeled rows behind `--jev` or `--deem` and reports one keep, kill or stop decision per backend."
+trigger_phrases:
+  - "debug next check"
+  - "score-debug-next-check.mjs"
+  - "debug next_check choice"
+  - "next-check label census"
+version: 4.6.0.0
+---
+
+# Debug next check (score-debug-next-check.mjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Scores, with zero model calls by default, how often each constant next-check answer is right on operator-labeled debug rows and whether that leaves headroom, then judges the labeled rows behind `--jev` or `--deem` and reports one keep, kill or stop decision per backend.
+
+The census answers two questions before anyone wires a backend pick into the debug next-check choice: does any tracked file outside the spec tree already name `next_check`, and would a backend beat the best constant answer on labeled rows. It reads only the repository's own git state and the operator fixture, makes no model call without its switch and its own gate, and writes nothing outside `--out`.
+
+---
+
+## 2. HOW IT WORKS
+
+### Seam Search And Mined Corpus
+
+Every run first lists tracked files outside `specs/` that name `next_check`, leaving out the generated trigger-phrase fixture folder, and prints one `seam: <path>` line per hit or `seam: none`. It then counts tracked `debug-delegation.md` files outside any `templates/` folder and numbered `### Hypothesis` headings under `specs/`, printing `mined: debug_delegation=<n> hypothesis_files=<n>` and `mined rows: <n>`. The repository is resolved from the script's own path, so the working directory changes nothing.
+
+### Fixture, Constants And Gates
+
+`--fixture <file>` reads an operator JSON Lines file outside the repository, one row per line with exactly the fields `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`, where `label` is one of `read_code`, `run_test`, `reproduce` or `instrument`. A path inside the repository, a bad row or an unknown switch exits 2 with a stderr line before any census line. With a fixture the run prints `fixture: rows=<n> sha256=<hex>`, the label counts, one `constant <label>: <right>/<n>` line per label and `baseline: <label> <right>/<n>` for the constant that is right most often. It prints `no headroom` when that baseline is right on more than nine tenths of the rows, and `stop: fewer than 30 labeled rows` below 30 rows, and neither case calls a backend.
+
+### Judgment Arms
+
+Each arm runs only past the label gate and the headroom check, behind its own switch and its own gate, and with both switches the Jev gate and arm run first, then the Deem gate and arm, each regardless of the other's outcome. A failed gate prints its skip line and never runs the other backend in its place. Jev reads only rows marked `jev_ok: true`: a withheld row leaves three `unmeasured_withheld` records in `calls.jsonl` and is never sent, and with no row accepted the run prints `jev arm skipped: payload not accepted`. The Jev gate checks `jev` on `PATH`, the pinned `jev 0.6.2` and a credential, while the Deem gate reads `cli-deem health` and skips a `stub` backend. Each arm asks `What is the cheapest way to confirm or rule out this hypothesis?` in three option orders per row and takes the modal pick, and Deem plans three calls per row.
+
+### Keep Rule And Verdict
+
+Before the first call the run prints `keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`, and those checks run in that order with the first failure deciding. Only a completed arm prints a `verdict` line, the same line lands in the column of `report.json`, and no run has printed one yet. With `--out <dir>` every run writes `report.json`, even a stopped one, and an arm adds `calls.jsonl`, one record per call and per withheld row and order, never row text. A printed census, a skipped arm and a stopped arm all exit 0.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Script | Runs the seam search and the mined corpus, reads the fixture, prints the constants, the gates and the keep rule, and drives both judgment arms |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Vitest | Thirty cases over synthetic fixtures, with stub `jev` and `cli-deem` binaries first on the path |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `tooling-and-scripts/debug-next-check.md`
+
+Related references:
+- [completion-claim-audit.md](completion-claim-audit.md) - the entry before this one in the category
+- [alignment-suggestion-measurement.md](alignment-suggestion-measurement.md) - the entry after this one in the category
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
index 98981a5b8b..65ef9c44a1 100644
--- a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
@@ -135,6 +135,22 @@ See [`tooling-and-scripts/completion-claim-audit.md`](tooling-and-scripts/comple
 
 ---
 
+### Debug next check
+
+#### Description
+
+Scores, with zero model calls by default, how often each constant next-check answer is right on operator-labeled debug rows and whether that leaves headroom, then judges the labeled rows behind `--jev` or `--deem` and reports one keep, kill or stop decision per backend.
+
+#### Current Reality
+
+`.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` makes zero model calls by default and writes nothing outside `--out`. Its fixture must sit outside the repository, `--jev` sends only rows marked `jev_ok: true`, and no run on real rows has printed a `verdict` line.
+
+#### Source Files
+
+See [`tooling-and-scripts/debug-next-check.md`](tooling-and-scripts/debug-next-check.md) for full implementation and test file listings.
+
+---
+
 ### Alignment suggestion measurement
 
 #### Description
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md
new file mode 100644
index 0000000000..9474f4988a
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/debug-next-check.md
@@ -0,0 +1,104 @@
+---
+title: "463 -- Debug next check"
+description: "This scenario validates the debug next check for `463`. It focuses on a default run with stubs first on the path that starts no backend, the label-gate stop over 29 rows that prints no row text, the stub-backend skip over 30 rows, and the suite that proves zero model calls."
+version: 4.6.0.0
+---
+
+# 463 -- Debug next check
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `463`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the debug next check for `463`. It focuses on a default run with stubs first on the path that starts no backend, the label-gate stop over 29 rows that prints no row text, the stub-backend skip over 30 rows, and the suite that proves zero model calls.
+
+### Why This Matters
+
+The scorer measures whether a model's choice of the cheapest next check beats the best constant answer on operator-labeled rows, and it calls no model on its default run, so the census shape has to be provable without any credential. A run over generated fixture rows shows the census and the label gate without opening a real backend, and the stub `jev` and `cli-deem` binaries first on the path show that nothing starts.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `463` and confirm the expected signals without contradictory evidence.
+
+- Objective: confirm that a default run with stubs first on the path prints the census lines, starts no stub and exits 0, that the 29-row run prints its census, fixture and baseline lines and a last line `stop: fewer than 30 labeled rows` and starts no stub, that the 30-row run with the deem arm against a stub backend adds the `keep rule:` line and `deem arm skipped: stub backend`, that the stub logs hold one `cli-deem health` line, that the two working-tree status captures match, and that the suite reports 30 passed
+- Real user request: `Does a model pick a better next check than the best constant answer, and can I find out without calling a model?`
+- Prompt: `Run the debug next check census with stubs first on the path, run it on a 29-row fixture and on a 30-row fixture with the deem arm against a stub backend, confirm nothing was called or changed, then run its test suite.`
+- Expected execution process: the working-tree status is captured, stub `cli-deem` and `jev` executables that log every call are placed first on `PATH`, a 29-row and a 30-row fixture are generated under `/tmp` with labels cycling the four constants and every `jev_ok` false, the scorer runs with no switch, the stub logs are read, the scorer runs over the 29-row fixture with `--jev --deem` and `--out`, then over the 30-row fixture with `--deem` and `--out`, the stub logs are read again, the status is captured again and compared and the vitest suite runs.
+- Expected signals: step 3 prints nothing. Step 4 prints `seam: none` (or one `seam: <path>` line per tracked hit), then `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, and exits 0. Step 5 prints nothing. Step 6 prints the same census lines, then `fixture: rows=29 sha256=<hex>`, `labels: read_code=8 run_test=7 reproduce=7 instrument=7`, `constant read_code: 8/29`, `constant run_test: 7/29`, `constant reproduce: 7/29`, `constant instrument: 7/29`, `baseline: read_code 8/29` and a last line `stop: fewer than 30 labeled rows`, with no fixture row text on stdout and exit 0. Step 7 prints the same census lines, `fixture: rows=30 sha256=<hex>`, `labels: read_code=8 run_test=8 reproduce=7 instrument=7`, `constant read_code: 8/30`, `constant run_test: 8/30`, `constant reproduce: 7/30`, `constant instrument: 7/30`, `baseline: read_code 8/30`, one line starting `keep rule:`, then `deem arm skipped: stub backend`, and exits 0. Step 8 prints `cli-deem health`. Step 9 prints nothing. Step 10 reports 30 passed and exits 0.
+- Desired user-visible outcome: the census counts, the label-gate stop line, the stub-backend skip line and a statement that nothing was called or changed, with the evidence.
+- Pass/fail: PASS if every signal holds. FAIL if a line is missing, step 5 prints a log line, step 6 prints anything beyond its last line, step 8 prints anything beyond `cli-deem health`, step 9 shows a change or a test fails.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Run the debug next check census with stubs first on the path, run it on a 29-row fixture and on a 30-row fixture with the deem arm against a stub backend, confirm nothing was called or changed, then run its test suite.`
+
+### Commands
+
+1. `git status --porcelain > /tmp/dnc-463-before.txt`
+2. `mkdir -p /tmp/dnc-463-stub && printf '#!/bin/sh\nname=${0##*/}\necho $name $* >> /tmp/dnc-463-stub/$name.log\nif [ $name = cli-deem ] && [ $1 = health ]; then\necho stub backend >&2\nexit 3\nfi\nexit 2\n' | tee /tmp/dnc-463-stub/cli-deem /tmp/dnc-463-stub/jev > /dev/null && chmod +x /tmp/dnc-463-stub/cli-deem /tmp/dnc-463-stub/jev`
+3. `for n in 29 30; do i=1; : > /tmp/dnc-463-$n.jsonl; while [ $i -le $n ]; do case $((i % 4)) in 1) l=read_code;; 2) l=run_test;; 3) l=reproduce;; 0) l=instrument;; esac; printf '{"id":"row-%d","symptom":"synthetic symptom","claim":"synthetic claim","evidence":"synthetic evidence","label":"%s","jev_ok":false}\n' "$i" "$l" >> /tmp/dnc-463-$n.jsonl; i=$((i+1)); done; done`
+4. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
+5. `find /tmp/dnc-463-stub -name '*.log' -print`
+6. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture /tmp/dnc-463-29.jsonl --jev --deem --out /tmp/dnc-463-stop-out`
+7. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture /tmp/dnc-463-30.jsonl --deem --out /tmp/dnc-463-deem-out`
+8. `find /tmp/dnc-463-stub -name '*.log' -exec cat {} \;`
+9. `git status --porcelain | diff /tmp/dnc-463-before.txt -`
+10. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/debug-next-check.vitest.ts`
+
+### Expected
+
+Step 3 prints nothing. Step 4 prints the census lines the scenario contract names and exits 0. Step 5 prints nothing. Step 6 prints the census, fixture, label, constant and baseline lines the scenario contract names, then `stop: fewer than 30 labeled rows`, and exits 0. Step 7 prints those lines for 30 rows, then one line starting `keep rule:` and `deem arm skipped: stub backend`, and exits 0. Step 8 prints `cli-deem health`. Step 9 prints nothing. Step 10 reports 30 passed and exits 0.
+
+### Evidence
+
+Capture step 4's stdout and exit status, step 5's empty output, step 6's last line and exit status, step 7's skip line and exit status, step 8's one log line, step 9's empty diff and the suite's summary line with its exit status.
+
+### Pass / Fail
+
+- **Pass**: every named line is present, step 5 prints nothing, step 6 adds nothing beyond its last line, step 8 prints only `cli-deem health`, step 9 prints nothing and the suite passes.
+- **Fail**: a named line is missing, step 5 prints a log line, step 6 prints anything beyond its last line, step 8 prints anything else, step 9 shows a change or a test fails.
+
+### Failure Triage
+
+1. When step 4, 6 or 7 exits 2, the run refused its command line or its fixture: `--jev` or `--deem` without `--out` prints `--jev or --deem need --out <dir> so every call is recorded`, a fixture path inside the repository prints `refused: fixture path inside the repository`, and a bad row prints its line number, row id and fault, so keep every generated file under `/tmp` and rerun step 3.
+2. When a `seam: <path>` line prints in place of `seam: none`, or a `mined:` count differs, a tracked file changed the census: the seam search reads tracked files outside `specs/` and `runtime/cli/retrieval/fixtures/`, and the scorer's own script and test carry the search key (`SEAM_PATTERN` in its constants), so they appear as hits once they are tracked. Read the printed paths and counts as the current census before failing the step.
+3. When step 8 prints more than `cli-deem health`, a run reached a backend: this scenario allows one call, the `health` probe of step 7, and the `jev` stub must log nothing because no arm runs past the label gate.
+4. When step 9 shows a change, name the path: the fixtures and both `--out` folders sit under `/tmp`, and the script writes only `report.json` and `calls.jsonl` under `--out`.
+5. When step 10 exceeds a short command timeout, that is the suite's cost: each test spawns the script and each run searches the real repository, so the file takes about 207 s.
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
+| `../../feature-catalog/tooling-and-scripts/debug-next-check.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Prints the census lines, the label-gate stop line and the arm skip lines, and writes the report |
+| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Thirty cases over the census, the fixture reader and both arms, with stub `jev` and `cli-deem` binaries first on the path |
+
+Provenance: runtime/tests/debug-next-check.vitest.ts
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Playbook ID: 463
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `tooling-and-scripts/debug-next-check.md`
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
index fd5c2da423..287d733cae 100644
--- a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
@@ -202,6 +202,7 @@ Every row links a scenario file that exists on disk. The **Catalog Entry** colum
 | 460 | Compaction recall census | [460](tooling-and-scripts/compaction-recall-census.md) | [compaction-recall-census](../feature-catalog/tooling-and-scripts/compaction-recall-census.md) |
 | 461 | Alignment suggestion measurement | [461](tooling-and-scripts/alignment-suggestion-measurement.md) | [alignment-suggestion-measurement](../feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md) |
 | 462 | Completion claim audit | [462](tooling-and-scripts/completion-claim-audit.md) | [completion-claim-audit](../feature-catalog/tooling-and-scripts/completion-claim-audit.md) |
+| 463 | Debug next check | [463](tooling-and-scripts/debug-next-check.md) | [debug-next-check](../feature-catalog/tooling-and-scripts/debug-next-check.md) |
 | 233 | Completion verification workflow | [233](tooling-and-scripts/completion-verification-workflow.md) | [completion-verification-workflow](../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) |
 | 240 | Core workflow infrastructure | [240](tooling-and-scripts/core-workflow-infrastructure.md) | [core-workflow-infrastructure](../feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md) |
 | DBG-SCAF-001 | Debug-delegation scaffold generator | [DBG-SCAF-001](tooling-and-scripts/debug-delegation-scaffold-generator.md) | [debug-delegation-scaffold-generator](../feature-catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md) |
diff --git a/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs b/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
new file mode 100644
index 0000000000..bf43e472bd
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
@@ -0,0 +1,1564 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: Debug Next Check Scorer
+// ───────────────────────────────────────────────────────────────────
+// Measures offline whether a model choice of the cheapest next check for a debug
+// hypothesis beats the best constant answer on operator-labeled rows. The census
+// prints counts and repository paths only, never transcript text, and makes no
+// model call until an arm switch is set and its gate passes.
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+import { spawn, spawnSync } from 'node:child_process';
+import { createHash } from 'node:crypto';
+import {
+  accessSync,
+  appendFileSync,
+  constants as fsConstants,
+  existsSync,
+  mkdirSync,
+  readFileSync,
+  realpathSync,
+  statSync,
+  writeFileSync,
+} from 'node:fs';
+import { basename, delimiter, dirname, join, resolve } from 'node:path';
+import { fileURLToPath } from 'node:url';
+import { parseArgs } from 'node:util';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Repository root, six levels above this file: scripts/<name>/ -> scripts ->
+ * runtime -> system-spec-kit -> skills -> .skilled -> repository. Resolving from
+ * the script path keeps every git command independent of the current directory.
+ */
+const REPO_ROOT = resolve(
+  dirname(fileURLToPath(import.meta.url)),
+  '..',
+  '..',
+  '..',
+  '..',
+  '..',
+  '..',
+);
+
+/** The vendored choice key this census looks for outside the spec tree. */
+const SEAM_PATTERN = 'next_check';
+
+/**
+ * Generated trigger-phrase fixtures mirror spec phrasing, so searching them would
+ * make the seam search find this project's own vocabulary instead of a caller.
+ */
+const SEAM_FIXTURES = ':!.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures';
+
+/** The agent's hypothesis heading, the shape a mined corpus row would have. */
+const HYPOTHESIS_PATTERN = '^### Hypothesis [0-9]';
+
+/** The four constant answers a row can be labeled with, in their fixed order. */
+const LABELS = ['read_code', 'run_test', 'reproduce', 'instrument'];
+
+/** The fixture row schema; a row carrying any other field is refused whole. */
+const FIXTURE_FIELDS = ['id', 'symptom', 'claim', 'evidence', 'label', 'jev_ok'];
+
+/** Fewer labeled rows than this floor cannot support a verdict, so no arm runs. */
+const LABEL_GATE = 30;
+
+/** The three left rotations of the option list; a pick is stable only when all of them agree. */
+const ORDERS = 3;
+
+/** Pinned jev version the gate accepts. */
+const JEV_VERSION = 'jev 0.6.2';
+
+/** Pinned Deem model name the health check accepts. */
+const DEEM_MODEL = 'deem-0.8-v1';
+
+/** Deem p50 latency in milliseconds, used to estimate arm wall time. */
+const DEEM_P50_MS = 65.6;
+
+/** Health probe bound; cli-deem answers within its own shorter request timeout. */
+const HEALTH_TIMEOUT_MS = 10000;
+
+/** Bounds one backend call; past it the call is unmeasured_timeout, not a stop. */
+const CALL_TIMEOUT_MS = 90000;
+
+/** Wait before the single retry of a call that exited 4. */
+const BACKOFF_MS = 2000;
+
+/** The keep rule, fixed before the first model call and stored with every report. */
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M>=9*K, kill P(X>=L)<0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M';
+
+/** The question each choice call answers; fixed before any call so a change is an amendment. */
+const CHOICE_QUESTION = 'What is the cheapest way to confirm or rule out this hypothesis?';
+
+/** The four next-check options in their fixed list order, verbatim from the caller's catalog. */
+const NEXT_CHECK_OPTIONS = [
+  ['read_code', 'Reading more of the existing code settles it, no execution needed'],
+  ['run_test', 'An existing test or a quick one-off run settles it'],
+  ['reproduce', 'It needs a reproduction of the failing scenario'],
+  ['instrument', 'It needs new logging or instrumentation before anything can be seen'],
+];
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. GIT HELPERS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Runs git in the given repository and returns its non-empty stdout lines. Every
+ * search here treats a non-zero exit as no result: git grep exits 1 when nothing
+ * matches, and a repository without the searched path answers the same way.
+ *
+ * @param {string} root - Repository root.
+ * @param {string[]} args - Arguments after the git binary.
+ * @returns {string[]} Output lines, empty when git produced none.
+ */
+function runGitLines(root, args) {
+  const result = spawnSync('git', ['-C', root, ...args], {
+    encoding: 'utf8',
+    maxBuffer: 64 * 1024 * 1024,
+  });
+  if (result.status !== 0 || result.stdout === null) {
+    return [];
+  }
+  return result.stdout.split('\n').filter((line) => line !== '');
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. SEAM SEARCH
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Lists tracked files outside the spec tree that name the next-check choice.
+ * A hit is a potential caller seam; an empty list is the closed result the
+ * census must be able to print.
+ *
+ * @param {string} root - Repository root.
+ * @returns {string[]} Repository-relative hit paths, sorted.
+ */
+export function seamSearch(root) {
+  const hits = runGitLines(root, ['grep', '-l', SEAM_PATTERN, '--', ':!specs', SEAM_FIXTURES]);
+  return hits.sort();
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. MINED CORPUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Counts what the repository itself can contribute to the corpus: tracked
+ * debug-delegation files outside the template tree, tracked spec files holding a
+ * numbered hypothesis heading, and those headings. The headings are counted in
+ * markdown under `specs/` in one pass. Zero is a result here, not an error: it
+ * shows the operator's fixture is the only corpus available.
+ *
+ * @param {string} root - Repository root.
+ * @returns {{ debugDelegation: number, hypothesisFiles: number, rows: number }}
+ *   Source file and heading counts.
+ */
+export function minedCorpus(root) {
+  const delegation = runGitLines(root, ['ls-files', '--', '*debug-delegation.md']).filter(
+    (path) => !path.split('/').includes('templates'),
+  );
+  const hypothesisCounts = runGitLines(root, [
+    'grep',
+    '-cE',
+    HYPOTHESIS_PATTERN,
+    '--',
+    'specs/*.md',
+  ]);
+  const rows = hypothesisCounts.reduce(
+    (sum, line) => sum + Number(line.slice(line.lastIndexOf(':') + 1)),
+    0,
+  );
+  return {
+    debugDelegation: delegation.length,
+    hypothesisFiles: hypothesisCounts.length,
+    rows,
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. REPOSITORY PATH GUARD
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The path with every resolvable prefix followed through symlinks and any
+ * missing tail kept as written. A symlink above the path could otherwise let
+ * an inside file present an outside name.
+ *
+ * @param {string} inputPath - Path to canonicalize.
+ * @returns {string} The resolved path.
+ */
+function canonicalizeExistingPrefix(inputPath) {
+  const missing = [];
+  let current = resolve(inputPath);
+  while (!existsSync(current)) {
+    const parent = dirname(current);
+    if (parent === current) {
+      break;
+    }
+    missing.unshift(basename(current));
+    current = parent;
+  }
+  return resolve(realpathSync(current), ...missing);
+}
+
+/**
+ * Whether a path resolves to the repository root or a path below it. Device
+ * and inode decide containment, so a name trick or a symlink above the path
+ * cannot disguise a file that lives inside the repository.
+ *
+ * @param {string} root - Repository root.
+ * @param {string} candidate - Path to test.
+ * @returns {boolean} True when the resolved path stays inside the repository.
+ */
+export function isInsideRepository(root, candidate) {
+  const rootStats = statSync(canonicalizeExistingPrefix(root));
+  let current = canonicalizeExistingPrefix(candidate);
+  while (true) {
+    if (existsSync(current)) {
+      const stats = statSync(current);
+      if (stats.dev === rootStats.dev && stats.ino === rootStats.ino) {
+        return true;
+      }
+    }
+    const parent = dirname(current);
+    if (parent === current) {
+      return false;
+    }
+    current = parent;
+  }
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. FIXTURE READER
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parses the fixture lines and validates every row against the schema. A
+ * refusal names the physical line and the row id, so the operator can fix that
+ * one row without guessing which one the scorer rejected.
+ *
+ * @param {string} text - Fixture file contents.
+ * @returns {object[]} Validated rows.
+ */
+function parseFixtureRows(text) {
+  const rows = [];
+  const seen = new Set();
+  text.split('\n').forEach((line, index) => {
+    if (line.trim() === '') {
+      return;
+    }
+    const rowNumber = index + 1;
+    let parsed;
+    try {
+      parsed = JSON.parse(line);
+    } catch {
+      throw new Error(`fixture row ${rowNumber}: not JSON`);
+    }
+    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
+      throw new Error(`fixture row ${rowNumber}: not a JSON object`);
+    }
+    if (typeof parsed.id !== 'string' || parsed.id === '') {
+      throw new Error(`fixture row ${rowNumber}: id must be a non-empty string`);
+    }
+    const where = `fixture row ${rowNumber} (id=${parsed.id})`;
+    const missing = FIXTURE_FIELDS.filter((field) => !Object.hasOwn(parsed, field));
+    if (missing.length > 0) {
+      throw new Error(`${where}: missing field ${missing.join(', ')}`);
+    }
+    const extra = Object.keys(parsed).filter((field) => !FIXTURE_FIELDS.includes(field));
+    if (extra.length > 0) {
+      throw new Error(`${where}: unknown field ${extra.join(', ')}`);
+    }
+    if (seen.has(parsed.id)) {
+      throw new Error(`${where}: duplicate id`);
+    }
+    if (!LABELS.includes(parsed.label)) {
+      const label = JSON.stringify(parsed.label);
+      throw new Error(`${where}: label ${label} is not one of ${LABELS.join(', ')}`);
+    }
+    for (const field of ['symptom', 'claim', 'evidence']) {
+      if (typeof parsed[field] !== 'string') {
+        throw new Error(`${where}: ${field} must be a string`);
+      }
+    }
+    if (typeof parsed.jev_ok !== 'boolean') {
+      throw new Error(`${where}: jev_ok must be a boolean`);
+    }
+    seen.add(parsed.id);
+    rows.push({
+      id: parsed.id,
+      symptom: parsed.symptom,
+      claim: parsed.claim,
+      evidence: parsed.evidence,
+      label: parsed.label,
+      jev_ok: parsed.jev_ok,
+    });
+  });
+  return rows;
+}
+
+/**
+ * The fixture digest, so a report can be matched to the exact labeled rows a
+ * run scored without storing any row text.
+ *
+ * @param {string} text - Fixture file contents.
+ * @returns {string} Lowercase hex SHA-256.
+ */
+function sha256Hex(text) {
+  return createHash('sha256').update(text, 'utf8').digest('hex');
+}
+
+/**
+ * Reads the operator's JSON Lines fixture from outside the repository. A path
+ * inside, an unreadable file or a row that breaks the schema refuses the whole
+ * run before any line prints or any call starts.
+ *
+ * @param {string} file - Fixture path as the operator typed it.
+ * @param {string} root - Repository root the fixture must stay outside of.
+ * @returns {{ ok: boolean, message?: string, rows?: object[], sha256?: string,
+ *   counts?: Record<string, number> }} Parsed rows, their digest and label
+ *   counts, or the refusal message.
+ */
+export function readFixture(file, root) {
+  if (isInsideRepository(root, file)) {
+    return { ok: false, message: 'refused: fixture path inside the repository' };
+  }
+  let text;
+  try {
+    text = readFileSync(file, 'utf8');
+  } catch (error) {
+    return { ok: false, message: error instanceof Error ? error.message : String(error) };
+  }
+  let rows;
+  try {
+    rows = parseFixtureRows(text);
+  } catch (error) {
+    return { ok: false, message: error instanceof Error ? error.message : String(error) };
+  }
+  const counts = {};
+  for (const label of LABELS) {
+    counts[label] = rows.filter((row) => row.label === label).length;
+  }
+  return { ok: true, rows, sha256: sha256Hex(text), counts };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. CONSTANT BASELINES
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Counts how many labeled rows each constant answer gets right. A constant that
+ * always answers one key scores exactly on the rows carrying that key, so these
+ * counts are the accuracies a backend has to beat before it is worth calling.
+ *
+ * @param {object[]} rows - Validated fixture rows.
+ * @returns {Record<string, number>} Right count per constant, keyed by LABELS.
+ */
+export function constantAccuracies(rows) {
+  const counts = {};
+  for (const label of LABELS) {
+    counts[label] = rows.filter((row) => row.label === label).length;
+  }
+  return counts;
+}
+
+/**
+ * Picks the strongest constant answer. A tie goes to the earlier key in the
+ * fixed order, so a tie lands on read_code, the cheapest answer this
+ * measurement exists to beat.
+ *
+ * @param {Record<string, number>} counts - Right count per constant.
+ * @returns {{ key: string, right: number }} Best constant and its right count.
+ */
+export function chooseBaseline(counts) {
+  let best = { key: LABELS[0], right: counts[LABELS[0]] };
+  for (const label of LABELS) {
+    if (counts[label] > best.right) {
+      best = { key: label, right: counts[label] };
+    }
+  }
+  return best;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. PAYLOAD GATE AND CALL LOG
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Splits labeled rows by the operator's payload mark. A row marked `jev_ok`
+ * holds debug notes already stripped of secrets and may go to Jev; every other
+ * row stays home. Keeping the decision in one place means a withheld row cannot
+ * reach a call by accident.
+ *
+ * @param {object[]} rows - Validated fixture rows.
+ * @returns {{ accepted: object[], withheld: object[] }} Rows Jev may read and rows held back.
+ */
+export function payloadSplit(rows) {
+  return {
+    accepted: rows.filter((row) => row.jev_ok === true),
+    withheld: rows.filter((row) => row.jev_ok !== true),
+  };
+}
+
+/**
+ * One JSON-line record per model call under outDir. A missing or empty outDir
+ * keeps no records, so nothing is created. The file appears on the first
+ * append, so a run that makes no call leaves no log behind.
+ *
+ * @param {string | null} outDir - Directory that holds calls.jsonl.
+ * @returns {{ append: (record: object) => void }} Append-only call log.
+ */
+export function createCallLog(outDir) {
+  let created = false;
+  return {
+    append(record) {
+      if (typeof outDir !== 'string' || outDir === '') return;
+      const filePath = join(outDir, 'calls.jsonl');
+      if (!created) {
+        mkdirSync(outDir, { recursive: true });
+        writeFileSync(filePath, '');
+        created = true;
+      }
+      appendFileSync(filePath, `${JSON.stringify(record)}\n`);
+    },
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. JEV GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --jev and only while a labeled fixture keeps
+// headroom. It reads no key and passes none: jev resolves its own credential,
+// so a skipped arm still writes no file and a passing one keeps the report
+// honest.
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name - Executable file name.
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched.
+ * @returns {string | null} First executable match, or null when none is executable.
+ */
+export function which(name, env) {
+  for (const dir of (env.PATH ?? '').split(delimiter)) {
+    if (dir.length === 0) continue;
+    const candidate = join(dir, name);
+    try {
+      if (statSync(candidate).isFile()) {
+        accessSync(candidate, fsConstants.X_OK);
+        return candidate;
+      }
+    } catch {
+      continue;
+    }
+  }
+  return null;
+}
+
+/**
+ * Identity line, then the pinned version and a credential check. A miss prints
+ * a skip line and leaves the census text already written.
+ *
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number
+ * }} ctx Line writer, environment and per-call timeout.
+ * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed.
+ */
+export function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const path = which('jev', ctx.env);
+  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
+  if (path === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs,
+  };
+  const version = spawnSync(path, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+
+  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path, provider, reason: skipLine };
+  }
+  return { passed: true, path, provider };
+}
+
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF and exits 2 on an inherited
+ * terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn.
+ * @param {string[]} args - Arguments after the executable.
+ * @param {string} stdinText - Text written to stdin, then closed.
+ * @param {Record<string, string | undefined>} env - Child environment.
+ * @param {number} timeoutMs - Kill and resolve after this many milliseconds.
+ * @returns {Promise<{
+ *   code: number | null,
+ *   stdout: string,
+ *   stderr: string,
+ *   wallMs: number,
+ *   timedOut: boolean
+ * }>}
+ */
+export function spawnCall(file, args, stdinText, env, timeoutMs) {
+  return new Promise((resolve) => {
+    const start = Date.now();
+    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
+    let stdout = '';
+    let stderr = '';
+    let settled = false;
+
+    child.stdout.setEncoding('utf8');
+    child.stderr.setEncoding('utf8');
+    child.stdout.on('data', (chunk) => { stdout += chunk; });
+    child.stderr.on('data', (chunk) => { stderr += chunk; });
+    // A child that exits before reading stdin cannot fail the call through
+    // the pipe: its exit code is the outcome the caller needs.
+    child.stdin.on('error', () => {});
+    child.stdin.end(stdinText);
+
+    const timer = setTimeout(() => {
+      child.kill('SIGKILL');
+      settle(null, true);
+    }, timeoutMs);
+
+    function settle(code, timedOut) {
+      if (settled) return;
+      settled = true;
+      clearTimeout(timer);
+      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
+    }
+
+    child.on('close', (code) => settle(code === null ? -1 : code, false));
+    child.on('error', (error) => {
+      stderr = error.message;
+      settle(127, false);
+    });
+  });
+}
+
+/**
+ * The stdin state sent for one row: the symptom, the hypothesis under test and
+ * the evidence gathered so far, one labeled line each. The labels let the
+ * backend tell the fields apart without guessing at free text.
+ *
+ * @param {{ symptom: string, claim: string, evidence: string }} row - Validated fixture row.
+ * @returns {string} Labeled multi-line state text.
+ */
+export function stateText(row) {
+  return `Symptom: ${row.symptom}\nHypothesis: ${row.claim}\nEvidence: ${row.evidence}`;
+}
+
+/**
+ * Left rotation of the option pairs: order 0 leaves the list as given, order 1
+ * moves the first pair to the end. Rotating the list without changing any pair
+ * asks the same row once per order, so a positional preference shows up as
+ * disagreeing picks.
+ *
+ * @param {Array<[string, string]>} pairs - Option key and description pairs.
+ * @param {number} order - Places to rotate left.
+ * @returns {Array<[string, string]>} Rotated pairs.
+ */
+export function rotateOptions(pairs, order) {
+  return [...pairs.slice(order), ...pairs.slice(0, order)];
+}
+
+/**
+ * The chosen key and its probability from one choice body. A body that does
+ * not parse, a pick outside the option keys, or a missing probability is a
+ * missed measurement, not a crash.
+ *
+ * @param {string} stdout - Raw stdout of one choice call.
+ * @param {string[]} keys - Option keys the pick must be one of.
+ * @returns {{ pick: string, pickProb: number | null } | null} Parsed answer,
+ *   or null when the body carries no valid pick.
+ */
+export function parseChoiceAnswer(stdout, keys) {
+  let parsed;
+  try {
+    parsed = JSON.parse(stdout);
+  } catch {
+    return null;
+  }
+  const choice = parsed?.answers?.answer?.choice;
+  if (typeof choice !== 'string' || !keys.includes(choice)) {
+    return null;
+  }
+  const probability = parsed.answers.answer.probabilities?.[choice];
+  return { pick: choice, pickProb: typeof probability === 'number' ? probability : null };
+}
+
+/**
+ * One auth test, then one choice call per accepted row per option order, with
+ * one call-log record per spawn. Exit 4 gets one retry after the backoff,
+ * because a dropped connection is not a judgment. A stop prints its line and
+ * the rows that finished, and leaves the column and verdict unprinted.
+ *
+ * @param {{
+ *   rows: object[],
+ *   pairs: Array<[string, string]>,
+ *   question: string
+ * }} plan Accepted rows, the option pairs and the question text.
+ * @param {{ path: string, provider: string }} gate - Passing jevGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   backoffMs: number,
+ *   callLog: { append: (record: object) => void }
+ * }} ctx Line writer, environment, per-call timeout, retry wait and the call log.
+ * @returns {Promise<{
+ *   stopped: string | null,
+ *   partialRows: number,
+ *   answers: Map<string, Array<string | null>>,
+ *   wallTimes: number[],
+ *   model: string
+ * }>} Collected picks and wall times, or the stop line once an arm stops.
+ */
+export async function runJevArm(plan, gate, ctx) {
+  let chars = 0;
+  for (const row of plan.rows) {
+    chars += stateText(row).length + plan.question.length;
+    for (const [key, description] of plan.pairs) {
+      chars += key.length + description.length + 1;
+    }
+  }
+  chars *= ORDERS;
+  ctx.out(`jev: payload: operator debug notes marked jev_ok; planned calls: ${ORDERS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  const answers = new Map();
+  let model = 'unknown';
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished, answers, wallTimes, model };
+  }
+
+  const auth = await spawnCall(
+    gate.path,
+    ['auth', 'test', '--provider', gate.provider],
+    '',
+    ctx.env,
+    ctx.timeoutMs,
+  );
+  wallTimes.push(auth.wallMs);
+  if (auth.code === 0) {
+    let parsed;
+    try {
+      parsed = JSON.parse(auth.stdout);
+    } catch {
+      // A body that does not parse leaves the model unknown.
+    }
+    if (typeof parsed?.model === 'string') model = parsed.model;
+  }
+  ctx.callLog.append({
+    backend: 'jev',
+    rowId: null,
+    order: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    pick: null,
+    pickProb: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion: JEV_VERSION,
+    provider: gate.provider,
+    model,
+  });
+  if (auth.code !== 0) {
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    return stop('jev arm stopped: auth test failed');
+  }
+  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);
+
+  const keys = plan.pairs.map(([key]) => key);
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its pick and probability stay empty and its status unmeasured.
+   */
+  function record(rowId, order, attempt, result, pick, pickProb, status) {
+    return {
+      backend: 'jev',
+      rowId,
+      order,
+      attempt,
+      wallMs: result.wallMs,
+      exitCode: result.code,
+      pick,
+      pickProb,
+      status,
+      jevVersion: JEV_VERSION,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = ['choice', '--provider', gate.provider, '-q', plan.question];
+      for (const [key, description] of rotateOptions(plan.pairs, order)) {
+        args.push('-o', `${key}=${description}`);
+      }
+      let attempt = 1;
+      let result = await spawnCall(gate.path, args, stateText(row), ctx.env, ctx.timeoutMs);
+      wallTimes.push(result.wallMs);
+
+      if (!result.timedOut && result.code === 4) {
+        ctx.callLog.append(record(row.id, order, attempt, result, null, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        attempt = 2;
+        result = await spawnCall(gate.path, args, stateText(row), ctx.env, ctx.timeoutMs);
+        wallTimes.push(result.wallMs);
+      }
+
+      let pick = null;
+      let pickProb = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (result.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (result.code === 0) {
+        const answer = parseChoiceAnswer(result.stdout, keys);
+        if (answer !== null) {
+          pick = answer.pick;
+          pickProb = answer.pickProb;
+          status = 'measured';
+        }
+      } else if (result.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (result.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (result.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row.id, order, attempt, result, pick, pickProb, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push(pick);
+    }
+    answers.set(row.id, picks);
+    finished += 1;
+  }
+
+  return { stopped: null, partialRows: finished, answers, wallTimes, model };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. DEEM GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The gate runs only behind --deem and only while a labeled fixture keeps
+// headroom. Nothing leaves the machine, so the arm needs no payload gate; a
+// failed health check still prints its skip line and starts nothing.
+
+/** Repo copy of the cli-deem entry point, run under node when none is on PATH. */
+const REPO_CLI_DEEM = join(
+  REPO_ROOT,
+  '.skilled',
+  'skills',
+  'cli-classifier',
+  'cli-deem',
+  'scripts',
+  'cli-deem.mjs',
+);
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repository copy
+ * under node. Keeping the fallback here means a checked-in install works
+ * without a PATH edit.
+ *
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched.
+ * @returns {string[]} Command and leading arguments for one call.
+ */
+export function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, a wrong model or a
+ * body without both commit hashes is a failed check the caller prints as a
+ * skip.
+ *
+ * @param {string[]} cmd - Command from deemCommand.
+ * @param {Record<string, string | undefined>} env - Environment for the call.
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string,
+ *   sourceCommit: string } | { ok: false, reason: string, found: unknown }}
+ *   The identity pair when the check passes, and the failure reason otherwise.
+ */
+export function readDeemHealth(cmd, env) {
+  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
+    env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: HEALTH_TIMEOUT_MS,
+  });
+  let errorText = (result.stderr ?? '').trim();
+  try {
+    errorText = JSON.parse(errorText).error;
+  } catch {
+    // Leave the trimmed stderr when it is not JSON.
+  }
+
+  if (result.error || result.status === 4) {
+    return { ok: false, reason: 'not reachable', found: errorText };
+  }
+  if (result.status === 3) {
+    let reason = 'bad health response';
+    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
+    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
+    return { ok: false, reason, found: errorText };
+  }
+  if (result.status === 0) {
+    const stdoutText = (result.stdout ?? '').trim();
+    let body;
+    try {
+      body = JSON.parse(stdoutText);
+    } catch {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    const backend = body?.backend;
+    if (typeof backend === 'string' && backend.includes('stub')) {
+      return { ok: false, reason: 'stub backend', found: backend };
+    }
+    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
+      return { ok: false, reason: 'bad health response', found: String(backend) };
+    }
+    const model = body?.model;
+    if (model !== DEEM_MODEL) {
+      return { ok: false, reason: 'model', found: String(model) };
+    }
+    const modelCommit = body?.model_commit;
+    const sourceCommit = body?.source_commit;
+    if (
+      body?.ok !== true
+      || typeof modelCommit !== 'string'
+      || modelCommit === ''
+      || typeof sourceCommit !== 'string'
+      || sourceCommit === ''
+    ) {
+      return { ok: false, reason: 'bad health response', found: stdoutText };
+    }
+    return { ok: true, backend, model, modelCommit, sourceCommit };
+  }
+  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
+}
+
+/**
+ * Prints the health line, or a skip line when the check fails. A skip line
+ * leaves the census text already written, so a refused backend changes no
+ * earlier line.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx - Line writer and environment.
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
+ */
+export function deemGate(ctx) {
+  const cmd = deemCommand(ctx.env);
+  const health = readDeemHealth(cmd, ctx.env);
+  if (health.ok) {
+    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
+    return { passed: true, cmd, ...health };
+  }
+  const skipLine = `deem arm skipped: ${health.reason}`;
+  ctx.out(skipLine);
+  if (health.reason === 'model' || health.reason === 'bad health response') {
+    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
+  }
+  return { passed: false, cmd, reason: skipLine };
+}
+
+/**
+ * One choice call per labeled row per option order, with one call-log record
+ * per spawn. Exit 4 gets one health recheck before a single retry, because a
+ * dropped connection is not a judgment and a changed model identity must stop
+ * the arm. A stop prints its line and the rows that finished, and leaves the
+ * column and verdict unprinted.
+ *
+ * @param {{
+ *   rows: object[],
+ *   pairs: Array<[string, string]>,
+ *   question: string
+ * }} plan Labeled rows, the option pairs and the question text.
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passing deemGate result.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   callLog: { append: (record: object) => void }
+ * }} ctx Line writer, environment, per-call timeout and the call log.
+ * @returns {Promise<{
+ *   stopped: string | null,
+ *   partialRows: number,
+ *   answers: Map<string, Array<string | null>>,
+ *   wallTimes: number[]
+ * }>} Collected picks and wall times, or the stop line once an arm stops.
+ */
+export async function runDeemArm(plan, gate, ctx) {
+  const planned = ORDERS * plan.rows.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 in deem-local.md`);
+
+  const wallTimes = [];
+  const answers = new Map();
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished, answers, wallTimes };
+  }
+
+  const keys = plan.pairs.map(([key]) => key);
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its pick and probability stay empty and its status unmeasured.
+   */
+  function record(rowId, order, attempt, result, pick, pickProb, status) {
+    return {
+      backend: 'deem',
+      rowId,
+      order,
+      attempt,
+      wallMs: result.wallMs,
+      exitCode: result.code,
+      pick,
+      pickProb,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = [...gate.cmd.slice(1), 'choice', '-q', plan.question];
+      for (const [key, description] of rotateOptions(plan.pairs, order)) {
+        args.push('-o', `${key}=${description}`);
+      }
+      let attempt = 1;
+      let result = await spawnCall(gate.cmd[0], args, stateText(row), ctx.env, ctx.timeoutMs);
+      wallTimes.push(result.wallMs);
+
+      if (!result.timedOut && result.code === 4) {
+        ctx.callLog.append(record(row.id, order, attempt, result, null, null, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        attempt = 2;
+        result = await spawnCall(gate.cmd[0], args, stateText(row), ctx.env, ctx.timeoutMs);
+        wallTimes.push(result.wallMs);
+      }
+
+      let pick = null;
+      let pickProb = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (result.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (result.code === 0) {
+        const answer = parseChoiceAnswer(result.stdout, keys);
+        if (answer !== null) {
+          pick = answer.pick;
+          pickProb = answer.pickProb;
+          status = 'measured';
+        }
+      } else if (result.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (result.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (result.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row.id, order, attempt, result, pick, pickProb, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push(pick);
+    }
+    answers.set(row.id, picks);
+    finished += 1;
+  }
+
+  return { stopped: null, partialRows: finished, answers, wallTimes };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 12. KEEP RULE AND VERDICT
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The keep rule is fixed before any model run, the counts stay integers and both
+// tails are exact, so no rounding decides a verdict.
+
+/**
+ * One-sided exact tail P(X >= k) for X ~ Binomial(n, 1/2), summed coefficient
+ * by coefficient in BigInt. The threshold test is exact too: 20 * num < den is
+ * p < 0.05 with no float comparison. No trials give p 1.
+ *
+ * @param {number} k - Successes the tail starts at.
+ * @param {number} n - Trials.
+ * @returns {{ p: number, below: boolean }} Tail probability and whether it is below 0.05.
+ */
+export function binomialTail(k, n) {
+  if (n === 0) return { p: 1, below: false };
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= n; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
+    if (i >= k) num += coefficient;
+  }
+  const den = 1n << BigInt(n);
+  return { p: Number(num) / Number(den), below: 20n * num < den };
+}
+
+/**
+ * The pick at least two option orders name, with its count. One submitted key
+ * is its own winner; three different keys name no winner, so the pick stays
+ * null and the top count stays 1, the unstable case. A missing pick belongs to
+ * a row that is not measured at all.
+ *
+ * @param {Array<string | null>} picks - Keys the option orders submitted for one row.
+ * @returns {{ pick: string | null, top: number }} Modal key and its count.
+ */
+export function modalPick(picks) {
+  if (picks.some((pick) => pick === null)) return { pick: null, top: 0 };
+  const counts = new Map();
+  for (const pick of picks) {
+    counts.set(pick, (counts.get(pick) ?? 0) + 1);
+  }
+  for (const [pick, count] of counts) {
+    if (2 * count > picks.length) return { pick, top: count };
+  }
+  return { pick: null, top: 1 };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign test,
+ * flips. The p on the line is the deciding tail: 1 for coverage, the loss tail
+ * for a kill, the sign-test tail otherwise.
+ *
+ * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - Row counts the keep rule reads.
+ * @returns {{ verdict: string, p: number }} The verdict and its deciding tail.
+ */
+export function decideVerdict({ K, M, A, B, W, L, F }) {
+  const killP = binomialTail(L, W + L);
+  const signP = binomialTail(W, W + L);
+  if (!(10 * M >= 9 * K)) return { verdict: 'stop (coverage)', p: 1 };
+  if (killP.below) return { verdict: 'kill', p: killP.p };
+  if (!(10 * (A - B) >= M)) return { verdict: 'stop (margin)', p: signP.p };
+  if (!signP.below) return { verdict: 'stop (sign test)', p: signP.p };
+  if (!(10 * F <= 3 * M)) return { verdict: 'stop (flips)', p: signP.p };
+  return { verdict: 'keep', p: signP.p };
+}
+
+/**
+ * A probability in the form the verdict line prints it.
+ *
+ * @param {number} p - Probability in [0, 1].
+ * @returns {string} Four significant digits.
+ */
+export function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * One backend column's counts and verdict. A row is measured only when all
+ * three option orders submitted a key; a row whose orders name no majority is
+ * unstable and counts as a miss, and the votes its modal pick lacks add to the
+ * flip count.
+ *
+ * @param {{
+ *   backend: string,
+ *   rows: object[],
+ *   baselineKey: string,
+ *   answers: Map<string, Array<string | null>>
+ * }} input - Rows this column may score, the baseline key and each row's picks.
+ * @returns {{ backend: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, verdict: string, p: number }}
+ *   Counts, the verdict and its deciding tail.
+ */
+export function summarizeColumn({ backend, rows, baselineKey, answers }) {
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  let unstable = 0;
+  for (const row of rows) {
+    const picks = answers.get(row.id);
+    if (!Array.isArray(picks) || picks.length !== ORDERS || picks.some((pick) => typeof pick !== 'string')) {
+      continue;
+    }
+    const { pick, top } = modalPick(picks);
+    M += 1;
+    F += ORDERS - top;
+    if (pick === null) unstable += 1;
+    const columnRight = pick === row.label;
+    const baselineRight = baselineKey === row.label;
+    if (columnRight) A += 1;
+    if (baselineRight) B += 1;
+    if (columnRight && !baselineRight) W += 1;
+    if (baselineRight && !columnRight) L += 1;
+  }
+  const { verdict, p } = decideVerdict({ K: rows.length, M, A, B, W, L, F });
+  return { backend, K: rows.length, M, A, B, W, L, F, unstable, verdict, p };
+}
+
+/**
+ * The one-line verdict: counts, deciding tail, baseline and backend identity.
+ *
+ * @param {{ backend: string, verdict: string, K: number, M: number, A: number, B: number, W: number, L: number, F: number, p: number }} summary - One column summary.
+ * @param {string} baselineKey - Constant the column was scored against.
+ * @param {string} [suffix] - Identity fields, appended when non-empty.
+ * @returns {string} The verdict line.
+ */
+export function verdictLine(summary, baselineKey, suffix) {
+  const { backend, verdict, K, M, A, B, W, L, F, p } = summary;
+  let line = `verdict ${backend}: ${verdict} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(p)} baseline=${baselineKey}`;
+  if (typeof suffix === 'string' && suffix !== '') line += ` ${suffix}`;
+  return line;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 13. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The nearest-rank quantile of the measured wall times, or null when none was
+ * recorded. Rounded to whole milliseconds, the unit the call log carries.
+ *
+ * @param {number[]} values - Wall times in milliseconds.
+ * @param {number} q - Quantile in (0, 1].
+ * @returns {number | null} The quantile, or null when values is empty.
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+/**
+ * One column line with both latency quantiles, each printed as `none` when
+ * absent. The Jev line adds how many rows the payload gate withheld, so its row
+ * count covers only rows that backend may read.
+ *
+ * @param {{ backend: string, K: number, M: number, unstable: number }} summary - One column summary.
+ * @param {{ p50: number | null, p95: number | null }} latency - Nearest-rank wall times.
+ * @param {number | null} withheld - Rows held back, or null when the column counts them itself.
+ * @returns {string} The column line.
+ */
+function columnLine(summary, latency, withheld) {
+  const { backend, K, M, unstable } = summary;
+  const withheldField = typeof withheld === 'number' ? ` withheld=${withheld}` : '';
+  return `column ${backend}: rows=${K} measured=${M} unmeasured=${K - M} unstable=${unstable}${withheldField}`
+    + ` latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`;
+}
+
+/**
+ * Parsed report.json written by an earlier run into the same directory.
+ *
+ * @param {string | null} outDir - Directory that may hold report.json.
+ * @returns {object | null} The parsed report, or null when outDir is empty,
+ *   the file is missing, or the file does not parse.
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(readFileSync(join(outDir, 'report.json'), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+/**
+ * The requalify line when the stored report names another identity, or null
+ * when it names the same one. A keep holds only for the backend it was
+ * measured on, so a changed pair has to be visible before the new verdict.
+ *
+ * @param {string} backend - Arm the line belongs to.
+ * @param {object | null} stored - Parsed report from an earlier run.
+ * @param {{ provider?: string, model?: string, modelCommit?: string, sourceCommit?: string }} identity - Identity this run measured.
+ * @returns {string | null} The requalify line, or null when nothing changed.
+ */
+function requalifyLine(backend, stored, identity) {
+  const column = stored?.columns?.[backend];
+  if (!column) return null;
+  if (backend === 'deem' && (column.modelCommit !== identity.modelCommit || column.sourceCommit !== identity.sourceCommit)) {
+    return 'requalify: model commit changed';
+  }
+  if (backend === 'jev' && (column.provider !== identity.provider || column.model !== identity.model)) {
+    return 'requalify: model changed';
+  }
+  return null;
+}
+
+/**
+ * The report.json body. An arm with no result is left out of every map: a
+ * skipped arm records its line, a stopped arm its line and the rows that
+ * finished, and a column arm its counts, its line and its identity. The report
+ * never holds the fixture path or any row text.
+ *
+ * @param {{
+ *   seam: string[],
+ *   mined: { debugDelegation: number, hypothesisFiles: number, rows: number },
+ *   fixture: { sha256: string } | null,
+ *   labels: Record<string, number> | null,
+ *   constants: Record<string, number> | null,
+ *   baseline: { key: string, right: number } | null,
+ *   jev?: object,
+ *   deem?: object
+ * }} input - Census results, fixture-derived numbers and one arm result per backend.
+ * @returns {object} The report.json body.
+ */
+export function buildReport({ seam, mined, fixture, labels, constants, baseline, jev, deem }) {
+  const report = {
+    seam,
+    mined,
+    fixtureSha256: fixture === null ? null : fixture.sha256,
+    labels,
+    constants,
+    baseline,
+    keepRule: KEEP_RULE_LINE,
+    columns: {},
+    skipped: {},
+    stopped: {},
+    requalify: {},
+  };
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (arm === undefined || arm === null) continue;
+    if (arm.skipped !== undefined) report.skipped[backend] = arm.skipped;
+    if (arm.stopped !== undefined) report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
+    if (arm.column !== undefined) {
+      report.columns[backend] = arm.column;
+      report.requalify[backend] = arm.requalify ?? null;
+    }
+  }
+  return report;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 14. CLI
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parses the command line into switch values. No positional arguments are
+ * accepted; a refusal carries its message so the caller can print it before any
+ * work starts.
+ *
+ * @param {string[]} argv - Raw arguments after the script name.
+ * @returns {{ ok: boolean, message?: string, options?: object }} Parsed switches
+ *   or the refusal message.
+ */
+export function parseCliArgs(argv) {
+  let values;
+  try {
+    ({ values } = parseArgs({
+      args: argv,
+      options: {
+        fixture: { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+      },
+      strict: true,
+      allowPositionals: false,
+    }));
+  } catch (error) {
+    return { ok: false, message: `usage error: ${error.message}` };
+  }
+  return {
+    ok: true,
+    options: {
+      fixture: values.fixture === undefined ? null : values.fixture,
+      jev: values.jev === true,
+      deem: values.deem === true,
+      out: values.out === undefined ? null : values.out,
+    },
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 15. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Runs the census end to end and returns the process exit code.
+ *
+ * @param {string[]} argv - Raw arguments after the script name.
+ * @param {{
+ *   root?: string,
+ *   stdout?: (line: string) => void,
+ *   stderr?: (line: string) => void,
+ *   env?: Record<string, string | undefined>,
+ *   timeoutMs?: number,
+ *   backoffMs?: number
+ * }} [deps] Repository root, line writers and arm process settings, so tests
+ *   can run without the process streams or the default timings.
+ * @returns {Promise<number>} 0 for a printed census or a stopped label gate,
+ *   2 for a refused command line or fixture.
+ */
+export async function main(argv, deps = {}) {
+  const root = deps.root ?? REPO_ROOT;
+  const stdout = deps.stdout ?? ((line) => process.stdout.write(`${line}\n`));
+  const stderr = deps.stderr ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
+  const parsed = parseCliArgs(argv);
+  if (!parsed.ok) {
+    stderr(parsed.message);
+    return 2;
+  }
+  const { fixture, jev, deem, out } = parsed.options;
+
+  // Both arm switches need a report directory before any work starts, so no call
+  // can run without a record of it.
+  if ((jev || deem) && out === null) {
+    stderr('--jev or --deem need --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  // The fixture is read before any census line prints, so a refused path or a
+  // bad row rejects the run whole instead of leaving half a census on screen.
+  let fixtureData = null;
+  if (fixture !== null) {
+    fixtureData = readFixture(fixture, root);
+    if (!fixtureData.ok) {
+      stderr(fixtureData.message);
+      return 2;
+    }
+  }
+
+  const seam = seamSearch(root);
+  if (seam.length === 0) {
+    stdout('seam: none');
+  } else {
+    for (const hit of seam) {
+      stdout(`seam: ${hit}`);
+    }
+  }
+
+  const mined = minedCorpus(root);
+  stdout(`mined: debug_delegation=${mined.debugDelegation} hypothesis_files=${mined.hypothesisFiles}`);
+  stdout(`mined rows: ${mined.rows}`);
+
+  // The run replaces report.json at the end, so a prior body is read first: it
+  // carries the identity a new column has to match to stay qualified.
+  const stored = readStoredReport(out);
+  const arms = {};
+  let fixtureReport = null;
+
+  if (fixtureData !== null) {
+    const { rows, sha256, counts } = fixtureData;
+    stdout(`fixture: rows=${rows.length} sha256=${sha256}`);
+    const labelCounts = LABELS.map((label) => `${label}=${counts[label]}`).join(' ');
+    stdout(`labels: ${labelCounts}`);
+    const accuracies = constantAccuracies(rows);
+    for (const label of LABELS) {
+      stdout(`constant ${label}: ${accuracies[label]}/${rows.length}`);
+    }
+    const baseline = chooseBaseline(accuracies);
+    stdout(`baseline: ${baseline.key} ${baseline.right}/${rows.length}`);
+    // A constant right on more than nine tenths of the rows leaves no room for
+    // the ten-point gain a verdict needs, so no backend gets called.
+    const headroom = 10 * baseline.right <= 9 * rows.length;
+    if (!headroom) {
+      stdout('no headroom');
+    }
+    if (rows.length < LABEL_GATE) {
+      stdout(`stop: fewer than ${LABEL_GATE} labeled rows`);
+    }
+    // The rule is printed before the first gate, so a verdict can never be read
+    // against a rule the operator did not see fixed first.
+    if (headroom && rows.length >= LABEL_GATE) {
+      stdout(KEEP_RULE_LINE);
+    }
+    fixtureReport = { labels: counts, constants: accuracies, baseline };
+
+    const callLog = createCallLog(out);
+    // The payload gate runs only where the Jev arm would: a stopped run prints
+    // its stop line and composes no payload.
+    if (jev && headroom && rows.length >= LABEL_GATE) {
+      const payload = payloadSplit(rows);
+      if (payload.accepted.length === 0) {
+        const skipped = 'jev arm skipped: payload not accepted';
+        stdout(skipped);
+        arms.jev = { skipped };
+      } else {
+        // A withheld row leaves one record per option order and never reaches a
+        // backend, so the column can account for it without its text.
+        for (const row of payload.withheld) {
+          for (let order = 0; order < ORDERS; order += 1) {
+            callLog.append({
+              backend: 'jev',
+              rowId: row.id,
+              order,
+              attempt: null,
+              wallMs: 0,
+              exitCode: null,
+              pick: null,
+              pickProb: null,
+              status: 'unmeasured_withheld',
+            });
+          }
+        }
+
+        // The payload gate proved at least one row may leave, so the arm can
+        // run; its own gate decides, and a failed gate never starts the other
+        // backend in its place.
+        const gate = jevGate({ out: stdout, env, timeoutMs });
+        if (gate.passed) {
+          const result = await runJevArm(
+            { rows: payload.accepted, pairs: NEXT_CHECK_OPTIONS, question: CHOICE_QUESTION },
+            gate,
+            { out: stdout, env, timeoutMs, backoffMs, callLog },
+          );
+          if (result.stopped !== null) {
+            arms.jev = { stopped: result.stopped, partialRows: result.partialRows };
+          } else {
+            const summary = summarizeColumn({
+              backend: 'jev',
+              rows: payload.accepted,
+              baselineKey: baseline.key,
+              answers: result.answers,
+            });
+            const latency = { p50: nearestRank(result.wallTimes, 0.5), p95: nearestRank(result.wallTimes, 0.95) };
+            stdout(columnLine(summary, latency, payload.withheld.length));
+            const requalify = requalifyLine('jev', stored, { provider: gate.provider, model: result.model });
+            if (requalify !== null) {
+              stdout(requalify);
+            }
+            const line = verdictLine(summary, baseline.key, `jev_version=0.6.2 provider=${gate.provider} model=${result.model}`);
+            stdout(line);
+            arms.jev = {
+              column: { ...summary, latency, line, jevVersion: '0.6.2', provider: gate.provider, model: result.model },
+              requalify,
+            };
+          }
+        } else {
+          arms.jev = { skipped: gate.reason };
+        }
+      }
+    }
+
+    // The Deem arm runs after the Jev arm, on its own gate: a fixture that
+    // keeps headroom and carries the label floor may always be scored locally,
+    // and a failed backend never runs in the other's place.
+    if (deem && headroom && rows.length >= LABEL_GATE) {
+      const deemCheck = deemGate({ out: stdout, env });
+      if (deemCheck.passed) {
+        const result = await runDeemArm(
+          { rows, pairs: NEXT_CHECK_OPTIONS, question: CHOICE_QUESTION },
+          deemCheck,
+          { out: stdout, env, timeoutMs, callLog },
+        );
+        if (result.stopped !== null) {
+          arms.deem = { stopped: result.stopped, partialRows: result.partialRows };
+        } else {
+          const summary = summarizeColumn({ backend: 'deem', rows, baselineKey: baseline.key, answers: result.answers });
+          const latency = { p50: nearestRank(result.wallTimes, 0.5), p95: nearestRank(result.wallTimes, 0.95) };
+          stdout(columnLine(summary, latency, null));
+          const requalify = requalifyLine('deem', stored, {
+            modelCommit: deemCheck.modelCommit,
+            sourceCommit: deemCheck.sourceCommit,
+          });
+          if (requalify !== null) {
+            stdout(requalify);
+          }
+          const line = verdictLine(
+            summary,
+            baseline.key,
+            `model=${deemCheck.model} model_commit=${deemCheck.modelCommit} source_commit=${deemCheck.sourceCommit}`,
+          );
+          stdout(line);
+          arms.deem = {
+            column: {
+              ...summary,
+              latency,
+              line,
+              model: deemCheck.model,
+              modelCommit: deemCheck.modelCommit,
+              sourceCommit: deemCheck.sourceCommit,
+            },
+            requalify,
+          };
+        }
+      } else {
+        arms.deem = { skipped: deemCheck.reason };
+      }
+    }
+  }
+
+  // A named report directory gets the run record even when no arm ran, so a
+  // stopped census is still readable next to the fixture that produced it.
+  if (out !== null) {
+    const report = buildReport({
+      seam,
+      mined,
+      fixture: fixtureData,
+      labels: fixtureReport === null ? null : fixtureReport.labels,
+      constants: fixtureReport === null ? null : fixtureReport.constants,
+      baseline: fixtureReport === null ? null : fixtureReport.baseline,
+      jev: arms.jev,
+      deem: arms.deem,
+    });
+    mkdirSync(out, { recursive: true });
+    writeFileSync(join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
+  }
+  return 0;
+}
+
+// Node sets import.meta.url from the real path while argv keeps the typed path, so a
+// script started through a symlink matches only once both sides are resolved.
+export function isEntryPoint() {
+  try {
+    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
+  } catch {
+    return false;
+  }
+}
+
+if (isEntryPoint()) {
+  process.exitCode = await main(process.argv.slice(2));
+}
```
