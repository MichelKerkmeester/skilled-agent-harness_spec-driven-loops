# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs and version fields were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/cli-classifier/SKILL.md`
- `.skilled/skills/cli-classifier/README.md`
- `.skilled/skills/cli-classifier/ROUTER.md`
- `.skilled/skills/cli-classifier/description.json`
- `.skilled/skills/cli-classifier/hub-router.json`
- `.skilled/skills/cli-classifier/mode-registry.json`
- `.skilled/skills/cli-classifier/benchmark/README.md`
- `.skilled/skills/cli-classifier/changelog/v1.2.0.0.md`
- `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md`
- `.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md`
- `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/cli-classifier/SKILL.md b/.skilled/skills/cli-classifier/SKILL.md
index e6acd06340..878fcaa049 100644
--- a/.skilled/skills/cli-classifier/SKILL.md
+++ b/.skilled/skills/cli-classifier/SKILL.md
@@ -2,7 +2,7 @@
 name: cli-classifier
 description: "Routes classifier judgment requests to the cli-jev (hosted Jev) or cli-deem (local Deem) transport through mode-registry.json. Holds no packet-local logic."
 allowed-tools: [Read, Bash, Grep, Glob]
-version: 1.1.0.0
+version: 1.2.0.0
 ---
 
 <!-- Keywords: cli-classifier, cli-jev, cli-usage, cli-deem, jev, typed judgment, jev-mcp, local classifier, deem, deem model, deem judgment, deem health, noul, choice, score, local deem server -->
@@ -115,6 +115,10 @@ cli-classifier/
 
 - `transport-axis`: declares `transports: ["cli-deem", "cli-jev"]`. The per-hub gate enforces the whole transport contract: routingClass `metadata`, `mutatesWorkspace: false`, the forbidden tool set and membership in the axis.
 
+### Offline Measurement
+
+`benchmark/injection-screen/score-injection-screen.mjs` measures offline whether a Jev or Deem `noul` spots text that tries to instruct an agent better than flag-nothing or a fixed lexical screen. Its default run makes zero model calls. `--jev` and `--deem` each run one backend only after that backend's own gate passes. No hook screens fetched content, so no verdict is wired to anything.
+
 ---
 
 ## 4. RULES
diff --git a/.skilled/skills/cli-classifier/README.md b/.skilled/skills/cli-classifier/README.md
index 8a83a1f051..8829d5fe49 100644
--- a/.skilled/skills/cli-classifier/README.md
+++ b/.skilled/skills/cli-classifier/README.md
@@ -71,6 +71,7 @@ The hub registers two modes. The registry lists them and the router picks one, o
 | [`hub-router.json`](./hub-router.json) | Router policy, signals and vocabulary classes | See which phrases pick `cli-jev` or `cli-deem` |
 | [`ROUTER.md`](./ROUTER.md) | The stage-two control document, `stage1-only` | Promote it only with a concrete leaf map |
 | [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |
+| [`benchmark/injection-screen/`](./benchmark/injection-screen/) | The offline injection screen scorer and its tests | Its default run makes zero model calls. `--jev` and `--deem` each add one backend behind that backend's own gate |
 
 The manifest regenerates when packets change, so read it as a snapshot.
 
@@ -82,6 +83,7 @@ Releases live in `changelog/` with one file per release, named `v[version].md`.
 
 | Release | Entry |
 |---|---|
+| v1.2.0.0 | [`changelog/v1.2.0.0.md`](./changelog/v1.2.0.0.md) |
 | v1.1.0.0 | [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) |
 | v1.0.0.0 | [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) |
 | v0.2.0.0 | [`changelog/v0.2.0.0.md`](./changelog/v0.2.0.0.md) |
diff --git a/.skilled/skills/cli-classifier/ROUTER.md b/.skilled/skills/cli-classifier/ROUTER.md
index b167794d90..48892b3f4e 100644
--- a/.skilled/skills/cli-classifier/ROUTER.md
+++ b/.skilled/skills/cli-classifier/ROUTER.md
@@ -9,7 +9,7 @@ trigger_phrases:
   - "typed judgment routing"
 importance_tier: important
 contextType: implementation
-version: 1.1.0.0
+version: 1.2.0.0
 router_state: stage1-only
 skill_pointer: SKILL.md
 ---
diff --git a/.skilled/skills/cli-classifier/description.json b/.skilled/skills/cli-classifier/description.json
index a745243652..2c0b0e0fdd 100644
--- a/.skilled/skills/cli-classifier/description.json
+++ b/.skilled/skills/cli-classifier/description.json
@@ -1,7 +1,7 @@
 {
   "name": "cli-classifier",
   "description": "cli-classifier is the single public skill identity for classifier models that return typed judgments. It routes a request to its cli-jev transport (hosted Jev, over the cli-usage packet) or its cli-deem transport (the local Deem server) through mode-registry.json and hub-router.json and holds no packet-local logic. The advisor sees one hub. A transport asks its backend for one typed value and never mutates this workspace.",
-  "version": "1.1.0.0",
+  "version": "1.2.0.0",
   "importance_tier": "high",
   "keywords": [
     "cli-classifier",
diff --git a/.skilled/skills/cli-classifier/hub-router.json b/.skilled/skills/cli-classifier/hub-router.json
index 0934d04b7a..3ba5d6a22d 100644
--- a/.skilled/skills/cli-classifier/hub-router.json
+++ b/.skilled/skills/cli-classifier/hub-router.json
@@ -1,6 +1,6 @@
 {
   "skill": "cli-classifier",
-  "version": "1.1.0.0",
+  "version": "1.2.0.0",
   "routerPolicy": {
     "defaultMode": null,
     "ambiguityDelta": 1,
diff --git a/.skilled/skills/cli-classifier/mode-registry.json b/.skilled/skills/cli-classifier/mode-registry.json
index 604d7d2e53..0059dac556 100644
--- a/.skilled/skills/cli-classifier/mode-registry.json
+++ b/.skilled/skills/cli-classifier/mode-registry.json
@@ -1,7 +1,7 @@
 {
   "resourceContractVersion": 1,
   "skill": "cli-classifier",
-  "version": "1.1.0.0",
+  "version": "1.2.0.0",
   "description": "Declarative packet registry: workflowMode, packetKind, backendKind, toolSurface, and advisorRouting for cli-classifier. The advisor routes the hub identity. The hub resolves one of its two transport packets.",
   "discriminator": {
     "workflowMode": "Public hub/mode key. Stable identity used by the hub router and this registry. Carried by every mode.",
diff --git a/.skilled/skills/cli-classifier/benchmark/README.md b/.skilled/skills/cli-classifier/benchmark/README.md
index ef4472f50c..e48f0c6f8e 100644
--- a/.skilled/skills/cli-classifier/benchmark/README.md
+++ b/.skilled/skills/cli-classifier/benchmark/README.md
@@ -29,6 +29,7 @@ The two runs under `reports/` predate this hub's Jev mode. They measured the Jev
 | Path | Contents |
 |---|---|
 | [`reports/`](./reports/) | One folder per run, indexed by `reports/README.md` |
+| [`injection-screen/`](./injection-screen/) | `score-injection-screen.mjs` and its tests: an offline check of whether a Jev or Deem `noul` spots text that tries to instruct an agent. The default run makes zero model calls. `--jev` and `--deem` each run one backend behind that backend's own gate |
 
 ---
 
diff --git a/.skilled/skills/cli-classifier/changelog/v1.2.0.0.md b/.skilled/skills/cli-classifier/changelog/v1.2.0.0.md
new file mode 100644
index 0000000000..0c59ea676d
--- /dev/null
+++ b/.skilled/skills/cli-classifier/changelog/v1.2.0.0.md
@@ -0,0 +1,23 @@
+---
+title: "cli-classifier v1.2.0.0"
+description: "An offline scorer tests whether a Jev or Deem noul spots text that tries to instruct an AI agent. Its default run makes zero model calls. No verdict exists until the operator labels the drawn rows."
+trigger_phrases:
+  - "cli-classifier v1.2.0.0"
+  - "cli-classifier 1.2.0.0"
+  - "injection screen scorer"
+importance_tier: "normal"
+contextType: "general"
+---
+The hub gains an offline scorer that tests whether a Jev or Deem `noul` can tell text that tries to instruct an AI agent from text that does not. It scores both backends against flag-nothing and a fixed lexical screen. It answers the model question only: no hook screens fetched content, so no verdict is wired to anything.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/` (Level 1)
+
+## What's New at a Glance
+
+- **The default run calls no model.** `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` counts how often agents fetch, from the tool names in tracked deep-research state logs. It sizes a corpus of public vendored markdown and prints the lexical patterns, the fixed question and the keep rule. Then it stops at the label gate. It spawns neither backend and writes no file.
+- **The operator labels the rows.** `--draw --seed <n>` writes the two row files beside the script. They hold 60 natural sections the operator labels `instructs` or `clean` and 30 sections that will carry one instruction sentence the operator writes. The files keep paths, line numbers and hashes, never section text. No model writes a label or a sentence.
+- **Each backend gets its own verdict.** Behind `--jev` or `--deem` and that backend's own gate, the scorer asks one `noul` per labeled row, three times for Jev. It prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` under a rule fixed before any label. A failed gate prints one skip line and changes nothing. Every call is recorded in the folder `--out` names.
+
+## Upgrade
+
+No migration required. No verdict exists yet. The scorer prints `stop: fewer than 90 labeled rows` until the operator labels the drawn rows and writes the planted sentences.
diff --git a/.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md b/.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md
new file mode 100644
index 0000000000..8b7cd9d247
--- /dev/null
+++ b/.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md
@@ -0,0 +1,39 @@
+---
+title: "cli-classifier: Feature Catalog"
+description: "Unified reference combining the complete feature inventory and current-reality reference for the features the cli-classifier hub owns itself."
+trigger_phrases:
+  - "cli-classifier feature catalog"
+  - "cli-classifier hub features"
+  - "injection screen measurement"
+  - "feature catalog"
+last_updated: "2026-09-29"
+version: 1.0.0.0
+---
+
+# cli-classifier: Feature Catalog
+
+This document combines the current feature inventory for the `cli-classifier` hub into a single reference. It covers what the hub owns itself. Each transport keeps its own catalog: `cli-usage/feature-catalog/` for Jev and `cli-deem/feature-catalog/` for Deem.
+
+---
+
+## 1. OVERVIEW
+
+Use this catalog as the canonical inventory for hub-level features, the ones that belong to neither transport alone. The one section below holds the offline measurements that run both transports under one rule.
+
+---
+
+## 2. MEASUREMENTS
+
+### Injection screen measurement
+
+#### Description
+
+Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.
+
+#### Current Reality
+
+`score-injection-screen.mjs` prints a fetch census and a corpus census with zero model calls. It then stops at the label gate until the operator labels the drawn rows. `--jev` and `--deem` each run one backend behind that backend's own gate and print one verdict line per backend. No hook uses the result.
+
+#### Source Files
+
+See [`measurements/injection-screen-measurement.md`](measurements/injection-screen-measurement.md) for full implementation and test file listings.
diff --git a/.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md b/.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md
new file mode 100644
index 0000000000..5ec02d2659
--- /dev/null
+++ b/.skilled/skills/cli-classifier/feature-catalog/measurements/injection-screen-measurement.md
@@ -0,0 +1,65 @@
+---
+title: "Injection screen measurement"
+description: "Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen."
+trigger_phrases:
+  - "injection screen measurement"
+  - "fetched text injection screen"
+  - "score-injection-screen"
+  - "prompt injection classifier test"
+version: 1.0.0.0
+---
+
+# Injection screen measurement (score-injection-screen.mjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.
+
+No hook screens fetched content in this repository, so the scorer settles the model question only. It measures on sections of public vendored markdown from the `context/` folder of the packet that planned it. Thirty of the sections carry one instruction sentence the operator plants. A `keep` here wires nothing.
+
+---
+
+## 2. HOW IT WORKS
+
+### Zero-Call Default
+
+The default run makes zero model calls and writes no file. It counts the tracked deep-research state records whose `toolsUsed` names `WebFetch` or `WebSearch` and the agent files that grant either tool. It splits the tracked corpus into heading sections outside fenced code and counts, per source group, the sections of 5 to 60 lines and the lexical screen's hits. It prints the four lexical patterns and the fixed question, each with its SHA-256, then the keep rule. The operator's notes file is never opened. A `.env` path is counted as refused and never opened.
+
+### Draw And Label Gate
+
+`--draw --seed <n>` writes `labels.jsonl` and `planted.jsonl` beside the script: 60 natural rows and 30 planted rows, no more than 30 from one source group. Each row holds ids, a path, line numbers and a hash, never text. The draw refuses to overwrite a file that holds an operator label or sentence. Until all 90 rows carry a label and every planted row has its sentence, every run prints `stop: fewer than 90 labeled rows` and no arm calls a model.
+
+### Backends And Verdict
+
+`--jev` runs only after `jev --version` prints `jev 0.6.2` and `jev auth status --provider P` exits 0. `--deem` runs only after `cli-deem health` passes. A failed gate prints one skip line and changes nothing. Jev answers each row three times and Deem once. A missing answer is `unmeasured`, never 0. Each column prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)`. The `--out <dir>` folder receives `calls.jsonl` and `report.json`.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Script | Both censuses, the draw, the label gate, the baseline, both arms and the verdict |
+| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | The Deem client the Deem arm runs when no `cli-deem` is on `PATH` |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Node test | Fixture repositories with stub `jev` and `cli-deem` binaries first on `PATH` |
+| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md` | Manual playbook | The zero-call run and the gate skips on stub binaries |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Measurements
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `measurements/injection-screen-measurement.md`
+
+Related references:
+- [feature-catalog.md](../feature-catalog.md) - The hub catalog root
diff --git a/.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md
index c7dee6dad5..96ed366d4a 100644
--- a/.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md
@@ -15,7 +15,7 @@ A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and r
 
 ## 1. OVERVIEW
 
-The walked tree holds the hub-routing scenarios for `cli-classifier`. The hub registers two modes, both declared `packetKind: "transport"`: `cli-jev`, which runs over the packet folder `cli-usage` and bridges the hosted Jev service, and `cli-deem`, a client for the Deem model served on this machine. The routing questions are small. Does a Jev request resolve `cli-jev`? Does a Deem request resolve `cli-deem`? Do other requests stay out? Each transport's own behavior is covered in its packet: `cli-usage/manual-testing-playbook/` for Jev and `cli-deem/scripts/tests/cli-deem.test.mjs` for Deem. These scenarios do not replace them.
+The walked tree holds the hub-routing scenarios for `cli-classifier` and one measurement scenario for its offline injection screen scorer. The hub registers two modes, both declared `packetKind: "transport"`: `cli-jev`, which runs over the packet folder `cli-usage` and bridges the hosted Jev service, and `cli-deem`, a client for the Deem model served on this machine. The routing questions are small. Does a Jev request resolve `cli-jev`? Does a Deem request resolve `cli-deem`? Do other requests stay out? Each transport's own behavior is covered in its packet: `cli-usage/manual-testing-playbook/` for Jev and `cli-deem/scripts/tests/cli-deem.test.mjs` for Deem. These scenarios do not replace them.
 
 The `CJ-` scenarios came from the retired `cli-jev` hub with the Jev transport. Their two recorded runs sit under `benchmark/reports/`.
 
@@ -29,7 +29,7 @@ The `CJ-` scenarios came from the retired `cli-jev` hub with the Jev transport.
 
 ### Package Boundaries
 
-- The scenarios validate routing only. They never start the Deem server and never send a judgment to either backend.
+- The hub-routing scenarios validate routing only. `CC-004` runs the injection screen scorer on stub binaries. No scenario starts the Deem server or sends a judgment to either backend.
 - The hub serves compiled routes. The front door answers from the policy pinned in `013-live-activation/activation/cli-classifier/manifest.json`, not from the legacy sentinel.
 
 ---
@@ -122,7 +122,19 @@ Prompt: `cli-jev noul for this question.`
 
 ---
 
-## 7. AUTOMATED TEST CROSS-REFERENCE
+## 7. MEASUREMENTS
+
+### CC-004 | The injection screen scorer runs with zero model calls
+
+Verify the offline injection screen scorer prints its censuses without calling a backend and that failing gates add only their skip lines.
+
+Prompt: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`
+
+> **Feature File:** [CC-004](measurements/injection-screen-measurement.md)
+
+---
+
+## 8. AUTOMATED TEST CROSS-REFERENCE
 
 | Coverage Area | Automated Or Structural Anchor | Scenario IDs |
 |---|---|---|
@@ -131,10 +143,11 @@ Prompt: `cli-jev noul for this question.`
 | Compiled canary corpus | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json` | none, replayed by the rollout harness |
 | Jev transport behavior | [cli-usage playbook](../cli-usage/manual-testing-playbook/manual-testing-playbook.md) | none, covered by the `JEV-` scenarios |
 | Deem client behavior | [cli-deem tests](../cli-deem/scripts/tests/cli-deem.test.mjs) | none, covered by `node --test` |
+| Injection screen scorer | [score-injection-screen tests](../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | `CC-004` |
 
 ---
 
-## 8. FEATURE CATALOG CROSS-REFERENCE INDEX
+## 9. FEATURE CATALOG CROSS-REFERENCE INDEX
 
 | Feature ID | Feature Name | Category | Feature File |
 |---|---|---|---|
@@ -143,3 +156,4 @@ Prompt: `cli-jev noul for this question.`
 | CC-003 | An out-of-domain request resolves nothing here | Hub Routing | [CC-003](hub-routing/out-of-domain-resolves-nothing.md) |
 | CJ-001 | A Jev judgment request resolves mode cli-jev | Hub Routing | [CJ-001](hub-routing/judgment-request-routes-to-transport.md) |
 | CJ-002 | The cli-jev name resolves the Jev transport | Hub Routing | [CJ-002](hub-routing/alias-still-resolves.md) |
+| CC-004 | The injection screen scorer runs with zero model calls | Measurements | [CC-004](measurements/injection-screen-measurement.md) |
diff --git a/.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md b/.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md
new file mode 100644
index 0000000000..e1fd74caff
--- /dev/null
+++ b/.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md
@@ -0,0 +1,76 @@
+---
+title: "CC-004 -- The injection screen scorer runs with zero model calls"
+description: "This scenario validates that the offline injection screen scorer prints its censuses with zero model calls and that a failed backend gate adds one skip line and changes nothing, for `CC-004`."
+version: 1.0.0.0
+---
+
+# CC-004 -- The injection screen scorer runs with zero model calls
+
+This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-004`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates that `score-injection-screen.mjs` prints the fetch census and the corpus census without calling a model, and that each backend switch stays dormant behind its gate. Stub `jev` and `cli-deem` binaries first on `PATH` log every call and fail both gates, so nothing reaches a real backend.
+
+### Why This Matters
+
+The scorer reads tracked vendored text and could send it to a hosted service. The default run must spawn neither backend, and a switch whose gate fails must add only its skip line. A run that called a stub, wrote a file or changed another line would break the dormant-unless-available rule every classifier feature here follows.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+- Objective: Confirm the default run calls no backend and writes no file, and that `--jev` and `--deem` behind failing gates add only their skip lines.
+- Real user request: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`
+- Prompt: `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither`
+- Expected execution process: Build two stub binaries in a temp folder, run the scorer once with no switch and once with both switches, then compare the two outputs.
+- Expected signals: The default run exits 0 with two `fetch census:` lines, a `corpus census:` line and either `stop: fewer than 90 labeled rows` or the `baseline:` lines and a headroom line, and the stub log does not exist. The gated run exits 0 and differs from the default run only by `jev: path=<stub>/jev provider=<P>`, `jev arm skipped: no credential` and `deem arm skipped: stub backend`. The `--out` folder does not exist.
+- Desired user-visible outcome: A verdict that the scorer stayed dormant and printed its censuses.
+- Pass/fail: PASS if both runs exit 0, the default run leaves no stub log and the diff holds exactly the three added lines. FAIL if the default run logs a call, a run writes the `--out` folder or the diff shows any other line. SKIP only when Node.js is unavailable. Record that blocker.
+
+---
+
+## 3. TEST EXECUTION
+
+### Exact Command Sequence
+
+1. `bash: STUB="$(mktemp -d)"`
+2. `bash: printf '%s\n' '#!/bin/sh' 'echo "$*" >> "$(dirname "$0")/calls.log"' '[ "$1" = --version ] && { echo "jev 0.6.2"; exit 0; }' 'exit 3' > "$STUB/jev"`
+3. `bash: printf '%s\n' '#!/bin/sh' 'echo "$*" >> "$(dirname "$0")/calls.log"' 'echo "{\"ok\":false,\"error\":\"refused backend: stub\"}" >&2' 'exit 3' > "$STUB/cli-deem" && chmod +x "$STUB/jev" "$STUB/cli-deem"`
+4. `bash: PATH="$STUB:$PATH" node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs > "$STUB/default.txt"; echo "exit=$?"; test -e "$STUB/calls.log" && echo "stub called" || echo "no stub call"`
+5. `bash: PATH="$STUB:$PATH" node .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs --jev --deem --out "$STUB/out" > "$STUB/gated.txt"; echo "exit=$?"; test -e "$STUB/out" && echo "out written" || echo "no out folder"`
+6. `bash: diff "$STUB/default.txt" "$STUB/gated.txt"`
+
+| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
+|---|---|---|---|---|---|---|---|---|
+| CC-004 | The injection screen scorer runs with zero model calls | Confirm the default run calls no backend and writes no file, and that failing gates add only their skip lines | `Run the injection screen scorer with fake jev and cli-deem on my PATH and show me it calls neither` | Steps 1 to 6 above, in order, from the repository root | Step 4: `exit=0` and `no stub call`. Step 5: `exit=0` and `no out folder`. Step 6: exactly three added lines, the Jev identity line, `jev arm skipped: no credential` and `deem arm skipped: stub backend` | Both output files, each exit line and the diff | PASS if both runs exit 0, step 4 prints `no stub call` and the diff holds exactly the three added lines. FAIL on a stub call in step 4, an `--out` folder or any other diff line. SKIP only when Node.js is unavailable, recorded as the blocker | 1. A stub call in step 4 means the default run reached a gate: check `main` in the scorer. 2. A missing skip line means a gate read the wrong exit code: check `jevGate` and `readDeemHealth`. 3. Fix the scorer rather than this scenario |
+
+---
+
+## 4. SOURCE FILES
+
+### Playbook Sources
+
+| File | Role |
+|---|---|
+| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
+| [injection-screen-measurement.md](../../feature-catalog/measurements/injection-screen-measurement.md) | Feature-catalog source describing the scorer's contract |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| [score-injection-screen.mjs](../../benchmark/injection-screen/score-injection-screen.mjs) | The scorer, its gates and its zero-call default |
+| [score-injection-screen.test.mjs](../../benchmark/injection-screen/tests/score-injection-screen.test.mjs) | The automated cases on fixture repositories and stub binaries |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Measurements
+- Playbook ID: CC-004
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `measurements/injection-screen-measurement.md`
+- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
```
