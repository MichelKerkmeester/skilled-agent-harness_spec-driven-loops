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
- Topic: Design a /goal capability for OpenCode that mirrors Claude Code's /goal (v2.1.139): set a session-level completion condition, persist it, inject it into the model's context every turn until met, and support show/clear/complete/pause. Produce a concrete, buildable design, NOT a survey.

MINE THESE REFERENCES (read-only):
- Codex goals: ~/.codex/goals_1.sqlite (thread_goals schema: objective, status active|paused|blocked|usage_limited|budget_limited|complete, token_budget, tokens_used, time_used_seconds, per-thread key).
- Claude Code /goal behavior (completion condition + autonomous continue-until-met + independent supervisor verification + status-line overlay).
- Vendored reference: .opencode/specs/z_future/openhuman/external (thread_goals + goalsApi + ThreadGoalChip UI/state model).

MAP ONTO OUR OPENCODE SURFACE (cite exact files):
- Plugin injection: .opencode/plugins/mk-goal.js (new), modeled on .opencode/plugins/mk-spec-memory.js — inject the active goal via the experimental.chat.system.transform hook (push to output.system) every turn; lifecycle via the event hook (session.created/idle/deleted, message.updated); session.idle is the "keep working until done" autonomy seam.
- Command: .opencode/commands/goal.md (new), thin-router modeled on .opencode/commands/memory/learn.md — $ARGUMENTS subcommands: <objective> | show | clear | complete | pause.
- State store: choose among flat JSON (.opencode/skills/.goal-state, porting thread_goals, keyed by sessionID), sqlite (Codex-exact), or the spec-kit memory MCP.

RESOLVE THE 9 DESIGN FORKS, each with a recommendation + rationale:
1 autonomy tier (passive inject / active continuation via session.idle->session.prompt / +supervisor); 2 scope/keying (per-session vs global); 3 state store; 4 budget governance (token/time caps + usage_limited/budget_limited); 5 completion detection (self-report vs shell gate vs supervisor); 6 status set; 7 surfacing substitute for the status-line overlay; 8 command style (root /goal vs /goal:* namespace); 9 reuse vs standalone.

OUTPUT per iteration: a finding with reference file:line evidence + the exact OUR target file/mechanism + a design decision + risk. ANTI-CONVERGENCE: do not stop early; target 10 proper iterations, each adding genuine novelty; on convergence, rotate to a different fork/reference/mechanism. Final research.md: the recommended end-to-end design (files, injection mechanism, lifecycle, chosen autonomy tier with guardrails) + ordered build sub-phases. Executor: cli-codex gpt-5.5 xhigh fast.
- Started: 2026-06-28T14:40:19Z
- Status: INITIALIZED
- Iteration: 11 of 12
- Session ID: dr-goal-001-20260628-164019
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | G1 | - | 0.68 | 0 | complete |
| undefined | G2 | - | 0.78 | 0 | complete |
| undefined | G3 | - | 0.86 | 0 | complete |
| undefined | G4 | - | 0.74 | 0 | complete |
| undefined | G5 | - | 0.74 | 0 | complete |
| undefined | G6 | - | 0.76 | 0 | complete |
| undefined | G7 | - | 0.72 | 0 | complete |
| undefined | G8 | - | 0.79 | 0 | complete |
| undefined | G9 | - | 0.64 | 0 | complete |
| undefined | G10 | - | 0.69 | 0 | complete |
| undefined | G11 | - | 0.58 | 0 | complete |

- iterationsCompleted: 11
- keyFindings: 5
- openQuestions: 14
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/14
- [ ] [G1] What is Codex's thread_goals data model + lifecycle (~/.codex/goals_1.sqlite: status enum, token/time budget fields, per-thread key)? -> our goal state model
- [ ] [G2] What exactly does Claude Code /goal (v2.1.139) do (completion condition, autonomous continue-until-met, independent supervisor, status-line overlay)? -> behavior spec
- [ ] [G3] What does the vendored z_future/openhuman reference (thread_goals + goalsApi + ThreadGoalChip) model for goal state + UI? -> reuse ideas
- [ ] [G4] How does OpenCode inject context via experimental.chat.system.transform (the .opencode/plugins/mk-spec-memory.js pattern)? -> mk-goal.js injection
- [ ] [G5] Which OpenCode event/lifecycle hooks (session.created/idle/deleted, message.updated) track + drive a goal; is session.idle the autonomy seam? -> mk-goal.js lifecycle
- [ ] [G6] What is the /goal command contract (thin-router like .opencode/commands/memory/learn.md; $ARGUMENTS set|show|clear|complete|pause)? -> goal.md
- [ ] [G7] Which state store (flat JSON .goal-state vs sqlite vs spec-kit memory MCP; port thread_goals; key by sessionID)? -> state store decision
- [ ] [G8] Which autonomy tier (passive inject / active continuation via session.idle->session.prompt / +supervisor) and what loop caps + kill-switch? -> decision
- [ ] [G9] How is completion detected (model self-report vs verifiable shell gate vs supervisor model)? -> decision
- [ ] [G10] How to govern budget (token_budget/tokens_used/time_used + usage_limited/budget_limited states)? -> state + lifecycle
- [ ] [G11] How to surface the active goal (inject-every-turn + an mk_goal_status tool) as a substitute for Claude's status-line overlay? -> UX
- [ ] [G12] What status set + scope/keying (per-session thread_id vs global)? -> decision
- [ ] [G13] Should injected goal text pass a prompt-injection sanitizer before entering context (kasper sanitizer idea)? -> safety
- [ ] [G14] SYNTHESIS: the recommended end-to-end design (mk-goal.js + goal.md + state store), chosen autonomy tier with guardrails, and ordered build sub-phases -> research.md

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 14
- [ ] [G1] What is Codex's thread_goals data model + lifecycle (~/.codex/goals_1.sqlite: status enum, token/time budget fields, per-thread key)? -> our goal state model
- [ ] [G2] What exactly does Claude Code /goal (v2.1.139) do (completion condition, autonomous continue-until-met, independent supervisor, status-line overlay)? -> behavior spec
- [ ] [G3] What does the vendored z_future/openhuman reference (thread_goals + goalsApi + ThreadGoalChip) model for goal state + UI? -> reuse ideas
- [ ] [G4] How does OpenCode inject context via experimental.chat.system.transform (the .opencode/plugins/mk-spec-memory.js pattern)? -> mk-goal.js injection
- [ ] [G5] Which OpenCode event/lifecycle hooks (session.created/idle/deleted, message.updated) track + drive a goal; is session.idle the autonomy seam? -> mk-goal.js lifecycle
- [ ] [G6] What is the /goal command contract (thin-router like .opencode/commands/memory/learn.md; $ARGUMENTS set|show|clear|complete|pause)? -> goal.md
- [ ] [G7] Which state store (flat JSON .goal-state vs sqlite vs spec-kit memory MCP; port thread_goals; key by sessionID)? -> state store decision
- [ ] [G8] Which autonomy tier (passive inject / active continuation via session.idle->session.prompt / +supervisor) and what loop caps + kill-switch? -> decision
- [ ] [G9] How is completion detected (model self-report vs verifiable shell gate vs supervisor model)? -> decision
- [ ] [G10] How to govern budget (token_budget/tokens_used/time_used + usage_limited/budget_limited states)? -> state + lifecycle
- [ ] [G11] How to surface the active goal (inject-every-turn + an mk_goal_status tool) as a substitute for Claude's status-line overlay? -> UX
- [ ] [G12] What status set + scope/keying (per-session thread_id vs global)? -> decision
- [ ] [G13] Should injected goal text pass a prompt-injection sanitizer before entering context (kasper sanitizer idea)? -> safety
- [ ] [G14] SYNTHESIS: the recommended end-to-end design (mk-goal.js + goal.md + state store), chosen autonomy tier with guardrails, and ordered build sub-phases -> research.md

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.64 -> 0.69 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
G12: final status set and command behavior for `blocked` versus `paused` versus `usage_limited`.

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
