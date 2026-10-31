# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md`
- `.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md`
- `.skilled/skills/sk-doc/sk-create-skill/README.md`
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`
- `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md`
- `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md b/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
index 962b9bbe59..259d0cc618 100644
--- a/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
@@ -1,6 +1,6 @@
 ---
 title: "sk-doc: Feature Catalog"
-description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the shared validator's changelog entry check and the advisory goal-criteria lint."
+description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the zero-call clarify census, the shared validator's changelog entry check and the advisory goal-criteria lint."
 trigger_phrases:
   - "sk-doc feature catalog"
   - "sk-doc hub capabilities"
@@ -8,13 +8,14 @@ trigger_phrases:
   - "sk-doc compiled routing"
   - "changelog entry frontmatter check"
   - "goal criteria lint"
-last_updated: "2026-09-28"
+  - "clarify default measurement"
+last_updated: "2026-09-29"
 version: 2.2.0.12
 ---
 
 # sk-doc: Feature Catalog
 
-This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.
+This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. A zero-call census in `sk-create-skill` counts how often that fast path answers `clarify`. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.
 
 ---
 
@@ -58,6 +59,20 @@ The directive is on by default for `sk-doc`, one of the seven activated hubs: wi
 
 See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
 
+### Clarify Default Measurement
+
+#### Description
+
+Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows.
+
+#### Current Reality
+
+`score-clarify-default.cjs` in `sk-create-skill` replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine, read only, and prints clarify counts per hub and source. It writes unlabeled clarify rows for the operator. `--score` stops below 30 labeled rows, and past that gate `--jev` and `--deem` each earn a verdict against the router's first alternative that serves nothing.
+
+#### Source Files
+
+See [`compiled-routing-and-legacy-fallback/clarify-default-measurement.md`](compiled-routing-and-legacy-fallback/clarify-default-measurement.md) for the census sources, the label gate, the keep rule and source anchors.
+
 ---
 
 ## 4. DOCUMENT VALIDATION
@@ -90,4 +105,4 @@ Flags goal completion criteria that a reader cannot check from the line alone, s
 
 See [`document-validation/goal-criteria-lint.md`](document-validation/goal-criteria-lint.md) for the rules, the line classes and source anchors.
 
-Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal`, which ships no catalog of its own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
+Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal` and the clarify census of `sk-create-skill`, which ship no catalog of their own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
diff --git a/.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md b/.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md
new file mode 100644
index 0000000000..0e51a97013
--- /dev/null
+++ b/.skilled/skills/sk-doc/feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md
@@ -0,0 +1,61 @@
+---
+title: "Clarify Default Measurement"
+description: "Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows."
+trigger_phrases:
+  - "clarify default measurement"
+  - "score-clarify-default.cjs"
+  - "compiled routing clarify census"
+  - "clarify label gate"
+version: 2.2.0.0
+---
+
+# Clarify Default Measurement (score-clarify-default.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows.
+
+When a compiled hub router finds near-tied modes it answers `clarify` with a short list of alternatives and names no default. `score-clarify-default.cjs` in `sk-create-skill` measures whether a classifier could suggest one. It never changes a router, a fixture, a playbook scenario or the front door. A verdict serves nothing.
+
+---
+
+## 2. HOW IT WORKS
+
+With no switch the script is a census. It loads each hub's compiled engine read only and replays three committed sources through it: the hub canary cases, the hub playbook scenarios parsed by `validate-compiled-routing-scenarios.cjs` and the skill-firing routing-corpus rows, each routed to the compiled hub its gold skill belongs to. It prints prompts, unparsed prompts and route, clarify, defer and reject counts per hub and source. A clarify whose alternatives are all modes of that hub is counted apart from one whose alternatives are checklist sentences, as the deep-loop hub asks. A prompt the parser or the engine cannot read is counted as unparsed, never dropped.
+
+`--rows-out <file>` writes one JSON line per mode clarify row with the committed prompt, the alternatives in router order, a `gold` taken from the scenario's `expected_workflow_mode` when it is among the alternatives and an empty `label`. `--transcripts <dir>` counts front-door output lines in a folder the operator names and prints the real clarify rate as counts only. Without it the census prints `real clarify rate: not measured`.
+
+`--score <file>` reads a rows file. A row is labeled when it has an operator `label` or a committed `gold`. A label outside the row's alternatives and `none_of_these` exits 2 naming the row. Under 30 labeled rows it prints `stop: fewer than 30 labeled rows` and calls nothing. Past the gate the baseline is the router's first alternative. When that baseline is right on more than 90 percent of the rows, the script prints `no headroom`. Otherwise `--jev` and `--deem`, each with `--out <dir>`, run behind their own gates, Jev first. Each backend answers every row three times in rotated option order and writes every call to `calls.jsonl`. Its column ends in `verdict <backend>: keep`, `kill` or `stop (<reason>)` under a keep rule fixed before any run.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Script | Census, transcript count, rows writer, label gate, both arms and the verdict |
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Script | Playbook scenario parser the census imports |
+| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Shared | `loadHubEngine`, the per-hub compiled engine loader |
+| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | Data | Routing-corpus prompts with their gold skill |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Unit | Census counts, the checklist split, the transcript count, the label gate, the keep rule's verdicts and both gates on stub binaries |
+| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md` | Manual playbook | Runs the census and confirms the scorer stops at the label gate |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Compiled Routing
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `compiled-routing-and-legacy-fallback/clarify-default-measurement.md`
+
+Related references:
+- [compiled-routing-and-legacy-fallback.md](compiled-routing-and-legacy-fallback.md) - the compiled front door whose clarify answers this script counts
diff --git a/.skilled/skills/sk-doc/sk-create-skill/README.md b/.skilled/skills/sk-doc/sk-create-skill/README.md
index bc7e5a10964..82740c9063b 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/README.md
@@ -4,7 +4,7 @@ description: "Scaffold, validate and package standalone OpenCode skills and two-
 trigger_phrases:
   - "create skill"
   - "parent hub"
-version: 1.2.0.19
+version: 1.2.0.20
 ---
 
 # create-skill
@@ -86,6 +86,17 @@ The parent-hub path starts by confirming the target really is one advisor-routab
 
 `--compiled-routing legacy` and `--compiled-routing ready` produce genuinely different on-disk artifacts for the same hub shape. The authoring workflow asks which one you want rather than silently picking. Legacy leaves the router directive in place with no canonical manifest, which is backward compatible with every existing call. Ready mints a canonical manifest with `compiled-route-manifest.cjs mint`, then verifies it is fresh and only reports `compiled-ready` when both steps succeed. A failed mint or a stale manifest falls back to legacy rather than ever hand-authoring a manifest or a digest. Either way, a ready manifest stays inert onboarding evidence: it never activates compiled serving or changes the repository default on its own.
 
+### Measuring Clarify Defaults
+
+When a compiled hub cannot choose between near-tied modes, it answers `clarify` with a short list of alternatives and suggests no default. [`scripts/score-clarify-default.cjs`](./scripts/score-clarify-default.cjs) measures whether a classifier could suggest one. With no switch it makes no model call. It replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine and counts `clarify` against the other outcomes per hub and source. `--rows-out <file>` writes each clarify row whose alternatives are modes, with an empty `label` for you to fill. `--transcripts <dir>` counts real front-door answers in a folder you name without printing any text.
+
+```bash
+node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report <dir> --rows-out <file>
+node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <file>
+```
+
+`--score` refuses to judge below 30 labeled rows and prints `stop: fewer than 30 labeled rows`. Past that gate, `--jev` or `--deem` with `--out <dir>` asks the classifier three times per row in rotated option order and prints one verdict per backend against the router's first alternative. A `keep` serves nothing, because the front door still prints no default.
+
 ---
 
 ## 5. INTEGRATION & NAVIGATION
@@ -145,6 +156,7 @@ A: No. `SKILL.md` is the root marker, while each class has required root metadat
 | Package completion | `python3 scripts/validate_skill_package.py <path>` | Ends with `package_skill.py --check: PASS (exit 0)`. Parent hubs also report legacy or compiled-ready state |
 | Strict contract check | `python3 scripts/validate_skill_package.py <path> --strict` | Promotes noncanonical generated paths from advisory to blocking |
 | Structure extraction | `python3 ../shared/scripts/extract_structure.py <path/to/SKILL.md>` | Prints the parsed section outline for a fast quality read |
+| Clarify census and scorer | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | `pass 28` and `fail 0` |
 
 ---
 
@@ -160,3 +172,4 @@ A: No. `SKILL.md` is the root marker, while each class has required root metadat
 | [`references/skill/upgrading-a-skill-to-v4.md`](./references/skill/upgrading-a-skill-to-v4.md) | Adopter guide: reconcile a customized skill to the v4 parent-hub format |
 | [`scripts/init_skill.py`](./scripts/init_skill.py) | Scaffold helper for new standalone or parent-hub folders |
 | [`scripts/package_skill.py`](./scripts/package_skill.py) | Validation and packaging helper |
+| [`scripts/score-clarify-default.cjs`](./scripts/score-clarify-default.cjs) | Zero-call clarify census and default-pick scorer |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/SKILL.md b/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
index e7e0d76967c..6858695d7c1 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
@@ -2,7 +2,7 @@
 name: sk-create-skill
 description: Scaffold OpenCode skills and two-axis sk-doc parent hubs, including standalone, nested workflow, and surface packets.
 allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
-version: 1.2.0.0
+version: 1.4.0.0
 ---
 
 <!-- Keywords: create-skill, create-skill-parent, skill scaffolding, parent hub, nested workflow packet, package-skill, init-skill, /create:skill, /create:skill-parent -->
@@ -78,6 +78,7 @@ Ask one focused clarification before authoring if it is unclear whether the user
 | Procedure cards | `assets/skill/skill-procedure-template.md` | Add a private, triggerable internal procedure to a skill or mode without a new public identity. |
 | Parent hubs | `assets/parent-skill/parent-skill-*` | Create hub SKILL, registry, router, description, and graph metadata files. |
 | Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
+| Routing measurement | `scripts/score-clarify-default.cjs` | Count how often compiled hubs answer `clarify` with zero model calls and write unlabeled clarify rows. `--score` stops below 30 labeled rows. Past that gate `--jev` or `--deem` asks a classifier for a default pick. |
 | Overflow detail | `references/README.md`, `references/{shared,skill,parent-skill}/`, `../shared/` | Load only for edge cases, exhaustive examples, or schema details beyond this SKILL.md. |
 
 ### Smart Router Pseudocode
@@ -466,5 +467,6 @@ Use these only for overflow detail, exhaustive examples, or schema checks beyond
 - `assets/parent-skill/parent-skill-*` - parent hub templates.
 - `scripts/init_skill.py` - standalone skill scaffold helper.
 - `scripts/package_skill.py` - validation and packaging helper.
+- `scripts/score-clarify-default.cjs` - zero-call clarify census and default-pick scorer. It stops below 30 labeled rows. `--jev` or `--deem` scores a pick only past that gate.
 - `../shared/references/core-standards.md` - shared markdown standards.
 - `../shared/references/validation.md` - shared validation workflow.
diff --git a/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md b/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md
new file mode 100644
index 0000000000..34c95a23a1
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.4.0.0.md
@@ -0,0 +1,30 @@
+---
+title: "sk-create-skill v1.4.0.0, a clarify census and default-pick scorer"
+description: "Adds score-clarify-default.cjs, which counts compiled-routing clarify answers with zero model calls and judges a suggested default only past 30 labeled rows."
+trigger_phrases:
+  - "sk-create-skill v1.4.0.0"
+  - "sk-create-skill 1.4.0.0"
+  - "clarify census and label gate"
+importance_tier: "normal"
+contextType: "general"
+version: 1.4.0.0
+---
+
+# v1.4.0.0, A Clarify Census and Default-Pick Scorer
+
+When a compiled hub finds two modes nearly tied, it asks the reader to choose and suggests no default. Nobody knew how often that happens or which answer would have been right. This release adds a script that counts those `clarify` answers with no model call and prepares the rows a person must label before any classifier is judged.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default` (Level 1)
+
+## What's New at a Glance
+
+- **`scripts/score-clarify-default.cjs` counts clarify answers without calling a model.** It replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine and prints the outcomes per hub and source.
+- **Checklist questions stay apart from mode choices.** A clarify whose alternatives are not modes, such as the deep-loop checklist, is counted but never written as a row.
+- **`--rows-out` writes the rows you label.** Each row carries the router's alternatives, any committed playbook gold and an empty `label`.
+- **`--transcripts` counts real clarify answers in a folder you name.** It prints counts only and never the text of your sessions.
+- **The scorer stops below 30 labeled rows.** `--score` prints `stop: fewer than 30 labeled rows` and makes no call until the labels exist.
+- **Past the gate, `--jev` and `--deem` each earn a verdict.** Each backend answers every row three times in rotated order and is judged against the router's first alternative under a keep rule fixed before any run. A `keep` serves nothing.
+
+## Upgrade
+
+No migration required. The script and its playbook scenario are new, and no router, routing fixture or existing scenario changed.
diff --git a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
index 0c653e04694..0c6a9445a30 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
@@ -1,14 +1,14 @@
 ---
 title: "sk-create-skill: Manual Testing Playbook"
 description: "Operator-facing scenarios for scaffolding standalone skills, building parent hubs, validating root metadata and preserving routing boundaries."
-version: 1.2.0.3
+version: 1.2.0.4
 ---
 
 # sk-create-skill: Manual Testing Playbook
 
 This playbook defines the operator contract for `sk-create-skill`. It covers standalone skill creation, root metadata classes, parent-hub routing files, compiled-routing readiness and packet identity boundaries.
 
-The root file owns shared skill-authoring policy. Category files own scenario execution truth. This package has no feature catalog. Each scenario says so in its source table.
+The root file owns shared skill-authoring policy. Category files own scenario execution truth. This package has no feature catalog of its own. SKL-001 to SKL-006 say so in their source tables. SKL-007 links the sk-doc hub catalog entry for its script.
 
 Canonical package artifacts:
 
@@ -25,7 +25,7 @@ A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and r
 
 This package tests the two authoring paths owned by `sk-create-skill`. It checks the standalone scaffold and its metadata, the handoff to quality control, parent-hub registry and router parity, the `ready` boundary and the single-advisor-identity rule.
 
-Coverage is split into six scenarios across two categories. Three scenarios cover standalone skills. Three cover parent hubs.
+Coverage is split into seven scenarios across two categories. Three scenarios cover standalone skills. Four cover parent hubs, one of them the compiled-routing clarify census.
 
 ### Realistic Test Model
 
@@ -36,7 +36,7 @@ Coverage is split into six scenarios across two categories. Three scenarios cove
 
 ### Coverage Boundary
 
-The mode must create skill artifacts from the selected standalone or parent path. It must leave existing-document quality audits to `sk-create-quality-control`. It must keep one advisor identity at a parent hub and must not claim compiled serving from a fresh `ready` manifest.
+The mode must create skill artifacts from the selected standalone or parent path. It must leave existing-document quality audits to `sk-create-quality-control`. It must keep one advisor identity at a parent hub and must not claim compiled serving from a fresh `ready` manifest. Its clarify census must call no model. Its scorer must stop below 30 labeled rows.
 
 ---
 
@@ -201,7 +201,7 @@ Desired user-visible outcome: an existing-document report from the quality workf
 
 ---
 
-## 8. PARENT HUB (`SKL-004..SKL-006`)
+## 8. PARENT HUB (`SKL-004..SKL-007`)
 
 ### SKL-004 | Author a two-axis parent hub
 
@@ -266,6 +266,27 @@ Desired user-visible outcome: one advisor identity with nested packets routed th
 
 ---
 
+### SKL-007 | Count clarify answers and stop at the label gate
+
+#### Description
+
+Verify that the clarify census counts `clarify` answers per hub and source with zero model calls and that its scorer stops below 30 labeled rows.
+
+#### Scenario Contract
+
+Prompt: `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.`
+
+The operator runs `score-clarify-default.cjs` with stub `jev` and `cli-deem` binaries first on `PATH`, reads the per-hub counts and the rows file, then runs `--score` on that file with and without `--deem`. Every row label stays empty. The scorer prints `stop: fewer than 30 labeled rows` both times.
+
+Desired user-visible outcome: the clarify counts and a plain statement that no default can be scored until 30 rows carry a label.
+
+#### Test Execution
+
+> **Feature File:** [SKL-007](parent-hub/count-clarify-and-stop-at-the-label-gate.md)
+> **Catalog:** [clarify-default-measurement](../../feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md) in the sk-doc hub catalog.
+
+---
+
 ## 9. AUTOMATED TEST CROSS-REFERENCE
 
 | Test Module | Coverage | Playbook Overlap |
@@ -274,6 +295,7 @@ Desired user-visible outcome: one advisor identity with nested packets routed th
 | `package_skill.py` | Strict skill package structure and frontmatter checks | SKL-001 |
 | `ci-skill-root-metadata.cjs` | Root class, authored and generated metadata, forbidden files and freshness | SKL-002 and SKL-006 |
 | `parent-skill-check.cjs` | Parent registry, router, packet and root-router conformance | SKL-004 |
+| `score-clarify-default.test.cjs` | Census counts, the checklist split, the label gate, the keep rule and both backend gates on stub binaries | SKL-007 |
 
 The gates prove file and schema state. They do not by themselves prove that a new mode is reachable from every routing surface or that a ready manifest serves compiled traffic.
 
@@ -281,7 +303,7 @@ The gates prove file and schema state. They do not by themselves prove that a ne
 
 ## 10. FEATURE CATALOG CROSS-REFERENCE INDEX
 
-This package has no feature catalog. The root index below is the source of scenario membership.
+This package has no feature catalog of its own. The root index below is the source of scenario membership.
 
 | Feature ID | Feature Name | Category | Feature File |
 |---|---|---|---|
@@ -291,3 +313,4 @@ This package has no feature catalog. The root index below is the source of scena
 | SKL-004 | Author a two-axis parent hub | PARENT HUB | [SKL-004](parent-hub/author-a-two-axis-parent-hub.md) |
 | SKL-005 | Keep ready separate from compiled serving | PARENT HUB | [SKL-005](parent-hub/keep-ready-separate-from-compiled-serving.md) |
 | SKL-006 | Keep one parent identity | PARENT HUB | [SKL-006](parent-hub/keep-one-parent-identity.md) |
+| SKL-007 | Count clarify answers and stop at the label gate | PARENT HUB | [SKL-007](parent-hub/count-clarify-and-stop-at-the-label-gate.md) |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md
new file mode 100644
index 0000000000..280b5d10fa
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md
@@ -0,0 +1,102 @@
+---
+title: "SKL-007 -- Count clarify answers and stop at the label gate"
+description: "This scenario validates the clarify census for `SKL-007`. It focuses on zero model calls, the per-hub counts and the 30-row label gate."
+version: 1.4.0.0
+---
+
+# SKL-007 -- Count clarify answers and stop at the label gate
+
+This document captures the operator contract for `SKL-007`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the compiled-routing clarify census and the label gate of its scorer. It checks that the census calls no model and that the scorer refuses to judge a default below 30 labeled rows.
+
+### Why This Matters
+
+A clarify default can only be judged against gold. The committed prompts carry almost none. A census that called a model would spend what the census promises not to spend. A scorer that judged a handful of rows would report a verdict nobody can trust.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `SKL-007` and read the census and gate lines before answering.
+
+- Objective: count clarify answers per hub and source with zero model calls, then confirm the scorer stops at the label gate
+- Realistic user request: `How often do the compiled hubs ask me to choose between modes, and can a classifier pick a default yet?`
+- Prompt: `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.`
+- Expected execution process: place logging stub `jev` and `cli-deem` binaries first on `PATH`, run the census with a report folder and a rows file, then run the scorer on that file without a switch and with `--deem`.
+- Expected signals: the census prints one line per hub and source, `real clarify rate: not measured` and `rows written:`. Every row has an empty `label`. The scorer prints `stop: fewer than 30 labeled rows` both times. The stub log stays empty.
+- Desired user-visible outcome: the clarify counts and a plain statement that no default can be scored until 30 rows carry a label.
+- Pass/fail: PASS if the census exits 0, every row label is empty, the scorer stops at the gate twice and no stub call is logged. FAIL if a stub call is logged, a row carries a label nobody wrote or the scorer prints a verdict.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.`
+
+| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
+|---|---|---|---|---|---|---|---|---|
+| SKL-007 | Count clarify answers and stop at the label gate | Count clarify answers with zero model calls and confirm the scorer stops at the label gate | `Count how often the compiled hubs answer clarify, then tell me whether a suggested default can be scored yet.` | 1. `bash: mkdir -p /tmp/clarify-stub && printf '#!/bin/sh\necho called >> /tmp/clarify-stub/calls.log\nexit 1\n' > /tmp/clarify-stub/jev && cp /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem && chmod +x /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem` -> 2. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report /tmp/clarify-census --rows-out /tmp/clarify-census/rows.jsonl` -> 3. `bash: grep -c '"label":""' /tmp/clarify-census/rows.jsonl` -> 4. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl` -> 5. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl --deem --out /tmp/clarify-deem` -> 6. `bash: test ! -e /tmp/clarify-stub/calls.log` -> 7. `bash: rm -rf /tmp/clarify-stub /tmp/clarify-census /tmp/clarify-deem` | Step 2: per-hub lines, `real clarify rate: not measured`, `rows written:` and exit 0. Step 3: the count equals the rows written. Steps 4 and 5: `stop: fewer than 30 labeled rows` and exit 0. Step 6: exit 0 | The exact prompt, the census output, the rows count, both scorer outputs with exit statuses and the stub log check | PASS if the census and both scorer runs exit 0, every label is empty, both scorer runs stop at the gate and the stub log does not exist. FAIL on any stub call, a non-empty label or a verdict line | 1. Read the rows file for a non-empty `label`. 2. Check that the scorer counted `gold` only where it names an alternative. 3. Check `PATH` for a real `jev` or `cli-deem` ahead of the stubs |
+
+### Commands
+
+1. `bash: mkdir -p /tmp/clarify-stub && printf '#!/bin/sh\necho called >> /tmp/clarify-stub/calls.log\nexit 1\n' > /tmp/clarify-stub/jev && cp /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem && chmod +x /tmp/clarify-stub/jev /tmp/clarify-stub/cli-deem`
+2. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --report /tmp/clarify-census --rows-out /tmp/clarify-census/rows.jsonl`
+3. `bash: grep -c '"label":""' /tmp/clarify-census/rows.jsonl`
+4. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl`
+5. `bash: PATH="/tmp/clarify-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score /tmp/clarify-census/rows.jsonl --deem --out /tmp/clarify-deem`
+6. `bash: test ! -e /tmp/clarify-stub/calls.log`
+7. `bash: rm -rf /tmp/clarify-stub /tmp/clarify-census /tmp/clarify-deem`
+
+### Expected
+
+Step 1 builds two stubs that log any call. Step 2 prints the census and writes the report and the rows. Step 3 counts one empty label per row. Steps 4 and 5 stop at the label gate, the second one with the Deem switch set. Step 6 proves no stub ran. Step 7 removes the temporary folders.
+
+### Evidence
+
+Capture the prompt, the census output, the rows count, both scorer outputs with exit statuses and the result of the stub log check.
+
+### Pass / Fail
+
+- **Pass**: the census and both scorer runs exit 0, every label is empty, both scorer runs print `stop: fewer than 30 labeled rows` and no stub call is logged.
+- **Fail**: a stub call is logged, a row carries a label nobody wrote or the scorer prints a verdict line.
+
+### Failure Triage
+
+1. Read the rows file for a non-empty `label`.
+2. Check that a row keeps `gold` only when it names one of its alternatives.
+3. Check `PATH` for a real `jev` or `cli-deem` ahead of the stubs.
+
+---
+
+## 4. SOURCE FILES
+
+### Playbook Sources
+
+| File | Role |
+|---|---|
+| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
+| [`clarify-default-measurement.md`](../../../feature-catalog/compiled-routing-and-legacy-fallback/clarify-default-measurement.md) | The sk-doc hub catalog entry for the script |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| [`scripts/score-clarify-default.cjs`](../../scripts/score-clarify-default.cjs) | Census, rows writer, label gate and scorer |
+| [`scripts/tests/score-clarify-default.test.cjs`](../../scripts/tests/score-clarify-default.test.cjs) | Unit coverage on synthetic hubs, labels and stub binaries |
+| [`SKILL.md`](../../SKILL.md) | Resource domain that names the script |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: PARENT HUB
+- Playbook ID: SKL-007
+- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
+- Feature file path: `parent-hub/count-clarify-and-stop-at-the-label-gate.md`
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md b/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
index d5ecfa4587d..d1990cf8628 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
@@ -28,6 +28,7 @@ trigger_phrases:
 | `init_skill.py` | Scaffolds a skill directory. |
 | `package_skill.py` | Validates and packages a skill directory. |
 | `regenerate-skill-derived.cjs` | Regenerates derived skill data. |
+| `score-clarify-default.cjs` | Counts compiled-routing clarify answers with zero model calls and scores labeled clarify rows behind a 30-row gate. |
 | `validate-compiled-routing-scenarios.cjs` | Validates compiled-routing scenario content. |
 | `validate-playbook-topology.cjs` | Validates manual playbook topology. |
 | `validate_skill_package.py` | Runs skill and parent-hub package validation. |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
index 868ec04256e..3363f346cc8 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
@@ -28,6 +28,7 @@ trigger_phrases:
 | `generate-leaf-manifest-scopes.test.cjs` | Tests per-mode leaf scoping and the hash-equal leaf-set refusal. |
 | `leaf-resource-contract.test.cjs` | Tests typed leaf-resource identity behavior. |
 | `root-router-contract.test.cjs` | Tests the two-state root ROUTER.md contract and its stable negative codes. |
+| `score-clarify-default.test.cjs` | Tests the clarify census, the transcript count, the label gate, the keep rule and both backend gates on stub binaries. |
 | `skill-derived-regenerator.test.cjs` | Tests derived-data regeneration and freshness behavior. |
 | `skill-root-metadata-contract.test.cjs` | Tests skill-root metadata classification and fleet conformance. |
 | `validate-compiled-routing-scenarios.test.cjs` | Tests compiled-routing scenario admission fixtures. |
```
