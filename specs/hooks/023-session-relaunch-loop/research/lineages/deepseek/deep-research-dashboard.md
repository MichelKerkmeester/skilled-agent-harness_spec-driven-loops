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
- Topic: Session relaunch loop audit after phase 008: find remaining drift between code, docs and spec records; latent bugs and edge cases; refinements; the ideal architecture of the core and adapters; and alignment gaps against the sk-code-skilled surface standards and the sk-doc standards
- Started: 2026-10-19T17:12:00.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-deepseek-1792429886029-no7lpl
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
| 1 | Core relaunch state machine and process-targeting seams | - | 1.00 | 5 | complete |
| 2 | Runtime adapter parity and untrusted spec-folder input | - | 0.90 | 5 | complete |
| 3 | Command, README, catalog and environment-reference alignment | - | 0.90 | 5 | complete |
| 4 | Phase 001-008 record drift against the current code | - | 0.80 | 4 | complete |
| 5 | Ideal core-and-adapter boundary and standards conformance | - | 0.70 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 24
- openQuestions: 1
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/5
- [x] Which behaviors in `.skilled/hooks/session-relaunch/lib` and `.skilled/bin/skilled-loop` diverge from the phase 001-008 spec records, and which concrete fixes restore alignment?
- [x] Do the runtime adapters (Claude, OpenCode plugin, Pi, Codex, Hermes) implement the same trigger, arm and nudge semantics as the core, and where do they drift?
- [x] Does `/speckit:handoff`, its command documentation and the Gate 3 exemption match the implemented contract and the sk-doc standards?
- [x] What is the ideal core-and-adapter architecture, and which sk-code-skilled surface checklist items and sk-doc standards remain unmet?
- [ ] Which latent bugs and edge cases remain in the core relaunch decision path (context threshold, nudge, killer, handoff) and which tests expose them? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Which latent bugs and edge cases remain in the core relaunch decision path (context threshold, nudge, killer, handoff) and which tests expose them?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▆▆▆▆▆▆▅▅▄▄▃▃▂▂▁▁
- score sparkline: ██▇▇▆▆▆▆▆▆▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 0.90 -> 0.80 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"other":36}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Looking for direct writes to `deep-research-state.jsonl` in the hook code: the relaunch hooks never touch the deep-research packet, so none exist. (iteration 1)
- Re-deriving the hop-cap logic: the wrapper, `prepare`, the killer and every adapter share one resolution path, and phase 008 tests cover zero, non-integer and over-cap values. No drift found. (iteration 1)
- Rewriting the lock takeover algorithm: expiry, inode-checked release, and the 30 s/10 min sweeps match the README line for line. (iteration 1)
- Treating `targetIsRunning`'s `EPERM` handling as a bug: for a target pid, `EPERM` means the pid was reused by another user, so "gone" is the correct reading. (iteration 1)
- Flagging Codex's separate `prompt-seed.mjs` and `context-nudge.mjs` entry points: the installer allows one script per event, and both route through `shared.mjs`. (iteration 2)
- Re-checking the threshold math per adapter: every adapter calls the shared `relaunchThreshold`, `nextLevel` and `handoffPending` helpers, and the per-runtime windows are intentional. (iteration 2)
- Searching for a runtime that resolves the window from a different source than documented: Pi uses `ctx.getContextUsage()`, OpenCode uses `model.limit.context`, Codex the transcript's `model_context_window`, Hermes the payload or model metadata, all with the same env override. (iteration 2)
- Treating OpenCode's `process.pid` target as a bug: the plugin is hosted in the OpenCode process the wrapper starts, and the plugin tests assert that pid is passed to the killer [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:916]. (iteration 2)
- A command-standard defect: the frontmatter description is one line and within the 110-character budget, `argument-hint` is present, `allowed-tools` is limited to Read, Write and Bash, and the sections match the command template's purpose/contract/steps/report shape [SOURCE: .skilled/skills/sk-doc/sk-create-command/assets/command-template.md:1]. (iteration 3)
- A Gate 3 exemption gap: the AGENTS.md sentence exempts runtime state under `.skilled/skills/.state/` [SOURCE: AGENTS.md:75], the spec-gate test covers the path, and the handoff note lives there. (iteration 3)
- A playbook exit-code drift: the playbook's wrapper exit table matches `skilled-loop` lines 430-504, including the 130 path and the decode-failure warnings. (iteration 3)
- Looking for a command-contract entry for `/speckit:handoff`: the contract covers router-shaped families only, and this command is direct-dispatch, so its absence is expected. (iteration 3)
- A parent-goal D3 violation: the claim seed takes `spec_folder` from the note at consume time [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:509], so the note-written value does reach the seed on every runtime even when the adapter's payload field is absent. The earlier doc-accuracy concern is about the ENV-REFERENCE wording, not the goal. (iteration 4)
- A phase 001 usage-accounting drift: the record says fill uses input, cache creation and cache read, and `readClaudeFill` sums exactly those three [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:112]. (iteration 4)
- A phase 008 limitation drift: "No live rerun" is accurate; the phase closed unit-level edge cases after the live runs. (iteration 4)
- Looking for a phase record that claims `CLAUDE_PID` is absent: every record that mentions it says it is recorded in the live hook environment, so the docs' "only for the shell-child check" wording is the sole contradiction. (iteration 4)
- A JavaScript or shell checklist violation in the shipped code: module headers, `'use strict'`, camelCase, bracketed log prefixes, quoted expansions, `set -euo pipefail`, documented exit codes and named constants are all present in the reviewed files. (iteration 5)
- A README structure or sk-doc standards violation: the README has numbered ALL CAPS H2 sections, a directory tree, a switches table, troubleshooting and related links, and no anchor navigation. (iteration 5)
- Looking for a shared conformance runner outside the per-runtime suites: none exists, and the deep-loop stress adapters are not wired to this hook. (iteration 5)
- Treating the TypeScript `as string` import specifiers as a defect: the comment explains the dual-base module resolution the Pi loader needs, and the dynamic imports have a fallback. (iteration 5)

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
Follow up on: **P3 — The tests README omits the OpenCode plugin suite from the folder inventory, so a reader cannot find one fifth of the regression coverage.** The README says the suite covers Claude, Codex, Hermes and Pi [SOURCE:...

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
