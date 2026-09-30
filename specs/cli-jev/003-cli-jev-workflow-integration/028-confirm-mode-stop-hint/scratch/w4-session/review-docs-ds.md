# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/SKILL.md`
- `.skilled/skills/system-deep-loop/runtime/README.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/README.md`
- `.skilled/skills/system-deep-loop/runtime/changelog/v1.7.0.0.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). The code (the script and its test) passed its own review by Pi MiMo; this review covers the eight docs. Read the script only to check the docs against it. The versions and IDs follow orchestrator ruling 2 (runtime changelog v1.7.0.0, F057, DLR-057, read after phase 027's commit), not the design's v1.5.0.2 and F056. The hub SKILL.md version stays 3.0.1.0 (ruling 3). The docs sit beside phase 027's stop-rater entries in the same files; check only this phase's additions. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-deep-loop/SKILL.md b/.skilled/skills/system-deep-loop/SKILL.md
index cedbd87bdc..4d299ba668 100644
--- a/.skilled/skills/system-deep-loop/SKILL.md
+++ b/.skilled/skills/system-deep-loop/SKILL.md
@@ -108,7 +108,7 @@ system-deep-loop/
 Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature-catalog/`, or `manual-testing-playbook/` as applicable, with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`); its legacy public surfaces (the `/deep:ai-council` command and the `ai-council` agent) intentionally keep the shorter `ai-council` key, so always resolve the packet path through `mode-registry.json` rather than hardcoding it.
 
 ### Backend
-All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The runtime never gains an `improvement` loopType — improvement stays host-driven.
+All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The offline stop-hint replay at `runtime/scripts/score-stop-hint.cjs` reads one stop-rater report and says whether a replayed stop would have made a good confirm-mode hint, makes no model call in any column and changes no gate. The runtime never gains an `improvement` loopType — improvement stays host-driven.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/README.md b/.skilled/skills/system-deep-loop/runtime/README.md
index 1297b99ccd..ad396af2b1 100644
--- a/.skilled/skills/system-deep-loop/runtime/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/README.md
@@ -47,6 +47,7 @@ Generated dependencies under `node_modules/` and repository metadata directories
 
 Consumers import domain behavior from `lib/` or invoke a documented script from `scripts/`. The mode workflows own user-facing orchestration and pass durable inputs into this runtime.
 The stop-rater replay at `scripts/score-stop-rater.cjs` makes no model call by default and opens its two rating arms only behind the `--jev` and `--deem` switches.
+The stop-hint replay script `scripts/score-stop-hint.cjs` takes the `--rater-report <dir>` input, the `--jev` and `--deem` column switches and the `--out <dir>` output, makes no model call and leaves the gate unchanged.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/README.md b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
index dbb2706704..96fa04dcc4 100644
--- a/.skilled/skills/system-deep-loop/runtime/scripts/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
@@ -49,6 +49,7 @@ The `lib/` child contains CLI-only guards and writer-lock helpers.
 | `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
 | `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
 | `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
+| `score-stop-hint.cjs` | Replays one stop-rater report offline and prints per-column hint counts and one Keep-Rule verdict per column past its label gate, with no model call in any mode. The `--rater-report <dir>` switch names the report to read, `--jev` and `--deem` add the rater's recorded columns, and `--out <dir>` writes the run's report. |
 | `score-stop-rater.cjs` | Replays recorded deep-research stop decisions offline against gold derived from the delta files, with no model call by default. The `--jev` and `--deem` switches open a rating arm and `--gold-reads <file>` supplies the confirmed reads that gate it. |
 | `status.cjs` | Reports session-scoped graph health and stored row counts. |
 | `synthesis-closeout.cjs` | Checks a finished research or review synthesis against its iteration state, including lineage logs, and stages the completion event for the gateway. |
diff --git a/.skilled/skills/system-deep-loop/runtime/changelog/v1.7.0.0.md b/.skilled/skills/system-deep-loop/runtime/changelog/v1.7.0.0.md
new file mode 100644
index 0000000000..7c7470cb31
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/changelog/v1.7.0.0.md
@@ -0,0 +1,31 @@
+---
+title: "deep-loop-runtime v1.7.0.0"
+description: "v1.7.0.0 adds an offline evaluator that reads one stop-rater report and scores whether each recorded stop would have made a good confirm-mode hint. It calls no model and changes no gate."
+trigger_phrases:
+  - "deep-loop-runtime v1.7.0.0"
+  - "deep-loop-runtime 1.7.0.0"
+  - "confirm-mode stop hint"
+  - "offline stop-hint replay"
+importance_tier: "normal"
+contextType: "general"
+version: 1.7.0.0
+---
+v1.7.0.0 adds `score-stop-hint.cjs`, an offline evaluator that reads one stop-rater report and scores whether each recorded stop would have made a good confirm-mode hint, plus the unit tests behind that score. It spawns no process and calls no model in any mode, so the measurement runs on any machine with no credential. It changes no gate and no live loop.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint` (Level 1)
+
+## Why This Release
+
+The deep-research confirm mode wants to suggest stopping when a loop has found its last new cited source. The suggestion is only worth showing when a replayed stop would have hinted right, and the tracked stop-rater reports already hold every recorded stop with the gold to measure it against. `score-stop-hint.cjs` replays those records offline and answers the question with no model call and no change to any gate.
+
+## What's New at a Glance
+
+- **The default run makes no model call.** `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir>` reads one stop-rater report and scores it offline. `--jev` and `--deem` only add the rater's recorded `jev` and `deem` columns to the `legacy` and `sources` columns every report carries, and with logging stubs for `jev` and `cli-deem` first on `PATH` no stub logged a call.
+- **A stop scores as a hint against gold.** A column's recorded stop is a hint only when it lands strictly before the lineage's recorded last iteration. A hint at or after the gold iteration is right and saves the iterations from the hint to the last, and a hint before gold is wrong and saves nothing.
+- **A kept column earns the stop hint.** A run past the gate prints one fixed keep rule first, covering coverage, loss, precision, savings, a sign test and, for `jev` alone, flips. It stores a kept column's hint as `**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>`, where `<t>` stays literal for the live gate to fill in.
+- **`--out <dir>` records the measurement.** Past the gate a run writes `report.json` in the named directory, and it exits 2 when `--out` names the report's own folder since a run must never overwrite the report it reads. A run stopped at the gate writes nothing even when `--out` is given.
+- **No run has printed a verdict.** Every real run on a recorded stop-rater report stops at `stop: rater report has no confirmed gold`, so the per-column verdict lines are known only from the test fixtures.
+
+## Upgrade
+
+No migration required. The script is new and changes no gate and no live loop.
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md
new file mode 100644
index 0000000000..cc2f863933
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md
@@ -0,0 +1,84 @@
+---
+title: "Stop-hint replay"
+description: "Replays one stop-rater report offline and scores whether each recorded stop would have made a good confirm-mode hint."
+trigger_phrases:
+  - "stop-hint replay"
+  - "stop-hint-replay"
+  - "score-stop-hint.cjs"
+  - "stop-hint replay runtime"
+  - "scoring stop-hint replay"
+version: 1.7.0.0
+---
+
+# Stop-hint replay (score-stop-hint.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+---
+
+## 1. OVERVIEW
+
+Replays one stop-rater report offline and scores whether each recorded stop would have made a good confirm-mode hint.
+
+Run with `node` from the repository root, `scripts/score-stop-hint.cjs` reads the report under `--rater-report <dir>` and prints a hint count and one Keep-Rule verdict per column. The default run makes no model call and writes no file, and it changes no gate and no live loop. The supported invocation is `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]`.
+
+This feature belongs to the scoring group and is catalogued as F057 in the `runtime/` inventory.
+
+---
+
+## 2. HOW IT WORKS
+
+### Hints and Columns
+
+The script reads one stop-rater report, the `report.json` that `scripts/score-stop-rater.cjs --out <dir>` writes. It spawns no process and calls no model in any mode. The default run scores `legacy` and `sources`, the two columns every report carries, and `--jev` and `--deem` add the rater's recorded `jev` and `deem` columns. A model column needs no `--out`, since no call is made.
+
+A column's recorded stop is a hint only when it lands strictly before the lineage's recorded last iteration. A hint at or after the gold iteration is right and saves the iterations from the hint to the last. A hint before gold is wrong and saves nothing. A lineage with no recorded stop for a column leaves that lineage unmeasured for that column. A requested model column the rater skipped, stopped or never recorded prints `jev column skipped: rater report has none` or the `deem` form instead of that column's lines.
+
+### Label Gate and Keep Rule
+
+A run on a report whose label gate did not pass prints `stop: rater report has no confirmed gold` and exits 0 before any other line. Nothing is written even when `--out` is given. Past the gate the keep rule line prints first so every verdict can be rechecked by hand:
+
+```
+keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
+```
+
+Each column prints `column <name>: measured <M> hints <n> right <W> wrong <L> no hint <n> saved <n>` and then its verdict line `verdict <name>: <keep|kill|stop (coverage)|stop (precision)|stop (savings)|stop (sign test)|stop (flips)> K=<n> M=<n> W=<n> L=<n> saved=<n> p=<p> report=<first 12 hex of the report's SHA-256>`. The columns print in the order `legacy`, `sources`, `jev`, `deem`. The first failed check decides the outcome in the order the rule prints: coverage, kill, precision, savings, sign test, then flips for `jev` alone. A kill prints its loss tail and every other outcome its win tail. A model column's verdict carries the rater identity the report recorded: `jev_version`, `provider` and `model` for `jev`, `model`, `model_commit` and `source_commit` for `deem`.
+
+### Stored Report and the Hint Line
+
+With `--out <dir>` a run past the gate writes `<dir>/report.json` holding every verdict line and, for each kept column, the stored hint `**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>`. The `<t>` stays literal for the live gate to fill. A run stopped at the gate writes nothing. A model column whose stored rater identity changed prints `requalify: rater changed` before its verdict.
+
+Refusals exit 2 before any output line. A run without `--rater-report` prints `--rater-report <dir> is required`. A missing report prints `rater report not found: <dir>/report.json`, a report that is not JSON prints `rater report is not JSON: <path>`, one without a lineage list prints `rater report has no lineage list: <path>`, and a lineage without numeric gold and last iteration prints `rater report lineage <i> is missing gold or lastIteration`. An `--out` naming the report's own folder prints `--out <dir> would overwrite the rater report: <dir>/report.json`. An unknown switch prints node's own parser message.
+
+The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `scripts/score-stop-hint.cjs` | Script | Offline replay of one stop-rater report, the hint counts, one Keep-Rule verdict per column and the stored report. |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `tests/unit/score-stop-hint.vitest.ts` | Vitest | Covers the report reader, the hint rule, column skips, the Keep Rule verdicts, the requalify line and the stored report against fixture reports and stub `cli-deem` and `jev` binaries. |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Scoring
+- Canonical catalog source: `feature-catalog.md`
+- Feature ID: F057
+- Feature file path: `scoring/stop-hint-replay.md`
+- Primary sources: `scripts/score-stop-hint.cjs`, `tests/unit/score-stop-hint.vitest.ts`
+
+Related references:
+- [bayesian-scorer.md](bayesian-scorer.md) - Bayesian scorer
+- [convergence-score-delta.md](convergence-score-delta.md) - Convergence score-delta
+- [stop-rater-replay.md](stop-rater-replay.md) - Stop-rater replay
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
index 9429457843..3904ce2c25 100644
--- a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
@@ -16,7 +16,7 @@ This document combines the current feature inventory for the `runtime/` skill in
 
 ## 1. OVERVIEW
 
-Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 55 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
+Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 56 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
 
 | Category | Coverage | Primary Surfaces |
 |---|---:|---|
@@ -24,7 +24,7 @@ Use this catalog as the canonical inventory for the live `runtime/` feature surf
 | [prompt-rendering](../feature-catalog/prompt-rendering) | 1 features | `lib/deep-loop/prompt-pack.ts` |
 | [validation](validation/) | 3 features | `lib/deep-loop/post-dispatch-validate.ts`, `.skilled/plugins/system-deep-loop-guard.js` |
 | [state-safety](../feature-catalog/state-safety) | 13 features | `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, `lib/deep-loop/loop-lock.ts`, `lib/deep-loop/permissions-gate.ts` |
-| [scoring](scoring/) | 3 features | `lib/deep-loop/bayesian-scorer.ts`, `scripts/score-stop-rater.cjs` |
+| [scoring](scoring/) | 4 features | `lib/deep-loop/bayesian-scorer.ts`, `scripts/score-stop-rater.cjs` |
 | [coverage-graph](../feature-catalog/coverage-graph) | 6 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
 | [script-entry-points](../feature-catalog/script-entry-points) | 5 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |
 | [council](council/) | 5 features | `lib/council/multi-seat-dispatch.cjs`, `lib/council/round-state-jsonl.cjs`, `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `lib/council/session-state-hierarchy.cjs` |
@@ -441,6 +441,22 @@ See [`scoring/stop-rater-replay.md`](../feature-catalog/scoring/stop-rater-repla
 
 ---
 
+### Stop-hint replay
+
+#### Description
+
+Replays one stop-rater report offline and scores whether each recorded stop would have made a good confirm-mode hint.
+
+#### How It Works
+
+`score-stop-hint.cjs` reads the report under `--rater-report <dir>` and prints a hint count and one Keep-Rule verdict per column, with the keep rule line first so every verdict can be rechecked by hand. The default run scores `legacy` and `sources` and writes no file, `--jev` and `--deem` add the rater's recorded `jev` and `deem` columns, `--out <dir>` writes `<dir>/report.json`, and no run calls a model.
+
+#### Source Files
+
+See [`scoring/stop-hint-replay.md`](../feature-catalog/scoring/stop-hint-replay.md) for full implementation and validation file listings.
+
+---
+
 ## 7. COVERAGE GRAPH
 
 These entries cover the session-scoped SQLite graph store, graph read models, convergence signals, snapshots, and momentum.
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md
new file mode 100644
index 0000000000..d54cd0d25f
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/stop-hint-replay.md
@@ -0,0 +1,138 @@
+---
+title: "DLR-057 -- Stop-hint replay"
+description: "Manual validation scenario for Stop-hint replay in the runtime/ skill."
+version: 1.7.0.0
+---
+
+# DLR-057 -- Stop-hint replay
+
+This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-057`.
+
+---
+
+## 1. OVERVIEW
+
+Adds `scripts/score-stop-hint.cjs`, an offline replay of one stop-rater report that scores its recorded stops as confirm-mode hints and changes no gate and no live loop. A run reads one `report.json`, makes no model call in any mode, and writes nothing unless `--out` asks for a report. `--jev` and `--deem` add the rater's recorded model columns to the two columns every report carries, `legacy` and `sources`.
+
+### Why This Matters
+
+The replay must stay offline in every mode, a refusal must name its reason before any output line, and a report whose gold the rater never confirmed must end at one stop line with no write. Logging stubs first on `PATH` prove no run calls anything, and the two gate shapes prove the stop line is the accepted end state when no confirmed gold exists.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+- Objective: Confirm the stop-hint replay refuses a report it cannot score with exit 2 and a named reason on stderr, stops at the gate stop with one line and no write, skips a model column the rater recorded none of without changing the rest of its output, and makes no model call in any mode.
+- Layer partition: scoring runtime.
+- Real user request: `Run the stop-hint replay on the fixture reports with logging stubs first on PATH and confirm the refusals name their reason on stderr, the gate stop prints one line and writes nothing, the missing model columns skip by name without changing the rest, no stub is called, and the suite passes.`
+- Expected signals: `rater report not found: /tmp/dlr-057/empty/report.json` and `rater report is not JSON: /tmp/dlr-057/broken/report.json` on stderr with empty stdout and exit 2, `stop: rater report has no confirmed gold` as the whole stdout with exit 0 in both gate shapes, the keep rule line first on every run past the gate, `jev column skipped: rater report has none` and `deem column skipped: rater report has none` as the only difference between the default and the `--jev --deem` runs, no stub log file after any run, `git status --porcelain` unchanged, and 28 passing tests.
+- Pass/fail: PASS if every run prints its expected lines with the stated exit code and the stub logs stay absent in every run. FAIL if a refusal exits 0 or leaves stdout non-empty, the gate stop writes a file or prints anything besides its one line, a skip run changes anything besides its two skip lines, a stub log appears, the working tree changes, or a test fails.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prerequisites
+
+- Working directory is repository root.
+- `runtime/` source tree is present.
+- Feature catalog entry exists at `feature-catalog/scoring/stop-hint-replay.md`.
+- `node`, `git` and `npx` are available on the PATH.
+
+### Prompt
+
+- Prompt: `Run the stop-hint replay on the fixture reports with logging stubs first on PATH and confirm the refusals name their reason on stderr, the gate stop prints one line and writes nothing, the missing model columns skip by name without changing the rest, no stub is called, and the suite passes.`
+
+### Commands
+
+Run from the repository root.
+
+1. `rm -rf /tmp/dlr-057 && mkdir -p /tmp/dlr-057/bin /tmp/dlr-057/stop /tmp/dlr-057/nogate /tmp/dlr-057/good /tmp/dlr-057/empty /tmp/dlr-057/broken`
+2. `printf '#!/bin/sh\necho "$*" >> /tmp/dlr-057/jev.log\nexit 0\n' > /tmp/dlr-057/bin/jev && printf '#!/bin/sh\necho "$*" >> /tmp/dlr-057/cli-deem.log\nexit 0\n' > /tmp/dlr-057/bin/cli-deem && chmod +x /tmp/dlr-057/bin/jev /tmp/dlr-057/bin/cli-deem`
+3. `node -e 'const fs=require("fs");const w=(p,o)=>fs.writeFileSync(p,JSON.stringify(o,null,2)+"\n");const mk=(gate)=>({gate,lineages:[{gold:2,lastIteration:5,stops:{legacy:1,sources:2}},{gold:4,lastIteration:6,stops:{legacy:3,sources:3}}]});w("/tmp/dlr-057/stop/report.json",mk({label:{passed:false}}));w("/tmp/dlr-057/nogate/report.json",mk({label:null}));const L=[];for(let i=0;i<20;i+=1)L.push({gold:2,lastIteration:5,stops:{legacy:1+(i%3),sources:2}});w("/tmp/dlr-057/good/report.json",{gate:{label:{passed:true}},lineages:L})' && printf '{' > /tmp/dlr-057/broken/report.json`
+4. `git status --porcelain > /tmp/dlr-057/porcelain.before`
+5. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/empty > /tmp/dlr-057/missing.txt 2> /tmp/dlr-057/missing.err; echo "exit=$?"; cat /tmp/dlr-057/missing.err`
+6. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/broken > /tmp/dlr-057/broken.txt 2> /tmp/dlr-057/broken.err; echo "exit=$?"; cat /tmp/dlr-057/broken.err`
+7. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/stop > /tmp/dlr-057/stop.txt 2> /tmp/dlr-057/stop.err; echo "exit=$?"; cat /tmp/dlr-057/stop.txt`
+8. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/nogate > /tmp/dlr-057/nogate.txt 2> /tmp/dlr-057/nogate.err; echo "exit=$?"; diff /tmp/dlr-057/stop.txt /tmp/dlr-057/nogate.txt`
+9. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good > /tmp/dlr-057/default.txt 2> /tmp/dlr-057/default.err; echo "exit=$?"; head -n 1 /tmp/dlr-057/default.txt`
+10. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good --jev --deem > /tmp/dlr-057/skip.txt 2> /tmp/dlr-057/skip.err; echo "exit=$?"; diff /tmp/dlr-057/default.txt /tmp/dlr-057/skip.txt`
+11. `grep -v -e '^jev column skipped: rater report has none$' -e '^deem column skipped: rater report has none$' /tmp/dlr-057/skip.txt > /tmp/dlr-057/stripped.txt; diff /tmp/dlr-057/default.txt /tmp/dlr-057/stripped.txt`
+12. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good --jev --deem --out /tmp/dlr-057/out-good > /tmp/dlr-057/out.txt 2> /tmp/dlr-057/out.err; echo "exit=$?"; node -e 'const fs=require("fs"),c=require("crypto");const r=JSON.parse(fs.readFileSync("/tmp/dlr-057/out-good/report.json","utf8"));const d=c.createHash("sha256").update(fs.readFileSync("/tmp/dlr-057/good/report.json")).digest("hex");console.log("path",r.rater.path);console.log("sha match",r.rater.sha256===d,r.rater.sha256.length);console.log("gate",r.gate.passed);console.log("skipped",Object.keys(r.skipped).sort().join(" "))'`
+13. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/stop --jev --deem --out /tmp/dlr-057/out-stop > /tmp/dlr-057/out-stop.txt 2> /tmp/dlr-057/out-stop.err; echo "exit=$?"; cat /tmp/dlr-057/out-stop.txt; ls -d /tmp/dlr-057/out-stop`
+14. `ls /tmp/dlr-057/jev.log /tmp/dlr-057/cli-deem.log`
+15. `git status --porcelain > /tmp/dlr-057/porcelain.after; diff /tmp/dlr-057/porcelain.before /tmp/dlr-057/porcelain.after`
+16. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-stop-hint.vitest.ts`
+17. Record PASS or FAIL with rationale. Record SKIP only when a named sandbox blocker (an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential) prevents a command from running.
+
+### Expected Outcome
+
+The stop-hint replay matches the documented current reality, every expected line prints with its stated exit code, and validation evidence is reproducible.
+
+- Step 5 prints `exit=2` with empty stdout and this stderr: `rater report not found: /tmp/dlr-057/empty/report.json`.
+- Step 6 prints `exit=2` with empty stdout and this stderr: `rater report is not JSON: /tmp/dlr-057/broken/report.json`.
+- Step 7 prints `exit=0` and this stdout, the whole of it: `stop: rater report has no confirmed gold`.
+- Step 8 prints `exit=0` and its diff prints nothing, because an unarmed report stops the same way.
+- Step 9 prints `exit=0` and this first line:
+
+```
+keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
+```
+
+- Step 10 prints `exit=0` and its diff shows exactly two added lines, `jev column skipped: rater report has none` and `deem column skipped: rater report has none`.
+- Step 11 prints nothing, because removing the two skip lines leaves the run byte-identical to the one in step 9.
+- Step 12 prints `exit=0` and its report check prints:
+
+```
+path /tmp/dlr-057/good/report.json
+sha match true 64
+gate true
+skipped deem jev
+```
+
+- Step 13 prints `exit=0` and this stdout, the whole of it: `stop: rater report has no confirmed gold`, and `ls -d /tmp/dlr-057/out-stop` reports that the directory does not exist.
+- Step 14 reports that `/tmp/dlr-057/jev.log` and `/tmp/dlr-057/cli-deem.log` do not exist, because no run called a stub.
+- Step 15 prints nothing from the diff, because the working tree is unchanged.
+- Step 16 prints `exit=0` with 28 passing tests and 0 failing.
+
+### Evidence
+
+- Captured stdout, stderr and exit status for every command run in this section, including the four diff outputs.
+- The files under `/tmp/dlr-057`: `missing.err`, `broken.err`, `stop.txt`, `nogate.txt`, `default.txt`, `skip.txt`, `stripped.txt`, `out.txt`, `out-stop.txt`, `porcelain.before`, `porcelain.after`, `report.json` under `out-good`, and the absent `jev.log` and `cli-deem.log`.
+- Output from `tests/unit/score-stop-hint.vitest.ts` naming the assertions that carry the expected signals.
+- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.
+
+### Failure Triage
+
+- A stub log appears in a run that should call nothing. Find which code path spawns a process: the replay is stdlib-only and calls nothing in any mode.
+- A refusal exits 0 or prints nothing on stderr. Check `main` and `readRaterReport` in `scripts/score-stop-hint.cjs`.
+- The gate stop prints anything besides its one line, or an `--out` run writes a report for a stopped report. Check the gate stop's early return and the report write in `main`.
+- A skip run changes anything besides its two skip lines. Check `selectColumns` and the print order in `main`.
+- The report check or the test count differs from the expected lines. The fixture shape, the script or the test file changed since this scenario was recorded.
+- Evidence is inferred from memory instead of captured from current source or command output.
+
+---
+
+## 4. SOURCE FILES
+
+### Implementation
+
+| File | Role |
+|---|---|
+| `scripts/score-stop-hint.cjs` | Offline stop-hint replay: the report reader, the gate stop, the columns and the optional report write. |
+
+### Validation
+
+| File | Role |
+|---|---|
+| `tests/unit/score-stop-hint.vitest.ts` | Primary regression coverage for Stop-hint replay. |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Scoring
+- Playbook ID: DLR-057
+- Feature catalog entry: `feature-catalog/scoring/stop-hint-replay.md`
+- Scenario file path: `manual-testing-playbook/scoring/stop-hint-replay.md`
+- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
index 5acc590cbd..cf5a1c974c 100644
--- a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
@@ -36,7 +36,7 @@ Canonical package artifacts:
 
 ## 1. OVERVIEW
 
-This playbook provides 55 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
+This playbook provides 56 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
 
 ### REALISTIC TEST MODEL
 
@@ -388,7 +388,7 @@ Expected signals: Recovery marker durable (fsynced) before the torn frame is ren
 
 ## 10. SCORING
 
-This category covers 3 scenarios while the linked feature files remain the canonical execution contract.
+This category covers 4 scenarios while the linked feature files remain the canonical execution contract.
 
 ### DLR-010 | Bayesian scorer
 
@@ -435,6 +435,21 @@ Expected signals: No stub call in the default run, `stop: fewer than 5 confirmed
 
 ---
 
+### DLR-057 | Stop-hint replay
+
+#### Description
+Adds `scripts/score-stop-hint.cjs`, an offline replay of one stop-rater report that scores its recorded stops as confirm-mode hints and changes no gate and no live loop. A run reads one `report.json`, makes no model call in any mode, and writes nothing unless `--out <dir>` asks for a report. `--jev` and `--deem` add the rater's recorded `jev` and `deem` columns to the two columns every report carries, `legacy` and `sources`.
+
+#### Scenario Contract
+Prompt: `Run the stop-hint replay on the fixture reports with logging stubs first on PATH and confirm the refusals name their reason on stderr, the gate stop prints one line and writes nothing, the missing model columns skip by name without changing the rest, no stub is called, and the suite passes.`
+
+Expected signals: `rater report not found: <dir>/report.json` and `rater report is not JSON: <path>` on stderr with empty stdout and exit 2, `stop: rater report has no confirmed gold` as the whole stdout with exit 0 in both gate shapes, `jev column skipped: rater report has none` and `deem column skipped: rater report has none` on a report with no rater columns, `git status --porcelain` unchanged, and 28 passing tests.
+
+#### Test Execution
+> **Feature File:** [DLR-057](../manual-testing-playbook/scoring/stop-hint-replay.md)
+
+---
+
 ## 11. COVERAGE GRAPH
 
 This category covers 6 scenarios while the linked feature files remain the canonical execution contract.
@@ -966,3 +981,4 @@ Expected signals: Cassette recording, deterministic replay, redacted path/timest
 | DLR-054 | [F052 Torn-tail recovery marker ordering](../feature-catalog/state-safety/torn-tail-recovery-marker-ordering.md) | [state-safety/torn-tail-recovery-marker-ordering.md](../manual-testing-playbook/state-safety/torn-tail-recovery-marker-ordering.md) |
 | DLR-055 | [F051 append-mode-event.cjs](../feature-catalog/script-entry-points/append-mode-event-script.md) | [script-entry-points/append-mode-event-script.md](../manual-testing-playbook/script-entry-points/append-mode-event-script.md) |
 | DLR-056 | [F056 Stop-rater replay](../feature-catalog/scoring/stop-rater-replay.md) | [scoring/stop-rater-replay.md](../manual-testing-playbook/scoring/stop-rater-replay.md) |
+| DLR-057 | [F057 Stop-hint replay](../feature-catalog/scoring/stop-hint-replay.md) | [scoring/stop-hint-replay.md](../manual-testing-playbook/scoring/stop-hint-replay.md) |
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs b/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs
new file mode 100644
index 0000000000..707379a398
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs
@@ -0,0 +1,574 @@
+#!/usr/bin/env node
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-stop-hint
+// ───────────────────────────────────────────────────────────────────
+'use strict';
+
+/**
+ * Replay a stop-rater report offline and score whether its recorded stops
+ * would have made good confirm-mode hints. A default run reads one report,
+ * makes no model call, and writes no file unless `--out` asks for one.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const fs = require('node:fs');
+const path = require('node:path');
+const crypto = require('node:crypto');
+const { parseArgs } = require('node:util');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The file a rater report lives under in its directory.
+const REPORT_FILE = 'report.json';
+// The line a run prints when the rater never confirmed the report's gold.
+const NO_GOLD_LINE = 'stop: rater report has no confirmed gold';
+// The suffix every skipped column's line carries.
+const SKIP_SUFFIX = 'column skipped: rater report has none';
+// The line a run prints when a stored report measured a different rater identity.
+const REQUALIFY_LINE = 'requalify: rater changed';
+// The two zero-call columns every report carries.
+const DEFAULT_COLUMNS = ['legacy', 'sources'];
+// The two model columns a run adds on request.
+const MODEL_COLUMNS = ['jev', 'deem'];
+// The leading hex characters of a report digest printed on a verdict line.
+const SHA_CHARS = 12;
+// The coverage floor: measured lineages as a share of the census.
+const COVERAGE_FLOOR = 0.9;
+// The loss tail a kill needs, and the win tail a keep needs.
+const KILL_ALPHA = 0.05;
+const SIGN_ALPHA = 0.05;
+// The right-hint floor over measured hints.
+const PRECISION_FLOOR = 0.9;
+// The win floor over measured lineages needed for a keep.
+const SAVINGS_FLOOR = 0.2;
+// The rerun flips allowed per ten measured jev calls.
+const FLIP_CEILING = 0.10;
+// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)';
+// The stored hint line: <column> is substituted, and <t> stays literal for the
+// live gate to fill with the iteration it is shown at.
+const KEEP_HINT_TEMPLATE = '**Stop hint**: <column> replay says this loop found its last new cited source by iteration <t>';
+// The usage line for the one supported invocation.
+const USAGE = 'node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. RATER REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Lowercase SHA-256 hex digest of a file's bytes.
+ *
+ * @param {string} file - Path to hash
+ * @returns {string} 64 hexadecimal characters
+ */
+function sha256(file) {
+  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
+}
+
+/**
+ * Read and validate one stop-rater report. The digest is taken over the same
+ * buffer the report is parsed from, so a later verdict line names exactly the
+ * bytes its numbers came from.
+ *
+ * @param {string} dir - Directory holding the rater's report file
+ * @returns {{ report: object, path: string, sha256: string }} Parsed report, its path, and its digest
+ * @throws {Error} When the file is missing, is not JSON, or is not shaped like a rater report
+ */
+function readRaterReport(dir) {
+  const file = path.join(dir, REPORT_FILE);
+  let bytes;
+  try {
+    bytes = fs.readFileSync(file);
+  } catch {
+    throw new Error(`rater report not found: ${file}`);
+  }
+  let report;
+  try {
+    report = JSON.parse(bytes.toString('utf8'));
+  } catch {
+    throw new Error(`rater report is not JSON: ${file}`);
+  }
+  if (report === null || typeof report !== 'object' || !Array.isArray(report.lineages)) {
+    throw new Error(`rater report has no lineage list: ${file}`);
+  }
+  for (let index = 0; index < report.lineages.length; index += 1) {
+    const entry = report.lineages[index];
+    const measured = entry !== null && typeof entry === 'object'
+      && typeof entry.gold === 'number' && typeof entry.lastIteration === 'number';
+    if (!measured) {
+      throw new Error(`rater report lineage ${index} is missing gold or lastIteration`);
+    }
+  }
+  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
+  return { report, path: file, sha256: digest };
+}
+
+/**
+ * The stop line for a report whose gold the rater never confirmed. A missing,
+ * null or false label all read the same way: with no confirmed gold no replayed
+ * stop can be scored against it.
+ *
+ * @param {object} report - Parsed rater report
+ * @returns {string|null} The stop line, or null when the label gate passed
+ */
+function gateStopLine(report) {
+  return report?.gate?.label?.passed === true ? null : NO_GOLD_LINE;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. HINT COUNTER
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Score one lineage's recorded stop as a confirm-mode hint. A stop only says
+ * where the loop could have stopped early when it lands strictly before the
+ * recorded last iteration: a stop at or past the last iteration would have
+ * saved nothing, so it raises no hint. A hint at or after gold kept the last
+ * source; one before gold cut the source off. Only a right hint saves the
+ * iterations between where it lands and the record's last.
+ *
+ * @param {{ gold: number, lastIteration: number }} lineage - Lineage with the iteration its last source arrived and the iteration its record ends
+ * @param {number|null|undefined} stop - This column's recorded stop for the lineage, null or absent when unmeasured
+ * @returns {{ hint: number|null, right: boolean, wrong: boolean, saved: number }} The hint iteration, how it scored, and the iterations a right hint saves
+ */
+function hintFor(lineage, stop) {
+  if (typeof stop !== 'number' || !(stop < lineage.lastIteration)) {
+    return { hint: null, right: false, wrong: false, saved: 0 };
+  }
+  const right = lineage.gold <= stop;
+  return { hint: stop, right, wrong: !right, saved: right ? lineage.lastIteration - stop : 0 };
+}
+
+/**
+ * One column's hint counts over the census. Measured counts only the lineages
+ * the column replayed to a stop: a null stop is a missing measurement, not
+ * evidence against the column, and it lowers the share of the census the
+ * column can be judged on. Hints, right, wrong and saved read over the
+ * measured set alone.
+ *
+ * @param {Array<{ gold: number, lastIteration: number, stops?: object }>} lineages - Census lineages in report order
+ * @param {string} column - Column name, the key its stops are recorded under
+ * @returns {{ column: string, K: number, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} The column's counts
+ */
+function countColumn(lineages, column) {
+  const K = lineages.length;
+  let M = 0;
+  let W = 0;
+  let L = 0;
+  let saved = 0;
+  for (const lineage of lineages) {
+    const stop = lineage.stops?.[column];
+    if (typeof stop === 'number') M += 1;
+    const scored = hintFor(lineage, stop);
+    if (scored.right) W += 1;
+    if (scored.wrong) L += 1;
+    saved += scored.saved;
+  }
+  const hints = W + L;
+  return { column, K, M, hints, W, L, noHint: M - hints, saved };
+}
+
+/**
+ * The column line: how much of the census the column measured, how many of
+ * those stops became hints, how many read right and wrong, how many measured
+ * stops raised no hint at all, and the iterations the right hints would have
+ * saved.
+ *
+ * @param {{ column: string, M: number, hints: number, W: number, L: number, noHint: number, saved: number }} counts - Counts from countColumn
+ * @returns {string} Column line for stdout and the report column
+ */
+function columnLine(counts) {
+  return `column ${counts.column}: measured ${counts.M} hints ${counts.hints} right ${counts.W} wrong ${counts.L} no hint ${counts.noHint} saved ${counts.saved}`;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. COLUMN SELECTION
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The columns one run prints, in print order: the two zero-call columns first,
+ * then a requested model column. A model column is available only when the
+ * rater recorded a finished column for it. A column the rater skipped or
+ * stopped carries no replay stops, so it prints one skip line in its place
+ * rather than letting a missing column read as a column of zero hints.
+ *
+ * @param {object} report - Parsed rater report
+ * @param {{ jev?: boolean, deem?: boolean }} [options] - Model columns the run asked for
+ * @returns {Array<{ column: string, skip: boolean, skipLine: string|null }>} Columns in print order, each with its skip verdict
+ */
+function selectColumns(report, options = {}) {
+  const selected = DEFAULT_COLUMNS.map((column) => ({ column, skip: false, skipLine: null }));
+  for (const column of MODEL_COLUMNS) {
+    if (options?.[column] !== true) continue;
+    const recorded = report?.columns?.[column] !== undefined;
+    const withheld = report?.stopped?.[column] !== undefined || report?.skipped?.[column] !== undefined;
+    const skip = !recorded || withheld;
+    selected.push({ column, skip, skipLine: skip ? `${column} ${SKIP_SUFFIX}` : null });
+  }
+  return selected;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. VERDICT AND REQUALIFY
+// ─────────────────────────────────────────────────────────────────────────────
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
+ * First failed check decides, in the order the printed rule states: coverage,
+ * kill, precision, savings, sign test, then flips for the rerun-sampled jev
+ * column alone. A clean loss tail kills before precision is read, and the
+ * flips check binds only the column whose calls were rerun, since a single
+ * call cannot flip.
+ *
+ * @param {{ column: string, K: number, M: number, W: number, L: number, F?: number, C?: number }} counts - Column counts and the jev flip pair
+ * @returns {{ outcome: 'keep'|'kill'|'stop', reason: 'coverage'|'precision'|'savings'|'sign test'|'flips'|null, pWin: number, pLoss: number }} Verdict with both exact tails
+ */
+function decideVerdict({ column, K, M, W, L, F, C }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', pWin: win.p, pLoss: loss.p };
+  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, pWin: win.p, pLoss: loss.p };
+  if (!(10 * W >= 9 * (W + L))) return { outcome: 'stop', reason: 'precision', pWin: win.p, pLoss: loss.p };
+  if (!(5 * W >= M)) return { outcome: 'stop', reason: 'savings', pWin: win.p, pLoss: loss.p };
+  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', pWin: win.p, pLoss: loss.p };
+  if (column === 'jev' && !(10 * F <= C)) return { outcome: 'stop', reason: 'flips', pWin: win.p, pLoss: loss.p };
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
+ * The rater identity a model column's verdict holds for. The two zero-call
+ * columns name no rater, and a column the report does not carry reads the
+ * same way, so a caller appends the result only when it is non-empty.
+ *
+ * @param {object} report - Parsed rater report
+ * @param {string} column - Column name
+ * @returns {string} Identity fields in print order, or '' when the column carries none
+ */
+function raterSuffix(report, column) {
+  const recorded = report?.columns?.[column];
+  if (recorded === null || typeof recorded !== 'object') return '';
+  if (column === 'jev') {
+    return `jev_version=${recorded.jevVersion} provider=${recorded.provider} model=${recorded.model}`;
+  }
+  if (column === 'deem') {
+    return `model=${recorded.modelId} model_commit=${recorded.modelCommit} source_commit=${recorded.sourceCommit}`;
+  }
+  return '';
+}
+
+/**
+ * The verdict line: one outcome, the counts it was read from, the exact tail
+ * the decision turned on, the digest of the report those numbers came from
+ * and, for a model column, the rater identity the verdict holds for. A kill
+ * prints its loss tail; every other outcome prints its win tail.
+ *
+ * @param {object} summary - Column counts with the verdict and the report digest
+ * @param {string} [raterSuffix] - Rater identity, appended when non-empty
+ * @returns {string} Verdict line for stdout and the report column
+ */
+function verdictLine(summary, raterSuffix) {
+  const outcomeText = summary.reason === null ? summary.outcome : `stop (${summary.reason})`;
+  const p = summary.outcome === 'kill' ? summary.pLoss : summary.pWin;
+  let line = `verdict ${summary.column}: ${outcomeText} K=${summary.K} M=${summary.M} W=${summary.W} L=${summary.L} saved=${summary.saved} p=${formatP(p)} report=${summary.report}`;
+  if (typeof raterSuffix === 'string' && raterSuffix.length > 0) line += ` ${raterSuffix}`;
+  return line;
+}
+
+/**
+ * Parsed report.json an earlier run wrote into the same output directory. A
+ * later run reads it to requalify a model column whose rater identity changed,
+ * before printing its own verdict for that column.
+ *
+ * @param {string|undefined|null} outDir - Directory that may hold report.json
+ * @returns {object|null} The parsed report, or null when outDir is empty, the file is missing, or the file does not parse
+ */
+function readStoredReport(outDir) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  try {
+    return JSON.parse(fs.readFileSync(path.join(outDir, REPORT_FILE), 'utf8'));
+  } catch {
+    return null;
+  }
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The stop hint a kept column stores for the live gate to show. The iteration
+ * stays a literal placeholder because only the gate knows the iteration it is
+ * shown at, and the stored line must stay the same across replays.
+ *
+ * @param {string} column - Column name the hint belongs to
+ * @returns {string} Hint line with the column substituted
+ */
+function hintLine(column) {
+  return KEEP_HINT_TEMPLATE.replace('<column>', column);
+}
+
+/**
+ * The report one run writes to report.json: every printed verdict with the
+ * counts it came from, a kept column's stop hint, a skipped column's line,
+ * and the digest of the rater report the run scored. The digest names the
+ * exact bytes the counts came from, so a later run can tell when a model
+ * column was measured on a different rater.
+ *
+ * @param {object} parts - Report inputs
+ * @param {string} parts.generated - Run timestamp, ISO 8601
+ * @param {{ path: string, sha256: string }} parts.rater - Rater report path and digest
+ * @param {{ passed: boolean, line: string|null }} parts.gate - Gate read from the rater report
+ * @param {object} parts.columns - Finished column records by column name
+ * @param {object} parts.skipped - Skip lines by column name
+ * @param {object} parts.requalify - Requalify lines by model column name, null when unchanged
+ * @returns {object} Report object ready for JSON.stringify
+ */
+function buildReport(parts) {
+  const { generated, rater, gate, columns, skipped, requalify } = parts;
+  return {
+    generated,
+    rater: { path: rater.path, sha256: rater.sha256 },
+    gate: { passed: gate.passed, line: gate.line },
+    columns: { ...columns },
+    skipped: { ...skipped },
+    requalify: { ...requalify },
+  };
+}
+
+/**
+ * Write the run report into `report.json` under the output directory. A run
+ * without a directory writes nothing, and the file is written whole on every
+ * run, so an earlier report never merges into a later one.
+ *
+ * @param {string|undefined|null} outDir - Output directory, absent when the run requested none
+ * @param {object} report - Report object from buildReport
+ * @returns {string|null} Written path, or null when no directory was requested
+ */
+function writeReport(outDir, report) {
+  if (typeof outDir !== 'string' || outDir === '') return null;
+  fs.mkdirSync(outDir, { recursive: true });
+  const file = path.join(outDir, REPORT_FILE);
+  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
+  return file;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Parse the switches, read the rater report, and close with the stop line when
+ * the rater never confirmed its gold. A passed gate opens the column output
+ * the remaining sections print and, when `--out` names a directory, stores it
+ * in report.json.
+ *
+ * @param {string[]} argv - Command-line switches, without the node and script parts
+ * @param {object} [deps] - Injected seams: out, err, env
+ * @returns {Promise<number>} The exit code: 0 on a read report or gate stop, 2 on a parse, refusal, or read failure
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+
+  let values;
+  try {
+    ({ values } = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        'rater-report': { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+        out: { type: 'string' },
+      },
+    }));
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  const raterDir = values['rater-report'];
+  if (typeof raterDir !== 'string' || raterDir === '') {
+    err('--rater-report <dir> is required');
+    return 2;
+  }
+
+  // A run that wrote its report over the report it read would destroy the only
+  // record of what the rater measured, so the collision is refused up front.
+  const outDir = typeof values.out === 'string' && values.out !== '' ? values.out : null;
+  if (outDir !== null && path.resolve(outDir, REPORT_FILE) === path.resolve(raterDir, REPORT_FILE)) {
+    err(`--out <dir> would overwrite the rater report: ${path.resolve(outDir, REPORT_FILE)}`);
+    return 2;
+  }
+
+  let loaded;
+  try {
+    loaded = readRaterReport(raterDir);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  const stopLine = gateStopLine(loaded.report);
+  if (stopLine !== null) {
+    out(stopLine);
+    return 0;
+  }
+
+  // The keep rule prints before the columns, so every verdict below can be
+  // rechecked by hand against the rule it was read from.
+  out(KEEP_RULE_LINE);
+
+  // A stored report is the only record of what an earlier run measured on, so
+  // this run can requalify a model column whose rater identity changed since.
+  const stored = readStoredReport(outDir);
+  const reportColumns = {};
+  const reportSkipped = {};
+  const reportRequalify = {};
+
+  for (const selection of selectColumns(loaded.report, { jev: values.jev === true, deem: values.deem === true })) {
+    if (selection.skip) {
+      out(selection.skipLine);
+      reportSkipped[selection.column] = selection.skipLine;
+      continue;
+    }
+    const counts = countColumn(loaded.report.lineages, selection.column);
+    const jevRecord = selection.column === 'jev' ? loaded.report.columns?.jev : undefined;
+    const verdict = decideVerdict({
+      column: selection.column,
+      K: counts.K,
+      M: counts.M,
+      W: counts.W,
+      L: counts.L,
+      F: jevRecord?.F,
+      C: jevRecord?.C,
+    });
+    const identity = raterSuffix(loaded.report, selection.column);
+    out(columnLine(counts));
+    const prior = stored?.columns?.[selection.column];
+    const requalified = prior !== null && typeof prior === 'object' && (typeof prior.rater === 'string' ? prior.rater : '') !== identity;
+    if (requalified) {
+      out(REQUALIFY_LINE);
+    }
+    const line = verdictLine({ ...counts, ...verdict, report: loaded.sha256.slice(0, SHA_CHARS) }, identity);
+    out(line);
+    const record = {
+      K: counts.K,
+      M: counts.M,
+      hints: counts.hints,
+      W: counts.W,
+      L: counts.L,
+      noHint: counts.noHint,
+      saved: counts.saved,
+      outcome: verdict.outcome,
+      reason: verdict.reason,
+      p: verdict.outcome === 'kill' ? verdict.pLoss : verdict.pWin,
+      verdict: line,
+    };
+    if (verdict.outcome === 'keep') record.hintLine = hintLine(selection.column);
+    if (identity.length > 0) record.rater = identity;
+    if (requalified) record.requalify = REQUALIFY_LINE;
+    reportColumns[selection.column] = record;
+    if (MODEL_COLUMNS.includes(selection.column)) {
+      reportRequalify[selection.column] = requalified ? REQUALIFY_LINE : null;
+    }
+  }
+
+  // `--out` keeps the printed output on disk; the gate stop above returned first.
+  if (outDir !== null) {
+    writeReport(outDir, buildReport({
+      generated: new Date().toISOString(),
+      rater: { path: loaded.path, sha256: loaded.sha256 },
+      gate: { passed: true, line: null },
+      columns: reportColumns,
+      skipped: reportSkipped,
+      requalify: reportRequalify,
+    }));
+  }
+
+  return 0;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  REPORT_FILE,
+  NO_GOLD_LINE,
+  SKIP_SUFFIX,
+  REQUALIFY_LINE,
+  DEFAULT_COLUMNS,
+  MODEL_COLUMNS,
+  SHA_CHARS,
+  COVERAGE_FLOOR,
+  KILL_ALPHA,
+  PRECISION_FLOOR,
+  SAVINGS_FLOOR,
+  SIGN_ALPHA,
+  FLIP_CEILING,
+  KEEP_RULE_LINE,
+  KEEP_HINT_TEMPLATE,
+  USAGE,
+  sha256,
+  readRaterReport,
+  gateStopLine,
+  hintFor,
+  countColumn,
+  columnLine,
+  selectColumns,
+  binomialTail,
+  formatP,
+  decideVerdict,
+  raterSuffix,
+  verdictLine,
+  readStoredReport,
+  hintLine,
+  buildReport,
+  writeReport,
+  main,
+};
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 10. CLI ENTRYPOINT
+// ─────────────────────────────────────────────────────────────────────────────
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  });
+}
```
