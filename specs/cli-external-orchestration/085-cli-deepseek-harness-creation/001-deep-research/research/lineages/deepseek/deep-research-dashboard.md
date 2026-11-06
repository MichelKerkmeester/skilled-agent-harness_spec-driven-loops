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
- Topic: DeepSeek Harness (dsh, github.com/deepseek-ai/deepseek-harness, installed 0.2.2-rc.1) as a new cli-external-orchestration runtime mode that mirrors cli-pi: headless dispatch contract, providers (LLM Gateway and OpenCode Go DeepSeek V4.1 Flash), repo-local runtime folder, skills, agents, commands, plugins and hooks to port, third-party Pi plugins to migrate or drop, MCP, deep-loop fan-out executor support, every cross-repo touch point, and the phase plan. FIRST read specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research-angles.md (ten angles, rules of engagement) and resource-map.md (known context, do not rediscover). One angle per iteration.
- Started: 2026-11-05T21:59:10Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-deepseek-1793915913100-enoz0j
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Angle 1: headless dispatch contract | - | 0.87 | 8 | complete |
| 2 | Angle 2: providers, models and reasoning | - | 0.79 | 8 | complete |
| 3 | Angle 3: profiles, DSH_HOME and repo-local configuration | - | 0.86 | 8 | complete |
| 4 | Angle 4: skills | - | 0.93 | 8 | complete |
| 5 | Angle 5: agents, subagents, commands and goal | - | 0.90 | 9 | complete |
| 6 | Angle 6: plugins, hooks and guards | - | 0.88 | 9 | complete |
| 7 | Angle 7: third-party plugin migration | - | 0.90 | 11 | complete |
| 8 | Angle 8: MCP | - | 0.88 | 9 | complete |
| 9 | Angle 9: deep-loop fan-out fitness and the complete touch list | - | 0.90 | 9 | complete |
| 10 | Angle 10: constraints, differences and the phase plan | - | 0.85 | 9 | complete |

- iterationsCompleted: 10
- keyFindings: 88
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] What exactly does `dsh headless` accept, emit and return, and how does it compare with `pi -p` and the other seven runtimes' headless contracts?
- [x] How are providers, models and reasoning levels configured, and can LLM Gateway and OpenCode Go be added as closed, fail-closed routes?
- [x] What does the harness read from the working directory and `$DSH_HOME`, and what should a repo-local runtime folder contain?
- [x] What skill format does the harness load, and should this repo use generated copies or symlinks?
- [x] How can this repo's agents, subagents, commands and goal binding be reached by the harness?
- [x] Which lifecycle seams exist for plugins and hooks, and which Pi extensions must be ported, deferred or dropped?
- [x] For each third-party Pi plugin, does the harness ship the capability natively, offer a market equivalent, or is it irrelevant to dispatch?
- [x] How are MCP servers configured, and can this repo's servers and code-mode connect?
- [x] What does a deep-loop fan-out lineage builder need, and which consumers must learn the new executor kind?
- [x] Where does the harness cost more or less than Pi, what hard rules follow, and what is the phase plan?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▃▁▂▄▆▇█▇▆▆▆▆▆▆▆▆▆▅▄
- score sparkline: ▅▃▁▂▄▆▇█▇▆▆▆▆▆▆▆▆▆▅▄
- Last 3 ratios: 0.88 -> 0.90 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":158,"other":25}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Adding a `--model` flag to a hoped-for dispatch builder: the installed help has no such option. (iteration 1)
- Probing a successful dispatch: no provider key exists on this machine, and creating one is out of (iteration 1)
- Treating exit `1` as a provider-auth signal: the contract collapses aborts, denials, timeouts and (iteration 1)
- A `--model`/`--provider` dispatch flag: headless exposes none. (iteration 2)
- Live verifying either gateway through `dsh`: requires writing a real key into a profile, which is (iteration 2)
- Relying on the harness catalog to enforce a model allowlist: it validates only what the profile (iteration 2)
- A `.dsh/settings.json` analogue: settings persist through the active profile's Cordis patch, and (iteration 3)
- A repo-local profile directory: profile lookup is `$DSH_HOME`-only, and a checked-in profile would (iteration 3)
- Trying to discover a project config folder: none is documented in `settings`, `boot` or the (iteration 3)
- A whole-directory symlink `.dsh/skills -> .skilled/skills`: one-level discovery would expose only (iteration 4)
- Editing canonical `SKILL.md` files to add `whenToUse` or invocation keys: extra keys are optional, (iteration 4)
- Looking for a quarantine or scan path: none exists in the filesystem provider; the only failure (iteration 4)
- Markdown-only generated copies: they would lose `references/`, `assets/` and `scripts/` unless (iteration 4)
- An agent-file loader or an `--agent` flag: none exists; personas come from the system-prompt row, (iteration 5)
- Looking for a generic prompt-template loader: `tool-workflow` runs model-written JavaScript, not (iteration 5)
- Native slash commands from `.skilled/commands/**`: the command plane is plugin-registered and (iteration 5)
- Plan mode as an unattended gate: its exit path fails closed without an interactive review. (iteration 5)
- A project-local plugin folder: plugin resolution is profile-package based, so a repo bundle must (iteration 6)
- Looking for a `PreCompact` equivalent in the bridge: the supported-event table stops at Stop and (iteration 6)
- Mounting `.claude/settings.json` unchanged: its capitalized tool matchers never match the (iteration 6)
- Porting all eighteen Pi extensions to native plugins: the scripts already exist and most hook (iteration 6)
- A service-tier plugin for `pi-fast-mode`: no request field exists to carry it. (iteration 7)
- Installing from the plugin market as a migration shortcut: Pi packages are not listed as dsh (iteration 7)
- Porting any Pi package as a dsh plugin: none is a dsh bundle, and six capabilities already exist. (iteration 7)
- Searching for a `serviceTier` model-route field: the catalog exposes only executor-side service (iteration 7)
- Lazy MCP startup: no `lifecycle` field on the harness client. (iteration 8)
- Looking for an MCP manager in base or headless: only the web bundle mounts it, so a headless (iteration 8)
- Per-dispatch `--mcp` or tool-allowlist flags: none exist; composition is the control. (iteration 8)
- Reading `.pi/mcp.json` directly: no project MCP config is scanned. (iteration 8)
- A `--model` or `--effort` flag in the builder: headless exposes neither, so the route must be a (iteration 9)
- Looking for a harness-side per-run budget: none exists; the runner owns the timeout, and the (iteration 9)
- Passing all `DSH_*` variables to the child: only `DSH_HOME` and `DSH_PERMISSION_MODE` are needed. (iteration 9)
- Reusing the Pi exit-code exception: dsh's exit status is deterministic, so a non-zero exit is a (iteration 9)
- Building the executor kind before the keyed contract pin: the patch and stdin behavior are the (iteration 10)
- Looking for a harness-side billing or cost table: token accounting is local and route pricing stays (iteration 10)
- Relying on `FEEDBACK_ONLY` as a telemetry hard rule: only `DISABLED` guarantees no export. (iteration 10)
- Treating the harness as cheaper than Pi per run: same gateway rate, larger footprint. (iteration 10)

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
