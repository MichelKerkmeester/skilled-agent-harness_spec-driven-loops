# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/deep-improvement/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-improvement/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md`
- `.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.18.0.0.md`
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md`
- `.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md`
- `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md b/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
index 04e8843a8c..80e07996b3 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/SKILL.md
@@ -2,7 +2,7 @@
 name: deep-improvement
 description: "Evaluator-first bounded agent improvement: 5-dim scoring, dynamic profiling, packet-local candidates, guarded promotion."
 allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
-version: 1.17.2.0
+version: 1.18.0.0
 triggers:
   - deep-improvement
   - agent improvement loop
@@ -219,7 +219,7 @@ For changes that alter agent discipline, run a same-task A/B stress scenario (is
 Lane B benchmarks a model or prompt framework instead of mutating an agent file. Command: `/deep:model-benchmark`. Runtime entry is `scripts/shared/loop-host.cjs --mode=model-benchmark`. It reuses the three pluggable seams (candidate-source, dispatcher, scorer) and keeps the default agent-improvement path byte-identical when no mode flag is set.
 
 - **Entry + dispatch**: `loop-host.cjs` resolves `--mode=agent-improvement` (default) vs `--mode=model-benchmark`; the model-agnostic dispatcher `scripts/model-benchmark/dispatch-model.cjs` loads only on the model-benchmark path.
-- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic).
+- **Scoring**: `run-benchmark.cjs --scorer pattern` (default) uses the heading/pattern matcher; `--scorer 5dim` routes through the ported 120/003 five-dimension scorer with a pluggable `--grader noop|mock|llm` (default `noop`, deterministic). Any other `--grader` value exits 2 at startup and names the value. `scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` measures offline, with no model call by default, whether a Jev or Deem hallucination judgment agrees with operator labels more often than the deterministic check, and `--jev` or `--deem` adds a verdict column behind that backend's own check once 30 outputs carry labels.
 - **Promotion**: state records and reports carry `mode`/`scoringMethod` for lane attribution. Lane A promotes through the agent-scored gates in `promote-candidate.cjs`; Lane B promotes from the benchmark report via `promote-candidate.cjs --benchmark-report <report.json>` when status is `benchmark-complete` with a passing recommendation — both lanes still share one canonical-target guard, archive, and runtime-mirror sync.
 - **Hardening**: `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in both the 5-dim scorer and the bundle-gate Layer-3 acceptance command; `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the cache. Both default permissive (trusted-author boundary: criteria come only from operator-authored benchmark profiles in the same trust domain as the loop) — flip both for hardened/shared-runner deployments.
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/README.md b/.skilled/skills/system-deep-loop/deep-improvement/README.md
index 7d6667cb7c4..92b039cc3eb 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/README.md
@@ -105,7 +105,7 @@ Both lanes share the same candidate, dispatcher and scorer seams.
 | A: Agent-Improvement | `/deep:agent-improvement` | A bounded agent `.md` file |
 | B: Model-Benchmark | `/deep:model-benchmark` | A model or prompt framework against repeatable fixtures |
 
-Lane B enters through `scripts/shared/loop-host.cjs --mode=model-benchmark` and writes benchmark outputs to `.skilled/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}/`; benchmark reports include `outcomeScoreDelta` and helped/hurt fixture deltas so promotion can block regressions instead of relying on pass/fail alone. Lane A is the default path when no mode flag is set.
+Lane B enters through `scripts/shared/loop-host.cjs --mode=model-benchmark` and writes benchmark outputs to `.skilled/skills/system-deep-loop/deep-improvement/benchmark/model-benchmark/{run_label}/`; benchmark reports include `outcomeScoreDelta` and helped/hurt fixture deltas so promotion can block regressions instead of relying on pass/fail alone. Lane A is the default path when no mode flag is set. The offline scorer `scripts/model-benchmark/scorer/score-d4-agreement.cjs` makes no model call on its default run and stops below 30 labeled outputs, and `--jev` and `--deem` each add a verdict column behind that backend's own check.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
index 79d9d00a3e1..43b7eac9d88 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/README.md
@@ -70,6 +70,7 @@ deterministic/ and lib/ do not import score-model-variant
 ```text
 scorer/
 +-- score-model-variant.cjs   # Orchestrating scorer with the public score() API
++-- score-d4-agreement.cjs    # Offline D4 agreement measurement against operator labels
 +-- deterministic/            # D1-style + D2/D3/D5 deterministic check scripts
 +-- grader/                   # D4 LLM grader harness, dispute, system prompts
 `-- lib/                      # Scorer-internal cache (runtime cache/ git-ignored)
@@ -82,6 +83,7 @@ scorer/
 | File | Responsibility |
 |---|---|
 | `score-model-variant.cjs` | Public `score()` orchestration. Synthesizes the virtual fixture, runs each deterministic check via `runDetCheck`, builds the grader via `buildGraderFn`, applies the hard gate, and computes the weighted score. |
+| `score-d4-agreement.cjs` | Offline D4 agreement measurement against operator labels. Measures whether a judgment from `--jev` or `--deem` that flags an invented command-line flag, file or function agrees with the labels more often than the baseline from the spawned `deterministic/hallucination-flag.cjs`. The default run makes no model call and writes no file. |
 | `deterministic/` | Standalone check scripts spawned per dimension: bundle gate, cwd check, pre-planning, hallucination flag. |
 | `grader/` | The D4 grader. `harness.cjs` builds the prompt, dispatches, parses, and caches. `dispute.cjs` adds adversarial escalation. |
 | `lib/` | Scorer-internal cache module backing the grader. |
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
index 06be43377d7..9bf78009bfe 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/README.md
@@ -22,8 +22,9 @@ cd .skilled/skills/system-deep-loop/deep-improvement/scripts && npx vitest run m
 
 Current state:
 
-- The suite is green at **158 tests across 12 files**.
+- The suite is green at **205 tests across 14 files**.
 - Lane B tests (scorer, opt-in 5-dim scorer, grader/runner hardening, remediation) cover the legacy agent-improvement benchmark path.
+- `d4-agreement.vitest.ts` covers the offline D4 agreement measurement: the zero-call census, the label gate, the keep rule and both arms on stub backends.
 - Sweep tests (foundation, runtime, acceptance, stats-CI, isolation, dispatch-envelope) cover the matrix expander, correctness gate, trust verdict, normalized dispatch envelope, and per-cell cwd-isolation.
 - `sweep-isolation` is the safety net for the real-dispatch path: it asserts each cell runs in an `os.tmpdir()` working directory (never the repo root) and is cleaned up, so an agentic model's stray writes cannot pollute the repo.
 
@@ -45,3 +46,4 @@ Current state:
 | `sweep-stats-ci.vitest.ts` | 19 | Dependency-free stats: MAD noise floor, quantiles, seeded paired-delta bootstrap CI, verdict gates. |
 | `dispatch-envelope.vitest.ts` | 18 | Normalized dispatch envelope (latency, nullable tokens/cost, OpenCode JSON-stream usage parsing). |
 | `sweep-isolation.vitest.ts` | 15 | Per-cell cwd is under `os.tmpdir()` (not repo root), holds the prompt file, is cleaned up after single + multi-cell sweeps, and a simulated model write does not leak; plus fixture-shape + profile-load coverage for the hard / validation fixture packs. |
+| `d4-agreement.vitest.ts` |  | Offline D4 agreement measurement: the zero-call census, the label gate, the keep rule and both arms on stub backends. |
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.18.0.0.md b/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.18.0.0.md
new file mode 100644
index 0000000000..19579f8005
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/changelog/v1.18.0.0.md
@@ -0,0 +1,26 @@
+---
+title: "deep-improvement v1.18.0.0"
+description: "The benchmark runner now refuses an unknown grader kind at startup, and a new script measures hallucination graders against operator labels without a model call by default."
+trigger_phrases:
+  - "deep-improvement v1.18.0.0"
+  - "deep-improvement 1.18.0.0"
+  - "unknown grader startup check"
+  - "offline hallucination grader measurement"
+importance_tier: "normal"
+contextType: "general"
+version: 1.18.0.0
+---
+
+A mistyped `--grader` value used to score with the mock stub and print nothing, so a benchmark report could carry fake hallucination numbers. This release turns that into a startup error. It also adds an offline script that tests whether the deterministic check, the local Deem grader or Jev agrees with operator labels on benchmark outputs.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader` (Level 1)
+
+## What's New at a Glance
+
+- **An unknown grader kind stops the run.** `run-benchmark.cjs` exits 2 before any profile loads when `--grader` is not `noop`, `mock` or `llm`, and it names the value and prints the usage line. `buildGraderFn` throws for the same values instead of returning the mock stub. `/deep:model-benchmark` already rejected other values, so its users see no change.
+- **Hallucination graders can be measured offline.** `scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` matches benchmark outputs to their fixtures, counts the operator's labels and prints the deterministic baseline with the fixed keep rule. By default it makes no model call and writes no file.
+- **Two opt-in arms test a model against that baseline.** `--deem` asks the local Deem server and `--jev` asks Jev, each only after its own checks pass and once 30 outputs carry labels, at least 5 in each class. Each switch needs `--out <dir>`, records every call and prints one `verdict` line. A Jev run on untracked outputs also needs `--accept-payload`.
+
+## Upgrade
+
+No migration required. A script that passed any other grader kind to `run-benchmark.cjs` now exits 2 and must pass `noop`, `mock` or `llm`.
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
index ffb0c777610..614761d9810 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md
@@ -28,7 +28,7 @@ The skill runs two lanes through one agent. Each category and feature below is t
 |---|---:|---|---|
 | Evaluation loop | 7 features | Lane A | `.skilled/commands/deep/agent-improvement.md`, deep-improvement YAML workflows, `scripts/*.cjs` |
 | Integration scanning | 3 features | Lane A | `scan-integration.cjs`, `/deep:agent-improvement`, `.skilled/agents/deep-improvement.md` |
-| Scoring system | 4 features | Shared | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs` |
+| Scoring system | 5 features | Shared | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `scorer/score-d4-agreement.cjs` |
 | Model-benchmark mode | 5 features | Lane B | `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `scorer/score-model-variant.cjs` |
 
 ---
@@ -209,7 +209,7 @@ See [`integration-scanning/command-dispatch.md`](../feature-catalog/integration-
 
 **Lane:** Shared (Lane A scores candidates, Lane B can opt into the same 5-dim scorer)
 
-These entries describe the dynamic scoring stack that derives evaluation structure from the target agent, applies the five-dimension rubric, records deterministic score outputs, and turns repeated runs into dimensional progress and stop-state summaries.
+These entries describe the dynamic scoring stack that derives evaluation structure from the target agent, applies the five-dimension rubric, records deterministic score outputs, and turns repeated runs into dimensional progress and stop-state summaries. The last entry covers the offline check of hallucination graders against operator labels.
 
 ### Five-dimension rubric
 
@@ -275,6 +275,22 @@ See [`scoring-system/dimensional-progress.md`](../feature-catalog/scoring-system
 
 ---
 
+### Hallucination grader agreement
+
+#### Description
+
+Measures offline how well the deterministic hallucination check and a Deem or Jev grader agree with operator labels on benchmark outputs.
+
+#### How It Works
+
+`scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` matches benchmark outputs to their fixtures, counts the operator's labels and prints the `hallucination-flag` baseline with a fixed keep rule, with no model call by default. `--deem` and `--jev` each add a model arm that runs only after its own checks pass and once 30 outputs carry labels, at least 5 in each class, and a finished arm prints one `verdict` line.
+
+#### Source Files
+
+See [`scoring-system/hallucination-grader-agreement.md`](../feature-catalog/scoring-system/hallucination-grader-agreement.md) for full implementation and validation file listings.
+
+---
+
 ## 5. MODEL-BENCHMARK MODE
 
 **Lane:** Lane B (model-benchmark)
@@ -321,7 +337,7 @@ Selects the pattern matcher by default or the opt-in five-dimension scorer for m
 
 #### How It Works
 
-`run-benchmark.cjs --scorer pattern` is the default byte-identical heading and pattern matcher, while `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer. `--grader noop` is the default deterministic grader with no model dispatch, with `--grader mock` and `--grader llm` selecting the stub or real grader, and the report carries `scoringMethod: pattern` or `scoringMethod: 5dim`.
+`run-benchmark.cjs --scorer pattern` is the default byte-identical heading and pattern matcher, while `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer. `--grader noop` is the default deterministic grader with no model dispatch, with `--grader mock` and `--grader llm` selecting the stub or real grader, and the report carries `scoringMethod: pattern` or `scoringMethod: 5dim`. Any other `--grader` value exits 2 before a profile loads.
 
 #### Source Files
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md
index bd4130ded52..683df5d0685 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md
@@ -26,7 +26,7 @@ This feature controls how `run-benchmark.cjs` judges materialized outputs. It ke
 
 `run-benchmark.cjs --scorer pattern` is the default. It uses the byte-identical heading and pattern matcher, so a run with no scorer flag produces the same deterministic result as before. `--scorer 5dim` is opt-in: it routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer that combines deterministic checks with a pluggable grader.
 
-Grader selection is separate from scorer selection. `--grader noop` is the default and stays deterministic with no model dispatch. `--grader mock` selects the stub grader and `--grader llm` selects the real grader. The benchmark report and the `benchmark_run` record carry `scoringMethod: pattern` or `scoringMethod: 5dim`, so downstream consumers can attribute each result to the scorer that produced it.
+Grader selection is separate from scorer selection. `--grader noop` is the default and stays deterministic with no model dispatch. `--grader mock` selects the stub grader and `--grader llm` selects the real grader. Any other value exits 2 with the usage line before a profile loads, so a mistyped kind can no longer score with the stub. The benchmark report and the `benchmark_run` record carry `scoringMethod: pattern` or `scoringMethod: 5dim`, so downstream consumers can attribute each result to the scorer that produced it.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md
new file mode 100644
index 0000000000..dd840a1ab4
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/feature-catalog/scoring-system/hallucination-grader-agreement.md
@@ -0,0 +1,70 @@
+---
+title: "Hallucination grader agreement"
+description: "Measures offline how well the deterministic hallucination check and a Deem or Jev grader agree with operator labels on benchmark outputs."
+trigger_phrases:
+  - "hallucination grader agreement"
+  - "score-d4-agreement.cjs"
+  - "measure d4 grader against labels"
+  - "offline hallucination grader test"
+version: 1.18.0.0
+---
+
+# Hallucination grader agreement (score-d4-agreement.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Measures offline how well the deterministic hallucination check and a Deem or Jev grader agree with operator labels on benchmark outputs.
+
+The 5-dimension scorer takes D4, the hallucination dimension, from its grader, and the runner's default `noop` grader returns a fixed 1.0. This script tests whether any grader earns that slot before one is wired in. It never changes a benchmark score, and by default it makes no model call and writes no file.
+
+---
+
+## 2. HOW IT WORKS
+
+### Census and Baseline
+
+`score-d4-agreement.cjs --outputs <dir>` lists the `<id>.md` and `<id>.run<k>.md` outputs of a benchmark run and matches each to the fixture whose `id` is `<id>`, in `assets/model-benchmark/benchmark-fixtures/` unless `--fixtures <dir>` names another set. `--labels <file>` reads one JSON line per output, `{"output": "<file name>", "hallucinated": "yes"}` or `"no"`, which only the operator writes. The script prints the output, matched, unmatched and allowlist counts and the labeled count by class.
+
+It then runs the unchanged `deterministic/hallucination-flag.cjs` on each labeled output against its fixture's `allowlist`, counting a score below 1.0 as `yes`. The baseline is that check or the majority class, whichever is right more often.
+
+### Label Gate and Keep Rule
+
+The script prints the question every grader answers, the 0.10 margin, the keep rule and the power note, so a verdict can be rechecked by hand. Below 30 labeled outputs, or below 5 in either class, it prints a `stop:` line and asks no grader a question. When the baseline is already right on more than 90 percent of the labels it prints `no headroom`. Otherwise it prints the planned calls for each arm.
+
+### Deem and Jev Arms
+
+`--deem` checks `cli-deem health`, then asks the local Deem server one `noul` question per labeled output, so nothing leaves the machine. `--jev` checks the Jev client's version and credential, then asks each question three times so unstable answers count as flips. It sends the outputs and the fixture task text off the machine, so an untracked output also needs `--accept-payload`.
+
+Each switch needs `--out <dir>`. It prints the planned calls before the first one, records every call in `calls.jsonl` and writes `report.json`. A failed check or a closed label gate prints a `<backend> arm skipped:` line instead. A finished arm prints one `verdict <backend>:` line with `keep`, `kill` or `stop` and its reason. An answer that is not a number from 0 to 1 counts as unmeasured and never as a score.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Script | Runs the census, the deterministic baseline, the label gate and the opt-in Deem and Jev arms. |
+| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs` | Script | The unchanged deterministic check behind the baseline. |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Vitest | Covers the census, labels, baseline, keep rule, both gates and both arms against stub `cli-deem` and `jev` binaries. |
+| `.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md` | Manual playbook | Checks the unknown-grader exit, the zero-call census and a stub-backend skip. |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Scoring system
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `scoring-system/hallucination-grader-agreement.md`
+
+Related references:
+- [deterministic-scoring.md](../../feature-catalog/scoring-system/deterministic-scoring.md) - Deterministic scoring
+- [opt-in-5dim-scorer.md](../../feature-catalog/model-benchmark-mode/opt-in-5dim-scorer.md) - Opt-in 5-dimension scorer
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
index 1a90c6b7576..05b02805204 100644
--- a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/manual-testing-playbook.md
@@ -113,7 +113,7 @@ Release passes only when:
 
 1. No feature verdict is `FAIL`.
 2. Closure-wave scenarios RT-022..RT-031 (runtime-truth), CP-032..037 (agent-discipline stress), MB-038..042 plus MB-R01 and MB-049 (model-benchmark), E2E-050 (accept/ship promotion), and DI-R01..DI-R07 plus DI-R10 (intra-routing recall) have all been executed or explicitly skipped with a named blocker.
-3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`). The deep-improvement subtotal is 45 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, and the reviewer regression `MB-R01`) and 8 intra-routing-recall scenarios (`DI-R01..DI-R07` plus `DI-R10`).
+3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`). The deep-improvement subtotal is 46 numbered scenarios (`IS-001..MB-042` plus MB-049, E2E-050, 5D-051, and the reviewer regression `MB-R01`) and 8 intra-routing-recall scenarios (`DI-R01..DI-R07` plus `DI-R10`).
 4. No unresolved blocking triage item remains.
 5. Drift between root summaries and per-feature files has been resolved, with the per-feature file treated as the temporary source of truth until resynchronized.
 
@@ -249,7 +249,7 @@ Expected signals: File `/tmp/test-profile.json` is created after the command com
 
 ## 9. 5-DIMENSION SCORER
 
-This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.
+This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.
 
 ### 5D-009 | Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)
 
@@ -290,6 +290,19 @@ Expected signals: Exit code is 1 (not 0); Output is valid JSON (no stack trace);
 #### Test Execution
 > **Feature File:** [5D-011](../manual-testing-playbook/five-d-scorer/missing-candidate.md)
 
+### 5D-051 | Unknown Grader Exit and Zero-Call D4 Census
+
+#### Description
+`run-benchmark.cjs` refuses an unknown `--grader` value before any profile loads, and `score-d4-agreement.cjs` prints its census without a model call and skips a stub backend by name.
+
+#### Scenario Contract
+Prompt summary: As a manual-testing orchestrator, validate that an unknown grader kind stops the benchmark runner at startup, that the D4 agreement census makes no model call and that a stub Deem backend is skipped by name. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.
+
+Expected signals: The runner exits 2 and names `'jev'` with the usage line. The plain census exits 0 with `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs` and calls no stub. The `--deem` run adds only `deem arm skipped: stub backend`.
+
+#### Test Execution
+> **Feature File:** [5D-051](../manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md)
+
 ---
 
 ## 10. BENCHMARK INTEGRATION
diff --git a/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md
new file mode 100644
index 0000000000..d5018665ad
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/deep-improvement/manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md
@@ -0,0 +1,104 @@
+---
+title: "5D-051 -- Unknown Grader Exit and Zero-Call D4 Census"
+description: "This scenario validates Unknown Grader Exit and Zero-Call D4 Census for `5D-051`. It focuses on the startup refusal of an unknown grader kind and the zero-call census of the hallucination grader agreement script."
+feature_id: "5D-051"
+category: "5D Scorer"
+version: 1.18.0.0
+---
+
+# 5D-051 -- Unknown Grader Exit and Zero-Call D4 Census
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `5D-051`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates Unknown Grader Exit and Zero-Call D4 Census for `5D-051`. It focuses on the startup refusal of an unknown grader kind and the zero-call census of the hallucination grader agreement script.
+
+### Why This Matters
+
+An unknown `--grader` value once scored with the mock stub and printed nothing, so a report could carry fake D4 numbers. The agreement script must also never reach a model unless a switch asks for one, and a backend that fails its own check must be skipped with a named reason.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `5D-051` and confirm the expected signals without contradictory evidence.
+
+- Objective: Confirm that an unknown grader kind stops the runner at startup, that the D4 census makes no model call and that a stub backend is skipped by name.
+- Real user request: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`
+- Prompt: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`
+- Expected execution process: Run the runner with `--grader jev` against a missing profile, then run the census on one output per fixture with stub `cli-deem` and `jev` binaries first on `PATH`, once plain and once with `--deem`.
+- Expected signals: The runner exits 2 and names `'jev'` with the usage line. The plain census exits 0, prints `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs`, and leaves `/tmp/5d-051/calls.log` absent. The `--deem` run adds only `deem arm skipped: stub backend`.
+- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive lines from each run.
+- Pass/fail: PASS if all three runs print their expected lines with the expected exit codes, FAIL if the runner accepts `jev`, the plain census calls a stub or the `--deem` run asks the stub a question.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Check that a mistyped grader stops the benchmark and that the D4 census never calls a model by default.`
+
+### Commands
+
+Run from the repository root.
+
+1. `rm -rf /tmp/5d-051 && mkdir -p /tmp/5d-051/bin /tmp/5d-051/outputs`
+2. `node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs --profile /tmp/5d-051/no-such-profile.json --outputs-dir /tmp/5d-051/outputs --output /tmp/5d-051/report.json --scorer 5dim --grader jev; echo "exit=$?"`
+3. `printf '#!/bin/sh\necho "cli-deem $*" >> /tmp/5d-051/calls.log\n[ "$1" = health ] && echo "{\\"backend\\":\\"stub\\"}"\nexit 0\n' > /tmp/5d-051/bin/cli-deem && printf '#!/bin/sh\necho "jev $*" >> /tmp/5d-051/calls.log\nexit 3\n' > /tmp/5d-051/bin/jev && chmod +x /tmp/5d-051/bin/*`
+4. `for f in .skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/*.json; do id=$(node -p "require('./$f').id || '$(basename "$f" .json)'"); printf '# Output\n' > "/tmp/5d-051/outputs/$id.md"; done`
+5. `PATH=/tmp/5d-051/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs /tmp/5d-051/outputs > /tmp/5d-051/census.txt; echo "exit=$?"; cat /tmp/5d-051/census.txt; ls /tmp/5d-051/calls.log`
+6. `PATH=/tmp/5d-051/bin:$PATH node .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs /tmp/5d-051/outputs --deem --out /tmp/5d-051/deem > /tmp/5d-051/deem.txt; echo "exit=$?"; diff /tmp/5d-051/census.txt /tmp/5d-051/deem.txt; cat /tmp/5d-051/calls.log`
+
+### Expected
+
+Step 2 prints `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the `Usage: node run-benchmark.cjs --profile` line, then `exit=2`, and writes no `/tmp/5d-051/report.json`. Step 5 prints `exit=0`, `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs`, and `ls` reports that `/tmp/5d-051/calls.log` does not exist. Step 6 prints `exit=0`, the diff shows one added line, `deem arm skipped: stub backend`, and `calls.log` holds exactly one line, `cli-deem health`.
+
+### Evidence
+
+The terminal transcript of steps 2, 5 and 6, `/tmp/5d-051/census.txt`, `/tmp/5d-051/deem.txt`, `/tmp/5d-051/calls.log` and `/tmp/5d-051/deem/report.json`.
+
+### Pass / Fail
+
+- **Pass**: every expected line appears with the stated exit code, and `calls.log` holds only the health check.
+- **Fail**: step 2 exits 0 or writes a report, step 5 creates `calls.log` or step 6 logs a `noul` call.
+
+### Failure Triage
+
+If step 2 exits 0, check the `VALID_GRADERS` guard in `run-benchmark.cjs` and confirm it runs before the profile loads. If step 5 creates `calls.log`, find which code path spawns a backend without `--deem` or `--jev`. If step 6 shows a different skip reason, run `/tmp/5d-051/bin/cli-deem health` by hand and compare its output with the health checks in `score-d4-agreement.cjs`. If `allowlist` is not `0 of 21`, count the fixture files and their `allowlist` keys again, because the fixture set may have changed.
+
+### Optional Supplemental Checks
+
+Run step 6 again with `--jev --out /tmp/5d-051/jev` in place of `--deem --out /tmp/5d-051/deem`. The stub `jev` answers `--version` with nothing, so the diff shows the `jev: path=` identity line, then `jev arm skipped: version` and a `jev: found=""` line, and `calls.log` gains only `jev --version`.
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
+| `../../feature-catalog/scoring-system/hallucination-grader-agreement.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `../../scripts/model-benchmark/run-benchmark.cjs` | Refuses an unknown `--grader` value before any profile loads |
+| `../../scripts/model-benchmark/scorer/score-d4-agreement.cjs` | Runs the census, the label gate and the opt-in Deem and Jev arms |
+| `../../scripts/model-benchmark/tests/d4-agreement.vitest.ts` | Automated census, gate and arm coverage against stub binaries |
+| `../../scripts/model-benchmark/tests/run-benchmark-hardening.vitest.ts` | Automated coverage of the unknown-grader exit |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: 5D Scorer
+- Playbook ID: 5D-051
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `five-d-scorer/unknown-grader-and-d4-census.md`
```
