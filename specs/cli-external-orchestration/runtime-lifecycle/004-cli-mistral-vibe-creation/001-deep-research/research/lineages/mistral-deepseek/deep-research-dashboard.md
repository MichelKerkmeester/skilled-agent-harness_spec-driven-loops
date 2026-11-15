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
- Topic: Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode
- Started: 2026-11-14T12:25:15Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: fanout-mistral-deepseek-1794658946949-yw45xe
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: all_questions_answered

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Angle 1: headless dispatch contract | headless-dispatch | 1.00 | 8 | complete |
| 2 | Angle 2: providers, models and the subscription | providers-and-billing | 1.00 | 7 | complete |
| 3 | Angle 3: configuration and the repo-local runtime folder | configuration-surface | 1.00 | 7 | complete |
| 4 | Angle 4: feature parity with cli-opencode | opencode-parity | 1.00 | 12 | complete |
| 5 | Angle 5: skills, slash commands and subagents | skills-and-subagents | 1.00 | 8 | complete |
| 6 | Angle 6: hooks and safety | hooks-and-safety | 0.94 | 9 | complete |
| 7 | Angle 7: deep-loop executor support | deep-loop-executor | 1.00 | 9 | complete |
| 8 | Angle 8: ACP and other integration seams | acp-integration | 1.00 | 9 | complete |

- iterationsCompleted: 8
- keyFindings: 69
- openQuestions: 0
- resolvedQuestions: 8

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 8/8
- [x] How does Vibe run one task non-interactively: prompt as argument, stdin or file, which flags set model, agent profile, permissions, working directory and turn or time limits, what lands on stdout and stderr, and what are the exit codes on success, provider error, denied tool and timeout?
- [x] How does Vibe authenticate (browser sign-in, API key, bring-your-own key), can a dispatch pin deepseek-v4-1-flash-1017 and zai-glm-5-3-flash, how is reasoning effort set, and which usage counter does a Vibe turn draw on?
- [x] What does Vibe read from the working directory and from ~/.vibe/ (agents as TOML, AGENTS.md, project config), what would a repo-root .vibe/ folder contain, and which parts should be generated mirrors of .skilled/ sources?
- [x] For each OpenCode surface this repository uses (plugins, spec gate, dispatch preflight hooks, session-relaunch loop, goal and context bridges, slash commands, custom agents, skills, MCP and Code Mode, permissions, self-invocation guard), does Vibe have an equivalent, a partial one or none, and what porting would it take?
- [x] What skill format does Vibe load and from where, and how do its slash-command skills and custom subagents map onto this repository's skills, commands and agent directories?
- [x] What hook system does Vibe expose, at which events, can a hook block a tool call, can the eight repo guards the DeepSeek Harness plugin carries be expressed there, and what are Vibe's approval and sandbox modes?
- [x] What would a cli-mistral-vibe executor kind need in the deep-loop runtime: the command builder, the environment allowlist, a closed model roster, dispatch-audit recognition and stress coverage?
- [x] Vibe speaks the Agent Client Protocol: is ACP a better dispatch surface than a print mode for this repository, and what would it change in the fan-out?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████████████▅▂▂▅▇███
- score sparkline: ████████████▅▂▂▅▇███
- Last 3 ratios: 0.94 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"other":79}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Extracting the `--output json` / `--output streaming` event schema without an authenticated dispatch. The schema is Rust-side and not mirrored in the Python package. Candidate for the second and last allowed live dispatch, or for an upstream source read. (iteration 1)
- Reading the headless JSON schema out of the Rust binary with `strings`: the serde structs do not leave literal JSON key names in the binary (only two `{"type":` fragments), so the exact `--output json` payload shape stays unconfirmed. Replaced by the `export.json` contract, which is Python-side and fully readable. (iteration 1)
- Treating `vibe --help` as the whole contract: it is complete for flags but silent on exit codes and on the export, which only the app server documents. (iteration 1)
- Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry. (iteration 2)
- Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase. (iteration 2)
- Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2. (iteration 2)
- Assuming `.vibe/` is recursive like `.opencode/`: discovery examines only the root, so nested `.vibe/` folders in subpackets are invisible. (iteration 3)
- Assuming Vibe reads a repo-root config file by default: it walks up to the trust root and stops at the home directory, and an untrusted directory's `.vibe/config.toml` does not apply. A mirror therefore needs the working directory trusted (`--trust` or the trust store) before any of it takes effect. (iteration 3)
- Confirming which of the seven mirrors' generation scripts would be reusable for Vibe. The scripts are per-runtime (`sync-skills-dsh.cjs`, `sync-prompts-dsh.cjs`, and so on), so a Vibe mirror needs its own writers rather than a parameterised one. Out of scope for a research pass. (iteration 3)
- Assuming slash commands port one-to-one. Vibe has no user command file format, so a command with argument templating has to become a skill with a different invocation contract. (iteration 4)
- Finding a Vibe equivalent for the goal object. There is no goal model, no goal file, and no prompt-rewriting hook; the concept has no home in 3.1.2. (iteration 4)
- Treating Vibe plugins as an OpenCode plugin port target. A `plugin.json` bundle cannot run arbitrary code on runtime events, so the 24 JS plugins cannot be moved as plugins; they must be reclassified into hooks and skills first. (iteration 4)
- Assuming a same-name skill merges across scopes: the manager shadows the loser, so a project skill cannot extend a global one. (iteration 5)
- Determining whether the 32-subagent default is a hard ceiling or a soft one under load. It is a config field with a documented failure mode ("a spawn beyond this fails"), so the answer is "hard until raised", and no live multi-subagent run was in budget. (iteration 5)
- Mirroring `.skilled/commands/` into a `.vibe/commands/` directory: no such directory is read anywhere in the discovery code, and the slash-command registry is a closed builtin set plus skills. (iteration 5)
- Assuming `strict` works on every hook type: the validator rejects it outside the three tool/agent events, so a design that relies on a blocking `session_end` hook fails at config parse. (iteration 6)
- Expressing `completion-evidence` or `ask-surface-guard` as Vibe hooks: both bind to a turn-stopping moment Vibe does not expose, and no other event fires there. (iteration 6)
- Finding an in-process hook API. Every hook is an external command; there is no Python or JavaScript handler registry, so a guard that needs to inspect structured tool arguments must parse them from the hook payload. (iteration 6)
- Confirming that `vibe-rs` is the process name the ancestor walk sees. The launcher `execvpe`s the binary, so the process image is `vibe-rs` while the command the operator typed is `vibe`. Both names must be in the guard's match set; a live dispatch would confirm which one appears, and none was in budget. (iteration 7)
- Declaring `reasoningEffort` for `cli-mistral-vibe`: Vibe has no flag for it, and the unsupported-field scan would reject the config or the kind would silently drop it. The honest mapping is a model-level `thinking` setting in the generated Vibe config. (iteration 7)
- Reusing the `cli-opencode` adapter with a different binary: the argument grammar differs on every axis (prompt delivery, output format, approval flags, limits). (iteration 7)
- Measuring ACP's real startup and per-turn latency against print mode. That needs an authenticated client and a live session, and the lineage's two-dispatch budget was already spent on the unauthenticated smoke in iteration 1. (iteration 8)
- Replacing the print-mode dispatch with ACP in this phase: it would require a protocol client and an outcome-persistence layer before it produced a single finding, and it would lose the export contract the audit path already reads. (iteration 8)
- Treating `vibe-acp` as a thin wrapper over `vibe -p`: it is a separate entrypoint with its own capability negotiation and no flag surface. (iteration 8)

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
