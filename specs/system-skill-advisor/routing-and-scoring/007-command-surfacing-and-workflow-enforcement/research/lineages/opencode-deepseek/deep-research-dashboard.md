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
- Topic: How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime?
- Started: 2026-11-12T09:36:50Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-opencode-deepseek-1794475749931-e4ukfw
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
| 1 | Command inventory drift across three metadata sources | - | 0.95 | 7 | complete |
| 2 | Scoring: why plain planning and research prompts return zero | - | 0.90 | 7 | complete |
| 3 | Output contract of the 80 to 120 token brief | - | 0.90 | 7 | complete |
| 4 | Run-or-ask policy for 45 commands | - | 0.85 | 7 | complete |
| 5 | Invocation mechanics across seven runtimes | - | 0.50 | 7 | complete |
| 6 | How a chat-only request reaches a command workflow | - | 0.60 | 9 | complete |
| 7 | Skill and command linkage | - | 0.75 | 8 | complete |
| 8 | Measurement for command surfacing | - | 0.80 | 8 | complete |
| 9 | Prior art from public agent-harness documentation | - | 0.85 | 9 | complete |
| 10 | Failure modes and their controls | - | 0.85 | 9 | complete |

- iterationsCompleted: 10
- keyFindings: 78
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] Which commands have no active bridge, which bridges point at retired names, and what does one drift-proof command inventory need?
- [x] Why do plain planning and research prompts return no recommendation, how does command intent compete with skill intent in fusion, and what do the no-slash penalty and mutating-command gate cost in recall versus precision?
- [x] What must the advisor render inside the 80 to 120 token brief for a model to act on a command, given that advisor_recommend has no kind or runnable field?
- [x] Which commands are safe to start without asking, which need a question first, judged by what they write and what they can undo, and where should that run-or-ask policy live?
- [x] Can a model start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what is the fallback where it cannot?
- [x] Which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today?
- [x] Which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and should a skill recommendation imply its command?
- [x] Which benchmark and fixture rows are needed for every command group and for chat-style prompts, and which metrics separate a missed command from a wrongly started one?
- [x] How do other agent harnesses route a free-text request to a packaged workflow, from their public documentation?
- [x] Which failure modes matter most: over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▇▅▂▁▂▃▄▅▅▆▆▆▆▆
- score sparkline: ██▇▇▇▇▇▅▂▁▂▃▄▅▅▆▆▆▆▆
- Last 3 ratios: 0.80 -> 0.85 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":55,"code.claude.com":2,"developers.openai.com":3,"other":54}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings. (iteration 1)
- Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands. (iteration 1)
- Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases. (iteration 1)
- Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall. (iteration 2)
- Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills. (iteration 2)
- Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors. (iteration 2)
- Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command. (iteration 3)
- Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap. (iteration 3)
- Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table. (iteration 3)
- A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command. (iteration 4)
- Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes. (iteration 4)
- Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next. (iteration 4)
- "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one. (iteration 5)
- Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command. (iteration 5)
- Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user. (iteration 5)
- A hook-only mechanism: the hook is advisory and cannot dispatch a command. (iteration 6)
- A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll. (iteration 6)
- A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget. (iteration 6)
- Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named. (iteration 6)
- Implying a command for every skill: nine skills have no command, so the implication would invent routes. (iteration 7)
- Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader. (iteration 7)
- Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`. (iteration 7)
- Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline. (iteration 8)
- Looking for a command-level metric in the release-gate schema: only skill-level fields exist. (iteration 8)
- Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss. (iteration 8)
- A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions. (iteration 9)
- Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it. (iteration 9)
- Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`. (iteration 9)
- A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case. (iteration 10)
- Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule. (iteration 10)
- Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard. (iteration 10)
- Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing. (iteration 10)

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
