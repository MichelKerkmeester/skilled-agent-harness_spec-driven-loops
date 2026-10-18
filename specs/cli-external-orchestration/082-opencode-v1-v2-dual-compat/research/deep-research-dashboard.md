---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs
- Started: 2026-10-18T09:23:10.373Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: 2026-10-18T09:23:10.373Z
- Parent Session: 2026-10-18T09:23:10.373Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | A1 v2 plugin API ground truth vs v1 @opencode-ai/plugin 1.18.34 | - | 0.82 | 0 | insight |
| 2 | A2 loader ground truth and real v2 types: what the real @opencode/plugin 2.0.32 types declare, and which plugin default-export shapes v1 1.19.3 and v2 load | - | 0.86 | 0 | insight |
| 3 | A3 per-plugin port matrix: v1 hook/client/event/PluginInput census across the 16 .opencode/plugins modules mapped to v2 targets, plus lib/ shared-module split feasibility | - | 0.78 | 0 | insight |
| 4 | A4 event streams and UI halves: v1 event/payload dependencies of the repo plugins and cli-opencode consumers, v2 equivalents via ctx.event.subscribe(), the run --format json schema in both versions, and whether a repo-local plugin can show a toast or TUI output on v2 | - | 0.80 | 0 | insight |
| 5 | A5 agents: can one .skilled/agents/*.md frontmatter block serve OpenCode v1 1.19.3 and v2 2.0.32 with identical intent | - | 0.80 | 0 | insight |
| 6 | A4b v2 event and session contract ground truth from primary sources (v2 OpenAPI /api/event plus the real @opencode/plugin 2.0.32 declarations) rather than the reference plugin | - | 0.82 | 0 | insight |
| 7 | A6 commands on both versions: discovery filter, frontmatter semantics, template features, and the v2 replacement for v1 run --command | - | 0.82 | 0 | insight |
| 9 | A8 skills on both versions: which skill sources does each version discover, and how does each treat the repo's skills? | - | 0.78 | 0 | insight |
| 8 | A7 dual-key config and v1 tolerance probe: can one opencode.json plus one agent frontmatter carry both v1 and v2 keys without either version breaking or misreading them? | - | 0.87 | 0 | insight |
| 10 | A9 version-aware hooks and guards: per-rule v1/v2 validity of the five opencode-run hard rules, the dispatch classifier's opencode2 blind spot, the Pi preflight guard, and whether .opencode/hooks is host-loaded | - | 0.74 | 0 | insight |
| 11 | A10 plugin dependencies and tool definitions on both versions: what must .opencode/package.json and the plugin sources depend on so one plugin tree works on v1 and v2 without broken imports? | - | 0.81 | 0 | insight |
| 12 | A4c v2 replacements for the lost triggers: session.idle, session.compacted, session.created and ctx.client.session.messages across system-completion-sentinel, system-skill-advisor, system-spec-gate and opencode-goal | - | 0.88 | 0 | insight |
| 13 | A11 cli-opencode dispatch to both versions: version detection for two --version formats, the full v1->v2 flag and subcommand matrix, the cli-opencode files encoding v1-only behaviour, and the deep-loop runner's opencode command builder | - | 0.76 | 0 | insight |
| 16 | A14 server API clients in the repo: which repo code talks to an OpenCode server or SDK directly, and how does each call map from v1 to v2? | - | 0.90 | 0 | insight |
| 15 | A13 install guidance for side-by-side, v1-only and v2-only setups: what must the cli-opencode skill document so a user can copy this repo's setup, or install just one version? | - | 0.90 | 0 | insight |
| 14 | A12 standalone versus shared service, and env propagation to children on v2 (AI_SESSION_CHILD, OPENCODE_DB, SYSTEM_SPEC_GATE_ENFORCE) plus service lifecycle and concurrent clients | - | 0.83 | 0 | insight |
| 19 | A16 release cadence, pinning and what "perfect" can promise: npm dist-tags and publish times for opencode-ai, @opencode/cli, @opencode/plugin and @opencode-ai/plugin; v2 stability/beta statements; minimum supported versions, pinning strategy, runtime detection, support window and honest limits | - | 0.78 | 0 | insight |
| 18 | A3b v2 port specs for the five hard plugins (sentinel, skill-advisor, spec-gate, goal, sk-vision) and resolution of the five open P0s | - | 0.86 | 0 | insight |
| 17 | A15 verification design: a two-version doctor and CI check. Specify concrete, scriptable checks that prove the repo works on whichever version is installed, using only facts this run has proven. Known checks: - v2 plugin status: `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<enc>"`, raw query, output redirected to a file because piped output truncates, retried because the first call returns before discovery. Each repo plugin should show `state.status == "active"`. - v2 agent, command and skill registration: `opencode2 debug agents`, `/api/command` and `/api/skill`, raw query. - v1: `opencode debug config </dev/null` loads plugins without a model call, and `opencode debug agent <name>` and `opencode debug skill` exist. Each version calls only its own entry. - A model-free smoke test that loads plugins and passes env, on both versions: `run --standalone -m nosuchprovider/nosuchmodel` on v2. Find the v1 equivalent. Investigate how v1 can report per-plugin load success or failure without a status API, for example logs under `opencode debug paths` or a marker convention. Find where the repo's existing doctor framework lives (`/doctor:*` command docs under `.skilled/commands/doctor/` and their scripts) and where a new `/doctor:opencode` or similar check would slot in. Design a CI job that installs both versions side by side in separate npm prefixes. Output: a check list (command, expected output, pass rule) for v1, v2 and both, the doctor integration point with file paths, and the CI job outline. Do not install anything. Never run `opencode2 service stop`, `start` or `restart`, or `uninstall`. Never edit repo files outside this packet. | - | 0.55 | 0 | insight |
| 20 | A17 irreducible gaps and the closest workaround for each: the final v1+v2 gap ledger | - | 0.58 | 0 | insight |

- iterationsCompleted: 20
- keyFindings: 128
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [x] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [x] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [x] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [x] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▇▆▆▆▆▆▆▇▅▆█▅██▇▆▇▁▂
- score sparkline: ▆▇▆▆▆▆▆▆▇▅▆█▅██▇▆▇▁▂
- Last 3 ratios: 0.86 -> 0.55 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
