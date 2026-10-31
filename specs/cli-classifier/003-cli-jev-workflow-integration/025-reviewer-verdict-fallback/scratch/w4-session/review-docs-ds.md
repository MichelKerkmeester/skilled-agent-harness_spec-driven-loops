# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-improvement/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.0.0.md`
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md`
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md`
- `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). MiMo wrote the nine docs and, in the script, step 6 (the zero-call `main`). DeepSeek wrote the rest of the script and the test, which MiMo reviews separately. Review the docs in full and, in the script, `main` only. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
index a7d84c753b2..2fc631be08f 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/README.md
@@ -34,6 +34,7 @@ Current state:
 |---|---|
 | `code-task-scorer.cjs` | Scores ONE cell's model output against a code-task fixture. Extracts the target function from fenced/bare and `function`/arrow forms, runs visible + `hidden_tests` oracles as deep-equal checks in isolated child processes (one process per case, each with its own hard timeout), and returns `{ correctness_pass_rate, assertions_passed/total, format_adherent, output_words/chars, per_test, extracted, ... }`. Exports `scoreCodeTask`, `extractFunction`, `detectFormatAdherence`, `unfence`, `runSuite`. Dependency-free (Node stdlib). |
 | `reviewer-scorer.cjs` | Scores reviewer-prompt fixtures. Detects `kind: "reviewer-prompt"`, composes prompts from `prompt_template` plus `input`, dispatches through `dispatch-model.cjs` when no deterministic `reviewer_output` is present, extracts `PASS`/`FAIL`/`BLOCK` pattern-first with `--grader llm` fallback, and emits a Lane B report row with `correctness_pass_rate`, D1-D5 dimensions, per-case details, and `REVIEWER_BENCHMARK` mismatch messages. |
+| `score-verdict-fallback.cjs` | Measures offline whether a Jev or Deem model that reads a reviewer output and names one of pass, fail or block resolves the outputs the deterministic verdict pattern misses. Run with `node`, it censuses the `--profile` fixture cases (default `reviewer-regression.json`), the `--outputs` labels and each `--reports` dir, prints the majority and loose baselines and the label gate (no arm opens below 12 labeled regex-miss outputs), and runs the `--jev` or `--deem` arm only past the gate and only with `--out <dir>`. With either switch the run writes `report.json` into `--out` and, past the gate, appends `calls.jsonl` there. A bare run makes no model call and writes no file. |
 | `correctness-gate.cjs` | Applies correctness as a GATE. A group is eligible iff its `correctness_mean` clears the threshold (default 1.0); among the eligible, correctness ranks them only while it still separates, otherwise it is dropped and survivors rank on format-adherence (desc) then efficiency / fewer words (asc). Exports `applyGate`, `DEFAULT_THRESHOLD`. Pure, no I/O. |
 | `framework-renderer.cjs` | Data-driven `{{slot}}` prompt renderer over a JSON framework registry. Computes a framework-neutral `output_contract` + `constraints` from the fixture, fills every slot, and throws naming any required slot left empty or any placeholder that survived. Exports `renderFramework`, `loadRegistry`, `getFramework`, `DEFAULT_CONSTRAINTS`. |
 | `profile-validator.cjs` | Additive, dependency-free sweep-key validator. Returns `{ valid, errors }` (collects all issues, never throws). A profile with no `mode` is reported valid and untouched; present keys (`mode`, `models[].executor`, `scoring.scorer`, dimension weights summing to 1.0, `correctnessGate.threshold ∈ [0,1]`, `sampling.samplesPerCell`) are checked against their contract. Exports `validateProfile`, `KNOWN_MODES`, `KNOWN_EXECUTORS`, `KNOWN_SCORERS`. |
@@ -47,7 +48,7 @@ Current state:
 | Boundary | Rule |
 |---|---|
 | Imports | `code-task-scorer.cjs`, `correctness-gate.cjs`, `framework-renderer.cjs`, `profile-validator.cjs`, and `sweep-stats.cjs` import only Node builtins. `sweep-reporter.cjs` is the one intra-lib edge: it requires `./sweep-stats.cjs` and `./correctness-gate.cjs`. |
-| Exports | Each module is a CommonJS module exporting named functions (see KEY FILES). No module has a CLI `main()`; these are library helpers, not entrypoints. |
+| Exports | Each module is a CommonJS module exporting named functions (see KEY FILES). Every module but `score-verdict-fallback.cjs` is a library helper with no CLI `main()`. That one script is the folder's single entrypoint, run with `node`. |
 | Consumers | `../sweep-benchmark.cjs` is the sweep runner that composes these: it requires `framework-renderer`, `profile-validator`, `code-task-scorer`, and `sweep-reporter` directly (the gate and stats arrive transitively through the reporter). |
 | Ownership | These primitives own per-cell scoring, gating, rendering, validation, aggregation, and stats. The sweep orchestration, dispatch, and disk layout live in `../sweep-benchmark.cjs`; the legacy 5-dimension engine lives in `../scorer/`. |
 | Write policy | Pure helpers do no I/O except `sweep-reporter.report` (writes `aggregate.json` + `synthesis.md` only when `outDir`/`write` is set) and `framework-renderer.loadRegistry` (reads a registry JSON). The child-process scorer materializes a runner program to a temp dir; it writes no benchmark state. |
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
index 9bf78009bf..f9714b1a83 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
@@ -22,7 +22,7 @@ cd .skilled/skills/system-deep-loop/deep-improvement/scripts && npx vitest run m
 
 Current state:
 
-- The suite is green at **205 tests across 14 files**.
+- The suite is green at **236 tests across 15 files**.
 - Lane B tests (scorer, opt-in 5-dim scorer, grader/runner hardening, remediation) cover the legacy agent-improvement benchmark path.
 - `d4-agreement.vitest.ts` covers the offline D4 agreement measurement: the zero-call census, the label gate, the keep rule and both arms on stub backends.
 - Sweep tests (foundation, runtime, acceptance, stats-CI, isolation, dispatch-envelope) cover the matrix expander, correctness gate, trust verdict, normalized dispatch envelope, and per-cell cwd-isolation.
@@ -47,3 +47,4 @@ Current state:
 | `dispatch-envelope.vitest.ts` | 18 | Normalized dispatch envelope (latency, nullable tokens/cost, OpenCode JSON-stream usage parsing). |
 | `sweep-isolation.vitest.ts` | 15 | Per-cell cwd is under `os.tmpdir()` (not repo root), holds the prompt file, is cleaned up after single + multi-cell sweeps, and a simulated model write does not leak; plus fixture-shape + profile-load coverage for the hard / validation fixture packs. |
 | `d4-agreement.vitest.ts` |  | Offline D4 agreement measurement: the zero-call census, the label gate, the keep rule and both arms on stub backends. |
+| `verdict-fallback.vitest.ts` | 31 | Offline reviewer verdict fallback measurement: the fixture, outputs and reports census, the baselines, the label gate, the Deem and Jev gates and their skips, the keep rule and both arms on stub backends. |
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md b/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
index 80e07996b3..7619c06bfa 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
@@ -2,7 +2,7 @@
 name: deep-improvement
 description: "Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion."
 allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
-version: 1.18.0.0
+version: 1.19.0.0
 triggers:
   - deep-improvement
   - agent improvement loop
@@ -219,7 +219,7 @@ For changes that alter agent discipline, run a same-task A/B stress scenario (is
 Lane B benchmarks a model or prompt framework instead of mutating an agent file. Command: `/deep:model-benchmark`. Runtime entry is `scripts/shared/loop-host.cjs --mode=model-benchmark`. It reuses the three pluggable seams (candidate-source, dispatcher, scorer) and keeps the default agent-improvement path byte-identical when no mode flag is set.
 
 - **Entry + dispatch**: `loop-host.cjs` resolves `--mode=agent-improvement` (default) vs `--mode=model-benchmark`; the model-agnostic dispatcher `scripts/model-benchmark/dispatch-model.cjs` loads only on the model-benchmark path.
-- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic). Any other `--grader` value exits 2 at startup and names the value. `scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` measures offline, with no model call by default, whether a Jev or Deem hallucination judgment agrees with operator labels more often than the deterministic check, and `--jev` or `--deem` adds a verdict column behind that backend's own check once 30 outputs carry labels.
+- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic). Any other `--grader` value exits 2 at startup and names the value. `scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` measures offline, with no model call by default, whether a Jev or Deem hallucination judgment agrees with operator labels more often than the deterministic check, and `--jev` or `--deem` adds a verdict column behind that backend's own check once 30 outputs carry labels. `scripts/model-benchmark/lib/score-verdict-fallback.cjs` measures offline, with no model call by default, whether a Jev or Deem verdict on regex-miss reviewer outputs matches the operator label more often than the best zero-call baseline, and `--jev` or `--deem` opens that backend's arm only past the 12-label gate, which prints `stop: fewer than 12 labeled regex-miss outputs` until 12 labeled regex-miss outputs exist.
 - **Promotion**: state records and reports carry `mode`/`scoringMethod` for lane attribution. Lane A promotes through the agent-scored gates in `promote-candidate.cjs`; Lane B promotes from the benchmark report via `promote-candidate.cjs --benchmark-report <report.json>` when status is `benchmark-complete` with a passing recommendation — both lanes still share one canonical-target guard, archive, and runtime-mirror sync.
 - **Hardening**: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in both the 5-dim scorer and the bundle-gate Layer-3 acceptance command; `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the cache. Both default permissive (trusted-author boundary: criteria come only from operator-authored benchmark profiles in the same trust domain as the loop) — flip both for hardened/shared-runner deployments.
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/README.md b/.skilled/skills/system-deep-loop/deep-improvement/README.md
index 92b039cc3e..26aa5460f1 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/README.md
@@ -105,7 +105,7 @@ Both lanes share the same candidate, dispatcher and scorer seams.
 | A: Agent-Improvement | `/deep:agent-improvement` | A bounded agent `.md` file |
 | B: Model-Benchmark | `/deep:model-benchmark` | A model or prompt framework against repeatable fixtures |
 
-Lane B enters through `scripts/shared/loop-host.cjs --mode=model-benchmark` and writes benchmark outputs to `.skilled/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}/`; benchmark reports include `outcomeScoreDelta` and helped/hurt fixture deltas so promotion can block regressions instead of relying on pass/fail alone. Lane A is the default path when no mode flag is set. The offline scorer `scripts/model-benchmark/scorer/score-d4-agreement.cjs` makes no model call on its default run and stops below 30 labeled outputs, and `--jev` and `--deem` each add a verdict column behind that backend's own check.
+Lane B enters through `scripts/shared/loop-host.cjs --mode=model-benchmark` and writes benchmark outputs to `.skilled/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}/`; benchmark reports include `outcomeScoreDelta` and helped/hurt fixture deltas so promotion can block regressions instead of relying on pass/fail alone. Lane A is the default path when no mode flag is set. The offline scorer `scripts/model-benchmark/scorer/score-d4-agreement.cjs` makes no model call on its default run and stops below 30 labeled outputs, and `--jev` and `--deem` each add a verdict column behind that backend's own check. The verdict fallback script `scripts/model-benchmark/lib/score-verdict-fallback.cjs` takes the switches `--profile <path-or-id>`, `--outputs <file>`, repeatable `--reports <dir>`, `--jev`, `--deem`, `--out <dir>` and `--accept-payload`.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.0.0.md b/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.0.0.md
new file mode 100644
index 0000000000..4d003a7936
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.0.0.md
@@ -0,0 +1,27 @@
+---
+title: "deep-improvement v1.19.0.0"
+description: "A new script measures whether a model can name the verdict of a reviewer output the deterministic verdict pattern misses. A default run counts those misses and stops at the label gate without a model call."
+trigger_phrases:
+  - "deep-improvement v1.19.0.0"
+  - "deep-improvement 1.19.0.0"
+  - "reviewer verdict fallback"
+  - "labeled regex-miss outputs"
+importance_tier: "normal"
+contextType: "general"
+version: 1.19.0.0
+---
+
+The reviewer scorer reads a verdict only from a line that holds just `pass`, `fail` or `block`, so a review that states its verdict in plain words gets no verdict at all. Those misses are what the reviewer verdict fallback is for. This release adds an offline script that counts them and measures whether asking a model to name the verdict resolves them better than simple rules that call no model.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/025-reviewer-verdict-fallback` (Level 1)
+
+## What's New at a Glance
+
+- **The verdict pattern's misses can be counted offline.** `scripts/model-benchmark/lib/score-verdict-fallback.cjs` replays the deterministic verdict check over the benchmark fixtures and over operator-labeled outputs the pattern missed. It prints the counts, the baselines and the fixed keep rule, and by default it makes no model call and writes no file.
+- **Twelve labeled misses open the measurement.** No model is asked until 12 labeled outputs carry a verdict the pattern missed and each of `pass`, `fail` and `block` appears at least once. Below that the run prints `stop: fewer than 12 labeled regex-miss outputs`, or the class it found none of, and a baseline already right more than 9 times out of 10 prints `no headroom` instead.
+- **Two opt-in arms ask a model the same question.** `--jev` and `--deem` each ask which verdict a reviewer output gives, three times per labeled output and once per option order so the option position cannot decide. Each switch needs `--out <dir>`, where the run writes `report.json` and past the gate the call log `calls.jsonl`, and a Jev run on untracked outputs also needs `--accept-payload`. With both switches the Jev arm runs first and each arm passes its own checks before it runs.
+- **A fixed keep rule decides what counts as a win.** Every run prints `keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M`, so a result can be rechecked by hand against the labels and the baseline.
+
+## Upgrade
+
+No migration required. The script is additive, and a bare run makes no model call and writes no file.
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md
new file mode 100644
index 0000000000..386fd3f7cd
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md
@@ -0,0 +1,69 @@
+---
+title: "Reviewer verdict fallback"
+description: "Measures offline how well a Deem or Jev grader resolves the reviewer outputs the deterministic verdict pattern misses, against operator labels."
+trigger_phrases:
+  - "reviewer verdict fallback"
+  - "score-verdict-fallback.cjs"
+  - "measure reviewer verdict fallback"
+  - "offline reviewer verdict fallback test"
+version: 1.19.0.0
+---
+
+# Reviewer verdict fallback (score-verdict-fallback.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Measures offline how well a Deem or Jev grader resolves the reviewer outputs the deterministic verdict pattern misses, against operator labels.
+
+The reviewer scorer takes its verdict from a one-line pattern and falls back to its `llm` grader when the pattern finds none. This script measures whether a Deem or Jev answer to one fixed question earns that fallback before one is wired in. It writes nothing outside the operator's `--out` directory, and by default it makes no model call and writes no file.
+
+---
+
+## 2. HOW IT WORKS
+
+### Census and Baseline
+
+`score-verdict-fallback.cjs --profile <path-or-id>` loads the fixture cases of one benchmark profile, `reviewer-regression.json` by default, and counts each recorded reviewer output as a hit when the deterministic verdict pattern reads a verdict from it and a miss when it does not. A case with no recorded output is counted apart and never dispatched. `--outputs <file>` adds the operator's labeled outputs, one JSON object per line with `id`, `output` and a `label` of `pass`, `fail` or `block`, and keeps only the rows the pattern misses. `--reports <dir>`, repeatable, reads each `reviewer-report.json` and counts its per-test verdict methods as `pattern`, `llm-grader` or `none`.
+
+The baseline for the labeled misses is the stronger of two zero-call rules: the majority class of the labels, or a loose rule that reads the last whole word `pass`, `fail` or `block` anywhere in the output, case-insensitively. Every graded column is compared against that baseline on the same rows.
+
+### Label Gate and Keep Rule
+
+The script prints the question every grader answers, `Which verdict does this reviewer output give?`, the three answer options and their digest, the three option orders, the 0.10 margin, the keep rule and the power note, so a printed verdict can be rechecked by hand. Below 12 labeled regex-miss outputs, or with no labeled output in one of the three classes, it prints a `stop:` line and asks no grader a question. When the baseline is already right on more than 90 percent of the labeled misses it prints `no headroom`. Otherwise it prints the planned calls for each arm.
+
+### Deem and Jev Arms
+
+`--deem` checks `cli-deem health`, then asks the local Deem server the question once per labeled miss and option order, so nothing leaves the machine. `--jev` checks the Jev client's version and credential, then asks the same questions through the client. That sends the reviewer outputs off the machine, so an untracked outputs file also needs `--accept-payload`. Each labeled miss is asked in all three option orders, so unstable answers count as flips. With both switches the Jev gate and arm run first, then the Deem gate and arm, each on its own gate.
+
+Each switch needs `--out <dir>`. The arm prints its planned calls before the first one, records every call in `calls.jsonl` and writes `report.json`. A failed check or a closed label gate prints a `<backend> arm skipped:` line instead and makes no call. A finished arm prints one `verdict <backend>:` line with `keep`, `kill` or `stop` and its reason. An answer that is not one of the three keys counts as unmeasured and never as a pick.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Script | Runs the fixture and outputs census, the two baselines, the label gate and the opt-in Deem and Jev arms. |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Vitest | Covers the census, the labels, the baselines, the keep rule, both gates and both arms against stub `cli-deem` and `jev` binaries. |
+| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/` | Manual playbook | Scenario `MB-052` checks the census on the fixtures and a stub-backend skip. |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Model-benchmark mode
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `model-benchmark-mode/reviewer-verdict-fallback.md`
+
+Related references:
+- [opt-in-5dim-scorer.md](../../feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md) - Opt-in 5-dimension scorer
+- [score-delta-benchmark-gates.md](../../feature-catalog/model-benchmark-mode/score-delta-benchmark-gates.md) - Score-delta benchmark gates
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
index 614761d981..c43742a90c 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
@@ -1,7 +1,7 @@
 ---
 title: "deep-improvement: Feature Catalog"
 description: "Unified reference combining the evaluation loop, integration scanning, scoring, and model-benchmark mode surfaces that currently ship in deep-improvement."
-version: 1.18.0.0
+version: 1.19.0.0
 ---
 
 # deep-improvement: Feature Catalog
@@ -29,7 +29,7 @@ The skill runs two lanes through one agent. Each category and feature below is t
 | Evaluation loop | 7 features | Lane A | `.skilled/commands/deep/agent-improvement.md`, deep-improvement YAML workflows, `scripts/*.cjs` |
 | Integration scanning | 3 features | Lane A | `scan-integration.cjs`, `/deep:agent-improvement`, `.skilled/agents/deep-improvement.md` |
 | Scoring system | 5 features | Shared | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `scorer/score-d4-agreement.cjs` |
-| Model-benchmark mode | 5 features | Lane B | `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `scorer/score-model-variant.cjs` |
+| Model-benchmark mode | 6 features | Lane B | `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `scorer/score-model-variant.cjs`, `lib/score-verdict-fallback.cjs` |
 
 ---
 
@@ -295,7 +295,7 @@ See [`scoring-system/hallucination-grader-agreement.md`](../feature-catalog/scor
 
 **Lane:** Lane B (model-benchmark)
 
-These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.
+These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, the record-level mode field plus the two hardening env gates, and the reviewer-verdict fallback measurement.
 
 ### Mode switch
 
@@ -376,3 +376,19 @@ Turns benchmark reports into quality-delta evidence and blocks promotion on regr
 See [`model-benchmark-mode/score-delta-benchmark-gates.md`](../feature-catalog/model-benchmark-mode/score-delta-benchmark-gates.md) for full implementation and validation file listings.
 
 ---
+
+### Reviewer verdict fallback
+
+#### Description
+
+Measures how well a Deem or Jev grader resolves the recorded reviewer outputs the deterministic verdict pattern misses, against operator labels, with no model call by default.
+
+#### How It Works
+
+`scripts/model-benchmark/lib/score-verdict-fallback.cjs --profile <path-or-id>`, `reviewer-regression.json` by default, counts each recorded reviewer output as a hit when the deterministic pattern reads a verdict from it and a miss when it does not, adds the operator's labeled misses from `--outputs <file>` and the verdict-method counts of each `--reports <dir>`, and prints the two zero-call baselines with a fixed keep rule. `--jev` and `--deem` each add an arm behind its own gate, and neither arm runs before 12 labeled regex-miss outputs carry at least one label of each kind and the baseline leaves headroom. A run with either switch writes `<out>/report.json`, and a run past the gate also appends `<out>/calls.jsonl`.
+
+#### Source Files
+
+See [`model-benchmark-mode/reviewer-verdict-fallback.md`](../feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md) for full implementation and validation file listings.
+
+---
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md
new file mode 100644
index 0000000000..4262f9e765
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md
@@ -0,0 +1,118 @@
+---
+title: "MB-052 -- Zero-Call Fixture Census and Stub-Backend Skip"
+description: "This scenario validates Zero-Call Fixture Census and Stub-Backend Skip for `MB-052`. It focuses on the zero-call census of the fixture cases and the named skip of a stub Deem backend."
+feature_id: "MB-052"
+category: "Model_Benchmark Mode"
+version: 1.19.0.0
+---
+
+# MB-052 -- Zero-Call Fixture Census and Stub-Backend Skip
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `MB-052`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates Zero-Call Fixture Census and Stub-Backend Skip for `MB-052`. It focuses on the zero-call census of the fixture cases and the named skip of a stub Deem backend.
+
+### Why This Matters
+
+Every shipped fixture case already yields a verdict from the deterministic pattern, so the fallback runs on none of the known cases. The census must still make no model call unless a switch asks for one, and a backend that fails its own check must be skipped with a named reason, so no run can score against a stub.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `MB-052` and confirm the expected signals without contradictory evidence.
+
+- Objective: Confirm that the fixture census makes no model call and that a stub Deem backend is skipped by name.
+- Real user request: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`
+- Prompt: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`
+- Expected execution process: Run the census on the shipped fixtures with stub `cli-deem` and `jev` binaries first on `PATH`, once plain and once with `--deem`.
+- Expected signals: The plain census exits 0, prints `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs`, and leaves `/tmp/mb-052/calls.log` absent. The `--deem` run adds only `deem arm skipped: stub backend`.
+- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive lines from each run.
+- Pass/fail: PASS if both runs print their expected lines with the expected exit codes, FAIL if the plain census calls a stub or the `--deem` run asks the stub a question.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Check that the verdict fallback census runs without calling a model and that a stub Deem backend is skipped.`
+
+### Commands
+
+Run from the repository root.
+
+1. `rm -rf /tmp/mb-052 && mkdir -p /tmp/mb-052/bin`
+2. `printf '#!/bin/sh\necho "cli-deem $*" >> /tmp/mb-052/calls.log\n[ "$1" = health ] && echo "{\\"backend\\":\\"stub\\"}"\nexit 0\n' > /tmp/mb-052/bin/cli-deem && printf '#!/bin/sh\necho "jev $*" >> /tmp/mb-052/calls.log\n[ "$1" = "--version" ] && echo "jev 0.6.2"\n[ "$1" = "auth" ] && exit 3\nexit 0\n' > /tmp/mb-052/bin/jev && chmod +x /tmp/mb-052/bin/*`
+3. `PATH=/tmp/mb-052/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs > /tmp/mb-052/census.txt; echo "exit=$?"; cat /tmp/mb-052/census.txt; ls /tmp/mb-052/calls.log`
+4. `PATH=/tmp/mb-052/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs --deem --out /tmp/mb-052/deem > /tmp/mb-052/deem.txt; echo "exit=$?"; diff /tmp/mb-052/census.txt /tmp/mb-052/deem.txt; cat /tmp/mb-052/calls.log`
+
+### Expected
+
+Step 3 prints `exit=0` and this block, and `ls` reports that `/tmp/mb-052/calls.log` does not exist:
+
+```
+fixture cases: 8 hits: 8 misses: 0
+labeled: 0 (pass 0, fail 0, block 0)
+baseline majority: pass right 0 of 0
+baseline loose: right 0 of 0
+baseline method: loose right 0 of 0
+baseline unknown: right 0 of 0
+question: Which verdict does this reviewer output give?
+options: 3 sha256=6c5e221169decec88acef0f7f10d22b413b98cdaae775807e8587341b6b1f771
+orders: 3, name order then rotated left by 1 and by 2
+margin: 0.10
+keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M
+power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
+stop: fewer than 12 labeled regex-miss outputs
+```
+
+Step 4 prints `exit=0`. The diff shows one added line, `deem arm skipped: stub backend`, and `calls.log` holds exactly one line, `cli-deem health`.
+
+### Evidence
+
+The terminal transcript of steps 3 and 4, `/tmp/mb-052/census.txt`, `/tmp/mb-052/deem.txt`, `/tmp/mb-052/calls.log` and `/tmp/mb-052/deem/report.json`.
+
+### Pass / Fail
+
+- **Pass**: every expected line appears with the stated exit code, and `calls.log` holds only the health check.
+- **Fail**: step 3 exits 2 or creates `calls.log`, or step 4 logs a `choice` call.
+
+### Failure Triage
+
+If step 3 exits 2, read the message on stderr and check the `parseArgs` options in `score-verdict-fallback.cjs`. If step 3 creates `calls.log`, find which code path spawns a backend without `--deem` or `--jev`. If step 4 shows a different skip reason, run `/tmp/mb-052/bin/cli-deem health` by hand and compare its output with the health checks in `score-verdict-fallback.cjs`. If `fixture cases:` is not `8 hits: 8 misses: 0`, count the fixture cases and their recorded outputs again, because the fixture set may have changed.
+
+### Optional Supplemental Checks
+
+Run step 4 again with `--jev --out /tmp/mb-052/jev` in place of `--deem --out /tmp/mb-052/deem`. The stub `jev` answers `--version` with `jev 0.6.2` and `auth status` with exit 3, so the diff shows two added lines, `jev: path=/tmp/mb-052/bin/jev provider=official` and `jev arm skipped: no credential`, and `calls.log` gains only `jev --version` and `jev auth status --provider official`.
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
+| `../../feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `../../scripts/model-benchmark/lib/score-verdict-fallback.cjs` | Runs the fixture census, the label gate and the opt-in Deem and Jev arms |
+| `../../scripts/model-benchmark/tests/verdict-fallback.vitest.ts` | Automated census, gate and arm coverage against stub binaries |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Model-Benchmark Mode
+- Playbook ID: MB-052
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `model-benchmark-mode/verdict-fallback-census.md`
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
index 05b0280520..c19220f2b5 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
@@ -113,7 +113,7 @@ Release passes only when:
 
 1. No feature verdict is `FAIL`.
 2. Closure-wave scenarios RT-022..RT-031 (runtime-truth), CP-032..037 (agent-discipline stress), MB-038..042 plus MB-R01 and MB-049 (model-benchmark), E2E-050 (accept/ship promotion), and DI-R01..DI-R07 plus DI-R10 (intra-routing recall) have all been executed or explicitly skipped with a named blocker.
-3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`). The deep-improvement subtotal is 46 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, 5D-051, and the reviewer regression `MB-R01`) and 8 intra-routing-recall scenarios (`DI-R01..DI-R07` plus `DI-R10`).
+3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`). The deep-improvement subtotal is 47 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, 5D-051, MB-052, and the reviewer regression `MB-R01`) and 8 intra-routing-recall scenarios (`DI-R01..DI-R07` plus `DI-R10`).
 4. No unresolved blocking triage item remains.
 5. Drift between root summaries and per-feature files has been resolved, with the per-feature file treated as the temporary source of truth until resynchronized.
 
@@ -712,7 +712,7 @@ Desired user-visible outcome: PASS verdict showing benchmark completion has a re
 
 ## 15. MODEL-BENCHMARK MODE
 
-This category covers 7 scenario summaries while the linked feature files remain the canonical execution contract. These scenarios validate Lane B (Model-Benchmark): the `loop-host.cjs` mode switch, the default pattern scorer, the opt-in 5-dimension scorer, reviewer-prompt expected-verdict fixtures, the unknown-value fallbacks, the criteria-exec hardening gate, and score-delta benchmark gates. See `SKILL.md` "Lane B: Model-Benchmark" for the source-of-truth contract.
+This category covers 8 scenario summaries while the linked feature files remain the canonical execution contract. These scenarios validate Lane B (Model-Benchmark): the `loop-host.cjs` mode switch, the default pattern scorer, the opt-in 5-dimension scorer, reviewer-prompt expected-verdict fixtures, the unknown-value fallbacks, the criteria-exec hardening gate, and score-delta benchmark gates. See `SKILL.md` "Lane B: Model-Benchmark" for the source-of-truth contract.
 
 ### MB-038 | Mode Switch Routing via loop-host
 
@@ -805,6 +805,19 @@ Expected signals: `report.json` contains `outcomeScoreDelta`, `fixtureDeltas[]`,
 #### Test Execution
 > **Feature File:** [MB-049](../manual-testing-playbook/model-benchmark-mode/score-delta-benchmark-gates.md)
 
+### MB-052 | Zero-Call Fixture Census and Stub-Backend Skip
+
+#### Description
+`score-verdict-fallback.cjs` prints its fixture census without a model call and skips a stub Deem backend by name.
+
+#### Scenario Contract
+Prompt summary: As a manual-testing orchestrator, validate that the verdict fallback census makes no model call and that a stub Deem backend is skipped by name. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.
+
+Expected signals: The plain census exits 0 with `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs` and calls no stub. The `--deem` run adds only `deem arm skipped: stub backend`.
+
+#### Test Execution
+> **Feature File:** [MB-052](../manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md)
+
 ---
 
 ## 16. INTRA ROUTING RECALL
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
new file mode 100644
index 0000000000..e10c08896d
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs
@@ -0,0 +1,1420 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-verdict-fallback — offline reviewer verdict-fallback measurement   ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+/**
+ * Measure offline whether a Jev or Deem noul that reads a reviewer output and
+ * names one of pass, fail or block resolves the outputs the deterministic
+ * verdict pattern misses, and whether that column clears the keep rule against
+ * the operator's labels. The default run makes no model call and writes no
+ * file, and the script holds and reads no credential.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const fs = require('node:fs');
+const path = require('node:path');
+const crypto = require('node:crypto');
+const { spawn, spawnSync } = require('node:child_process');
+const { parseArgs } = require('node:util');
+
+const { extractVerdict } = require('./reviewer-scorer.cjs');
+const { DEFAULT_PROFILES_DIR, fixturePathFor } = require('../../lib/profile-resolve.cjs');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The one judgment question a noul answers; both arms ask exactly this.
+const QUESTION = 'Which verdict does this reviewer output give?';
+// The three answer keys and the option text that names each one.
+const OPTION_PAIRS = [
+  ['pass', 'The reviewer approves the change'],
+  ['fail', 'The reviewer rejects the change and names what must change'],
+  ['block', 'The reviewer says it cannot give a verdict'],
+];
+// Name order, rotated left by 1, then by 2, so option position cannot decide.
+const ORDERS = 3;
+// Labeled regex-miss outputs below which no arm opens.
+const LABEL_GATE = 12;
+// The margin the keep rule demands between the column and the baseline.
+const MARGIN_LINE = 'margin: 0.10';
+// The keep rule, fixed so a printed verdict can be rechecked by hand.
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= 3*M';
+// The power note, fixed so the five-win floor behind a keep is stated.
+const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
+// The choice p50 in deem-local.md, used for the wall-time estimate.
+const DEEM_P50_MS = 65.6;
+// Process cap; cli-deem applies its own 2,000 ms HTTP timeout.
+const HEALTH_TIMEOUT_MS = 10000;
+// The one jev version the arm accepts.
+const JEV_VERSION = 'jev 0.6.2';
+// The fixture set the default run censuses.
+const DEFAULT_PROFILE = path.resolve(__dirname, '../../../assets/model-benchmark/benchmark-profiles/reviewer-regression.json');
+// The repository root, used to resolve repository-relative profile paths.
+const REPO_ROOT = path.resolve(__dirname, '../../../../../../..');
+// Repo copy of the cli-deem entry point, run under node when none is on PATH.
+const REPO_CLI_DEEM = path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
+// The usage line printed whenever the run cannot start.
+const USAGE = 'usage: score-verdict-fallback.cjs [--profile <path-or-id>] [--outputs <file>] [--reports <dir>]... [--jev] [--deem] [--out <dir>] [--accept-payload]';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Hash text or bytes with SHA-256.
+ *
+ * @param {string|Buffer} input - Text or bytes to hash
+ * @returns {string} Lowercase hex digest
+ */
+function sha256Hex(input) {
+  return crypto.createHash('sha256').update(input).digest('hex');
+}
+
+/**
+ * Resolve the profile argument the way the reviewer scorer does: an existing
+ * path from the working directory wins, otherwise the argument names a profile
+ * file under the shared benchmark-profiles directory.
+ *
+ * @param {string} arg - Profile path or profile id
+ * @returns {string} Resolved profile path
+ */
+function resolveProfile(arg) {
+  const directPath = path.resolve(process.cwd(), arg);
+  return fs.existsSync(directPath) ? directPath : path.join(DEFAULT_PROFILES_DIR, arg + '.json');
+}
+
+/**
+ * Load every fixture case the profile names into one flat list: the profile's
+ * fixtureDir resolves against the working directory and then the profile's own
+ * directory, each fixture contributes its visible tests (or one case named
+ * after the fixture when it declares none) followed by its hidden tests, and a
+ * case overrides the fixture it sits on. The recorded reviewer output is kept
+ * as-is so the census classifies it without a model call.
+ *
+ * @param {string} profilePath - Resolved profile path
+ * @returns {Array<{ fixtureId: string, name: string, output: string|null }>} Flat case list
+ * @throws {Error} When the profile or a named fixture cannot be read or parsed
+ */
+function loadFixtureCases(profilePath) {
+  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
+  const profileDir = path.dirname(profilePath);
+  const fixtureDirArg = profile.fixtureDir || (profile.benchmark && profile.benchmark.fixtureDir);
+  let fixtureDir;
+  if (path.isAbsolute(fixtureDirArg)) {
+    fixtureDir = fixtureDirArg;
+  } else {
+    const fromCwd = path.resolve(process.cwd(), fixtureDirArg);
+    const fromRepoRoot = path.resolve(REPO_ROOT, fixtureDirArg);
+    fixtureDir = fs.existsSync(fromCwd)
+      ? fromCwd
+      : fs.existsSync(fromRepoRoot)
+        ? fromRepoRoot
+        : path.resolve(profileDir, fixtureDirArg);
+  }
+  const fixtureRefs = Array.isArray(profile.fixtures)
+    ? profile.fixtures
+    : (profile.benchmark && profile.benchmark.fixtures) || [];
+  const files = fixtureRefs.length > 0
+    ? fixtureRefs.map((fixtureRef) => fixturePathFor(fixtureRef, fixtureDir))
+    : fs.readdirSync(fixtureDir).filter((entry) => entry.endsWith('.json')).map((entry) => path.join(fixtureDir, entry));
+  const cases = [];
+  for (const filePath of files) {
+    const fixture = JSON.parse(fs.readFileSync(filePath, 'utf8'));
+    const visible = Array.isArray(fixture.tests) && fixture.tests.length > 0 ? fixture.tests : [{ name: fixture.id }];
+    const hidden = Array.isArray(fixture.hidden_tests) ? fixture.hidden_tests : [];
+    for (const testCase of visible.concat(hidden)) {
+      const merged = { ...fixture, ...(testCase || {}) };
+      const output = typeof merged.reviewer_output === 'string' && merged.reviewer_output.length > 0 ? merged.reviewer_output : null;
+      cases.push({ fixtureId: fixture.id, name: merged.name || fixture.id, output });
+    }
+  }
+  return cases;
+}
+
+/**
+ * Count the loaded cases: one with no recorded output is noOutput and can
+ * never be scored offline, one whose recorded output carries a pattern verdict
+ * is a hit, and every other recorded output is a miss the arms would need to
+ * resolve.
+ *
+ * @param {Array<{ fixtureId: string, name: string, output: string|null }>} cases - Cases from loadFixtureCases
+ * @returns {{ total: number, hits: number, misses: number, noOutput: number }} Fixture census
+ */
+function censusFixtures(cases) {
+  let hits = 0;
+  let misses = 0;
+  let noOutput = 0;
+  for (const entry of cases) {
+    if (entry.output === null) {
+      noOutput += 1;
+      continue;
+    }
+    if (extractVerdict(entry.output).verdict !== null) hits += 1;
+    else misses += 1;
+  }
+  return { total: cases.length, hits, misses, noOutput };
+}
+
+// The labels are the operator's gold, so a malformed row must stop the run
+// rather than drop it.
+/**
+ * Parse the operator's outputs file into one labeled row per line.
+ *
+ * @param {string} text - Outputs file contents, one JSON object per line
+ * @returns {Array<{ id: string, output: string, label: 'pass'|'fail'|'block', expectedVerdict: unknown }>} Labeled rows in file order
+ * @throws {Error} When a row is not JSON, carries no non-empty id, a non-string
+ *   output, a label other than pass, fail or block, or a repeated id
+ */
+function parseOutputs(text) {
+  const rows = [];
+  const seenIds = new Set();
+  const lines = text.split('\n');
+  for (let i = 0; i < lines.length; i++) {
+    const row = i + 1;
+    if (lines[i].trim() === '') continue;
+    let parsed;
+    try {
+      parsed = JSON.parse(lines[i]);
+    } catch {
+      throw new Error(`outputs row ${row}: not JSON`);
+    }
+    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
+    const id = isPlainObject ? parsed.id : undefined;
+    if (typeof id !== 'string' || id.length === 0) {
+      throw new Error(`outputs row ${row}: id must be a non-empty string`);
+    }
+    const output = parsed.output;
+    if (typeof output !== 'string') {
+      throw new Error(`outputs row ${row}: output must be a string`);
+    }
+    const label = parsed.label;
+    if (label !== 'pass' && label !== 'fail' && label !== 'block') {
+      throw new Error(`outputs row ${row}: label must be pass, fail or block, got ${JSON.stringify(label)}`);
+    }
+    if (seenIds.has(id)) throw new Error(`outputs row ${row}: duplicate id ${id}`);
+    seenIds.add(id);
+    rows.push({ id, output, label, expectedVerdict: parsed.expectedVerdict });
+  }
+  return rows;
+}
+
+/**
+ * Count the labeled outputs: one whose text carries a pattern verdict is a
+ * hit the deterministic pass already resolves, every other row is a miss the
+ * arms would need to resolve, and the misses are kept in file order.
+ *
+ * @param {Array<{ id: string, output: string, label: string }>} rows - Rows from parseOutputs
+ * @returns {{ total: number, hits: number, misses: number, kept: Array<{ id: string, output: string, label: string }> }} Outputs census
+ */
+function censusOutputs(rows) {
+  let hits = 0;
+  const kept = [];
+  for (const row of rows) {
+    if (extractVerdict(row.output).verdict !== null) hits += 1;
+    else kept.push(row);
+  }
+  return { total: rows.length, hits, misses: kept.length, kept };
+}
+
+/**
+ * Count the per-test verdict methods of every named reviewer report. Each
+ * directory is expected to hold the `reviewer-report.json` a reviewer
+ * benchmark wrote, whose scored fixtures sit under `rows` (or its `fixtures`
+ * alias), and each fixture's `per_test` entries are bucketed by the method
+ * that resolved the verdict: the deterministic pattern, the llm grader, or
+ * none.
+ *
+ * @param {string[]} dirs - Directories each holding a `reviewer-report.json`
+ * @returns {Array<{ path: string, pattern: number, llmGrader: number, none: number }>} One census per directory, in argument order
+ * @throws {Error} When a report cannot be read or parsed
+ */
+function censusReports(dirs) {
+  const censuses = [];
+  for (const dir of dirs) {
+    const reportPath = path.join(dir, 'reviewer-report.json');
+    let report;
+    try {
+      report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
+    } catch (err) {
+      throw new Error(`cannot read report ${reportPath}: ${err.message}`);
+    }
+    const rows = Array.isArray(report?.rows)
+      ? report.rows
+      : Array.isArray(report?.fixtures)
+        ? report.fixtures
+        : [];
+    let pattern = 0;
+    let llmGrader = 0;
+    let none = 0;
+    for (const row of rows) {
+      const perTest = Array.isArray(row?.per_test) ? row.per_test : [];
+      for (const entry of perTest) {
+        const method = entry?.verdictMethod;
+        if (method === 'pattern') pattern += 1;
+        else if (method === 'llm-grader') llmGrader += 1;
+        else none += 1;
+      }
+    }
+    censuses.push({ path: reportPath, pattern, llmGrader, none });
+  }
+  return censuses;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. BASELINES
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Pick the last whole verdict word anywhere in the text, case-insensitively:
+ * the loose rule the baseline uses where the deterministic pattern finds no
+ * verdict line. A text holding no whole word of pass, fail or block reads as
+ * no pick at all, which counts wrong.
+ *
+ * @param {string} text - Reviewer output text
+ * @returns {'pass'|'fail'|'block'|null} Last whole verdict word, lowercased, else null
+ */
+function loosePick(text) {
+  const matches = text.match(/\b(pass|fail|block)\b/gi);
+  return matches === null ? null : matches[matches.length - 1].toLowerCase();
+}
+
+/**
+ * Pick the stronger of the two zero-call baselines: the majority class of the
+ * labels, or the loose rule that reads the last whole verdict word, with the
+ * loose rule winning a tie. A label tie breaks to the class earliest in pass,
+ * fail, block, and the chosen method's pick for every row is kept as the calls
+ * the columns are compared against.
+ *
+ * @param {Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>} rows - Labeled rows
+ * @returns {{ majorityClass: 'pass'|'fail'|'block', majorityRight: number, looseRight: number, method: 'majority'|'loose', right: number, calls: Map<string, 'pass'|'fail'|'block'|null> }} The chosen baseline
+ */
+function chooseBaseline(rows) {
+  const counts = { pass: 0, fail: 0, block: 0 };
+  for (const row of rows) counts[row.label] += 1;
+  let majorityClass = 'pass';
+  for (const candidate of ['pass', 'fail', 'block']) {
+    if (counts[candidate] > counts[majorityClass]) majorityClass = candidate;
+  }
+  let majorityRight = 0;
+  let looseRight = 0;
+  for (const row of rows) {
+    if (row.label === majorityClass) majorityRight += 1;
+    if (loosePick(row.output) === row.label) looseRight += 1;
+  }
+  const method = looseRight >= majorityRight ? 'loose' : 'majority';
+  const right = method === 'loose' ? looseRight : majorityRight;
+  const calls = new Map(rows.map((row) => [row.id, method === 'loose' ? loosePick(row.output) : majorityClass]));
+  return { majorityClass, majorityRight, looseRight, method, right, calls };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. KEEP RULE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Counts stay integers and the tails are exact (a BigInt sum over 2^trials),
+// so no rounding decides a verdict.
+
+/**
+ * Exact one-sided chance of `successes` or more in `trials` fair coin flips.
+ * The tail sum is built coefficient by coefficient in BigInt, and the below
+ * 0.05 test stays exact as 20 * num < den, never a float comparison.
+ *
+ * @param {number} successes - Outcomes whose tail is summed
+ * @param {number} trials - Total flips
+ * @returns {{ num: bigint, den: bigint, p: number }} Tail numerator over 2^trials
+ */
+function binomialTail(successes, trials) {
+  let coefficient = 1n;
+  let num = 0n;
+  for (let i = 0; i <= trials; i += 1) {
+    if (i > 0) coefficient = (coefficient * BigInt(trials - i + 1)) / BigInt(i);
+    if (i >= successes) num += coefficient;
+  }
+  const den = 1n << BigInt(trials);
+  return { num, den, p: Number(num) / Number(den) };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign
+ * test, flips. The loss tail kills before the margin is read, and the flips
+ * check binds both backends because each asks every output in three orders.
+ *
+ * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - Column counts
+ * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'margin'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
+ */
+function decideVerdict({ K, M, A, B, W, L, F }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
+  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
+  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', pWin: win.p, pLoss: loss.p };
+  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
+  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
+  return { outcome: 'keep', reason: null, pWin: win.p, pLoss: loss.p };
+}
+
+/**
+ * @param {number} p - Probability in [0, 1]
+ * @returns {string} Four significant digits
+ */
+function formatP(p) {
+  return p.toPrecision(4);
+}
+
+/**
+ * The key an answer array names at least twice, with the count it reached.
+ * Three different keys name no pick at all, which reads as unstable and
+ * counts wrong, while the top count still feeds the flip count.
+ *
+ * @param {string[]} answers - Submitted answer keys for one row
+ * @returns {{ pick: string|null, top: number }} Modal pick, or null when no key reaches two
+ */
+function modalPick(answers) {
+  const counts = new Map();
+  for (const key of answers) counts.set(key, (counts.get(key) || 0) + 1);
+  let pick = null;
+  let top = 0;
+  for (const [key, count] of counts) {
+    if (count > top) {
+      top = count;
+      pick = count >= 2 ? key : null;
+    }
+  }
+  return { pick, top };
+}
+
+/**
+ * One column's counts and verdict. A row is measured only when its answer
+ * array holds one submitted key per option order; every other row stays
+ * unmeasured and never counts. The pick is the key named at least twice, an
+ * unstable row counts wrong, the baseline's own pick is compared on the same
+ * measured rows, and each row's non-modal orders add to the flip count, so
+ * instability is never hidden.
+ *
+ * @param {'jev'|'deem'} backend - Backend name, printed on the verdict line
+ * @param {Array<{ id: string, label: 'pass'|'fail'|'block' }>} rows - Labeled rows, in file order
+ * @param {Map<string, Array<string|null>>} answers - Row id -> submitted answer keys, one per order
+ * @param {Map<string, 'pass'|'fail'|'block'|null>} baselineCalls - Row id -> baseline pick
+ * @param {string} labelsSha - Label digest printed on the verdict line
+ * @param {string} suffix - Backend identity appended to the line when non-empty
+ * @returns {{ backend: string, K: number, M: number, unmeasured: number, A: number, B: number, W: number, L: number, F: number, pWin: number, pLoss: number, outcome: string, reason: string|null, line: string }} Column summary
+ */
+function summarizeColumn(backend, rows, answers, baselineCalls, labelsSha, suffix) {
+  const K = rows.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  for (const row of rows) {
+    const values = answers.get(row.id);
+    if (!Array.isArray(values) || values.length !== ORDERS) continue;
+    if (!values.every((value) => value === 'pass' || value === 'fail' || value === 'block')) continue;
+    M += 1;
+    const { pick, top } = modalPick(values);
+    F += ORDERS - top;
+    const columnRight = pick === row.label;
+    const baselineRight = baselineCalls.get(row.id) === row.label;
+    if (columnRight) A += 1;
+    if (baselineRight) B += 1;
+    if (columnRight && !baselineRight) W += 1;
+    if (baselineRight && !columnRight) L += 1;
+  }
+  const verdict = decideVerdict({ K, M, A, B, W, L, F });
+  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
+  let line = `verdict ${backend}: ${outcomeText} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p_win=${formatP(verdict.pWin)} p_loss=${formatP(verdict.pLoss)} labels_sha256=${labelsSha}`;
+  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
+  return { backend, K, M, unmeasured: K - M, A, B, W, L, F, pWin: verdict.pWin, pLoss: verdict.pLoss, outcome: verdict.outcome, reason: verdict.reason, line };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. DEEM GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The model the Deem arm requires; any other is a failed health check.
+const DEEM_MODEL = 'deem-0.8-v1';
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name Executable file name.
+ * @param {{ PATH?: string }} env Environment whose PATH is searched.
+ * @returns {string | null} First executable match, or null when none is executable.
+ */
+function which(name, env) {
+  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
+    if (dir.length === 0) continue;
+    const candidate = path.join(dir, name);
+    try {
+      if (fs.statSync(candidate).isFile()) {
+        fs.accessSync(candidate, fs.constants.X_OK);
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
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under node.
+ *
+ * @param {{ PATH?: string }} env Environment whose PATH is searched.
+ * @returns {string[]} Command and leading arguments for one call.
+ */
+function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, or a wrong model
+ * is a failed check the caller prints as a skip.
+ *
+ * @param {string[]} cmd Command from deemCommand.
+ * @param {Record<string, string | undefined>} env Environment for the call.
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }}
+ */
+function readDeemHealth(cmd, env) {
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
+ * Prints the health line, or a skip line when the check fails.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx Line writer and environment.
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed.
+ */
+function deemGate(ctx) {
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
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. JEV GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Whether git tracks a file, from `git ls-files -z` run in the file's
+ * directory. A git failure reads as untracked, because a file whose status
+ * cannot be read must not count as committed.
+ *
+ * @param {string} dir Directory the git command runs in.
+ * @param {string} name File name to test.
+ * @returns {boolean} True when git tracks the name.
+ */
+function trackedFile(dir, name) {
+  const res = spawnSync('git', ['ls-files', '-z', '--', name], {
+    cwd: dir,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+  });
+  if (res.error || res.status !== 0) return false;
+  return (res.stdout ?? '').split('\0').some((entry) => entry.length > 0);
+}
+
+/**
+ * Identity line, then the pinned client version, a credential check and the
+ * payload rule. An untracked outputs file may hold text nobody reviewed, so it
+ * needs the operator's explicit accept before it leaves the machine. A miss
+ * prints a skip line and leaves the census text already written.
+ *
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   outputsFile: string | null,
+ *   acceptPayload: boolean
+ * }} ctx Line writer, environment, per-call timeout, the labeled outputs file
+ *   and the operator's payload accept.
+ * @returns {{ passed: boolean, path: string | null, provider: string, untracked: boolean, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed.
+ */
+function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const jevPath = which('jev', ctx.env);
+  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
+  if (jevPath === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs,
+  };
+  const version = spawnSync(jevPath, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
+    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
+  }
+
+  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked: false, reason: skipLine };
+  }
+
+  let untracked = false;
+  if (typeof ctx.outputsFile === 'string' && ctx.outputsFile !== '') {
+    untracked = !trackedFile(path.dirname(ctx.outputsFile), path.basename(ctx.outputsFile));
+  }
+  if (untracked && ctx.acceptPayload !== true) {
+    const skipLine = 'jev arm skipped: payload not accepted';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, untracked, reason: skipLine };
+  }
+  return { passed: true, path: jevPath, provider, untracked };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. ARM HELPERS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Nearest-rank percentile. Empty lists have no rank.
+ *
+ * @param {number[]} values Raw values.
+ * @param {number} q Quantile in (0, 1].
+ * @returns {number | null}
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
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
+ * @param {string} file Executable to spawn.
+ * @param {string[]} args Arguments after the executable.
+ * @param {string} stdinText Text written to stdin, then closed.
+ * @param {Record<string, string | undefined>} env Child environment.
+ * @param {number} timeoutMs Kill and resolve after this many milliseconds.
+ * @returns {Promise<{
+ *   code: number | null,
+ *   stdout: string,
+ *   stderr: string,
+ *   wallMs: number,
+ *   timedOut: boolean
+ * }>}
+ */
+function spawnCall(file, args, stdinText, env, timeoutMs) {
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
+ * One JSON-line record per model call under outDir. A missing or empty outDir
+ * keeps no records, so nothing is created. The file is created empty on the
+ * first append, and one line per call keeps a killed arm's earlier records
+ * readable.
+ *
+ * @param {string | undefined} outDir Directory that holds calls.jsonl.
+ * @returns {{ append: (record: object) => void }} Append-only call log.
+ */
+function createCallLog(outDir) {
+  let created = false;
+  return {
+    append(record) {
+      if (typeof outDir !== 'string' || outDir === '') return;
+      const filePath = path.join(outDir, 'calls.jsonl');
+      if (!created) {
+        fs.mkdirSync(outDir, { recursive: true });
+        fs.writeFileSync(filePath, '');
+        created = true;
+      }
+      fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
+    },
+  };
+}
+
+/**
+ * Parsed report.json written by an earlier run into the same out directory.
+ *
+ * @param {string | undefined} outDir Directory that may hold report.json.
+ * @returns {object | null} The parsed report, or null when outDir is empty,
+ *   the file is missing, or the file does not parse.
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. ARMS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The Deem arm: every labeled row is asked in each of the three option
+ * rotations, one fresh local call per order, and a row is measured only when
+ * all three calls return one of the submitted keys. Exit 4 rechecks the
+ * server health and retries once, a malformed answer or a spent retry leaves
+ * that call unmeasured, and a stop line ends the arm with the rows finished.
+ * Nothing leaves the machine, so no payload accept applies.
+ *
+ * @param {{
+ *   rows: Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>,
+ *   baselineCalls: Map<string, 'pass'|'fail'|'block'|null>,
+ *   labelsSha: string
+ * }} plan Labeled miss rows with their output text, the baseline calls and the
+ *   label digest.
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate
+ *   Passing gate result: the command and the health identity.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored?: object | null
+ * }} ctx Line writer, environment, per-call timeout, call log and the stored
+ *   report.
+ * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
+ *   The finished column or the stop line with the rows finished.
+ */
+async function runDeemArm(plan, gate, ctx) {
+  const planned = ORDERS * plan.rows.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the choice p50 from deem-local.md`);
+
+  const answers = new Map();
+  const wallTimes = [];
+  let finished = 0;
+
+  /**
+   * One calls.jsonl record. A call that led to a stop, a retry or a failed
+   * measurement carries no judgment, so its pick and status stay empty.
+   */
+  function record(row, order, attempt, r, pick, status) {
+    return {
+      backend: 'deem',
+      output: row.id,
+      order,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      pick,
+      status,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    };
+  }
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  for (const row of plan.rows) {
+    const values = [];
+    for (let order = 1; order <= ORDERS; order += 1) {
+      const optionArgs = [];
+      for (let offset = 0; offset < OPTION_PAIRS.length; offset += 1) {
+        const [key, description] = OPTION_PAIRS[(offset + order - 1) % OPTION_PAIRS.length];
+        optionArgs.push('-o', `${key}=${description}`);
+      }
+      const callArgs = [...gate.cmd.slice(1), 'choice', '-q', QUESTION, ...optionArgs];
+      let attempt = 1;
+      let r = await spawnCall(gate.cmd[0], callArgs, row.output, ctx.env, ctx.timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, order, attempt, r, null, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        attempt = 2;
+        r = await spawnCall(gate.cmd[0], callArgs, row.output, ctx.env, ctx.timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let pick = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(r.stdout);
+        } catch {
+          // A body that does not parse is a failed measurement, not a crash.
+        }
+        const value = parsed?.answers?.answer?.choice;
+        if (typeof value === 'string' && OPTION_PAIRS.some(([key]) => key === value)) {
+          pick = value;
+          status = 'measured';
+        }
+      } else if (r.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (r.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, order, attempt, r, pick, status));
+      if (stopLine !== null) return stop(stopLine);
+      values.push(pick);
+    }
+    answers.set(row.id, values);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'deem',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    plan.labelsSha,
+    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
+  );
+  const latency = {
+    p50: nearestRank(wallTimes, 0.5),
+    p95: nearestRank(wallTimes, 0.95),
+  };
+  ctx.out(`column deem: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (
+    storedDeem
+    && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)
+  ) {
+    requalify = 'requalify: model commit changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+
+  return {
+    column: {
+      ...column,
+      latency,
+      modelId: gate.model,
+      modelCommit: gate.modelCommit,
+      sourceCommit: gate.sourceCommit,
+    },
+    requalify,
+  };
+}
+
+/**
+ * The Jev arm: one auth test to learn the provider model, then every labeled
+ * row asked in each of the three option rotations, one fresh hosted call per
+ * order. A measured call is exit 0 with a submitted answer key; exit 4 waits
+ * and retries once, a malformed answer or a spent retry leaves that call
+ * unmeasured, and a stop line ends the arm with the rows finished. The
+ * payload is the reviewer outputs the gate accepted.
+ *
+ * @param {{
+ *   rows: Array<{ id: string, output: string, label: 'pass'|'fail'|'block' }>,
+ *   baselineCalls: Map<string, 'pass'|'fail'|'block'|null>,
+ *   labelsSha: string
+ * }} plan Labeled miss rows with their output text, the baseline calls and the
+ *   label digest.
+ * @param {{ path: string, provider: string, untracked: boolean }} gate
+ *   Passing gate result: the client path, the provider and whether the outputs
+ *   file is untracked.
+ * @param {{
+ *   out: (line: string) => void,
+ *   env: Record<string, string | undefined>,
+ *   timeoutMs: number,
+ *   backoffMs: number,
+ *   callLog: { append: (record: object) => void },
+ *   stored?: object | null
+ * }} ctx Line writer, environment, per-call timeout, retry wait, call log and
+ *   the stored report.
+ * @returns {{ column: object, requalify: string | null } | { stopped: string, partialRows: number }}
+ *   The finished column or the stop line with the rows finished.
+ */
+async function runJevArm(plan, gate, ctx) {
+  const jevVersion = JEV_VERSION.split(' ')[1];
+  let chars = 0;
+  for (const row of plan.rows) {
+    chars += row.output.length + QUESTION.length;
+    for (const [key, description] of OPTION_PAIRS) chars += key.length + description.length + 1;
+  }
+  chars *= ORDERS;
+  ctx.out(`jev: payload: ${gate.untracked ? 'untracked' : 'committed'} reviewer outputs; planned calls: ${ORDERS * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const wallTimes = [];
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs);
+  wallTimes.push(auth.wallMs);
+  let model = 'unknown';
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
+    output: null,
+    order: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    pick: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion,
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
+  const answers = new Map();
+
+  /**
+   * One calls.jsonl record. A call that led to a stop or a retry carries no
+   * judgment, so its pick and status stay empty.
+   */
+  function record(row, order, attempt, r, pick, status) {
+    return {
+      backend: 'jev',
+      output: row.id,
+      order,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      pick,
+      status,
+      jevVersion,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  for (const row of plan.rows) {
+    const values = [];
+    for (let order = 1; order <= ORDERS; order += 1) {
+      const optionArgs = [];
+      for (let offset = 0; offset < OPTION_PAIRS.length; offset += 1) {
+        const [key, description] = OPTION_PAIRS[(offset + order - 1) % OPTION_PAIRS.length];
+        optionArgs.push('-o', `${key}=${description}`);
+      }
+      const callArgs = ['choice', '--provider', gate.provider, '-q', QUESTION, ...optionArgs];
+      let attempt = 1;
+      let r = await spawnCall(gate.path, callArgs, row.output, ctx.env, ctx.timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, order, attempt, r, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, ctx.backoffMs));
+        attempt = 2;
+        r = await spawnCall(gate.path, callArgs, row.output, ctx.env, ctx.timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let pick = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(r.stdout);
+        } catch {
+          // A body that does not parse is a failed measurement, not a crash.
+        }
+        const value = parsed?.answers?.answer?.choice;
+        if (typeof value === 'string' && OPTION_PAIRS.some(([key]) => key === value)) {
+          pick = value;
+          status = 'measured';
+        }
+      } else if (r.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (r.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, order, attempt, r, pick, status));
+      if (stopLine !== null) return stop(stopLine);
+      values.push(pick);
+    }
+    answers.set(row.id, values);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'jev',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    plan.labelsSha,
+    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
+  );
+  const latency = {
+    p50: nearestRank(wallTimes, 0.5),
+    p95: nearestRank(wallTimes, 0.95),
+  };
+  ctx.out(`column jev: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const storedJev = ctx.stored?.columns?.jev;
+  let requalify = null;
+  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
+    requalify = 'requalify: model changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+
+  return {
+    column: {
+      ...column,
+      latency,
+      jevVersion,
+      provider: gate.provider,
+      model,
+    },
+    requalify,
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The report one run writes to report.json. The census keeps its counts, the
+ * labeled set its row count and class split, the baseline its summary, and
+ * each arm entry, undefined or { skipped } or { stopped, partialRows } or
+ * { column, requalify }, fills one bucket: a finished column under columns, a
+ * stop under stopped, a skip under skipped, and a finished column also
+ * records the line that explains a re-run.
+ *
+ * @param {{
+ *   census: { fixtures: object, outputs: object },
+ *   labeled: { K: number, pass: number, fail: number, block: number },
+ *   baseline: { method: 'majority'|'loose', majorityClass: string, majorityRight: number, looseRight: number, right: number },
+ *   gateLine: string,
+ *   labelsSha: string | null,
+ *   jev?: object,
+ *   deem?: object
+ * }} parts
+ * @returns {object} Report object ready for JSON.stringify.
+ */
+function buildReport(parts) {
+  const { census, labeled, baseline, gateLine, labelsSha, jev, deem } = parts;
+  const report = {
+    question: QUESTION,
+    optionsSha256: sha256Hex(JSON.stringify({ question: QUESTION, options: OPTION_PAIRS })),
+    labelsSha256: labelsSha,
+    census,
+    labeled,
+    baseline: {
+      method: baseline.method,
+      majorityClass: baseline.majorityClass,
+      majorityRight: baseline.majorityRight,
+      looseRight: baseline.looseRight,
+      right: baseline.right,
+    },
+    gate: gateLine,
+    columns: {},
+    stopped: {},
+    skipped: {},
+    requalify: {},
+  };
+
+  for (const [backend, arm] of [['jev', jev], ['deem', deem]]) {
+    if (!arm) continue;
+    if (typeof arm.skipped === 'string') {
+      report.skipped[backend] = arm.skipped;
+      continue;
+    }
+    if (typeof arm.stopped === 'string') {
+      report.stopped[backend] = { line: arm.stopped, partialRows: arm.partialRows };
+      continue;
+    }
+    if (!arm.column) continue;
+    const { column } = arm;
+    report.columns[backend] = {
+      verdict: column.outcome,
+      reason: column.reason,
+      line: column.line,
+      K: column.K,
+      M: column.M,
+      A: column.A,
+      B: column.B,
+      W: column.W,
+      L: column.L,
+      F: column.F,
+      pWin: column.pWin,
+      pLoss: column.pLoss,
+      unmeasured: column.unmeasured,
+      latency: column.latency,
+    };
+    if (backend === 'deem') {
+      report.columns[backend].modelId = column.modelId;
+      report.columns[backend].modelCommit = column.modelCommit;
+      report.columns[backend].sourceCommit = column.sourceCommit;
+    }
+    if (backend === 'jev') {
+      report.columns[backend].jevVersion = column.jevVersion;
+      report.columns[backend].provider = column.provider;
+      report.columns[backend].model = column.model;
+    }
+    report.requalify[backend] = arm.requalify ?? null;
+  }
+
+  return report;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Print the zero-call report: census the fixture cases and the operator's
+ * labeled outputs, count the verdict methods of every named report, pick the
+ * baseline the columns are compared against and print the label gate. Every
+ * input is read before the first line prints, so a bad input leaves stdout
+ * empty. A run without --jev or --deem makes no model call and writes no file,
+ * while a run with either records the census and every arm result in
+ * `<out>/report.json`.
+ *
+ * @param {string[]} argv - Arguments after the node and script paths
+ * @param {object} [deps] - Injected dependencies
+ * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
+ * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
+ * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
+ * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
+ * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
+ * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? 90000;
+  const backoffMs = deps.backoffMs ?? 2000;
+
+  let parsed;
+  try {
+    parsed = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        profile: { type: 'string' },
+        outputs: { type: 'string' },
+        reports: { type: 'string', multiple: true },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+        'accept-payload': { type: 'boolean' },
+      },
+    });
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+  const { values } = parsed;
+  if ((values.deem === true || values.jev === true) && (typeof values.out !== 'string' || values.out === '')) {
+    err(values.deem === true
+      ? '--deem needs --out <dir> so every call is recorded'
+      : '--jev needs --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  let fixtureCensus;
+  let outputCensus;
+  let reports;
+  let kept;
+  let labelsSha;
+  let baseline;
+  try {
+    const profilePath = typeof values.profile === 'string' && values.profile !== ''
+      ? resolveProfile(values.profile)
+      : DEFAULT_PROFILE;
+    fixtureCensus = censusFixtures(loadFixtureCases(profilePath));
+    const outputBytes = typeof values.outputs === 'string' ? fs.readFileSync(values.outputs) : null;
+    const outputRows = outputBytes === null ? [] : parseOutputs(outputBytes.toString('utf8'));
+    labelsSha = outputBytes === null ? null : sha256Hex(outputBytes);
+    outputCensus = censusOutputs(outputRows);
+    reports = censusReports(Array.isArray(values.reports) ? values.reports : []);
+    kept = outputCensus.kept;
+    baseline = chooseBaseline(kept);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  let pass = 0;
+  let fail = 0;
+  let block = 0;
+  for (const row of kept) {
+    if (row.label === 'pass') pass += 1;
+    else if (row.label === 'fail') fail += 1;
+    else block += 1;
+  }
+  const K = kept.length;
+
+  out(`fixture cases: ${fixtureCensus.total} hits: ${fixtureCensus.hits} misses: ${fixtureCensus.misses}`);
+  if (fixtureCensus.noOutput > 0) out(`fixture no recorded output: ${fixtureCensus.noOutput}`);
+  if (typeof values.outputs === 'string') {
+    out(`outputs rows: ${outputCensus.total} hits: ${outputCensus.hits} misses: ${outputCensus.misses}`);
+  }
+  for (const report of reports) {
+    out(`report ${report.path}: pattern=${report.pattern} llm-grader=${report.llmGrader} none=${report.none}`);
+  }
+  out(`labeled: ${K} (pass ${pass}, fail ${fail}, block ${block})`);
+  out(`baseline majority: ${baseline.majorityClass} right ${baseline.majorityRight} of ${K}`);
+  out(`baseline loose: right ${baseline.looseRight} of ${K}`);
+  out(`baseline method: ${baseline.method} right ${baseline.right} of ${K}`);
+  out(`baseline unknown: right 0 of ${K}`);
+  out(`question: ${QUESTION}`);
+  out(`options: ${OPTION_PAIRS.length} sha256=${sha256Hex(JSON.stringify({ question: QUESTION, options: OPTION_PAIRS }))}`);
+  out(`orders: ${ORDERS}, name order then rotated left by 1 and by 2`);
+  out(MARGIN_LINE);
+  out(KEEP_RULE_LINE);
+  out(POWER_LINE);
+
+  let gate;
+  let gateLine;
+  if (K < LABEL_GATE) {
+    gate = 'label';
+    gateLine = `stop: fewer than ${LABEL_GATE} labeled regex-miss outputs`;
+  } else if (pass === 0) {
+    gate = 'label';
+    gateLine = 'stop: no labeled pass output';
+  } else if (fail === 0) {
+    gate = 'label';
+    gateLine = 'stop: no labeled fail output';
+  } else if (block === 0) {
+    gate = 'label';
+    gateLine = 'stop: no labeled block output';
+  } else if (10 * baseline.right > 9 * K) {
+    gate = 'headroom';
+    gateLine = 'no headroom';
+  } else {
+    gate = 'open';
+    gateLine = `planned calls: jev ${3 * K + 1}, deem ${3 * K}`;
+  }
+  out(gateLine);
+
+  const closedReason = gate === 'headroom' ? 'no headroom' : 'label gate';
+  const stored = values.jev === true || values.deem === true ? readStoredReport(values.out) : null;
+  const callLog = createCallLog(values.out);
+  const plan = gate === 'open'
+    ? { rows: kept, baselineCalls: baseline.calls, labelsSha }
+    : null;
+
+  let jevResult;
+  if (values.jev === true) {
+    const jevCheck = jevGate({
+      out,
+      env,
+      timeoutMs,
+      outputsFile: typeof values.outputs === 'string' ? values.outputs : null,
+      acceptPayload: values['accept-payload'] === true,
+    });
+    if (!jevCheck.passed) {
+      jevResult = { skipped: jevCheck.reason };
+    } else if (gate !== 'open') {
+      const line = `jev arm skipped: ${closedReason}`;
+      out(line);
+      jevResult = { skipped: line };
+    } else {
+      jevResult = await runJevArm(plan, jevCheck, { out, env, timeoutMs, backoffMs, callLog, stored });
+    }
+  }
+
+  let deemResult;
+  if (values.deem === true) {
+    const deemCheck = deemGate({ out, env });
+    if (!deemCheck.passed) {
+      deemResult = { skipped: deemCheck.reason };
+    } else if (gate !== 'open') {
+      const line = `deem arm skipped: ${closedReason}`;
+      out(line);
+      deemResult = { skipped: line };
+    } else {
+      deemResult = await runDeemArm(plan, deemCheck, { out, env, timeoutMs, callLog, stored });
+    }
+  }
+
+  if (values.jev === true || values.deem === true) {
+    const report = buildReport({
+      census: {
+        fixtures: fixtureCensus,
+        outputs: { total: outputCensus.total, hits: outputCensus.hits, misses: outputCensus.misses },
+      },
+      labeled: { K, pass, fail, block },
+      baseline,
+      gateLine,
+      labelsSha,
+      jev: jevResult,
+      deem: deemResult,
+    });
+    fs.mkdirSync(values.out, { recursive: true });
+    fs.writeFileSync(path.join(values.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
+  }
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 12. EXPORTS + CLI ENTRYPOINT
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  QUESTION, OPTION_PAIRS, ORDERS, LABEL_GATE, MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE,
+  DEEM_MODEL, DEEM_P50_MS, HEALTH_TIMEOUT_MS, JEV_VERSION, DEFAULT_PROFILE, REPO_CLI_DEEM, USAGE,
+  sha256Hex, resolveProfile, loadFixtureCases, censusFixtures,
+  parseOutputs, censusOutputs, censusReports,
+  loosePick, chooseBaseline,
+  binomialTail, decideVerdict, formatP, modalPick, summarizeColumn,
+  which, deemCommand, readDeemHealth, deemGate, trackedFile, jevGate,
+  nearestRank, spawnCall, createCallLog, readStoredReport,
+  buildReport, runDeemArm, runJevArm,
+  main,
+};
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
```
