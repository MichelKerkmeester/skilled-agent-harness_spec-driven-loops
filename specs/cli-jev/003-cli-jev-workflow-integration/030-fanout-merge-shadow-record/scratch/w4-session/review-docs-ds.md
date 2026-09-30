# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-deep-loop/SKILL.md`
- `.skilled/skills/system-deep-loop/runtime/README.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/README.md`
- `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.0.0.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md`
- `.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md`
- `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-build/rulings.md` (rulings override the design), `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-session/notes.md` (the session's runs; there is no build-evidence.md) and `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record/scratch/w4-session/docs/facts.txt` (the session-run facts the docs were written from). Session facts to weigh: all eight docs pass validate_document.py (the two indexes with --type feature_catalog and --type playbook). The runtime playbook package prints scenarios=58 with the typed census matching; the runtime catalog package adds one packet_history_metadata warning on the entry's Feature ID line, a line every runtime entry carries. The hub SKILL.md version stays 3.0.1.0 by ruling, and design step D7 (frontmatter-version.mjs apply) does not run. Review only the 030 changes in the shared files (SKILL.md line 111, runtime/README.md, runtime/scripts/README.md and both indexes also hold 027's, 028's and 029's committed lines). REQ wording on which docs must name the script, the gate and both switches applies to the hub sentence too. And the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
index ae633d7e2f..a302cd20f3 100644
--- a/.skilled/skills/system-deep-loop/SKILL.md
+++ b/.skilled/skills/system-deep-loop/SKILL.md
@@ -108,7 +108,7 @@ system-deep-loop/
 Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature-catalog/`, or `manual-testing-playbook/` as applicable, with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`); its legacy public surfaces (the `/deep:ai-council` command and the `ai-council` agent) intentionally keep the shorter `ai-council` key, so always resolve the packet path through `mode-registry.json` rather than hardcoding it.
 
 ### Backend
-All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The offline stop-hint replay at `runtime/scripts/score-stop-hint.cjs` reads one stop-rater report and says whether a replayed stop would have made a good confirm-mode hint, makes no model call in any column and changes no gate. The offline severity replay at `runtime/scripts/score-severity-replay.cjs` measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity: it makes no model call by default, prints `stop: fewer than 20 labeled P0 negatives` until the operator has labeled that many, runs its `--jev` and `--deem` arms only with `--out <dir>` and past each backend's own gate, and changes no severity. The runtime never gains an `improvement` loopType — improvement stays host-driven.
+All modes consume `runtime/` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The offline fan-out pair replay at `runtime/scripts/score-fanout-pairs.cjs` reads the merge's own decisions on near-line and cross-body pairs and compares a backend's judgment with the operator's labels, and the merge itself is unchanged. The offline stop-rater replay at `runtime/scripts/score-stop-rater.cjs` makes no model call by default, opens its two rating arms only behind the `--jev` and `--deem` switches, and changes no stop. The offline stop-hint replay at `runtime/scripts/score-stop-hint.cjs` reads one stop-rater report and says whether a replayed stop would have made a good confirm-mode hint, makes no model call in any column and changes no gate. The offline severity replay at `runtime/scripts/score-severity-replay.cjs` measures whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity: it makes no model call by default, prints `stop: fewer than 20 labeled P0 negatives` until the operator has labeled that many, runs its `--jev` and `--deem` arms only with `--out <dir>` and past each backend's own gate, and changes no severity. The runtime never gains an `improvement` loopType — improvement stays host-driven.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/README.md b/.skilled/skills/system-deep-loop/runtime/README.md
index b6581edb51..9b0dbb95a4 100644
--- a/.skilled/skills/system-deep-loop/runtime/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/README.md
@@ -49,6 +49,7 @@ Consumers import domain behavior from `lib/` or invoke a documented script from
 The stop-rater replay at `scripts/score-stop-rater.cjs` makes no model call by default and opens its two rating arms only behind the `--jev` and `--deem` switches.
 The stop-hint replay script `scripts/score-stop-hint.cjs` takes the `--rater-report <dir>` input, the `--jev` and `--deem` column switches and the `--out <dir>` output, makes no model call and leaves the gate unchanged.
 The severity replay script `scripts/score-severity-replay.cjs` makes no model call by default, stops at the label gate below 20 labeled P0 negatives and opens its two severity arms only behind the `--jev` and `--deem` switches.
+The fan-out pair replay script `scripts/score-fanout-pairs.cjs` makes no model call by default, stops at the label gate below 40 labeled pairs or 10 labeled cross-body pairs and opens its two scoring arms only behind the `--jev` and `--deem` switches.
 
 ---
 
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/README.md b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
index 830560fa19..0383083086 100644
--- a/.skilled/skills/system-deep-loop/runtime/scripts/README.md
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/README.md
@@ -49,6 +49,7 @@ The `lib/` child contains CLI-only guards and writer-lock helpers.
 | `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
 | `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
 | `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
+| `score-fanout-pairs.cjs` | Reads recorded fan-out registries, prints the near-line and cross-body pair census and the merge's own decision per pair, and behind `--jev` or `--deem` scores that backend against the operator's labels. The merge is unchanged and the default run makes no call. The `--write-pair-sheet <path>` and `--labels <file>` switches write and read the operator's pair sheet, and `--out <dir>` records every call. |
 | `score-severity-replay.cjs` | Measures offline whether a Jev or Deem severity choice would separate real P0 findings from false ones better than the recorded severity, with no model call by default and no severity change. The `--write-label-sheet <path>` and `--labels <file>` switches write and read the operator's label sheet, `--jev` and `--deem` open the rating arms behind the label gate, and `--out <dir>` records every call. |
 | `score-stop-hint.cjs` | Replays one stop-rater report offline and prints per-column hint counts and one Keep-Rule verdict per column past its label gate, with no model call in any mode. The `--rater-report <dir>` switch names the report to read, `--jev` and `--deem` add the rater's recorded columns, and `--out <dir>` writes the run's report. |
 | `score-stop-rater.cjs` | Replays recorded deep-research stop decisions offline against gold derived from the delta files, with no model call by default. The `--jev` and `--deem` switches open a rating arm and `--gold-reads <file>` supplies the confirmed reads that gate it. |
diff --git a/.skilled/skills/system-deep-loop/runtime/changelog/v1.9.0.0.md b/.skilled/skills/system-deep-loop/runtime/changelog/v1.9.0.0.md
new file mode 100644
index 0000000000..6d2f3173ad
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/changelog/v1.9.0.0.md
@@ -0,0 +1,32 @@
+---
+title: "deep-loop-runtime v1.9.0.0"
+description: "v1.9.0.0 adds an offline fan-out pair replay that reads the recorded fan-out lineage registries and prints the near-line and cross-body candidate pairs with the merge's own decision on each. It calls no model by default and changes no merge."
+trigger_phrases:
+  - "deep-loop-runtime v1.9.0.0"
+  - "deep-loop-runtime 1.9.0.0"
+  - "fan-out pair replay"
+  - "operator pair labels"
+importance_tier: "normal"
+contextType: "general"
+version: 1.9.0.0
+---
+v1.9.0.0 adds `score-fanout-pairs.cjs`, an offline fan-out pair replay that reads the recorded fan-out lineage registries, prints the near-line and cross-body candidate pairs and the merge's own decision on each with deduplication on and off, plus the unit tests behind that census. The default run makes no model call and writes no file. `fanout-merge.cjs` is unchanged.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/030-fanout-merge-shadow-record` (Level 1)
+
+## Why This Release
+
+The fan-out merge collapses near-duplicate findings with one title-overlap rule and never compares two findings whose bodies differ, so the pairs it judged and the pairs it skipped have never been measured against a second opinion. The tracked lineage registries already hold every one of those pairs. `score-fanout-pairs.cjs` prints that census with the merge's own decision on each pair under both deduplication settings, then scores one backend's same-or-different judgment against the operator's pair labels when an arm is named.
+
+## What's New at a Glance
+
+- **The default run makes no model call and writes no file.** `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` reads the recorded fan-out lineage registries and prints the pair census and the merge's own decision on each pair. With logging stubs for `jev` and `cli-deem` first on `PATH`, no stub was called.
+- **A pair sheet starts the measurement.** `--write-pair-sheet <path>` writes at most the first 60 pairs of each class ordered by the SHA-256 of the pair key, each row carrying both findings' text, their lineages, the run path and an empty `label` for the operator to fill with `same` or `different`, and `--labels <file>` reads the filled sheet back. A path inside the repository prints `refusing to write the pair sheet inside the repository` and writes no file.
+- **The label gate needs 40 labeled pairs and 10 of them cross-body.** Below either floor the run prints `stop: fewer than 40 labeled pairs` or `stop: fewer than 10 labeled cross-body pairs` and no model call happens. When the merge's own decisions are already right on more than nine labeled pairs in ten the run prints `no headroom` and leaves both arms closed.
+- **Both arms are opt-in and each runs behind its own gate.** `--jev` and `--deem` each need `--out <dir>` so every call is recorded, and either switch without it exits 2 before any call. With both switches the Jev gate and arm run first and then the Deem gate and arm, each regardless of the other's outcome, and a failed gate prints its own skip line such as `deem arm skipped: stub backend` or `jev arm skipped: no credential`.
+- **One fixed rule decides each measured column.** Coverage, loss, margin, a sign test and flips are checked in a fixed order against the merge's own decision as the baseline, and only a column that passes them all is kept. No run has printed a `verdict` line, so this entry claims none.
+- **The merge is unchanged.** The script reads each decision by calling the merge's own functions instead of copying the collapse rule, so the census always reports what the shipped rule does and nothing about the merge changes.
+
+## Upgrade
+
+No migration required. The script is new and `fanout-merge.cjs` is unchanged.
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md
new file mode 100644
index 0000000000..69a2f780b9
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md
@@ -0,0 +1,115 @@
+---
+title: "Fan-out pair replay"
+description: "Replays the fan-out merge's own near-line and cross-body pair decisions with dedup on and off and scores a --jev or --deem backend against the operator's labels through the Keep Rule."
+trigger_phrases:
+  - "fan-out pair replay"
+  - "score-fanout-pairs.cjs"
+  - "fan-out pair census"
+  - "near-line cross-body pairs"
+  - "pair replay label gate"
+version: 1.9.0.0
+---
+
+# Fan-out pair replay
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+---
+
+## 1. OVERVIEW
+
+`score-fanout-pairs.cjs` reads the tracked fan-out lineage registries of every
+deep-research and deep-review run that holds at least two lineages and prints the
+census of candidate duplicate pairs the merge judged, together with the merge's own
+decision on each pair with near-duplicate deduplication on and off. It requires
+`fanout-merge.cjs` and calls the merge's own functions, and that merge is unchanged.
+
+**The two pair classes** follow the merge's own body key: `near-line` pairs share a
+body key and carry a title overlap in `[0.05, 0.30)`, `cross-body` pairs differ in
+body and reach a title or text overlap of `0.5` or more. A pair is `undecidable` when
+the merge drops either finding on its own before comparing (a review finding that is
+not active, or a finding with no id or title), since a one-finding result then says
+nothing about the pair. Behind `--jev` or `--deem` the script scores one backend's
+same-or-different judgment against the operator's labels. The default run makes no
+model call and writes no file.
+
+### Why This Matters
+
+The merge decides what happens to every candidate duplicate pair, so its own behavior
+under both deduplication settings is the first thing the replay shows. The labels then
+let an operator judge a backend against gold instead of trusting either side. No
+verdict line is claimed here, because no run has printed one.
+
+---
+
+## 2. HOW IT WORKS
+
+With no switch the script is a census only. It walks the tracked
+`{research,review}/lineages/<label>/` registries into runs keyed `<loop>:<runDir>`,
+keeps the runs with at least two lineages, classifies each candidate pair, and prints
+`runs: research=<n> review=<n>`, `pairs: research=<n> review=<n>`,
+`class near-line: research=<n> review=<n>`, `class cross-body: research=<n> review=<n>`,
+one `merge decisions: <class> <loop> dedup-on same=<n> different=<n> dedup-off same=<n> different=<n>`
+line per class and loop, `title rule: <loop>=<n> of <n> findings carry a title` and
+`body fields: <loop>=<n> of <n> findings carry a body field` for each loop, and
+`merge undecidable: <n>`. Each `merge decisions:` line counts what the merge's own
+collapse does to those pairs under each deduplication setting.
+
+`--write-pair-sheet <path>` writes one JSONL row per pair, at most the first 60 of
+each class in ascending SHA-256 of the pair key, each row carrying both findings'
+text, their lineages, the run path and an empty `label` for the operator to fill with
+`same` or `different`. A path resolving inside the repository prints
+`refusing to write the pair sheet inside the repository`, exits 2 and writes no file.
+`--labels <file>` reads the filled sheet back, a bad row prints `labels row <n>: ...`
+and exits 2, and a pair key the census no longer sees is dropped and counted in the
+report. The label gate then prints one line: `stop: fewer than 40 labeled pairs`,
+`stop: fewer than 10 labeled cross-body pairs`, `no headroom` when the merge's own
+decisions are already right on more than nine pairs in ten, or
+`planned calls: jev <n>, deem <n>`. A gate stop is a completed run at exit 0.
+
+Behind `--jev` or `--deem`, one arm scores that backend on the labeled pairs, and a
+model arm without its required `--out <dir>` prints
+`<switch> needs --out <dir> so every call is recorded` and exits 2. With both switches
+the Jev gate and arm run first, then the Deem gate and arm, each on its own gate and
+regardless of the other's outcome, and a failing gate prints one skip line and never
+runs the other backend in its place: `jev arm skipped: jev not on PATH`,
+`jev arm skipped: version`, `jev arm skipped: no credential`, `deem arm skipped: <reason>`
+such as `stub backend`, or `<backend> arm skipped: label gate` and
+`<backend> arm skipped: no headroom` below the label gate. Each pair is asked
+`Do these two findings describe the same problem?` three times as AB, BA and AB on Jev
+and twice as AB and BA on Deem, every call recorded in `<out>/calls.jsonl` and the run
+in `<out>/report.json`. The Keep Rule then decides in order: coverage `10*M >= 9*K`
+else `stop (coverage)`, kill when the exact `P(X>=L)` is below 0.05, margin
+`10*(A-B) >= M` else `stop (margin)`, the sign test `P(X>=W)` below 0.05 with `p = 1`
+when `W+L = 0` else `stop (sign test)`, flips `10*F <= C` else `stop (flips)`, else
+`keep`, and every verdict line it builds carries `reader=none named`. The usage line is
+`usage: score-fanout-pairs.cjs [--out <dir>] [--labels <file>] [--write-pair-sheet <path>] [--jev] [--deem]`,
+and the script exits 0 on every completed run including a gate stop, 2 on a bad
+invocation or unreadable input, and 1 on an unexpected throw.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Role |
+|---|---|
+| `scripts/score-fanout-pairs.cjs` | `walkRuns`, `selectCandidates`, `classifyPair`, `mergeDecision`, `readBaseline`, `writePairSheet`, `parseLabels`, `gateState`, `runJevArm`, `runDeemArm`, `decideVerdict`, `main()` (guarded behind `require.main === module`); calls the merge's own functions from `fanout-merge.cjs`, which stays unchanged |
+
+### Validation
+
+| File | Role |
+|---|---|
+| `tests/unit/score-fanout-pairs.vitest.ts` | 42 tests: the walker (3), the selection (7), the merge oracle (6), parity (2), the sheet, labels and gate (7), the Jev gate and arm (5), the Deem gate and arm (5), and the keep rule and report (7), on temp fixture registries with stub `jev` and `cli-deem` binaries first on PATH |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Fan-Out
+- Feature ID: F059
+- Catalog source: `feature-catalog/fanout/fanout-pair-replay.md`
+- Primary source files: `scripts/score-fanout-pairs.cjs`
+Related references:
+- [fanout-merge.md](../../feature-catalog/fanout/fanout-merge.md) - Fan-out cross-lineage merge
diff --git a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
index a8e2746c77..f3c1832b84 100644
--- a/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md
@@ -16,7 +16,7 @@ This document combines the current feature inventory for the `runtime/` skill in
 
 ## 1. OVERVIEW
 
-Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 57 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
+Use this catalog as the canonical inventory for the live `runtime/` feature surface. The 58 entries below cover runtime libraries and direct `.cjs` scripts consumed by deep-* loop consumers (deep-review, deep-research, deep-ai-council, `/doctor`, and adjacent validation docs) per the Runtime Boundary Decision (ADR-001).
 
 | Category | Coverage | Primary Surfaces |
 |---|---:|---|
@@ -28,7 +28,7 @@ Use this catalog as the canonical inventory for the live `runtime/` feature surf
 | [coverage-graph](../feature-catalog/coverage-graph) | 6 features | `lib/coverage-graph/coverage-graph-db.ts`, `lib/coverage-graph/coverage-graph-query.ts`, `lib/coverage-graph/coverage-graph-signals.ts` |
 | [script-entry-points](../feature-catalog/script-entry-points) | 5 features | `scripts/convergence.cjs`, `scripts/upsert.cjs`, `scripts/query.cjs`, `scripts/status.cjs` |
 | [council](council/) | 5 features | `lib/council/multi-seat-dispatch.cjs`, `lib/council/round-state-jsonl.cjs`, `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `lib/council/session-state-hierarchy.cjs` |
-| [fanout](fanout/) | 8 features | `scripts/fanout-pool.cjs`, `scripts/fanout-run.cjs`, `scripts/fanout-salvage.cjs`, `scripts/fanout-merge.cjs`, config schema in `lib/deep-loop/executor-config.ts` |
+| [fanout](fanout/) | 9 features | `scripts/fanout-pool.cjs`, `scripts/fanout-run.cjs`, `scripts/fanout-salvage.cjs`, `scripts/fanout-merge.cjs`, config schema in `lib/deep-loop/executor-config.ts` |
 | [lifecycle](lifecycle/) | 2 features | `lib/deep-loop/sleep.ts`, `lib/deep-loop/lifecycle-taxonomy.cjs` |
 | [observability](observability/) | 3 features | `lib/deep-loop/observability-events.cjs`, `lib/deep-loop/post-dispatch-validate.ts`, `.skilled/commands/deep/assets/deep-research-auto.yaml` |
 | [testing](testing/) | 2 features | `tests/helpers/spawn-cjs.ts`, `tests/integration/convergence-script.vitest.ts`, `tests/unit/fanout-run.vitest.ts` |
@@ -843,6 +843,22 @@ See [`fanout/persisted-wait-crash-resume.md`](../feature-catalog/fanout/persiste
 
 ---
 
+### Fan-out pair replay
+
+#### Description
+
+Replays the fan-out merge's own near-line and cross-body pair decisions with dedup on and off and scores a `--jev` or `--deem` backend against the operator's labels through the Keep Rule.
+
+#### How It Works
+
+`score-fanout-pairs.cjs` walks the tracked `{research,review}/lineages/` registries of every deep-research and deep-review run that holds at least two lineages, then prints the pair census and the merge's own decision on each pair with near-duplicate deduplication on and off. `--write-pair-sheet <path>` writes at most 60 pairs per class ordered by the SHA-256 of the pair key for the operator to label `same` or `different`, and `--labels <file>` reads the filled sheet back. The label gate then prints one line: `stop: fewer than 40 labeled pairs`, `stop: fewer than 10 labeled cross-body pairs`, `no headroom` or `planned calls: jev <3K+1>, deem <2K>`. Behind `--jev` or `--deem` one arm scores that backend on the labeled pairs, and the Keep Rule then decides in order: coverage `10*M >= 9*K` else `stop (coverage)`, kill when the exact `P(X>=L)` is below 0.05, margin `10*(A-B) >= M` else `stop (margin)`, the sign test `P(X>=W)` below 0.05 with `p = 1` at `W+L = 0` else `stop (sign test)`, flips `10*F <= C` else `stop (flips)`, else `keep`. Every verdict line it builds carries `reader=none named`.
+
+#### Source Files
+
+See [`fanout/fanout-pair-replay.md`](../feature-catalog/fanout/fanout-pair-replay.md) for full implementation and validation file listings.
+
+---
+
 ## 11. LIFECYCLE
 
 These entries cover cancellable waits and lifecycle status contracts shared by deep-loop consumers.
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md
new file mode 100644
index 0000000000..74062ea818
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-pair-replay.md
@@ -0,0 +1,113 @@
+---
+title: "DLR-059 -- Fan-out pair replay: census, label gate and stub-backend skip"
+description: "Validate the fan-out pair replay in score-fanout-pairs.cjs: the zero-call default census, the label-gate stop under 40 labeled pairs and the Deem stub-backend skip."
+version: 1.9.0.0
+---
+
+# DLR-059 -- Fan-out pair replay: census, label gate and stub-backend skip
+
+This document captures the validation contract, execution flow, and metadata for `DLR-059`.
+
+---
+
+## 1. OVERVIEW
+
+Validates the zero-call census and the gate lines in `score-fanout-pairs.cjs`.
+
+### Why This Matters
+
+The census shows the merge's own decision on every candidate duplicate pair before any
+backend is scored. It must do that with zero model calls and zero files written. The
+label gate then keeps a run below 40 labeled pairs from spending any call and the Deem
+gate keeps a stub backend from being scored as the model. No run has printed a `verdict`
+line, so this scenario claims none.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+- Objective: Confirm the default run prints the census prefixes and stops at the label gate with no model call and no file written, and confirm the Deem gate skips a stub backend with `deem arm skipped: stub backend`.
+- Layer partition: offline fan-out pair replay.
+- Real user request: `Run the fan-out pair replay census and confirm it stops at the label gate without calling a backend, then show the test suite skipping a stub Deem backend.`
+- Expected signals: The census prefixes `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:` on stdout. The final line `stop: fewer than 40 labeled pairs`. The asserted line `deem arm skipped: stub backend` in `deem gate skips a stub backend`. Exit 0 from both commands and no file written by the census run.
+- Pass/fail: PASS only if the census run exits 0 with its census prefixes and ends `stop: fewer than 40 labeled pairs` and the test run exits 0 with 42 tests passing and `deem gate skips a stub backend` asserting `deem arm skipped: stub backend`. FAIL otherwise.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prerequisites
+
+- Working directory is repository root.
+- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` present.
+
+### Prompt
+
+- Prompt: `Run the fan-out pair replay census and confirm it stops at the label gate without calling a backend, then show the test suite skipping a stub Deem backend.`
+
+### Commands
+
+1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` and capture stdout and the exit status.
+2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-fanout-pairs.vitest.ts` and capture the summary line.
+
+### Expected Outcome
+
+Command 1 exits 0 and prints in order `runs: research=<n> review=<n>`, `pairs: research=<n>
+review=<n>`, `class near-line: research=<n> review=<n>` and `class cross-body: research=<n>
+review=<n>`, then one `merge decisions: <class> <loop> dedup-on same=<n> different=<n>
+dedup-off same=<n> different=<n>` line per class and loop, then `title rule: <loop>=<n> of
+<n> findings carry a title` and `body fields: <loop>=<n> of <n> findings carry a body field`
+for each loop, then `merge undecidable: <n>`. The run ends on `stop: fewer than 40 labeled
+pairs` because no labels are filled in. The counts read the live tree so a later run may
+differ.
+
+Command 2 reports 42 tests passing with exit 0. `label reader stops under 40 pairs` asserts
+`stop: fewer than 40 labeled pairs` and `label reader stops under 10 cross-body` asserts
+`stop: fewer than 10 labeled cross-body pairs`. The case `deem gate skips a stub backend`
+asserts `deem arm skipped: stub backend`, the line the Deem gate prints when the health
+response reports `backend=stub`. The label gate runs before the backend gates, so a run
+that names `--deem --out <dir>` under the gate prints `deem arm skipped: label gate` and
+writes only `report.json`. Past the gate the stub-backend line appears on a run whose
+`cli-deem` health response reports `backend=stub` and no call is made.
+
+### Evidence
+
+- Source excerpts from `scripts/score-fanout-pairs.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
+- Captured stdout and exit status for every command run in this section.
+- `git status --porcelain` output before and after command 1, showing the census run wrote no file.
+- Output from `tests/unit/score-fanout-pairs.vitest.ts` naming the assertions that carry the expected signals.
+- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.
+
+### Failure Triage
+
+- Exit 2 before any census line: a switch was missing its value or `--jev` or `--deem` ran without `--out <dir>`, which prints `--deem needs --out <dir> so every call is recorded` or the matching `--jev` line and refuses before the census.
+- `deem arm skipped: label gate` in place of `deem arm skipped: stub backend`: the label gate stopped the run before the backend gates, so the Deem gate never read the health response.
+- `deem arm skipped: stub backend` missing from the suite: the health response did not report `backend=stub` or the `deem gate skips a stub backend` case failed.
+
+---
+
+## 4. SOURCE FILES
+
+### Implementation
+
+| File | Role |
+|---|---|
+| `scripts/score-fanout-pairs.cjs` | Census printing in `main`, `gateState` label gate, `deemGate` skip reasons |
+
+### Validation
+
+| File | Role |
+|---|---|
+| `tests/unit/score-fanout-pairs.vitest.ts` | 42 tests, including the label gate and Deem gate cases |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Fan-Out
+- Playbook ID: DLR-059
+- Feature catalog entry: `feature-catalog/fanout/fanout-pair-replay.md`
+- Scenario file path: `manual-testing-playbook/fanout/fanout-pair-replay.md`
+- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
+- Expected verdict mode: GREEN when the census prints its prefixes and stops at the label gate and the suite asserts the stub-backend skip
+- Wall-time estimate: 5-10 min
diff --git a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
index 1ceac42beb..d0beb48a6f 100644
--- a/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md
@@ -36,7 +36,7 @@ Canonical package artifacts:
 
 ## 1. OVERVIEW
 
-This playbook provides 57 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
+This playbook provides 58 deterministic scenarios across 12 categories validating the current `runtime/` skill surface. Each scenario maps to one feature catalog entry and one dedicated scenario file with objective, prompt, execution steps, source anchors, and verdict criteria.
 
 ### REALISTIC TEST MODEL
 
@@ -103,7 +103,7 @@ Scenario verdict — three outcomes only:
 - `FAIL`: expected behavior is missing, output contradicts the contract, a critical check failed, or the core behavior worked but the required evidence or metadata is incomplete. An outcome another operator cannot reproduce from the captured evidence is a `FAIL`, not a partial pass.
 - `SKIP`: a concrete sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevented execution, and the run record names it
 
-Release is cleared only when all 55 scenarios are `PASS` or documented `SKIP` with no critical-path script, state-safety, or schema blocker.
+Release is cleared only when all 58 scenarios are `PASS` or documented `SKIP` with no critical-path script, state-safety, or schema blocker.
 
 ---
 
@@ -675,7 +675,7 @@ Creates and validates the ADR-002 session->topic->round state shape, including s
 
 ## 14. FAN-OUT
 
-This category covers 10 scenarios validating the opt-in multi-executor fan-out layer added in packet 124: config schema, pool primitive, CLI lineage driver, write-failure salvage, research merge, review strongest-restriction, and artifact-dir-override parity.
+This category covers 11 scenarios validating the opt-in multi-executor fan-out layer added in packet 124: config schema, pool primitive, CLI lineage driver, write-failure salvage, research merge, review strongest-restriction, and artifact-dir-override parity.
 
 ### DLR-023 | Fan-out config schema
 
@@ -809,6 +809,19 @@ Expected signals: Wait checkpoint persistence, resume-waiting startup branch, nu
 #### Test Execution
 > **Feature File:** [DLR-047](../manual-testing-playbook/fanout/persisted-wait-crash-resume.md)
 
+### DLR-059 | Fan-out pair replay: census, label gate and stub-backend skip
+
+#### Description
+Adds `scripts/score-fanout-pairs.cjs`, an offline replay that reads the recorded fan-out lineage registries of the deep-research and deep-review runs holding at least two lineages and prints the near-line and cross-body pair census with the merge's own decision on each pair with deduplication on and off. The merge is unchanged and the default run makes no model call and writes no file. `--write-pair-sheet <path>` writes at most 60 pairs per class with an empty `label` for the operator to fill `same` or `different`, `--labels <file>` reads the filled sheet back, and `--jev` and `--deem` each open one arm behind its own gate and require `--out <dir>`.
+
+#### Scenario Contract
+Prompt: `Run the fan-out pair replay census and confirm it stops at the label gate without calling a backend, then show the test suite skipping a stub Deem backend.`
+
+Expected signals: The census prefixes `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:` print on stdout with exit 0 and no stub call, the run ends `stop: fewer than 40 labeled pairs`, the suite asserts `deem arm skipped: stub backend` in `deem gate skips a stub backend`, `git status --porcelain` is unchanged, and 42 passing tests.
+
+#### Test Execution
+> **Feature File:** [DLR-059](../manual-testing-playbook/fanout/fanout-pair-replay.md)
+
 ---
 
 ## 15. LIFECYCLE
@@ -998,3 +1011,4 @@ Expected signals: Cassette recording, deterministic replay, redacted path/timest
 | DLR-056 | [F056 Stop-rater replay](../feature-catalog/scoring/stop-rater-replay.md) | [scoring/stop-rater-replay.md](../manual-testing-playbook/scoring/stop-rater-replay.md) |
 | DLR-057 | [F057 Stop-hint replay](../feature-catalog/scoring/stop-hint-replay.md) | [scoring/stop-hint-replay.md](../manual-testing-playbook/scoring/stop-hint-replay.md) |
 | DLR-058 | [F058 Severity replay](../feature-catalog/scoring/severity-replay.md) | [scoring/severity-replay.md](../manual-testing-playbook/scoring/severity-replay.md) |
+| DLR-059 | [F059 Fan-out pair replay](../feature-catalog/fanout/fanout-pair-replay.md) | [fanout/fanout-pair-replay.md](../manual-testing-playbook/fanout/fanout-pair-replay.md) |
diff --git a/.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs b/.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs
new file mode 100644
index 0000000000..0e409d3e65
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs
@@ -0,0 +1,1826 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-fanout-pairs
+// ───────────────────────────────────────────────────────────────────
+'use strict';
+
+/**
+ * Census recorded fan-out lineage registries: report the near-line and
+ * cross-body candidate pairs and the merge's own decision on each, then
+ * score one backend's answers against the operator's labels when an arm is
+ * named. The default run makes no model call and writes no file.
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
+// The merge itself is the oracle: the census must compare a backend against the
+// rule that actually ships, so it calls the merge's exported functions rather
+// than keeping a second copy of the collapse rule here.
+const { mergeResearchRegistries, mergeReviewRegistries } = require('./fanout-merge.cjs');
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 2. CONSTANTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Registry file a settled lineage is expected to have written, per loop. Research also
+// has a legacy name read only as a fallback, so either name counts as the lineage's
+// registry; the order below is that reader's own probe order.
+const LINEAGE_REGISTRY_FILES = {
+  research: ['findings-registry.json', 'deep-research-findings-registry.json'],
+  review: ['deep-review-findings-registry.json'],
+};
+
+// The findings field each loop's registry aggregates. Reading one loop's field for
+// the other would report every lineage that did register findings as empty.
+const LINEAGE_REGISTRY_FINDINGS_FIELDS = {
+  research: 'keyFindings',
+  review: 'openFindings',
+};
+
+// The same-body title-overlap band the census calls near-line. It brackets the
+// merge's own single collapse threshold, so the census records both the restatements
+// the merge collapses and the near misses whose titles have drifted apart.
+const NEAR_LINE_MIN_OVERLAP = 0.05;
+const NEAR_LINE_MAX_OVERLAP = 0.30;
+
+// Two different bodies never share a body key, so the merge cannot see a problem
+// stated twice in different words; this is the text overlap at which the census
+// records that pair as a cross-body candidate.
+const CROSS_BODY_MIN_OVERLAP = 0.5;
+
+// The label floors: below either count no arm can be scored, because the sign
+// test needs enough labeled pairs on each class for its tails to mean anything.
+const LABEL_GATE = 40;
+const CROSS_BODY_LABEL_GATE = 10;
+
+// The sheet is what one operator fills by hand, so each class is capped; the
+// first by hash keeps the sample the same for the same corpus.
+const SHEET_PER_CLASS = 60;
+
+// A baseline already right on more than nine pairs in ten leaves no room for a
+// backend to show a gain; the comparison stays strict so exactly ninety percent
+// still opens the gate.
+const HEADROOM = 0.9;
+
+// Stopwords stripped before titles are compared, copied from the merge's own list so
+// the census scores titles exactly as the collapse does.
+const TITLE_STOPWORDS = new Set([
+  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'of', 'for', 'and', 'or', 'with', 'without',
+  'is', 'are', 'was', 'were', 'be', 'no', 'not', 'so', 'that', 'this', 'it', 'its', 'as',
+  'by', 'from', 'into', 'after', 'before', 'when', 'where', 'which', 'has', 'have',
+]);
+
+// The one judgment question the arms ask, fixed before any run; the answer's
+// noul counts as "same" from one half upward.
+const NOUL_QUESTION = 'Do these two findings describe the same problem?';
+
+// The orders one pair is asked in. The hosted model samples once per call, so
+// the first order repeats and no answer is reused.
+const JEV_ORDERS = ['AB', 'BA', 'AB'];
+
+// The pinned client version the gate accepts.
+const JEV_VERSION = 'jev 0.6.2';
+
+// Every measured call is bounded so one hung spawn cannot hang the run, and
+// the backoff is the single retry wait a transient Jev failure gets.
+const JEV_CALL_TIMEOUT_MS = 90000;
+const JEV_BACKOFF_MS = 2000;
+
+// The orders one pair is asked in. Deem is sampled once per order, so asking
+// both is what exposes a pair the local model does not hold.
+const DEEM_ORDERS = ['AB', 'BA'];
+
+// The pinned local model and the two-option p50 the arm's wall-time estimate
+// reads; a health body naming any other model is a skip.
+const DEEM_MODEL = 'deem-0.8-v1';
+const DEEM_P50_MS = 65.6;
+
+// The health probe is a liveness check, so it is bounded far tighter than a
+// judgment call: a hung probe must not hold the gate open.
+const HEALTH_TIMEOUT_MS = 2000;
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 3. CENSUS
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * List every tracked file under a repository root.
+ *
+ * The census judges the published corpus, not a working tree that may hold
+ * scratch registries no run ever committed, so it asks git for the tracked set.
+ * A repository git cannot read is a census over nothing rather than a crash.
+ *
+ * @param {string} root - Repository root the walk runs under
+ * @param {Function} [run] - spawnSync-shaped runner, injected in tests
+ * @returns {string[]} Repo-relative tracked paths, sorted; empty on a git failure
+ */
+function listTrackedFiles(root, run = spawnSync) {
+  // The repository's path list exceeds the 1 MB spawnSync default, whose ENOBUFS would read as no files.
+  const result = run('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', maxBuffer: 268435456 });
+  if (!result || result.error || result.status !== 0 || typeof result.stdout !== 'string') {
+    return [];
+  }
+  return result.stdout.split('\0').filter((entry) => entry !== '').sort();
+}
+
+/**
+ * Group the tracked lineage registries into the runs that produced them.
+ *
+ * A run is one fan-out, laid out as `<runDir>/<loop>/lineages/<label>/<registry>`.
+ * A run with fewer than two lineages never had a merge to shadow. One lineage that
+ * wrote both research registry names is still one lineage: the names are two
+ * spellings of one registry, and keeping both would pair a lineage with itself.
+ *
+ * @param {string} root - Repository root the tracked paths are relative to
+ * @param {Object} [deps] - Injected collaborators
+ * @param {Function} [deps.listTracked] - Returns the tracked path list
+ * @returns {Array<Object>} Runs with 2+ lineages, each `{key, loop, runDir, lineages}`
+ */
+function walkRuns(root, { listTracked } = {}) {
+  const tracked = typeof listTracked === 'function' ? listTracked() : listTrackedFiles(root);
+  const runsByKey = new Map();
+  for (const relPath of tracked) {
+    const parts = relPath.split('/');
+    const registryFile = parts[parts.length - 1];
+    const label = parts[parts.length - 2];
+    const loop = parts[parts.length - 4];
+    if (parts[parts.length - 3] !== 'lineages' || !label) continue;
+    const registryFiles = LINEAGE_REGISTRY_FILES[loop];
+    if (!Array.isArray(registryFiles) || !registryFiles.includes(registryFile)) continue;
+    const runDir = parts.slice(0, parts.length - 4).join('/');
+    if (!runDir) continue;
+    const key = `${loop}:${runDir}`;
+    if (!runsByKey.has(key)) runsByKey.set(key, { key, loop, runDir, byLabel: new Map() });
+    const byLabel = runsByKey.get(key).byLabel;
+    const rank = registryFiles.indexOf(registryFile);
+    const previous = byLabel.get(label);
+    const previousRank = previous ? registryFiles.indexOf(previous.split('/').pop()) : -1;
+    // The contract puts the canonical name first and the fallback second, so a
+    // stale fallback copy can never stand in for the live registry.
+    if (previous && previousRank <= rank) continue;
+    byLabel.set(label, relPath);
+  }
+  return [...runsByKey.values()]
+    .map((run) => ({
+      key: run.key,
+      loop: run.loop,
+      runDir: run.runDir,
+      lineages: [...run.byLabel.entries()]
+        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
+        .map(([label, registry]) => ({ label, registry })),
+    }))
+    .filter((run) => run.lineages.length >= 2)
+    .sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
+}
+
+/**
+ * Read one lineage registry's findings.
+ *
+ * An unreadable or malformed registry cannot evidence a pair, and one bad file
+ * must not sink a census over hundreds of runs, so it reads as a lineage that
+ * registered nothing, the same treatment the run-time census gives it.
+ *
+ * @param {string} root - Repository root the registry path is relative to
+ * @param {string} loop - `research` or `review`
+ * @param {string} registry - Repo-relative registry path
+ * @returns {Array<Object>} Findings that carry an identity, in registry order
+ */
+function findingsOf(root, loop, registry) {
+  const field = LINEAGE_REGISTRY_FINDINGS_FIELDS[loop];
+  if (typeof field !== 'string') return [];
+  let parsed;
+  try {
+    parsed = JSON.parse(fs.readFileSync(path.join(root, registry), 'utf8'));
+  } catch {
+    return [];
+  }
+  const rows = parsed && Array.isArray(parsed[field]) ? parsed[field] : [];
+  return rows.filter((finding) => findingId(loop, finding) !== null);
+}
+
+/**
+ * The identity the merge keys a finding by: its own id, or its title when the
+ * producer left the id off. The merge accepts either as the key, so the census
+ * reads them the same way; otherwise a title-only finding would be nameless on
+ * one side and named on the other, and the two sides would judge different pairs.
+ *
+ * @param {string} loop - `research` or `review`
+ * @param {Object} finding - One registry finding
+ * @returns {string|null} The id, the title fallback, or null when neither exists
+ */
+function findingId(loop, finding) {
+  if (!finding || typeof finding !== 'object') return null;
+  const id = loop === 'review' ? finding.findingId : finding.id;
+  return (id || finding.title) || null;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 4. SELECTION
+// ─────────────────────────────────────────────────────────────────────────────
+
+// The merge's own stable serializer and text normalizer, copied with the body key
+// below so the census reads a finding exactly as the merge reads it. A local variant
+// would make the shadow record measure a different rule than the one it shadows.
+function stableValue(value) {
+  if (Array.isArray(value)) {
+    return value.map(stableValue);
+  }
+  if (value && typeof value === 'object') {
+    const sorted = {};
+    for (const key of Object.keys(value).sort()) {
+      sorted[key] = stableValue(value[key]);
+    }
+    return sorted;
+  }
+  return value;
+}
+
+function stableStringify(value) {
+  return JSON.stringify(stableValue(value));
+}
+
+function normalizeSortText(value) {
+  return typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : '';
+}
+
+// The merge's identity for the rare finding whose body and title are both empty: its
+// content identity with the merge's own annotations stripped, so annotating a finding
+// never moves its key. `_lineage` joins that strip list because the census attaches it,
+// and a marker the census added must not change the key the census computes.
+function contentIdentityKey(record) {
+  const durableText = [
+    record.title,
+    record.summary,
+    record.description,
+    record.finding,
+    record.question,
+    record.direction,
+  ].map(normalizeSortText).filter(Boolean).join('\u0001');
+  return durableText || stableStringify({
+    ...record,
+    _conflictOf: undefined,
+    _conflict_id: undefined,
+    _conflicts: undefined,
+    _lineages: undefined,
+    _lineage: undefined,
+    severity: undefined,
+    status: undefined,
+  });
+}
+
+// The fields, in the merge's own order, whose normalized text makes up a finding's
+// durable body.
+function durableBodyText(record) {
+  return [
+    record.summary,
+    record.description,
+    record.finding,
+    record.question,
+    record.direction,
+  ].map(normalizeSortText).filter(Boolean).join('\u0001');
+}
+
+/**
+ * The body identity the merge keys a finding by, copied from its own
+ * `nearDuplicateContentKey`: the durable body fields joined, else the content identity.
+ *
+ * The census must see the same body key the merge collapses on, so this is the merge's
+ * function rather than a second implementation; the two change together.
+ *
+ * @param {Object} record - One registry finding
+ * @returns {string} Joined durable body text, or the content identity
+ */
+function bodyKey(record) {
+  return durableBodyText(record) || contentIdentityKey(record);
+}
+
+function contentTokens(text) {
+  const raw = typeof text === 'string' ? text : '';
+  return new Set(normalizeSortText(raw).split(/[^a-z0-9]+/).filter((token) => token && !TITLE_STOPWORDS.has(token)));
+}
+
+/**
+ * The content tokens of a finding's title: lowercased words with the stopwords
+ * stripped, as the merge tokenizes titles before measuring their overlap.
+ *
+ * @param {Object} record - One registry finding
+ * @returns {Set<string>} The title's content tokens
+ */
+function titleTokens(record) {
+  const raw = record && typeof record.title === 'string' ? record.title : '';
+  return contentTokens(raw);
+}
+
+/**
+ * Jaccard overlap of two token sets, as the merge measures title overlap.
+ *
+ * Two empty sets score 1 and one empty set scores 0: with no title tokens there is no
+ * signal to tell the findings apart, which is how the merge reads a title-less pair.
+ *
+ * @param {Set<string>} aTokens - One token set
+ * @param {Set<string>} bTokens - The other token set
+ * @returns {number} Shared tokens over union, 1 when both sets are empty
+ */
+function overlap(aTokens, bTokens) {
+  if (aTokens.size === 0 && bTokens.size === 0) return 1;
+  if (aTokens.size === 0 || bTokens.size === 0) return 0;
+  let shared = 0;
+  for (const token of aTokens) if (bTokens.has(token)) shared += 1;
+  const union = aTokens.size + bTokens.size - shared;
+  return union === 0 ? 1 : shared / union;
+}
+
+/**
+ * The text a model reads for one finding, the durable signal first: its body text,
+ * else its title, else the record's own JSON so a caller always has text.
+ *
+ * @param {Object} record - One registry finding
+ * @returns {string} Body text, title, or the stringified record
+ */
+function findingText(record) {
+  const body = durableBodyText(record);
+  if (body) return body;
+  const title = record && typeof record.title === 'string' ? record.title : '';
+  return title || JSON.stringify(record);
+}
+
+/**
+ * The overlap the census falls back to when a title cannot carry the signal: the
+ * title overlap when both findings have title tokens, else the overlap of the text a
+ * model would read for them.
+ *
+ * @param {Object} a - One finding
+ * @param {Object} b - The other finding
+ * @returns {number} Jaccard overlap of the chosen text
+ */
+function titleOrTextOverlap(a, b) {
+  const aTitleTokens = titleTokens(a);
+  const bTitleTokens = titleTokens(b);
+  if (aTitleTokens.size > 0 && bTitleTokens.size > 0) return overlap(aTitleTokens, bTitleTokens);
+  return overlap(contentTokens(findingText(a)), contentTokens(findingText(b)));
+}
+
+/**
+ * Class a pair of findings from two lineages, or null when neither class fits.
+ *
+ * Near-line is the same-body class: one body identity and a title overlap inside the
+ * band, which brackets the merge's own single collapse threshold so the record holds
+ * both the pairs the merge collapses and the near misses it does not. Cross-body is
+ * the pair a body-only key never sees: two different bodies whose text still points
+ * at one problem.
+ *
+ * @param {Object} a - One finding
+ * @param {Object} b - The other finding
+ * @returns {'near-line'|'cross-body'|null} The pair's class
+ */
+function classifyPair(a, b) {
+  if (bodyKey(a) === bodyKey(b)) {
+    const titleScore = overlap(titleTokens(a), titleTokens(b));
+    return titleScore >= NEAR_LINE_MIN_OVERLAP && titleScore < NEAR_LINE_MAX_OVERLAP ? 'near-line' : null;
+  }
+  return titleOrTextOverlap(a, b) >= CROSS_BODY_MIN_OVERLAP ? 'cross-body' : null;
+}
+
+/**
+ * The stable identity of one candidate pair.
+ *
+ * A pair must key the same whichever lineage is read first, so the two sides are
+ * ordered by lineage label and then by finding id; the sheet, the label file and the
+ * merge oracle all join on this string.
+ *
+ * @param {string} loop - `research` or `review`
+ * @param {string} runDir - Run directory relative to the repository root
+ * @param {Object} a - One finding, carrying its lineage label as `_lineage`
+ * @param {Object} b - The other finding, carrying its lineage label as `_lineage`
+ * @returns {string} `<loop>:<runDir>#<label>@<id>|<label>@<id>`
+ */
+function pairKey(loop, runDir, a, b) {
+  const sides = [
+    { label: a && typeof a._lineage === 'string' ? a._lineage : '', id: findingId(loop, a) ?? '' },
+    { label: b && typeof b._lineage === 'string' ? b._lineage : '', id: findingId(loop, b) ?? '' },
+  ];
+  sides.sort((left, right) => {
+    if (left.label !== right.label) return left.label < right.label ? -1 : 1;
+    if (left.id === right.id) return 0;
+    return left.id < right.id ? -1 : 1;
+  });
+  return `${loop}:${runDir}#${sides[0].label}@${sides[0].id}|${sides[1].label}@${sides[1].id}`;
+}
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
+ * Classify every finding pair that spans two lineages of a run.
+ *
+ * A pair inside one lineage is no candidate: the merge folds a lineage's own rows into
+ * one stream, and only a second lineage gives it a cross-lineage collapse to shadow.
+ * Every surviving pair carries both findings with their lineage labels, the texts the
+ * merge compares and the key the sheet and the labels join on, so each later consumer
+ * reads one record shape.
+ *
+ * @param {string} root - Repository root the registries are relative to
+ * @param {Object} [deps] - Injected collaborators, as `walkRuns` takes
+ * @returns {{'near-line': Array<Object>, 'cross-body': Array<Object>}} Classed pairs per kind, each `{key, loop, runDir, kind, la, a, lb, b, textA, textB}`
+ */
+function selectCandidates(root, deps = {}) {
+  const byKind = { 'near-line': [], 'cross-body': [] };
+  for (const run of walkRuns(root, deps)) {
+    const lineages = run.lineages.map((lineage) => ({
+      label: lineage.label,
+      findings: findingsOf(root, run.loop, lineage.registry),
+    }));
+    for (let left = 0; left < lineages.length; left += 1) {
+      for (let right = left + 1; right < lineages.length; right += 1) {
+        const aLineage = lineages[left];
+        const bLineage = lineages[right];
+        for (const a of aLineage.findings) {
+          for (const b of bLineage.findings) {
+            const kind = classifyPair(a, b);
+            if (kind === null) continue;
+            const markedA = { ...a, _lineage: aLineage.label };
+            const markedB = { ...b, _lineage: bLineage.label };
+            byKind[kind].push({
+              key: pairKey(run.loop, run.runDir, markedA, markedB),
+              loop: run.loop,
+              runDir: run.runDir,
+              kind,
+              la: aLineage.label,
+              a: markedA,
+              lb: bLineage.label,
+              b: markedB,
+              textA: findingText(a),
+              textB: findingText(b),
+            });
+          }
+        }
+      }
+    }
+  }
+  return byKind;
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 5. MERGE ORACLE
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * The merge's own decision on one pair: whether it folds the two findings into
+ * one, keeps both, or reads neither.
+ *
+ * The oracle must read the shipped merge rather than a copy of its rule, so this
+ * hands the merge a one-finding registry per side -- the smallest shape its
+ * schema normalization accepts -- and counts what comes back. One finding means
+ * the merge called the pair the same, two means it kept them apart, and a side the
+ * merge drops even on its own (a finding the review marked inactive, or a finding
+ * with no identity) leaves the pair undecidable, the third state the census
+ * records and keeps out of the classes.
+ *
+ * @param {string} loop - `research` or `review`
+ * @param {string} la - The first lineage's label
+ * @param {Object} fa - The first lineage's finding
+ * @param {string} lb - The second lineage's label
+ * @param {Object} fb - The second lineage's finding
+ * @param {boolean} dedup - Whether the merge folds near-duplicates
+ * @returns {'same'|'different'|'undecidable'} The merge's decision
+ */
+function mergeDecision(loop, la, fa, lb, fb, dedup) {
+  const field = LINEAGE_REGISTRY_FINDINGS_FIELDS[loop];
+  if (typeof field !== 'string') return 'undecidable';
+  const merge = loop === 'review' ? mergeReviewRegistries : mergeResearchRegistries;
+  const options = { enableNearDuplicateDedup: dedup === true };
+  const countOf = (registries) => {
+    const merged = merge(registries, options);
+    return Array.isArray(merged[field]) ? merged[field].length : 0;
+  };
+  // A side the merge drops on its own never reaches the comparison, so a lone
+  // survivor would read as a fold that never happened.
+  if (countOf([{ label: la, registry: { [field]: [fa] } }]) !== 1) return 'undecidable';
+  if (countOf([{ label: lb, registry: { [field]: [fb] } }]) !== 1) return 'undecidable';
+  const both = countOf([
+    { label: la, registry: { [field]: [fa] } },
+    { label: lb, registry: { [field]: [fb] } },
+  ]);
+  if (both === 1) return 'same';
+  if (both === 2) return 'different';
+  return 'undecidable';
+}
+
+/**
+ * Score the merge against the operator's labels, under both dedup settings.
+ *
+ * The merge is the incumbent a backend must beat, so its agreement with the
+ * labels is the bar a verdict is read against; counting both settings shows
+ * whether the shipped default or near-duplicate folding reads the corpus better.
+ * A tie keeps the shipped default, dedup off, so a backend is asked to add
+ * signal only where folding measurably helps.
+ *
+ * @param {Array<Object>} labeled - Classed pair records, each carrying the operator's `label`
+ * @returns {{method: 'dedup-on'|'dedup-off', onRight: number, offRight: number, right: number}} The better setting and its right count
+ */
+function readBaseline(labeled) {
+  let onRight = 0;
+  let offRight = 0;
+  for (const pair of Array.isArray(labeled) ? labeled : []) {
+    const label = pair && pair.label;
+    if (label !== 'same' && label !== 'different') continue;
+    const onDecision = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, true);
+    const offDecision = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, false);
+    if (onDecision === label) onRight += 1;
+    if (offDecision === label) offRight += 1;
+  }
+  // A tie keeps the shipped default: dedup is off unless a run opts in, so the
+  // baseline claims folding helps only when it measurably reads more pairs right.
+  const method = onRight > offRight ? 'dedup-on' : 'dedup-off';
+  return { method, onRight, offRight, right: method === 'dedup-on' ? onRight : offRight };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 6. PAIR SHEET, LABELS AND GATE
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * Write the pair sheet the operator labels: at most the first 60 pairs of each
+ * class by SHA-256 of the pair key, each row carrying both findings' text,
+ * their lineages, the run path and an empty label.
+ *
+ * The per-class cap keeps a hand-labeling task to one sitting, and hashing the
+ * key makes the sample the same on every machine for the same corpus. A target
+ * that resolves inside the repository root is refused before anything is
+ * created: the sheet is the operator's gold and must stay outside the tree it
+ * judges.
+ *
+ * @param {{'near-line': Array<Object>, 'cross-body': Array<Object>}} pairs - Classed pairs from the census
+ * @param {string} sheetPath - Destination path for the sheet
+ * @param {string} root - Repository root the sheet must stay outside of
+ * @returns {number} Rows written
+ * @throws {Error} When the target resolves inside the repository root
+ */
+function writePairSheet(pairs, sheetPath, root) {
+  const resolved = path.resolve(sheetPath);
+  const boundary = path.resolve(root);
+  if (resolved === boundary || resolved.startsWith(`${boundary}${path.sep}`)) {
+    throw new Error('refusing to write the pair sheet inside the repository');
+  }
+  const lines = [];
+  for (const kind of ['near-line', 'cross-body']) {
+    const classed = pairs && Array.isArray(pairs[kind]) ? pairs[kind] : [];
+    const ordered = [...classed].sort((left, right) => {
+      const leftHash = sha256Hex(left.key);
+      const rightHash = sha256Hex(right.key);
+      if (leftHash === rightHash) return 0;
+      return leftHash < rightHash ? -1 : 1;
+    });
+    for (const pair of ordered.slice(0, SHEET_PER_CLASS)) {
+      lines.push(JSON.stringify({
+        pair_key: pair.key,
+        class: kind,
+        loop: pair.loop,
+        run_dir: pair.runDir,
+        lineages: [pair.la, pair.lb],
+        text_a: pair.textA,
+        text_b: pair.textB,
+        label: '',
+      }));
+    }
+  }
+  fs.mkdirSync(path.dirname(resolved), { recursive: true });
+  fs.writeFileSync(resolved, lines.length === 0 ? '' : `${lines.join('\n')}\n`, 'utf8');
+  return lines.length;
+}
+
+/**
+ * Parse the operator's filled pair sheet into a pair-keyed map.
+ *
+ * Only keys the sheet still holds are kept: a label left over from an older
+ * sheet cannot score a pair the census no longer sees. Any value outside the
+ * two gold classes is a typo in the gold itself, so it stops the run instead
+ * of silently shrinking the labeled set.
+ *
+ * @param {string} text - Filled sheet contents, one JSON object per line
+ * @param {Map<string, Object>} pairIndex - The sheet's pairs, keyed by pair key
+ * @returns {Map<string, 'same'|'different'>} Kept labels, in file order
+ * @throws {Error} When a row is not JSON, names no key, carries another value, or repeats a key
+ */
+function parseLabels(text, pairIndex) {
+  const labels = new Map();
+  const sheet = pairIndex instanceof Map ? pairIndex : new Map();
+  const seen = new Set();
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
+    const key = isPlainObject ? parsed.pair_key : undefined;
+    if (typeof key !== 'string' || key.length === 0) {
+      throw new Error(`labels row ${row}: pair_key must be a pair key`);
+    }
+    const value = parsed.label;
+    if (value !== 'same' && value !== 'different') {
+      throw new Error(`labels row ${row}: label must be same or different, got ${JSON.stringify(value)}`);
+    }
+    if (seen.has(key)) throw new Error(`labels row ${row}: duplicate pair ${key}`);
+    seen.add(key);
+    if (!sheet.has(key)) continue;
+    labels.set(key, value);
+  }
+  return labels;
+}
+
+/**
+ * The gate's state and the one line it prints: the two label floors, the
+ * baseline's headroom, or the open run with the calls it plans.
+ *
+ * Every arm stays closed until both floors are met, so a backend is never
+ * scored on fewer pairs than the sign test needs. A baseline already right on
+ * more than nine pairs in ten leaves no room for a backend to show a gain, and
+ * the comparison is strict so exactly ninety percent still opens.
+ *
+ * @param {Map<string, 'same'|'different'>} labels - Kept labels from the reader
+ * @param {Map<string, Object>} pairIndex - The sheet's pairs, keyed by pair key
+ * @param {{right: number}} baseline - The baseline an arm must beat
+ * @returns {{kind: 'label'|'cross-body'|'headroom'|'open', line: string}} Gate state and printed line
+ */
+function gateState(labels, pairIndex, baseline) {
+  const sheet = pairIndex instanceof Map ? pairIndex : new Map();
+  let crossBody = 0;
+  for (const key of labels.keys()) {
+    const pair = sheet.get(key);
+    if (pair && pair.kind === 'cross-body') crossBody += 1;
+  }
+  const labeled = labels.size;
+  if (labeled < LABEL_GATE) {
+    return { kind: 'label', line: `stop: fewer than ${LABEL_GATE} labeled pairs` };
+  }
+  if (crossBody < CROSS_BODY_LABEL_GATE) {
+    return { kind: 'cross-body', line: `stop: fewer than ${CROSS_BODY_LABEL_GATE} labeled cross-body pairs` };
+  }
+  if (baseline.right > HEADROOM * labeled) {
+    return { kind: 'headroom', line: 'no headroom' };
+  }
+  return { kind: 'open', line: `planned calls: jev ${3 * labeled + 1}, deem ${2 * labeled}` };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 7. JEV GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+/**
+ * First executable file of this name on PATH, or null when none is executable.
+ * Empty PATH entries are skipped; a missing path, a directory, or a file that
+ * cannot be executed is not a match.
+ *
+ * @param {string} name - Executable file name
+ * @param {Record<string, string|undefined>} env - Environment whose PATH is searched
+ * @returns {string|null} First executable match, or null when none is executable
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
+ * Whether a path exists at the published branch.
+ *
+ * Only text already committed there may leave the machine for the hosted
+ * backend, so the answer comes from git and never from the working tree.
+ *
+ * @param {string} relPath - Repo-relative path to test
+ * @param {{ git?: Function }} [deps] - Injected git runner, as `main` takes
+ * @returns {boolean} True when git finds the path at origin/main
+ */
+function publishedAt(relPath, { git } = {}) {
+  const run = typeof git === 'function' ? git : (args) => spawnSync('git', args, {
+    encoding: 'utf8',
+    stdio: ['ignore', 'pipe', 'pipe'],
+  });
+  const result = run(['cat-file', '-e', `origin/main:${relPath}`]);
+  return Boolean(result) && !result.error && result.status === 0;
+}
+
+/**
+ * Identity line, then the pinned client version and a credential check under
+ * the one provider every later call reuses. A miss prints a skip line and
+ * leaves the census text already written; none of the checks sends a payload.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>,
+ *   timeoutMs?: number }} ctx - Line writer, environment and per-call timeout
+ * @returns {{ passed: boolean, path: string|null, provider: string, reason?: string }}
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
+    timeout: ctx.timeoutMs ?? JEV_CALL_TIMEOUT_MS,
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
+ * The text one call reads for a pair, the two findings under their own
+ * headings. The BA order swaps the two blocks so neither finding keeps the
+ * first position across a pair's calls.
+ *
+ * @param {string} aText - The first finding's text
+ * @param {string} bText - The second finding's text
+ * @param {'AB'|'BA'} order - The order the pair is asked in
+ * @returns {string} `Finding A:` and `Finding B:` blocks, swapped for BA
+ */
+function stateText(aText, bText, order) {
+  const first = order === 'BA' ? bText : aText;
+  const second = order === 'BA' ? aText : bText;
+  return `Finding A:\n${first}\n\nFinding B:\n${second}\n`;
+}
+
+/**
+ * One bounded child process. Resolves exactly once with the exit code, the
+ * collected output, the wall time and whether the timeout fired. The timer
+ * kills the child and resolves at once, without waiting for close: a
+ * grandchild can hold the pipes open past the kill. Stdin is closed after the
+ * write because the CLI reads it to EOF and exits 2 on an inherited terminal.
+ * A spawn error is code 127 with the message as stderr.
+ *
+ * @param {string} file - Executable to spawn
+ * @param {string[]} args - Arguments after the executable
+ * @param {string} stdinText - Text written to stdin, then closed
+ * @param {Record<string, string|undefined>} env - Child environment
+ * @param {number} timeoutMs - Kill and resolve after this many milliseconds
+ * @returns {Promise<{ code: number|null, stdout: string, stderr: string,
+ *   wallMs: number, timedOut: boolean }>} Call outcome
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
+    // A child that exits before reading stdin cannot fail the call through the
+    // pipe: its exit code is the outcome the caller needs.
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
+ * keeps no records, so nothing is created. The file is created on the first
+ * append, and one line per call keeps a killed arm's earlier records readable.
+ *
+ * @param {string|undefined} outDir - Directory that holds calls.jsonl
+ * @returns {{ append: (record: object) => void }} Append-only call log
+ */
+function createCallLog(outDir) {
+  let created = false;
+  return {
+    append(record) {
+      if (typeof outDir !== 'string' || outDir === '') return;
+      const file = path.join(outDir, 'calls.jsonl');
+      if (!created) {
+        fs.mkdirSync(outDir, { recursive: true });
+        fs.writeFileSync(file, '');
+        created = true;
+      }
+      fs.appendFileSync(file, `${JSON.stringify(record)}\n`);
+    },
+  };
+}
+
+/**
+ * The Jev arm: the published pairs first, then one auth test under the
+ * provider the gate passed and one call per fixed order, so the hosted model
+ * is sampled three times and no answer is reused. A pair whose registries are
+ * not both at origin/main is withheld whole and gets no call. A call that
+ * exits without a finite noul stays unmeasured, an exit-4 call waits once and
+ * retries, and a stop line ends the arm with the pairs it finished. A finished
+ * column prints the verdict line the Keep Rule read.
+ *
+ * @param {{ rows: Array<{ key: string, label: string, textA: string,
+ *   textB: string, registries?: string[] }>,
+ *   baselineCalls: Map<string, 'same'|'different'> }} plan - Labeled pairs
+ *   with their texts and registries, and the baseline's call per pair
+ * @param {{ path: string, provider: string }} gate - Passing jevGate result
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>,
+ *   timeoutMs?: number, backoffMs?: number,
+ *   callLog: { append: (record: object) => void }, stored?: object|null,
+ *   git?: Function, publishedAt?: (relPath: string) => boolean }} ctx - Line
+ *   writer, environment, per-call bounds, call log, the earlier report and the
+ *   published-check seam
+ * @returns {Promise<{ column: object, requalify: string|null } |
+ *   { stopped: string, partialRows: number }>} The finished column or the stop
+ *   line with the pairs finished
+ */
+async function runJevArm(plan, gate, ctx) {
+  const jevVersion = JEV_VERSION.split(' ')[1];
+  const timeoutMs = ctx.timeoutMs ?? JEV_CALL_TIMEOUT_MS;
+  const backoffMs = ctx.backoffMs ?? JEV_BACKOFF_MS;
+  const rows = Array.isArray(plan.rows) ? plan.rows : [];
+  const isPublished = typeof ctx.publishedAt === 'function'
+    ? ctx.publishedAt
+    : (relPath) => publishedAt(relPath, { git: ctx.git });
+
+  // Withheld pairs are recorded before the arm spends anything, and a row
+  // without registries cannot prove publication, so it is withheld too.
+  const callable = [];
+  for (const row of rows) {
+    const registries = Array.isArray(row.registries) ? row.registries : [];
+    if (registries.length > 0 && registries.every((relPath) => isPublished(relPath))) {
+      callable.push(row);
+    } else {
+      ctx.callLog.append({
+        pair_key: row.key,
+        backend: 'jev',
+        order: null,
+        wall_ms: 0,
+        exit_code: null,
+        probability: null,
+        status: 'unmeasured_unpublished',
+        jev_version: jevVersion,
+        provider: gate.provider,
+        model: null,
+      });
+    }
+  }
+
+  let chars = 0;
+  for (const row of callable) {
+    const textA = typeof row.textA === 'string' ? row.textA : '';
+    const textB = typeof row.textB === 'string' ? row.textB : '';
+    for (const order of JEV_ORDERS) chars += stateText(textA, textB, order).length + NOUL_QUESTION.length;
+  }
+  ctx.out(`jev: payload: published fan-out finding text; planned calls: ${JEV_ORDERS.length * callable.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`);
+
+  let finished = 0;
+  let model = 'unknown';
+  const answers = new Map();
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`jev: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  /**
+   * One calls.jsonl record. A spawn that led to a stop or a retry carries no
+   * judgment, so its probability and status stay empty.
+   */
+  function record(row, order, call, probability, status) {
+    return {
+      pair_key: row.key,
+      backend: 'jev',
+      order,
+      wall_ms: call.wallMs,
+      exit_code: call.code,
+      probability,
+      status,
+      jev_version: jevVersion,
+      provider: gate.provider,
+      model,
+    };
+  }
+
+  const auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, timeoutMs);
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
+    pair_key: null,
+    backend: 'jev',
+    order: null,
+    wall_ms: auth.wallMs,
+    exit_code: auth.code,
+    probability: null,
+    status: auth.code === 0 ? 'measured' : 'unmeasured',
+    jev_version: jevVersion,
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
+  for (const row of callable) {
+    const textA = typeof row.textA === 'string' ? row.textA : '';
+    const textB = typeof row.textB === 'string' ? row.textB : '';
+    const values = [];
+    for (const order of JEV_ORDERS) {
+      const state = stateText(textA, textB, order);
+      const args = ['noul', '--provider', gate.provider, '-q', NOUL_QUESTION];
+      let call = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
+
+      if (!call.timedOut && call.code === 4) {
+        ctx.callLog.append(record(row, order, call, null, 'unmeasured'));
+        await new Promise((resolve) => setTimeout(resolve, backoffMs));
+        call = await spawnCall(gate.path, args, state, ctx.env, timeoutMs);
+      }
+
+      let probability = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (call.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (call.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(call.stdout);
+        } catch {
+          // A body that does not parse is an unmeasured call, not a crash.
+        }
+        const value = parsed?.answers?.answer?.noul;
+        if (Number.isFinite(value) && value >= 0 && value <= 1) {
+          probability = value;
+          status = 'measured';
+        }
+      } else if (call.code === 2) {
+        stopLine = 'jev arm stopped: usage error';
+      } else if (call.code === 3) {
+        stopLine = 'jev arm stopped: key rejected';
+      } else if (call.code === 130) {
+        stopLine = 'jev arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, order, call, probability, status));
+      if (stopLine !== null) return stop(stopLine);
+      values.push(probability);
+    }
+    answers.set(row.key, values);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'jev',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    `jev_version=${jevVersion} provider=${gate.provider} model=${model}`,
+  );
+  const storedJev = ctx.stored?.columns?.jev;
+  let requalify = null;
+  if (storedJev && (storedJev.provider !== gate.provider || storedJev.model !== model)) {
+    requalify = 'requalify: model changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+  return { column: { ...column, jevVersion, provider: gate.provider, model }, requalify };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 8. DEEM GATE AND ARM
+// ─────────────────────────────────────────────────────────────────────────────
+
+// Repo copy of the cli-deem entry point, run under node when none is on PATH,
+// so the arm works from a checkout without the client installed and never
+// starts the server itself.
+const REPO_CLI_DEEM = path.resolve(__dirname, '../../../cli-classifier/cli-deem/scripts/cli-deem.mjs');
+
+/**
+ * cli-deem on PATH when that file is executable, otherwise the repo copy under
+ * node, so the arm still runs from a checkout without the client installed.
+ *
+ * @param {Record<string, string|undefined>} env - Environment whose PATH is searched
+ * @returns {string[]} Command and leading arguments for one call
+ */
+function deemCommand(env) {
+  const onPath = which('cli-deem', env);
+  if (onPath !== null) return [onPath];
+  return [process.execPath, REPO_CLI_DEEM];
+}
+
+/**
+ * One health check. An unreachable binary, a stub backend, a wrong model or a
+ * malformed body is a failed check the caller prints as a skip. A stub backend
+ * also answers `ok`, so the backend name is read before the model.
+ *
+ * @param {string[]} cmd - Command from deemCommand
+ * @param {Record<string, string|undefined>} env - Environment for the call
+ * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } |
+ *   { ok: false, reason: string, found: unknown }} Health identity, or the reason the check failed and what it found
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
+ * The gate that keeps the Deem arm closed until the local server identifies
+ * itself with the pinned model and both build commits. A miss prints its skip
+ * line -- with what was found when the body itself was wrong -- and leaves the
+ * census text already written untouched.
+ *
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined> }} ctx - Line writer and environment
+ * @returns {{ passed: boolean, cmd: string[], reason?: string }} Whether the gate opened, the command it resolved and the skip line when it did not
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
+ * Parsed report.json written by an earlier run into the same out directory.
+ * A later run reads it to requalify a verdict the earlier run measured on a
+ * different model pair, before printing its own.
+ *
+ * @param {string|undefined} outDir - Directory that may hold report.json
+ * @returns {object|null} The parsed report, or null when outDir is empty, the
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
+ * Nearest-rank percentile. An empty list has no rank.
+ *
+ * @param {number[]} values - Raw values
+ * @param {number} q - Quantile in (0, 1]
+ * @returns {number|null} The value at the nearest rank, or null for an empty list
+ */
+function nearestRank(values, q) {
+  if (values.length === 0) return null;
+  const sorted = [...values].sort((left, right) => left - right);
+  return Math.round(sorted[Math.ceil(q * sorted.length) - 1]);
+}
+
+/**
+ * The Deem arm: the notice first, then one noul call per fixed order of every
+ * pair, because the local model is sampled once per call and a second order is
+ * what exposes a judgment it does not hold. A dropped connection (exit 4)
+ * rechecks the health and retries once, since it is not a judgment; a changed
+ * commit pair or a dead server stops the arm with its line. A pair whose two
+ * orders split is left for the column to read as unstable, and a finished
+ * column prints the verdict line the Keep Rule read.
+ *
+ * @param {{ rows: Array<{ key: string, label: string, textA: string,
+ *   textB: string }>, baselineCalls: Map<string, 'same'|'different'> }} plan -
+ *   Labeled pairs with their texts, and the baseline's call per pair
+ * @param {{ cmd: string[], model: string, modelCommit: string,
+ *   sourceCommit: string }} gate - Passing deemGate result
+ * @param {{ out: (line: string) => void, env: Record<string, string|undefined>,
+ *   timeoutMs?: number, callLog: { append: (record: object) => void },
+ *   stored?: object|null }} ctx - Line writer, environment, per-call bound,
+ *   call log and the earlier report
+ * @returns {Promise<{ column: object, requalify: string|null } |
+ *   { stopped: string, partialRows: number }>} The finished column or the stop
+ *   line with the pairs finished
+ */
+async function runDeemArm(plan, gate, ctx) {
+  const timeoutMs = ctx.timeoutMs ?? JEV_CALL_TIMEOUT_MS;
+  const rows = Array.isArray(plan.rows) ? plan.rows : [];
+  const planned = DEEM_ORDERS.length * rows.length;
+  ctx.out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 from deem-local.md`);
+
+  let finished = 0;
+  const answers = new Map();
+
+  function stop(line) {
+    ctx.out(line);
+    ctx.out(`deem: partial rows=${finished}`);
+    return { stopped: line, partialRows: finished };
+  }
+
+  /**
+   * One calls.jsonl record. A call that led to a stop or a retry carries no
+   * judgment, so its probability and status stay empty.
+   */
+  function record(row, order, call, probability, status) {
+    return {
+      pair_key: row.key,
+      backend: 'deem',
+      order,
+      wall_ms: call.wallMs,
+      exit_code: call.code,
+      probability,
+      status,
+      model: gate.model,
+      model_commit: gate.modelCommit,
+      source_commit: gate.sourceCommit,
+    };
+  }
+
+  for (const row of rows) {
+    const textA = typeof row.textA === 'string' ? row.textA : '';
+    const textB = typeof row.textB === 'string' ? row.textB : '';
+    const values = [];
+    for (const order of DEEM_ORDERS) {
+      const state = stateText(textA, textB, order);
+      const args = ['noul', '-q', NOUL_QUESTION];
+      let call = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], state, ctx.env, timeoutMs);
+
+      if (!call.timedOut && call.code === 4) {
+        ctx.callLog.append(record(row, order, call, null, 'unmeasured'));
+        const health = readDeemHealth(gate.cmd, ctx.env);
+        if (!health.ok) return stop('deem arm stopped: server gone');
+        if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
+          return stop('deem arm stopped: model commit changed mid-run');
+        }
+        call = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], state, ctx.env, timeoutMs);
+      }
+
+      let probability = null;
+      let status = 'unmeasured';
+      let stopLine = null;
+      if (call.timedOut) {
+        status = 'unmeasured_timeout';
+      } else if (call.code === 0) {
+        let parsed;
+        try {
+          parsed = JSON.parse(call.stdout);
+        } catch {
+          // A body that does not parse is an unmeasured call, not a crash.
+        }
+        const value = parsed?.answers?.answer?.noul;
+        if (Number.isFinite(value) && value >= 0 && value <= 1) {
+          probability = value;
+          status = 'measured';
+        }
+      } else if (call.code === 2) {
+        stopLine = 'deem arm stopped: usage error';
+      } else if (call.code === 3) {
+        stopLine = 'deem arm stopped: backend refused';
+      } else if (call.code === 130) {
+        stopLine = 'deem arm stopped: interrupted';
+      }
+
+      ctx.callLog.append(record(row, order, call, probability, status));
+      if (stopLine !== null) return stop(stopLine);
+      values.push(probability);
+    }
+    answers.set(row.key, values);
+    finished += 1;
+  }
+
+  const column = summarizeColumn(
+    'deem',
+    plan.rows,
+    answers,
+    plan.baselineCalls,
+    `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`,
+  );
+  const storedDeem = ctx.stored?.columns?.deem;
+  let requalify = null;
+  if (storedDeem && (storedDeem.modelCommit !== gate.modelCommit || storedDeem.sourceCommit !== gate.sourceCommit)) {
+    requalify = 'requalify: model commit changed';
+    ctx.out(requalify);
+  }
+  ctx.out(column.line);
+  return {
+    column: { ...column, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit },
+    requalify,
+  };
+}
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 9. KEEP RULE, REPORT AND MAIN
+// ─────────────────────────────────────────────────────────────────────────────
+
+// One cut turns each order's probability into the call the modal rule counts
+// and decides which side of a pair the column's judgment falls on; keeping it
+// here leaves no caller free to score with its own threshold.
+const SAME_AT = 0.5;
+
+const USAGE = 'usage: score-fanout-pairs.cjs [--out <dir>] [--labels <file>] [--write-pair-sheet <path>] [--jev] [--deem]';
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
+ * test, flips. `p` is the tail the deciding step read, so a kill prints the
+ * loss tail while every other outcome prints the win tail.
+ *
+ * @param {{ backend: string, K: number, M: number, A: number, B: number,
+ *   W: number, L: number, F: number, C: number }} counts - Column counts
+ * @returns {{ backend: string, outcome: 'keep'|'kill'|'stop',
+ *   reason: 'coverage'|'margin'|'sign test'|'flips'|null, p: number }} Verdict
+ */
+function decideVerdict({ backend, K, M, A, B, W, L, F, C }) {
+  const win = binomialTail(W, W + L);
+  const loss = binomialTail(L, W + L);
+  if (!(10 * M >= 9 * K)) return { backend, outcome: 'stop', reason: 'coverage', p: win.p };
+  if (20n * loss.num < loss.den) return { backend, outcome: 'kill', reason: null, p: loss.p };
+  if (!(10 * (A - B) >= M)) return { backend, outcome: 'stop', reason: 'margin', p: win.p };
+  if (!(20n * win.num < win.den)) return { backend, outcome: 'stop', reason: 'sign test', p: win.p };
+  if (10 * F > C) return { backend, outcome: 'stop', reason: 'flips', p: win.p };
+  return { backend, outcome: 'keep', reason: null, p: win.p };
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
+ * One column's counts and verdict line. A pair is measured only when its
+ * answer array holds exactly one answer per order and every answer is a finite
+ * probability in [0, 1]; every other pair stays unmeasured and out of the
+ * counts. The modal answer decides the call, a Deem pair whose two orders
+ * disagree has no modal answer and counts as wrong with one flip, and the
+ * flips check reads the measured calls the column actually made.
+ *
+ * @param {'jev'|'deem'} backend - Backend name, printed on the verdict line
+ * @param {Array<{ key: string, label: string }>} rows - Labeled pairs, in file order
+ * @param {Map<string, Array<number|null>>} answers - Pair key -> one answer per order
+ * @param {Map<string, 'same'|'different'> & { method?: string }} baselineCalls -
+ *   Pair key -> the baseline's call, with the setting it was read under riding
+ *   on the map so the line can name the baseline it beat
+ * @param {string} suffix - Backend identity appended to the line when non-empty
+ * @returns {Object} Counts plus the verdict `line`
+ */
+function summarizeColumn(backend, rows, answers, baselineCalls, suffix) {
+  const expected = backend === 'jev' ? JEV_ORDERS.length : DEEM_ORDERS.length;
+  const baselineMethod = baselineCalls && typeof baselineCalls.method === 'string' ? baselineCalls.method : 'dedup-off';
+  const labeled = Array.isArray(rows) ? rows : [];
+  const K = labeled.length;
+  let M = 0;
+  let A = 0;
+  let B = 0;
+  let W = 0;
+  let L = 0;
+  let F = 0;
+
+  for (const row of labeled) {
+    const values = answers instanceof Map ? answers.get(row.key) : undefined;
+    if (!Array.isArray(values) || values.length !== expected) continue;
+    if (!values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) continue;
+    M += 1;
+
+    let call = null;
+    if (backend === 'jev') {
+      const sameVotes = values.filter((value) => value >= SAME_AT).length;
+      call = sameVotes >= 2 ? 'same' : 'different';
+      F += expected - (call === 'same' ? sameVotes : expected - sameVotes);
+    } else if (values.every((value) => value >= SAME_AT)) {
+      call = 'same';
+    } else if (values.every((value) => value < SAME_AT)) {
+      call = 'different';
+    } else {
+      // Two orders that disagree leave no modal answer, so the pair cannot be
+      // right and adds one flip: an unstable judgment never hides in the counts.
+      F += 1;
+    }
+
+    const columnRight = call !== null && call === row.label;
+    const baselineRight = baselineCalls instanceof Map && baselineCalls.get(row.key) === row.label;
+    if (columnRight) A += 1;
+    if (baselineRight) B += 1;
+    if (columnRight && !baselineRight) W += 1;
+    if (baselineRight && !columnRight) L += 1;
+  }
+
+  const C = expected * M;
+  const verdict = decideVerdict({ backend, K, M, A, B, W, L, F, C });
+  const outcomeText = verdict.reason === null ? verdict.outcome : `stop (${verdict.reason})`;
+  let line = `verdict ${backend}: ${outcomeText} K=${K} M=${M} A=${A} B=${B} W=${W} L=${L} F=${F} p=${formatP(verdict.p)} baseline=${baselineMethod} reader=none named`;
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
+    outcome: verdict.outcome,
+    reason: verdict.reason,
+    line,
+  };
+}
+
+/**
+ * Assemble the recorded report from one run: the question, the census, the
+ * labeled counts, the baseline, the gate line and one bucket per arm. A
+ * skipped arm lands in `skipped`, a stopped arm in `stopped` with the pairs it
+ * finished, and a finished column in `columns` with its verdict line, so the
+ * report never claims a verdict an arm did not print.
+ *
+ * @param {{ question: string, census: Object, labeled: Object, baseline: Object,
+ *   gate: string, jev?: Object, deem?: Object }} parts - Run results
+ * @returns {Object} Report object ready for JSON.stringify
+ */
+function buildReport(parts) {
+  const report = {
+    question: parts.question,
+    census: parts.census,
+    labeled: parts.labeled,
+    baseline: parts.baseline,
+    gate: parts.gate,
+    columns: {},
+    stopped: {},
+    skipped: {},
+    requalify: {},
+  };
+
+  for (const [backend, arm] of [['jev', parts.jev], ['deem', parts.deem]]) {
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
+    report.columns[backend] = arm.column;
+    report.requalify[backend] = arm.requalify ?? null;
+  }
+
+  return report;
+}
+
+/**
+ * Parse the switches, run the zero-call census, resolve the label gate and,
+ * for each requested arm whose own gate passes, score the backend column and
+ * record the run. Every refusal returns before the first model call or the
+ * report write, and the arms stay independent: one arm's skip or stop never
+ * runs the other backend in its place.
+ *
+ * @param {string[]} argv - Arguments after the script name
+ * @param {Object} [deps] - Injected collaborators
+ * @param {(line: string) => void} [deps.out] - Line writer, default stdout
+ * @param {(line: string) => void} [deps.err] - Error writer, default stderr
+ * @param {Record<string, string|undefined>} [deps.env] - Environment, default process.env
+ * @param {number} [deps.timeoutMs] - Per-call timeout, both arms
+ * @param {number} [deps.backoffMs] - Jev retry wait after an exit-4 call
+ * @param {string} [deps.root] - Repository root the census reads, default the repo root
+ * @param {Function} [deps.listTracked] - Tracked-path seam handed to the walker
+ * @param {Function} [deps.git] - Git runner the published check reads
+ * @returns {Promise<number>} Exit code: 0 on a completed run, 2 on a refusal
+ *   or unreadable input
+ */
+async function main(argv, deps = {}) {
+  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
+  const err = deps.err ?? ((line) => process.stderr.write(`${line}\n`));
+  const env = deps.env ?? process.env;
+  const timeoutMs = deps.timeoutMs ?? JEV_CALL_TIMEOUT_MS;
+  const backoffMs = deps.backoffMs ?? JEV_BACKOFF_MS;
+  const root = deps.root ?? path.resolve(__dirname, '../../../../..');
+
+  let values;
+  try {
+    values = parseArgs({
+      args: argv,
+      strict: true,
+      allowPositionals: false,
+      options: {
+        out: { type: 'string' },
+        labels: { type: 'string' },
+        'write-pair-sheet': { type: 'string' },
+        jev: { type: 'boolean' },
+        deem: { type: 'boolean' },
+      },
+    }).values;
+  } catch (error) {
+    err(error instanceof Error ? error.message : String(error));
+    err(USAGE);
+    return 2;
+  }
+
+  // A model arm records every call, so it cannot run without a directory to
+  // record into; the refusal comes before the census so nothing is spent or
+  // written on a run that can never measure anything.
+  const needOut = [];
+  if (values.jev === true) needOut.push('--jev');
+  if (values.deem === true) needOut.push('--deem');
+  if (needOut.length > 0 && (typeof values.out !== 'string' || values.out === '')) {
+    err(`${needOut.join(' and ')} ${needOut.length === 1 ? 'needs' : 'need'} --out <dir> so every call is recorded`);
+    return 2;
+  }
+
+  const runs = walkRuns(root, { listTracked: deps.listTracked });
+  const byKind = selectCandidates(root, { listTracked: deps.listTracked });
+
+  const loops = ['research', 'review'];
+  const classes = ['near-line', 'cross-body'];
+  const runCounts = { research: 0, review: 0 };
+  for (const run of runs) runCounts[run.loop] += 1;
+
+  const classCounts = { 'near-line': { research: 0, review: 0 }, 'cross-body': { research: 0, review: 0 } };
+  for (const kind of classes) {
+    for (const pair of byKind[kind]) classCounts[kind][pair.loop] += 1;
+  }
+  const pairCounts = {
+    research: classCounts['near-line'].research + classCounts['cross-body'].research,
+    review: classCounts['near-line'].review + classCounts['cross-body'].review,
+  };
+
+  out(`runs: research=${runCounts.research} review=${runCounts.review}`);
+  out(`pairs: research=${pairCounts.research} review=${pairCounts.review}`);
+  out(`class near-line: research=${classCounts['near-line'].research} review=${classCounts['near-line'].review}`);
+  out(`class cross-body: research=${classCounts['cross-body'].research} review=${classCounts['cross-body'].review}`);
+
+  // The merge is the incumbent, so the census reads its own decision on every
+  // classed pair under both dedup settings before any backend is measured.
+  const decisions = { 'near-line': {}, 'cross-body': {} };
+  let undecidable = 0;
+  for (const kind of classes) {
+    for (const loop of loops) {
+      const bucket = { on: { same: 0, different: 0 }, off: { same: 0, different: 0 } };
+      decisions[kind][loop] = bucket;
+      for (const pair of byKind[kind]) {
+        if (pair.loop !== loop) continue;
+        const on = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, true);
+        const off = mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, false);
+        if (on === 'undecidable' || off === 'undecidable') undecidable += 1;
+        if (on === 'same') bucket.on.same += 1;
+        else if (on === 'different') bucket.on.different += 1;
+        if (off === 'same') bucket.off.same += 1;
+        else if (off === 'different') bucket.off.different += 1;
+      }
+      out(`merge decisions: ${kind} ${loop} dedup-on same=${bucket.on.same} different=${bucket.on.different} dedup-off same=${bucket.off.same} different=${bucket.off.different}`);
+    }
+  }
+
+  // How many findings can reach the title rule or the body gate at all: a
+  // finding with no title tokens or no body text can only fall back to whole
+  // record identity, and these counts keep that blind spot visible.
+  const findingsByLoop = { research: [], review: [] };
+  for (const run of runs) {
+    for (const lineage of run.lineages) {
+      for (const finding of findingsOf(root, run.loop, lineage.registry)) findingsByLoop[run.loop].push(finding);
+    }
+  }
+  const titles = {};
+  const bodies = {};
+  for (const loop of loops) {
+    const findings = findingsByLoop[loop];
+    titles[loop] = {
+      titled: findings.filter((finding) => titleTokens(finding).size > 0).length,
+      total: findings.length,
+    };
+    bodies[loop] = {
+      bodied: findings.filter((finding) => durableBodyText(finding) !== '').length,
+      total: findings.length,
+    };
+    out(`title rule: ${loop}=${titles[loop].titled} of ${titles[loop].total} findings carry a title`);
+  }
+  for (const loop of loops) {
+    out(`body fields: ${loop}=${bodies[loop].bodied} of ${bodies[loop].total} findings carry a body field`);
+  }
+  out(`merge undecidable: ${undecidable}`);
+
+  const census = {
+    runs: runCounts,
+    pairs: pairCounts,
+    classes: classCounts,
+    decisions,
+    titles,
+    bodies,
+    undecidable,
+  };
+
+  const pairIndex = new Map();
+  for (const kind of classes) {
+    for (const pair of byKind[kind]) pairIndex.set(pair.key, pair);
+  }
+
+  if (typeof values['write-pair-sheet'] === 'string') {
+    try {
+      writePairSheet(byKind, values['write-pair-sheet'], root);
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+  }
+
+  let labels = new Map();
+  let dropped = 0;
+  if (typeof values.labels === 'string' && values.labels !== '') {
+    let text;
+    try {
+      text = fs.readFileSync(values.labels, 'utf8');
+    } catch (error) {
+      err(`cannot read labels: ${error instanceof Error ? error.message : String(error)}`);
+      return 2;
+    }
+    try {
+      labels = parseLabels(text, pairIndex);
+    } catch (error) {
+      err(error instanceof Error ? error.message : String(error));
+      return 2;
+    }
+    const rowsRead = text.split('\n').filter((line) => line.trim() !== '').length;
+    dropped = rowsRead - labels.size;
+  }
+
+  const labeledPairs = [];
+  for (const [key, label] of labels) {
+    const pair = pairIndex.get(key);
+    if (pair) labeledPairs.push({ ...pair, label });
+  }
+  const baseline = readBaseline(labeledPairs);
+  const gate = gateState(labels, pairIndex, baseline);
+  out(gate.line);
+
+  const registryByRunLineage = new Map();
+  for (const run of runs) {
+    for (const lineage of run.lineages) {
+      registryByRunLineage.set(`${run.loop}:${run.runDir}:${lineage.label}`, lineage.registry);
+    }
+  }
+  const baselineCalls = new Map();
+  for (const pair of labeledPairs) {
+    baselineCalls.set(pair.key, mergeDecision(pair.loop, pair.la, pair.a, pair.lb, pair.b, baseline.method === 'dedup-on'));
+  }
+  // The arms read one calls map; the setting those calls were taken under
+  // rides on it so each verdict line can name the baseline it was read against.
+  baselineCalls.method = baseline.method;
+  const plan = {
+    rows: labeledPairs.map((pair) => ({
+      key: pair.key,
+      label: pair.label,
+      textA: pair.textA,
+      textB: pair.textB,
+      registries: [
+        registryByRunLineage.get(`${pair.loop}:${pair.runDir}:${pair.la}`),
+        registryByRunLineage.get(`${pair.loop}:${pair.runDir}:${pair.lb}`),
+      ].filter((relPath) => typeof relPath === 'string'),
+    })),
+    baselineCalls,
+  };
+
+  const stored = typeof values.out === 'string' && values.out !== '' ? readStoredReport(values.out) : null;
+  const callLog = createCallLog(values.out);
+
+  let jevResult;
+  if (values.jev === true) {
+    if (gate.kind !== 'open') {
+      const line = gate.kind === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
+      out(line);
+      jevResult = { skipped: line };
+    } else {
+      const check = jevGate({ out, env, timeoutMs });
+      jevResult = check.passed
+        ? await runJevArm(plan, check, { out, env, timeoutMs, backoffMs, callLog, stored, git: deps.git })
+        : { skipped: check.reason };
+    }
+  }
+
+  let deemResult;
+  if (values.deem === true) {
+    if (gate.kind !== 'open') {
+      const line = gate.kind === 'headroom' ? 'deem arm skipped: no headroom' : 'deem arm skipped: label gate';
+      out(line);
+      deemResult = { skipped: line };
+    } else {
+      const check = deemGate({ out, env });
+      deemResult = check.passed
+        ? await runDeemArm(plan, check, { out, env, timeoutMs, callLog, stored })
+        : { skipped: check.reason };
+    }
+  }
+
+  if (values.jev === true || values.deem === true) {
+    const report = buildReport({
+      question: NOUL_QUESTION,
+      census,
+      labeled: { K: labels.size, dropped },
+      baseline,
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
+// 10. EXPORTS
+// ─────────────────────────────────────────────────────────────────────────────
+
+module.exports = {
+  listTrackedFiles,
+  walkRuns,
+  findingsOf,
+  findingId,
+  bodyKey,
+  titleTokens,
+  overlap,
+  findingText,
+  titleOrTextOverlap,
+  classifyPair,
+  pairKey,
+  sha256Hex,
+  selectCandidates,
+  mergeDecision,
+  readBaseline,
+  writePairSheet,
+  parseLabels,
+  gateState,
+  which,
+  publishedAt,
+  jevGate,
+  stateText,
+  spawnCall,
+  createCallLog,
+  runJevArm,
+  deemCommand,
+  readDeemHealth,
+  deemGate,
+  runDeemArm,
+  readStoredReport,
+  nearestRank,
+  binomialTail,
+  decideVerdict,
+  formatP,
+  summarizeColumn,
+  buildReport,
+  main,
+};
+
+// ─────────────────────────────────────────────────────────────────────────────
+// 11. CLI ENTRYPOINT
+// ─────────────────────────────────────────────────────────────────────────────
+
+if (require.main === module) {
+  main(process.argv.slice(2)).then((code) => {
+    process.exitCode = code;
+  }).catch((error) => {
+    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
+    process.exitCode = 1;
+  });
+}
diff --git a/.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts
new file mode 100644
index 0000000000..411343c1fa
--- /dev/null
+++ b/.skilled/skills/system-deep-loop/runtime/tests/unit/score-fanout-pairs.vitest.ts
@@ -0,0 +1,927 @@
+// ───────────────────────────────────────────────────────────────────
+// MODULE: score-fanout-pairs
+//   Fixtures and stubs (tempDir, writeRun, stubDir, runMain, labeledFixture)
+//   Census walk (listTrackedFiles, walkRuns, findingsOf)
+//   Pair selection (classifyPair, pairKey)
+//   Merge oracle (mergeDecision, readBaseline)
+//   Pair sheet, labels and gate (writePairSheet, parseLabels, gateState)
+//   Jev gate and arm (jevGate, runJevArm)
+//   Deem gate and arm (deemGate, runDeemArm)
+//   Keep rule and report (binomialTail, decideVerdict, main)
+// ───────────────────────────────────────────────────────────────────
+
+import path from 'node:path';
+import fs from 'node:fs';
+import os from 'node:os';
+import { createRequire } from 'node:module';
+import { fileURLToPath } from 'node:url';
+import { afterEach, describe, expect, it } from 'vitest';
+
+const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
+const require = createRequire(import.meta.url);
+const pairs = require(path.join(TEST_DIR, '../../scripts/score-fanout-pairs.cjs')) as Record<string, any>;
+
+const tempDirs: string[] = [];
+
+/** A lineage fixture: a bare label, or an explicit registry name and findings. */
+type LineageSpec = string | { label: string; registry?: string; findings?: Record<string, unknown>[] };
+
+/** One lineage as the walker reports it: its label and its tracked registry path. */
+type LineageRef = { label: string; registry: string };
+
+/** One kept run, keyed `<loop>:<runDir>` as the script keys runs. */
+type WalkedRun = { key: string; loop: string; runDir: string; lineages: LineageRef[] };
+
+/** Create a temp directory that afterEach removes. */
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
+/** One distinguishable finding for a label, carrying the loop's own id field. */
+function defaultFinding(loop: string, label: string): Record<string, unknown> {
+  const finding: Record<string, unknown> = { title: `Finding ${label}`, summary: `Body for ${label}` };
+  if (loop === 'review') finding.findingId = `${label}-1`;
+  else finding.id = `${label}-1`;
+  return finding;
+}
+
+/**
+ * Write one run's lineage registries under `root`.
+ *
+ * A lineage lands at `<runDir>/<loop>/lineages/<label>/<registry>`, the
+ * tracked shape the walker groups by, and its registry carries the loop's
+ * own findings field. Returns the registry paths relative to `root`, sorted,
+ * so a test can stand in for `git ls-files` without a repository.
+ */
+function writeRun(root: string, loop: string, runDir: string, lineages: LineageSpec[]): string[] {
+  const findingsField = loop === 'review' ? 'openFindings' : 'keyFindings';
+  const defaultRegistry = loop === 'review' ? 'deep-review-findings-registry.json' : 'findings-registry.json';
+  const written: string[] = [];
+  for (const spec of lineages) {
+    const label = typeof spec === 'string' ? spec : spec.label;
+    const registry = typeof spec === 'string' ? defaultRegistry : spec.registry ?? defaultRegistry;
+    const findings = typeof spec === 'string' ? [defaultFinding(loop, label)] : spec.findings ?? [defaultFinding(loop, label)];
+    const absolute = path.join(root, runDir, loop, 'lineages', label, registry);
+    fs.mkdirSync(path.dirname(absolute), { recursive: true });
+    fs.writeFileSync(absolute, JSON.stringify({ [findingsField]: findings }), 'utf8');
+    written.push(`${runDir}/${loop}/lineages/${label}/${registry}`);
+  }
+  return written.sort();
+}
+
+/**
+ * Write executable backend stubs that append their arguments to a log file
+ * beside themselves, so a test can see whether and how an arm called them.
+ * Returns the stub directory; a caller puts it first on PATH.
+ */
+function stubDir(bodies: Record<string, string>): string {
+  const dir = tempDir('fanout-pairs-stubs-');
+  for (const [name, body] of Object.entries(bodies)) {
+    const file = path.join(dir, name);
+    fs.writeFileSync(file, `#!/bin/sh\nD=$(dirname "$0")\necho "$*" >> "$D/${name}.log"\n${body}\n`, 'utf8');
+    fs.chmodSync(file, 0o755);
+  }
+  return dir;
+}
+
+/**
+ * Run the script's main with captured stdout/stderr and an injected
+ * environment. The short call timeout and backoff keep a stub arm fast;
+ * callers pass root, listTracked and git through `deps`.
+ */
+async function runMain(
+  argv: string[],
+  env: NodeJS.ProcessEnv = process.env,
+  deps: Record<string, unknown> = {},
+): Promise<{ code: number; lines: string[]; errs: string[] }> {
+  const lines: string[] = [];
+  const errs: string[] = [];
+  const code = await pairs.main(argv, {
+    out: (line: string) => lines.push(line),
+    err: (line: string) => errs.push(line),
+    env,
+    timeoutMs: 5000,
+    backoffMs: 1,
+    ...deps,
+  });
+  return { code, lines, errs };
+}
+
+/**
+ * Build `K` classed research pairs under `root` plus a label sheet naming
+ * them.
+ *
+ * The first `crossBody` pairs carry different bodies and no title, so the
+ * text-overlap rule admits them; the rest share a body and lightly
+ * overlapping titles, so the body rule admits them. Near-line pairs are
+ * labelled `same` and cross-body pairs `different`, matching the merge's own
+ * decision with dedup on. Each finding carries `_lineage` so the script's own
+ * `pairKey` can name the pair. Returns the label sheet path.
+ */
+function labeledFixture(root: string, K: number, crossBody: number): string {
+  const keys: string[] = [];
+  for (let index = 0; index < K; index += 1) {
+    const runDir = `pair-${index + 1}`;
+    const cross = index < crossBody;
+    const a = cross
+      ? { id: 'a', summary: 'shared problem alpha' }
+      : { id: 'a', summary: 'shared body', title: 'alpha beta gamma' };
+    const b = cross
+      ? { id: 'b', summary: 'shared problem beta' }
+      : { id: 'b', summary: 'shared body', title: 'alpha delta epsilon' };
+    writeRun(root, 'research', runDir, [
+      { label: 'la', findings: [a] },
+      { label: 'lb', findings: [b] },
+    ]);
+    keys.push(pairs.pairKey('research', runDir, { ...a, _lineage: 'la' }, { ...b, _lineage: 'lb' }));
+  }
+  const sheetPath = path.join(tempDir('fanout-pairs-labels-'), 'labels.jsonl');
+  const rows = keys.map((key, index) => JSON.stringify({ pair_key: key, label: index < crossBody ? 'different' : 'same' }));
+  fs.writeFileSync(sheetPath, `${rows.join('\n')}\n`, 'utf8');
+  return sheetPath;
+}
+
+describe('score-fanout-pairs walker', () => {
+  it('walker skips a one-lineage run', () => {
+    const root = tempDir('fanout-runs-');
+    const tracked = [
+      ...writeRun(root, 'research', 'run-two', ['alpha', 'beta']),
+      ...writeRun(root, 'research', 'run-one', ['solo']),
+    ].sort();
+    const runs = pairs.walkRuns(root, { listTracked: () => tracked }) as WalkedRun[];
+    expect(runs).toHaveLength(1);
+    expect(runs[0].key).toBe('research:run-two');
+    expect(runs[0].lineages).toHaveLength(2);
+  });
+
+  it('walker accepts both research registry names', () => {
+    const root = tempDir('fanout-runs-');
+    const tracked = [
+      ...writeRun(root, 'research', 'run-mix', [{ label: 'alpha', registry: 'findings-registry.json' }]),
+      ...writeRun(root, 'research', 'run-mix', [{ label: 'beta', registry: 'deep-research-findings-registry.json' }]),
+    ].sort();
+    const runs = pairs.walkRuns(root, { listTracked: () => tracked }) as WalkedRun[];
+    expect(runs).toHaveLength(1);
+    expect(runs[0].lineages.map((lineage) => lineage.label)).toEqual(['alpha', 'beta']);
+    expect(runs[0].lineages.map((lineage) => lineage.registry).sort()).toEqual(tracked);
+  });
+
+  it('walker reads the review findings field', () => {
+    const root = tempDir('fanout-runs-');
+    const registry = 'run-review/review/lineages/alpha/deep-review-findings-registry.json';
+    const absolute = path.join(root, 'run-review', 'review', 'lineages', 'alpha', 'deep-review-findings-registry.json');
+    fs.mkdirSync(path.dirname(absolute), { recursive: true });
+    // Both fields are present so a read of the wrong one returns the decoy
+    fs.writeFileSync(
+      absolute,
+      JSON.stringify({
+        openFindings: [{ findingId: 'R-1', title: 'From openFindings' }],
+        keyFindings: [{ id: 'R-0', title: 'From keyFindings' }],
+      }),
+      'utf8',
+    );
+    const findings = pairs.findingsOf(root, 'review', registry) as Record<string, unknown>[];
+    expect(findings.map((finding) => finding.findingId)).toEqual(['R-1']);
+  });
+});
+
+/** Space-joined `w0` … `w<count-1>`, so a test can dial an exact title or text overlap. */
+function tokensOf(count: number): string {
+  return Array.from({ length: count }, (_, index) => `w${index}`).join(' ');
+}
+
+describe('score-fanout-pairs selection', () => {
+  it('near-line admits its pair', () => {
+    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(5) };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
+    expect(pairs.classifyPair(a, b)).toBe('near-line');
+  });
+
+  it('near-line admits the upper edge', () => {
+    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(29) };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
+    expect(pairs.classifyPair(a, b)).toBe('near-line');
+  });
+
+  it('near-line rejects below the band', () => {
+    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(4) };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
+    expect(pairs.classifyPair(a, b)).toBeNull();
+  });
+
+  it('near-line rejects at the upper bound', () => {
+    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(30) };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
+    expect(pairs.classifyPair(a, b)).toBeNull();
+  });
+
+  it('cross-body admits its pair', () => {
+    const a = { id: 'A-1', summary: 'alpha beta' };
+    const b = { id: 'B-1', summary: 'alpha beta gamma delta', title: 'unused heading' };
+    expect(pairs.classifyPair(a, b)).toBe('cross-body');
+  });
+
+  it('cross-body rejects below 0.5', () => {
+    const a = { id: 'A-1', summary: tokensOf(49) };
+    const b = { id: 'B-1', summary: tokensOf(100), title: 'unused heading' };
+    expect(pairs.classifyPair(a, b)).toBeNull();
+  });
+
+  it('cross-body rejects an equal-body pair', () => {
+    const a = { id: 'A-1', summary: 'shared problem statement', title: tokensOf(90) };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) };
+    const kind = pairs.classifyPair(a, b);
+    expect(kind === 'near-line' || kind === null).toBe(true);
+  });
+});
+
+/** One pair record as `readBaseline` reads it: the pair's two sides plus the operator's label. */
+type LabeledPair = {
+  loop: string;
+  la: string;
+  a: Record<string, unknown>;
+  lb: string;
+  b: Record<string, unknown>;
+  label: string;
+};
+
+/**
+ * One labeled pair whose two merge decisions are known by construction.
+ *
+ * An `agree` pair carries different ids and different bodies, so both settings
+ * keep it apart while the label agrees. An `on-only` pair shares a body with
+ * lightly overlapping titles, so only the near-duplicate fold collapses it and
+ * only the dedup-on decision matches the `same` label. A `neither` pair repeats
+ * one record with matching ids, so both settings fold it while the label says
+ * `different`.
+ */
+function labeledPair(index: number, kind: 'agree' | 'on-only' | 'neither'): LabeledPair {
+  if (kind === 'agree') {
+    return {
+      loop: 'research',
+      la: 'la',
+      lb: 'lb',
+      label: 'different',
+      a: { id: `agree-a-${index}`, title: `left ${index}`, summary: `first body ${index}` },
+      b: { id: `agree-b-${index}`, title: `right ${index + 1}`, summary: `second body ${index}` },
+    };
+  }
+  if (kind === 'on-only') {
+    return {
+      loop: 'research',
+      la: 'la',
+      lb: 'lb',
+      label: 'same',
+      a: { id: `on-a-${index}`, title: 'alpha beta gamma', summary: 'shared problem statement' },
+      b: { id: `on-b-${index}`, title: 'alpha delta epsilon', summary: 'shared problem statement' },
+    };
+  }
+  const repeated = { id: `neither-${index}`, title: `same thing ${index}`, summary: `same body ${index}` };
+  return { loop: 'research', la: 'la', lb: 'lb', label: 'different', a: repeated, b: { ...repeated } };
+}
+
+/** Build the 40-pair baseline fixture from `agree`, `on-only` and `neither` pairs. */
+function baselineFixture(agree: number, onOnly: number, neither: number): LabeledPair[] {
+  const labeled: LabeledPair[] = [];
+  for (let index = 0; index < agree; index += 1) labeled.push(labeledPair(index, 'agree'));
+  for (let index = 0; index < onOnly; index += 1) labeled.push(labeledPair(index, 'on-only'));
+  for (let index = 0; index < neither; index += 1) labeled.push(labeledPair(index, 'neither'));
+  return labeled;
+}
+
+describe('score-fanout-pairs merge oracle', () => {
+  it('oracle reads both decisions', () => {
+    const a = { id: 'A-1', title: 'alpha beta gamma', summary: 'shared problem statement' };
+    const b = { id: 'B-1', title: 'alpha delta epsilon', summary: 'shared problem statement' };
+    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, true)).toBe('same');
+    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, false)).toBe('different');
+  });
+
+  it("oracle reads today's default", () => {
+    const finding = { id: 'X-1', title: 'cold cache miss', summary: 'the cache misses on a cold start' };
+    expect(pairs.mergeDecision('research', 'la', finding, 'lb', { ...finding }, false)).toBe('same');
+  });
+
+  it('oracle marks an unreadable pair', () => {
+    const a = {
+      findingId: 'R-1',
+      severity: 'P1',
+      disposition: 'resolved',
+      title: 'alpha beta gamma',
+      summary: 'shared problem statement',
+    };
+    const b = {
+      findingId: 'R-2',
+      severity: 'P1',
+      disposition: 'resolved',
+      title: 'alpha delta epsilon',
+      summary: 'shared problem statement',
+    };
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, true)).toBe('undecidable');
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, false)).toBe('undecidable');
+    const baseline = pairs.readBaseline([{ loop: 'review', la: 'la', a, lb: 'lb', b, label: 'same' }]);
+    expect(baseline.onRight).toBe(0);
+    expect(baseline.offRight).toBe(0);
+  });
+
+  it('oracle marks a one-side drop', () => {
+    const a = {
+      findingId: 'R-1',
+      severity: 'P1',
+      disposition: 'active',
+      title: 'alpha beta gamma',
+      summary: 'shared problem statement',
+    };
+    const b = { ...a, findingId: 'R-2', disposition: 'resolved', title: 'alpha delta epsilon' };
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, true)).toBe('undecidable');
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', b, false)).toBe('undecidable');
+    const active = { ...b, disposition: 'active' };
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', active, true)).toBe('same');
+    expect(pairs.mergeDecision('review', 'la', a, 'lb', active, false)).toBe('different');
+  });
+
+  it('baseline picks the better decision', () => {
+    const baseline = pairs.readBaseline(baselineFixture(25, 5, 10));
+    expect(baseline.method).toBe('dedup-on');
+    expect(baseline.onRight).toBe(30);
+    expect(baseline.offRight).toBe(25);
+    expect(baseline.right).toBe(30);
+  });
+
+  it('baseline ties to dedup off', () => {
+    const baseline = pairs.readBaseline(baselineFixture(30, 0, 10));
+    expect(baseline.method).toBe('dedup-off');
+    expect(baseline.onRight).toBe(30);
+    expect(baseline.offRight).toBe(30);
+    expect(baseline.right).toBe(30);
+  });
+});
+
+describe('score-fanout-pairs parity', () => {
+  it('parity: body key agrees with the merge', () => {
+    // Equal and unequal body keys, each pair carrying the class the census gives it
+    // beside the decision the merge must reach with near-duplicate folding on. With
+    // distinct ids the merge folds a pair only when both sides agree on the body key,
+    // so a fixture whose two answers stop matching is the drift this test catches.
+    const fixtures: Array<{
+      a: Record<string, unknown>;
+      b: Record<string, unknown>;
+      kind: string | null;
+      decision: string;
+    }> = [
+      {
+        // Same body, titles overlapping 0.20: inside the near-line band and over the merge's threshold.
+        a: { id: 'A-1', summary: 'shared problem statement', title: tokensOf(20) },
+        b: { id: 'B-1', summary: 'shared problem statement', title: tokensOf(100) },
+        kind: 'near-line',
+        decision: 'same',
+      },
+      {
+        // Same body, titles sharing no token: the merge keeps the pair apart and the band rejects it.
+        a: { id: 'A-2', summary: 'shared body text', title: 'alpha beta gamma' },
+        b: { id: 'B-2', summary: 'shared body text', title: 'delta epsilon zeta' },
+        kind: null,
+        decision: 'different',
+      },
+      {
+        // Different bodies, no titles: the body key is the first gate, and the text overlap falls short.
+        a: { id: 'A-3', summary: 'cache eviction on cold start' },
+        b: { id: 'B-3', summary: 'retry storm in the queue' },
+        kind: null,
+        decision: 'different',
+      },
+      {
+        // Different bodies whose text still points at one problem: the class the merge cannot see.
+        a: { id: 'A-4', summary: 'alpha beta' },
+        b: { id: 'B-4', summary: 'alpha beta gamma delta', title: 'unused heading' },
+        kind: 'cross-body',
+        decision: 'different',
+      },
+    ];
+
+    for (const fixture of fixtures) {
+      const kind = pairs.classifyPair(fixture.a, fixture.b);
+      const decision = pairs.mergeDecision('research', 'la', fixture.a, 'lb', fixture.b, true);
+      expect(kind).toBe(fixture.kind);
+      expect(decision).toBe(fixture.decision);
+      // Near-line names exactly the same-body pairs the merge folds on these fixtures.
+      expect(kind === 'near-line').toBe(decision === 'same');
+    }
+  });
+
+  it('parity: a title-only pair stays out of near-line', () => {
+    // One body, two titles sharing no token: the titles are the only signal left, and
+    // they disagree, so the merge splits the pair while the band rejects it below its floor.
+    const a = { id: 'A-1', summary: 'shared problem statement', title: 'cache miss on cold start' };
+    const b = { id: 'B-1', summary: 'shared problem statement', title: 'retry storm in the queue' };
+    expect(pairs.bodyKey(a)).toBe(pairs.bodyKey(b));
+    expect(pairs.overlap(pairs.titleTokens(a), pairs.titleTokens(b))).toBe(0);
+    expect(pairs.classifyPair(a, b)).toBeNull();
+    expect(pairs.mergeDecision('research', 'la', a, 'lb', b, true)).toBe('different');
+  });
+});
+
+/** One classed pair as the census reports it, for the sheet and gate fixtures. */
+function sheetPair(kind: string, index: number): Record<string, any> {
+  const key = `research:run-${index}#la@a-${index}|lb@b-${index}`;
+  return {
+    key,
+    loop: 'research',
+    runDir: `run-${index}`,
+    kind,
+    la: 'la',
+    a: { id: `a-${index}`, summary: `body a ${index}` },
+    lb: 'lb',
+    b: { id: `b-${index}`, summary: `body b ${index}` },
+    textA: `body a ${index}`,
+    textB: `body b ${index}`,
+  };
+}
+
+/** A pair index keyed as the label reader joins it; the first `crossBody` pairs are cross-body. */
+function sheetIndex(total: number, crossBody: number): Map<string, Record<string, any>> {
+  const index = new Map<string, Record<string, any>>();
+  for (let position = 0; position < total; position += 1) {
+    const pair = sheetPair(position < crossBody ? 'cross-body' : 'near-line', position);
+    index.set(pair.key, pair);
+  }
+  return index;
+}
+
+/** The operator's filled sheet for a whole pair index, one label per row. */
+function sheetLines(pairIndex: Map<string, Record<string, any>>): string {
+  const rows = [...pairIndex.values()].map((pair) => JSON.stringify({
+    pair_key: pair.key,
+    label: pair.kind === 'cross-body' ? 'different' : 'same',
+  }));
+  return `${rows.join('\n')}\n`;
+}
+
+/** The baseline shape the gate reads: right on `right` of the labeled pairs, dedup off on a tie. */
+function sheetBaseline(right: number): Record<string, any> {
+  return { method: 'dedup-off', onRight: right, offRight: right, right };
+}
+
+describe('score-fanout-pairs sheet, labels and gate', () => {
+  it('pair sheet writes outside the repository', () => {
+    const root = tempDir('fanout-pairs-sheet-root-');
+    const nearLine = Array.from({ length: 61 }, (_, index) => sheetPair('near-line', index));
+    const crossBody = Array.from({ length: 61 }, (_, index) => sheetPair('cross-body', index + 100));
+    const sheetPath = path.join(tempDir('fanout-pairs-sheet-out-'), 'pair-sheet.jsonl');
+    const byHash = (left: string, right: string) => (pairs.sha256Hex(left) < pairs.sha256Hex(right) ? -1 : 1);
+
+    const written = pairs.writePairSheet({ 'near-line': nearLine, 'cross-body': crossBody }, sheetPath, root) as number;
+
+    const rows = fs.readFileSync(sheetPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line) as Record<string, any>);
+    const nearWritten = rows.filter((row) => row.class === 'near-line');
+    const crossWritten = rows.filter((row) => row.class === 'cross-body');
+    expect(written).toBe(120);
+    expect(nearWritten).toHaveLength(60);
+    expect(crossWritten).toHaveLength(60);
+    expect(nearWritten.map((row) => row.pair_key)).toEqual(nearLine.map((pair) => pair.key).sort(byHash).slice(0, 60));
+    expect(crossWritten.map((row) => row.pair_key)).toEqual(crossBody.map((pair) => pair.key).sort(byHash).slice(0, 60));
+    expect(rows.every((row) => row.label === '')).toBe(true);
+    expect(Object.keys(nearWritten[0])).toEqual(['pair_key', 'class', 'loop', 'run_dir', 'lineages', 'text_a', 'text_b', 'label']);
+  });
+
+  it('pair sheet refuses an inside path', () => {
+    const root = tempDir('fanout-pairs-sheet-refuse-');
+    const target = path.join(root, 'sheet.jsonl');
+
+    expect(() => pairs.writePairSheet({ 'near-line': [sheetPair('near-line', 0)], 'cross-body': [] }, target, root))
+      .toThrow('refusing to write the pair sheet inside the repository');
+    expect(fs.existsSync(target)).toBe(false);
+  });
+
+  it('label reader stops under 40 pairs', () => {
+    const pairIndex = sheetIndex(39, 10);
+    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;
+
+    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(39)) as { kind: string; line: string };
+
+    expect(gate.kind).toBe('label');
+    expect(gate.line).toBe('stop: fewer than 40 labeled pairs');
+  });
+
+  it('label reader stops under 10 cross-body', () => {
+    const pairIndex = sheetIndex(40, 9);
+    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;
+
+    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(40)) as { kind: string; line: string };
+
+    expect(gate.kind).toBe('cross-body');
+    expect(gate.line).toBe('stop: fewer than 10 labeled cross-body pairs');
+  });
+
+  it('label reader names a bad value by row', () => {
+    const pairIndex = sheetIndex(3, 0);
+    const rows = [...pairIndex.values()].map((pair, index) => JSON.stringify({
+      pair_key: pair.key,
+      label: index === 2 ? 'maybe' : 'same',
+    }));
+
+    expect(() => pairs.parseLabels(`${rows.join('\n')}\n`, pairIndex)).toThrow('labels row 3:');
+  });
+
+  it('label reader drops an unknown key', () => {
+    const pairIndex = sheetIndex(40, 10);
+    const ghost = 'research:ghost#la@a|lb@b';
+    const text = `${sheetLines(pairIndex)}${JSON.stringify({ pair_key: ghost, label: 'same' })}\n`;
+
+    const labels = pairs.parseLabels(text, pairIndex) as Map<string, string>;
+
+    expect(labels.size).toBe(40);
+    expect(labels.has(ghost)).toBe(false);
+  });
+
+  it('no headroom above 90 percent', () => {
+    const pairIndex = sheetIndex(40, 10);
+    const labels = pairs.parseLabels(sheetLines(pairIndex), pairIndex) as Map<string, string>;
+
+    const gate = pairs.gateState(labels, pairIndex, sheetBaseline(37)) as { kind: string; line: string };
+
+    expect(gate.kind).toBe('headroom');
+    expect(gate.line).toBe('no headroom');
+  });
+});
+
+/** One labeled pair as the Jev arm reads it: its pair key, gold label, texts and registries. */
+function armPair(index: number): Record<string, any> {
+  return {
+    key: `research:run-${index}#la@a-${index}|lb@b-${index}`,
+    label: 'same',
+    textA: `finding text a ${index}`,
+    textB: `finding text b ${index}`,
+    registries: [`run-${index}/research/lineages/la/findings-registry.json`],
+  };
+}
+
+/** A jev stub for the gate and arm: pinned version, passing auth, one same answer per call. */
+const JEV_STUB = `case "$1" in
+  --version) echo 'jev 0.6.2'; exit 0;;
+  auth)
+    if [ "$2" = test ]; then echo '{"model":"stub-model"}'; exit 0; fi
+    exit 0;;
+  noul) echo '{"answers":{"answer":{"noul":0.9}}}'; exit 0;;
+esac
+exit 0`;
+
+/** The stub directory first on PATH, so the gate finds the stub and never a live client. */
+function stubEnv(stub: string): NodeJS.ProcessEnv {
+  return { ...process.env, PATH: `${stub}${path.delimiter}${process.env.PATH ?? ''}` };
+}
+
+describe('score-fanout-pairs jev gate and arm', () => {
+  it('jev gate passes a stub', () => {
+    const stub = stubDir({ jev: JEV_STUB });
+    const out: string[] = [];
+    const gate = pairs.jevGate({ out: (line: string) => out.push(line), env: stubEnv(stub), timeoutMs: 5000 }) as Record<string, any>;
+
+    expect(gate.passed).toBe(true);
+    expect(gate.provider).toBe('official');
+    expect(out[0]).toBe(`jev: path=${path.join(stub, 'jev')} provider=official`);
+    const logged = fs.readFileSync(path.join(stub, 'jev.log'), 'utf8').trim().split('\n');
+    expect(logged).toEqual(['--version', 'auth status --provider official']);
+  });
+
+  it('jev gate skips on exit 3', () => {
+    const stub = stubDir({ jev: 'case "$1" in\n  --version) echo "jev 0.6.2"; exit 0;;\n  auth) exit 3;;\nesac' });
+    const out: string[] = [];
+    const gate = pairs.jevGate({ out: (line: string) => out.push(line), env: stubEnv(stub), timeoutMs: 5000 }) as Record<string, any>;
+
+    expect(gate.passed).toBe(false);
+    expect(out).toEqual([
+      `jev: path=${path.join(stub, 'jev')} provider=official`,
+      'jev arm skipped: no credential',
+    ]);
+  });
+
+  it('jev arm withholds an unpublished pair', async () => {
+    const stub = stubDir({ jev: JEV_STUB });
+    const row = armPair(0);
+    const calls: Record<string, any>[] = [];
+
+    await pairs.runJevArm(
+      { rows: [row], baselineCalls: new Map() },
+      { path: path.join(stub, 'jev'), provider: 'official' },
+      {
+        out: () => {},
+        env: stubEnv(stub),
+        timeoutMs: 5000,
+        backoffMs: 1,
+        callLog: { append: (record: Record<string, any>) => calls.push(record) },
+        stored: null,
+        publishedAt: () => false,
+      },
+    );
+
+    const withheld = calls.filter((record) => record.status === 'unmeasured_unpublished');
+    expect(withheld.map((record) => record.pair_key)).toEqual([row.key]);
+    const logFile = path.join(stub, 'jev.log');
+    const logged = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').split('\n') : [];
+    expect(logged.filter((line) => line.startsWith('noul'))).toEqual([]);
+  });
+
+  it('jev arm prints keep', async () => {
+    const stub = stubDir({ jev: JEV_STUB });
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+    const out: string[] = [];
+
+    await pairs.runJevArm(
+      { rows, baselineCalls },
+      { path: path.join(stub, 'jev'), provider: 'official' },
+      {
+        out: (line: string) => out.push(line),
+        env: stubEnv(stub),
+        timeoutMs: 5000,
+        backoffMs: 1,
+        callLog: { append: () => {} },
+        stored: null,
+        publishedAt: () => true,
+      },
+    );
+
+    const verdict = out.find((line) => line.startsWith('verdict jev: ')) as string;
+    expect(verdict).toBeDefined();
+    expect(verdict.startsWith('verdict jev: keep')).toBe(true);
+    expect(verdict).toContain('reader=none named');
+    expect(verdict).toContain('jev_version=0.6.2 provider=official model=stub-model');
+    const logged = fs.readFileSync(path.join(stub, 'jev.log'), 'utf8').trim().split('\n');
+    expect(logged.filter((line) => line.startsWith('noul'))).toHaveLength(15);
+  });
+
+  it('jev arm requalifies only when the stored model differs', async () => {
+    const stub = stubDir({ jev: JEV_STUB });
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+    const run = async (stored: Record<string, any>) => {
+      const out: string[] = [];
+      await pairs.runJevArm(
+        { rows, baselineCalls },
+        { path: path.join(stub, 'jev'), provider: 'official' },
+        {
+          out: (line: string) => out.push(line),
+          env: stubEnv(stub),
+          timeoutMs: 5000,
+          backoffMs: 1,
+          callLog: { append: () => {} },
+          stored,
+          publishedAt: () => true,
+        },
+      );
+      return out;
+    };
+
+    const changed = await run({ columns: { jev: { provider: 'official', model: 'old-model' } } });
+    const index = changed.indexOf('requalify: model changed');
+    expect(index).toBeGreaterThanOrEqual(0);
+    expect(changed[index + 1].startsWith('verdict jev: ')).toBe(true);
+    const same = await run({ columns: { jev: { provider: 'official', model: 'stub-model' } } });
+    expect(same).not.toContain('requalify: model changed');
+  });
+});
+
+/** A cli-deem stub for the gate and arm: a passing health, then one split pair. */
+const DEEM_STUB = `case "$1" in
+  health)
+    echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"abc123","source_commit":"def456"}'
+    exit 0;;
+  noul)
+    first=$(sed -n '2p')
+    case "$first" in
+      'finding text a 0') echo '{"answers":{"answer":{"noul":0.9}}}'; exit 0;;
+      'finding text b 0') echo '{"answers":{"answer":{"noul":0.1}}}'; exit 0;;
+    esac
+    echo '{"answers":{"answer":{"noul":0.9}}}'
+    exit 0;;
+esac
+exit 1`;
+
+describe('score-fanout-pairs deem gate and arm', () => {
+  it('deem gate passes a fake health', () => {
+    const stub = stubDir({ 'cli-deem': DEEM_STUB });
+    const out: string[] = [];
+
+    const gate = pairs.deemGate({ out: (line: string) => out.push(line), env: stubEnv(stub) }) as Record<string, any>;
+
+    expect(gate.passed).toBe(true);
+    expect(gate.backend).toBe('torch');
+    expect(gate.cmd).toEqual([path.join(stub, 'cli-deem')]);
+    expect(out[0]).toBe('deem: health backend=torch model=deem-0.8-v1 model_commit=abc123 source_commit=def456');
+    const logged = fs.readFileSync(path.join(stub, 'cli-deem.log'), 'utf8').trim();
+    expect(logged).toBe('health');
+  });
+
+  it('deem gate skips a stub backend', () => {
+    const stub = stubDir({
+      'cli-deem': `case "$1" in
+  health) echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"abc","source_commit":"def"}'; exit 0;;
+esac
+exit 1`,
+    });
+    const out: string[] = [];
+
+    const gate = pairs.deemGate({ out: (line: string) => out.push(line), env: stubEnv(stub) }) as Record<string, any>;
+
+    expect(gate.passed).toBe(false);
+    expect(out).toEqual(['deem arm skipped: stub backend']);
+  });
+
+  it('deem gate skips an unreachable server', () => {
+    const stub = stubDir({ 'cli-deem': 'exit 4' });
+    const out: string[] = [];
+
+    const gate = pairs.deemGate({ out: (line: string) => out.push(line), env: stubEnv(stub) }) as Record<string, any>;
+
+    expect(gate.passed).toBe(false);
+    expect(out).toEqual(['deem arm skipped: not reachable']);
+  });
+
+  it('deem arm marks a disagreeing pair unstable', async () => {
+    const stub = stubDir({ 'cli-deem': DEEM_STUB });
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+    const calls: Record<string, any>[] = [];
+
+    const result = await pairs.runDeemArm(
+      { rows, baselineCalls },
+      { cmd: [path.join(stub, 'cli-deem')], model: 'deem-0.8-v1', modelCommit: 'abc123', sourceCommit: 'def456' },
+      {
+        out: () => {},
+        env: stubEnv(stub),
+        timeoutMs: 5000,
+        callLog: { append: (record: Record<string, any>) => calls.push(record) },
+        stored: null,
+      },
+    ) as Record<string, any>;
+
+    const split = calls.filter((record) => record.pair_key === rows[0].key);
+    expect(split.map((record) => record.order)).toEqual(['AB', 'BA']);
+    expect(split.map((record) => record.probability)).toEqual([0.9, 0.1]);
+    expect(split.every((record) => record.status === 'measured')).toBe(true);
+    // A split pair has no modal answer, so it is counted wrong: the flip count
+    // takes it and the four agreeing pairs are the only ones the column got right.
+    expect(result.column.M).toBe(5);
+    expect(result.column.A).toBe(4);
+    expect(result.column.F).toBe(1);
+  });
+
+  it('deem arm requalifies only when the stored commit pair differs', async () => {
+    const stub = stubDir({ 'cli-deem': DEEM_STUB });
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+    const gate = { cmd: [path.join(stub, 'cli-deem')], model: 'deem-0.8-v1', modelCommit: 'abc123', sourceCommit: 'def456' };
+    const run = async (stored: Record<string, any>) => {
+      const out: string[] = [];
+      await pairs.runDeemArm({ rows, baselineCalls }, gate, {
+        out: (line: string) => out.push(line),
+        env: stubEnv(stub),
+        timeoutMs: 5000,
+        callLog: { append: () => {} },
+        stored,
+      });
+      return out;
+    };
+
+    const changed = await run({ columns: { deem: { modelCommit: 'old123', sourceCommit: 'def456' } } });
+    const index = changed.indexOf('requalify: model commit changed');
+    expect(index).toBeGreaterThanOrEqual(0);
+    expect(changed[index + 1].startsWith('verdict deem: ')).toBe(true);
+    const same = await run({ columns: { deem: { modelCommit: 'abc123', sourceCommit: 'def456' } } });
+    expect(same).not.toContain('requalify: model commit changed');
+  });
+});
+
+/**
+ * One 40-pair research fixture whose labels clear the pair gate and leave the
+ * merge's better decision below the ninety-percent headroom line, so a test
+ * can drive an arm through main. The first ten pairs are cross-body and the
+ * rest near-line; the labels disagree with the merge on enough pairs to open
+ * the gate.
+ */
+function openGateFixture(root: string): { sheetPath: string; tracked: string[] } {
+  const tracked: string[] = [];
+  const keys: string[] = [];
+  for (let index = 0; index < 40; index += 1) {
+    const runDir = `pair-${index + 1}`;
+    const cross = index < 10;
+    const a = cross
+      ? { id: 'a', summary: 'shared problem alpha' }
+      : { id: 'a', summary: 'shared body', title: 'alpha beta gamma' };
+    const b = cross
+      ? { id: 'b', summary: 'shared problem beta' }
+      : { id: 'b', summary: 'shared body', title: 'alpha delta epsilon' };
+    tracked.push(...writeRun(root, 'research', runDir, [
+      { label: 'la', findings: [a] },
+      { label: 'lb', findings: [b] },
+    ]));
+    keys.push(pairs.pairKey('research', runDir, { ...a, _lineage: 'la' }, { ...b, _lineage: 'lb' }));
+  }
+  const sheetPath = path.join(tempDir('fanout-pairs-gold-'), 'labels.jsonl');
+  // Nine cross-body and fifteen near-line labels disagree with the merge's
+  // collapse, which keeps its better setting at 24 of 40 right: past the gate
+  // but below the headroom line that would close it.
+  const rows = keys.map((key, index) => JSON.stringify({
+    pair_key: key,
+    label: index < 9 || index >= 25 ? 'different' : 'same',
+  }));
+  fs.writeFileSync(sheetPath, `${rows.join('\n')}\n`, 'utf8');
+  return { sheetPath, tracked: tracked.sort() };
+}
+
+describe('score-fanout-pairs keep rule and report', () => {
+  it('verdict prints keep', () => {
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const answers = new Map(rows.map((row) => [row.key, [0.9, 0.9, 0.9]]));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+
+    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;
+
+    expect(column.line.startsWith('verdict jev: keep')).toBe(true);
+    expect(column.line).toContain('reader=none named');
+  });
+
+  it('verdict prints kill', () => {
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const answers = new Map(rows.map((row) => [row.key, [0.1, 0.1]]));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'same']));
+
+    const column = pairs.summarizeColumn('deem', rows, answers, baselineCalls, '') as Record<string, any>;
+
+    expect(column.line.startsWith('verdict deem: kill')).toBe(true);
+  });
+
+  it('verdict prints stop (coverage)', () => {
+    const rows = Array.from({ length: 10 }, (_, index) => armPair(index));
+    const answers = new Map(rows.slice(0, 8).map((row) => [row.key, [0.9, 0.9, 0.9]]));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+
+    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;
+
+    expect(column.line.startsWith('verdict jev: stop (coverage)')).toBe(true);
+  });
+
+  it('verdict stops on flips', () => {
+    const rows = [0, 1, 2, 3, 4].map((index) => armPair(index));
+    const answers = new Map(rows.map((row, index) => [row.key, index < 3 ? [0.9, 0.9, 0.1] : [0.9, 0.9, 0.9]]));
+    const baselineCalls = new Map(rows.map((row) => [row.key, 'different']));
+
+    const column = pairs.summarizeColumn('jev', rows, answers, baselineCalls, '') as Record<string, any>;
+
+    expect(column.line.startsWith('verdict jev: stop (flips)')).toBe(true);
+  });
+
+  it('default run makes no call', async () => {
+    const stub = stubDir({ jev: JEV_STUB, 'cli-deem': DEEM_STUB });
+    const root = tempDir('fanout-pairs-default-');
+    const tracked = writeRun(root, 'research', 'run-default', ['alpha', 'beta']);
+
+    const { code, lines } = await runMain([], stubEnv(stub), { root, listTracked: () => tracked });
+
+    expect(code).toBe(0);
+    for (const prefix of ['runs: ', 'pairs: ', 'class near-line: ', 'class cross-body: ', 'merge decisions: ']) {
+      expect(lines.some((line) => line.startsWith(prefix))).toBe(true);
+    }
+    expect(fs.existsSync(path.join(stub, 'jev.log'))).toBe(false);
+    expect(fs.existsSync(path.join(stub, 'cli-deem.log'))).toBe(false);
+  });
+
+  it('refuses a model arm without --out', async () => {
+    const stub = stubDir({ jev: JEV_STUB });
+
+    const { code, lines, errs } = await runMain(['--jev'], stubEnv(stub));
+
+    expect(code).toBe(2);
+    expect(errs.join('\n')).toContain('--out');
+    expect(lines).toEqual([]);
+    expect(fs.existsSync(path.join(stub, 'jev.log'))).toBe(false);
+  });
+
+  it('report and calls.jsonl written once', async () => {
+    const stub = stubDir({ 'cli-deem': DEEM_STUB });
+    const root = tempDir('fanout-pairs-report-');
+    const outDir = path.join(tempDir('fanout-pairs-out-'), 'run');
+    const fixture = openGateFixture(root);
+
+    const { code } = await runMain(
+      ['--deem', '--out', outDir, '--labels', fixture.sheetPath],
+      stubEnv(stub),
+      { root, listTracked: () => fixture.tracked },
+    );
+
+    expect(code).toBe(0);
+    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8')) as Record<string, any>;
+    expect(report.columns.deem.line.startsWith('verdict deem: ')).toBe(true);
+    expect(report.columns.deem.line).toContain('reader=none named');
+    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n')
+      .map((line) => JSON.parse(line) as Record<string, any>);
+    expect(calls).toHaveLength(80);
+  }, 30000);
+});
\ No newline at end of file
```
