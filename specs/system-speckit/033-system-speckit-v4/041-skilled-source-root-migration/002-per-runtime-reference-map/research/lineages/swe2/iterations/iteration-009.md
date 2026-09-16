# Iteration 9 — Map C final sweep: `opencode:*` areas (306) + `root` (8) + `ci` (21) = 335

**Run:** 9 | **Focus:** every remaining `.opencode` area — canonical commands/agents/hooks/plugins/bin/scripts/install-guides/logs/package-lock, root documents & config, CI. Full tables in `working/map-c--{opencode_*,root,ci}--*.md`; reproduced below.

## Reconciliation

| area | files | seed |
|---|---|---|
| opencode:commands | 148 | 148 ✓ |
| opencode:hooks | 54 | 54 ✓ |
| opencode:plugins | 30 | 30 ✓ |
| opencode:bin | 29 | 29 ✓ |
| opencode:scripts | 25 | 25 ✓ |
| opencode:agents | 13 | 13 ✓ |
| opencode:skills | 3 | 3 ✓ |
| opencode:install-guides | 2 | 2 ✓ |
| opencode:logs | 1 | 1 ✓ |
| opencode:package-lock.json | 1 | 1 ✓ |
| root | 8 | 8 ✓ |
| ci | 21 | 21 ✓ |
| **iter total** | **335** | **335** ✓ |

Classes: `mechanical` 294 · `manual` 33 · `regenerate` 8.

**Map C COMPLETE: 4027 / 4027** (seed 4258 − 231 `runtime:*` rows owned by Map B). Grand totals: `mechanical` 2985 · `freeze` 970 · `manual` 63 · `regenerate` 9 · `none` 0 · `blocker` 0.

## Key findings

1. **`check-no-spec-imports.cjs` is the `.opencode/specs` compat guard** — :26 documents `specs/ is the canonical physical tree; .opencode/specs is a compat symlink`; :32,:95 guard the boundary. This file exists *because of* the compat layer → `manual` (it defines the compat contract).
2. **The seven installed git hooks** (`scripts/git-hooks/{pre-commit,pre-push,commit-msg,post-commit,post-merge,post-rewrite,prepare-commit-msg}` — extensionless, previously mis-sorted as mechanical) + `lib/autostash-orphan-guard.sh` + `hooks/git/pre-commit` (legacy shim, self-describes: "The installed Git hook is .opencode/scripts/git-hooks/pre-commit") + `hooks/git-hooks-check/{claude,codex,cursor,devin}/check-git-hooks.sh` — all carry `$REPO_ROOT/.opencode/...` exec constants + self-disengage guards → `manual`.
3. **`launchagents/com.michelkerkmeester.orphan-sweep.plist:31`** embeds an *absolute* path `…/Public/.opencode/scripts/orphan-mcp-sweeper.sh` — machine-local installed config → `manual` (reinstall on host; ties to the Map B home-level blockers).
4. **All 19 CI workflows → `manual`**: path filters and missing-guard skips scope on `.opencode` — silent-skip risk confirmed in phase-001.
5. **`root` split**: `AGENTS.md` (contract; rewrite + regenerate downstream `sync-gate1-pointers.cjs` blocks) and `PUBLIC-RELEASE.md` (published external promise) and `opencode.json` (the runtime's own namespace) → `manual`; `README.md`, `CONTRIBUTING.md`, `.gitignore`, `.utcp_config.json`, `.env.example` → `mechanical`.
6. **`plugins/*.js` all mechanical** — every ref is a `join(projectDir, '.opencode', …)` constant (log paths, `install-codex-hooks.mjs` invocation in `codex-hooks-watchdog.js:79`, `cli-dispatch-audit.js:80` SKILL.md reads).
7. **`regenerate` (8)**: `commands/deep/assets/compiled/*` (4 contract files + README — `compile-command-contracts.cjs`), `package-lock.json`, `logs/README.md`, `skills/.state/{advisor,smart-router-telemetry}/README.md`.
8. **`opencode:commands` (148)** — canonical command docs/YAML/txt/py/sh incl. `doctor` (33) & `create` (49) assets; `commands/scripts/validate-command-references.cjs` mechanical.

## Classifier fix applied this iteration

`MANUAL_PAT` moved global (post-tests) so extensionless hook entrypoints and `hooks/git*`, `launchagents`, `check-no-spec-imports` classify correctly; rerun over all prior areas — 3 spec-kit contract docs flipped mech→manual (patched into iteration-005's embedded tables).

## Full tables

## opencode:agents / README.txt — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/README.txt` | :11 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
## opencode:agents / ai-council.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/ai-council.md` | :25,35,125,128,422,644,664,697 (+13) | documentation (3 fenced (runnable); 18 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / code.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/code.md` | :25,29,42,44,65,72,382,450 (+6) | documentation (14 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / context.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/context.md` | :27,71,75,167,190,428,429,430 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / debug.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/debug.md` | :25,356,657,658,659,660 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / deep-improvement.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/deep-improvement.md` | :27,84,244,245,246,247,248 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / deep-research.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/deep-research.md` | :25,109,279,352,576,577,578,579 | documentation (1 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / deep-review.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/deep-review.md` | :24,188,241,278,291,292,293,310 (+8) | documentation (1 fenced (runnable); 15 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / design.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/design.md` | :25,94,104,120,131,133,135,236 (+6) | documentation (14 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / markdown.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/markdown.md` | :25,138,193,194,195,196,197,198 (+16) | documentation (24 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / orchestrate.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/orchestrate.md` | :31,33,156,163,164,165,166,167 (+20) | documentation (3 fenced (runnable); 25 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / prompt-improver.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/prompt-improver.md` | :29,100,101,121,179,384,385,386 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:agents / review.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/agents/review.md` | :25,98,469,470,471,472,473 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:bin / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/README.md` | :26,112,153,154,155,158,159,160 (+24) | documentation (15 fenced (runnable); 17 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:bin / check-git-hooks.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/check-git-hooks.sh` | :9,20,38,40,50,109,131,132 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:bin / check-no-spec-imports.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/check-no-spec-imports.cjs` | :4,10,26,32,36,95,116,122 (+1) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:bin / compiled-route-guard.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/compiled-route-guard.cjs` | :38,43 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / compiled-route-status.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/compiled-route-status.cjs` | :47,189 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / compiled-route-sync.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/compiled-route-sync.cjs` | :21,38,48,723,732,733,1030 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / compiled-routing-foundation.vitest.ts — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/compiled-routing-foundation.vitest.ts` | :8,50,259,270 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
## opencode:bin / git-live-follow.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/git-live-follow.sh` | :34,158,160,172,174 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / git-primary-reconcile.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/git-primary-reconcile.sh` | :125,160 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / git-sync.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/git-sync.sh` | :84,88,246 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / hf-model-server.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/hf-model-server.cjs` | :75 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / install-codex-hooks.mjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/install-codex-hooks.mjs` | :9,102,105,107 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:bin / lib — 10 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/lib/README.md` | :153,154,155,156 | documentation (4 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/bin/lib/compiled-route-manifest.cjs` | :503 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs` | :36,44 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs` | :44,52 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs` | :30,38 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | :41,51 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs` | :34,42 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json` | :4 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | :98 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/bin/lib/model-server-supervision.cjs` | :23,1054 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / mcp-code-mode-launcher.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/mcp-code-mode-launcher.cjs` | :22 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:bin / relink-local-specs.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/relink-local-specs.sh` | :17 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:bin / system-skill-advisor-launcher.cjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/system-skill-advisor-launcher.cjs` | :24 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / tests — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/tests/compiled-route-manifest.test.cjs` | :41,42,43,44,162,474,505,651 (+1) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/bin/tests/fixtures/no-spec-import/negative/clean-runtime.cjs` | :5 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
## opencode:bin / worktree-guard.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/worktree-guard.sh` | :13,26,27,48 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:bin / worktree-session.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/bin/worktree-session.sh` | :82,83,84,85,86,87,225 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:commands / README.txt — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/README.txt` | :246 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
## opencode:commands / agent-router.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/agent-router.md` | :93 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / create — 49 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/create/README.txt` | :136,200,202 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/agent.md` | :24,25,26,35,48,49,55 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/assets/create-agent-auto.yaml` | :45,166,169,170,173,174,175,257 (+6) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-agent-confirm.yaml` | :46,167,170,171,174,175,176,204 (+8) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-agent-presentation.txt` | :60 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-benchmark-auto.yaml` | :139,171,172,173,174,175,176,177 (+7) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-benchmark-confirm.yaml` | :114,174,206,207,208,209,210,211 (+7) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-benchmark-presentation.txt` | :45,49,50,51,66,97 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-changelog-auto.yaml` | :44,147,183,187,195,196,197,206 (+15) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-changelog-confirm.yaml` | :44,147,179,183,191,192,193,202 (+14) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-command-auto.yaml` | :46,47,48,80,138,167,168,174 (+12) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-command-confirm.yaml` | :47,48,49,81,139,168,169,175 (+8) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-command-presentation.txt` | :13,14,15,16,17,62,76 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-diff-auto.yaml` | :157,158,185,188,189,192,193,194 (+20) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-diff-confirm.yaml` | :157,158,185,188,189,192,193,194 (+20) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-diff-presentation.txt` | :13,14,15,16,38,41,159 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-auto.yaml` | :45,124,144,145,146,149,150,153 (+10) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-confirm.yaml` | :45,113,159,179,180,181,184,185 (+10) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-feature-catalog-presentation.txt` | :46,47,61 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-auto.yaml` | :45,124,144,145,146,149,150,153 (+10) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-confirm.yaml` | :45,138,158,159,160,163,164,167 (+10) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-manual-testing-playbook-presentation.txt` | :46,47,61 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-readme-auto.yaml` | :37,83,283,432,433,434,435,633 (+13) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-readme-confirm.yaml` | :9,40,78,236,385,386,387,388 (+15) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-readme-presentation.txt` | :52,91 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-repo-rule-auto.yaml` | :23,25,26,27,28,30,31 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-repo-rule-confirm.yaml` | :36,38,39,40,41,43,44 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-auto.yaml` | :48,113,189,190,191,192,193,213 (+21) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-confirm.yaml` | :48,117,158,205,206,207,208,209 (+22) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-auto.yaml` | :45,128,222,224,225,226,227,230 (+21) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-confirm.yaml` | :45,113,163,257,259,260,261,262 (+20) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-parent-presentation.txt` | :46,47,61,162,163,164 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-skill-presentation.txt` | :44,59,149,150,151 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-with-human-voice-auto.yaml` | :23,24,26,27,29,31,111,175 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml` | :36,37,39,40,42,44,124,189 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json` | :62,65,87,98 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/commands/create/assets/tests/test_emitted_name_contract.py` | :8 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/commands/create/assets/tests/test_skill_parent_router_parity.py` | :15,48,49,50,51 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/commands/create/benchmark.md` | :24,25,26,35,50,51,57 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/changelog.md` | :24,25,26,35,48,49,55 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/command.md` | :24,25,26,35,48,49,55 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/diff.md` | :24,25,26,35,48,49,55 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/feature-catalog.md` | :24,25,26,35,49,50,56 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/manual-testing-playbook.md` | :24,25,26,35,49,50,56 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/readme.md` | :24,25,26,35,49,50,56 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/repo-rule.md` | :25,26,27,28,47,48 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/skill-parent.md` | :31,32,33,42,56,57,63,99 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/skill.md` | :24,25,26,35,49,50,56 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/create/with-human-voice.md` | :15,25,26,27,28,29,48,49 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / deep — 28 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/deep/agent-improvement.md` | :75,76,77,86,88,90,100,101 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/ai-council.md` | :60,61,62,100,101,107 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/assets/compiled/README.md` | :19,67,108 | compiled command contract | generated — `compile-command-contracts.cjs` | regenerate | regenerate |
| `.opencode/commands/deep/assets/compiled/deep-ai-council.contract.md` | :6,9,14,19,24,29,34,39 (+64) | compiled command contract | generated — `compile-command-contracts.cjs` | regenerate | regenerate |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | :6,9,14,19,24,29,34,39 (+44) | compiled command contract | generated — `compile-command-contracts.cjs` | regenerate | regenerate |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | :6,9,14,19,24,29,34,39 (+43) | compiled command contract | generated — `compile-command-contracts.cjs` | regenerate | regenerate |
| `.opencode/commands/deep/assets/deep-agent-improvement-auto.yaml` | :37,59,74,88,90,91,92,93 (+32) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-agent-improvement-confirm.yaml` | :38,60,75,94,96,97,98,99 (+33) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` | :17,21,36,76,83,92,98,110 (+17) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` | :40,41,48,50,51,52,54,55 (+14) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` | :40,41,48,50,51,52,54,55 (+13) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` | :15,19,41,118,121,132,133,149 (+7) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml` | :38,52,80,94,96,97,99,100 (+21) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-confirm.yaml` | :38,52,80,99,101,102,104,105 (+24) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt` | :15,19,33,40,51,54,97,149 (+22) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | :11,63,64,77,79,80,81,82 (+80) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | :79,80,93,95,96,97,98,100 (+49) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | :15,19,39,95,127,131,134,146 (+9) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | :54,55,68,70,71,72,74,75 (+75) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | :53,54,67,69,70,71,73,74 (+52) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | :15,19,36,43,119,153,157,160 (+11) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/deep/assets/legacy/README.md` | :19,98,99,100,108,111 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/assets/legacy/deep-ai-council.body.md` | :37,38,39,60,61,67 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/assets/legacy/deep-research.body.md` | :44,54,55,56,66,68,93,94 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/assets/legacy/deep-review.body.md` | :27,28,29,58,59,65 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/model-benchmark.md` | :83,84,85,94,96,124,125,131 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/research.md` | :52,76,77,78,86,88,138,139 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/deep/review.md` | :49,50,51,104,105,111 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / design — 12 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/design/assets/chart-auto.yaml` | :24,26,27,28,30,31,33,123 (+1) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/chart-confirm.yaml` | :37,39,40,41,43,44,46,136 (+1) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/chart-presentation.txt` | :12,13,14,15,16,17,38,39 (+2) | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/diagram-auto.yaml` | :182,210,213,214,215,218,219,220 (+14) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/diagram-confirm.yaml` | :150,178,180,181,182,184,185,186 (+14) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/diagram-presentation.txt` | :13,14,15,16,17,40,41,42 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/extract-auto.yaml` | :149,150,154,159,163,183,203,238 (+1) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/extract-confirm.yaml` | :29,160,161,165,170,174,178,198 (+3) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/design/assets/extract-presentation.txt` | :38 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/design/chart.md` | :25,26,27,28,39,52,53,59 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/design/diagram.md` | :24,25,26,35,50,51,57 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/design/extract.md` | :9,12,60,61,62,63,96,97 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / doctor — 33 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/doctor/_routes.yaml` | :5,6,10,11,41,42,56,71 (+28) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-deep-loop.yaml` | :83,84,85,86,94,95,96,97 (+3) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-embeddings.yaml` | :21,40,49 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-fable-mode.yaml` | :7,34,35,36 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-debug.yaml` | :42,44,45,89,106,109,122,126 (+5) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` | :43,45,92,101,127,132,135,140 (+4) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-mcp-presentation.txt` | :50,54 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-parent-skill.yaml` | :59,60,61,75 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-router-reach.yaml` | :52,53,54,55,70 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | :5,7,34,35,36,37,38,39 (+71) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml` | :35,76,77,78,80,81,90,203 (+6) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-budget.yaml` | :36,37,39,40 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | :43,44,45,46 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt` | :104,142,146,200 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` | :23,29,30,31,33,36,70,74 (+11) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-update-presentation.txt` | :104,105,135,155,166 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/assets/doctor-update.yaml` | :21,22,104,105,106,107,108,109 (+44) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/doctor/mcp.md` | :24,25,26,44,49,50,62 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/scripts/README.md` | :19,28,85,91,100,101,102,103 (+13) | documentation (13 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | :37 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | :11,12,13,29,155,183,218,423 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/check-mcp-mutation-class.sh` | :14,19,44,87 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | :8,45,51,305,316,319 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` | :24,26,44,125,136,138,144,148 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh` | :158 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | :9,43,141,143,144 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | :43,49,86,91,100,583 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.py` | :8,60,61,65,148,154 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/route-validate.sh` | :5,17,18,107 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/skill-graph-freshness.cjs` | :28,29,30 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs` | :31,34,35,38 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/commands/doctor/speckit.md` | :24,25,48,49,50,51,52,53 (+8) | documentation (16 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/doctor/update.md` | :24,25,45,50,58 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / goal-opencode.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/goal-opencode.md` | :37 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / prompt — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/prompt/assets/prompt_improve_auto.yaml` | :7,24,32,34,42,79,114,115 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/prompt/assets/prompt_improve_confirm.yaml` | :7,25,33,35,43,100,134,135 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/prompt/assets/prompt_improve_presentation.txt` | :59,159 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/prompt/improve.md` | :43,44,45,63,64,70 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / rewrite — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/rewrite/response-by-external-agent.md` | :139,140,141,149,154,168,252 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/rewrite/response.md` | :74,75,76 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:commands / scripts — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/scripts/README.md` | :19,28,64,88,94,100,110 | documentation (5 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/scripts/fixtures/README.md` | :19,86 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/scripts/fixtures/broken-command-refs.yaml` | :17,19,26 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/scripts/validate-command-references.cjs` | :13,42,46,52,65,69,169,186 (+6) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:commands / speckit — 13 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/commands/speckit/README.txt` | :53,54,58,142,268,278,360 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-complete.yaml` | :7,48,137,145,156,197,248,258 (+57) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-implement.yaml` | :31,51,102,155,165,171,189,190 (+25) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-plan.yaml` | :7,44,71,79,90,139,190,200 (+35) | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml` | :57,58,72,75,78,111,149,171 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml` | :57,58,72,75,78,115,168,214 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/assets/speckit-save-context-tail.yaml` | :12,16,18 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
| `.opencode/commands/speckit/complete.md` | :23,24,25,61,62,63,88 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/speckit/implement.md` | :23,24,25,58,59,60,79 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/speckit/plan.md` | :23,24,25,67,68,69,84,93 | documentation (1 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/speckit/resume.md` | :23,24,25,43,44,50 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/speckit/save.md` | :19,20,34,61,68,69,78 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/commands/speckit/search.md` | :37,38,51,77,101,104,126 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/README.md` | :22,26,74,102,147,153,182,185 (+12) | documentation (7 fenced (runnable); 13 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / codex-watchdog — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/codex-watchdog/README.md` | :29,30,33,44,51,68,69,83 (+3) | documentation (4 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / completion — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/completion/README.md` | :22,43,69,70,74,104,105,124 (+4) | documentation (3 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / directive-lifecycle — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/directive-lifecycle/README.md` | :45,83,104,126,134,143 | documentation (3 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / dispatch — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/dispatch/README.md` | :52,73,77,95,112,126,144,145 (+1) | documentation (4 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs` | :26,70 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | :63 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs` | :26 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs` | :66 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | :574 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | :110,111,112,113,119,128 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/hooks/dispatch/pi/dispatch-audit.ts` | :7,27 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | :7,198,199,203,204,264 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:hooks / dist-freshness — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/dist-freshness/README.md` | :22,43,64,71,93,94,95,96 (+5) | documentation (3 fenced (runnable); 10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / git-hooks-check — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/git-hooks-check/README.md` | :18,22,31,44,57,64,85,86 (+5) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:hooks / git-primary-reconcile — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/git-primary-reconcile/README.md` | :22,53,70,74,94,95,96,114 (+3) | documentation (2 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / git-worktree-guard — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/git-worktree-guard/README.md` | :22,36,47,54,75,76,77,93 (+4) | documentation (4 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / git — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/git/README.md` | :16,18,29,37,44,57,91,110 (+1) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/hooks/git/install-hooks.sh` | :7,12,15 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/hooks/git/pre-commit` | :3,5,8,12,13,39,45,48 (+1) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:hooks / goal — 11 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/goal/README.md` | :24,34,48,80,86,122,137,158 (+9) | documentation (10 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` | :7,215 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | :87 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/goal/devin/goal-inject.mjs` | :73 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/goal/goal-plugin.md` | :31,32,33,34,35,45,117,121 (+13) | documentation (9 fenced (runnable); 12 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/goal/lib/goal-core.cjs` | :43,154 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | :8,203,220,229,230,969 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/hooks/goal/lib/goal-slice.cjs` | :26,220 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | :201 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/hooks/goal/pi/goal-context.ts` | :20,21 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/goal/pi/goal-pi.test.mjs` | :411 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
## opencode:hooks / hook-flags.env.example — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/hook-flags.env.example` | :3,10,11 | example content naming `.opencode` | authored | mechanical rewrite | mechanical |
## opencode:hooks / hook-install — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/hook-install/README.md` | :22,32,41,66,86,87,89,113 (+5) | documentation (3 fenced (runnable); 10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / injection-contract.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/injection-contract.md` | :64,65,101,116,139,166,174,179 (+4) | documentation (12 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / mcp-route-guard — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/mcp-route-guard/README.md` | :57,61,92,106,124,130 | documentation (2 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs` | :37 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | :6,17 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:hooks / permission-policy — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/permission-policy/README.md` | :87,102,123,131,138 | documentation (3 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / post-edit-quality — 6 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/post-edit-quality/README.md` | :33,50,52,71,75,90,105,119 (+2) | documentation (4 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | :23,64 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/post-edit-quality/codex/post-edit-quality.cjs` | :78 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/post-edit-quality/devin/post-edit-quality.cjs` | :63 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | :36,37,38,39,40,41,196,215 (+1) | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/post-edit-quality/pi/post-edit-quality.ts` | :8,30 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:hooks / session-cleanup — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/session-cleanup/README.md` | :20,21,63,88,89,90,91,108 (+4) | documentation (3 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / session-lifecycle — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/session-lifecycle/README.md` | :80,114,135,141,147 | documentation (3 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:hooks / shared — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/shared/README.md` | :15,89,120,128 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/shared/hook-adapter-shared.cjs` | :5 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/shared/hook-flags.sh` | :3,15 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:hooks / task-dispatch — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/task-dispatch/README.md` | :18,62,68,83,97,116,125,134 (+1) | documentation (3 fenced (runnable); 6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs` | :42 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | :41,42 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/hooks/task-dispatch/pi/task-dispatch-guard.ts` | :8,16 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:hooks / vitest.config.ts — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/hooks/vitest.config.ts` | :10,19 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:install-guides / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/install-guides/README.md` | :77,108,139,174,257,275,317,342 (+73) | documentation (40 fenced (runnable); 41 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:install-guides / install-scripts — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/install-guides/install-scripts/README.md` | :36,48,54 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:logs / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/logs/README.md` | :16,30,31,32,33,46,52 | logs tree doc/state | derived/runtime output | regenerate or leave (runtime output dir) | regenerate |
## opencode:package-lock.json / (root) — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/package-lock.json` | :2,3 | lockfile names `.opencode`-scoped deps | generated — `npm install` | regenerate | regenerate |
## opencode:plugins / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/README.md` | :3,16,102,135,141 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:plugins / cli-dispatch-audit.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/cli-dispatch-audit.js` | :27,57,80 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / codex-hooks-watchdog.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/codex-hooks-watchdog.js` | :23,79,87 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / lib — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/lib/opencode-message-identity.js` | :23 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / mcp-route-guard.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/mcp-route-guard.js` | :33 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / session-cleanup.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/session-cleanup.js` | :31,32,34,35,36,38 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / sk-code-post-edit-quality.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/sk-code-post-edit-quality.js` | :33 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / sk-git-preflight-advisory.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/sk-git-preflight-advisory.js` | :88 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-completion-sentinel.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-completion-sentinel.js` | :23 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-deep-loop-guard.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-deep-loop-guard.js` | :25 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-dist-freshness-guard.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-dist-freshness-guard.js` | :35 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-skill-advisor.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-skill-advisor.js` | :184 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-spec-gate.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-spec-gate.js` | :24,288 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / system-speckit-completion.js — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/system-speckit-completion.js` | :23 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:plugins / tests — 16 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/plugins/tests/README.md` | :16,118,126 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` | :25,38,60,217,374 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | :25,26,27,28,29,30,31,35 (+13) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/helpers/README.md` | :15,76,77,78,79,85 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/opencode-goal-capabilities.test.cjs` | :52,63 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | :925,933,1009,1016 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/opencode-goal-state.test.cjs` | :71,327,338,342,355,754,779 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/opencode-goal-supervisor.test.cjs` | :123,272 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs` | :77,86,92,102,107,108,134 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/session-cleanup.test.cjs` | :23,24,25,26,27 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | :30,101,108,111,127,137,140,145 (+6) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/sk-communication-projection.test.cjs` | :36 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/system-deep-loop-guard.test.cjs` | :23,26,48,154,338,356 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` | :18,52,73,289,364,394,395 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | :19,22,29,38,196,197,198,432 (+1) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/plugins/tests/system-spec-gate.test.cjs` | :294 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
## opencode:scripts / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/README.md` | :16,49,50,51,52,53,54,60 | documentation (7 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## opencode:scripts / check-vendored-fork-provenance.mjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/check-vendored-fork-provenance.mjs` | :7 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:scripts / copy-skill-advisor-dist-data.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/copy-skill-advisor-dist-data.sh` | :10,25,26 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:scripts / git-hooks — 17 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/git-hooks/README.md` | :20,84,85,86,103,106,141,150 (+9) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/commit-msg` | :5 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/lib/README.md` | :27,50,51,57 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` | :34,38 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/post-commit` | :7,8,20,22,37,41,54 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/post-merge` | :8,9,18,20 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/post-rewrite` | :9,10,19,21 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/pre-commit` | :9,17,20,44,45,50,81,88 (+35) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/pre-push` | :23,24,37,50,114,121,152,183 (+11) | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | :16,17,47 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
| `.opencode/scripts/git-hooks/tests/README.md` | :41,42,43,44,45,46,47 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` | :43,44,45,46,47,48 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` | :20 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | :15,41,42,43,47 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` | :24,35,45,47,52,54,62,67 (+17) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/pre-push.test.sh` | :19,20,38,39,40,41,71,72 (+6) | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh` | :24,25,26,47,48,309 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
## opencode:scripts / install-git-hooks.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/install-git-hooks.sh` | :2,5,6,7,15,30 | constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook) | authored | decide the contract (compat vs rename) then rewrite; gates self-disengage if missed | manual |
## opencode:scripts / launchagents — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/launchagents/README.md` | :41,55,80,86 | machine-local launchd config embedding an absolute `.opencode` path | authored machine config | manual — absolute path won't update itself; reinstall on the host | manual |
| `.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | :12,31 | machine-local launchd config embedding an absolute `.opencode` path | authored machine config | manual — absolute path won't update itself; reinstall on the host | manual |
## opencode:scripts / run-node-tests.mjs — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/run-node-tests.mjs` | :11,23,110,114,138,140,141 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:scripts / session-cleanup.sh — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/scripts/session-cleanup.sh` | :33,34 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## opencode:skills / .state — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/.state/advisor/README.md` | :21 | derived state dir doc | derived state | regenerates with state; doc refs mechanical | regenerate |
| `.opencode/skills/.state/smart-router-telemetry/README.md` | :21,75,88 | derived state dir doc | derived state | regenerates with state; doc refs mechanical | regenerate |
## opencode:skills / README.txt — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/README.txt` | :31,97,105,111,124,141,153 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
## root / .env.example — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.env.example` | :19,212 | example content naming `.opencode` | authored | mechanical rewrite | mechanical |
## root / .gitignore — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.gitignore` | :7,8,10,52,63,64,65,66 (+54) | .gitignore content naming `.opencode` | authored | mechanical rewrite | mechanical |
## root / .utcp_config.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.utcp_config.json` | :147 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## root / AGENTS.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `AGENTS.md` | :47,65,80,81,174,203,269,277 (+1) | root behavior contract; Gate-1 lookup + rules name `.opencode` paths | authored contract | rewrite + regenerate downstream pointer blocks (`sync-gate1-pointers.cjs`) | manual |
## root / CONTRIBUTING.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `CONTRIBUTING.md` | :37,45,48 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## root / PUBLIC-RELEASE.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `PUBLIC-RELEASE.md` | :3,12,22,23,32,36,55,56 (+25) | published external contract — documents consumers symlinking `.opencode` | authored contract | a published promise; rewriting changes what other repos were told | manual |
## root / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `README.md` | :104,105,106,116,131,156,175,180 (+44) | documentation (5 fenced (runnable); 47 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## root / opencode.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `opencode.json` | :15 | opencode project config — plugin/provider paths name `.opencode` | authored config | the runtime's own project namespace; decide compat vs rename | manual |
## ci / dependabot.yml — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.github/dependabot.yml` | :13 | command/asset YAML naming `.opencode` | authored config | mechanical rewrite | mechanical |
## ci / workflows — 20 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.github/workflows/README.md` | :30 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.github/workflows/advisory-checks.yml` | :30,41 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/agent-mirror-sync.yml` | :17 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/changed-packet-validation.yml` | :37,38,39,99,132,141,154 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/chart-corpus.yml` | :7,11,36,43 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/command-tree-parity.yml` | :29,33 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/comment-hygiene.yml` | :17,41 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/diagram-corpus.yml` | :7,11,36,47,58 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/dispatch-enforcement-guard.yml` | :31,44,45 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/markdown-link-integrity.yml` | :7,8,9,29 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/naming-standard-guard.yml` | :45,51,52 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/playbook-operator-contract.yml` | :28,29,32,42,43,61,68,73 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/prompt-card-sync.yml` | :15 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/repo-rules-corpus.yml` | :8,24 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/routing-registry-drift.yml` | :17,26,27,28,29,30,31,32 (+46) | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/rule-canary-sync.yml` | :17 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/runtime-no-spec-import.yml` | :7,13,18,22,35,37,42 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/skill-doc-frontmatter.yml` | :8,9,20 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/spec-kit-check.yml` | :7,13,14,15,24,30,31,32 (+25) | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
| `.github/workflows/strict-pass-freshness-report.yml` | :43,44,45,56,57,94 | CI workflow — path filters/guard skips scope on `.opencode` | authored CI | filters must see `.skilled` too, or guards skip silently | manual |
