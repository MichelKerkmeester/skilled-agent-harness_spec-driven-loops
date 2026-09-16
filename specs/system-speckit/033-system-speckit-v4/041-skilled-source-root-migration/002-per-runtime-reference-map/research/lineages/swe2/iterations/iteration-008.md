# Iteration 8 — Map C: `mcp-tooling` (185) + `sk-design` (108) + `sk-vision` (68) + `sk-git` (60) + `sk-prompt` (55) + `mcp-code-mode` (43) + `sk-communication` (33)

**Run:** 8 | **Focus:** Map C for the six remaining skill areas — all doc-dominated with small code surfaces. Full tables in `working/map-c--skill_*--*.md`; reproduced below.

## Reconciliation

| area | files | seed |
|---|---|---|
| skill:mcp-tooling | 185 | 185 ✓ |
| skill:sk-design | 108 | 108 ✓ |
| skill:sk-vision | 68 | 68 ✓ |
| skill:sk-git | 60 | 60 ✓ |
| skill:sk-prompt | 55 | 55 ✓ |
| skill:mcp-code-mode | 43 | 43 ✓ |
| skill:sk-communication | 33 | 33 ✓ |
| **iter total** | **552** | **552** ✓ |

Classes: `mechanical` 412 · `freeze` 140. Cumulative Map C: **3692 / 4258**.

## Key findings

1. **No contract-bearing code in any of the six.** All code refs are constants: `mcp-code-mode/scripts/install.sh:121-122` (`node-engine-resolver.cjs`, `mcp-server/package.json`), `mcp-tooling/mcp-*/scripts/install.sh` (snippet printers — verified they do not write config), `sk-git/scripts/hooks/git-preflight-advisory.mjs`, `sk-vision/hooks/pi/sk-vision.ts`, `sk-design-md-generator/backend/scripts/*.ts`. All `mechanical`.
2. **`mcp-code-mode/scripts/install.sh` mutates the repo's own `opencode.json`** (:298-303) — edits the consumer config in place; still `mechanical` since `opencode.json` survives as the runtime's project config either way.
3. **sk-vision's runtime is a build artifact** — `vision-runtime/` ships `dist/`; only 1 tracked source names `.opencode` (`scripts/build.ts`, `mechanical`). The rule `.cursor/rules/sk-vision.md` that invokes `vision-cli.js` under `.opencode` was mapped in iter-2/B.
4. **sk-git's hook scripts** (`git-preflight-advisory.{mjs,ts}`, `advisory-noise-audit.mjs`, `worktree-naming.sh`) — `.opencode` constants inside hook code; registrations were Map B rows. `mechanical`.
5. **140 frozen rows**: nested `benchmark/reports/**` (mcp-tooling 20, sk-code n/a here, sk-prompt 13, sk-vision 32, sk-communication 3, sk-git 4) + changelogs.
6. **mcp-tooling's 10 `mcp-*` leaf packets** (aside-devtools 32, chrome-devtools 42, figma 14, magicpath 9, mobbin 15, notion 5, obsidian 8, refero 14, click-up 16) are doc+example shells — `mechanical`.

## Ruled out

- `vision-runtime/dist/` — build output, untracked; not in seed.
- `sk-design-diagram/scripts/tests/mutation-cases.cjs` — a test file under `scripts/tests/`, lands `mechanical` via the tests rule.

## Full tables — skill:mcp-tooling

## skill:mcp-tooling / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/README.md` | :141 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/SKILL.md` | :51 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / benchmark — 20 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/benchmark/README.md` | :44,46 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--live/source.md` | :9,10 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/2026-08-03--playbook-validation--router/source.md` | :9,10 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/README.md` | :27,28 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/baseline/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/baseline/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--unspecified/report.json` | :4,5 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--unspecified/report.md` | :7,9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | :4,29,55,85,88,89 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | :4,29,55,85,88,89 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:mcp-tooling / changelog — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/changelog/v1.0.0.0.md` | :3,25,29,32 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/changelog/v1.5.0.0.md` | :5 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/changelog/v1.6.1.0.md` | :38 | historical changelog record | authored history | none — frozen history | freeze |
## skill:mcp-tooling / feature-catalog — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` | :28,40,50,51,52,53,54,60 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/feature-catalog/feature-catalog.md` | :53 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md` | :46,47,48,54 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/graph-metadata.json` | :351,352,353,354,355,356,357,358 (+16) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:mcp-tooling / manual-testing-playbook — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md` | :13 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / mcp-aside-devtools — 32 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/INSTALL-GUIDE.md` | :83,165 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` | :182,184 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/direct-task.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/agent-task/session-continuation.md` | :83 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/cli-lifecycle/account-status.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/cli-lifecycle/help-fixture.md` | :83 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/cli-lifecycle/install-version.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/console-network-capture.md` | :82,83,84 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/cookies-storage.md` | :82,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/dom-query-inspection.md` | :82,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/navigation-multi-tab.md` | :82,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/performance-timing.md` | :82,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/devtools-parity/screenshot-pdf-capture.md` | :84,85 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-repl.md` | :79,80,81,82,83 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/holdout-troubleshoot.md` | :80,81,82,83,84 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/install.md` | :73,74,75,76 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/mcp.md` | :79,80,81,82,83,84 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/negative.md` | :76,77,78,79 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/repl.md` | :74,75,76,77,78 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/task.md` | :74,75,76,77,78 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :78,79,80,81,82 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/code-mode-discovery.md` | :86,87 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/mcp-handshake.md` | :45,81,82 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/tools-list-discovery.md` | :45,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/unbound-profile-error.md` | :82,83 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/console-probe.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/network-probe.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/recovery-and-failure/dead-mcp-process.md` | :89 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/recovery-and-failure/missing-binary.md` | :45,81 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/repl-evidence/repl-open-tab.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md` | :91 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md` | :140 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / mcp-chrome-devtools — 42 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md` | :957,958,959,960,961 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/README.md` | :220,221 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.0.0.md` | :34,35,36,37,38 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.1.0.md` | :34,35,36,37,38 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.10.0.md` | :29,30,31,32,33 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.11.0.md` | :23,24 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.2.0.md` | :26,27 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.7.0.md` | :18,19,20,21,22 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/v1.0.8.0.md` | :18,19 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/examples/README.md` | :344,345 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/install-version.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/session-start.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/session-stop.md` | :86 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/cli-bdg-lifecycle/status-json.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/console-and-network/console-list.md` | :84 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/console-and-network/cookies-retrieval.md` | :90 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/console-and-network/har-export.md` | :87 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/dom-and-screenshot/eval-javascript.md` | :86 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/dom-and-screenshot/query-selector.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/dom-and-screenshot/screenshot-capture.md` | :89 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/automation.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/cli.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/holdout-cli.md` | :59,60,61 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/holdout-troubleshoot.md` | :65,66,67 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/install.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/mcp.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/negative.md` | :57,58 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/mcp-parallel-instances/chrome-devtools-1-navigate.md` | :83,89,90 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/mcp-parallel-instances/close-and-select-page.md` | :87,93,94 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/mcp-parallel-instances/dual-instance-parallel.md` | :130,136,137 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/mcp-parallel-instances/multi-tab-same-instance.md` | :88,94,95 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/mcp-parallel-instances/page-context-isolation.md` | :90,96,97 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/protocol-discovery/describe-page-domain.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/protocol-discovery/list-cdp-domains.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/protocol-discovery/search-cdp-method.md` | :81 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/cleanup-leak.md` | :97 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/dead-session.md` | :97 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/invalid-url.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/manual-testing-playbook/recovery-and-failure/missing-browser.md` | :82 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/README.md` | :30,31 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh` | :394 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:mcp-tooling / mcp-click-up — 16 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md` | :19 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/README.md` | :58,186,208,226 | documentation (1 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md` | :275 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/examples/README.md` | :51,268,326,327,328 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/examples/task-queue-workflow.sh` | :41 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/examples/time-tracking-workflow.sh` | :44 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/cupt-daily.md` | :76,77,78,79 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-advanced.md` | :90,91,92,93 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-daily.md` | :88,89,90,91 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/install.md` | :78,79,80,81,82 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/mcp-advanced.md` | :77,78,79,80 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/negative.md` | :78,79,80,81 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :74,75,76,77,78 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md` | :250 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/scripts/README.md` | :30,31 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-click-up/scripts/install.sh` | :222,223 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:mcp-tooling / mcp-figma — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-figma/INSTALL-GUIDE.md` | :395,396,397,398,399,400 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/README.md` | :185,186 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/examples/README.md` | :47,120 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/examples/safe-connect-daemon-health.sh` | :43 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/connect-daemon.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/create-render.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/design-tokens.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/holdout-create.md` | :59,60,61 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/holdout-inspect.md` | :59,60,61 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/inspect-export.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/mcp-context.md` | :60,61,62 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/negative.md` | :57,58 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-figma/scripts/README.md` | :36,37 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / mcp-magicpath — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-magicpath/README.md` | :132,222,223 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` | :18,231,309,393 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/assets/utcp-magicpath-manual.md` | :35,47,85 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/changelog/v1.0.0.0.md` | :19 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-magicpath/changelog/v1.1.0.0.md` | :25,46,61 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-magicpath/feature-catalog/feature-catalog.md` | :20 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/credential-setup.md` | :39,49 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/design-authority.md` | :67 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/tool-surface.md` | :23 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / mcp-mobbin — 15 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-mobbin/INSTALL-GUIDE.md` | :107,113,208,209,210,211,212 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | :59,202,203,204,205,206 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/README.md` | :30 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/smoke-search-limit-1.md` | :15 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/discovery-setup/manual-registered-expected.md` | :49,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/apps.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/elements.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/flows.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/holdout-flows.md` | :64,65,66 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/holdout-screens.md` | :64,65,66 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/negative.md` | :57,58 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/screens.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/intra-routing-recall/wiring.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/limits-access/paid-gate-taxonomy.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-tooling / mcp-notion — 5 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-notion/INSTALL-GUIDE.md` | :19,37,43 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-notion/README.md` | :203,204 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-notion/examples/README.md` | :38 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/README.md` | :31,32 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-notion/scripts/install.sh` | :183,184 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:mcp-tooling / mcp-obsidian — 8 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-obsidian/INSTALL-GUIDE.md` | :19,49,50,62,112,210,213 | documentation (6 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | :63,197,198 | documentation (1 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | :399 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.8.0.0.md` | :15 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/README.md` | :52,247 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/mcp-verification/prerequisite-boundary.md` | :26,46,71 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/README.md` | :31,32,33 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/install.sh` | :237,238 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:mcp-tooling / mcp-refero — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-tooling/mcp-refero/INSTALL-GUIDE.md` | :102,108,201,202,203,204,205 | documentation (2 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/README.md` | :67,196,197,198,199,200 | documentation (1 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/examples/funnel-styles-screens-flows.md` | :22 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/examples/metadata-first-lookup.md` | :22 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/examples/screen-image-fetch.md` | :22 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/discovery-setup/manual-registered.md` | :49,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/flows.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/holdout-flows.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/holdout-styles.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/negative.md` | :57,58 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/screens.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/styles.md` | :57,58,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/troubleshoot.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-tooling/mcp-refero/manual-testing-playbook/intra-routing-recall/wiring.md` | :58,59,60 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |

---
## skill:sk-design / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/SKILL.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / command-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/command-metadata.json` | :24,30,36,60,66,72,95,101 (+1) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-design / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/graph-metadata.json` | :340,346 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-design / manual-testing-playbook — 5 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/manual-testing-playbook/holdout/flowchart-natural.md` | :73 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/manual-testing-playbook/holdout/ind-flowchart.md` | :70 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md` | :13,51,52 | documentation (2 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/manual-testing-playbook/resource-loading/assets-only.md` | :123 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | :134 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / sk-design-chart — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/sk-design-chart/README.md` | :109,110,111,113,114,115 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/changelog/v0.23.0.0.md` | :66 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/corpus-integrity/a-chart-that-draws-nothing.md` | :54,56,59 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/corpus-integrity/catalog-resolves-both-ways.md` | :50,51,53,54,56,57,58,59 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md` | :50,51,52,55,56,58,59,61 (+3) | documentation (11 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/a-delivery-on-a-dark-system.md` | :54,59,61,62,63,64 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/form-choice-and-the-diagram-boundary.md` | :50,51,52,55,56 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md` | :50,51,53,54,55,56,58 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/manual-testing-playbook.md` | :80,98,110 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/reading-the-chart/axis-ladder-fits-the-tallest-mark.md` | :54 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/reading-the-chart/headline-agrees-with-the-data.md` | :51,54 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/manual-testing-playbook/reading-the-chart/nothing-runs-past-the-drawing-edge.md` | :59 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md` | :23,164 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-chart/scripts/README.md` | :29,31,35,38,41 | documentation (5 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / sk-design-diagram — 45 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/sk-design-diagram/README.md` | :133 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--create-diagram-command/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--drawio-import/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--editorial-style-and-connectors/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--export-guidance/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--export-guidance/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--hub-registration/skill-benchmark-report.json` | :7,54,55,56 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--hub-registration/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--mermaid-import/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--mermaid-import/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--onboarding-flow/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--onboarding-flow/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--primitive-variants/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--primitive-variants/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--type-selection-and-routing/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-08-12--manual-testing-playbook--type-selection-and-routing/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/skill-benchmark-report.json` | :7,492 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-3/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-4/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/2026-09-11--manual-testing-playbook--capture-review/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/design-diagram-command.md` | :47,48,49,50,57 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/command-and-hub-integration/hub-registration.md` | :47,48,49,56,57 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/command-and-hub-integration/design-diagram-command.md` | :30,45,46,88,89,90,91 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/command-and-hub-integration/hub-registration.md` | :45,46,47,48,66,88,89,91 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md` | :50 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/type-selection-and-routing.md` | :65 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/import-export/drawio-import.md` | :46 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/import-export/mermaid-import.md` | :45 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md` | :58,85 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/references/design-md-theming.md` | :62,87,255 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md` | :174 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md` | :36 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/references/import-export/import-mermaid.md` | :36 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / sk-design-fundamentals — 15 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/sk-design-fundamentals/README.md` | :71,79,87,177,178,179 | documentation (3 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/benchmark/README.md` | :37 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/boundary/implementation-defers-to-sk-code.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/contrast-escape-hatches.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/project-system-precedence.md` | :52,73 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/shadow-system-consistency.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/routing/diagnose-entry.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/routing/motion-entry.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/routing/procedure-entry.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/routing/review-entry.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/no-runtime-shades.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/on-scale-values.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/value-discipline/unit-discipline.md` | :51,53,74 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / sk-design-md-generator — 23 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md` | :24,56,68,96,132 | documentation (5 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/README.md` | :70,80,91,156,178,179,180,181 (+1) | documentation (8 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/SKILL.md` | :277,281,284,287,290 | documentation (4 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/README.md` | :41,52,55,58,121,125,129 | documentation (7 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/cli.ts` | :15,16,17 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/extract.ts` | :213,218,267,274 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/scripts/output-policy.ts` | :30 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md` | :40,46 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/cluster/oklch-clustering.md` | :66,69 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/detectors/framework-icon-motion-detection.md` | :70,76 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/escalation/anti-bot-escalation.md` | :68,76 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/extract/live-extraction.md` | :49,70,77 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/guided-run/guided-run-smoke-lane.md` | :74,75,76,77,78 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/interaction/interaction-state-matrix.md` | :49,70,77 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/manual-testing-playbook.md` | :72,78,80,105,106,112,198,205 (+7) | documentation (15 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/report/report-generation.md` | :61,63,65,71 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/setup/tool-readiness.md` | :49,66,69,70,71,72,77 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/study/editorial-exemplar-study.md` | :73,75,76 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/manual-testing-playbook/validate/phantom-hex-detection.md` | :78,81,88 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/references/extraction-workflow.md` | :48,58,69 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/references/guided-run.md` | :63 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/styles/README.md` | :20,21 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/styles/lib/database/README.md` | :77,78,79,80,81 | documentation (5 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-design / tests — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/design-md-sample.html` | :10 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs` | :46 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/tests/guided-run.test.ts` | :10,12,13,19,25,31 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |

---
## skill:sk-vision / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/README.md` | :112,126,131,181,184,187,199 | documentation (3 fenced (runnable); 4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-vision / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/SKILL.md` | :208,287,290,309,315 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-vision / benchmark — 32 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/benchmark/README.md` | :53,54,61,82 | documentation (3 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.json` | :7,91 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--ocr-live-run/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/skill-benchmark-report.json` | :7,91 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-16--manual-testing-playbook--status-live-run/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-017-standalone/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-018-cursor-status/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/skill-benchmark-report.json` | :7,67,102 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-019-devin-status/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/skill-benchmark-report.json` | :7,81,128 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/skill-benchmark-report.json` | :7,81,128 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/skill-benchmark-report.json` | :7 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/skill-benchmark-report.md` | :24 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/source.md` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/benchmark/reports/supersession-manifest.json` | :5,11,17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-vision / changelog — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/changelog/v0.2.0.0.md` | :22,23,24,25,26,27,28,29 (+6) | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-vision/changelog/v0.3.0.0.md` | :30,31,32,33,34,35,36,37 (+9) | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-vision / feature-catalog — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md` | :248 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/devin-hook.md` | :50 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md` | :20,42 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-vision / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/graph-metadata.json` | :57,63 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-vision / hooks — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/hooks/README.md` | :9,14 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md` | :12 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/hooks/devin/vision-rule.md` | :20 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/hooks/pi/sk-vision.ts` | :20,21,22,23,24 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
## skill:sk-vision / manual-testing-playbook — 23 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/auto-inspect-guarantee.md` | :30 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/guaranteed-vision/classifier-and-env.md` | :38,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/devin-hook.md` | :37,90,93 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/opencode-plugin.md` | :37,49,50,88 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/opencode-vision-command.md` | :38,50,88 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/pi-extension.md` | :37,50,51,90 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/pi-vision-command.md` | :38,51,90 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/host-adapters/vision-cli.md` | :37,93 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md` | :78,114 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/annotate.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/colors.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/crop.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/diff.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/metadata.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/pixel-analysis/zoom.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/runtime-core/runtime-lifecycle.md` | :37,54 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/scene-understanding/detect.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/scene-understanding/inspect.md` | :37,54 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/scene-understanding/ocr.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/scene-understanding/point.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/scene-understanding/segment.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/system-health/reverse.md` | :37,52 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-vision/manual-testing-playbook/system-health/status.md` | :37,53 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-vision / vision-runtime — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-vision/vision-runtime/scripts/build.ts` | :55 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |

---
## skill:sk-git / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/README.md` | :79,82,94,98,147,270,271,272 (+3) | documentation (4 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/SKILL.md` | :289,361,374,440,441,443,589,608 (+2) | documentation (1 fenced (runnable); 9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / assets — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/assets/commit-message-template.md` | :105 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/assets/worktree-checklist.md` | :119,125,131,137,324 | documentation (5 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / benchmark — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--glm-5-2-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-git/benchmark/reports/2026-07-10--live--kimi-2-7/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-git / changelog — 7 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/changelog/v1.0.2.1.md` | :17 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.0.8.0.md` | :17 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.0.9.0.md` | :17,18 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.1.0.0.md` | :20 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.1.2.0.md` | :31,32,33,34 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.2.0.0.md` | :11,16,17,51,52,53 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-git/changelog/v1.3.2.0.md` | :16 | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-git / feature-catalog — 11 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/feature-catalog/feature-catalog.md` | :55 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md` | :46,47,53 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/remote-platform-integration/gitkraken-mcp-integration.md` | :46 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/session-lifecycle/continuous-integration-autosync.md` | :50,51,52,53,59 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/session-lifecycle/launch-wrapper-session-isolation.md` | :19,51,57 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/session-lifecycle/worktree-reaper.md` | :47,53 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | :67,68,69,70,71,77,78,79 (+3) | documentation (11 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/finish-and-integration-workflows.md` | :50,51,52,58,59,60,61 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/large-reorg-playbook.md` | :46,47 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/numbered-worktree-workflows.md` | :50,51,52,58,59,60 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/feature-catalog/worktree-naming/owner-first-worktree-naming.md` | :51,52,58 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/graph-metadata.json` | :156,157,158,159,160,161,162,163 (+10) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-git / manual-testing-playbook — 14 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/scope-inference-skill-folder.md` | :3,15,27,49 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` | :50 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | :131,244 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/orchestrated-child-execs-in-place.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/prepush-remote-permission-gate.md` | :48,52,70,71,72 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-auto-reap-qualifying-wrapper.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-keeps-non-qualifying-worktrees.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/runtime-identity-validation.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/session-activity-marker.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/shared-artifact-symlink-containment.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/top-level-session-isolation.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/manual-testing-playbook/worktree-setup/stay-on-main-no-feature-branches.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / references — 8 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/references/continuous-integration.md` | :40,41,42,43,118,153,156,169 | documentation (1 fenced (runnable); 7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/finish-workflows.md` | :32,390,725,754 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/large-reorg-playbook.md` | :57,136,138 | documentation (3 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/quick-reference.md` | :52,55,58,61,218,243,268,275 (+4) | documentation (12 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/remote-branch-policy.md` | :99 | documentation (1 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/shared-patterns.md` | :90,115,120,130,358,385,411,418 (+3) | documentation (11 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/unstick-dirty-worktree.md` | :37,187 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/references/worktree-workflows.md` | :160,168,182,193,200,334,359,376 (+4) | documentation (10 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-git / scripts — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/scripts/README.md` | :68,71,74,75,78,89 | documentation (6 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/README.md` | :80,83,103,114,135,158,159,165 (+1) | documentation (4 fenced (runnable); 5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | :112 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/pi/README.md` | :23 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | :7,55,56,57,65 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-git/scripts/lib/README.md` | :107,108,109,110,111,112 | documentation (6 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs` | :105 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-git/scripts/worktree-naming.sh` | :145,149 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/sk-git/scripts/worktree-provision-paths.txt` | :16,20,21,22,23,26,29,34 | txt content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-git / tests — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs` | :83 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |
| `.opencode/skills/sk-git/scripts/tests/README.md` | :48 | test asserting/constructing `.opencode` paths | authored test | expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled` | mechanical |

---
## skill:sk-prompt / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/README.md` | :87,203 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-prompt / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/SKILL.md` | :456 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-prompt / assets — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` | :119,192 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-prompt / benchmark — 13 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.json` | :9 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-mode-a--router/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json` | :7,35,174,188 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json` | :4,29,54,84,87,88 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.json` | :25 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/serving-snapshot.md` | :17 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json` | :4,29,54,84,87,88 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.md` | :35,37,38 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/source.md` | :11 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-prompt / changelog — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/changelog/v1.1.0.0.md` | :17,18,19,20,21,22 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v1.2.0.0.md` | :17,18,19,20,21,22,23,24 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v1.4.0.0.md` | :32 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.0.0.0.md` | :42 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.1.0.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.1.1.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.1.2.0.md` | :3,11 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.1.3.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/sk-prompt/changelog/v2.2.0.0.md` | :3 | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-prompt / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/graph-metadata.json` | :102,103,104,105,106,108,114,120 (+2) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-prompt / manual-testing-playbook — 29 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/clear-five-dimensions.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-drilldown-rationale.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/dimension-floors-block.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/clear-scoring/forty-of-fifty-threshold.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/depth-five-phases-order.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/depth-iteration-cap.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/mechanism-first-prototype.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/perspectives-floor-three.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/phase-exit-gate-blocking.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/ricce-validation-gate.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/escalation-tiers/cli-card-five-question-fast-path.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/escalation-tiers/escalation-trigger-thresholds.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/escalation-tiers/prompt-improver-input-payload.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/escalation-tiers/prompt-improver-output-block.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/format-modes/format-guide-on-demand.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/format-modes/format-mode-delivery.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/framework-selection/framework-by-complexity.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/framework-selection/framework-rationale-required.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/framework-selection/framework-switch-mid-flight.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/framework-selection/user-named-framework-override.md` | :49 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/manual-testing-playbook.md` | :56,57,58 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/mode-detection/default-mode-routing.md` | :48,67 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/mode-detection/mode-prefix-keyword-collision.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/mode-detection/raw-mode-passthrough.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/mode-detection/short-mode-three-rounds.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/smart-routing/ambiguity-delta-tiebreaker.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/smart-routing/intent-model-keyword-scoring.md` | :50,69 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/smart-routing/on-demand-keyword-loading.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-prompt/manual-testing-playbook/smart-routing/unknown-fallback-checklist.md` | :48 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |

---
## skill:mcp-code-mode / INSTALL-GUIDE.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md` | :161,221,361,370 | documentation (2 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-code-mode / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/README.md` | :198,199,200 | documentation (3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-code-mode / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/SKILL.md` | :69 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-code-mode / changelog — 9 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/changelog/v1.0.0.0.md` | :34,35,36,37,38,39,40 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.0.31.md` | :17,18 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.1.0.md` | :26,27,28,29 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.2.0.md` | :18,19,20,21,22,23 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.3.0.md` | :18,19 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.4.0.md` | :26,27 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.5.0.md` | :26 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.7.0.md` | :18,19,20,21,22 | historical changelog record | authored history | none — frozen history | freeze |
| `.opencode/skills/mcp-code-mode/changelog/v1.0.8.0.md` | :18,19 | historical changelog record | authored history | none — frozen history | freeze |
## skill:mcp-code-mode / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/graph-metadata.json` | :76,77,78,79,80,81,87,93 (+4) | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:mcp-code-mode / manual-testing-playbook — 25 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/chrome-navigate-screenshot.md` | :93 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/clickup-and-chrome-via-cm/sibling-pair-handover.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/call-tool-chain-execution.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/list-tools-enumeration.md` | :96,98 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/search-tools-relevance.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/tool-info-schema.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/env-var-prefixing/prefixed-env-load.md` | :96 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/env-var-prefixing/unprefixed-env-not-found.md` | :99 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/env-var-prefixing/validate-config-script.md` | :34,54,56,96,97 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/manual-namespace-contract/correct-manual-tool-form.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/manual-namespace-contract/list-tools-dot-vs-underscore.md` | :75,97 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/manual-namespace-contract/wrong-form-error.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/manual-testing-playbook.md` | :231,498,499,500 | documentation (4 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/multi-tool-workflows/promise-all-parallel.md` | :95 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/multi-tool-workflows/sequential-chain.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/multi-tool-workflows/try-catch-error-path.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md` | :28,29,37,51,58,76,82,88 (+12) | documentation (12 fenced (runnable); 8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/recovery-and-config/deregister-reregister-cycle.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/recovery-and-config/invalid-config-error.md` | :99 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/recovery-and-config/missing-manual-entry.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/recovery-and-config/partial-chain-rollback.md` | :94 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/recovery-and-config/timeout-escalation.md` | :91 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/third-party-via-cm/github-list-user-repos.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/third-party-via-cm/myservice-list-sites.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/third-party-via-cm/notion-search-workspace.md` | :92 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-code-mode / references — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/references/tool-catalog.md` | :81,82 | documentation (2 fenced (runnable)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:mcp-code-mode / scripts — 4 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/mcp-code-mode/scripts/README.md` | :3,19,39,44,90 | documentation (2 fenced (runnable); 3 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/mcp-code-mode/scripts/doctor.sh` | :9 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/mcp-code-mode/scripts/install.sh` | :58,121,122,328,332,358,360,421 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |
| `.opencode/skills/mcp-code-mode/scripts/update.sh` | :110 | code referencing `.opencode` paths | authored code | rewrite path refs at the cited lines (or compat) | mechanical |

---
## skill:sk-communication / README.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/README.md` | :21,56,59,74,82,85 | documentation (4 fenced (runnable); 2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-communication / SKILL.md — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/SKILL.md` | :12,14,87,203,225,226,234 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-communication / benchmark — 3 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/benchmark/README.md` | :19,38 | documentation (1 fenced (runnable); 1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/benchmark/reply-harness/cases.json` | :18,27,45 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
| `.opencode/skills/sk-communication/benchmark/reports/advisor-routing-smoke-2026-08-12.json` | :5 | benchmark run report — a past run's record | generated history | none — frozen history | freeze |
## skill:sk-communication / changelog — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/changelog/v1.0.0.0.md` | :35,36,37 | historical changelog record | authored history | none — frozen history | freeze |
## skill:sk-communication / cli-communication-projection — 2 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md` | :134,141 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/cli-communication-projection/docs/rollback.md` | :49,50 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-communication / feature-catalog — 13 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/bounded-context-selection.md` | :38,39,40,46,47 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/assembly-and-context/generation-keyed-message-assembly.md` | :38,39,40,46,47,48 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/evaluation-and-observability/blind-non-inferiority-evaluation.md` | :38,39,40,41,47,48,49,50 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/evaluation-and-observability/content-free-observability.md` | :38,39,40,41,42,48,49,50 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md` | :21 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/fidelity-and-render/capability-aware-presentation.md` | :38,39,40,46,47,48 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/fidelity-and-render/protected-span-fidelity-validation.md` | :38,39,40,41,47,48,49 | documentation (7 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/packaging-and-release/compatibility-doctor.md` | :38,39,40,46,47 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/packaging-and-release/release-readiness-and-rollback.md` | :38,39,40,41,47,48,49,50 | documentation (8 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/provider-and-privacy/external-cli-provider.md` | :40,41,42,43,49,50 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/provider-and-privacy/privacy-first-provider-routing.md` | :38,39,40,46,47,48 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/provider-and-privacy/provider-adapters-and-execution.md` | :40,41,42,43,44,50,51,52 (+1) | documentation (9 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/feature-catalog/runtime-adapters/six-runtime-adapter-matrix.md` | :38,39,40,41,42,43,44,45 (+5) | documentation (13 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
## skill:sk-communication / graph-metadata.json — 1 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/graph-metadata.json` | :92,98 | json content naming `.opencode` | authored | mechanical rewrite | mechanical |
## skill:sk-communication / manual-testing-playbook — 11 files

| file | `.opencode` lines | what it is | origin | needed change | class |
|---|---|---|---|---|---|
| `.opencode/skills/sk-communication/manual-testing-playbook/advisor-routing/advisor-routes-projection-request.md` | :40,46 | documentation (2 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/claim-omission-and-no-op.md` | :40 | documentation (1 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/exact-original-fidelity-fallback.md` | :40,47,68,69,70,71 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/external-cli-provider-fallback.md` | :40,47,68,69,70,71 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/privacy-precedes-provider-ranking.md` | :40,46,67,68,69 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` | :68,230,235,236,237,238,239,240 (+2) | documentation (10 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/presentation-tiers/full-projection-requires-atomic-ownership.md` | :40,46,67,68,69 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/presentation-tiers/safe-native-preserves-original-visibility.md` | :40,47,68,69,70,71 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/release-gating/compatibility-doctor-selects-original-only.md` | :40,46,67,68,69 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/release-gating/human-certified-bundle-gates-release.md` | :40,46,67,68,69 | documentation (5 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |
| `.opencode/skills/sk-communication/manual-testing-playbook/release-gating/provisional-evaluation-blocks-release.md` | :40,47,69,70,71,72 | documentation (6 inline (prose)) | authored doc | rewrite refs — fenced lines are runnable, inline are prose | mechanical |

---
