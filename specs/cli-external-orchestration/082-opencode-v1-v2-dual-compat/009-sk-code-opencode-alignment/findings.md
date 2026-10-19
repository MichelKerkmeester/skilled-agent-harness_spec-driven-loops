---
title: "Findings Ledger: Phase 9 sk-code-opencode alignment"
description: "Every code file the OpenCode dual-compat build changed, the review findings against the sk-code OPENCODE surface with severity, class and status, and the suite baselines."
trigger_phrases:
  - "sk code opencode alignment findings"
  - "opencode dual compat review findings"
importance_tier: "normal"
contextType: "research"
---
# Findings Ledger: Phase 9

The review range is `867b83b671..23756e8776`, pinned by the pre-fix copies in `scratch/pre-fix/` (CHK-FIX-007). The matrix is language (JavaScript, TypeScript, shell, TOML and YAML config) times finding class: 75 changed code files below, one row each, and 26 findings (CHK-FIX-005).

## Baseline

| Suite | Command | Baseline | Source |
|-------|---------|----------|--------|
| Plugin | `node --test .opencode/plugins/tests/*.test.cjs` | 303 | `../001-unknowns-and-baseline/baseline.json` |
| Guard node | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` | 21 | `../001-unknowns-and-baseline/baseline.json` |
| Guard vitest | `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` | 86 | `../001-unknowns-and-baseline/baseline.json` |
| Shared hooks | `node --test` on hook-stdin-deadline, git-preflight-advisory and git-rule-checks | 57 | `../005-version-aware-guards/` verification table |
| Classifier | `node --test` on score-injection-screen and the four classifier hook tests | 78 | `../002-pins-imports-dual-export/` verification table |
| Config shape | `node --test .skilled/bin/tests/opencode-config-shape.test.cjs` | 2 | `../004-agents-commands-config/` verification table |
| Gate-3 parity | `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | 17 | `../004-agents-commands-config/` verification table |
| Doctor | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites, node:test 380 | `../008-doctor-and-ci/scratch/run-all-after.txt` |
| sk-vision | `cd .skilled/skills/sk-vision/vision-runtime && bun test` | 29 | `../003-hard-plugin-ports/` verification table |
| Deep-loop | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage` | 2718 | `../006-cli-opencode-dual-dispatch/` verification table |

Before any fix (`scratch/suites-before/`), every suite exits 0 at or above its baseline: plugin 353, guard node 29, guard vitest 105, shared hooks 57, classifier 90, config shape 2, gate-3 17, doctor 7 suites, sk-vision 29, deep-loop 2741 passed and 8 skipped.

## Changed files

| # | File | Language | Review | Hygiene exit before | Findings |
|---|------|----------|--------|---------------------|----------|
| 1 | `.codex/agents/ai-council.toml` | TOML config | parse check (agent prose mirror) | 2 (unknown extension; hand grep clean) | none |
| 2 | `.codex/agents/debug.toml` | TOML config | parse check (agent prose mirror) | 2 (unknown extension; hand grep clean) | none |
| 3 | `.codex/agents/orchestrate.toml` | TOML config | parse check (agent prose mirror) | 2 (unknown extension; hand grep clean) | none |
| 4 | `.opencode/plugins/classifier-injection-screen.js` | JavaScript | DeepSeek plugins | 0 | none |
| 5 | `.opencode/plugins/cli-dispatch-audit.js` | JavaScript | DeepSeek plugins | 0 | F-01 |
| 6 | `.opencode/plugins/codex-hooks-watchdog.js` | JavaScript | DeepSeek plugins | 0 | none |
| 7 | `.opencode/plugins/lib/classifier-injection-screen-core.js` | JavaScript | DeepSeek plugins | 0 | none |
| 8 | `.opencode/plugins/lib/completion-sentinel-core.js` | JavaScript | DeepSeek plugins | 0 | none |
| 9 | `.opencode/plugins/lib/opencode-goal-core.js` | JavaScript | DeepSeek plugins | 0 | F-09 |
| 10 | `.opencode/plugins/lib/sk-code-post-edit-quality-core.js` | JavaScript | DeepSeek plugins | 0 | F-08 |
| 11 | `.opencode/plugins/lib/tool-identity.js` | JavaScript | DeepSeek plugins | 0 | F-09 |
| 12 | `.opencode/plugins/lib/v2-bridge.js` | JavaScript | DeepSeek plugins | 0 | F-06, F-07, F-10, F-11, F-12 |
| 13 | `.opencode/plugins/mcp-route-guard.js` | JavaScript | DeepSeek plugins | 0 | none |
| 14 | `.opencode/plugins/opencode-goal.js` | JavaScript | DeepSeek plugins | 0 | none |
| 15 | `.opencode/plugins/session-cleanup.js` | JavaScript | DeepSeek plugins | 0 | none |
| 16 | `.opencode/plugins/sk-code-post-edit-quality.js` | JavaScript | DeepSeek plugins | 0 | none |
| 17 | `.opencode/plugins/sk-git-message-gate.js` | JavaScript | DeepSeek plugins | 0 | none |
| 18 | `.opencode/plugins/sk-git-preflight-advisory.js` | JavaScript | DeepSeek plugins | 0 | none |
| 19 | `.opencode/plugins/system-completion-sentinel.js` | JavaScript | DeepSeek plugins | 0 | none |
| 20 | `.opencode/plugins/system-deep-loop-guard.js` | JavaScript | DeepSeek plugins | 0 | none |
| 21 | `.opencode/plugins/system-dist-freshness-guard.js` | JavaScript | DeepSeek plugins | 0 | F-18 |
| 22 | `.opencode/plugins/system-skill-advisor.js` | JavaScript | DeepSeek plugins | 0 | none |
| 23 | `.opencode/plugins/system-spec-gate.js` | JavaScript | DeepSeek plugins | 0 | none |
| 24 | `.opencode/plugins/system-speckit-completion.js` | JavaScript | DeepSeek plugins | 0 | none |
| 25 | `.opencode/plugins/tests/classifier-injection-screen.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 26 | `.opencode/plugins/tests/mcp-route-guard.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 27 | `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 28 | `.opencode/plugins/tests/opencode-goal-continuation.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 29 | `.opencode/plugins/tests/opencode-goal-export-contract.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 30 | `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 31 | `.opencode/plugins/tests/opencode-goal-render-parity.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 32 | `.opencode/plugins/tests/opencode-goal-state.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 33 | `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 34 | `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 35 | `.opencode/plugins/tests/session-cleanup.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 36 | `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 37 | `.opencode/plugins/tests/sk-git-message-gate.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 38 | `.opencode/plugins/tests/source-root-consumers.test.cjs` | JavaScript | DeepSeek plugins | 0 | F-01 |
| 39 | `.opencode/plugins/tests/system-completion-sentinel.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 40 | `.opencode/plugins/tests/system-deep-loop-guard.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 41 | `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 42 | `.opencode/plugins/tests/system-skill-advisor.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 43 | `.opencode/plugins/tests/system-spec-gate.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 44 | `.opencode/plugins/tests/system-speckit-completion.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 45 | `.opencode/plugins/tests/v2-bridge.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 46 | `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 47 | `.opencode/plugins/tests/v2-registration.test.cjs` | JavaScript | DeepSeek plugins | 0 | none |
| 48 | `.skilled/bin/tests/opencode-config-shape.test.cjs` | JavaScript | suite only (test file) | 0 | none |
| 49 | `.skilled/commands/doctor/scripts/git-setup-check.cjs` | JavaScript | Luna | 0 | F-03, F-20 |
| 50 | `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | JavaScript | Luna | 0 | F-03, F-19 |
| 51 | `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | JavaScript | Luna | 0 | none |
| 52 | `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | JavaScript | Luna | 0 | none |
| 53 | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | JavaScript | DeepSeek runtime | 0 | none |
| 54 | `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | JavaScript | DeepSeek runtime | 0 | none |
| 55 | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | JavaScript | DeepSeek runtime | 0 | F-16 |
| 56 | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | JavaScript | DeepSeek runtime | 0 | none |
| 57 | `.skilled/hooks/dispatch/lib/opencode-version.mjs` | JavaScript | DeepSeek runtime | 0 | F-13, F-15 |
| 58 | `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | JavaScript | DeepSeek runtime | 0 | none |
| 59 | `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Shell | Luna | 0 | none |
| 60 | `.skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts` | TypeScript | DeepSeek vision | 0 | none |
| 61 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | TypeScript | DeepSeek vision | 0 | F-22 |
| 62 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | TypeScript | DeepSeek vision | 0 | F-04, F-05, F-21 |
| 63 | `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | JavaScript | DeepSeek runtime | 0 | none |
| 64 | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | JavaScript | DeepSeek runtime | 0 | none |
| 65 | `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | JavaScript | DeepSeek runtime | 0 | F-14 |
| 66 | `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` | JavaScript | DeepSeek runtime | 0 | F-02 |
| 67 | `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 68 | `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs` | JavaScript | suite only (test file) | 0 | none |
| 69 | `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 70 | `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 71 | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 72 | `.skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 73 | `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | TypeScript | suite only (test file) | 0 | none |
| 74 | `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | JavaScript | suite only (test file) | 0 | none |
| 75 | `.github/workflows/opencode-dual-version.yml` | YAML config | Luna | 2 (unknown extension; hand grep clean) | none |

## Findings

| ID | File | Severity | Class | Status | Evidence |
|----|------|----------|-------|--------|----------|
| F-01 | `.opencode/plugins/cli-dispatch-audit.js:78` | P1 | instance-only | Closed | The pre-execution refusal reads `input.args`, but the v1 before-input carries only `tool`, `sessionID` and `callID` (`@opencode-ai/plugin` dist/index.d.ts:235-241) and the bridge puts v2 args on the output (v2-bridge.js:330). The guard returns before `evaluate()` on every call, on both versions. Reported P2 as pre-existing (commit 0e740fb479); raised to P1 because the plugin's one purpose never runs (decision 4). The test fixture at tests/source-root-consumers.test.cjs:73 and :116 passes args on the input, so the suite cannot catch it. Closed. Batch 2: the guard reads `output?.args`; the fixtures use the real shape and a five-row table (output args, input-only args, non-bash tool, empty command, joined command) is in tests/source-root-consumers.test.cjs; the plugin suite passes 355 of 355; Luna confirms (scratch/review-fix-luna.txt). |
| F-02 | `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:24` | P1 | cross-consumer | Closed | `MANIFEST_PATH` still names `.skilled/commands/deep/assets/compiled/`, which phase 004 emptied; `appendManifestRow` recreates that folder on the first CLI render. Consumers: `legacy-projection-manifest.ts:200` (same path; amendment, decision 5) and `.gitignore:196-197`. The compiled README at command-support/deep/assets/compiled/README.md:112 is a doc for phase 010. Closed. Batch 3 and the census row (decision 7): the renderer, the projection `pathTemplate` and `.gitignore` name the new folder; a real render writes there and `git check-ignore` names `.gitignore:196` (scratch/gates/render-manifest-live.txt); the deep-loop suite passes 2742. |
| F-03 | `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:200` | P1 | class-of-bug | Closed | A spaced flag value is taken without checking that it is not itself a flag, so `--out --json` writes a file named `--json`. Same class at git-setup-check.cjs:1523 (`--repo --json`). render-command-contract.cjs:206 already refuses a value that starts with `--`, the rule the fix copies. Closed. Batch 1: both parsers refuse a spaced value that starts with `--`; table tests in both doctor test files; `--out --json` exits 2 and writes no file; doctor 383 of 383. |
| F-04 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:214` | P1 | cross-consumer | Closed | On v2 the repo's Markdown `.skilled/commands/vision.md` shadows the plugin's `vision` command: a private v2 server lists one `vision`, the Markdown one (scratch/probes/v2-command-list.txt), and a fixture shows a clashing Markdown command runs while the plugin's `execute` never does (scratch/probes/v2-command-fixture.txt, decision 6). The template then tells the model a `<SK-VISION COMMAND>` block was injected when none was, so `/vision` gives no evidence on v2. Closed. Batch 4: a v2 `prompt` hook matches the prompt against vision.md exactly (`matchVisionTemplate`) and appends the handler's text. Live on v2, the stored `/vision` prompt carries the plugin's text (scratch/probes/v2-vision-live.txt). Table tests in plugin.test.ts; sk-vision 46 of 46. |
| F-05 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:190-206` | P1 | instance-only | Closed | The v2 input reads images only from stored messages (`ctx.session.context`), never from the submission's own `prompt.files`, so an image attached with `/vision` is not analyzed. Closed by the same change as F-04, which reads `prompt.files` in the prompt hook. Closed. Batches 4 and 5: the prompt hook and the plugin's own command both pass the submission's files to the image scan; tests in plugin.test.ts; Luna's verify is PASS (scratch/review-fix-verify-luna.txt). |
| F-06 | `.opencode/plugins/lib/v2-bridge.js:286-320` | P2 | cross-consumer | Deferred | The event pump stops at the first throw from a plugin's `event` handler. Deferred: latent, every current handler is guarded. |
| F-07 | `.opencode/plugins/lib/v2-bridge.js:226` | P2 | instance-only | Deferred | `sessionEventState` is never bounded for sessions that are never deleted. Deferred: a slow leak per idle session; no consumer is harmed today. |
| F-08 | `.opencode/plugins/lib/sk-code-post-edit-quality-core.js:14` | P2 | instance-only | Deferred | Dead export `PLUGIN_DIR` and its two imports. Deferred: no behaviour. |
| F-09 | `.opencode/plugins/lib/opencode-goal-core.js:1` | P2 | instance-only | Deferred | JS-USE-STRICT drift warnings here and in lib/tool-identity.js:1. Not a defect: both are ES modules, which are always strict, and the checklist exempts OpenCode plugin ESM paths (javascript-checklist.md:73-74); the verifier skips only `.mjs`. Deferred. |
| F-10 | `.opencode/plugins/lib/v2-bridge.js:17-20` | P2 | matrix/evidence | Deferred | Only `session.execution.succeeded` aliases to `session.idle`. Deferred: recorded in 003 decision 9f, waits on a v1 failed-turn capture. |
| F-11 | `.opencode/plugins/lib/v2-bridge.js:44` | P2 | matrix/evidence | Deferred | Token accounting assumes per-message `session.step.ended` totals. Deferred: recorded in 003 Known Limitations 3. |
| F-12 | `.opencode/plugins/lib/v2-bridge.js:285` | P2 | cross-consumer | Deferred | No per-location filter on the v2 event subscription (unverified). Deferred: needs a two-directory v2 capture. |
| F-13 | `.skilled/hooks/dispatch/lib/opencode-version.mjs:46` | P2 | cross-consumer | Deferred | The guard's PATH lookup accepts a directory named `opencode2`. Deferred: it degrades to `unknown`, which only turns rules into warnings. |
| F-14 | `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:200-206` | P2 | cross-consumer | Deferred | A broken `opencode2` refuses the dispatch with no fallback to `opencode`. Deferred: deliberate and pinned by opencode-dual-dispatch.vitest.ts:487-496. The reviewer's live premise does not hold: `~/.local/bin/opencode2 --version` exits 0 with `opencode v2.0.32` in the orchestrator's shell (decision 4). |
| F-15 | `.skilled/hooks/dispatch/lib/opencode-version.mjs:71-92` | P2 | algorithmic | Deferred | The 3 s race cannot fire around a `spawnSync` probe. Deferred: `spawnSync`'s own timeout bounds it. |
| F-16 | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:154` | P2 | instance-only | Deferred | `v2-slash-prompt-route` regex is broad. Deferred: warn-only, and callers fast-exit on non-dispatch shapes. |
| F-17 | `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json:30-36` | P2 | matrix/evidence | Deferred | No guard rule covers `--standalone` on ad-hoc v2 runs. Deferred: a new rule is new behaviour; the dispatcher complies. |
| F-18 | `.opencode/plugins/system-dist-freshness-guard.js:35` | P2 | class-of-bug | Closed | `RISKY_BASH_COMMAND_REGEX` matches `opencode run` but not `opencode2 run`, so a v2 dispatch skips the forced freshness refresh. Fixed with F-01, one regex in this packet's own v2 scope (decision 4). Closed. Batch 2: `/\bopencode\d*\s+run\b|\bvalidate\.sh\b/i`; a test shows `opencode2 run` triggers the refresh and `opencode2 serve` does not. |
| F-19 | `.skilled/commands/doctor/scripts/opencode-version-battery.cjs:760` | P2 | cross-consumer | Deferred | `readApiJson` drops the API exit status and stderr. Deferred: the legs still fail, with a generic reason. |
| F-20 | `.skilled/commands/doctor/scripts/git-setup-check.cjs:1295` | P2 | algorithmic | Deferred | The `dualPlugin(...)` match accepts only an identifier as the second argument. Deferred: every repo plugin passes an identifier. |
| F-21 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:197-202` | P2 | class-of-bug | Deferred | `as Part` hides the v1 FilePart identity fields. Deferred: no consumer reads them. |
| F-22 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts:8-19` | P2 | matrix/evidence | Closed | Tests pin `toV1FileUrl` only, not the v2 mapping. Closed by the F-04 tests, which drive the prompt hook end to end. Closed. Batches 4 and 5 test the v2 mapping end to end: a `data:` image as the trailing message with `image/png`, the extension and URI fallbacks, and the command `execute` path. |
| F-23 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:240-248` | P2 | instance-only | Deferred | Found by the orchestrator in batch 5: `PROMPT_FILE_MIME[extension]` is a plain-object lookup, so a name ending in `.constructor` yields an inherited function. The throw lands inside `handleVisionCommand`'s try and returns an `SK_VISION_ERROR` line, no crash. Deferred (decision 10). |
| F-24 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:243` | P2 | instance-only | Closed | Luna's fix review: the mime fallback read only `file.name`. Batch 5 reads the URI too, ignoring a query or fragment; tests for `/tmp/shot.png` and `file:///tmp/a.jpg?x=1`. |
| F-25 | `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts:366` | P2 | instance-only | Closed | Luna's fix review: the hook's catch read `.message` from a non-Error, so a `null` rejection made the fail-open hook reject under `SK_VISION_DEBUG=1`. Batch 5 stringifies it; a test covers the `null` rejection. |
| F-26 | `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs:217` | P2 | matrix/evidence | Closed | The plan's parser cases (a bare binary name, a path containing `1.`) were not pinned by any test. Batch 6 adds them for all three parser copies (decision 10). |

## Results after the fixes

Every suite exits 0 at or above its baseline (`scratch/suites-after/`): plugin 355, guard node 29, guard vitest 106, shared hooks 57, classifier 90, config shape 2, gate-3 17, doctor 7 suites with node:test 383, sk-vision 46, deep-loop 2742 passed and 8 skipped. The drift guards exit 0 twice in a row, `all 4 guards PASSED, 10 non-blocking warning(s)`, the same warnings as before (`scratch/gates/drift-after.txt`). The hygiene check exits 0 on all 73 code files it reads (`scratch/gates/hygiene-after.txt`). The battery for both families passes every leg, 16 of 16 plugins loaded on v1 and active on v2 (`scratch/gates/battery-both.json`). Each changed test file also passes under `env -i` (`scratch/gates/hostile-env.txt`, CHK-FIX-006). The pre-fix copies are removed at closeout, and the pinned range is `git diff 23756e8776` against the phase commit (decision 12).

## Inventories

The same-class producer and consumer `rg` output for each class with a P0 or P1 row is in `scratch/inventories.txt` (T011, CHK-FIX-002, CHK-FIX-003).

## Dispatch log

| Run | Executor | Result |
|-----|----------|--------|
| p009-rev-plugins | DeepSeek | PASS, 8 P2 (`scratch/review-plugins-deepseek.txt`) |
| p009-rev-runtime | DeepSeek | FAIL, 1 P1 and 6 P2 (`scratch/review-runtime-deepseek.txt`) |
| p009-rev-vision | DeepSeek | FAIL, 2 P1 and 2 P2 (`scratch/review-vision-deepseek.txt`) |
| p009-rev-luna | Luna | FAIL, 1 P1 and 2 P2 (`scratch/review-luna.txt`) |
| p009-fix-b1 | DeepSeek | F-03 fixed; orchestrator rerun 93 of 93 |
| p009-fix-b2 | DeepSeek | F-01 and F-18 fixed; orchestrator rerun 355 of 355 |
| p009-fix-b3 | DeepSeek | F-02 fixed in its four files, then SCOPE_CONFLICT on the census row, which the orchestrator changed (decision 7); rerun 59 of 59 |
| p009-fix-b4 | DeepSeek | F-04, F-05 and F-22; orchestrator rerun 43 of 43, tsc and build exit 0 |
| p009-fix-review | Luna | FAIL: F-05 still open on the no-template path, two P2s (`scratch/review-fix-luna.txt`) |
| p009-fix-b5 | DeepSeek | F-05, F-24 and F-25 fixed; orchestrator rerun 46 of 46 |
| p009-fix-verify | Luna | PASS, no open P0 or P1 (`scratch/review-fix-verify-luna.txt`) |
| p009-fix-b6 | DeepSeek | F-26, tests only; orchestrator rerun 28 of 28 and 106 of 106 |

No dispatch failed, so no retry was needed (CHK-023).
