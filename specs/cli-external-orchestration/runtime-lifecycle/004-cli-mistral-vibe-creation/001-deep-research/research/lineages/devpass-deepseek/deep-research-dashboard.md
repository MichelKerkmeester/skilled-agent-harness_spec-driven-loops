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
- Topic: Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode. Work the eight angles in specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research-angles.md, one per iteration, using research/evidence/vibe-help.txt as the captured headless contract.
- Started: 2026-11-14T12:24:30Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: fanout-devpass-deepseek-1794658946949-yw45xe
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
| 1 | Angle 1: headless dispatch contract | headless-contract | 1.00 | 8 | complete |
| 2 | Angle 2: providers, models and the subscription | providers-and-billing | 1.00 | 8 | complete |
| 3 | Angle 3: configuration and the repo-local runtime folder | configuration | 1.00 | 8 | complete |
| 4 | Angle 4: feature parity with cli-opencode | parity | 1.00 | 12 | complete |
| 5 | Angle 5: skills, slash commands and subagents | skills-and-subagents | 0.95 | 10 | complete |
| 6 | Angle 6: hooks and safety | hooks-and-safety | 1.00 | 10 | complete |
| 7 | Angle 7: deep-loop executor support | executor | 1.00 | 9 | complete |
| 8 | Angle 8: ACP and other integration seams | acp-and-seams | 1.00 | 8 | complete |

- iterationsCompleted: 8
- keyFindings: 73
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] How does Vibe run one task non-interactively: which prompt source, flags, output formats and exit codes does the headless contract expose?
- [x] Which providers, models and authentication paths can a Vibe dispatch use, and which usage counter does a turn draw on?
- [x] What does Vibe read from the working directory and ~/.vibe/, and what would a generated repo-root .vibe/ mirror contain?
- [x] For each cli-opencode surface this repository uses, does Vibe have an equivalent, a partial equivalent or none, and what would porting take?
- [x] What would a cli-mistral-vibe deep-loop executor kind need, and is ACP a better dispatch surface than print mode?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████████▆▃▁▄▇██████
- score sparkline: █████████▆▃▁▄▇██████
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"other":57}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=8 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=8 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A live `vibe -p OK` smoke dispatch: `~/.vibe/` holds only `trusted_folders.toml`, no `config.toml` and no key, so the run would have exercised the auth-error branch (`config_error`, exit 1) rather than the dispatch contract. Deferred to the second allowed smoke dispatch once credentials exist. (iteration 1)
- Reading the Python package as the CLI implementation: `launcher.py` only execs the Rust binary, so Python is the app-server/session half. The Rust parser has no local source in the wheel, only the help text and binary strings, so CLI-flag claims beyond those captures are `documented, unconfirmed`. (iteration 1)
- Treating `--output json` as the canonical machine record. It is the response channel; `export.json` is the run record. Building an executor around stdout JSON alone would lose `outcome`, `usage`, `cost_usd`, `steps` and `exit_code`. (iteration 1)
- Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it. (iteration 2)
- Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule. (iteration 2)
- Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows. (iteration 2)
- Assuming a `.vibe/commands/` directory: it is absent from `find_local_config_dirs`, so slash commands cannot be mirrored by dropping markdown into a commands folder. (iteration 3)
- Assuming project config applies by presence: `ProjectConfigLayer` requires trust, so the repo mirror must also be trusted per worktree (`--trust`) or it is inert. (iteration 3)
- Searching for a project-local plugin config file separate from `.vibe/config.toml`: plugin enablement (`enabled_plugins`/`disabled_plugins`) lives in the same layered config, so there is one config file to render, not two. (iteration 3)
- Looking for a Code Mode equivalent among builtin tools: the tool list has no script/execute member. (iteration 4)
- Looking for a Vibe command-markdown directory: none exists, and `.vibe/prompts` is resolved by prompt id, not by user invocation. (iteration 4)
- Mapping `session.compacted`/`session.idle` onto `post_agent`: the event timing and payload differ, so the relaunch loop's idempotency and context-withdrawal logic would not carry over. (iteration 4)
- Packaging the repository's `.opencode/plugins/*.js` as a Vibe plugin and expecting them to run: `_foreign.py` refuses executable OpenCode components by design. (iteration 4)
- Reading the `task` tool as an unrestricted subagent dispatch: its default allowlist contains only `explore`, so a custom subagent is invisible until the allowlist names it. (iteration 5)
- Searching for a command-argument templating feature in the skill parser: there is no `$ARGUMENTS` or equivalent placeholder in `SkillMetadata` or the skill tool. (iteration 5)
- Searching the builtin tool directory for a Code Mode tool: `run_typescript` lives in the Unified Harness runtime, not in `core/tools/builtins`, which is why the first pass missed it. (iteration 5)
- Treating the absence of `.vibe/commands` as proof that Vibe has no slash commands: user-invocable skills are the slash surface, so the correct verdict is "commands map to skills, without `$ARGUMENTS`". (iteration 5)
- Porting `completion-evidence` as a blocking hook: `post_agent` has no `strict`, so the port degrades to an advisory. (iteration 6)
- Searching the binary for a hook decision JSON schema: the decision protocol is not exposed as strings, so blocking is cited from the `strict` model contract rather than a wire format. (iteration 6)
- Searching the config schema for a sandbox mode: there is no field, so any "sandbox mode" claim would be documentation-only and is marked UNKNOWN for the CLI. (iteration 6)
- Treating `--auto-approve` as a sandbox: it suppresses prompts, and the only containment is `outside_workdir` plus protected-path escalation. (iteration 6)
- Guessing a `VIBE_SESSION_ID` env var for the session-env map: unobserved, and cli-devin deliberately omits its equivalent rather than inventing one. (iteration 7)
- Looking for a per-kind sandbox flag in Vibe: none exists, so `EXECUTOR_SANDBOX_IS_OS_BOUNDARY` must be `false` and containment must be post-hoc. (iteration 7)
- Looking for a Vibe web-search policy switch: the CLI has no such option, so the policy is `inherit`. (iteration 7)
- Mapping `reasoningEffort` to a Vibe flag: no such flag exists, so the field must be declared unsupported and the pin carried by the model row. (iteration 7)
- Adopting ACP as the first executor surface: it requires a protocol supervisor, a new completion signal and a permission answerer before a single iteration can run, while print mode runs on the existing contract. (iteration 8)
- Looking for ACP flags to pin a model or workdir: `vibe-acp` has no flags, so those come from config or from the session `new_session` payload, and the exact payload fields are UNKNOWN from the Python surface alone. (iteration 8)
- Looking for an ACP export path: none exists; export is a headless-only artifact. (iteration 8)
- Using `run-server` now: the binary itself labels it experimental. (iteration 8)

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
