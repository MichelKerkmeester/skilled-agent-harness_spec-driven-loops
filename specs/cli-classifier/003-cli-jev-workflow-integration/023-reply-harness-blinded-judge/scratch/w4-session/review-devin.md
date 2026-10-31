# Cross-family review: one phase's uncommitted build

You are a read-only reviewer from a different model family than the author of these files (the docs were written by MiMo v2.6 Pro through Pi; you are DeepSeek through Devin). Never dispatch another agent. Never edit, create or delete a file, and never run a git command that writes. You may run read-only commands and the phase's tests. Worktree root (run every command from here): `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration`

## Scope

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge`. The build is uncommitted in the working tree, and other phases' builds may be uncommitted beside it: review only the files listed here.
- `.skilled/skills/sk-communication/README.md`
- `.skilled/skills/sk-communication/SKILL.md`
- `.skilled/skills/sk-communication/benchmark/reply-harness/README.md`
- `.skilled/skills/sk-communication/feature-catalog/feature-catalog.md`
- `.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/sk-communication/changelog/v1.4.0.0.md`
- `.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md`
- `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md`

Read first: the phase's `spec.md` (requirements and file list), its `goal.md` (criteria), `specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/build-evidence.md`, and the parent `specs/cli-jev/003-cli-jev-workflow-integration/goal.md` D1 to D7. Then open each file above in full, and the callers and tests of anything changed. The appendix holds the diff, so you can review even if a file read fails, but cite only lines you opened or lines in the appendix.

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
diff --git a/.skilled/skills/sk-communication/README.md b/.skilled/skills/sk-communication/README.md
index ae4d779740f..6db3903a6d9 100644
--- a/.skilled/skills/sk-communication/README.md
+++ b/.skilled/skills/sk-communication/README.md
@@ -72,6 +72,7 @@ npm run check   # typecheck + build + tests + import smoke
 - [feature-catalog/feature-catalog.md](feature-catalog/feature-catalog.md): the current shipped-behavior inventory.
 - [manual-testing-playbook/manual-testing-playbook.md](manual-testing-playbook/manual-testing-playbook.md): deterministic operator validation scenarios.
 - `.skilled/skills/sk-communication/cli-communication-projection/docs/`: install, configuration, privacy, support-matrix, rollback, and runbook.
+- `benchmark/reply-harness/judge-agreement.mjs`: measures offline whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores. It calls no model by default, and `--deem` or `--jev` each need their own passing check and `--out <dir>`.
 
 ---
 
diff --git a/.skilled/skills/sk-communication/SKILL.md b/.skilled/skills/sk-communication/SKILL.md
index 051038bb4a6..b402814ad54 100644
--- a/.skilled/skills/sk-communication/SKILL.md
+++ b/.skilled/skills/sk-communication/SKILL.md
@@ -2,7 +2,7 @@
 name: sk-communication
 description: Projects terse CLI output to plain English byte-safely, across six runtimes, leaving canonical bytes unchanged.
 allowed-tools: [Read, Write, Bash, Grep, Glob]
-version: 1.3.0.0
+version: 1.4.0.0
 ---
 
 <!-- Keywords: communication projection, claudish to english, rewrite CLI output, plain-english projection, presentation projection, privacy-first rewrite, full-projection, safe-native, provider adapters, exact-original fallback, deepseek ollama llama.cpp, blind non-inferiority evaluation, compatibility doctor, release gate -->
@@ -224,6 +224,7 @@ Run the package's authoritative gate from the package directory: `npm run check`
 
 - `.skilled/skills/sk-communication/cli-communication-projection/` — the implementation; read `src/<subsystem>/index.ts` for the public surface.
 - `.skilled/skills/sk-communication/cli-communication-projection/docs/` — install, configuration, privacy, support-matrix, rollback, and runbook.
+- `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`: an offline measurement of whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores, calling no model unless `--deem` or `--jev` is set and never feeding the release gate.
 
 ### Deep Detail
 
diff --git a/.skilled/skills/sk-communication/benchmark/reply-harness/README.md b/.skilled/skills/sk-communication/benchmark/reply-harness/README.md
index 757fe1f5f63..349acfbea4d 100644
--- a/.skilled/skills/sk-communication/benchmark/reply-harness/README.md
+++ b/.skilled/skills/sk-communication/benchmark/reply-harness/README.md
@@ -1,8 +1,12 @@
 # Reply harness
 
-Mechanical plumbing for the reply comparison. No script here calls a model, the model step belongs to the operator.
+## 1. OVERVIEW
 
-## What each piece does
+Mechanical plumbing for the reply comparison. The default run of every script here calls no model. Only `judge-agreement.mjs` can ask one, and only behind its `--deem` or `--jev` switch, so the model step that feeds the comparison still belongs to the operator.
+
+---
+
+## 2. WHAT EACH PIECE DOES
 
 - `cases.json`. The frozen case set. One entry per case plus the negative control, copied word for word from the measurement baseline. Every scoring script reads it and refuses a malformed copy rather than skipping one.
 - `rubric.json`. Seven weighted dimensions whose weights sum to 1, plus one blocking class. A reply that loses the observable its case keys on fails its row regardless of score. Nothing in this file names a condition, a commit or a date, so a judge reading it learns nothing about which side it scores.
@@ -10,14 +14,18 @@ Mechanical plumbing for the reply comparison. No script here calls a model, the
 - `score.mjs`. Scores one reply per case. Takes `--condition`, `--replies` and `--out`, plus `--prompts` naming the prompts directory the replies answered. With `--prompts` it refuses to score when `cases.json` no longer matches the `casesHash` the prompt manifest recorded, or when the manifest was generated for the other condition, so a case edited mid-run stops the run instead of skewing it. Runs the scanner over each reply through a temp file and counts findings by severity, then applies one deterministic predicate per case. It weighs the dimensions and records whether the blocking class fired. A reply may carry a `<caseId>.meta.json` with the provider and the change kind. Rows whose change kind is `no-op` land under their own key, apart from the rule rows. A malformed case set or a missing reply stops the run with a non-zero exit and a message naming the file.
 - `blind.mjs`. Takes `--a`, `--b` and `--out`. Copies both replies for each case under random labels A and B into masked files that carry no provenance, and writes the order record mapping labels back to conditions under a separate sealed file. This is the bare text a judge, human or model, reads.
 - `compare.mjs`. Takes `--before` and `--after` results files. Prints the per-dimension delta for every dimension including the ones that did not move, the control's scores on both sides, the count of no-op rows on each side and the after-side blocking rows. Exits non-zero when the control moved or a blocking class fired on the after side.
+- `judge-agreement.mjs`. Measures offline whether a model judge agrees with the operator's grades of masked replies more often than the mechanical scores of `score.mjs`. Takes `--masked` and `--replies`, each repeatable, plus an optional `--labels` file of operator grades. It joins each masked reply to its reply file by the SHA-256 of the reply text, runs `score.mjs` unchanged for the baseline, counts apart any empty or missing reply it cannot score, and prints the census, the baseline agreement and a label gate that stops below 20 graded distinct replies. The default run calls no model and writes no file. `--deem` asks the local Deem server and `--jev` asks the hosted Jev service, each only after its own check passes and only with `--out <dir>`, where the run writes `report.json` and one `calls.jsonl` line per call. No verdict it prints reaches `compare.mjs` or the release gate.
 - `release-gate.md`. The observable conditions the comparison must satisfy, each naming the command or artifact behind it, plus the gap.
 
-## Run order
+---
+
+## 3. RUN ORDER
 
 1. `node generate-prompts.mjs --condition before --out <before prompts dir>` and the same with `--condition after` into its own directory. Use one directory per condition.
 2. Feed each prompt file to a model by hand. Save each reply as `<caseId>.md` in a replies directory. A reply may carry a `<caseId>.meta.json` beside it. Keep the control's reply out of the no-op kind or the comparison loses its control row.
 3. `node score.mjs --condition <condition> --replies <replies dir> --prompts <prompts dir> --out results/<condition>.json`
 4. `node blind.mjs --a <before replies dir> --b <after replies dir> --out <masked dir>` when a blinded judge reads the replies. The judge scores by `rubric.json` outside these scripts.
 5. `node compare.mjs --before results/before.json --after results/after.json`
+6. `node judge-agreement.mjs --masked <masked dir> --replies <before replies dir> --replies <after replies dir> --labels <grades file>` when you want to know whether a model judge would grade the masked replies as you would. The grades file holds one JSON line per graded masked file: `masked`, its path from the repository root, and `grades`, each of the seven `rubric.json` dimension ids set to `absent`, `partly met` or `fully met`. Add `--deem --out <dir>` or `--jev --out <dir>` only once at least 20 distinct replies are graded. `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`.
 
 The predicate mechanics are plain text checks over the reply. The retention check reads a case's `expectedItems` when it names them, else the backticked tokens in its prompt, because every dimension mechanic runs against every case. The case that keys on retention must declare them, and the scorer refuses the run if it does not. The coverage case names the eleven rule files present in both conditions, because the twelfth exists only on the after side and would read as a dropped item on every before reply. An entry that is itself a list of names is one item satisfied by any of them, which is how a rule file renamed between conditions stays scorable on both sides. The group sizes are recorded in the row detail and do not decide the case, because the operator accepted the flat list on the models measured, so only a dropped item fails it. A reply that declares nothing open needs no closing next-action line. A reply that declares something open must close by naming one genuinely open step.
diff --git a/.skilled/skills/sk-communication/feature-catalog/feature-catalog.md b/.skilled/skills/sk-communication/feature-catalog/feature-catalog.md
index 27cea4a1175..0f385b6c22e 100644
--- a/.skilled/skills/sk-communication/feature-catalog/feature-catalog.md
+++ b/.skilled/skills/sk-communication/feature-catalog/feature-catalog.md
@@ -6,7 +6,7 @@ trigger_phrases:
   - "communication projection capabilities"
   - "plain-English projection inventory"
   - "communication projection feature inventory"
-last_updated: "2026-09-14"
+last_updated: "2026-09-29"
 version: 1.0.0.0
 ---
 
@@ -18,7 +18,7 @@ This document is the current feature inventory for the `sk-communication` skill
 
 ## 1. OVERVIEW
 
-Use this catalog as the canonical inventory for the shipped communication-projection surface. Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`.
+Use this catalog as the canonical inventory for the shipped communication-projection surface. Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`, or under `.skilled/skills/sk-communication/benchmark/reply-harness/` for the offline judge measurement.
 
 ---
 
@@ -192,6 +192,22 @@ See [`evaluation-and-observability/content-free-observability.md`](evaluation-an
 
 ---
 
+### Offline judge agreement
+
+#### Description
+
+Measures offline whether a Deem or Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate.
+
+#### Current Reality
+
+`judge-agreement.mjs` joins masked replies to their reply files by the SHA-256 of the reply text, scores the baseline with `score.mjs` unchanged and stops below 20 operator-graded replies without calling a model. `--jev` and `--deem` each run only after their own check and with `--out <dir>`, ask one `score` per reply and dimension, and print one verdict per column under a keep rule fixed before any run. No verdict reaches `compare.mjs` or the release gate.
+
+#### Source Files
+
+See [`evaluation-and-observability/offline-judge-agreement.md`](evaluation-and-observability/offline-judge-agreement.md) for full implementation and test file listings.
+
+---
+
 ## 7. PACKAGING AND RELEASE
 
 ### Compatibility doctor
diff --git a/.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md b/.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md
index 5c5e2b524a4..72b7f96ae77 100644
--- a/.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md
+++ b/.skilled/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md
@@ -39,7 +39,7 @@ Coverage note: automated tests remain authoritative for exhaustive unit, integra
 
 1. Start at the repository root unless a scenario explicitly changes into the projection package.
 2. Use Node.js 22 or newer, npm 10 or newer, and the package dependencies already installed from its lockfile.
-3. Use Python 3 for the advisor compatibility smoke in `COMM-001`.
+3. Use Python 3 for the advisor compatibility smoke in `COMM-001` and for the mechanical scorer that `COMM-011` runs.
 4. Confirm the referenced scenario file, catalog file, implementation file, and test file exist before execution.
 5. Preserve unrelated working-tree changes and record `git status --short` before and after the run.
 6. Do not contact a live provider; all package scenarios use existing injected transports or deterministic fixtures.
@@ -67,7 +67,7 @@ Evidence must remain content-free: never capture provider credentials, raw priva
 - `bash: <command>` means run the command exactly in a POSIX-compatible shell.
 - `package: <command>` means run the command from `.skilled/skills/sk-communication/cli-communication-projection/`.
 - `->` separates sequential steps in a single operator session.
-- Quoted Vitest names are exact focused-test filters, not descriptive placeholders.
+- Quoted Vitest names and `node --test --test-name-pattern` values are exact focused-test filters, not descriptive placeholders.
 - An exit status of zero is required unless the feature file explicitly names a different observable result.
 - The full package gate is `package: npm run check`; focused commands prove the individual scenario and do not waive that final gate.
 
@@ -112,7 +112,7 @@ Run scenarios in dependency order so failures are localized:
 | 1 | Advisor Routing | `COMM-001` | Confirm the request reaches the owning skill. |
 | 2 | Fidelity And Privacy | `COMM-002..COMM-003`, `COMM-009`, `COMM-010` | Confirm immutable fallback, privacy-before-ranking, and external-cli fail-closed dispatch. |
 | 3 | Presentation Tiers | `COMM-004..COMM-005` | Confirm atomic ownership and original visibility. |
-| 4 | Release Gating | `COMM-006..COMM-008` | Confirm provisional evidence, doctor blocks, and human-certified release evidence. |
+| 4 | Release Gating | `COMM-006..COMM-008`, `COMM-011` | Confirm provisional evidence, doctor blocks, human-certified release evidence, and the offline judge census stopping at its label gate. |
 
 Finish each wave before beginning the next. Persist results after each scenario so a later operator can distinguish an unexecuted scenario from an executed failure.
 
@@ -223,11 +223,20 @@ Prompt: `Verify that only a complete, fresh, passing, human-certified evidence b
 > **Feature File:** [COMM-008](release-gating/human-certified-bundle-gates-release.md)
 > **Catalog:** [Release readiness and rollback](../feature-catalog/packaging-and-release/release-readiness-and-rollback.md)
 
+### COMM-011 | Offline judge census stops at the label gate
+
+Verify the offline judge measurement counts the committed masked replies and stops at its label gate with zero model calls, and that a stub Deem backend is skipped without changing the census.
+
+Prompt: `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.`
+
+> **Feature File:** [COMM-011](release-gating/offline-judge-census-stops-at-label-gate.md)
+> **Catalog:** [Offline judge agreement](../feature-catalog/evaluation-and-observability/offline-judge-agreement.md)
+
 ---
 
 ## 11. AUTOMATED TEST CROSS-REFERENCE
 
-The complete automated suite lives under [`.skilled/skills/sk-communication/cli-communication-projection/test/`](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/). Focused scenario commands use only files in that tree; final release review also runs `npm run check` from the package directory.
+The complete automated suite lives under [`.skilled/skills/sk-communication/cli-communication-projection/test/`](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/). Focused scenario commands use only files in that tree, except `COMM-011`, which runs the reply comparison scripts under [`.skilled/skills/sk-communication/benchmark/reply-harness/`](../../../../.skilled/skills/sk-communication/benchmark/reply-harness/); final release review also runs `npm run check` from the package directory.
 
 | Coverage Area | Automated Test Anchor | Scenario IDs |
 |---|---|---|
@@ -240,6 +249,7 @@ The complete automated suite lives under [`.skilled/skills/sk-communication/cli-
 | Provisional evaluation | [Proxy judge tests](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/evaluation/proxy-judge.test.ts), [release gate tests](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | `COMM-006` |
 | Compatibility doctor | [Doctor tests](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/doctor/doctor.test.ts) | `COMM-007` |
 | Release readiness | [Release gate tests](../../../../.skilled/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | `COMM-008` |
+| Offline judge agreement | [Judge agreement tests](../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs) | `COMM-011` |
 
 ---
 
@@ -256,6 +266,7 @@ The complete automated suite lives under [`.skilled/skills/sk-communication/cli-
 | Release Gating | `COMM-006` | [Provisional evaluation blocks release](release-gating/provisional-evaluation-blocks-release.md) | [Blind non-inferiority evaluation](../feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md) | Yes |
 | Release Gating | `COMM-007` | [Compatibility doctor selects original-only](release-gating/compatibility-doctor-selects-original-only.md) | [Compatibility doctor](../feature-catalog/packaging-and-release/compatibility-doctor.md) | Yes |
 | Release Gating | `COMM-008` | [Human-certified bundle gates release](release-gating/human-certified-bundle-gates-release.md) | [Release readiness and rollback](../feature-catalog/packaging-and-release/release-readiness-and-rollback.md) | Yes |
+| Release Gating | `COMM-011` | [Offline judge census stops at the label gate](release-gating/offline-judge-census-stops-at-label-gate.md) | [Offline judge agreement](../feature-catalog/evaluation-and-observability/offline-judge-agreement.md) | No |
 
 > **COMM-001 catalog mapping.** COMM-001 validates *skill-level advisor discoverability* — that a projection prompt routes to `sk-communication`. That is a property of the skill wrapper, not the `cli-communication-projection` package, so the package feature catalog (which inventories package behavior) has no exact entry for it. The linked "Privacy-first provider routing" catalog entry is the nearest package behavior the scenario prompt exercises.
 >
diff --git a/.skilled/skills/sk-communication/changelog/v1.4.0.0.md b/.skilled/skills/sk-communication/changelog/v1.4.0.0.md
new file mode 100644
index 0000000000..98283267f6
--- /dev/null
+++ b/.skilled/skills/sk-communication/changelog/v1.4.0.0.md
@@ -0,0 +1,32 @@
+---
+title: "sk-communication v1.4.0.0, An Offline Check for Model Judges"
+description: "Adds judge-agreement.mjs, which measures offline whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores."
+trigger_phrases:
+  - "sk-communication v1.4.0.0"
+  - "sk-communication 1.4.0.0"
+  - "offline check for model judges"
+  - "label gate"
+importance_tier: "normal"
+contextType: "general"
+version: 1.4.0.0
+---
+# 1.4.0.0, An Offline Check for Model Judges
+
+The reply comparison can now test a model judge before anyone trusts one. A new script measures whether a Deem or Jev judge agrees with the operator's grades of masked replies more often than the mechanical scores, and it calls no model until the operator has graded 20 replies.
+
+## Why This Release
+
+The comparison scored replies on mechanical checks alone, and nobody had measured whether those checks agree with a human reader. A model judge could read the masked replies, but without human grades there was no way to tell a trustworthy judge from an unreliable one.
+
+## What's New at a Glance
+
+- **A census comes first.** `judge-agreement.mjs` joins every masked reply to its reply file by the SHA-256 of the reply text. It prints how many replies exist, how many are distinct and how often the mechanical scores agree with the operator's grades.
+- **No model call happens below the label gate.** With fewer than 20 graded replies the run prints `stop: fewer than 20 labeled replies`. A baseline that already agrees on more than 90 percent of graded cells prints `no headroom`.
+- **Each judge sits behind its own switch.** `--deem` asks the local Deem server after its health check, and `--jev` asks the hosted Jev service after its version and credential checks. A failed check skips that judge and never starts the other one.
+- **The keep rule is fixed before any run.** Each judge column prints one verdict line: `keep`, `kill` or a `stop` with its reason. Coverage, an exact sign test over replies and a 10-point gain over the baseline decide it.
+- **Reply text leaves the machine only on request.** `--jev` sends reply text to a hosted service, so a masked file that git does not track also needs `--accept-payload`. Deem keeps everything on this machine.
+- **A verdict feeds nothing.** `compare.mjs` and the release gate never read it, and using a judge anywhere would need a change of its own.
+
+## Upgrade
+
+No migration required. Every existing script runs as before, and the new script writes nothing unless it is given `--out`.
diff --git a/.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md b/.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md
new file mode 100644
index 0000000000..4776a44e74
--- /dev/null
+++ b/.skilled/skills/sk-communication/feature-catalog/evaluation-and-observability/offline-judge-agreement.md
@@ -0,0 +1,57 @@
+---
+title: "Offline judge agreement"
+description: "Measures offline whether a Deem or Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate."
+trigger_phrases:
+  - "Offline judge agreement"
+  - "judge-agreement.mjs"
+  - "masked reply label gate"
+  - "reply judge keep rule"
+version: 1.4.0.0
+---
+
+# Offline judge agreement (judge-agreement.mjs)
+
+<!-- sk-doc-template: skill_asset_feature_catalog -->
+
+## 1. OVERVIEW
+
+Measures offline whether a Deem or Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate.
+
+The script sits beside the reply comparison scripts and changes none of them. Its verdict is evidence about one judge and feeds nothing: `score.mjs`, `compare.mjs` and the release gate never read it.
+
+---
+
+## 2. HOW IT WORKS
+
+The default run takes masked directories and replies directories. It joins each masked reply to its reply file by the SHA-256 of the reply text and prints the masked, distinct, matched and unmatched counts. It runs `score.mjs` unchanged for the mechanical baseline and maps each dimension score to one of three levels: 0 is absent, 1 is fully met and anything between is partly met. A reply file that is empty or missing gets no baseline and is counted on its own line, because `score.mjs` cannot score it. Given an operator labels file, it prints the baseline's agreement with the grades overall and per dimension. Below 20 graded distinct replies it prints `stop: fewer than 20 labeled replies`, and a baseline above 90 percent agreement prints `no headroom`. This run calls no model and writes no file.
+
+`--jev` and `--deem` each add one judge column, Jev first, and each needs `--out <dir>`. The Jev arm runs after `jev --version` prints `jev 0.6.2` and `jev auth status` passes, and a masked file that git does not track also needs `--accept-payload`. The Deem arm runs after `cli-deem health` passes. Each arm asks one `score` per reply and dimension, with the dimension's `judgeGuidance` as the question, and Jev asks each cell three times. A keep rule fixed before any run decides the verdict: coverage, an exact binomial kill test, a 10-point margin, a sign test over replies and, for Jev, a flip bound. The run writes `report.json` and one `calls.jsonl` line per call.
+
+---
+
+## 3. SOURCE FILES
+
+### Implementation
+
+| File | Layer | Role |
+|---|---|---|
+| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs` | Script | Census, baseline, label gate, both judge arms and the verdict per column. |
+| `.skilled/skills/sk-communication/benchmark/reply-harness/score.mjs` | Script | Mechanical scorer spawned unchanged for the baseline. |
+| `.skilled/skills/sk-communication/benchmark/reply-harness/rubric.json` | Shared | The seven dimension ids and the guidance each judge question carries. |
+
+### Validation And Tests
+
+| File | Type | Role |
+|---|---|---|
+| `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` | Node test | Covers the census join, the labels, the label gate, both judge gates, the payload gate and each verdict on stub binaries. |
+
+---
+
+## 4. SOURCE METADATA
+
+- Group: Evaluation And Observability
+- Canonical catalog source: `feature-catalog.md`
+- Feature file path: `evaluation-and-observability/offline-judge-agreement.md`
+
+Related references:
+- [blind-non-inferiority-evaluation.md](blind-non-inferiority-evaluation.md): the package's human non-inferiority gate, which this measurement never feeds
diff --git a/.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md b/.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md
new file mode 100644
index 0000000000..38dae55624
--- /dev/null
+++ b/.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md
@@ -0,0 +1,80 @@
+---
+title: "COMM-011 -- Offline judge census stops at the label gate"
+description: "This scenario validates that the offline judge measurement counts the committed masked replies and stops at its label gate with zero model calls, and that a stub Deem backend is skipped without changing the census."
+catalog_applicable: true
+version: 1.4.0.0
+---
+
+# COMM-011 -- Offline judge census stops at the label gate
+
+This file is the canonical operator contract for the zero-call census of `judge-agreement.mjs` and its stub-backend skip.
+
+---
+
+## 1. OVERVIEW
+
+This scenario verifies that `judge-agreement.mjs` counts the committed masked replies, prints the mechanical baseline and stops at its label gate without calling a model. It also verifies that `--deem` against a stub backend prints one skip line and leaves every census line as it was.
+
+### Why This Matters
+
+A model judge earns trust only against the operator's grades. A census that called a model before those grades exist, or a skipped judge that altered the census, would make the measurement's own numbers unreliable.
+
+---
+
+## 2. SCENARIO CONTRACT
+
+- Objective: Prove the default run makes zero model calls and stops at the label gate, and that a stub Deem backend is skipped with the census unchanged.
+- Real user request: `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.`
+- Prompt: `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.`
+- Expected execution process: Run the two focused node tests, then run the census on the three committed blind runs and compare `git status --short` before and after it.
+- Expected signals: Both focused tests pass. The census exits zero and prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies`. The working tree status is the same before and after.
+- Desired user-visible outcome: A verdict that names the census counts, the label gate line and the stub-backend skip line.
+- Pass/fail: PASS if both tests pass, the census prints the four expected lines and the status is unchanged; FAIL if a test fails, a count differs, the census prints `planned calls:` or the status changes; SKIP only if Node or Python 3 is unavailable.
+
+---
+
+## 3. TEST EXECUTION
+
+### Exact Command Sequence
+
+1. From the repository root, run `node --test --test-name-pattern "label gate stop on the default run" --test-name-pattern "stub backend" .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`.
+2. Run `git status --short > /tmp/comm-011-before.txt`.
+3. Run the census on the three committed blind runs and their six replies directories, shown in full in the table below.
+4. Run `git status --short | diff /tmp/comm-011-before.txt -` and capture both exit statuses.
+
+| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
+|---|---|---|---|---|---|---|---|---|
+| COMM-011 | Offline judge census stops at the label gate | Prove the census calls no model below the label gate and a stub Deem backend changes nothing. | `Check that the offline judge measurement counts the committed masked replies and stops at its label gate without calling a model, then return PASS or FAIL with evidence.` | 1. `bash: node --test --test-name-pattern "label gate stop on the default run" --test-name-pattern "stub backend" .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs` -> 2. `bash: git status --short > /tmp/comm-011-before.txt` -> 3. `bash: R=specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs && node .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs --masked $R/blind --masked $R/sonnet/blind --masked $R/attempt-1/blind --replies $R/before-replies --replies $R/after-replies --replies $R/sonnet/before-replies --replies $R/sonnet/after-replies --replies $R/attempt-1/before-replies --replies $R/attempt-1/after-replies` -> 4. `bash: git status --short \| diff /tmp/comm-011-before.txt -` | Step 1 exits zero with two passing tests. Step 3 exits zero and prints `masked: 42`, `distinct: 38`, `matched: 38` and `stop: fewer than 20 labeled replies`. Step 4 prints nothing and exits zero. | Transcripts and exit statuses of all four steps, the two passing test names and the four census lines. | PASS if all signals match; FAIL if a test fails, a count differs, `planned calls:` appears or the status changes; SKIP only if Node or Python 3 is unavailable. | 1. Rerun the whole test file; 2. check that the three blind directories still hold 14 masked files each; 3. run `score.mjs` alone on one replies directory to confirm Python 3 and the scanner work; 4. compare the census join in `judge-agreement.mjs` with the masked file shape `blind.mjs` writes. |
+
+### Evidence Review
+
+A passing census is not enough on its own. The evidence must show the label gate line, because a run past the gate would be the first one allowed to call a model.
+
+---
+
+## 4. SOURCE FILES
+
+### Playbook And Catalog Sources
+
+| File | Role |
+|---|---|
+| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
+| [Offline judge agreement catalog entry](../../feature-catalog/evaluation-and-observability/offline-judge-agreement.md) | The measurement, its zero-call default and its two judge switches. |
+
+### Implementation And Test Anchors
+
+| File | Role |
+|---|---|
+| [Judge agreement script](../../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs) | Census, baseline, label gate and both judge arms. |
+| [Judge agreement tests](../../../../../.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs) | Default-run and stub-backend evidence on stub binaries. |
+
+---
+
+## 5. SOURCE METADATA
+
+- Group: Release Gating
+- Playbook ID: COMM-011
+- Canonical root source: `manual-testing-playbook.md`
+- Feature file path: `release-gating/offline-judge-census-stops-at-label-gate.md`
+- Catalog entry: `evaluation-and-observability/offline-judge-agreement.md`
+- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
```
