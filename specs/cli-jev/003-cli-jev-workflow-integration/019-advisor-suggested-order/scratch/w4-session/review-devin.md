# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/system-skill-advisor/README.md`
- `.skilled/skills/system-skill-advisor/SKILL.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md`
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md`
- `.skilled/skills/system-skill-advisor/changelog/v0.14.0.0.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/system-skill-advisor/README.md b/.skilled/skills/system-skill-advisor/README.md
index ec7cd7d3de..aa0b25ced6 100644
--- a/.skilled/skills/system-skill-advisor/README.md
+++ b/.skilled/skills/system-skill-advisor/README.md
@@ -227,6 +227,7 @@ A: `hooks/skill-advisor-hook.md` covers the prompt-time hook contract across eve
 | Playbook | Run the manual testing playbook scenarios under `manual-testing-playbook/` in a live session |
 | Validation battery | `node .skilled/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true}' --format json` reports within the dated bounded-delta gate in [`validation-baselines.md`](./references/scoring/validation-baselines.md) |
 | Offline tie-break eval | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` prints a zero-call census of the near-tie cluster with holdout top-1 at 53/70. It stays dormant unless `--jev` or `--deem` is passed, and each switch runs its model arm only when that backend's own checks pass. An arm that will call needs `--out <dir>` for its call records, and exits 2 without it |
+| Offline suggested-order eval | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` prints the same census with holdout top-1 at 53/70, then times the advisor alone inside a child like the prompt hook's and prints a no-headroom stop or the planned calls. It makes no model call unless `--jev` or `--deem` is passed, each switch needs `--out <dir>` and exits 2 without it, and each arm runs only when that backend's own checks pass |
 
 ---
 
diff --git a/.skilled/skills/system-skill-advisor/SKILL.md b/.skilled/skills/system-skill-advisor/SKILL.md
index e84743848c..6cda7444c1 100644
--- a/.skilled/skills/system-skill-advisor/SKILL.md
+++ b/.skilled/skills/system-skill-advisor/SKILL.md
@@ -2,7 +2,7 @@
 name: system-skill-advisor
 description: Routes non-trivial requests to matching skills through the daemon-backed advisor CLI and stable advisor command ids.
 allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
-version: 0.13.0.0
+version: 0.14.0.0
 trigger_phrases:
   - "skill advisor"
   - "gate 2 routing"
@@ -380,6 +380,7 @@ Package references:
 - `references/scoring/lane-weight-tuning.md` — measured lane-weight change workflow.
 - `references/scoring/validation-baselines.md` — `advisor_validate` baselines and troubleshooting.
 - `runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`: offline Jev and Deem tie-break eval of the near-tie cluster, with a zero-call census by default.
+- `runtime/scripts/routing-accuracy/score-suggested-order.mjs`: offline Jev and Deem order of the whole near-tie cluster, with each call timed inside a child like the prompt hook's and a zero-call run by default.
 - `references/graph/skill-graph-query-cookbook.md` — worked `skill_graph_query` examples.
 - `references/graph/skill-graph-drift.md` — detect and reconcile SQLite drift from source files.
 - `references/graph/skill-graph-extraction-plan.md` — extraction history and completion record.
diff --git a/.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md b/.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md
index 8889f6e79c..eb137a2148 100644
--- a/.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md
@@ -19,7 +19,7 @@ This catalog is the current inventory for the skill advisor. The package source
 
 ## 1. OVERVIEW
 
-The catalog covers 44 features across 7 groups. Group 01 owns daemon correctness. Groups 02-03 own the index and lifecycle surface that feeds the scorer. Group 04 owns scoring. Group 06 owns the command surface: the nine CLI commands plus the stable compat entrypoint. Groups 07-08 cover runtime integrations, OpenCode plugins and Python compatibility.
+The catalog covers 45 features across 7 groups. Group 01 owns daemon correctness. Groups 02-03 own the index and lifecycle surface that feeds the scorer. Group 04 owns scoring. Group 06 owns the command surface: the nine CLI commands plus the stable compat entrypoint. Groups 07-08 cover runtime integrations, OpenCode plugins and Python compatibility.
 
 > **Numbering note (gap-05).** The directory layout skips slot `05--*` between `scorer-fusion` and `cli-surface`. This is an intentional historical reservation from initial scaffold design that marked the boundary between the core scoring pipeline (groups 01-04) and the integration layer (groups 06-08). The gap is preserved to keep spec-folder cross-reference stability across packets. Do not renumber.
 
@@ -28,7 +28,7 @@ The catalog covers 44 features across 7 groups. Group 01 owns daemon correctness
 | [daemon-and-freshness](../feature-catalog/daemon-and-freshness) | 7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation |
 | [auto-indexing](../feature-catalog/auto-indexing) | 7 | Derived extraction, sanitizer, provenance, sync, anti-stuffing, DF/IDF corpus, doc-frontmatter harvest |
 | [lifecycle-routing](../feature-catalog/lifecycle-routing) | 5 | Age haircut, supersession, archive handling, schema migration, rollback |
-| [scorer-fusion](../feature-catalog/scorer-fusion) | 7 | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config, offline tie-break eval |
+| [scorer-fusion](../feature-catalog/scorer-fusion) | 8 | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config, offline tie-break eval, offline suggested-order eval |
 | [cli-surface](../feature-catalog/cli-surface) | 10 | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, stable compat entrypoint, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, daemon-backed `skill-advisor` CLI |
 | [hooks-and-plugin](../feature-catalog/hooks-and-plugin) | 5 | Claude and OpenCode hooks, the OpenCode plugin, the `/goal` plugin and the Pi prompt advisor |
 | [python-compat](../feature-catalog/python-compat) | 3 | Python CLI shim, regression suite, bench runner |
@@ -99,6 +99,7 @@ Baseline numbers (remediation SHA `97a318d83`):
 | Lane-by-lane ablation protocol | [scorer-fusion/ablation.md](./scorer-fusion/ablation.md) |
 | Lane weights configuration | [scorer-fusion/weights-config.md](../feature-catalog/scorer-fusion/weights-config.md) |
 | Offline Jev and Deem tie-break eval | [scorer-fusion/tie-break-eval.md](./scorer-fusion/tie-break-eval.md) |
+| Offline suggested-order eval | [scorer-fusion/suggested-order-eval.md](./scorer-fusion/suggested-order-eval.md) |
 
 ---
 
diff --git a/.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
index 4a450063c4..1a5cf8dab2 100644
--- a/.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md
@@ -30,7 +30,7 @@ Canonical package artifacts:
 
 ## 1. OVERVIEW
 
-This playbook provides 48 deterministic scenario files across 9 categories validating the Skill Advisor surface. Scenario IDs use a multi-prefix scheme: `NC` for the native command surface, `CL` for CLI hooks plus plugin behavior, `CP` for compatibility plus disable controls, `OP` for operator H5 states, `AU` for auto-update daemon behavior, `AI` for auto-indexing, `LC` for lifecycle routing, `SC` for scorer fusion, plus `PC` for Python compatibility.
+This playbook provides 49 deterministic scenario files across 9 categories validating the Skill Advisor surface. Scenario IDs use a multi-prefix scheme: `NC` for the native command surface, `CL` for CLI hooks plus plugin behavior, `CP` for compatibility plus disable controls, `OP` for operator H5 states, `AU` for auto-update daemon behavior, `AI` for auto-indexing, `LC` for lifecycle routing, `SC` for scorer fusion, plus `PC` for Python compatibility.
 
 > **Numbering note (gap-09).** The directory layout skips slot `09--*` between `scorer-fusion` and `python-compat`. This mirrors the `feature-catalog/` 05-gap pattern and is an intentional historical reservation from initial scaffold design. The gap is preserved to keep spec-folder cross-reference stability across packets. Do not renumber.
 
@@ -127,7 +127,7 @@ Scenario verdict:
 
 ### Release Readiness Rule
 
-Release is `READY` only when all 48 scenario files are `PASS` or have an approved `SKIP` with a real blocker and no prompt-safety, rebuild, daemon, indexing, lifecycle, scorer or compatibility failure remains unresolved.
+Release is `READY` only when all 49 scenario files are `PASS` or have an approved `SKIP` with a real blocker and no prompt-safety, rebuild, daemon, indexing, lifecycle, scorer or compatibility failure remains unresolved.
 
 ---
 
@@ -155,7 +155,7 @@ This section records wave planning for the canonical Skill Advisor manual test p
 - **Wave 5**: `AU-001..AU-005` auto-update daemon behavior.
 - **Wave 6**: `AI-001..AI-006` auto-indexing behavior.
 - **Wave 7**: `LC-001..LC-005` lifecycle routing.
-- **Wave 8**: `SC-001..SC-006` scorer fusion.
+- **Wave 8**: `SC-001..SC-007` scorer fusion.
 - **Wave 9**: `PC-001..PC-005` Python compatibility.
 
 ---
@@ -263,7 +263,7 @@ This category validates lifecycle routing scenarios `LC-001..LC-005`.
 
 ## 14. SCORER FUSION
 
-This category validates scorer fusion scenarios `SC-001..SC-006`.
+This category validates scorer fusion scenarios `SC-001..SC-007`.
 
 | ID | Scenario | File |
 |---|---|---|
@@ -273,6 +273,7 @@ This category validates scorer fusion scenarios `SC-001..SC-006`.
 | SC-004 | Lane Contribution Attribution | [004-lane-attribution.md](scorer-fusion/lane-attribution.md) |
 | SC-005 | Lane-by-Lane Ablation Protocol | [005-ablation.md](scorer-fusion/ablation.md) |
 | SC-006 | Offline Jev and Deem Tie-Break Eval | [tie-break-eval.md](scorer-fusion/tie-break-eval.md) |
+| SC-007 | Offline Suggested-Order Eval | [suggested-order-eval.md](scorer-fusion/suggested-order-eval.md) |
 
 ---
 
diff --git a/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md b/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
index a0e0729865..7eed320f6c 100644
--- a/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
+++ b/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md
@@ -26,7 +26,7 @@ Use this file to identify the folder boundary, the likely verification path and
 
 | Metric | Value |
 |---|---:|
-| Code files | 3 |
+| Code files | 4 |
 | README scope | Direct files in this folder |
 | Audit context | Internal validation notes |
 
@@ -68,6 +68,7 @@ Run individual scripts from the repository root with the documented arguments.
 |---|---|
 | `gate3-corpus-runner.mjs` | MJS source file in this folder. |
 | `score-jev-tiebreak.mjs` | Offline Jev and Deem tie-break eval of the advisor's near-tie cluster. The default run is a zero-call census, and `--jev` or `--deem` adds a model column only when that backend's own checks pass. |
+| `score-suggested-order.mjs` | Offline Jev and Deem order of the advisor's whole near-tie cluster, timed inside a child like the prompt hook's. The default run makes no model call, and `--jev` or `--deem` adds a column only when there is headroom and that backend's own checks pass. |
 | `score-routing-corpus.py` | PY source file in this folder. |
 
 ---
diff --git a/.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md b/.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
index 2ad3ac29ec..365f549014 100644
--- a/.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
+++ b/.skilled/skills/system-skill-advisor/runtime/tests/parity/README.md
@@ -30,6 +30,7 @@ Current state:
 parity/
 +-- python-ts-parity.vitest.ts  # Python to TypeScript scorer parity gates
 +-- score-jev-tiebreak.vitest.ts  # Offline tie-break eval checks with stub binaries and a fake Deem server
++-- score-suggested-order.vitest.ts  # Offline suggested-order eval checks with stub binaries and stub timed children
 `-- README.md
 ```
 
@@ -41,6 +42,7 @@ parity/
 |---|---|
 | `python-ts-parity.vitest.ts` | Runs corpus parity checks, holdout accuracy checks and lexical ablation assertions. |
 | `score-jev-tiebreak.vitest.ts` | Pins the tie-break eval's census, keep rule, gates, exit handling, calibration and report with stub `jev` and `cli-deem` binaries and a fake Deem server. It makes no model call. |
+| `score-suggested-order.vitest.ts` | Pins the suggested-order eval's helpers, keep rule, timed child, headroom stops, gates, both arms and report with synthetic rows, stub `jev` and `cli-deem` binaries and stub children. It makes no model call. |
 
 ---
 
diff --git a/.skilled/skills/system-skill-advisor/changelog/v0.14.0.0.md b/.skilled/skills/system-skill-advisor/changelog/v0.14.0.0.md
new file mode 100644
index 0000000000..bcac62cc0b
--- /dev/null
+++ b/.skilled/skills/system-skill-advisor/changelog/v0.14.0.0.md
@@ -0,0 +1,29 @@
+---
+title: "system-skill-advisor v0.14.0.0, An Offline Suggested-Order Eval"
+description: "A new offline script measures whether a Jev or local Deem order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget. Its default run makes no model call."
+trigger_phrases:
+  - "system-skill-advisor v0.14.0.0"
+  - "system-skill-advisor 0.14.0.0"
+  - "offline suggested-order eval"
+  - "near-tie cluster order"
+importance_tier: "normal"
+contextType: "general"
+version: 0.14.0.0
+---
+
+# v0.14.0.0, An Offline Suggested-Order Eval
+
+The advisor can now be measured against a model's order of its whole near-tie cluster, timed inside the same child the prompt hook runs in, without any change to how it routes. A new offline script times the advisor alone first and, only when there is room and only when asked, lets Jev or the local Deem order each cluster under a keep rule fixed before any run.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order` (Level 1)
+
+## What's New at a Glance
+
+- **The advisor's own time comes first.** `runtime/scripts/routing-accuracy/score-suggested-order.mjs` reuses the tie-break eval's census and comparators, then runs the built hook for each of the 241 skill-firing prompts in a child spawned like the prompt shim's. One `advisor child:` line reports p50, p95, max and the children past 2,200 ms or killed at 2,500 ms. The default run spawns no model binary.
+- **No headroom stops everything.** Below 5 movable rows the run prints `no headroom (movable)`, and with an advisor p95 above 2,200 ms it prints `no headroom (latency)`. Either line stops both arms before any gate or call. Otherwise it prints the planned calls for each arm.
+- **Each arm orders the whole cluster.** `--jev` and `--deem` keep their own gates from the tie-break eval. Each asks every eligible row three times, once per rotation of the cluster keys plus `none`, and every call runs in a timed child after the advisor. Either switch needs `--out <dir>`, and without it the script exits 2 before any output.
+- **Every verdict follows a rule fixed in advance.** Each column ends in one `keep`, `kill` or `stop (<reason>)` line from coverage, a loss test, a 0.05 mean reciprocal-rank margin over the best zero-call order, a sign test, a flip cap and the child's p95 wall time. `--out <dir>` writes one `calls.jsonl` line per call and a `report.json` with each verdict's fields.
+
+## Upgrade
+
+No migration required. Nothing calls the script, and the advisor routes exactly as before.
diff --git a/.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md b/.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md
new file mode 100644
index 0000000000..032ba0016d
--- /dev/null
+++ b/.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/suggested-order-eval.md
@@ -0,0 +1,60 @@
+---
+title: "Offline Suggested-Order Eval"
+description: "An offline script that measures whether a Jev or local Deem order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget, with a zero-call run by default."
+trigger_phrases:
+  - "offline suggested-order eval"
+  - "suggested order eval"
+  - "score-suggested-order"
+  - "near-tie cluster order"
+version: 0.14.0.0
+---
+
+# Offline Suggested-Order Eval (score-suggested-order.mjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+An offline script that measures whether a Jev or local Deem order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget, with a zero-call run by default.
+
+It measures and never routes. Nothing in the advisor calls it, and a run without `--jev` or `--deem` spawns neither binary. The tie-break eval beside it tested one model pick moved to the front of the cluster. This eval tests a model's order for every member of the cluster, and whether the call fits the time the prompt hook gives the advisor when both run in the same child.
+
+---
+
+## 2. HOW IT WORKS
+
+The script reuses the tie-break eval's census under the scorer-baseline capture's environment, so it prints the same per-file and per-split counts, the holdout top-1 of 53/70 and the scorer, confidence, always-second and held-out rerank comparators. Any holdout top-1 other than 53/70 voids the run. It then times the advisor alone. For each of the 241 skill-firing prompts it spawns a child the way the prompt shim does, with `process.execPath`, a 2,500 ms timeout and `SIGKILL`, and runs the built hook's `handleClaudeUserPromptSubmit` inside it. The `advisor child:` line reports p50, p95, max, the children that ran past 2,200 ms and the children that were killed. Below 5 movable rows the run prints `no headroom (movable)`, and with an advisor p95 above 2,200 ms it prints `no headroom (latency)`. Either line stops both arms before any call. Otherwise it prints the planned calls, `margin: 0.05` and one `keep rule:` line.
+
+`--jev` runs only when `jev` is on PATH, reports `jev 0.6.2` and `jev auth status --provider P` exits 0. `--deem` runs only when `cli-deem health` reports the pinned local model on a backend that is not a stub. A failed check prints one skip line and exits 0. Each arm asks every eligible row three times, once per left rotation of the cluster keys plus `none`. Every call runs in a timed child that runs the advisor first, then one `cli-deem health` for Deem, then the `choice`. A row counts only when all three answers carry a probability for every key. Its order is the cluster sorted by mean probability, with ties kept in the scorer's order, and a row where `none` has the highest mean keeps the scorer's order. Each column ends in one `verdict jev:` or `verdict deem:` line with `keep`, `kill` or `stop (<reason>)` under a keep rule fixed before any run: coverage, a one-sided loss test, a 0.05 mean reciprocal-rank margin over the best zero-call order, a sign test, a flip cap and the child's p95 wall time against 2,200 ms. Either switch needs `--out <dir>`, where the run writes `calls.jsonl` and `report.json`. Without it the script exits 2 before any output. The script holds no credential: `jev` resolves its own key and `cli-deem` takes none.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Script | Census, advisor-only timing, headroom, both model arms, the keep rule and the report |
+| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Script | The census, comparators and gates the eval imports unchanged |
+| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Hook | The handler each timed child runs |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Automated test | Synthetic rows, stub `jev` and `cli-deem` binaries and stub timed children |
+| `Playbook scenario [SC-007](../../manual-testing-playbook/scorer-fusion/suggested-order-eval.md).` | Manual playbook | Default run and a Deem gate skip |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Scorer fusion
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `scorer-fusion/suggested-order-eval.md`
+
+Related references:
+
+- [tie-break-eval.md](./tie-break-eval.md) - the pick-first eval whose census and gates this one reuses.
+- [ambiguity.md](./ambiguity.md) - the top-2 ambiguity window whose cluster this eval orders.
diff --git a/.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md b/.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md
new file mode 100644
index 0000000000..08459c0424
--- /dev/null
+++ b/.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/suggested-order-eval.md
@@ -0,0 +1,94 @@
+---
+title: "SC-007 -- Offline Suggested-Order Eval"
+description: "This scenario validates the offline suggested-order eval for `SC-007`. It focuses on the zero-call run with its advisor-only timing and on a Deem gate skip that leaves the zero-call lines unchanged."
+stage: routing
+version: 0.14.0.0
+---
+
+# SC-007 -- Offline Suggested-Order Eval
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `SC-007`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the offline suggested-order eval for `SC-007`. It focuses on the zero-call run with its advisor-only timing and on a Deem gate skip that leaves the zero-call lines unchanged.
+
+### Why This Matters
+
+The eval decides whether a model's order of the advisor's near-tie cluster is worth a later live phase, so its default run must cost nothing and must show how much of the 2,200 ms budget the advisor already spends. A default run that called a model, or a gate that let a call through, would make every verdict it prints meaningless.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `SC-007` and confirm the expected signals without contradictory evidence.
+
+- Objective: confirm that the default run makes no model call and prints the census, the advisor-only timing and either a headroom stop or the planned calls, then confirm that a failed Deem gate skips its arm without changing the zero-call lines.
+- Real user request: `Would a model's order of the advisor's near-ties help, and is there time for it inside the hook?`
+- Prompt: `Run the offline suggested-order eval, then a Deem run against a stub, and tell me what it printed.`
+- Expected execution process: run the default eval, run `--deem --out` with a stub `cli-deem` first on PATH whose health check reports a stub backend, then compare the two outputs.
+- Expected signals: `baseline: holdout_top1=53/70`, the `comparator:` lines, a `power:` line, one `advisor child:` line, `no headroom (...)` or `planned calls:`, `margin: 0.05` and a `keep rule:` line on both runs, plus `deem arm skipped: stub backend` on the second run when the first printed `planned calls:`.
+- Desired user-visible outcome: the advisor's own p50 and p95 against 2,200 ms, and whether any model arm may call.
+- Pass/fail: PASS if every expected signal appears, the two outputs differ only in the skip line and the measured `advisor child:` numbers and `git status --porcelain` is unchanged. FAIL if a run calls a model without its switch or changes the tree.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Run the offline suggested-order eval, then a Deem run against a stub, and tell me what it printed.`
+
+### Commands
+
+1. `git status --porcelain > /tmp/sc007-before.txt`
+2. `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs > /tmp/sc007-default.txt`
+3. `mkdir -p /tmp/sc007-stub && printf '#!/bin/sh\necho stub >&2\nexit 3\n' > /tmp/sc007-stub/cli-deem && chmod 755 /tmp/sc007-stub/cli-deem`
+4. `PATH="/tmp/sc007-stub:$PATH" node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs --deem --out /tmp/sc007-deem > /tmp/sc007-deem.txt`
+5. `git status --porcelain > /tmp/sc007-after.txt`
+
+### Expected
+
+Step 2 prints the census, `baseline: holdout_top1=53/70`, the comparators and the power line. It then prints `advisor child: p50=... p95=... max=... over_2200=... children=241 killed=...`, one of `no headroom (movable)`, `no headroom (latency)` or `planned calls: jev=... deem=...`, then `margin: 0.05` and the `keep rule:` line, and exits 0. Step 4 prints the same lines with newly measured `advisor child:` numbers. When step 2 printed `planned calls:`, step 4 adds one line, `deem arm skipped: stub backend`. It exits 0 and writes `/tmp/sc007-deem/report.json` with no column. Steps 1 and 5 print the same status.
+
+### Evidence
+
+The two stdout files, `/tmp/sc007-deem/report.json` and both status files.
+
+### Pass / Fail
+
+- **Pass**: every expected signal appears and the outputs match apart from the skip line and the `advisor child:` numbers. The two status files match.
+- **Fail**: the baseline is not 53/70, a run called a model, or a run changed the tree.
+
+### Failure Triage
+
+A `baseline mismatch: comparison void` line means the built scorer drifted, so rebuild the advisor `dist` and rerun the scorer-baseline ratchet. A `no headroom (latency)` line means the advisor alone spent more than 2,200 ms at p95 on this machine, and it stops both arms by design. `--deem` or `--jev` without `--out` exits 2 before any output.
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
+| `../../feature-catalog/scorer-fusion/suggested-order-eval.md` | Feature-catalog source describing the implementation contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Primary implementation anchor |
+| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Regression anchor |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Scorer Fusion
+- Playbook ID: SC-007
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `scorer-fusion/suggested-order-eval.md`
```
