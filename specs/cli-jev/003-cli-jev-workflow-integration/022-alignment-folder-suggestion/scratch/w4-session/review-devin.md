# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/README.md`
- `.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md`
- `.hermes/skills/system-spec-kit/SKILL.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
index d1c506e0f5..b81a6c4e0a 100644
--- a/.skilled/skills/system-spec-kit/SKILL.md
+++ b/.skilled/skills/system-spec-kit/SKILL.md
@@ -2,7 +2,7 @@
 name: system-spec-kit
 description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, trigger-index and ripgrep retrieval. Required for file modifications."
 allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
-version: 4.3.0.0
+version: 4.4.0.0
 ---
 
 <!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, trigger-index, retrieval-conventions, ripgrep-retrieval, continuity-writer, handover, opencode-goal, goal-plugin, active_goal, session-goal, importance-tiers -->
@@ -569,6 +569,7 @@ P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code
 | Regenerate trigger index | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` |
 | Free-text retrieval | The ripgrep recipes in `references/retrieval/retrieval-conventions.md` §2, scoped by the trailing positional path |
 | Compaction recall census | `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts <dir> --newest-compacted 15 --out <file outside the repo>` makes no model call, prints counts and one `stop:` line and changes no transcript |
+| Alignment suggestion measurement | `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts` makes no model call and prints below-50 alignment counts per save path; `--score <rows>` prints `stop: fewer than 30 labeled rows` until the operator labels 30, and `--jev` or `--deem` with `--out <dir outside the repo>` add a verdict column behind that backend's own check |
 | Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
 | Upgrade level | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh specs/007-feature/ --to 2` |
 | Completeness | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/007-feature/` |
diff --git a/.skilled/skills/system-spec-kit/README.md b/.skilled/skills/system-spec-kit/README.md
index c35a74ce3e..61eb28ec27 100644
--- a/.skilled/skills/system-spec-kit/README.md
+++ b/.skilled/skills/system-spec-kit/README.md
@@ -316,6 +316,12 @@ scores and one stop line: whether the stock summary and the recovered-context br
 work after the compaction uses, and whether the vendored staged fit can hold the session at all. It
 changes no hook, setting or transcript.
 
+`runtime/cli/evals/score-alignment-suggestion.ts` measures offline whether a classifier picking one
+of the folders the validator lists when a save scores below 50 would beat the plain baseline. Its
+default run makes no model call and changes no save. `--score` runs alone and stops at the label
+gate: with fewer than 30 labeled rows it prints one stop line and exits 0. `--jev` and `--deem`
+each add a verdict column behind that backend's own check.
+
 ---
 
 ## 5. COMMANDS
diff --git a/.skilled/skills/system-spec-kit/runtime/cli/evals/README.md b/.skilled/skills/system-spec-kit/runtime/cli/evals/README.md
index 7374a13c4bf..65f81cfd3cf 100644
--- a/.skilled/skills/system-spec-kit/runtime/cli/evals/README.md
+++ b/.skilled/skills/system-spec-kit/runtime/cli/evals/README.md
@@ -69,6 +69,7 @@ Restricted import surfaces:
 | `check-source-dist-alignment.ts` | Maps each runtime-critical `dist/**/*.js` back to its source `.ts` and flags orphans left by deleted or renamed sources. |
 | `import-policy-rules.ts` | Shared rule definitions used by the import policy checks. |
 | `import-policy-allowlist.json` | Stores temporary approved exceptions with owner and expiry metadata. |
+| `score-alignment-suggestion.ts` | Measures offline whether a classifier picking one of the listed spec folders beats the plain baseline, with zero model calls by default and `--jev` and `--deem` switches for live scoring. |
 
 ---
 
diff --git a/.skilled/skills/system-spec-kit/runtime/cli/tests/README.md b/.skilled/skills/system-spec-kit/runtime/cli/tests/README.md
index a239af3c2b1..d44dfe93989 100644
--- a/.skilled/skills/system-spec-kit/runtime/cli/tests/README.md
+++ b/.skilled/skills/system-spec-kit/runtime/cli/tests/README.md
@@ -78,6 +78,8 @@ bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh
 bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation.sh
 (cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run \
   --config ../../vitest.config.ts --project cli tests/test-integration.vitest.ts)
+(cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run \
+  --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts)
 python3 .skilled/skills/system-spec-kit/runtime/cli/tests/test_dual_threshold.py
 ```
 
diff --git a/.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md b/.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md
new file mode 100644
index 0000000000..de05fdf039
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/changelog/v4.4.0.0.md
@@ -0,0 +1,33 @@
+---
+title: "system-spec-kit v4.4.0.0, Measure the Alignment Suggestion"
+description: "A new offline scorer measures whether a classifier picking one of the validator's listed spec folders would beat the plain baseline, with no model call in the default run."
+trigger_phrases:
+  - "system-spec-kit v4.4.0.0"
+  - "system-spec-kit 4.4.0.0"
+  - "alignment suggestion measurement"
+importance_tier: "normal"
+contextType: "general"
+version: 4.4.0.0
+---
+# v4.4.0.0, Measure the Alignment Suggestion
+
+Before a folder suggestion is ever served there is now a way to measure it. When a save's alignment score is below 50 the validator lists other spec folders, and `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` measures offline whether a classifier picking one listed folder would beat the plain baseline. It never wires a pick into a save.
+
+## What's New at a Glance
+
+- **The default run makes no model call and never starts `jev` or `cli-deem`.** Run `npx tsx evals/score-alignment-suggestion.ts` from `runtime/cli`. It counts alignment saves per save path in tracked repository files with source code skipped and replays `cli` (the interactive `validateContentAlignment`) and `data` (`validateFolderAlignment`).
+- **`--report <dir>` writes `report.json` with counts only.** `--transcripts <dir>` counts events in the transcripts the operator names. `--rows-out <file>` needs `--transcripts` and writes one row per event with an empty `label` for the operator to fill.
+- **Output paths inside the repository are refused.** A `--report`, `--rows-out` or `--out` path inside the repository prints `refused: --<flag> path is inside the repository` and exits 2.
+- **Labels are the operator's job.** `--score <rows file>` runs alone, and with fewer than 30 labeled rows it prints `stop: fewer than 30 labeled rows (<n> labeled)` and exits 0 with no model call. Only the operator writes labels.
+- **The model arms sit behind gates.** `--jev` and `--deem` need `--score` and `--out <dir>` or the run exits 2. Jev runs first and its gate needs `jev --version` to print `jev 0.6.2`, `jev auth status --provider <p>` to exit 0 and `--accept-payload`, because the payload is the operator's session summaries.
+- **A failed check skips one arm.** Jev prints one `jev arm skipped:` line with the reason, `jev not on PATH`, `version`, `no credential` or `payload not accepted`. Deem needs `cli-deem health` or prints `deem arm skipped: <reason>`, and a skip changes nothing else.
+- **The keep rule is fixed in code.** The run prints it before any call, `keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`. Each arm prints one `verdict <jev|deem>: keep|kill|stop` line with `K= M= A= B= W= L= F= p= baseline=` and writes `report.json` and `calls.jsonl` under `--out`.
+- **Nothing is served.** The scorer holds no credential and reads none. A live pick needs a later change, a `keep` and the operator's call.
+- **Today the run stops at its label gate.** No operator labels exist yet. A live Jev run waits on the operator's yes.
+- **The tests cover the scorer with stub backends.** `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` holds 42 cases and every backend in it is a stub. Run it from `runtime/cli` with `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`.
+- **The skill and the READMEs cover the run.** `SKILL.md` carries version 4.4.0.0 and one quick-reference row. `README.md`, `runtime/cli/evals/README.md` and `runtime/cli/tests/README.md` describe the scorer and its tests.
+- **The catalog and the playbook cover the measurement.** `feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` and `feature-catalog/feature-catalog.md` document it, and `manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md` (scenario 461) and `manual-testing-playbook/manual-testing-playbook.md` cover the manual checks.
+
+## Upgrade
+
+No migration required. No existing behavior changes and no save reads `score-alignment-suggestion.ts`.
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
index 58bac323bf..8ef42fcfa6 100644
--- a/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md
@@ -119,6 +119,22 @@ See [`tooling-and-scripts/compaction-recall-census.md`](tooling-and-scripts/comp
 
 ---
 
+### Alignment suggestion measurement
+
+#### Description
+
+Measures offline whether a classifier that picks one listed spec folder would beat the plain baseline when a save's alignment score is below 50, without ever wiring a pick into a save.
+
+#### Current Reality
+
+`.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` runs offline: its default run makes zero model calls and starts neither `jev` nor `cli-deem`. Today it stops at its label gate because no operator labels exist yet.
+
+#### Source Files
+
+See [`tooling-and-scripts/alignment-suggestion-measurement.md`](tooling-and-scripts/alignment-suggestion-measurement.md) for full implementation and test file listings.
+
+---
+
 ### Completion-verdict freshness validation
 
 #### Description
diff --git a/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md
new file mode 100644
index 0000000000..c4dfc18a4b
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md
@@ -0,0 +1,68 @@
+---
+title: "Alignment suggestion measurement"
+description: "Measures, with zero model calls on the default run, whether a classifier picking one listed spec folder would beat the plain baseline when a save's alignment score falls below 50, then prints one verdict per opt-in arm."
+trigger_phrases:
+  - "alignment suggestion measurement"
+  - "score-alignment-suggestion.ts"
+  - "alignment suggestion scorer"
+  - "alignment folder suggestion"
+version: 4.3.0.0
+---
+
+# Alignment suggestion measurement (score-alignment-suggestion.ts)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Measures, with zero model calls on the default run, whether a classifier picking one listed spec folder would beat the plain baseline when a save's alignment score falls below 50, then prints one verdict per opt-in arm.
+
+When a save's alignment score is below 50, the validator lists other spec folders. S measures offline whether a classifier picking one listed folder would beat the plain baseline. It never wires a pick into a save. S holds no credential and reads none, and nothing is served: a live pick needs a later change, a `keep` and the operator's call.
+
+---
+
+## 2. HOW IT WORKS
+
+### Zero-Call Default
+
+Run it from `.skilled/skills/system-spec-kit/runtime/cli` as `npx tsx evals/score-alignment-suggestion.ts [switches]`. With no switch, or with `--report <dir>`, the run makes zero model calls and never starts `jev` or `cli-deem`. It counts alignment saves in tracked repository files, source code skipped, per save path, `cli` (the interactive `validateContentAlignment`) and `data` (`validateFolderAlignment`), then replays both paths. The run prints `census source: tracked files via git grep, source code skipped`, `committed: files=<n> events=<n> skipped_source=<n>`, `committed path cli: ... below50=<n> ...`, `committed path data: ...`, `replay cli: validateContentAlignment root=specs ...` and `replay data: validateFolderAlignment root=synthetic ...`.
+
+A `--report`, `--rows-out` or `--out` path inside the repository is refused with `refused: --<flag> path is inside the repository` and exit 2. `--report <dir>` writes `report.json` with counts only. `--transcripts <dir>` counts events in transcripts the operator names. `--rows-out <file>`, which needs `--transcripts`, writes one row per event with an empty `label` for the operator to fill.
+
+### The Label Gate
+
+Only the operator writes labels. `--score <rows file>` runs alone. With fewer than 30 labeled rows it prints `stop: fewer than 30 labeled rows (<n> labeled)` and exits 0 with no model call.
+
+### The Two Arms
+
+`--jev` and `--deem` need `--score` and `--out <dir>`, else exit 2. Jev runs first. Its gate prints `jev: path=<path> provider=<provider>` and needs `jev --version` to print `jev 0.6.2`, `jev auth status --provider <p>` to exit 0, and `--accept-payload`, because the payload is the operator's session summaries. A failed check prints one line: `jev arm skipped: jev not on PATH`, `version`, `no credential` or `payload not accepted`. Deem needs `cli-deem health` to pass, else `deem arm skipped: <reason>`. A skip changes nothing else.
+
+### The Keep Rule And Verdict
+
+The keep rule is fixed in code and printed before any call: `keep rule: coverage 10*M>=9*K, kill P(X>=L)<=0.05, margin 10*(A-B)>=M, sign P(X>=W)<0.05, flips 10*F<=3*M`. Each arm prints one `verdict <jev|deem>: keep|kill|stop ...` line with `K= M= A= B= W= L= F= p= baseline=` and writes `report.json` and `calls.jsonl` under `--out`. Today the run stops at its label gate, because no operator labels exist yet, and a live Jev run waits on the operator's yes.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Script | Counts the alignment saves, replays both validator paths, runs the label gate and the two opt-in arms, and prints the verdict lines |
+| `runtime/cli/spec-folder/alignment-validator.ts` | Shared | Read only: the script replays `validateContentAlignment`, `validateFolderAlignment` and `isArchiveFolder` from here |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | Vitest | 42 cases, run from `runtime/cli` as `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`, with every backend in the file a stub |
+| `../../manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md` | Manual playbook | Playbook scenario 461 for the alignment suggestion measurement |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `tooling-and-scripts/alignment-suggestion-measurement.md`
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
index 878e6f11e1..e360e9407c 100644
--- a/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md
@@ -200,6 +200,7 @@ Every row links a scenario file that exists on disk. The **Catalog Entry** colum
 | 428 | CLI warm-only no-spawn behavior | [428](tooling-and-scripts/cli-warm-only-no-spawn.md) | [cli-runtime-warm-only-fallbacks](../feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md) |
 | 089 | Code standards alignment | [089](tooling-and-scripts/code-standards-alignment.md) | [code-standards-alignment](../feature-catalog/tooling-and-scripts/code-standards-alignment.md) |
 | 460 | Compaction recall census | [460](tooling-and-scripts/compaction-recall-census.md) | [compaction-recall-census](../feature-catalog/tooling-and-scripts/compaction-recall-census.md) |
+| 461 | Alignment suggestion measurement | [461](tooling-and-scripts/alignment-suggestion-measurement.md) | [alignment-suggestion-measurement](../feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md) |
 | 233 | Completion verification workflow | [233](tooling-and-scripts/completion-verification-workflow.md) | [completion-verification-workflow](../feature-catalog/tooling-and-scripts/completion-verification-workflow.md) |
 | 240 | Core workflow infrastructure | [240](tooling-and-scripts/core-workflow-infrastructure.md) | [core-workflow-infrastructure](../feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md) |
 | DBG-SCAF-001 | Debug-delegation scaffold generator | [DBG-SCAF-001](tooling-and-scripts/debug-delegation-scaffold-generator.md) | [debug-delegation-scaffold-generator](../feature-catalog/tooling-and-scripts/debug-delegation-scaffold-generator.md) |
diff --git a/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md
new file mode 100644
index 0000000000..7a310ba440
--- /dev/null
+++ b/.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/alignment-suggestion-measurement.md
@@ -0,0 +1,96 @@
+---
+title: "461 -- Alignment suggestion measurement"
+description: "This scenario validates the alignment suggestion measurement for `461`. It focuses on a default run that prints the census lines and both replay lines with no model call, and on the suite that proves 42 stub-backed cases."
+version: 4.4.0.0
+---
+
+# 461 -- Alignment suggestion measurement
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `461`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the alignment suggestion measurement for `461`. It focuses on a default run that prints the census lines and both replay lines with no model call, and on the suite that proves 42 stub-backed cases.
+
+### Why This Matters
+
+The measurement reads tracked repository files and calls no model on its default run, so the report shape and the label gate have to be provable without any credential. The default run shows the census and replay shape, the label gate stops a rows file with empty labels before any arm runs, and the suite checks that every backend is a stub.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `461` and confirm the expected signals without contradictory evidence.
+
+- Objective: confirm that a default run prints the census lines and both replay lines and exits 0 with no `jev` or `cli-deem` started, that the label gate on a rows file with empty labels prints one stop line and exits 0 and leaves the output folder uncreated, and that the suite reports 42 passed
+- Real user request: `When a save scores below 50, would a classifier picking one of the listed folders beat the plain baseline, and can we find out without calling a model?`
+- Prompt: `Run the alignment suggestion measurement on tracked files, run its label gate on a rows file with empty labels with the deem arm and an output folder outside the repository, then run its test suite.`
+- Expected execution process: every command runs from `.skilled/skills/system-spec-kit/runtime/cli`, the scorer runs with no switch, then with `--score` on a rows file with empty labels and `--deem` and `--out` on a folder outside the repository, then the vitest suite runs.
+- Expected signals: step 1 prints `census source: tracked files via git grep, source code skipped`, `committed: files=<n> events=<n> skipped_source=<n>`, `committed path cli: ... below50=<n> ...`, `committed path data: ...`, `replay cli: validateContentAlignment root=specs ...` and `replay data: validateFolderAlignment root=synthetic ...`, and exits 0 without starting `jev` or `cli-deem`. Step 2 prints `stop: fewer than 30 labeled rows (0 labeled)` and exits 0, and the output folder is not created. Step 3 reports 42 passed and exits 0.
+- Desired user-visible outcome: the census and replay counts, the label-gate stop line and the suite summary, with the evidence.
+- Pass/fail: PASS if every signal holds. FAIL if a line is missing, `jev` or `cli-deem` starts, the stop line shows a count other than 0, the output folder exists after step 2 or a test fails.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Run the alignment suggestion measurement on tracked files, run its label gate on a rows file with empty labels with the deem arm and an output folder outside the repository, then run its test suite.`
+
+### Commands
+
+1. `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts`
+2. `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts --score <rows file with empty labels> --deem --out <dir outside the repo>`
+3. `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`
+
+### Expected
+
+Step 1 prints the census lines and both replay lines and exits 0, with no `jev` or `cli-deem` started. Step 2 prints `stop: fewer than 30 labeled rows (0 labeled)` and exits 0, and `<dir>` is not created. Step 3 reports 42 passed and exits 0.
+
+### Evidence
+
+Capture step 1's stdout and exit status, step 2's stop line and exit status with a check that `<dir>` does not exist, and the suite's summary line with its exit status.
+
+### Pass / Fail
+
+- **Pass**: every named line is present, no `jev` or `cli-deem` starts, step 2 prints one stop line with `0 labeled`, `<dir>` stays uncreated and the suite passes.
+- **Fail**: a named line is missing, `jev` or `cli-deem` starts, step 2 prints anything else or exits other than 0, `<dir>` exists after step 2 or a test fails.
+
+### Failure Triage
+
+1. When step 2 exits 2, the run refused one of its output paths: a `--report`, `--rows-out` or `--out` path inside the repository prints `refused: --<flag> path is inside the repository`, so name a folder outside the repository.
+2. When the stop line in step 2 shows a count above 0, the rows file carries labels: only the operator writes labels, and a rows file with empty labels reads as `0 labeled`.
+3. When only an arm case fails in step 3, read the skip line the case asserts: a failed gate prints exactly one line, `jev arm skipped: jev not on PATH`, `version`, `no credential` or `payload not accepted`, or `deem arm skipped: <reason>`, and a skip changes nothing else.
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
+| `../../feature-catalog/tooling-and-scripts/alignment-suggestion-measurement.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` | Counts the alignment saves in tracked repository files, replays both paths and prints the census lines, the replay lines, the label gate and the verdict lines |
+| `runtime/cli/spec-folder/alignment-validator.ts` | Read only: the script replays `validateContentAlignment`, `validateFolderAlignment` and `isArchiveFolder` from here |
+| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts` | 42 cases, run from `runtime/cli` as `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts`, with every backend in the file a stub |
+
+Provenance: runtime/cli/tests/score-alignment-suggestion.vitest.ts
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Tooling And Scripts
+- Playbook ID: 461
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `tooling-and-scripts/alignment-suggestion-measurement.md`
diff --git a/.hermes/skills/system-spec-kit/SKILL.md b/.hermes/skills/system-spec-kit/SKILL.md
index 7934197b75..2b9b9e7fab 100644
--- a/.hermes/skills/system-spec-kit/SKILL.md
+++ b/.hermes/skills/system-spec-kit/SKILL.md
@@ -2,7 +2,7 @@
 name: system-spec-kit
 description: "Unified spec-folder workflow + context preservation: Levels 1-3+, validation, trigger-index and ripgrep retrieval. Required for file modifications."
 allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
-version: 4.3.0.0
+version: 4.4.0.0
 ---
 
 <!-- generated by sync-skills-hermes.cjs; do not edit -->
@@ -574,6 +574,7 @@ P0 blocks, P1 requires completion or approved deferral, and P2 is optional. Code
 | Regenerate trigger index | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` |
 | Free-text retrieval | The ripgrep recipes in `references/retrieval/retrieval-conventions.md` §2, scoped by the trailing positional path |
 | Compaction recall census | `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts <dir> --newest-compacted 15 --out <file outside the repo>` makes no model call, prints counts and one `stop:` line and changes no transcript |
+| Alignment suggestion measurement | `cd .skilled/skills/system-spec-kit/runtime/cli && npx tsx evals/score-alignment-suggestion.ts` makes no model call and prints below-50 alignment counts per save path; `--score <rows>` prints `stop: fewer than 30 labeled rows` until the operator labels 30, and `--jev` or `--deem` with `--out <dir outside the repo>` add a verdict column behind that backend's own check |
 | Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
 | Upgrade level | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh specs/007-feature/ --to 2` |
 | Completeness | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/007-feature/` |
```
