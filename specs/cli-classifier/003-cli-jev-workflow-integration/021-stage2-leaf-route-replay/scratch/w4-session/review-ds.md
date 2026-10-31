# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (Pi MiMo v2.6 Pro). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`
- `.skilled/skills/sk-doc/sk-create-skill/README.md`
- `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.0.0.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md`
- `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md`
- `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md`
- `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-build/design.md`, `specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-build/rulings.md` (rulings override the design) and `specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay/scratch/w4-build/replay-run.txt` (the session's zero-call run; there is no build-evidence.md), and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-doc/sk-create-skill/SKILL.md b/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
index 6858695d7c..a4e8180f7a 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/SKILL.md
@@ -2,7 +2,7 @@
 name: sk-create-skill
 description: Scaffold OpenCode skills and two-axis sk-doc parent hubs, including standalone, nested workflow, and surface packets.
 allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
-version: 1.4.0.0
+version: 1.5.0.0
 ---
 
 <!-- Keywords: create-skill, create-skill-parent, skill scaffolding, parent hub, nested workflow packet, package-skill, init-skill, /create:skill, /create:skill-parent -->
@@ -79,6 +79,7 @@ Ask one focused clarification before authoring if it is unclear whether the user
 | Parent hubs | `assets/parent-skill/parent-skill-*` | Create hub SKILL, registry, router, description, and graph metadata files. |
 | Validation | `scripts/package_skill.py`, `../shared/scripts/extract_structure.py` | Check completion, package distribution zips, and inspect structure. |
 | Routing measurement | `scripts/score-clarify-default.cjs` | Count how often compiled hubs answer `clarify` with zero model calls and write unlabeled clarify rows. `--score` stops below 30 labeled rows. Past that gate `--jev` or `--deem` asks a classifier for a default pick. |
+| Leaf-route replay | `scripts/leaf-route-replay.cjs` | Replay the committed stage-two keyword block of each hub's `ROUTER.md` against its gold scenarios with zero model calls. `--transcripts` recounts `ROUTER.md` reads. Past its gate `--jev` or `--deem` asks a classifier to break ties. |
 | Overflow detail | `references/README.md`, `references/{shared,skill,parent-skill}/`, `../shared/` | Load only for edge cases, exhaustive examples, or schema details beyond this SKILL.md. |
 
 ### Smart Router Pseudocode
@@ -468,5 +469,6 @@ Use these only for overflow detail, exhaustive examples, or schema checks beyond
 - `scripts/init_skill.py` - standalone skill scaffold helper.
 - `scripts/package_skill.py` - validation and packaging helper.
 - `scripts/score-clarify-default.cjs` - zero-call clarify census and default-pick scorer. It stops below 30 labeled rows. `--jev` or `--deem` scores a pick only past that gate.
+- `scripts/leaf-route-replay.cjs` - zero-call stage-two keyword replay and read recount. It scores the `ROUTER.md` keyword block against the committed gold scenarios. `--transcripts` recounts reads and `--jev` or `--deem` breaks ties.
 - `../shared/references/core-standards.md` - shared markdown standards.
 - `../shared/references/validation.md` - shared validation workflow.
diff --git a/.skilled/skills/sk-doc/sk-create-skill/README.md b/.skilled/skills/sk-doc/sk-create-skill/README.md
index 82740c9063..a5b6e37f33 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/README.md
@@ -4,7 +4,7 @@ description: "Scaffold, validate and package standalone OpenCode skills and two-
 trigger_phrases:
   - "create skill"
   - "parent hub"
-version: 1.2.0.20
+version: 1.2.0.21
 ---
 
 # create-skill
@@ -97,6 +97,17 @@ node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --
 
 `--score` refuses to judge below 30 labeled rows and prints `stop: fewer than 30 labeled rows`. Past that gate, `--jev` or `--deem` with `--out <dir>` asks the classifier three times per row in rotated option order and prints one verdict per backend against the router's first alternative. A `keep` serves nothing, because the front door still prints no default.
 
+### Replaying Stage-Two Leaf Routes
+
+When a hub's `ROUTER.md` keyword block scores a request, the winning intents pick the leaf routes. [`scripts/leaf-route-replay.cjs`](./scripts/leaf-route-replay.cjs) measures how well those picks match the committed gold scenarios. With no switch it makes no model call. It scores each hub's predicted leaf routes against the gold routes and prints one `hub=` line per hub plus a `total` line. `--transcripts <dir>` counts real `ROUTER.md` reads in a folder you name without printing any text. `--prose <file>` compares the keyword arm against a prose arm and prints one `replay verdict:` line that keeps, drops or stops.
+
+```bash
+node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report <dir> --transcripts <dir> --prose <file>
+node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --jev --deem --out <dir>
+```
+
+Both tie-break arms stay dormant behind their gates. `--jev` or `--deem` with `--out <dir>` runs the matching gate and, when it passes, asks the classifier three times per tied row in rotated option order and prints one `verdict` line per backend. A `keep` serves nothing, because no router, map, manifest or playbook is touched.
+
 ---
 
 ## 5. INTEGRATION & NAVIGATION
@@ -157,6 +168,7 @@ A: No. `SKILL.md` is the root marker, while each class has required root metadat
 | Strict contract check | `python3 scripts/validate_skill_package.py <path> --strict` | Promotes noncanonical generated paths from advisory to blocking |
 | Structure extraction | `python3 ../shared/scripts/extract_structure.py <path/to/SKILL.md>` | Prints the parsed section outline for a fast quality read |
 | Clarify census and scorer | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | `pass 28` and `fail 0` |
+| Leaf-route replay | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | `pass 33` and `fail 0` |
 
 ---
 
@@ -173,3 +185,4 @@ A: No. `SKILL.md` is the root marker, while each class has required root metadat
 | [`scripts/init_skill.py`](./scripts/init_skill.py) | Scaffold helper for new standalone or parent-hub folders |
 | [`scripts/package_skill.py`](./scripts/package_skill.py) | Validation and packaging helper |
 | [`scripts/score-clarify-default.cjs`](./scripts/score-clarify-default.cjs) | Zero-call clarify census and default-pick scorer |
+| [`scripts/leaf-route-replay.cjs`](./scripts/leaf-route-replay.cjs) | Zero-call Stage-Two leaf-route replay and tie-break scorer |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.0.0.md b/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.0.0.md
new file mode 100644
index 0000000000..ac9f92ea5b
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.0.0.md
@@ -0,0 +1,30 @@
+---
+title: "sk-create-skill v1.5.0.0, a zero-call replay of stage-two leaf routes"
+description: "Adds leaf-route-replay.cjs, a stage-two leaf route replay that scores each parent hub's ROUTER.md keyword block against its gold scenarios with zero model calls and recounts router reads."
+trigger_phrases:
+  - "sk-create-skill v1.5.0.0"
+  - "sk-create-skill 1.5.0.0"
+  - "stage-two leaf route replay"
+importance_tier: "normal"
+contextType: "general"
+version: 1.5.0.0
+---
+
+# v1.5.0.0, A Zero-Call Replay of Stage-Two Leaf Routes
+
+Every parent hub picks the files a request needs from a committed keyword block in its `ROUTER.md`, and until now nothing could check that block against the answers on record without calling a model. This release adds `scripts/leaf-route-replay.cjs`, a stage-two leaf route replay that scores each hub's keyword block against its gold scenarios (the committed prompts with the files each one expects) with zero model calls. Ties the replay leaves are broken only by arms that stay off until you switch them on.
+
+> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/021-stage2-leaf-route-replay` (Level 1)
+
+## What's New at a Glance
+
+- **`scripts/leaf-route-replay.cjs` replays the stage-two keyword block.** It scores each parent hub's committed `ROUTER.md` leaf sets against the hub's gold scenarios and prints one line per hub plus a total.
+- **The default run makes zero model calls.** It reads the committed routers and scenarios and holds no credential unless a tie-break arm is switched on.
+- **`--transcripts` recounts how often the routers get read.** It counts `ROUTER.md` reads in a folder you name and prints counts only, never the text of your sessions. Without the flag the run prints `router reads: not measured`.
+- **`--prose` compares your prose picks with the keyword replay.** Each prose line names a scenario and the leaves you pick for it, and the run prints `replay verdict: keep`, `replay verdict: drop` or `replay verdict: stop` with its counts. A run with no prose file stops and prints `replay verdict: stop (prose arm covers 0 of 55 rows)`, the real output on the committed tree.
+- **`--jev` and `--deem` break the ties only behind their switches.** Each arm answers every tied row three times in rotated order under a keep rule fixed before any run, and both arms need `--out <dir>`.
+- **A `keep` serves nothing.** The verdict is a report, and a run touches no router, map, manifest or playbook.
+
+## Upgrade
+
+No migration required. The script is new, and no router or gold scenario changed.
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md b/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
index d1990cf862..73ca36ff56 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/README.md
@@ -29,6 +29,7 @@ trigger_phrases:
 | `package_skill.py` | Validates and packages a skill directory. |
 | `regenerate-skill-derived.cjs` | Regenerates derived skill data. |
 | `score-clarify-default.cjs` | Counts compiled-routing clarify answers with zero model calls and scores labeled clarify rows behind a 30-row gate. |
+| `leaf-route-replay.cjs` | Replays the stage-two `ROUTER.md` keyword block with zero model calls, recounts `ROUTER.md` reads behind `--transcripts`, compares the prose arm behind `--prose` and breaks ties only behind `--jev` and `--deem`. |
 | `validate-compiled-routing-scenarios.cjs` | Validates compiled-routing scenario content. |
 | `validate-playbook-topology.cjs` | Validates manual playbook topology. |
 | `validate_skill_package.py` | Runs skill and parent-hub package validation. |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
index 3363f346cc..219159bedf 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md
@@ -29,6 +29,7 @@ trigger_phrases:
 | `leaf-resource-contract.test.cjs` | Tests typed leaf-resource identity behavior. |
 | `root-router-contract.test.cjs` | Tests the two-state root ROUTER.md contract and its stable negative codes. |
 | `score-clarify-default.test.cjs` | Tests the clarify census, the transcript count, the label gate, the keep rule and both backend gates on stub binaries. |
+| `leaf-route-replay.test.cjs` | Tests the keyword replay, the transcript count, the replay verdict, the headroom gate and both backend gates on stub binaries. |
 | `skill-derived-regenerator.test.cjs` | Tests derived-data regeneration and freshness behavior. |
 | `skill-root-metadata-contract.test.cjs` | Tests skill-root metadata classification and fleet conformance. |
 | `validate-compiled-routing-scenarios.test.cjs` | Tests compiled-routing scenario admission fixtures. |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
index 0c6a9445a3..0ab8667541 100644
--- a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
@@ -1,7 +1,7 @@
 ---
 title: "sk-create-skill: Manual Testing Playbook"
 description: "Operator-facing scenarios for scaffolding standalone skills, building parent hubs, validating root metadata and preserving routing boundaries."
-version: 1.2.0.4
+version: 1.2.0.5
 ---
 
 # sk-create-skill: Manual Testing Playbook
@@ -25,7 +25,7 @@ A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and r
 
 This package tests the two authoring paths owned by `sk-create-skill`. It checks the standalone scaffold and its metadata, the handoff to quality control, parent-hub registry and router parity, the `ready` boundary and the single-advisor-identity rule.
 
-Coverage is split into seven scenarios across two categories. Three scenarios cover standalone skills. Four cover parent hubs, one of them the compiled-routing clarify census.
+Coverage is split into eight scenarios across two categories. Three scenarios cover standalone skills. Five cover parent hubs, one of them the compiled-routing clarify census.
 
 ### Realistic Test Model
 
@@ -36,7 +36,7 @@ Coverage is split into seven scenarios across two categories. Three scenarios co
 
 ### Coverage Boundary
 
-The mode must create skill artifacts from the selected standalone or parent path. It must leave existing-document quality audits to `sk-create-quality-control`. It must keep one advisor identity at a parent hub and must not claim compiled serving from a fresh `ready` manifest. Its clarify census must call no model. Its scorer must stop below 30 labeled rows.
+The mode must create skill artifacts from the selected standalone or parent path. It must leave existing-document quality audits to `sk-create-quality-control`. It must keep one advisor identity at a parent hub and must not claim compiled serving from a fresh `ready` manifest. Its clarify census must call no model. Its scorer must stop below 30 labeled rows. Its leaf-route replay must call no model and its replay verdict must stop when the prose arm covers too few gold rows.
 
 ---
 
@@ -201,7 +201,7 @@ Desired user-visible outcome: an existing-document report from the quality workf
 
 ---
 
-## 8. PARENT HUB (`SKL-004..SKL-007`)
+## 8. PARENT HUB (`SKL-004..SKL-008`)
 
 ### SKL-004 | Author a two-axis parent hub
 
@@ -287,6 +287,27 @@ Desired user-visible outcome: the clarify counts and a plain statement that no d
 
 ---
 
+### SKL-008 | Replay Stage-Two leaf routes
+
+#### Description
+
+Verify that the Stage-Two leaf-route replay calls no model and that its verdict stops when the prose arm covers too few gold rows.
+
+#### Scenario Contract
+
+Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`
+
+The operator runs `leaf-route-replay.cjs` with stub `jev` and `cli-deem` binaries first on `PATH` and `--report` set, reads the per-hub replay lines and the report, then checks the stub log. The replay prints `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `hub=cli-classifier stage1-only`, `router reads: not measured` and `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. No stub call is logged.
+
+Desired user-visible outcome: the per-hub replay counts and a plain statement that the keyword arm is not kept or dropped until the prose arm covers enough rows.
+
+#### Test Execution
+
+> **Feature File:** [SKL-008](parent-hub/replay-stage-two-leaf-routes.md)
+> **Catalog:** [leaf-route-replay](../../feature-catalog/packet-authored-registry-routing/leaf-route-replay.md) in the sk-doc hub catalog.
+
+---
+
 ## 9. AUTOMATED TEST CROSS-REFERENCE
 
 | Test Module | Coverage | Playbook Overlap |
@@ -296,6 +317,7 @@ Desired user-visible outcome: the clarify counts and a plain statement that no d
 | `ci-skill-root-metadata.cjs` | Root class, authored and generated metadata, forbidden files and freshness | SKL-002 and SKL-006 |
 | `parent-skill-check.cjs` | Parent registry, router, packet and root-router conformance | SKL-004 |
 | `score-clarify-default.test.cjs` | Census counts, the checklist split, the label gate, the keep rule and both backend gates on stub binaries | SKL-007 |
+| `leaf-route-replay.test.cjs` | Router parsing, keyword scoring, gold loading and row scoring, the read recount, the replay verdict and both backend gates on stub binaries | SKL-008 |
 
 The gates prove file and schema state. They do not by themselves prove that a new mode is reachable from every routing surface or that a ready manifest serves compiled traffic.
 
@@ -314,3 +336,4 @@ This package has no feature catalog of its own. The root index below is the sour
 | SKL-005 | Keep ready separate from compiled serving | PARENT HUB | [SKL-005](parent-hub/keep-ready-separate-from-compiled-serving.md) |
 | SKL-006 | Keep one parent identity | PARENT HUB | [SKL-006](parent-hub/keep-one-parent-identity.md) |
 | SKL-007 | Count clarify answers and stop at the label gate | PARENT HUB | [SKL-007](parent-hub/count-clarify-and-stop-at-the-label-gate.md) |
+| SKL-008 | Replay Stage-Two leaf routes | PARENT HUB | [SKL-008](parent-hub/replay-stage-two-leaf-routes.md) |
diff --git a/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md
new file mode 100644
index 0000000000..ee1fe0caac
--- /dev/null
+++ b/.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md
@@ -0,0 +1,100 @@
+---
+title: "SKL-008 -- Replay Stage-Two leaf routes"
+description: "This scenario validates the Stage-Two leaf-route replay for `SKL-008`. It focuses on the zero-call default, the per-hub lines and the replay stop line."
+version: 1.5.0.0
+---
+
+# SKL-008 -- Replay Stage-Two leaf routes
+
+This document captures the operator contract for `SKL-008`.
+
+---
+
+## 1. OVERVIEW
+
+This scenario validates the Stage-Two leaf-route replay and its verdict rule. It checks that the replay calls no model and that the verdict stops when the prose arm covers too few gold rows.
+
+### Why This Matters
+
+The replay exists to measure the keyword arm at zero cost. A run that spent a model call would break that promise. A verdict taken from rows the prose arm never covered would not be evidence.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+Operators run the exact prompt and command sequence for `SKL-008` and read the replay and verdict lines before answering.
+
+- Objective: replay the Stage-Two leaf routes per hub with zero model calls, then confirm the replay stops at prose coverage
+- Realistic user request: `How well do the hub routers pick leaf routes today, and is the keyword arm still worth keeping?`
+- Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`
+- Expected execution process: place logging stub `jev` and `cli-deem` binaries first on `PATH`, run the replay with a report folder and no arm switch, then check the report and the stub log
+- Expected signals: the replay prints one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `hub=cli-classifier stage1-only`, `router reads: not measured` and the stop line `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. The stub log stays empty.
+- Desired user-visible outcome: the per-hub replay counts and a plain statement that the keyword arm is not kept or dropped until the prose arm covers enough rows
+- Pass/fail: PASS if the replay exits 0, the report is written, the replay stops at the coverage line and no stub call is logged. FAIL if a stub call is logged, the report is missing or the replay prints `replay verdict: keep` or `replay verdict: drop`.
+
+---
+
+## 3. TEST EXECUTION
+
+### Prompt
+
+- Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`
+
+| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
+|---|---|---|---|---|---|---|---|---|
+| SKL-008 | Replay Stage-Two leaf routes | Replay the Stage-Two leaf routes with zero model calls and confirm the replay stops at prose coverage | `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.` | 1. `bash: mkdir -p /tmp/replay-stub && printf '#!/bin/sh\necho called >> /tmp/replay-stub/calls.log\nexit 1\n' > /tmp/replay-stub/jev && cp /tmp/replay-stub/jev /tmp/replay-stub/cli-deem && chmod +x /tmp/replay-stub/jev /tmp/replay-stub/cli-deem` -> 2. `bash: PATH="/tmp/replay-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report` -> 3. `bash: test -f /tmp/replay-report/report.json` -> 4. `bash: test ! -e /tmp/replay-stub/calls.log` -> 5. `bash: rm -rf /tmp/replay-stub /tmp/replay-report` | Step 2: one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `hub=cli-classifier stage1-only`, `router reads: not measured`, `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a` and exit 0. Steps 3 and 4: exit 0 | The exact prompt, the replay output with its exit status, the report folder and the result of the stub log check | PASS if the replay exits 0, the report is written, the replay stops on prose coverage and no stub call is logged. FAIL on any stub call, a missing report or a `keep` or `drop` verdict | 1. Read `replayVerdict` in the report for the `N` and `P` behind the stop. 2. Check that the run passed no `--prose` file. 3. Check `PATH` for a real `jev` or `cli-deem` ahead of the stubs |
+
+### Commands
+
+1. `bash: mkdir -p /tmp/replay-stub && printf '#!/bin/sh\necho called >> /tmp/replay-stub/calls.log\nexit 1\n' > /tmp/replay-stub/jev && cp /tmp/replay-stub/jev /tmp/replay-stub/cli-deem && chmod +x /tmp/replay-stub/jev /tmp/replay-stub/cli-deem`
+2. `bash: PATH="/tmp/replay-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report`
+3. `bash: test -f /tmp/replay-report/report.json`
+4. `bash: test ! -e /tmp/replay-stub/calls.log`
+5. `bash: rm -rf /tmp/replay-stub /tmp/replay-report`
+
+### Expected
+
+Step 1 builds two stubs that log any call. Step 2 prints the replay and writes the report folder. Step 3 confirms the report is there. Step 4 proves no stub ran. Step 5 removes the temporary folders.
+
+### Evidence
+
+Capture the prompt, the replay output with its exit status, the report folder and the result of the stub log check.
+
+### Pass / Fail
+
+- **Pass**: the replay exits 0, the report is written, the run prints `replay verdict: stop (prose arm covers 0 of 55 rows)` and no stub call is logged.
+- **Fail**: a stub call is logged, the report is missing or the run prints `replay verdict: keep` or `replay verdict: drop`.
+
+### Failure Triage
+
+1. Read `replayVerdict` in the report for the `N` and `P` behind the stop.
+2. Check that the run passed no `--prose` file, since covered rows can turn the stop into `keep` or `drop`.
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
+| [`leaf-route-replay.md`](../../../feature-catalog/packet-authored-registry-routing/leaf-route-replay.md) | The sk-doc hub catalog entry for the script |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| [`scripts/leaf-route-replay.cjs`](../../scripts/leaf-route-replay.cjs) | Keyword-arm replay, read recount, replay verdict and tie-break arms |
+| [`scripts/tests/leaf-route-replay.test.cjs`](../../scripts/tests/leaf-route-replay.test.cjs) | Unit coverage on parsing, scoring, transcripts, verdicts and stub binaries |
+| [`SKILL.md`](../../SKILL.md) | Resource domain that names the script |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: PARENT HUB
+- Playbook ID: SKL-008
+- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
+- Feature file path: `parent-hub/replay-stage-two-leaf-routes.md`
diff --git a/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md b/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
index 259d0cc618..0045c181a7 100644
--- a/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/sk-doc/feature-catalog/feature-catalog.md
@@ -1,6 +1,6 @@
 ---
 title: "sk-doc: Feature Catalog"
-description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the zero-call clarify census, the shared validator's changelog entry check and the advisory goal-criteria lint."
+description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the zero-call clarify census, the stage-two leaf route replay with its keep rule, the shared validator's changelog entry check and the advisory goal-criteria lint."
 trigger_phrases:
   - "sk-doc feature catalog"
   - "sk-doc hub capabilities"
@@ -41,6 +41,20 @@ Each of the hub's fourteen packets owns a single `Keyword triggers:` line as the
 
 See [`packet-authored-registry-routing/packet-authored-registry-routing.md`](packet-authored-registry-routing/packet-authored-registry-routing.md) for the full discriminator and source anchors.
 
+### Leaf Route Replay
+
+#### Description
+
+Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm.
+
+#### Current Reality
+
+`leaf-route-replay.cjs` in `sk-create-skill` runs each parent hub's `INTENT_SIGNALS` and `RESOURCE_MAP` blocks over the 56-row committed gold, one row per committed scenario that carries a prompt and leaf pairs, and prints per-hub precision, recall, F1 and exact match with zero model calls. sk-code's gold row prints `surface slice not replayed` and stays unscored, and `cli-classifier` prints `stage1-only`. `--transcripts <dir>` recounts the `ROUTER.md` reads behind the block as counts and bytes per hub and week, and `--prose <file>` compares the keyword arm with the pairs a prose transcript records under the coverage rule `10*P >= 9*N` and prints `replay verdict: keep`, `drop` or `stop (prose arm covers <P> of <N> rows)`. The tie-break arms stay dormant until `--jev` or `--deem` with `--out <dir>` run behind their own gates, Jev first, and end each column in `verdict <jev|deem>: <keep|kill|stop (<reason>)>` under the keep rule. A `keep` serves nothing.
+
+#### Source Files
+
+See [`packet-authored-registry-routing/leaf-route-replay.md`](packet-authored-registry-routing/leaf-route-replay.md) for the keyword arm, the gold, the replay rule and source anchors.
+
 ---
 
 ## 3. COMPILED ROUTING
@@ -105,4 +119,4 @@ Flags goal completion criteria that a reader cannot check from the line alone, s
 
 See [`document-validation/goal-criteria-lint.md`](document-validation/goal-criteria-lint.md) for the rules, the line classes and source anchors.
 
-Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal` and the clarify census of `sk-create-skill`, which ship no catalog of their own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
+Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal` and the clarify census and leaf route replay of `sk-create-skill`, which ship no catalog of their own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
diff --git a/.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md b/.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md
new file mode 100644
index 0000000000..727bad0292
--- /dev/null
+++ b/.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md
@@ -0,0 +1,61 @@
+---
+title: "Leaf Route Replay"
+description: "Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm."
+trigger_phrases:
+  - "leaf route replay"
+  - "leaf-route-replay.cjs"
+  - "stage-two keyword replay"
+  - "router read recount"
+version: 2.2.0.1
+---
+
+# Leaf Route Replay (leaf-route-replay.cjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm.
+
+Every parent hub ships a `ROUTER.md` whose `INTENT_SIGNALS` and `RESOURCE_MAP` blocks map a request's intent to the leaf resources the hub loads. `leaf-route-replay.cjs` in `sk-create-skill` runs those blocks over the gold the hubs commit and reports what the keyword arm selects. It never changes a router, a map, a manifest or a playbook. The tie-break arms stay dormant unless `--jev` or `--deem` is switched on.
+
+---
+
+## 2. HOW IT WORKS
+
+With no switch the run makes zero model calls. The script reads each parent hub's `ROUTER.md` and scores every prompt in the 56-row committed gold, one row per committed scenario that carries a prompt and leaf pairs, through the keyword arm. An intent scores its weight once per keyword that hits the lowercased prompt, where `review`, `lcp`, `inp` and `cls` match on word boundaries and every other keyword matches as a substring. The kept intents are those within one point of the top score, and their `RESOURCE_MAP` paths convert to `(workflowMode, leafResourceId)` pairs that score against the gold pairs on precision, recall, F1 and exact match. A prompt no keyword hits counts `unknown` and scores zero, and a path no declared mode or alias resolves counts `unresolvable` and is never dropped. Each hub prints `hub=<id> gold=<g> unscored=<u> unknown=<n> unresolvable=<r> tied=<t> precision=<p> recall=<p> f1=<f> exact=<e>` and one `total gold=<n> scored=<n> tied=<n> mean_f1=<f> exact=<n>` line follows. Two hubs print markers instead of scores: `hub=cli-classifier stage1-only` names the hub that owns no stage-two leaf selection, and `hub=sk-code gold=1 unscored=1 surface slice not replayed` reports sk-code's gold row as unscored and never scored because its stage-two slice is a surface and language overlay this replay does not port.
+
+`--transcripts <dir>` recounts the reads behind the block. The script walks the directory and counts one read per transcript line naming a Read on a `ROUTER.md`, takes the bytes from the paired `tool_result`, and buckets each read by hub and ISO week. It prints `router reads: files=<F> reads=<R> bytes=<B>` then one `router read hub=<id> week=<YYYY-Www> reads=<r> bytes=<b>` line per bucket, and `week=unknown` for a line with no timestamp. Counts and bytes leave the recount and transcript text never does. Without the flag the run prints `router reads: not measured`. `--prose <file>` adds the comparison arm: one line per scenario holding the id and the `workflowMode:leafResourceId` pairs the main AI loaded after reading a `ROUTER.md`, with a line that does not fit that grammar counted unparsed and never guessed. The replay rule fixes coverage first at `10*P >= 9*N`, where `N` counts the rows the keyword arm scored and `P` the rows the prose file covers, and prints `replay verdict: stop (prose arm covers <P> of <N> rows)` below it. Past coverage the keyword arm's mean F1 on the covered rows meets the prose arm's mean F1 on the same rows, `drop` below and `keep` otherwise, and every verdict line ends with `N=<N> P=<P> keyword_f1=<x|n/a> prose_f1=<y|n/a>`. With no `--prose` file the covered set is empty, so the verdict stops on coverage.
+
+`--jev` and `--deem` break the ties the replay found, the rows that kept two or more intents, behind their own gates, Jev first, and both need `--out <dir>`. Before any call the run prints `tied: K=<K>`, the `baseline: <union|first>` choice, `margin: 0.10`, `keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(SA-SB) >= M, sign test p < 0.05, flips 10*F <= 3*M` and `instruction: -q "Which intent does this request need?"`. A baseline with fewer than five improvable rows prints `no headroom` and no gate runs. Each arm answers every tied row three times in rotated option order and writes every call to `calls.jsonl` before any stop. The column ends in `verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> SA=<SA> SB=<SB> W=<W> L=<L> F=<F> p=<p> baseline=<union|first>` followed by the backend identity fields, and a stopped arm prints `jev: partial_rows=<n>` or `deem: partial_rows=<n>` after its stop line with no verdict. `--report <dir>` writes `report.json` holding the per-hub rows, the totals, the router-read count, the replay verdict and each column verdict that ran. Nothing else is written and no router, map, manifest or playbook is touched.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Script | Keyword replay, read recount, replay verdict, both tie-break arms and the column verdict |
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Script | Playbook scenario parser the replay imports for its gold rows |
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Shared | Frontmatter state and dict-body extraction for `INTENT_SIGNALS` and `RESOURCE_MAP` |
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | Shared | `dualReadLegacyResource` and `compositeKey`, the leaf-pair conversion boundary |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Unit | Router parsing, the keyword arm, row scoring, the recount, the replay verdict and both gates on stub binaries |
+| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/replay-stage-two-leaf-routes.md` | Manual playbook | Runs the zero-call replay and confirms the markers, the not-measured line and the replay stop line |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Packet-Authored, Registry-Projected Routing
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `packet-authored-registry-routing/leaf-route-replay.md`
+
+Related references:
+- [packet-authored-registry-routing.md](packet-authored-registry-routing.md) - the registry-projected routing contract whose stage-two keyword block this replay scores
```
