# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/SKILL.md`
- `.skilled/skills/system-deep-loop/runtime/README.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/README.md`
- `.skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). Session facts to weigh: all eight docs pass validate_document.py (the two indexes with --type feature_catalog and --type playbook). The runtime playbook package prints scenarios=57 with the typed census matching. The runtime catalog package prints one new packet_history_metadata warning on the entry's Feature ID line, a line every runtime entry carries; the fanout-pair-replay.md warnings belong to phase 030, whose files are on disk but out of this review. The hub SKILL.md version stays 3.0.1.0 by ruling. Review only the 029 changes in the shared files (SKILL.md line 111, runtime/README.md, runtime/scripts/README.md and both indexes also hold 027's and 028's committed lines). And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
index 4d299ba668..3fe708ac74 100644
--- a/.skilled/skills/system-deep-loop/SKILL.md
+++ b/.skilled/skills/system-deep-loop/SKILL.md
@@ -108,7 +108,7 @@ system-deep-loop/
 Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature-catalog/`, or `manual-testing-playbook/` as applicable, with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`); its legacy public surfaces (the `/deep:ai-council` command and the `ai-council` agent) intentionally keep the shorter `ai-council` key, so always resolve the packet path through `mode-registry.json` rather than hardcoding it.
 
 ### Backend
-All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The offline stop-hint replay at `runtime/scripts/score-stop-hint.cjs` reads one stop-rater report and says whether a replayed stop would have made a good confirm-mode hint, makes no model call in any column and changes no gate. The runtime never gains an `improvement` loopType — improvement stays host-driven.
+All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The offline stop-hint replay at `runtime/scripts/score-stop-hint.cjs` reads one stop-rater report and says whether a replayed stop would have made a good confirm-mode hint, makes no model call in any column and changes no gate. The offline severity replay at `runtime/scripts/score-severity-replay.cjs` measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity, makes no model call by default and changes no severity. The runtime never gains an `improvement` loopType — improvement stays host-driven.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/README.md b/.skilled/skills/system-deep-loop/runtime/README.md
index ad396af2b1..b6581edb51 100644
--- a/.skilled/skills/system-deep-loop/runtime/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/README.md
@@ -48,6 +48,7 @@ Generated dependencies under `node_modules/` and repository metadata directories
 Consumers import domain behavior from `lib/` or invoke a documented script from `scripts/`. The mode workflows own user-facing orchestration and pass durable inputs into this runtime.
 The stop-rater replay at `scripts/score-stop-rater.cjs` makes no model call by default and opens its two rating arms only behind the `--jev` and `--deem` switches.
 The stop-hint replay script `scripts/score-stop-hint.cjs` takes the `--rater-report <dir>` input, the `--jev` and `--deem` column switches and the `--out <dir>` output, makes no model call and leaves the gate unchanged.
+The severity replay script `scripts/score-severity-replay.cjs` makes no model call by default, stops at the label gate below 20 labeled P0 negatives and opens its two severity arms only behind the `--jev` and `--deem` switches.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/README.md b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
index 96fa04dcc4..830560fa19 100644
--- a/.skilled/skills/system-deep-loop/runtime/scripts/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
@@ -49,6 +49,7 @@ The `lib/` child contains CLI-only guards and writer-lock helpers.
 | `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
 | `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
 | `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
+| `score-severity-replay.cjs` | Measures offline whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity, with no model call by default and no severity change. The `--write-label-sheet <path>` and `--labels <file>` switches write and read the operator's label sheet, `--jev` and `--deem` open the rating arms behind the label gate, and `--out <dir>` records every call. |
 | `score-stop-hint.cjs` | Replays one stop-rater report offline and prints per-column hint counts and one Keep-Rule verdict per column past its label gate, with no model call in any mode. The `--rater-report <dir>` switch names the report to read, `--jev` and `--deem` add the rater's recorded columns, and `--out <dir>` writes the run's report. |
 | `score-stop-rater.cjs` | Replays recorded deep-research stop decisions offline against gold derived from the delta files, with no model call by default. The `--jev` and `--deem` switches open a rating arm and `--gold-reads <file>` supplies the confirmed reads that gate it. |
 | `status.cjs` | Reports session-scoped graph health and stored row counts. |
diff --git a/.skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md b/.skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md
new file mode 100644
index 0000000000..fd4d7a8313
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md
@@ -0,0 +1,31 @@
+---
+title: "deep-loop-runtime v1.8.0.0"
+description: "v1.8.0.0 adds an offline severity replay that reads the tracked deep-review findings registries and measures whether a Jev or Deem severity choice separates real P0 findings from false ones. It calls no model by default and changes no severity."
+trigger_phrases:
+  - "deep-loop-runtime v1.8.0.0"
+  - "deep-loop-runtime 1.8.0.0"
+  - "offline severity replay"
+  - "labeled P0 negatives"
+importance_tier: "normal"
+contextType: "general"
+version: 1.8.0.0
+---
+v1.8.0.0 adds `score-severity-replay.cjs`, an offline severity replay that reads every tracked deep-review findings registry and measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity, plus the unit tests behind that measurement. The default run makes no model call and writes no file, and the script holds and reads no credential. It changes no severity, no registry and no review gate.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/029-p0-reread-order` (Level 1)
+
+## Why This Release
+
+The deep-review findings registries carry the recorded severity and the cited evidence for every finding. Whether a model would separate real P0 findings from false ones better than that record is a measurement that needs operator labels on the P0 rows and a record of every call made. `score-severity-replay.cjs` runs that measurement offline behind the label gate and behind `--out <dir>`, and the default run answers the census part of the question with no model call at all.
+
+## What's New at a Glance
+
+- **The default run makes no model call and writes no file.** `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs` reads every tracked deep-review findings registry and prints the census and the gate state. With logging stubs for `jev` and `cli-deem` first on `PATH`, no stub was called.
+- **A label sheet starts the measurement.** `--write-label-sheet <path>` writes one JSONL row per P0 finding with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`, and `--labels <file>` reads the filled sheet back with each `label` set to `real`, `P1`, `P2` or `not_a_finding`. A negative is any label but `real`, and a run refuses to write the sheet inside the repository.
+- **The label gate needs 20 labeled P0 negatives.** With fewer than 20 rows labeled other than `real` the run prints `stop: fewer than 20 labeled P0 negatives` and no model call happens.
+- **Both arms are opt-in and each runs behind its own gate.** `--jev` and `--deem` each need `--out <dir>` so every call is recorded, and either switch without it exits 2 before any call. With both switches the Jev arm runs first and then the Deem arm, each regardless of the other's outcome, and a failed gate prints its own skip line such as `jev arm skipped: label gate` or `deem arm skipped: label gate`.
+- **No run has printed a verdict.** The script changes no severity, no registry and no review gate, and since no run has printed a `verdict` line this entry claims none.
+
+## Upgrade
+
+No migration required. The script is new and changes no severity, no registry and no review gate.
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md
new file mode 100644
index 0000000000..5e3bf08723
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md
@@ -0,0 +1,85 @@
+---
+title: "Severity replay"
+description: "Measures offline whether a Jev or Deem severity choice separates real P0 findings from false ones better than the recorded severity."
+trigger_phrases:
+  - "severity replay"
+  - "severity-replay"
+  - "score-severity-replay.cjs"
+  - "severity replay runtime"
+  - "scoring severity replay"
+version: 1.8.0.0
+---
+
+# Severity replay (score-severity-replay.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+---
+
+## 1. OVERVIEW
+
+Measures offline whether a Jev or Deem severity choice separates real P0 findings from false ones better than the recorded severity.
+
+Run with `node` from the repository root, `scripts/score-severity-replay.cjs` reads every tracked deep-review findings registry and prints the P0 census, the label need and the label gate state. The default run makes no model call and writes no file, and the script holds and reads no credential. It changes no severity, no registry and no review gate. The supported invocation is `node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--deem] [--out <dir>]`, and the `USAGE` constant holds `usage: score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--deem] [--out <dir>]` without printing it.
+
+This feature belongs to the scoring group and is catalogued as F058 in the `runtime/` inventory.
+
+---
+
+## 2. HOW IT WORKS
+
+### Census And P0 Rows
+
+The census reads every tracked deep-review findings registry and prints `registries: <n>`, `findings: <n> (P0 <a>, P1 <b>, P2 <c>, other <d>)` and one `transitions: <from|none> -> <to|none> <n>` line per severity pair. It continues with `p0 rows: <n> in <r> registries (one <o>, two or more <m>)` over the deduplicated P0 rows and one `phrases: <files> review iteration files; "downgraded from P0" <n>; "from P0 to P1" <n>; "from P0 to P2" <n>; "retracted from P0" <n>; "P0 was retracted" <n>` line over review iteration files. The block ends with `labels needed: 20 P0 negatives among <n> P0 rows`, and the counts read the live tree so a later run may differ.
+
+### Labels And The Gate
+
+With `--write-label-sheet <path>` the script writes one JSON line per P0 row holding `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`. The operator fills each `label` with `real`, `P1`, `P2` or `not_a_finding`, and `--labels <file>` reads the filled sheet back. A negative is any label but `real`.
+
+A labeled run prints `labels: none` or `labels: sha256=<sha> rows=<n>`, then `labeled: <K> (real <r>, P1 <a>, P2 <b>, not_a_finding <c>)`, `labels dropped: <n>` and `baseline: right <r> of <K>`. The question line, `margin: 0.10`, the keep rule line and the power line print before the gate line so every later result can be rechecked by hand:
+
+```
+keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C
+```
+
+The gate line is `stop: fewer than 20 labeled P0 negatives` when fewer than 20 rows carry a label other than `real`, `no headroom` when more than nine labeled rows in ten are `real`, and `gate: open K=<k> negatives=<n>` otherwise. A closed gate spawns no `jev` and no `cli-deem` process.
+
+### Arms And Refusals
+
+Each arm sits behind its own switch and `--out <dir>`. With both switches the Jev gate and arm run first and then the Deem gate and arm, each on its own gate and regardless of the other's outcome. A closed gate prints `jev arm skipped: label gate` or `deem arm skipped: label gate`, and `jev arm skipped: no headroom` or `deem arm skipped: no headroom` in the headroom case. Past the gate the Jev gate can skip with `jev arm skipped: jev not on PATH`, `jev arm skipped: version` or `jev arm skipped: no credential`, and the Deem gate with `deem arm skipped: <reason>`, where `stub backend` is one reason. A run with an arm switch writes `report.json` in `<dir>`, and a run where every arm skips writes only that file and calls no backend.
+
+Refusals exit 2 before any census line. `--jev` without `--out` prints `--jev needs --out <dir> so every call is recorded`, and `--deem` without `--out` prints `--deem needs --out <dir> so every call is recorded`. A `--write-label-sheet` path inside the repository prints `refusing to write the label sheet inside the repository` and writes no file. A bad labels row prints its row and its fault, for example `labels row 3: label must be "", real, P1, P2 or not_a_finding, got "x"` or `labels row 3: duplicate row <key>`.
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
+| `scripts/score-severity-replay.cjs` | Script | The offline severity measurement over the P0 census, the label sheet and gate, the backend skip lines and the stored `report.json`. |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `tests/unit/score-severity-replay.vitest.ts` | Vitest | Covers the census counts, the phrase counter, the label sheet and reader, the gate states, the keep rule outcomes and the backend gates and skips against fixture registries and stub `jev` and `cli-deem` binaries. |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Scoring
+- Canonical catalog source: `feature-catalog.md`
+- Feature ID: F058
+- Feature file path: `scoring/severity-replay.md`
+- Primary sources: `scripts/score-severity-replay.cjs`, `tests/unit/score-severity-replay.vitest.ts`
+
+Related references:
+- [bayesian-scorer.md](bayesian-scorer.md) - Bayesian scorer
+- [convergence-score-delta.md](convergence-score-delta.md) - Convergence score-delta
+- [stop-hint-replay.md](stop-hint-replay.md) - Stop-hint replay
+- [stop-rater-replay.md](stop-rater-replay.md) - Stop-rater replay
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
index 3904ce2c25..a8e2746c77 100644
--- a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
@@ -16,7 +16,7 @@ This document combines the current feature inventory for the `runtime/` skill in
 
 ## 1. OVERVIEW
 
-Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 56 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
+Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 57 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
 
 | Category | Coverage | Primary Surfaces |
 |---|---:|---|
@@ -24,7 +24,7 @@ Use this catalog as the canonical inventory for the live `runtime/` feature surf
 | [prompt-rendering](../feature-catalog/prompt-rendering) | 1 features | `lib/deep-loop/prompt-pack.ts` |
 | [validation](validation/) | 3 features | `lib/deep-loop/post-dispatch-validate.ts`, `.skilled/plugins/system-deep-loop-guard.js` |
 | [state-safety](../feature-catalog/state-safety) | 13 features | `lib/deep-loop/atomic-state.ts`, `lib/deep-loop/jsonl-repair.ts`, `lib/deep-loop/loop-lock.ts`, `lib/deep-loop/permissions-gate.ts` |
-| [scoring](scoring/) | 4 features | `lib/deep-loop/bayesian-scorer.ts`, `scripts/score-stop-rater.cjs` |
+| [scoring](scoring/) | 5 features | `lib/deep-loop/bayesian-scorer.ts`, `scripts/score-stop-rater.cjs` |
 | [coverage-graph](../feature-catalog/coverage-graph) | 6 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
 | [script-entry-points](../feature-catalog/script-entry-points) | 5 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |
 | [council](council/) | 5 features | `lib/council/multi-seat-dispatch.cjs`, `lib/council/round-state-jsonl.cjs`, `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `lib/council/session-state-hierarchy.cjs` |
@@ -457,6 +457,22 @@ See [`scoring/stop-hint-replay.md`](../feature-catalog/scoring/stop-hint-replay.
 
 ---
 
+### Severity replay
+
+#### Description
+
+Measures offline whether a Jev or Deem severity choice separates real P0 findings from false ones better than the recorded severity.
+
+#### How It Works
+
+`score-severity-replay.cjs` reads every tracked deep-review findings registry and prints the census and the label gate state with zero model calls by default. `--write-label-sheet <path>` writes one JSON line per P0 row for the operator to fill with `real`, `P1`, `P2` or `not_a_finding`, `--labels <file>` reads the filled sheet back, and the gate opens the `--jev` and `--deem` arms only past 20 labeled negatives, printing `stop: fewer than 20 labeled P0 negatives` or `no headroom` when it stays closed. Each arm needs `--out <dir>`, and no run changes a severity.
+
+#### Source Files
+
+See [`scoring/severity-replay.md`](../feature-catalog/scoring/severity-replay.md) for full implementation and validation file listings.
+
+---
+
 ## 7. COVERAGE GRAPH
 
 These entries cover the session-scoped SQLite graph store, graph read models, convergence signals, snapshots, and momentum.
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md
new file mode 100644
index 0000000000..fa46d4896b
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/scoring/severity-replay.md
@@ -0,0 +1,167 @@
+---
+title: "DLR-058 -- Severity replay"
+description: "Manual validation scenario for Severity replay in the runtime/ skill."
+version: 1.8.0.0
+---
+
+# DLR-058 -- Severity replay
+
+This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-058`.
+
+---
+
+## 1. OVERVIEW
+
+Adds `scripts/score-severity-replay.cjs`, an offline severity replay over the tracked deep-review findings registries. It measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity, and it changes no severity, no registry and no review gate. A default run makes no model call and writes no file. `--write-label-sheet <path>` writes one JSON line per P0 finding with an empty `label` for the operator to fill with `real`, `P1`, `P2` or `not_a_finding`, and `--labels <file>` reads the filled sheet back. Below 20 labeled P0 negatives the label gate stops the run before any backend is reached, and past the gate each requested arm meets its own backend gate where a stub backend is skipped by name.
+
+### Why This Matters
+
+The replay must stay offline on every run, the label gate must stop a run before any backend is spawned, and a backend gate must skip by name without changing the census or the keep rule lines. Logging stubs first on `PATH` prove the census run and the label-gate stop call nothing, and the stub-backend run shows `cli-deem health` as its only stub contact.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+- Objective: Confirm the severity replay prints the census with no model call, writes the label sheet outside the repository, stops at the label gate below 20 labeled P0 negatives with one stop line and both arm skip lines, skips a stub Deem backend by name once the gate opens without changing the census and the keep rule lines, and passes the suite.
+- Layer partition: scoring runtime.
+- Real user request: `Run the severity replay with logging stubs first on PATH and confirm the census prints with no model call, the label sheet lands outside the repository, the label gate stops below 20 labeled P0 negatives and skips both arms, a stub Deem backend is skipped by name once the gate opens, no choice call reaches a stub, and the suite passes.`
+- Expected signals: the census block on every run, `label sheet: /tmp/dlr-058/labels.jsonl rows=<n>` outside the repository, `stop: fewer than 20 labeled P0 negatives` with `jev arm skipped: label gate` and `deem arm skipped: label gate` and exit 0 on the label-gate stop, `labeled: 20 (real 0, P1 20, P2 0, not_a_finding 0)` and `gate: open K=20 negatives=20` and `deem arm skipped: stub backend` on the stub-backend run, no stub log before that run, `health` as the whole Deem log and no `jev.log` after it, `report.json` as the only file in each `--out` directory, an unchanged `git status --porcelain`, and 33 passing tests.
+- Pass/fail: PASS if every run prints its expected lines with the stated exit code and no stub log holds a choice call. FAIL if a census line is missing, the label-gate stop spawns a stub or prints an arm line beside its two skip lines, the stub-backend run calls anything but `cli-deem health`, a stub log holds a call other than `health`, an `--out` directory holds a `calls.jsonl`, the working tree changes, or a test fails.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prerequisites
+
+- Working directory is repository root.
+- `runtime/` source tree is present.
+- Feature catalog entry exists at `feature-catalog/scoring/severity-replay.md`.
+- `node`, `git` and `npx` are available on the PATH.
+
+### Prompt
+
+- Prompt: `Run the severity replay with logging stubs first on PATH and confirm the census prints with no model call, the label sheet lands outside the repository, the label gate stops below 20 labeled P0 negatives and skips both arms, a stub Deem backend is skipped by name once the gate opens, no choice call reaches a stub, and the suite passes.`
+
+### Commands
+
+Run from the repository root.
+
+1. `rm -rf /tmp/dlr-058 && mkdir -p /tmp/dlr-058/bin /tmp/dlr-058/out-stop /tmp/dlr-058/out-stub`
+2. `printf '#!/bin/sh\necho "$*" >> /tmp/dlr-058/jev.log\nexit 0\n' > /tmp/dlr-058/bin/jev && printf '#!/bin/sh\necho "$*" >> /tmp/dlr-058/cli-deem.log\necho "stub backend" >&2\nexit 3\n' > /tmp/dlr-058/bin/cli-deem && chmod +x /tmp/dlr-058/bin/jev /tmp/dlr-058/bin/cli-deem`
+3. `git status --porcelain > /tmp/dlr-058/porcelain.before`
+4. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs > /tmp/dlr-058/census.txt 2> /tmp/dlr-058/census.err; echo "exit=$?"; cat /tmp/dlr-058/census.txt`
+5. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --write-label-sheet /tmp/dlr-058/labels.jsonl > /tmp/dlr-058/sheet.txt 2> /tmp/dlr-058/sheet.err; echo "exit=$?"; grep '^label sheet:' /tmp/dlr-058/sheet.txt`
+6. `node -e 'const fs=require("fs");const rows=fs.readFileSync("/tmp/dlr-058/labels.jsonl","utf8").trim().split("\n").slice(0,20).map(line=>JSON.parse(line));for(const r of rows)r.label="P1";fs.writeFileSync("/tmp/dlr-058/labels-20.jsonl",rows.map(r=>JSON.stringify(r)).join("\n")+"\n")' && wc -l < /tmp/dlr-058/labels-20.jsonl`
+7. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --jev --deem --out /tmp/dlr-058/out-stop > /tmp/dlr-058/stop.txt 2> /tmp/dlr-058/stop.err; echo "exit=$?"; tail -n 3 /tmp/dlr-058/stop.txt`
+8. `ls /tmp/dlr-058/out-stop; ls /tmp/dlr-058/jev.log /tmp/dlr-058/cli-deem.log`
+9. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --labels /tmp/dlr-058/labels-20.jsonl --deem --out /tmp/dlr-058/out-stub > /tmp/dlr-058/stub.txt 2> /tmp/dlr-058/stub.err; echo "exit=$?"; grep -E '^(labels:|labeled:|labels dropped:|baseline:|gate:|deem arm skipped:)' /tmp/dlr-058/stub.txt`
+10. `sed -n '/^registries:/,/^labels needed:/p; /^question:/,/^power:/p' /tmp/dlr-058/census.txt > /tmp/dlr-058/census-fixed.txt && sed -n '/^registries:/,/^labels needed:/p; /^question:/,/^power:/p' /tmp/dlr-058/stub.txt > /tmp/dlr-058/stub-fixed.txt && diff /tmp/dlr-058/census-fixed.txt /tmp/dlr-058/stub-fixed.txt`
+11. `ls /tmp/dlr-058/out-stub; cat /tmp/dlr-058/cli-deem.log; ls /tmp/dlr-058/jev.log`
+12. `git status --porcelain > /tmp/dlr-058/porcelain.after; diff /tmp/dlr-058/porcelain.before /tmp/dlr-058/porcelain.after`
+13. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-severity-replay.vitest.ts`
+14. Record PASS or FAIL with rationale. Record SKIP only when a named sandbox blocker (an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential) prevents a command from running.
+
+### Expected Outcome
+
+The severity replay matches the documented current reality, every expected line prints with its stated exit code, and validation evidence is reproducible.
+
+- Step 4 prints `exit=0` and this stdout, the whole of it, as recorded on 2026-09-29:
+
+```
+registries: 413
+findings: 2771 (P0 96, P1 1298, P2 1377, other 0)
+transitions: P1 -> P0 2
+transitions: P1 -> P1 19
+transitions: P1 -> P2 6
+transitions: P1 -> resolved 11
+transitions: P2 -> P1 2
+transitions: P2 -> P2 6
+transitions: P2 -> resolved 5
+transitions: none -> P0 45
+transitions: none -> P1 879
+transitions: none -> P2 938
+p0 rows: 95 in 37 registries (one 21, two or more 16)
+phrases: 3270 review iteration files; "downgraded from P0" 0; "from P0 to P1" 1; "from P0 to P2" 1; "retracted from P0" 1; "P0 was retracted" 1
+labels needed: 20 P0 negatives among 95 P0 rows
+labels: none
+labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)
+labels dropped: 0
+baseline: right 0 of 0
+question: Which severity does this review finding deserve?
+margin: 0.10
+keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C
+power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
+stop: fewer than 20 labeled P0 negatives
+```
+
+- The counts read the live tree at run time, so a later run may print different numbers in the same lines. One of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`.
+- Step 5 prints `exit=0` and this line: `label sheet: /tmp/dlr-058/labels.jsonl rows=<n>`, with `<n>` the `p0 rows:` count of the census (95 in the recorded run). The sheet holds one JSON line per P0 row with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`.
+- Step 6 prints `20`.
+- Step 7 prints `exit=0` and these three lines, the end of its stdout:
+
+```
+stop: fewer than 20 labeled P0 negatives
+jev arm skipped: label gate
+deem arm skipped: label gate
+```
+
+- Step 8 prints `report.json` for the out directory and reports that `/tmp/dlr-058/jev.log` and `/tmp/dlr-058/cli-deem.log` do not exist, because no run has called a stub.
+- Step 9 prints `exit=0` and these lines:
+
+```
+labels: sha256=<64 hex> rows=20
+labeled: 20 (real 0, P1 20, P2 0, not_a_finding 0)
+labels dropped: 0
+baseline: right 0 of 20
+gate: open K=20 negatives=20
+deem arm skipped: stub backend
+```
+
+- Step 10 prints nothing from the diff, because the stub-backend run prints the same census and the same question, margin, keep rule and power lines as the default run.
+- Step 11 prints `report.json` for the out directory, `health` as the whole Deem log, and reports that `/tmp/dlr-058/jev.log` does not exist, because `cli-deem health` is the only stub contact the run makes.
+- Step 12 prints nothing from the diff, because the working tree is unchanged.
+- Step 13 exits 0 with 33 passing tests and 0 failing.
+
+### Evidence
+
+- Captured stdout, stderr and exit status for every command run in this section, including the two diff outputs.
+- The files under `/tmp/dlr-058`: `census.txt`, `census.err`, `sheet.txt`, `sheet.err`, `labels.jsonl`, `labels-20.jsonl`, `stop.txt`, `stop.err`, `stub.txt`, `stub.err`, `census-fixed.txt`, `stub-fixed.txt`, `porcelain.before`, `porcelain.after`, `report.json` under `out-stop` and `out-stub`, `cli-deem.log`, and the absent `jev.log`.
+- Output from `tests/unit/score-severity-replay.vitest.ts` naming the assertions that carry the expected signals.
+- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.
+
+### Failure Triage
+
+- A stub log appears before the stub-backend run. Find which code path spawns a process: the census run and the label-gate stop reach no backend gate.
+- The label-gate stop prints anything beside its stop line and the two skip lines, or its `--out` directory holds a `calls.jsonl`. Check the gate ordering and the call log in `main`.
+- The stub-backend run reaches the Deem arm. Check `readDeemHealth` and `deemGate` in `scripts/score-severity-replay.cjs`: `stub` in the exit-3 stderr must skip the arm before any choice call.
+- A stub log holds a call other than `health`. Find which code path spawns a call: a skipped arm makes no choice call.
+- The census block or the keep rule lines differ between two runs of one tree. Check `censusLines` and the print order in `main`.
+- The census counts, the sheet row count or the test count differ from the recorded values. The counts read the live tree at run time, so the tree or the script changed since this scenario was recorded.
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
+| `scripts/score-severity-replay.cjs` | Offline severity replay: the census, the label sheet and label gate, the two backend gates and the optional `report.json` write. |
+
+### Validation
+
+| File | Role |
+|---|---|
+| `tests/unit/score-severity-replay.vitest.ts` | Primary regression coverage for Severity replay. |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Scoring
+- Playbook ID: DLR-058
+- Feature catalog entry: `feature-catalog/scoring/severity-replay.md`
+- Scenario file path: `manual-testing-playbook/scoring/severity-replay.md`
+- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
index cf5a1c974c..1ceac42beb 100644
--- a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
@@ -36,7 +36,7 @@ Canonical package artifacts:
 
 ## 1. OVERVIEW
 
-This playbook provides 56 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
+This playbook provides 57 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
 
 ### REALISTIC TEST MODEL
 
@@ -388,7 +388,7 @@ Expected signals: Recovery marker durable (fsynced) before the torn frame is ren
 
 ## 10. SCORING
 
-This category covers 4 scenarios while the linked feature files remain the canonical execution contract.
+This category covers 5 scenarios while the linked feature files remain the canonical execution contract.
 
 ### DLR-010 | Bayesian scorer
 
@@ -450,6 +450,21 @@ Expected signals: `rater report not found: <dir>/report.json` and `rater report
 
 ---
 
+### DLR-058 | Severity replay
+
+#### Description
+Adds `scripts/score-severity-replay.cjs`, an offline replay that reads every tracked deep-review findings registry and measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity. It changes no severity, no registry and no review gate. The default run makes no model call and writes no file. `--write-label-sheet <path>` writes one JSONL row per P0 finding with every `label` empty for the operator to fill, `--labels <file>` reads the filled sheet back, and `--jev` and `--deem` each open one arm behind its own gate and require `--out <dir>`.
+
+#### Scenario Contract
+Prompt: `Run the offline severity replay with logging stubs first on PATH and confirm the default run makes zero model calls and writes no file, the label gate stops both arms by name, --jev without --out refuses with exit 2 before any census line, no stub is called, and the suite passes.`
+
+Expected signals: The default run prints the census and ends with `stop: fewer than 20 labeled P0 negatives` with no stub call, `jev arm skipped: label gate` and `deem arm skipped: label gate` print when both arms are requested and only `report.json` is written under `--out <dir>`, `--jev needs --out <dir> so every call is recorded` lands on stderr with exit 2 before any census line, `git status` outside `specs/` is unchanged, and 33 passing tests.
+
+#### Test Execution
+> **Feature File:** [DLR-058](../manual-testing-playbook/scoring/severity-replay.md)
+
+---
+
 ## 11. COVERAGE GRAPH
 
 This category covers 6 scenarios while the linked feature files remain the canonical execution contract.
@@ -982,3 +997,4 @@ Expected signals: Cassette recording, deterministic replay, redacted path/timest
 | DLR-055 | [F051 append-mode-event.cjs](../feature-catalog/script-entry-points/append-mode-event-script.md) | [script-entry-points/append-mode-event-script.md](../manual-testing-playbook/script-entry-points/append-mode-event-script.md) |
 | DLR-056 | [F056 Stop-rater replay](../feature-catalog/scoring/stop-rater-replay.md) | [scoring/stop-rater-replay.md](../manual-testing-playbook/scoring/stop-rater-replay.md) |
 | DLR-057 | [F057 Stop-hint replay](../feature-catalog/scoring/stop-hint-replay.md) | [scoring/stop-hint-replay.md](../manual-testing-playbook/scoring/stop-hint-replay.md) |
+| DLR-058 | [F058 Severity replay](../feature-catalog/scoring/severity-replay.md) | [scoring/severity-replay.md](../manual-testing-playbook/scoring/severity-replay.md) |
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs b/.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs
new file mode 100644
index 0000000000..8fc01e683d
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs
@@ -0,0 +1,1816 @@
+#!/usr/bin/env node
+// ╔══════════════════════════════════════════════════════════════════════════╗
+// ║ score-severity-replay — offline replay of review severity decisions      ║
+// ╚══════════════════════════════════════════════════════════════════════════╝
+'use strict';
+
+/**
+ * Measure offline whether a Jev or Deem severity choice separates real P0
+ * review findings from false ones better than the recorded severity. The
+ * default run makes no model call and writes no file, and the script holds
+ * and reads no credential.
+ */
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 1. IMPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+const fs = require('node:fs');
+const crypto = require('node:crypto');
+const path = require('node:path');
+const { spawn, spawnSync } = require('node:child_process');
+const { parseArgs } = require('node:util');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The one severity question every arm asks; both columns ask exactly this.
+const QUESTION_SEVERITY = 'Which severity does this review finding deserve?';
+// The one funnel question beside a column; it reports and never decides.
+const QUESTION_FUNNEL = 'Does the cited evidence show the defect this finding claims?';
+// The four keys an arm picks from, in the first of the three call orders; the
+// descriptions are the severity table's wording.
+const OPTIONS = [
+  { key: 'P0', description: 'Correctness failures, security vulnerabilities, spec contradictions' },
+  { key: 'P1', description: 'Degraded behavior, incomplete implementation, missing validation' },
+  { key: 'P2', description: 'Style, naming, minor improvements, documentation gaps' },
+  { key: 'not_a_finding', description: 'The cited evidence does not show a defect' },
+];
+// The five rejected-P0 phrases the census counts in review iteration files.
+const PHRASES = [
+  'downgraded from P0',
+  'from P0 to P1',
+  'from P0 to P2',
+  'retracted from P0',
+  'P0 was retracted',
+];
+// The labeled-negative floor below which no arm opens.
+const LABEL_GATE = 20;
+// The number of option orders every row is called in.
+const ORDERS = 3;
+// The one Deem model identity the health check accepts.
+const DEEM_MODEL = 'deem-0.8-v1';
+// The Deem p50 the wall-time estimate cites, the 2-option p50 from deem-local.md.
+const DEEM_P50_MS = 65.6;
+// The one jev client version the gate accepts.
+const JEV_VERSION = 'jev 0.6.2';
+// The health probe is bounded so an unreachable backend skips fast.
+const HEALTH_TIMEOUT_MS = 2000;
+// Every measured call is bounded so one hung spawn cannot hang the run.
+const CALL_TIMEOUT_MS = 90000;
+// The single backoff retry a transient jev failure gets.
+const BACKOFF_MS = 2000;
+// The margin the keep rule requires between a column and the baseline.
+const MARGIN_LINE = 'margin: 0.10';
+// The keep rule fixed as one line, so a printed verdict can be rechecked by hand.
+const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C';
+// The power note fixed as one line: the five-win floor behind a keep.
+const POWER_LINE = 'power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031';
+// The usage line printed whenever the run cannot start.
+const USAGE = 'usage: score-severity-replay.cjs [--write-label-sheet <path>] [--labels <file>] [--jev] [--deem] [--out <dir>]';
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Run one git command and return its raw result instead of throwing, so the
+ * caller owns the failure decision. The tracked-file list runs past the 1 MiB
+ * default output bound, so the buffer is raised.
+ *
+ * @param {string[]} args - Arguments after `git`
+ * @param {Record<string, string | undefined>} [env] - Child environment; defaults to this process
+ * @returns {{ status: number | null, stdout: string, stderr: string }} Exit status and captured output
+ */
+function runGit(args, env = process.env) {
+  const result = spawnSync('git', args, {
+    cwd: process.cwd(),
+    env,
+    encoding: 'utf8',
+    maxBuffer: 256 * 1024 * 1024,
+  });
+  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
+}
+
+/**
+ * Resolve the repository root git reports for the current directory.
+ *
+ * @param {Function} git - Git runner returning { status, stdout, stderr }
+ * @returns {string} Absolute repository root
+ * @throws {Error} When the directory is not inside a git repository
+ */
+function repoRoot(git) {
+  const result = git(['rev-parse', '--show-toplevel']);
+  const root = result.stdout.trim();
+  if (result.status !== 0 || root === '') {
+    throw new Error('not a git repository');
+  }
+  return root;
+}
+
+/**
+ * List every path git tracks under a repository root.
+ *
+ * @param {Function} git - Git runner returning { status, stdout, stderr }
+ * @param {string} root - Repository root the listing reads from
+ * @returns {string[]} Repo-relative tracked paths
+ * @throws {Error} When the git listing fails
+ */
+function listTrackedFiles(git, root) {
+  const result = git(['-C', root, 'ls-files', '-z']);
+  if (result.status !== 0) {
+    throw new Error(`git ls-files failed: ${result.stderr.trim()}`);
+  }
+  return result.stdout.split('\0').filter((entry) => entry !== '');
+}
+
+/**
+ * Read every tracked review registry into a path-keyed map. Only files named
+ * `deep-review-findings-registry.json` are registries, and one that cannot be
+ * read or parsed stops the census rather than silently shrinking it.
+ *
+ * @param {string} root - Repository root the paths are relative to
+ * @param {string[]} files - Repo-relative tracked paths
+ * @returns {Map<string, object>} Registry path -> parsed registry
+ * @throws {Error} When a registry file cannot be read or parsed
+ */
+function loadRegistries(root, files) {
+  const registries = new Map();
+  for (const file of files) {
+    if (path.basename(file) !== 'deep-review-findings-registry.json') continue;
+    let registry;
+    try {
+      registry = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
+    } catch {
+      throw new Error(`cannot read registry ${file}`);
+    }
+    if (registry === null || typeof registry !== 'object' || Array.isArray(registry)) {
+      throw new Error(`cannot read registry ${file}`);
+    }
+    registries.set(file, registry);
+  }
+  return registries;
+}
+
+/**
+ * The stable identity of one finding row: its registry path and finding id.
+ *
+ * @param {string} registry - Repo-relative registry path
+ * @param {string} findingId - Finding id from the registry
+ * @returns {string} Row key shared by labels, answers and the call log
+ */
+function rowKey(registry, findingId) {
+  return `${registry}#${findingId}`;
+}
+
+/**
+ * The P0 rows of every registry, in registry and finding order. Both the open
+ * and resolved lists count, a row repeated in one registry is kept once at its
+ * first occurrence, and the id is `findingId ?? id`, since older registries
+ * name it either way.
+ *
+ * @param {Map<string, object>} registries - Registry path -> parsed registry
+ * @returns {Array<{ registry: string, findingId: string, title: string,
+ *   dimension: string, evidenceRefs: string[], recommendation: string }>} Deduped P0 rows
+ */
+function p0RowsOf(registries) {
+  const rows = [];
+  const seen = new Set();
+  for (const [registry, document] of registries) {
+    const open = Array.isArray(document.openFindings) ? document.openFindings : [];
+    const resolved = Array.isArray(document.resolvedFindings) ? document.resolvedFindings : [];
+    for (const finding of [...open, ...resolved]) {
+      if (finding === null || typeof finding !== 'object' || finding.severity !== 'P0') continue;
+      const findingId = finding.findingId ?? finding.id;
+      const key = rowKey(registry, findingId);
+      if (seen.has(key)) continue;
+      seen.add(key);
+      const refs = finding.evidenceRefs ?? finding.evidence;
+      rows.push({
+        registry,
+        findingId,
+        title: typeof finding.title === 'string' ? finding.title : '',
+        dimension: typeof finding.dimension === 'string' ? finding.dimension : '',
+        evidenceRefs: Array.isArray(refs) ? refs : typeof refs === 'string' && refs !== '' ? [refs] : [],
+        recommendation: typeof finding.recommendation === 'string' ? finding.recommendation : '',
+      });
+    }
+  }
+  return rows;
+}
+
+/**
+ * Census the loaded registries: registry count, findings by severity, the
+ * transition matrix, the deduped P0 rows and how those rows cluster by
+ * registry.
+ *
+ * @param {Map<string, object>} registries - Registry path -> parsed registry
+ * @returns {{
+ *   registries: number,
+ *   findings: number,
+ *   bySeverity: { P0: number, P1: number, P2: number, other: number },
+ *   transitions: Array<{ from: string | null, to: string | null, count: number }>,
+ *   p0Rows: Array<object>,
+ *   singleP0: number,
+ *   multiP0: number
+ * }} Census counts; transitions hold one entry per from/to pair, sorted by the
+ *   printed `from` then `to`
+ */
+function censusFindings(registries) {
+  const bySeverity = { P0: 0, P1: 0, P2: 0, other: 0 };
+  const pairs = new Map();
+  let findings = 0;
+  for (const document of registries.values()) {
+    const open = Array.isArray(document.openFindings) ? document.openFindings : [];
+    const resolved = Array.isArray(document.resolvedFindings) ? document.resolvedFindings : [];
+    for (const finding of [...open, ...resolved]) {
+      if (finding === null || typeof finding !== 'object') continue;
+      findings += 1;
+      if (finding.severity === 'P0' || finding.severity === 'P1' || finding.severity === 'P2') {
+        bySeverity[finding.severity] += 1;
+      } else {
+        bySeverity.other += 1;
+      }
+      const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
+      for (const transition of transitions) {
+        if (transition === null || typeof transition !== 'object') continue;
+        const from = transition.from ?? null;
+        const to = transition.to ?? null;
+        const key = `${from ?? 'none'} -> ${to ?? 'none'}`;
+        const pair = pairs.get(key) ?? { from, to, count: 0 };
+        pair.count += 1;
+        pairs.set(key, pair);
+      }
+    }
+  }
+  const p0Rows = p0RowsOf(registries);
+  const perRegistry = new Map();
+  for (const row of p0Rows) {
+    perRegistry.set(row.registry, (perRegistry.get(row.registry) ?? 0) + 1);
+  }
+  let singleP0 = 0;
+  let multiP0 = 0;
+  for (const count of perRegistry.values()) {
+    if (count === 1) singleP0 += 1;
+    else multiP0 += 1;
+  }
+  const transitions = [...pairs.values()].sort((left, right) => {
+    const leftFrom = left.from ?? 'none';
+    const rightFrom = right.from ?? 'none';
+    if (leftFrom !== rightFrom) return leftFrom < rightFrom ? -1 : 1;
+    const leftTo = left.to ?? 'none';
+    const rightTo = right.to ?? 'none';
+    return leftTo < rightTo ? -1 : leftTo > rightTo ? 1 : 0;
+  });
+  return { registries: registries.size, findings, bySeverity, transitions, p0Rows, singleP0, multiP0 };
+}
+
+/**
+ * Count how many tracked review iteration files hold each phrase. A file
+ * counts once per phrase, and only files under a review `iterations` folder
+ * named `iteration-*.md` are read.
+ *
+ * @param {string} root - Repository root the paths are relative to
+ * @param {string[]} files - Repo-relative tracked paths
+ * @param {string[]} phrases - Phrases to count, in print order
+ * @returns {{ files: number, hits: number[] }} Iteration file count and one hit count per phrase
+ * @throws {Error} When an iteration file cannot be read
+ */
+function countPhrases(root, files, phrases) {
+  const iterationFiles = files.filter((file) => file.includes('/review/')
+    && file.includes('/iterations/')
+    && /^iteration-.*\.md$/.test(path.basename(file)));
+  const hits = phrases.map(() => 0);
+  for (const file of iterationFiles) {
+    const text = fs.readFileSync(path.join(root, file), 'utf8');
+    for (let index = 0; index < phrases.length; index += 1) {
+      if (text.includes(phrases[index])) hits[index] += 1;
+    }
+  }
+  return { files: iterationFiles.length, hits };
+}
+
+/**
+ * The census block's printed lines, in order: registry count, findings by
+ * severity, one line per transition pair, P0 rows and their registry split,
+ * the phrase counts, and the label need that ends the census.
+ *
+ * @param {object} census - Result from censusFindings
+ * @param {{ files: number, hits: number[] }} phrases - Result from countPhrases
+ * @returns {string[]} Printed census lines
+ */
+function censusLines(census, phrases) {
+  const lines = [
+    `registries: ${census.registries}`,
+    `findings: ${census.findings} (P0 ${census.bySeverity.P0}, P1 ${census.bySeverity.P1}, P2 ${census.bySeverity.P2}, other ${census.bySeverity.other})`,
+  ];
+  for (const transition of census.transitions) {
+    lines.push(`transitions: ${transition.from ?? 'none'} -> ${transition.to ?? 'none'} ${transition.count}`);
+  }
+  lines.push(`p0 rows: ${census.p0Rows.length} in ${census.singleP0 + census.multiP0} registries (one ${census.singleP0}, two or more ${census.multiP0})`);
+  const counted = PHRASES.map((phrase, index) => `"${phrase}" ${phrases.hits[index] ?? 0}`);
+  lines.push(`phrases: ${phrases.files} review iteration files; ${counted.join('; ')}`);
+  lines.push(`labels needed: ${LABEL_GATE} P0 negatives among ${census.p0Rows.length} P0 rows`);
+  return lines;
+}
+
+/**
+ * The text a severity call reads for one row: its title, dimension, evidence
+ * refs and recommendation. The finding id never enters it, because ids such
+ * as `P2-001` carry the severity the call is meant to judge.
+ *
+ * @param {{ title: string, dimension: string, evidenceRefs: string[],
+ *   recommendation: string }} row - Row from p0RowsOf
+ * @returns {string} Row state handed to the model
+ */
+function buildRowState(row) {
+  const sections = [];
+  if (row.title !== '') sections.push(`Title: ${row.title}`);
+  if (row.dimension !== '') sections.push(`Dimension: ${row.dimension}`);
+  if (row.evidenceRefs.length > 0) sections.push(`Evidence refs:\n${row.evidenceRefs.join('\n')}`);
+  if (row.recommendation !== '') sections.push(`Recommendation: ${row.recommendation}`);
+  return sections.join('\n\n');
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. LABELS AND GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The label sheet's lines: one compact JSON object per P0 row, with the
+ * registry, finding id, title, dimension and evidence refs the operator reads
+ * while labeling, and an empty label to fill in. The finding id belongs here
+ * because the sheet is the operator's own file and never model input.
+ *
+ * @param {Array<{ registry: string, findingId: string, title: string,
+ *   dimension: string, evidenceRefs: string[] }>} rows - Rows from p0RowsOf
+ * @returns {string[]} One JSON line per row, in input order
+ */
+function buildLabelSheetLines(rows) {
+  return rows.map((row) => JSON.stringify({
+    registry: row.registry,
+    finding_id: row.findingId,
+    title: row.title,
+    dimension: row.dimension,
+    evidence_refs: row.evidenceRefs,
+    label: '',
+  }));
+}
+
+/**
+ * Write the label sheet and create any missing parent directory. A target
+ * that resolves inside the repository root is refused before anything is
+ * created: the labels are the operator's gold, and the sheet must stay
+ * outside the tree it is meant to judge.
+ *
+ * @param {string} target - Destination path for the sheet
+ * @param {string[]} lines - Lines from buildLabelSheetLines
+ * @param {string} root - Repository root the target must stay outside of
+ * @returns {number} Rows written
+ * @throws {Error} When the target resolves inside the repository root
+ */
+function writeLabelSheet(target, lines, root) {
+  const resolved = path.resolve(target);
+  const boundary = path.resolve(root);
+  if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
+    throw new Error('refusing to write the label sheet inside the repository');
+  }
+  fs.mkdirSync(path.dirname(resolved), { recursive: true });
+  const body = lines.length === 0 ? '' : `${lines.join('\n')}\n`;
+  fs.writeFileSync(resolved, body, 'utf8');
+  return lines.length;
+}
+
+/**
+ * Parse the operator's filled sheet into a row-keyed map. An empty label is
+ * kept as `''` so the caller can count it as dropped, while any value outside
+ * the four gold classes stops the run: a typo must shrink nothing quietly.
+ *
+ * @param {string} text - Filled sheet contents, one JSON object per line
+ * @returns {Map<string, '' | 'real' | 'P1' | 'P2' | 'not_a_finding'>} Row key -> label
+ * @throws {Error} When a row is not JSON, names no registry or finding id,
+ *   carries an unknown label, or repeats a row
+ */
+function parseLabels(text) {
+  const labels = new Map();
+  const lines = text.split('\n');
+  for (let index = 0; index < lines.length; index += 1) {
+    const row = index + 1;
+    if (lines[index].trim() === '') continue;
+    let parsed;
+    try {
+      parsed = JSON.parse(lines[index]);
+    } catch {
+      throw new Error(`labels row ${row}: not JSON`);
+    }
+    const isPlainObject = parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
+    const registry = isPlainObject ? parsed.registry : undefined;
+    const findingId = isPlainObject ? parsed.finding_id : undefined;
+    if (typeof registry !== 'string' || registry.length === 0) {
+      throw new Error(`labels row ${row}: registry must be a repo-relative path`);
+    }
+    if (typeof findingId !== 'string' || findingId.length === 0) {
+      throw new Error(`labels row ${row}: finding_id must be a finding id`);
+    }
+    const value = parsed.label;
+    if (value !== '' && value !== 'real' && value !== 'P1' && value !== 'P2' && value !== 'not_a_finding') {
+      throw new Error(`labels row ${row}: label must be "", real, P1, P2 or not_a_finding, got ${JSON.stringify(value)}`);
+    }
+    const key = rowKey(registry, findingId);
+    if (labels.has(key)) throw new Error(`labels row ${row}: duplicate row ${key}`);
+    labels.set(key, value);
+  }
+  return labels;
+}
+
+/**
+ * The label gate's state and the one line it prints. Fewer labeled negatives
+ * than the floor keeps every arm closed, and a baseline already right on more
+ * than nine rows in ten leaves no headroom for a column to show a gain.
+ *
+ * @param {number} K - Labeled rows
+ * @param {number} negatives - Rows labeled other than real
+ * @param {number} realRight - Rows labeled real
+ * @returns {{ state: 'label' | 'headroom' | 'open', line: string }} Gate state and printed line
+ */
+function gateLine(K, negatives, realRight) {
+  if (negatives < LABEL_GATE) {
+    return { state: 'label', line: `stop: fewer than ${LABEL_GATE} labeled P0 negatives` };
+  }
+  if (10 * realRight > 9 * K) {
+    return { state: 'headroom', line: 'no headroom' };
+  }
+  return { state: 'open', line: `gate: open K=${K} negatives=${negatives}` };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. KEEP RULE AND COLUMN
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Counts stay integers and the tails are exact (a BigInt sum over 2^trials),
+// so no rounding decides a verdict.
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
+  for (let index = 0; index <= trials; index += 1) {
+    if (index > 0) coefficient = (coefficient * BigInt(trials - index + 1)) / BigInt(index);
+    if (index >= successes) num += coefficient;
+  }
+  const den = 1n << BigInt(trials);
+  return { num, den, p: Number(num) / Number(den) };
+}
+
+/**
+ * The key most of a row's orders named. A key is modal only from two orders
+ * up, so three different keys leave the row without a modal pick and mark it
+ * unstable rather than quietly choosing one of them.
+ *
+ * @param {Array<{ pick: string | null }>} answers - One entry per call order
+ * @returns {{ pick: string | null, top: number }} Modal key and how many orders
+ *   named it, both empty when no key reached two orders
+ */
+function modalPick(answers) {
+  const counts = new Map();
+  for (const answer of answers) {
+    const key = answer?.pick;
+    if (typeof key !== 'string' || key === '') continue;
+    counts.set(key, (counts.get(key) ?? 0) + 1);
+  }
+  let pick = null;
+  let top = 0;
+  for (const [key, count] of counts) {
+    if (count > top) {
+      pick = key;
+      top = count;
+    }
+  }
+  if (top < ORDERS - 1) return { pick: null, top: 0 };
+  return { pick, top };
+}
+
+/**
+ * First failed check decides, in this order: coverage, kill, margin, sign
+ * test, flips. The exact loss tail kills before the margin is read, the sign
+ * test reads the win tail, and the flips check binds both backends because
+ * every row is judged in three orders. A later check never softens an earlier
+ * one.
+ *
+ * @param {{ backend: string, K: number, M: number, A: number, B: number,
+ *   W: number, L: number, F: number }} counts - Column counts
+ * @returns {{ outcome: 'keep' | 'kill' | 'stop',
+ *   reason: 'coverage' | 'margin' | 'sign test' | 'flips' | null,
+ *   p: number, pLoss: number }} Verdict with both exact tails
+ */
+function decideVerdict({ backend, K, M, A, B, W, L, F }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: win.p, pLoss: loss.p };
+  if (20n * loss.num < loss.den) return { outcome: 'kill', reason: null, p: win.p, pLoss: loss.p };
+  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: win.p, pLoss: loss.p };
+  if (!(20n * win.num < win.den)) return { outcome: 'stop', reason: 'sign test', p: win.p, pLoss: loss.p };
+  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: win.p, pLoss: loss.p };
+  return { outcome: 'keep', reason: null, p: win.p, pLoss: loss.p };
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
+ * One column's counts and verdict over the labeled rows. A row is measured
+ * only when its answer array holds one answer per order and every answer named
+ * a submitted key; every other row stays unmeasured. The column is right on a
+ * row when the modal pick is `P0` and the label is `real`, or the modal pick is
+ * `P1`, `P2` or `not_a_finding` and the label is not `real`, and an unstable
+ * row is always wrong. The baseline is the recorded severity, so it is right
+ * exactly where the label is `real`. F sums each measured row's non-modal
+ * picks, all three of them when no key is modal.
+ *
+ * @param {'jev' | 'deem'} backend - Backend name, printed on the verdict line
+ * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
+ * @param {Map<string, Array<{ pick: string | null }>>} answers - Row key (rowKey) -> one entry per order
+ * @param {(row: object) => boolean} baselineRight - Whether the recorded severity is right on a row
+ * @param {string} suffix - Identity text appended to the verdict line, empty for none
+ * @returns {{ backend: string, K: number, M: number, unmeasured: number,
+ *   A: number, B: number, W: number, L: number, F: number, p: number,
+ *   pLoss: number, outcome: string, reason: string | null, line: string }} Column summary
+ */
+function summarizeColumn(backend, rows, answers, baselineRight, suffix) {
+  const K = rows.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+  for (const row of rows) {
+    const values = answers.get(rowKey(row.registry, row.findingId));
+    if (!Array.isArray(values) || values.length !== ORDERS) continue;
+    if (!values.every((value) => OPTIONS.some((option) => option.key === value?.pick))) continue;
+    M += 1;
+    const { pick, top } = modalPick(values);
+    F += pick === null ? ORDERS : ORDERS - top;
+    const right = pick === 'P0' ? row.label === 'real' : pick !== null && row.label !== 'real';
+    const baseRight = baselineRight(row) === true;
+    if (right) A += 1;
+    if (baseRight) B += 1;
+    if (right && !baseRight) W += 1;
+    if (baseRight && !right) L += 1;
+  }
+  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F });
+  const outcome = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
+  let line = `verdict ${backend}: ${outcome} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(verdict.p)}`;
+  if (typeof suffix === 'string' && suffix.length > 0) line += ` ${suffix}`;
+  return {
+    backend,
+    K,
+    M,
+    unmeasured: K - M,
+    A,
+    B,
+    W,
+    L,
+    F,
+    p: verdict.p,
+    pLoss: verdict.pLoss,
+    outcome: verdict.outcome,
+    reason: verdict.reason,
+    line,
+  };
+}
+
+/**
+ * The reread-order line: for each registry with two or more labeled rows, at
+ * least one real row and at least one row carrying a P0 probability, the rank
+ * of its first real row when rows sort by the column's mean P0 probability,
+ * against the rank of the first real row in the registry's own order. Rows
+ * without a P0 probability leave the sort, so the line says how near the top
+ * the model put the rows the operator calls real. The ranks are means over the
+ * qualifying registries, one decimal.
+ *
+ * @param {'jev' | 'deem'} backend - Backend name, printed on the line
+ * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
+ * @param {Map<string, Array<{ p0Probability?: number | null }>>} answers - Row key (rowKey) -> one entry per order
+ * @returns {string | null} The order line, or null when no registry qualifies
+ */
+function orderLine(backend, rows, answers) {
+  const meanP0 = (values) => {
+    if (!Array.isArray(values)) return null;
+    let sum = 0;
+    let count = 0;
+    for (const value of values) {
+      if (Number.isFinite(value?.p0Probability)) {
+        sum += value.p0Probability;
+        count += 1;
+      }
+    }
+    return count === 0 ? null : sum / count;
+  };
+  const byRegistry = new Map();
+  for (const row of rows) {
+    if (!byRegistry.has(row.registry)) byRegistry.set(row.registry, []);
+    byRegistry.get(row.registry).push(row);
+  }
+  const firstRanks = [];
+  const recordedRanks = [];
+  for (const registryRows of byRegistry.values()) {
+    if (registryRows.length < 2) continue;
+    if (!registryRows.some((row) => row.label === 'real')) continue;
+    const ranked = registryRows
+      .map((row) => ({ row, p0: meanP0(answers.get(rowKey(row.registry, row.findingId))) }))
+      .filter((entry) => entry.p0 !== null);
+    if (!ranked.some((entry) => entry.row.label === 'real')) continue;
+    const sorted = [...ranked].sort((left, right) => right.p0 - left.p0);
+    firstRanks.push(sorted.findIndex((entry) => entry.row.label === 'real') + 1);
+    recordedRanks.push(ranked.findIndex((entry) => entry.row.label === 'real') + 1);
+  }
+  if (firstRanks.length === 0) return null;
+  const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
+  return `order ${backend}: registries=${firstRanks.length} first_real_rank=${mean(firstRanks).toFixed(1)} recorded=${mean(recordedRanks).toFixed(1)}`;
+}
+
+/**
+ * The funnel line: how many asked rows returned a noul and how many of those
+ * answered yes at 0.5 or more. The funnel is a report-only second view, so its
+ * line never enters a verdict.
+ *
+ * @param {'jev' | 'deem'} backend - Backend name, printed on the line
+ * @param {number} asked - Rows the funnel asked about
+ * @param {Array<number | null>} values - One noul per asked row, null when unmeasured
+ * @returns {string} The funnel line
+ */
+function funnelLine(backend, asked, values) {
+  let measured = 0;
+  let yes = 0;
+  for (const value of values) {
+    if (!Number.isFinite(value)) continue;
+    measured += 1;
+    if (value >= 0.5) yes += 1;
+  }
+  return `funnel ${backend}: asked=${asked} measured=${measured} yes=${yes} no=${measured - yes}`;
+}
+
+/**
+ * The exact line: how many negatives the column put in their labeled class,
+ * over the negatives that have a modal pick. A negative whose orders name
+ * three different keys has no pick and cannot match.
+ *
+ * @param {'jev' | 'deem'} backend - Backend name, printed on the line
+ * @param {Array<{ registry: string, findingId: string, label: string }>} rows - Labeled rows in registry order
+ * @param {Map<string, Array<{ pick: string | null }>>} answers - Row key (rowKey) -> one entry per order
+ * @returns {string} The exact line
+ */
+function exactLine(backend, rows, answers) {
+  let negatives = 0;
+  let exact = 0;
+  for (const row of rows) {
+    if (row.label === 'real') continue;
+    const values = answers.get(rowKey(row.registry, row.findingId));
+    if (!Array.isArray(values) || values.length !== ORDERS) continue;
+    const { pick } = modalPick(values);
+    if (pick === null) continue;
+    negatives += 1;
+    if (pick === row.label) exact += 1;
+  }
+  return `exact ${backend}: ${exact} of ${negatives} negatives`;
+}
+
+/**
+ * Nearest-rank percentile. An empty list has no rank.
+ *
+ * @param {number[]} values - Raw values
+ * @param {number} q - Quantile in (0, 1]
+ * @returns {number | null} The value at the nearest rank, or null for an empty list
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. DEEM GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Repo copy of the cli-deem entry point, run under node when none is on PATH,
+// so the arm works from a checkout without the client installed.
+const REPO_CLI_DEEM = path.resolve(__dirname, '../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped. A missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name - Executable file name
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched
+ * @returns {string | null} First executable match, or null when none is executable
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
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under
+ * node, so the arm still runs from a checkout without the client installed.
+ *
+ * @param {{ PATH?: string }} env - Environment whose PATH is searched
+ * @returns {string[]} Command and leading arguments for one call
+ */
+function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, or a wrong model
+ * is a failed check the caller prints as a skip. A stub backend also answers
+ * `ok`, so the backend name is read before the model.
+ *
+ * @param {string[]} cmd - Command from deemCommand
+ * @param {Record<string, string | undefined>} env - Environment for the call
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } |
+ *   { ok: false, reason: string, found: unknown }} Health result
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
+ * Prints the health line, or a skip line when the check fails, with the found
+ * value named for a model or shape failure so the operator can see what was
+ * there. A failed gate leaves every later line untouched.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx - Line writer and environment
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} True when the health check passed; a failed check carries the skip line it printed
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
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time, and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads stdin to EOF and exits 2 on an inherited
+ * terminal. A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn
+ * @param {string[]} args - Arguments after the executable
+ * @param {string} stdinText - Text written to stdin, then closed
+ * @param {Record<string, string | undefined>} env - Child environment
+ * @param {number} timeoutMs - Kill and resolve after this many milliseconds
+ * @returns {Promise<{ code: number | null, stdout: string, stderr: string,
+ *   wallMs: number, timedOut: boolean }>} Call result
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
+ * @param {string | undefined} outDir - Directory that holds calls.jsonl
+ * @returns {{ append: (record: object) => void }} Append-only call log
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
+ * @param {string | undefined} outDir - Directory that may hold report.json
+ * @returns {object | null} The parsed report, or null when outDir is empty, the
+ *   file is missing, or the file does not parse
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
+/**
+ * The row's call-log identity: a short digest of its registry and finding id,
+ * so a line records which row a call read while the id itself never leaves.
+ *
+ * @param {{ registry: string, findingId: string }} row - Row from p0RowsOf
+ * @returns {string} First 16 hex characters of sha256(registry#findingId)
+ */
+function rowDigest(row) {
+  return crypto.createHash('sha256').update(rowKey(row.registry, row.findingId)).digest('hex').slice(0, 16);
+}
+
+/**
+ * The option list rotated left by one position per order, so no key keeps the
+ * first position across the three calls and a position carries no advantage.
+ *
+ * @param {Array<{ key: string, description: string }>} options - Option list
+ * @param {number} order - Rotation index, 0 for the base order
+ * @returns {Array<{ key: string, description: string }>} Rotated copy
+ */
+function rotateOptions(options, order) {
+  return options.map((_, index) => options[(index + order) % options.length]);
+}
+
+/**
+ * The Deem arm: three choice calls per row, one per option order, then one
+ * funnel noul per row whose three severity calls each landed a submitted key.
+ * A severity call is measured when it exits 0 with a submitted key; a funnel
+ * call is measured when it exits 0 with a finite noul in [0, 1]. An exit-4
+ * severity call rechecks the health and retries once, because a dropped
+ * connection is not a judgment; the funnel never reruns, since it never
+ * decides. A stop prints its line and the rows finished, and leaves the
+ * column and verdict unprinted.
+ *
+ * @param {{ rows: Array<object>, baselineRight: (row: object) => boolean }} plan - Labeled rows and the baseline-right predicate
+ * @param {{ cmd: string[], model: string, modelCommit: string, sourceCommit: string }} gate - Passing deemGate result: command and health identity
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>,
+ *   timeoutMs: number, callLog: { append: (record: object) => void },
+ *   stored: object | null }} ctx - Line writer, environment, per-call timeout, call log and stored report
+ * @returns {Promise<{ column: object, requalify: string | null } |
+ *   { stopped: string, partialRows: number }>} The finished column or the stop line with the rows finished
+ */
+async function runDeemArm(plan, gate, ctx) {
+  const planned = (ORDERS + 1) * plan.rows.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 from deem-local.md`);
+
+  const answers = new Map();
+  const wallTimes = [];
+  let finished = 0;
+
+  /**
+   * One calls.jsonl record. A call that led to a stop or a retry carries no
+   * judgment, so its outcome fields stay empty.
+   */
+  function record(row, call, order, attempt, r, outcome, status) {
+    return {
+      backend: 'deem',
+      call,
+      row: rowDigest(row),
+      order,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      pick: outcome.pick ?? null,
+      pickProbability: outcome.pickProbability ?? null,
+      p0Probability: outcome.p0Probability ?? null,
+      noul: outcome.noul ?? null,
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
+  // A severity answer counts only when it names a submitted key; the same
+  // answer carries the probability of every option, P0 included.
+  function severityOutcome(r) {
+    let parsed;
+    try {
+      parsed = JSON.parse(r.stdout);
+    } catch {
+      // A body that does not parse is an unmeasured call, not a crash.
+    }
+    const answer = parsed?.answers?.answer;
+    const choice = answer?.choice;
+    if (typeof choice !== 'string' || !OPTIONS.some((option) => option.key === choice)) return null;
+    const probability = answer?.probabilities?.[choice];
+    const p0 = answer?.probabilities?.P0;
+    return {
+      pick: choice,
+      pickProbability: Number.isFinite(probability) ? probability : null,
+      p0Probability: Number.isFinite(p0) ? p0 : null,
+    };
+  }
+
+  // A funnel answer counts only when it is a finite probability.
+  function funnelNoul(r) {
+    let parsed;
+    try {
+      parsed = JSON.parse(r.stdout);
+    } catch {
+      // A body that does not parse leaves the funnel row unmeasured.
+    }
+    const value = parsed?.answers?.answer?.noul;
+    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
+  }
+
+  const timeoutMs = ctx.timeoutMs ?? CALL_TIMEOUT_MS;
+
+  for (const row of plan.rows) {
+    const state = buildRowState(row);
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = ['choice', '-q', QUESTION_SEVERITY];
+      for (const option of rotateOptions(OPTIONS, order)) args.push('-o', `${option.key}=${option.description}`);
+      const callArgs = [...gate.cmd.slice(1), ...args];
+      let attempt = 1;
+      let r = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, 'severity', order, attempt, r, {}, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        attempt = 2;
+        r = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let outcome = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        outcome = severityOutcome(r);
+        if (outcome !== null) status = 'measured';
+      } else if (r.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (r.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, 'severity', order, attempt, r, outcome ?? {}, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push({ pick: outcome?.pick ?? null, p0Probability: outcome?.p0Probability ?? null });
+    }
+    answers.set(rowKey(row.registry, row.findingId), picks);
+    finished += 1;
+  }
+
+  const measuredRows = plan.rows.filter((row) => {
+    const values = answers.get(rowKey(row.registry, row.findingId));
+    return Array.isArray(values)
+      && values.length === ORDERS
+      && values.every((value) => OPTIONS.some((option) => option.key === value?.pick));
+  });
+
+  const funnelValues = [];
+  for (const row of measuredRows) {
+    const state = buildRowState(row);
+    const callArgs = [...gate.cmd.slice(1), 'noul', '-q', QUESTION_FUNNEL];
+    const attempt = 1;
+    const r = await spawnCall(gate.cmd[0], callArgs, state, ctx.env, timeoutMs);
+    wallTimes.push(r.wallMs);
+
+    let noul = null;
+    let status = 'unmeasured';
+    let stopLine = null;
+    if (r.timedOut) {
+      status = 'unmeasured_timeout';
+    } else if (r.code === 0) {
+      noul = funnelNoul(r);
+      if (noul !== null) status = 'measured';
+    } else if (r.code === 2) {
+      stopLine = 'deem arm stopped: usage error';
+    } else if (r.code === 3) {
+      stopLine = 'deem arm stopped: backend refused';
+    } else if (r.code === 130) {
+      stopLine = 'deem arm stopped: interrupted';
+    }
+
+    ctx.callLog.append(record(row, 'funnel', null, attempt, r, noul === null ? {} : { noul }, status));
+    if (stopLine !== null) return stop(stopLine);
+    funnelValues.push(noul);
+  }
+
+  const column = summarizeColumn(
+    'deem',
+    plan.rows,
+    answers,
+    plan.baselineRight,
+    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
+  );
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column deem: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} p_loss=${formatP(column.pLoss)} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const orderLineText = orderLine('deem', plan.rows, answers);
+  if (orderLineText !== null) ctx.out(orderLineText);
+  ctx.out(funnelLine('deem', measuredRows.length, funnelValues));
+  ctx.out(exactLine('deem', plan.rows, answers));
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (storedDeem && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)) {
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
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. JEV GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Whether a registry path exists on the published branch. A registry that
+ * is not at origin/main holds text the hosted backend must not receive, so
+ * the arm withholds its rows rather than sending them.
+ *
+ * @param {Function} git - Git runner returning { status, stdout, stderr }
+ * @param {string} root - Repository root the path is relative to
+ * @param {string} registry - Repo-relative registry path
+ * @returns {boolean} True when origin/main holds the registry
+ */
+function isPublished(git, root, registry) {
+  const result = git(['-C', root, 'cat-file', '-e', `origin/main:${registry}`]);
+  return result.status === 0;
+}
+
+/**
+ * Identity line, then the pinned client version and a credential check under
+ * the one provider every later call reuses. A miss prints a skip line and
+ * leaves the census text already written; none of the checks sends a payload.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>,
+ *   timeoutMs?: number }} ctx - Line writer, environment and per-call timeout
+ * @returns {{ passed: boolean, path: string | null, provider: string, reason?: string }}
+ *   True when the gate passed; a failed gate carries the skip line it printed
+ */
+function jevGate(ctx) {
+  const provider = ctx.env.JEV_PROVIDER || 'official';
+  const jevPath = which('jev', ctx.env);
+  ctx.out(`jev: path=${jevPath ?? 'none'} provider=${provider}`);
+  if (jevPath === null) {
+    const skipLine = 'jev arm skipped: jev not on PATH';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, reason: skipLine };
+  }
+
+  const opts = {
+    env: ctx.env,
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+    timeout: ctx.timeoutMs ?? CALL_TIMEOUT_MS,
+  };
+  const version = spawnSync(jevPath, ['--version'], opts);
+  const trimmed = (version.stdout ?? '').trim();
+  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
+  if (found !== JEV_VERSION) {
+    const skipLine = 'jev arm skipped: version';
+    ctx.out(skipLine);
+    ctx.out(`jev: found=${JSON.stringify(found)} path=${jevPath}`);
+    return { passed: false, path: jevPath, provider, reason: skipLine };
+  }
+
+  const auth = spawnSync(jevPath, ['auth', 'status', '--provider', provider], opts);
+  if (auth.status !== 0) {
+    const skipLine = 'jev arm skipped: no credential';
+    ctx.out(skipLine);
+    return { passed: false, path: jevPath, provider, reason: skipLine };
+  }
+  return { passed: true, path: jevPath, provider };
+}
+
+/**
+ * The Jev arm: one auth test under one provider, then three choice calls per
+ * published row, one per option order, then one funnel noul per row whose
+ * three severity calls each landed a submitted key. A row whose registry is
+ * not at origin/main is withheld, gets no call and its lines read
+ * `unmeasured_unpublished`. A severity call is measured when it exits 0 with
+ * a submitted key; an exit-4 call waits once and retries, because a dropped
+ * connection is not a judgment; the funnel never reruns, since it never
+ * decides. A stop prints its line and the rows finished, and leaves the
+ * column and verdict unprinted.
+ *
+ * @param {{ rows: Array<object>, baselineRight: (row: object) => boolean }} plan - Labeled rows and the baseline-right predicate
+ * @param {{ path: string, provider: string }} gate - Passing jevGate result: client path and provider
+ * @param {{ out: (line: string) => void, env: Record<string, string | undefined>,
+ *   timeoutMs?: number, backoffMs?: number,
+ *   callLog: { append: (record: object) => void }, stored: object | null,
+ *   git: Function, root: string }} ctx - Line writer, environment, per-call
+ *   timeout, retry wait, call log, stored report and the git runner behind
+ *   the published check
+ * @returns {Promise<{ column: object, requalify: string | null } |
+ *   { stopped: string, partialRows: number }>} The finished column or the stop line with the rows finished
+ */
+async function runJevArm(plan, gate, ctx) {
+  const jevVersion = JEV_VERSION.split(' ')[1];
+  let chars = 0;
+  for (const row of plan.rows) {
+    const state = buildRowState(row);
+    chars += (state.length + QUESTION_SEVERITY.length) * ORDERS;
+    chars += state.length + QUESTION_FUNNEL.length;
+  }
+  ctx.out(`jev: payload: published review registry text; planned calls: ${(ORDERS + 1) * plan.rows.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  const timeoutMs = ctx.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = ctx.backoffMs ?? BACKOFF_MS;
+  const wallTimes = [];
+  let finished = 0;
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, timeoutMs);
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
+    call: 'auth_test',
+    row: null,
+    order: null,
+    attempt: 1,
+    wallMs: auth.wallMs,
+    exitCode: auth.code,
+    pick: null,
+    pickProbability: null,
+    p0Probability: null,
+    noul: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jevVersion,
+    provider: gate.provider,
+    model,
+  });
+  if (auth.code !== 0) {
+    if (auth.code === 3) return stop('jev arm stopped: key rejected');
+    if (auth.code === 130) return stop('jev arm stopped: interrupted');
+    return stop('jev arm stopped: usage error');
+  }
+  ctx.out(`jev: auth test provider=${gate.provider} model=${model}`);
+
+  const answers = new Map();
+
+  /**
+   * One calls.jsonl record. A call that led to a stop or a retry carries no
+   * judgment, so its outcome fields stay empty.
+   */
+  function record(row, call, order, attempt, r, outcome, status) {
+    return {
+      backend: 'jev',
+      call,
+      row: rowDigest(row),
+      order,
+      attempt,
+      wallMs: r.wallMs,
+      exitCode: r.code,
+      pick: outcome.pick ?? null,
+      pickProbability: outcome.pickProbability ?? null,
+      p0Probability: outcome.p0Probability ?? null,
+      noul: outcome.noul ?? null,
+      status,
+      jevVersion,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  // A severity answer counts only when it names a submitted key; the same
+  // answer carries the probability of every option, P0 included.
+  function severityOutcome(r) {
+    let parsed;
+    try {
+      parsed = JSON.parse(r.stdout);
+    } catch {
+      // A body that does not parse is an unmeasured call, not a crash.
+    }
+    const answer = parsed?.answers?.answer;
+    const choice = answer?.choice;
+    if (typeof choice !== 'string' || !OPTIONS.some((option) => option.key === choice)) return null;
+    const probability = answer?.probabilities?.[choice];
+    const p0 = answer?.probabilities?.P0;
+    return {
+      pick: choice,
+      pickProbability: Number.isFinite(probability) ? probability : null,
+      p0Probability: Number.isFinite(p0) ? p0 : null,
+    };
+  }
+
+  // A funnel answer counts only when it is a finite probability.
+  function funnelNoul(r) {
+    let parsed;
+    try {
+      parsed = JSON.parse(r.stdout);
+    } catch {
+      // A body that does not parse leaves the funnel row unmeasured.
+    }
+    const value = parsed?.answers?.answer?.noul;
+    return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
+  }
+
+  // One cat-file per registry keeps the published check from repeating for
+  // every row a registry holds.
+  const publishedByRegistry = new Map();
+  function isRegistryPublished(registry) {
+    if (!publishedByRegistry.has(registry)) {
+      publishedByRegistry.set(registry, isPublished(ctx.git, ctx.root, registry));
+    }
+    return publishedByRegistry.get(registry);
+  }
+
+  for (const row of plan.rows) {
+    if (!isRegistryPublished(row.registry)) {
+      for (let order = 0; order < ORDERS; order += 1) {
+        ctx.callLog.append(record(row, 'severity', order, 1, { code: null, wallMs: 0 }, {}, 'unmeasured_unpublished'));
+      }
+      finished += 1;
+      continue;
+    }
+
+    const state = buildRowState(row);
+    const picks = [];
+    for (let order = 0; order < ORDERS; order += 1) {
+      const args = ['choice', '--provider', gate.provider, '-q', QUESTION_SEVERITY];
+      for (const option of rotateOptions(OPTIONS, order)) args.push('-o', `${option.key}=${option.description}`);
+      let attempt = 1;
+      let r = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
+      wallTimes.push(r.wallMs);
+
+      if (!r.timedOut && r.code === 4) {
+        ctx.callLog.append(record(row, 'severity', order, attempt, r, {}, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, backoffMs));
+        attempt = 2;
+        r = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
+        wallTimes.push(r.wallMs);
+      }
+
+      let outcome = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (r.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (r.code === 0) {
+        outcome = severityOutcome(r);
+        if (outcome !== null) status = 'measured';
+      } else if (r.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (r.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (r.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, 'severity', order, attempt, r, outcome ?? {}, status));
+      if (stopLine !== null) return stop(stopLine);
+      picks.push({ pick: outcome?.pick ?? null, p0Probability: outcome?.p0Probability ?? null });
+    }
+    answers.set(rowKey(row.registry, row.findingId), picks);
+    finished += 1;
+  }
+
+  const measuredRows = plan.rows.filter((row) => {
+    const values = answers.get(rowKey(row.registry, row.findingId));
+    return Array.isArray(values)
+      && values.length === ORDERS
+      && values.every((value) => OPTIONS.some((option) => option.key === value?.pick));
+  });
+
+  const funnelValues = [];
+  for (const row of measuredRows) {
+    const state = buildRowState(row);
+    const callArgs = ['noul', '--provider', gate.provider, '-q', QUESTION_FUNNEL];
+    const attempt = 1;
+    const r = await spawnCall(gate.path, callArgs, state, ctx.env, timeoutMs);
+    wallTimes.push(r.wallMs);
+
+    let noul = null;
+    let status = 'unmeasured';
+    let stopLine = null;
+    if (r.timedOut) {
+      status = 'unmeasured_timeout';
+    } else if (r.code === 0) {
+      noul = funnelNoul(r);
+      if (noul !== null) status = 'measured';
+    } else if (r.code === 2) {
+      stopLine = 'jev arm stopped: usage error';
+    } else if (r.code === 3) {
+      stopLine = 'jev arm stopped: key rejected';
+    } else if (r.code === 130) {
+      stopLine = 'jev arm stopped: interrupted';
+    }
+
+    ctx.callLog.append(record(row, 'funnel', null, attempt, r, noul === null ? {} : { noul }, status));
+    if (stopLine !== null) return stop(stopLine);
+    funnelValues.push(noul);
+  }
+
+  const column = summarizeColumn(
+    'jev',
+    plan.rows,
+    answers,
+    plan.baselineRight,
+    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
+  );
+  const latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) };
+  ctx.out(`column jev: K=${column.K} measured=${column.M} unmeasured=${column.unmeasured} p_loss=${formatP(column.pLoss)} latency_p50_ms=${latency.p50 ?? 'none'} latency_p95_ms=${latency.p95 ?? 'none'}`);
+  const orderLineText = orderLine('jev', plan.rows, answers);
+  if (orderLineText !== null) ctx.out(orderLineText);
+  ctx.out(funnelLine('jev', measuredRows.length, funnelValues));
+  ctx.out(exactLine('jev', plan.rows, answers));
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
+// 8. MAIN AND REPORT
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The report one run writes to report.json. The census keeps its counts, the
+ * labels their digest and split, the baseline its summary, the gate its printed
+ * line, and each requested arm fills exactly one bucket: a finished column
+ * under columns, a stop under stopped, a skip under skipped. A finished column
+ * also records the line that explains a re-run.
+ *
+ * @param {{ census: object, labels: { sha256: string | null, K: number,
+ *   real: number, negatives: number, dropped: number },
+ *   baseline: { right: number, of: number }, gate: string,
+ *   jev?: object, deem?: object }} parts - Report inputs
+ * @returns {object} Report object ready for JSON.stringify
+ */
+function buildReport(parts) {
+  const { census, labels, baseline, gate, jev, deem } = parts;
+  const report = {
+    census,
+    labels,
+    baseline,
+    gate,
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
+      p: column.p,
+      pLoss: column.pLoss,
+      unmeasured: column.unmeasured,
+      latency: column.latency,
+    };
+    if (backend === 'deem') {
+      report.columns[backend].modelId = column.modelId;
+      report.columns[backend].modelCommit = column.modelCommit;
+      report.columns[backend].sourceCommit = column.sourceCommit;
+    } else {
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
+/**
+ * Parse the switches, census the tracked review registries, read the operator's
+ * labels, print the census, the keep rule and the gate, run the requested
+ * backend gates and arms in fixed order, and write report.json when an arm was
+ * requested. The default run spawns git only and writes no file.
+ *
+ * @param {string[]} argv - Arguments after the node and script paths
+ * @param {object} [deps] - Injected dependencies
+ * @param {(line: string) => void} [deps.out] - Line writer. Default writes the line plus '\n' to stdout.
+ * @param {(line: string) => void} [deps.err] - Line writer. Default writes the line plus '\n' to stderr.
+ * @param {Record<string, string | undefined>} [deps.env] - Model arm environment. Default process.env.
+ * @param {number} [deps.timeoutMs] - Model arm call timeout. Default 90000.
+ * @param {number} [deps.backoffMs] - Model arm retry wait. Default 2000.
+ * @param {Function} [deps.git] - Git runner returning { status, stdout, stderr }. Default runGit.
+ * @returns {Promise<number>} 0 = report printed, 2 = bad invocation or unreadable input
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? BACKOFF_MS;
+  const git = deps.git ?? runGit;
+
+  let values;
+  try {
+    ({ values } = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        'write-label-sheet': { type: 'string' },
+        labels: { type: 'string' },
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
+  // A model call whose outcome is never recorded cannot be inspected later,
+  // so an arm without an output directory is refused before anything runs.
+  if ((values.jev === true || values.deem === true) && (typeof values.out !== 'string' || values.out === '')) {
+    err(values.jev === true
+      ? '--jev needs --out <dir> so every call is recorded'
+      : '--deem needs --out <dir> so every call is recorded');
+    return 2;
+  }
+
+  let root;
+  try {
+    root = repoRoot(git);
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  const sheetTarget = typeof values['write-label-sheet'] === 'string' && values['write-label-sheet'] !== ''
+    ? values['write-label-sheet']
+    : null;
+  // The labels are the operator's gold and have to stay outside the tree they
+  // judge, so a target inside it is refused before the census reads a file.
+  if (sheetTarget !== null) {
+    const resolved = path.resolve(sheetTarget);
+    const boundary = path.resolve(root);
+    if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
+      err('refusing to write the label sheet inside the repository');
+      return 2;
+    }
+  }
+
+  let census;
+  let phrases;
+  let labels;
+  let labelsSha = null;
+  try {
+    const files = listTrackedFiles(git, root);
+    census = censusFindings(loadRegistries(root, files));
+    phrases = countPhrases(root, files, PHRASES);
+    if (typeof values.labels === 'string' && values.labels !== '') {
+      const bytes = fs.readFileSync(values.labels);
+      labels = parseLabels(bytes.toString('utf8'));
+      labelsSha = crypto.createHash('sha256').update(bytes).digest('hex');
+    } else {
+      labels = new Map();
+    }
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    return 2;
+  }
+
+  for (const line of censusLines(census, phrases)) out(line);
+
+  if (sheetTarget !== null) {
+    try {
+      const written = writeLabelSheet(sheetTarget, buildLabelSheetLines(census.p0Rows), root);
+      out(`label sheet: ${sheetTarget} rows=${written}`);
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+  }
+
+  const labeledRows = [];
+  const labelCounts = { real: 0, P1: 0, P2: 0, not_a_finding: 0 };
+  for (const row of census.p0Rows) {
+    const label = labels.get(rowKey(row.registry, row.findingId));
+    if (label === undefined || label === '') continue;
+    labelCounts[label] += 1;
+    labeledRows.push({ ...row, label });
+  }
+  const K = labeledRows.length;
+  const negatives = K - labelCounts.real;
+  const dropped = labels.size - K;
+
+  out(labelsSha === null ? 'labels: none' : `labels: sha256=${labelsSha} rows=${labels.size}`);
+  out(`labeled: ${K} (real ${labelCounts.real}, P1 ${labelCounts.P1}, P2 ${labelCounts.P2}, not_a_finding ${labelCounts.not_a_finding})`);
+  out(`labels dropped: ${dropped}`);
+  out(`baseline: right ${labelCounts.real} of ${K}`);
+  out(`question: ${QUESTION_SEVERITY}`);
+  out(MARGIN_LINE);
+  out(KEEP_RULE_LINE);
+  out(POWER_LINE);
+
+  const gate = gateLine(K, negatives, labelCounts.real);
+  out(gate.line);
+
+  const armRequested = values.jev === true || values.deem === true;
+  const stored = armRequested ? readStoredReport(values.out) : null;
+  const callLog = createCallLog(values.out);
+  const plan = { rows: labeledRows, baselineRight: (row) => row.label === 'real' };
+
+  let jevResult;
+  if (values.jev === true) {
+    if (gate.state !== 'open') {
+      const line = gate.state === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
+      out(line);
+      jevResult = { skipped: line };
+    } else {
+      const jev = jevGate({ out, env, timeoutMs });
+      jevResult = jev.passed
+        ? await runJevArm(plan, jev, { out, env, timeoutMs, backoffMs, callLog, stored, git, root })
+        : { skipped: jev.reason };
+    }
+  }
+
+  let deemResult;
+  if (values.deem === true) {
+    if (gate.state !== 'open') {
+      const line = gate.state === 'headroom' ? 'deem arm skipped: no headroom' : 'deem arm skipped: label gate';
+      out(line);
+      deemResult = { skipped: line };
+    } else {
+      const deem = deemGate({ out, env });
+      deemResult = deem.passed
+        ? await runDeemArm(plan, deem, { out, env, timeoutMs, callLog, stored })
+        : { skipped: deem.reason };
+    }
+  }
+
+  if (armRequested) {
+    const report = buildReport({
+      census,
+      labels: { sha256: labelsSha, K, real: labelCounts.real, negatives, dropped },
+      baseline: { right: labelCounts.real, of: K },
+      gate: gate.line,
+      jev: jevResult,
+      deem: deemResult,
+    });
+    fs.mkdirSync(values.out, { recursive: true });
+    fs.writeFileSync(path.join(values.out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
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
+  QUESTION_SEVERITY,
+  QUESTION_FUNNEL,
+  OPTIONS,
+  PHRASES,
+  LABEL_GATE,
+  ORDERS,
+  DEEM_MODEL,
+  DEEM_P50_MS,
+  JEV_VERSION,
+  HEALTH_TIMEOUT_MS,
+  CALL_TIMEOUT_MS,
+  BACKOFF_MS,
+  MARGIN_LINE,
+  KEEP_RULE_LINE,
+  POWER_LINE,
+  USAGE,
+  runGit,
+  repoRoot,
+  listTrackedFiles,
+  loadRegistries,
+  p0RowsOf,
+  rowKey,
+  censusFindings,
+  countPhrases,
+  censusLines,
+  buildRowState,
+  buildLabelSheetLines,
+  writeLabelSheet,
+  parseLabels,
+  gateLine,
+  binomialTail,
+  modalPick,
+  decideVerdict,
+  formatP,
+  summarizeColumn,
+  orderLine,
+  funnelLine,
+  exactLine,
+  nearestRank,
+  which,
+  deemCommand,
+  readDeemHealth,
+  deemGate,
+  spawnCall,
+  createCallLog,
+  readStoredReport,
+  runDeemArm,
+  isPublished,
+  jevGate,
+  runJevArm,
+  buildReport,
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
diff --git a/.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts
new file mode 100644
index 0000000000..e89a2d5dff
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-severity-replay.vitest.ts
@@ -0,0 +1,1048 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-severity-replay
+//   Census core (runGit, repoRoot, listTrackedFiles, loadRegistries,
+//   p0RowsOf, rowKey, censusFindings, countPhrases, censusLines)
+//   Row state (buildRowState)
+//   Labels and gate (buildLabelSheetLines, writeLabelSheet, parseLabels,
+//   gateLine)
+//   Keep rule and column (binomialTail, modalPick, decideVerdict, formatP,
+//   summarizeColumn, orderLine, funnelLine, exactLine, nearestRank)
+//   Deem gate and arm (which, deemCommand, readDeemHealth, deemGate,
+//   spawnCall, createCallLog, readStoredReport, runDeemArm)
+//   Jev gate and arm (jevGate, isPublished, runJevArm)
+//   Main and report (buildReport, main)
+// ───────────────────────────────────────────────────────────────────
+
+import { createHash } from 'node:crypto';
+import path from 'node:path';
+import fs from 'node:fs';
+import os from 'node:os';
+import { createRequire } from 'node:module';
+import { fileURLToPath } from 'node:url';
+import { afterEach, describe, expect, it } from 'vitest';
+
+const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
+const require = createRequire(import.meta.url);
+const replay = require(path.join(TEST_DIR, '../../scripts/score-severity-replay.cjs')) as Record<string, any>;
+
+const tempDirs: string[] = [];
+
+function tempDir(prefix: string): string {
+  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
+  tempDirs.push(dir);
+  return dir;
+}
+
+afterEach(() => {
+  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
+});
+
+function writeFileAt(root: string, file: string, text: string): void {
+  const target = path.join(root, file);
+  fs.mkdirSync(path.dirname(target), { recursive: true });
+  fs.writeFileSync(target, text, 'utf8');
+}
+
+function writeRegistry(root: string, file: string, registry: Record<string, unknown>): void {
+  writeFileAt(root, file, JSON.stringify(registry));
+}
+
+function finding(fields: Record<string, unknown>): Record<string, unknown> {
+  return { severity: 'P1', title: 'Fixture finding', ...fields };
+}
+
+function censusLinesOf(root: string, files: string[]): string[] {
+  const registries = replay.loadRegistries(root, files);
+  const phrases = replay.countPhrases(root, files, replay.PHRASES);
+  return replay.censusLines(replay.censusFindings(registries), phrases);
+}
+
+describe('score-severity-replay census', () => {
+  it("census counts a fixture's P0 rows and transitions", () => {
+    const root = tempDir('severity-replay-census-');
+    const files = [
+      'alpha/review/deep-review-findings-registry.json',
+      'beta/review/deep-review-findings-registry.json',
+    ];
+    writeRegistry(root, files[0], {
+      openFindings: [
+        finding({
+          findingId: 'A-001',
+          severity: 'P0',
+          title: 'Alpha',
+          dimension: 'correctness',
+          transitions: [{ iteration: 1, from: null, to: 'P0' }],
+        }),
+        finding({ findingId: 'A-002', severity: 'P1', title: 'Beta', dimension: 'security' }),
+      ],
+      resolvedFindings: [],
+    });
+    writeRegistry(root, files[1], {
+      openFindings: [
+        finding({ findingId: 'B-001', severity: 'P0', title: 'Gamma', dimension: 'maintainability' }),
+        finding({
+          findingId: 'B-002',
+          severity: 'P2',
+          title: 'Delta',
+          dimension: 'traceability',
+          transitions: [{ iteration: 2, from: 'P1', to: 'P2' }],
+        }),
+      ],
+    });
+
+    const lines = censusLinesOf(root, files);
+
+    expect(lines).toContain('registries: 2');
+    expect(lines).toContain('findings: 4 (P0 2, P1 1, P2 1, other 0)');
+    const transitions = lines.filter((line) => line.startsWith('transitions: ')).sort();
+    expect(transitions).toEqual(['transitions: P1 -> P2 1', 'transitions: none -> P0 1']);
+    expect(lines).toContain('p0 rows: 2 in 2 registries (one 2, two or more 0)');
+  });
+
+  it('phrase counter finds a planted phrase', () => {
+    const root = tempDir('severity-replay-phrases-');
+    const files = [
+      'one/review/iterations/iteration-001.md',
+      'two/review/iterations/iteration-002.md',
+    ];
+    writeFileAt(root, files[0], 'The reviewer moved the finding from P0 to P1 after the self-check.\n');
+    writeFileAt(root, files[1], 'No rejected-P0 phrase appears in this iteration.\n');
+
+    const counts = replay.countPhrases(root, files, replay.PHRASES);
+    const line = censusLinesOf(root, files).find((entry) => entry.startsWith('phrases: '));
+
+    expect(counts.files).toBe(2);
+    expect(counts.hits).toEqual([0, 1, 0, 0, 0]);
+    expect(line).toBe('phrases: 2 review iteration files; "downgraded from P0" 0; "from P0 to P1" 1; "from P0 to P2" 0; "retracted from P0" 0; "P0 was retracted" 0');
+  });
+
+  it('an unreadable registry exits 2', () => {
+    const root = tempDir('severity-replay-bad-');
+    const file = 'review/deep-review-findings-registry.json';
+    // The loader's refusal is the message the entrypoint maps to exit 2.
+    writeFileAt(root, file, '{ not json');
+
+    expect(() => replay.loadRegistries(root, [file])).toThrow(`cannot read registry ${file}`);
+  });
+
+  it('a duplicate P0 row dedupes by registry and finding id', () => {
+    const root = tempDir('severity-replay-dupe-');
+    const file = 'review/deep-review-findings-registry.json';
+    writeRegistry(root, file, {
+      openFindings: [
+        finding({ findingId: 'D-001', severity: 'P0', title: 'Once' }),
+        finding({ findingId: 'D-001', severity: 'P0', title: 'Twice' }),
+      ],
+    });
+
+    const lines = censusLinesOf(root, [file]);
+
+    expect(lines).toContain('p0 rows: 1 in 1 registries (one 1, two or more 0)');
+  });
+
+  it('the finding id never enters the row state', () => {
+    const root = tempDir('severity-replay-state-');
+    const file = 'review/deep-review-findings-registry.json';
+    writeRegistry(root, file, {
+      openFindings: [finding({ findingId: 'P2-001', severity: 'P0', title: 'T' })],
+    });
+
+    const rows = replay.p0RowsOf(replay.loadRegistries(root, [file]));
+    const state = replay.buildRowState(rows[0]);
+
+    expect(state).toContain('T');
+    expect(state).not.toContain('P2-001');
+  });
+});
+
+describe('score-severity-replay labels and gate', () => {
+  it('the label sheet writes outside the repository', () => {
+    const root = tempDir('severity-replay-sheet-root-');
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const rows = replay.p0RowsOf(new Map([[
+      registry,
+      { openFindings: [finding({ findingId: 'A-001', severity: 'P0', title: 'Alpha', dimension: 'correctness', evidenceRefs: ['specs/a.md'] })] },
+    ]]));
+    const target = path.join(tempDir('severity-replay-sheet-out-'), 'labels.jsonl');
+
+    const lines = replay.buildLabelSheetLines(rows);
+    const written = replay.writeLabelSheet(target, lines, root);
+
+    expect(written).toBe(1);
+    expect(lines).toHaveLength(1);
+    const filled = fs.readFileSync(target, 'utf8').trim().split('\n');
+    expect(filled).toHaveLength(1);
+    const parsed = JSON.parse(filled[0]) as Record<string, unknown>;
+    expect(Object.keys(parsed)).toEqual(['registry', 'finding_id', 'title', 'dimension', 'evidence_refs', 'label']);
+    expect(parsed).toEqual({
+      registry,
+      finding_id: 'A-001',
+      title: 'Alpha',
+      dimension: 'correctness',
+      evidence_refs: ['specs/a.md'],
+      label: '',
+    });
+  });
+
+  it('the label sheet refuses a path inside the repository', () => {
+    const root = tempDir('severity-replay-sheet-refuse-');
+    const target = path.join(root, 'specs', 'tmp-labels.jsonl');
+
+    expect(() => replay.writeLabelSheet(target, [], root)).toThrow('refusing to write the label sheet inside the repository');
+    expect(fs.existsSync(target)).toBe(false);
+    expect(fs.existsSync(path.dirname(target))).toBe(false);
+  });
+
+  it('the label reader rejects an unknown label', () => {
+    const row = JSON.stringify({
+      registry: 'alpha/review/deep-review-findings-registry.json',
+      finding_id: 'A-001',
+      title: 'Alpha',
+      dimension: 'correctness',
+      evidence_refs: [],
+      label: 'maybe',
+    });
+
+    expect(() => replay.parseLabels(row)).toThrow('labels row 1: label must be "", real, P1, P2 or not_a_finding, got "maybe"');
+  });
+
+  it('the label reader drops an empty label', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const rows = [
+      JSON.stringify({ registry, finding_id: 'A-001', title: 'Alpha', dimension: 'correctness', evidence_refs: [], label: '' }),
+      JSON.stringify({ registry, finding_id: 'A-002', title: 'Beta', dimension: 'correctness', evidence_refs: [], label: 'real' }),
+    ];
+
+    const labels = replay.parseLabels(`${rows.join('\n')}\n`);
+    const labeled = [...labels.values()].filter((value: string) => value !== '');
+    const counts = { real: 0, P1: 0, P2: 0, not_a_finding: 0 };
+    for (const value of labeled) counts[value as keyof typeof counts] += 1;
+
+    expect(labeled).toHaveLength(1);
+    expect(counts).toEqual({ real: 1, P1: 0, P2: 0, not_a_finding: 0 });
+    expect(labels.size - labeled.length).toBe(1);
+  });
+
+  it('the gate stops at 19 negatives', () => {
+    const gate = replay.gateLine(20, 19, 1);
+
+    expect(gate.state).toBe('label');
+    expect(gate.line).toBe('stop: fewer than 20 labeled P0 negatives');
+  });
+
+  it('the gate passes at 20 negatives', () => {
+    const gate = replay.gateLine(20, 20, 0);
+
+    expect(gate.state).toBe('open');
+    expect(gate.line).toBe('gate: open K=20 negatives=20');
+  });
+
+  it('no headroom prints above 90 percent', () => {
+    const gate = replay.gateLine(201, 20, 181);
+
+    expect(gate.state).toBe('headroom');
+    expect(gate.line).toBe('no headroom');
+  });
+});
+
+describe('score-severity-replay keep rule', () => {
+  it('the verdict prints keep', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const rows = [
+      ...Array.from({ length: 20 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' })),
+      ...Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' })),
+    ];
+    const answers = new Map(rows.map((row) => [
+      replay.rowKey(row.registry, row.findingId),
+      Array.from({ length: 3 }, () => ({ pick: row.label === 'real' ? 'P0' : 'P1' })),
+    ]));
+
+    const column = replay.summarizeColumn(
+      'deem',
+      rows,
+      answers,
+      (row: any) => row.label === 'real',
+      'model=deem-0.8-v1 model_commit=m1 source_commit=s1',
+    );
+
+    expect(column.K).toBe(30);
+    expect(column.M).toBe(30);
+    expect(column.A).toBe(30);
+    expect(column.B).toBe(20);
+    expect(column.W).toBe(10);
+    expect(column.L).toBe(0);
+    expect(column.F).toBe(0);
+    expect(column.outcome).toBe('keep');
+    expect(column.reason).toBe(null);
+    expect(column.pLoss).toBe(1);
+    expect(column.line).toBe('verdict deem: keep K=30 M=30 A=30 B=20 W=10 L=0 F=0 p=0.0009766 model=deem-0.8-v1 model_commit=m1 source_commit=s1');
+    expect(replay.binomialTail(5, 5).num).toBe(1n);
+    expect(replay.binomialTail(5, 5).den).toBe(32n);
+  });
+
+  it('the verdict prints kill', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const realRight = Array.from({ length: 12 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' }));
+    const realWrong = Array.from({ length: 8 }, (_, index) => ({ registry, findingId: `X-${index}`, label: 'real' }));
+    const negatives = Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
+    const rows = [...realRight, ...realWrong, ...negatives];
+    const answers = new Map<string, Array<{ pick: string }>>();
+    for (const row of realRight) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));
+    for (const row of realWrong) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
+    for (const row of negatives) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));
+
+    const column = replay.summarizeColumn('deem', rows, answers, (row: any) => row.label === 'real', '');
+
+    expect(column.A).toBe(12);
+    expect(column.B).toBe(20);
+    expect(column.W).toBe(0);
+    expect(column.L).toBe(8);
+    expect(column.outcome).toBe('kill');
+    expect(column.reason).toBe(null);
+    expect(column.line).toBe('verdict deem: kill K=30 M=30 A=12 B=20 W=0 L=8 F=0 p=1.000');
+  });
+
+  it('the verdict prints stop (coverage)', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const real = Array.from({ length: 20 }, (_, index) => ({ registry, findingId: `R-${index}`, label: 'real' }));
+    const negatives = Array.from({ length: 10 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
+    const rows = [...real, ...negatives];
+    const answers = new Map<string, Array<{ pick: string | null }>>();
+    for (const row of real) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P0' })));
+    for (const row of negatives.slice(0, 6)) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
+    for (const row of negatives.slice(6)) answers.set(replay.rowKey(row.registry, row.findingId), [{ pick: null }, { pick: null }, { pick: null }]);
+
+    const column = replay.summarizeColumn('deem', rows, answers, (row: any) => row.label === 'real', '');
+
+    expect(column.K).toBe(30);
+    expect(column.M).toBe(26);
+    expect(column.outcome).toBe('stop');
+    expect(column.reason).toBe('coverage');
+    expect(column.line.startsWith('verdict deem: stop (coverage) K=30 M=26 ')).toBe(true);
+  });
+
+  it('three different keys make a row unstable and count as wrong', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const rows = Array.from({ length: 6 }, (_, index) => ({ registry, findingId: `N-${index}`, label: 'P1' }));
+    const answers = new Map<string, Array<{ pick: string }>>();
+    for (const row of rows.slice(0, 5)) answers.set(replay.rowKey(row.registry, row.findingId), Array.from({ length: 3 }, () => ({ pick: 'P1' })));
+    const unstable = rows[5];
+    answers.set(replay.rowKey(unstable.registry, unstable.findingId), [{ pick: 'P0' }, { pick: 'P1' }, { pick: 'P2' }]);
+
+    expect(replay.modalPick([{ pick: 'P0' }, { pick: 'P1' }, { pick: 'P2' }])).toEqual({ pick: null, top: 0 });
+
+    const column = replay.summarizeColumn('deem', rows, answers, () => false, '');
+
+    expect(column.M).toBe(6);
+    expect(column.A).toBe(5);
+    expect(column.F).toBe(3);
+    expect(column.outcome).toBe('stop');
+    expect(column.reason).toBe('flips');
+    expect(column.line.startsWith('verdict deem: stop (flips) K=6 M=6 A=5 B=0 W=5 L=0 F=3 ')).toBe(true);
+  });
+
+  it('stops on the sign test when the win tail is not below 0.05', () => {
+    const verdict = replay.decideVerdict({ backend: 'deem', K: 30, M: 30, A: 23, B: 20, W: 3, L: 0, F: 0 });
+
+    expect(verdict.outcome).toBe('stop');
+    expect(verdict.reason).toBe('sign test');
+    expect(replay.formatP(verdict.p)).toBe('0.1250');
+  });
+
+  it('the reread order line prints without moving the verdict', () => {
+    const registry = 'alpha/review/deep-review-findings-registry.json';
+    const rows = [
+      { registry, findingId: 'A-001', label: 'P1' },
+      { registry, findingId: 'A-002', label: 'real' },
+      { registry, findingId: 'A-003', label: 'P2' },
+    ];
+    const answers = new Map<string, Array<{ pick: string; p0Probability: number }>>([
+      [replay.rowKey(registry, 'A-001'), Array.from({ length: 3 }, () => ({ pick: 'P1', p0Probability: 0.1 }))],
+      [replay.rowKey(registry, 'A-002'), Array.from({ length: 3 }, () => ({ pick: 'P0', p0Probability: 0.9 }))],
+      [replay.rowKey(registry, 'A-003'), Array.from({ length: 3 }, () => ({ pick: 'P2', p0Probability: 0.2 }))],
+    ]);
+
+    const before = replay.summarizeColumn('deem', rows, answers, (row: any) => row.label === 'real', '');
+    const line = replay.orderLine('deem', rows, answers);
+    const after = replay.summarizeColumn('deem', rows, answers, (row: any) => row.label === 'real', '');
+
+    expect(line).toBe('order deem: registries=1 first_real_rank=1.0 recorded=2.0');
+    expect(after.line).toBe(before.line);
+  });
+});
+
+describe('score-severity-replay deem gate and arm', () => {
+  type ArmRow = {
+    registry: string;
+    findingId: string;
+    label: string;
+    title: string;
+    dimension: string;
+    evidenceRefs: string[];
+    recommendation: string;
+  };
+
+  const REGISTRY = 'alpha/review/deep-review-findings-registry.json';
+  const DEEM_HEALTHY = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';
+  const DEEM_CHOICE_AND_FUNNEL = [
+    DEEM_HEALTHY,
+    'if [ "$1" = noul ]; then echo \'{"answers":{"answer":{"noul":0.9}}}\'; exit 0; fi',
+    'p=$(cat)',
+    'echo \'{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}\'',
+  ].join('\n');
+  const DEEM_NEW_PAIR = [
+    'if [ "$1" = health ]; then',
+    '  n=$(cat "$D/health-n" 2>/dev/null || echo 0); n=$((n+1)); echo "$n" > "$D/health-n"',
+    '  mc=m1; if [ "$n" -gt 1 ]; then mc=m2; fi',
+    '  echo "{\\"ok\\":true,\\"backend\\":\\"torch\\",\\"model\\":\\"deem-0.8-v1\\",\\"model_commit\\":\\"$mc\\",\\"source_commit\\":\\"s1\\"}"',
+    '  exit 0',
+    'fi',
+    'p=$(cat)',
+    'if [ "$1" = choice ] && [ ! -f "$D/called" ]; then touch "$D/called"; exit 4; fi',
+    'echo \'{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}\'',
+  ].join('\n');
+
+  function stubDir(bodies: Record<string, string>): string {
+    const dir = tempDir('severity-replay-stubs-');
+    for (const [name, body] of Object.entries(bodies)) {
+      const file = path.join(dir, name);
+      fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
+      fs.chmodSync(file, 0o755);
+    }
+    return dir;
+  }
+
+  function armEnv(stubs: string): NodeJS.ProcessEnv {
+    return { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+  }
+
+  function readCalls(out: string): any[] {
+    return fs
+      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
+      .trim()
+      .split('\n')
+      .map((line) => JSON.parse(line));
+  }
+
+  function planOf(rows: Array<{ findingId: string; label: string }>): { rows: ArmRow[]; baselineRight: (row: ArmRow) => boolean } {
+    return {
+      rows: rows.map((row) => ({
+        registry: REGISTRY,
+        findingId: row.findingId,
+        label: row.label,
+        title: 'Fixture finding',
+        dimension: 'correctness',
+        evidenceRefs: ['specs/x.md'],
+        recommendation: 'Fix it.',
+      })),
+      baselineRight: (row) => row.label === 'real',
+    };
+  }
+
+  it('the Deem gate passes a fake health', () => {
+    const stubs = stubDir({ 'cli-deem': DEEM_HEALTHY });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    expect(replay.which('cli-deem', env)).toBe(path.join(stubs, 'cli-deem'));
+    expect(gate.passed).toBe(true);
+    expect(gate.cmd[0]).toBe(path.join(stubs, 'cli-deem'));
+    expect(lines).toEqual(['deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1']);
+    expect(fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
+  });
+
+  it('the Deem gate skips a stub backend', () => {
+    const stubs = stubDir({
+      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+    });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    expect(gate.passed).toBe(false);
+    expect(gate.reason).toBe('deem arm skipped: stub backend');
+    expect(lines).toEqual(['deem arm skipped: stub backend']);
+    expect(fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n')).toEqual(['health']);
+  });
+
+  it('a Deem exit 4 with a new pair stops the arm', async () => {
+    const stubs = stubDir({ 'cli-deem': DEEM_NEW_PAIR });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-deem-stop-');
+    const plan = planOf([
+      { findingId: 'N-1', label: 'P1' },
+      { findingId: 'N-2', label: 'P1' },
+    ]);
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    const result = await replay.runDeemArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+    });
+
+    expect(gate.passed).toBe(true);
+    expect(result.stopped).toBe('deem arm stopped: model commit changed mid-run');
+    expect(result.partialRows).toBe(0);
+    expect(lines).toContain('deem arm stopped: model commit changed mid-run');
+    expect(lines).toContain('deem: partial rows=0');
+    expect(lines.some((line) => line.startsWith('verdict deem:'))).toBe(false);
+
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(1);
+    expect(calls[0].call).toBe('severity');
+    expect(calls[0].exitCode).toBe(4);
+    expect(calls[0].status).toBe('unmeasured');
+  });
+
+  it('the funnel asks one noul per measured row and never decides', async () => {
+    const stubs = stubDir({ 'cli-deem': DEEM_CHOICE_AND_FUNNEL });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-deem-funnel-');
+    const plan = planOf(Array.from({ length: 6 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    const result = await replay.runDeemArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+    });
+
+    expect(result.stopped).toBeUndefined();
+    expect(lines).toContain('funnel deem: asked=6 measured=6 yes=6 no=0');
+    const funnelIndex = lines.indexOf('funnel deem: asked=6 measured=6 yes=6 no=0');
+    const verdictIndex = lines.findIndex((line) => line.startsWith('verdict deem:'));
+    expect(verdictIndex).toBeGreaterThan(funnelIndex);
+
+    const severityAnswers = new Map(plan.rows.map((row) => [
+      replay.rowKey(row.registry, row.findingId),
+      Array.from({ length: 3 }, () => ({ pick: 'P1', p0Probability: 0.1 })),
+    ]));
+    const severityOnly = replay.summarizeColumn('deem', plan.rows, severityAnswers, plan.baselineRight, 'model=deem-0.8-v1 model_commit=m1 source_commit=s1');
+    expect(lines).toContain(severityOnly.line);
+
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(24);
+    expect(calls.filter((call: any) => call.call === 'severity')).toHaveLength(18);
+    expect(calls.filter((call: any) => call.call === 'funnel')).toHaveLength(6);
+    for (const call of calls) {
+      expect(call.row).toMatch(/^[0-9a-f]{16}$/);
+      expect(call.status).toBe('measured');
+    }
+    expect(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')).not.toContain('N-');
+  });
+
+  it('a report.json is read back and requalifies a changed commit pair', async () => {
+    const stubs = stubDir({ 'cli-deem': DEEM_CHOICE_AND_FUNNEL });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-deem-report-');
+    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ columns: { deem: { modelCommit: 'm0', sourceCommit: 's1' } } }), 'utf8');
+    const stored = replay.readStoredReport(out);
+    const plan = planOf(Array.from({ length: 6 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    const result = await replay.runDeemArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      callLog: replay.createCallLog(out),
+      stored,
+    });
+
+    expect(stored).toEqual({ columns: { deem: { modelCommit: 'm0', sourceCommit: 's1' } } });
+    expect(replay.readStoredReport(tempDir('severity-replay-no-report-'))).toBe(null);
+    expect(result.requalify).toBe('requalify: model commit changed');
+    const requalifyIndex = lines.indexOf('requalify: model commit changed');
+    expect(requalifyIndex).toBeGreaterThanOrEqual(0);
+    expect(lines[requalifyIndex + 1].startsWith('verdict deem: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0')).toBe(true);
+  });
+
+  it('the finding id never reaches a logged call', async () => {
+    const stubs = stubDir({ 'cli-deem': DEEM_CHOICE_AND_FUNNEL });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-deem-digest-');
+    const plan = planOf([{ findingId: 'P2-001', label: 'P1' }]);
+    const gate = replay.deemGate({ out: (line: string) => lines.push(line), env });
+
+    await replay.runDeemArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+    });
+
+    // The log keeps the digest alone, so a call stays traceable to its row
+    // without the finding id, whose text carries the severity being judged.
+    const expected = createHash('sha256').update(`${REGISTRY}#P2-001`).digest('hex').slice(0, 16);
+    const calls = readCalls(out);
+    expect(calls).toHaveLength(4);
+    expect(calls.filter((call: any) => call.call === 'severity')).toHaveLength(3);
+    expect(calls.filter((call: any) => call.call === 'funnel')).toHaveLength(1);
+    for (const call of calls) expect(call.row).toBe(expected);
+
+    const text = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8');
+    expect(text).not.toContain('P2-001');
+  });
+});
+
+describe('score-severity-replay jev gate and arm', () => {
+  type JevRow = {
+    registry: string;
+    findingId: string;
+    label: string;
+    title: string;
+    dimension: string;
+    evidenceRefs: string[];
+    recommendation: string;
+  };
+
+  const REGISTRY = 'alpha/review/deep-review-findings-registry.json';
+  const SECOND_REGISTRY = 'beta/review/deep-review-findings-registry.json';
+  const JEV_CHOICE_AND_FUNNEL = [
+    'case "$1" in',
+    '  --version) echo \'jev 0.6.2\'; exit 0;;',
+    '  auth)',
+    '    if [ "$2" = test ]; then echo \'{"model":"stub-model"}\'; fi',
+    '    exit 0;;',
+    'esac',
+    'if [ "$1" = noul ]; then cat > /dev/null; echo \'{"answers":{"answer":{"noul":0.9}}}\'; exit 0; fi',
+    'cat > /dev/null',
+    'echo \'{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}\'',
+  ].join('\n');
+
+  function stubDir(bodies: Record<string, string>): string {
+    const dir = tempDir('severity-replay-jev-stubs-');
+    for (const [name, body] of Object.entries(bodies)) {
+      const file = path.join(dir, name);
+      fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
+      fs.chmodSync(file, 0o755);
+    }
+    return dir;
+  }
+
+  function armEnv(stubs: string): NodeJS.ProcessEnv {
+    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+    delete env.JEV_PROVIDER;
+    return env;
+  }
+
+  function readCalls(out: string): any[] {
+    return fs
+      .readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
+      .trim()
+      .split('\n')
+      .map((line) => JSON.parse(line));
+  }
+
+  function planOf(rows: Array<{ findingId: string; label: string; registry?: string }>): { rows: JevRow[]; baselineRight: (row: JevRow) => boolean } {
+    return {
+      rows: rows.map((row) => ({
+        registry: row.registry ?? REGISTRY,
+        findingId: row.findingId,
+        label: row.label,
+        title: 'Fixture finding',
+        dimension: 'correctness',
+        evidenceRefs: ['specs/x.md'],
+        recommendation: 'Fix it.',
+      })),
+      baselineRight: (row) => row.label === 'real',
+    };
+  }
+
+  function fakeGit(unpublished: string): { git: (args: string[]) => { status: number; stdout: string; stderr: string }; calls: string[][] } {
+    const calls: string[][] = [];
+    const git = (args: string[]) => {
+      calls.push(args);
+      const present = unpublished === '' || !args.includes(`origin/main:${unpublished}`);
+      return { status: present ? 0 : 1, stdout: '', stderr: '' };
+    };
+    return { git, calls };
+  }
+
+  it('the Jev gate passes a stub', async () => {
+    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-jev-pass-');
+    const plan = planOf(Array.from({ length: 20 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
+    const fake = fakeGit('');
+
+    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
+
+    expect(gate.passed).toBe(true);
+    expect(gate.provider).toBe('official');
+    expect(lines).toEqual([`jev: path=${path.join(stubs, 'jev')} provider=official`]);
+
+    const result = await replay.runJevArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      backoffMs: 2000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+      git: fake.git,
+      root: '/repo',
+    });
+
+    expect(result.stopped).toBeUndefined();
+    expect(lines.some((line) => line.startsWith('jev: payload: published review registry text; planned calls: 81; estimated input tokens: '))).toBe(true);
+    expect(lines).toContain('jev: auth test provider=official model=stub-model');
+    expect(lines.some((line) => line.startsWith('column jev: K=20 measured=20 unmeasured=0 p_loss=1.000 latency_p50_ms='))).toBe(true);
+    expect(lines).toContain('funnel jev: asked=20 measured=20 yes=20 no=0');
+    expect(lines).toContain('verdict jev: keep K=20 M=20 A=20 B=0 W=20 L=0 F=0 p=9.537e-7 jev_version=0.6.2 provider=official model=stub-model');
+    expect(fake.calls).toHaveLength(1);
+
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log.slice(0, 3)).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
+    expect(log.filter((line) => line.startsWith('choice '))).toHaveLength(60);
+    expect(log.filter((line) => line.startsWith('noul '))).toHaveLength(20);
+
+    const logged = readCalls(out);
+    expect(logged).toHaveLength(81);
+    expect(logged.filter((call: any) => call.call === 'auth_test')).toHaveLength(1);
+    expect(logged.filter((call: any) => call.call === 'severity')).toHaveLength(60);
+    expect(logged.filter((call: any) => call.call === 'funnel')).toHaveLength(20);
+    for (const call of logged) {
+      expect(call.provider).toBe('official');
+      expect(call.model).toBe('stub-model');
+      expect(call.jevVersion).toBe('0.6.2');
+      expect(call.status).toBe('measured');
+    }
+  });
+
+  it('the Jev gate skips on no credential, a missing binary and a wrong version', () => {
+    const cases: Array<{ body: string | null; pathLine: (stubs: string) => string; tail: (stubs: string) => string[] }> = [
+      {
+        body: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) exit 3;; esac',
+        pathLine: (stubs) => `jev: path=${path.join(stubs, 'jev')} provider=official`,
+        tail: (stubs) => ['jev arm skipped: no credential'],
+      },
+      {
+        body: 'case "$1" in --version) echo \'0.2.3\'; exit 0;; esac',
+        pathLine: (stubs) => `jev: path=${path.join(stubs, 'jev')} provider=official`,
+        tail: (stubs) => ['jev arm skipped: version', `jev: found="0.2.3" path=${path.join(stubs, 'jev')}`],
+      },
+      {
+        body: null,
+        pathLine: () => 'jev: path=none provider=official',
+        tail: (stubs) => ['jev arm skipped: jev not on PATH'],
+      },
+    ];
+
+    for (const entry of cases) {
+      const stubs = entry.body === null ? tempDir('severity-replay-jev-missing-') : stubDir({ jev: entry.body });
+      const env = armEnv(stubs);
+      if (entry.body === null) env.PATH = stubs;
+      const lines: string[] = [];
+
+      const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
+
+      expect(gate.passed).toBe(false);
+      expect(lines).toEqual([entry.pathLine(stubs), ...entry.tail(stubs)]);
+      if (entry.body === null) {
+        expect(fs.existsSync(path.join(stubs, 'jev.log'))).toBe(false);
+      } else {
+        const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+        expect(log).toEqual(entry.tail(stubs)[0] === 'jev arm skipped: no credential'
+          ? ['--version', 'auth status --provider official']
+          : ['--version']);
+      }
+    }
+  });
+
+  it('an unpublished row is withheld from Jev', async () => {
+    const stubs = stubDir({ jev: JEV_CHOICE_AND_FUNNEL });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-jev-unpublished-');
+    const plan = planOf([
+      { findingId: 'A-1', label: 'P1' },
+      { findingId: 'B-1', label: 'P1', registry: SECOND_REGISTRY },
+    ]);
+    const fake = fakeGit(SECOND_REGISTRY);
+
+    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
+    const result = await replay.runJevArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      backoffMs: 2000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+      git: fake.git,
+      root: '/repo',
+    });
+
+    expect(result.stopped).toBeUndefined();
+    expect(fake.calls).toHaveLength(2);
+    expect(fake.calls[0][4]).toBe(`origin/main:${REGISTRY}`);
+    expect(fake.calls[1][4]).toBe(`origin/main:${SECOND_REGISTRY}`);
+
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log.filter((line) => line.startsWith('choice '))).toHaveLength(3);
+    expect(log.filter((line) => line.startsWith('noul '))).toHaveLength(1);
+
+    const logged = readCalls(out);
+    const withheld = logged.filter((call: any) => call.status === 'unmeasured_unpublished');
+    expect(withheld).toHaveLength(3);
+    expect(withheld.every((call: any) => call.call === 'severity' && call.order !== null && call.exitCode === null)).toBe(true);
+    expect(new Set(withheld.map((call: any) => call.row)).size).toBe(1);
+    expect(logged.filter((call: any) => call.call !== 'auth_test' && call.status === 'measured')).toHaveLength(4);
+    expect(logged.filter((call: any) => call.call === 'funnel')).toHaveLength(1);
+  });
+
+  it('the Jev arm stops on a rejected key', async () => {
+    const stubs = stubDir({ jev: 'case "$1" in --version) echo \'jev 0.6.2\'; exit 0;; auth) [ "$2" = test ] && exit 3; exit 0;; esac' });
+    const env = armEnv(stubs);
+    const lines: string[] = [];
+    const out = tempDir('severity-replay-jev-key-');
+    const plan = planOf(Array.from({ length: 3 }, (_, index) => ({ findingId: `N-${index}`, label: 'P1' })));
+    const fake = fakeGit('');
+
+    const gate = replay.jevGate({ out: (line: string) => lines.push(line), env, timeoutMs: 5000 });
+    const result = await replay.runJevArm(plan, gate, {
+      out: (line: string) => lines.push(line),
+      env,
+      timeoutMs: 5000,
+      backoffMs: 2000,
+      callLog: replay.createCallLog(out),
+      stored: null,
+      git: fake.git,
+      root: '/repo',
+    });
+
+    expect(gate.passed).toBe(true);
+    expect(result.stopped).toBe('jev arm stopped: key rejected');
+    expect(result.partialRows).toBe(0);
+    expect(lines).toContain('jev arm stopped: key rejected');
+    expect(lines).toContain('jev: partial rows=0');
+    expect(lines.some((line) => line.startsWith('verdict jev:'))).toBe(false);
+
+    const log = fs.readFileSync(path.join(stubs, 'jev.log'), 'utf8').trim().split('\n');
+    expect(log).toEqual(['--version', 'auth status --provider official', 'auth test --provider official']);
+
+    const logged = readCalls(out);
+    expect(logged).toHaveLength(1);
+    expect(logged[0].call).toBe('auth_test');
+    expect(logged[0].order).toBe(null);
+    expect(logged[0].exitCode).toBe(3);
+    expect(logged[0].status).toBe('unmeasured');
+  });
+});
+
+describe('score-severity-replay main', () => {
+  const REGISTRY = 'alpha/review/deep-review-findings-registry.json';
+  const DEEM_CHOICE_AND_FUNNEL = [
+    'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+    'if [ "$1" = noul ]; then echo \'{"answers":{"answer":{"noul":0.9}}}\'; exit 0; fi',
+    'p=$(cat)',
+    'echo \'{"answers":{"answer":{"choice":"P1","probabilities":{"P0":0.1,"P1":0.8,"P2":0.05,"not_a_finding":0.05}}}}\'',
+  ].join('\n');
+
+  type MainGit = (args: string[]) => { status: number; stdout: string; stderr: string };
+
+  function fixtureRoot(count: number): string {
+    const root = tempDir('severity-replay-main-root-');
+    writeRegistry(root, REGISTRY, {
+      openFindings: Array.from({ length: count }, (_, index) => finding({
+        findingId: `A-${String(index).padStart(3, '0')}`,
+        severity: 'P0',
+        title: `Finding ${index}`,
+        dimension: 'correctness',
+        evidenceRefs: ['specs/x.md'],
+        recommendation: 'Fix it.',
+      })),
+    });
+    return root;
+  }
+
+  function fakeGit(root: string, files: string[]): MainGit {
+    return (args: string[]) => {
+      if (args[0] === 'rev-parse') return { status: 0, stdout: `${root}\n`, stderr: '' };
+      if (args.includes('ls-files')) {
+        return { status: 0, stdout: files.map((file) => `${file}\0`).join(''), stderr: '' };
+      }
+      return { status: 0, stdout: '', stderr: '' };
+    };
+  }
+
+  function stubDir(bodies: Record<string, string>): string {
+    const dir = tempDir('severity-replay-main-stubs-');
+    for (const [name, body] of Object.entries(bodies)) {
+      const file = path.join(dir, name);
+      fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
+      fs.chmodSync(file, 0o755);
+    }
+    return dir;
+  }
+
+  function stubEnv(stubs: string): NodeJS.ProcessEnv {
+    return { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` };
+  }
+
+  function labelSheet(rows: Array<{ findingId: string; label: string }>): string {
+    const file = path.join(tempDir('severity-replay-main-labels-'), 'labels.jsonl');
+    const lines = rows.map((row) => JSON.stringify({
+      registry: REGISTRY,
+      finding_id: row.findingId,
+      title: `Finding ${row.findingId}`,
+      dimension: 'correctness',
+      evidence_refs: [],
+      label: row.label,
+    }));
+    fs.writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
+    return file;
+  }
+
+  async function runMain(
+    argv: string[],
+    env: NodeJS.ProcessEnv,
+    git: MainGit,
+  ): Promise<{ code: number; lines: string[]; errs: string[] }> {
+    const lines: string[] = [];
+    const errs: string[] = [];
+    const code = await replay.main(argv, {
+      out: (line: string) => lines.push(line),
+      err: (line: string) => errs.push(line),
+      env,
+      timeoutMs: 5000,
+      backoffMs: 1,
+      git,
+    });
+    return { code, lines, errs };
+  }
+
+  it('the default run makes zero model calls', async () => {
+    const root = fixtureRoot(20);
+    const stubs = stubDir({ jev: 'exit 0', 'cli-deem': 'exit 0' });
+
+    const { code, lines, errs } = await runMain([], stubEnv(stubs), fakeGit(root, [REGISTRY]));
+
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines).toContain('registries: 1');
+    expect(lines).toContain('findings: 20 (P0 20, P1 0, P2 0, other 0)');
+    expect(lines).toContain('p0 rows: 20 in 1 registries (one 0, two or more 1)');
+    expect(lines).toContain('labels: none');
+    expect(lines).toContain('labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)');
+    expect(lines).toContain('labels dropped: 0');
+    expect(lines).toContain('baseline: right 0 of 0');
+    expect(lines).toContain(`question: ${replay.QUESTION_SEVERITY}`);
+    expect(lines).toContain('margin: 0.10');
+    expect(lines).toContain(replay.KEEP_RULE_LINE);
+    expect(lines).toContain(replay.POWER_LINE);
+    expect(lines[lines.length - 1]).toBe('stop: fewer than 20 labeled P0 negatives');
+    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
+  });
+
+  it('19 negatives spawn neither backend', async () => {
+    const root = fixtureRoot(20);
+    const stubs = stubDir({ jev: 'exit 0', 'cli-deem': 'exit 0' });
+    const out = tempDir('severity-replay-main-stop-out-');
+    const labels = labelSheet([
+      { findingId: 'A-000', label: 'real' },
+      ...Array.from({ length: 19 }, (_, index) => ({ findingId: `A-${String(index + 1).padStart(3, '0')}`, label: 'P1' })),
+    ]);
+
+    const { code, lines, errs } = await runMain(
+      ['--jev', '--deem', '--out', out, '--labels', labels],
+      stubEnv(stubs),
+      fakeGit(root, [REGISTRY]),
+    );
+
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines).toContain('stop: fewer than 20 labeled P0 negatives');
+    expect(lines).toContain('jev arm skipped: label gate');
+    expect(lines).toContain('deem arm skipped: label gate');
+    expect(lines.indexOf('deem arm skipped: label gate')).toBeGreaterThan(lines.indexOf('jev arm skipped: label gate'));
+    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
+    expect(fs.existsSync(path.join(out, 'calls.jsonl'))).toBe(false);
+
+    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
+    expect(report.gate).toBe('stop: fewer than 20 labeled P0 negatives');
+    expect(report.skipped).toEqual({ jev: 'jev arm skipped: label gate', deem: 'deem arm skipped: label gate' });
+  });
+
+  it('`--jev` without `--out` exits 2 before any call', async () => {
+    const root = fixtureRoot(20);
+    const stubs = stubDir({ jev: 'exit 0' });
+
+    const { code, lines, errs } = await runMain(['--jev'], stubEnv(stubs), fakeGit(root, [REGISTRY]));
+
+    expect(code).toBe(2);
+    expect(lines).toEqual([]);
+    expect(errs).toEqual(['--jev needs --out <dir> so every call is recorded']);
+    expect(fs.readdirSync(stubs).filter((name) => name.endsWith('.log'))).toEqual([]);
+  });
+
+  it('a report.json records the gate and the column', async () => {
+    const root = fixtureRoot(20);
+    const out = tempDir('severity-replay-main-report-');
+    const labels = labelSheet(Array.from({ length: 20 }, (_, index) => ({ findingId: `A-${String(index).padStart(3, '0')}`, label: 'P1' })));
+    const stubs = stubDir({ 'cli-deem': DEEM_CHOICE_AND_FUNNEL });
+
+    const { code, lines, errs } = await runMain(
+      ['--deem', '--out', out, '--labels', labels],
+      stubEnv(stubs),
+      fakeGit(root, [REGISTRY]),
+    );
+
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines).toContain('gate: open K=20 negatives=20');
+    expect(lines).toContain('verdict deem: keep K=20 M=20 A=20 B=0 W=20 L=0 F=0 p=9.537e-7 model=deem-0.8-v1 model_commit=m1 source_commit=s1');
+
+    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
+    expect(report.census.registries).toBe(1);
+    expect(report.census.p0Rows).toHaveLength(20);
+    expect(report.labels.K).toBe(20);
+    expect(report.labels.real).toBe(0);
+    expect(report.labels.negatives).toBe(20);
+    expect(report.labels.dropped).toBe(0);
+    expect(report.labels.sha256).toMatch(/^[0-9a-f]{64}$/);
+    expect(report.baseline).toEqual({ right: 0, of: 20 });
+    expect(report.gate).toBe('gate: open K=20 negatives=20');
+    expect(report.columns.deem.verdict).toBe('keep');
+    expect(report.columns.deem.K).toBe(20);
+    expect(report.columns.deem.M).toBe(20);
+    expect(report.columns.deem.modelCommit).toBe('m1');
+    expect(report.requalify.deem).toBe(null);
+  });
+
+  it('the Deem gate skips a stub backend byte-identically', async () => {
+    const root = fixtureRoot(20);
+    const out = tempDir('severity-replay-main-skip-out-');
+    const labels = labelSheet(Array.from({ length: 20 }, (_, index) => ({ findingId: `A-${String(index).padStart(3, '0')}`, label: 'P1' })));
+    const stubs = stubDir({
+      'cli-deem': 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi',
+    });
+
+    const base = await runMain(['--labels', labels], stubEnv(stubs), fakeGit(root, [REGISTRY]));
+    const { code, lines, errs } = await runMain(
+      ['--deem', '--out', out, '--labels', labels],
+      stubEnv(stubs),
+      fakeGit(root, [REGISTRY]),
+    );
+
+    expect(code).toBe(0);
+    expect(errs).toEqual([]);
+    expect(lines.slice(0, base.lines.length)).toEqual(base.lines);
+    expect(lines.slice(base.lines.length)).toEqual(['deem arm skipped: stub backend']);
+
+    const log = fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').trim().split('\n');
+    expect(log).toEqual(['health']);
+  });
+});
```
