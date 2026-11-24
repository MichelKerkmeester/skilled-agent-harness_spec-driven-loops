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
- Topic: OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's.

Inputs (read-only): eight reference repos under specs/system-skilled-bots/context/ (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under .skilled/skills/system-skilled-bots/ (BOT.md definitions, bots CLI at .skilled/bin/bots.cjs, manual/queue/git-hook/launchd triggers, needs-you items, worktree isolation, desktop delivery, status index).

OpenBot frames a bot as eight parts in four pairs (OpenBot-main/docs/how-openbot-works.md): conversations and routines, memory and skills, apps and computer, approvals and activity. For each of the eight parts answer: what OpenBot does and how it is built; what the other seven repos do better or more simply; what skilled bots has today; and the smallest change that closes the gap, with its size and risk.

Also answer:
1. Terminal versus desktop: can a CLI or TUI give the OpenBot app experience (conversations with a bot, an approvals inbox, an activity feed, a routine list)? Which repos ship a terminal UI or a desktop shell worth copying, and what would a desktop shell (OpenBot uses Tauri) add that a terminal cannot?
2. Conversations: interactive chat with a bot and its memory from the terminal, including several bots in one conversation.
3. Routines: routines written as sentences, event starts (new mail, a pull request) and "until" outcomes, mapped onto our cron, queue and git-hook triggers.
4. Memory and skills: per-bot and shared memory, skills recorded or proposed from use, and how they map onto Skilled skills and the spec-kit.
5. Apps and computer: connectors and a secret vault against our MCP and Code Mode, and a bot's computer against our worktrees.
6. Approvals and activity against our needs-you items, run records and bots status.
7. Small team: who can talk to, approve for and change a bot; shared versus per-person memory; the smallest sign-in and roles model that works for a few people on one machine or a shared host.
8. A skip list: enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts we do not need, each with its reason.
9. Reuse: code we can lift directly, with repo, path and license.

Cite every claim with [SOURCE: path:line]. End with a ranked build order a first build packet can start from.
- Started: 2026-11-24T20:07:00.000Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-devin-2-1795547239490-2piovn
- Parent Session: 2026-11-24T19:07:11.298Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-002 (depth 1, scope OpenBot-main/docs/routines.md, hermes-muse-main, buzz-main, .skilled/skills/system-skilled-bots/runtime/lib): How do OpenBot routines (sentence form, time and event starts, act or tell, until an outcome) and the other repos' schedulers map onto skilled bots' cron, queue and git-hook triggers, and what is the smallest change that closes the gap? | routines | 0.90 | 10 | complete |
| 2 | Frontier node F-1-006 (depth 1, scope OpenBot-main/docs/deployment.md, OpenBot-main/docs/kubernetes-upgrades.md, every repo's LICENSE): Which OpenBot parts does a small team not need (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), which code in the eight repos can be reused directly under its license, and what ranked build order should a first build packet follow? | reuse-and-scope | 0.85 | 10 | complete |
| 3 | Frontier node F-2-007 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/definition.ts, runner.ts): How should a routine's until outcome be evaluated after each run from an existing BOT.md precheck or stop expression, without adding a scheduler? | routines | 0.90 | 8 | complete |
| 4 | Frontier node F-2-008 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts, definition.ts): What is the smallest deterministic sentence-to-trigger planner that maps routine text onto cron, queue and git-hook kinds? | routines | 0.90 | 8 | complete |
| 5 | Frontier node F-2-009 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts, request-queue.ts, slot-accounting.ts): How should missed routine windows and a 15-minute floor map onto launchd calendar entries and the queue drain's retry bound? | routines | 0.90 | 8 | complete |
| 6 | Frontier node F-2-010 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts, status-index.ts, switches.ts): Which OpenBot routine guardrails, the 20-enabled cap and failure-streak auto-off, belong in run records and the status index for a small team? | routines | 0.90 | 8 | complete |
| 7 | Approvals and activity: how OpenBot's approval rules and activity record compare with skilled bots' needs-you items, run records and bots status, and what the smallest terminal approvals inbox and activity feed would be. | approvals-and-activity | 0.90 | 8 | complete |
| 8 | Conversations: how a terminal chat with a bot and its memory could reuse the bots CLI, run records and needs-you resume path, and which repos ship a terminal UI or conversation shell worth copying. | conversations | 0.90 | 8 | complete |
| 9 | Memory and skills: how OpenBot's per-bot and shared memory and its three ways of recording a skill map onto Skilled's skills and the spec-kit, and what the smallest per-bot and shared memory store would be. | memory-and-skills | 0.90 | 9 | complete |
| 10 | Apps and computer: how OpenBot's connectors and secret vault compare with MCP and Code Mode, and how a Bot's computer compares with the existing worktree isolation. | apps-and-computer | 0.90 | 10 | complete |
| 11 | The small-team model: who can talk to, approve for and change a Bot, shared versus per-person memory, and the smallest sign-in and roles model for a few people on one machine or a shared host. | small-team | 0.90 | 10 | complete |
| 12 | Terminal versus desktop: whether a CLI or TUI can give the OpenBot app experience (conversations, approvals inbox, activity feed, routine list), which repos ship a terminal UI or desktop shell worth copying, and what a Tauri desktop shell adds that a terminal cannot. | terminal-vs-desktop | 0.90 | 8 | complete |
| 13 | The final gap matrix: consolidate the eight parts, the terminal-versus-desktop answer, the skip list and the reuse list into a ranked build order a first build packet can start from, and name the smallest change, size and risk for each part. | synthesis | 0.70 | 14 | complete |

- iterationsCompleted: 13
- keyFindings: 119
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] How do OpenBot routines (sentence form, time and event starts, act or tell, until an outcome) and the other repos' schedulers map onto skilled bots' cron, queue and git-hook triggers, and what is the smallest change that closes the gap?
- [x] Which OpenBot parts does a small team not need (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), which code in the eight repos can be reused directly under its license, and what ranked build order should a first build packet follow?
- [x] How should a routine's until outcome be evaluated after each run from an existing BOT.md precheck or stop expression, without adding a scheduler?
- [x] What is the smallest deterministic sentence-to-trigger planner that maps routine text onto cron, queue and git-hook kinds?
- [x] How should missed routine windows and a 15-minute floor map onto launchd calendar entries and the queue drain's retry bound?
- [x] Which OpenBot routine guardrails, the 20-enabled cap and failure-streak auto-off, belong in run records and the status index for a small team?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇███████████████▅▁
- score sparkline: █▇▇███████████████▅▁
- Last 3 ratios: 0.90 -> 0.90 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":144}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope. (iteration 1)
- Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team. (iteration 1)
- Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table. (iteration 1)
- Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model. (iteration 1)
- Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks. (iteration 1)
- A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed. (iteration 2)
- Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have. (iteration 2)
- Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use. (iteration 2)
- Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only. (iteration 2)
- Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported. (iteration 2)
- Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals. (iteration 3)
- Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation. (iteration 3)
- Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today. (iteration 3)
- Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine. (iteration 3)
- Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields. (iteration 3)
- Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`. (iteration 4)
- Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers. (iteration 4)
- Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend. (iteration 4)
- Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity. (iteration 4)
- Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover. (iteration 4)
- Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence. (iteration 5)
- Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window. (iteration 5)
- Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst. (iteration 5)
- Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions. (iteration 5)
- Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts. (iteration 5)
- Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records. (iteration 6)
- Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped. (iteration 6)
- Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure. (iteration 6)
- Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior. (iteration 6)
- Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs. (iteration 6)
- Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them. (iteration 7)
- Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface. (iteration 7)
- Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take. (iteration 7)
- Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers. (iteration 7)
- Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events. (iteration 7)
- Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives. (iteration 8)
- Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only. (iteration 8)
- Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store. (iteration 8)
- Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface. (iteration 8)
- Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history. (iteration 8)
- Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need. (iteration 9)
- Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs. (iteration 9)
- Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact. (iteration 9)
- Searching BOT.md for a memory or skill key found none; the definition has no such surface today. (iteration 9)
- Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge. (iteration 9)
- Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files. (iteration 10)
- Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery. (iteration 10)
- Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out. (iteration 10)
- Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface. (iteration 10)
- Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login. (iteration 10)
- Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat. (iteration 11)
- Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs. (iteration 11)
- Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend. (iteration 11)
- Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others. (iteration 11)
- Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model. (iteration 11)
- Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives. (iteration 12)
- Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope. (iteration 12)
- Lifting openhuman-tui code: GPL-3.0 makes it a design reference only. (iteration 12)
- Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo. (iteration 12)
- Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser. (iteration 12)
- A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify. (iteration 13)
- Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding. (iteration 13)
- Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did. (iteration 13)
- Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not. (iteration 13)
- Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install. (iteration 13)

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
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 6 nodes (0 open, 0 active, 6 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 2 of 6.5 iterations spent
- Budget depth2: 4 of 9.05 iterations spent
- Budget depth3: 0 of 7 iterations spent

<!-- /ANCHOR:frontier -->
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
