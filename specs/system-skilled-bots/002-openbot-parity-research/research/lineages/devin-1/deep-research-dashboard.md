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

- Started: 2026-11-24T20:07:11.298Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-devin-1-1795547239490-2piovn
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
| 1 | Frontier node F-1-001 (depth 1, scope OpenBot-main/app, OpenBot-main/desktop, OpenMausBot-main, rakazo-main, openhuman-main, turnstone-main, .skilled/bin/bots.cjs): How do OpenBot and the other reference repos give a team conversations with a bot and an activity feed, and can a terminal or TUI match the OpenBot desktop app for that, or is a desktop shell such as Tauri worth adding? | conversations-activity-terminal | 0.89 | 9 | complete |
| 2 | Frontier node F-1-005 (depth 1, scope OpenBot-main/docs/approvals.md, OpenBot-main/docs/coworkers.md, OpenBot-main/docs/personal-edition.md, .skilled/skills/system-skilled-bots/runtime/lib): How do approvals work in OpenBot and the other repos, and what is the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records? | approvals-small-team | 0.95 | 12 | complete |
| 3 | Frontier node F-2-006 (depth 2, scope openhuman-main/crates/openhuman-tui, OpenBot-main/app/src/components/channels, OpenBot-main/app/src/components/approvals): How does a terminal or TUI present a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying? | terminal-ui | 0.95 | 11 | complete |
| 4 | Frontier node F-2-007 (depth 2, scope OpenBot-main/app/src/lib/groups, OpenBot-main/app/src/lib/bot-lifecycle, .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts): How are conversations persisted and fanned out so several bots can share one thread, and what is the smallest activity record that can be shown after the fact? | conversation-persistence | 0.89 | 10 | complete |
| 5 | Frontier node F-2-008 (depth 2, scope OpenBot-main/app/src/lib/auth, OpenBot-main/docs/architecture.md, turnstone-main/docs/governance.md, .skilled/skills/system-skilled-bots/runtime/lib/identity.ts): What is the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's owner/admin/member split and turnstone's RBAC can be dropped? | small-team-identity | 0.90 | 10 | complete |
| 6 | Frontier node F-2-009 (depth 2, scope OpenBot-main/app/src/components/memory, OpenBot-main/docs, .skilled/skills/system-skilled-bots): How should shared versus per-person memory be scoped when a few people use the same bots, and what does OpenBot's memory model do that skilled bots' per-bot files do not? | memory-skills | 0.90 | 10 | complete |
| 7 | Routines: how OpenBot's sentence-shaped routines, event starts and until outcomes map onto skilled bots' cron, queue and git-hook triggers, and what the smallest change is for a routine list. | routines | 0.95 | 10 | complete |
| 8 | Apps and computer: OpenBot's connectors and vault against MCP and Code Mode, and a bot's computer against skilled bots' worktree isolation. | apps-computer | 0.95 | 12 | complete |
| 9 | Memory and skills mapping onto Skilled skills and the spec-kit: how a bot's learned skill becomes a reviewed SKILL.md and where a spec packet owns it. | skills-spec-kit | 0.90 | 10 | complete |
| 10 | Approvals and activity against our needs-you items, run records and bots status: a direct gap table with the smallest change for each of the two parts. | approvals-activity | 0.85 | 10 | complete |
| 11 | The skip list: enterprise, multi-tenant, Kubernetes, managed upgrades and mobile, each with the evidence that shows why a small team does not need it. | skip-list | 0.90 | 9 | complete |
| 12 | Reuse: code that can be lifted directly, with repository, path and license, ranked by how much of the gap it closes. | reuse-licensing | 0.90 | 10 | complete |
| 13 | Final synthesis: the eight-part gap table with the smallest change, size and risk for each part, followed by a ranked build order. | synthesis | 0.55 | 10 | insight |

- iterationsCompleted: 13
- keyFindings: 137
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] How do OpenBot and the other reference repos give a team conversations with a bot and an activity feed, and can a terminal or TUI match the OpenBot desktop app for that, or is a desktop shell such as Tauri worth adding?
- [x] How do approvals work in OpenBot and the other repos, and what is the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records?
- [x] How does a terminal or TUI present a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying?
- [x] How are conversations persisted and fanned out so several bots can share one thread, and what is the smallest activity record that can be shown after the fact?
- [x] What is the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's owner/admin/member split and turnstone's RBAC can be dropped?
- [x] How should shared versus per-person memory be scoped when a few people use the same bots, and what does OpenBot's memory model do that skilled bots' per-bot files do not?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇███▇▇▇▇▇███▇▇▆▇▇▇▅▁
- score sparkline: ▇███▇▇▇▇▇███▇▇▆▇▇▇▅▁
- Last 3 ratios: 0.90 -> 0.90 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"other":83}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting "which repo has a desktop app" as evidence of a better conversation surface. Electron and Tauri shells in this set mostly wrap the same web UI; the differentiator is the host contract (streaming events, approvals, sessions), not the window toolkit. (iteration 1)
- Looking for a ratatui, bubbletea, textual or ink TUI in every reference repo: only openhuman ships a real terminal frontend (`crates/openhuman-tui`). OpenGhost and OpenMausBot are Electron; buzz and OpenBot are Tauri; hermes-muse is a Hermes dashboard plugin; turnstone and rakazo are web/api workspaces. Repeating this survey per repo would add no new signal. (iteration 1)
- Treating the OpenBot desktop app as the parity target for conversations: its chat UI is the same web app served to the browser, and the Tauri layer's distinctive work is engine/stack management, not chat. (iteration 1)
- Using OpenBot's mobile app as a comparison point. It is explicitly on the topic's skip list. (iteration 1)
- Copying OpenBot's owner/admin/member roles into skilled bots. With no sign-in and no tenant, the roles have nothing to distinguish; the same protection comes from recording who approved what. (iteration 2)
- Copying turnstone's full RBAC and permission-string model. It exists to let an administrator delegate across many users and endpoints, a problem a small team does not have. (iteration 2)
- Looking for an action-level approval hook in skilled bots' runner. The runtime's only pre-execution gate is the definition hash; there is no per-tool policy layer to extend. (iteration 2)
- Treating `bots answer` as an approval system. It continues a parked run; it does not gate an action before it happens. (iteration 2)
- Using OpenBot's admin "Members do it themselves" setting as a template for a role system. It is a per-action-kind switch, not a role. (iteration 2)
- Building a web UI first. Every surface the question names is a list or a transcript, and the runtime already stores both; a browser adds a server and a session layer without adding information. (iteration 3)
- Copying OpenGhost's hand-written drawing engine or OpenMausBot's Electron shell. Both are large UI codebases tied to a desktop runtime. (iteration 3)
- Copying turnstone-console. It solves multi-node cluster visibility, a problem this team does not have. (iteration 3)
- Looking for a routine list in openhuman-tui: it has `/sessions` and `/skills` but no routine concept; OpenBot's four-part row is the better source. (iteration 3)
- Searching openhuman-tui for a separate approvals screen: approvals are overlays and a status control, not a page. The overlay is the model to copy. (iteration 3)
- Building a server-side group transcript with per-bot threads, as OpenBot does. Skilled bots runs one bot per dispatch in a worktree; the file-chain model already preserves attribution without a message server. (iteration 4)
- Looking for a message table in skilled bots' runtime: there is none. Delivery entries record where a result went, not what was said. (iteration 4)
- Looking for an activity view in the status index: it stores rows and flags, not a lifecycle grouping. (iteration 4)
- Reusing OpenBot's channel/member tables directly. They assume a multi-tenant organization and a database, neither of which this team needs. (iteration 4)
- Treating the run record as an activity log. It is one record per run; a conversation needs several messages per run. (iteration 4)
- Adding Better Auth or any identity provider. OpenBot needs it because it serves many organizations over the network; a small team on one host already has an identity in the OS or SSH layer. (iteration 5)
- Copying the owner/admin/member split. Owner and admin are the same authority in OpenBot's own helper, so the three names collapse to two behaviours, and a few people do not need a delegation tree. (iteration 5)
- Copying turnstone's permission strings. They exist to let an administrator compose custom roles across endpoints; a small team needs one gate, not a policy language. (iteration 5)
- Looking for a user table in skilled bots' state root: there is none, only per-identity repository state. (iteration 5)
- Treating the status index as an identity source: it is keyed by repository identity, not by person. (iteration 5)
- Building a memory service or embedding store. The reference set's service-shaped memories (OpenBot Intelligence, openhuman CortexDB) exist to serve many users and machines; a few people on one host do not need recall ranking. (iteration 6)
- Copying OpenBot's per-person Learning containers. They depend on a hosted backend and a skills marketplace; the same value comes from a proposed SKILL.md reviewed in a packet. (iteration 6)
- Giving each bot its own memory schema. The BOT.md contract is already a stable, small frontmatter; memory belongs beside the bot, not inside its definition. (iteration 6)
- Reading OpenBot's memory components (`memories.tsx`, `sources.tsx`) for a data model: they are screens over the API, not the model. (iteration 6)
- Searching skilled bots' runtime for memory code: there is none, and the library README's module table confirms the absence rather than a gap in the search. (iteration 6)
- Copying OpenBot's goal store and subscription tables. The same behaviour comes from a BOT.md field plus the existing queue, without a database. (iteration 7)
- Copying the 15-minute floor and 20-enabled cap as server rules. They are product guardrails for a chat-driven authoring surface; a small team authors bots in files and can see the whole list. (iteration 7)
- Looking for a routine scheduler in skilled bots beyond launchd: cron translation and launchd installation are the whole scheduling layer. (iteration 7)
- Replaying missed windows. OpenBot's stamp model is better than a backlog, and skilled bots' slot accounting already summarizes missed slots instead of running them. (iteration 7)
- Treating the queue as a general event bus. It carries run requests with an idempotency key, not arbitrary events. (iteration 7)
- Building an administrator grant table for apps. With one operator group and a file-defined bot, the bot's own secret allowlist is the grant. (iteration 8)
- Copying OpenBot's browser computer (live screen, take-the-wheel, recorder). It is the largest surface in OpenBot and the least needed by a team whose bots work in repositories. (iteration 8)
- Looking for a vault in skilled bots' runtime: secrets come from the process environment and dotenv files, with literal scanning, not from a store. (iteration 8)
- Looking for an app catalogue in skilled bots: MCP servers are configured outside the bot runtime, in Code Mode's own configuration. (iteration 8)
- Replacing the worktree with a container per bot. The worktree is cheaper, already audited, and the posture matrix already refuses unsafe combinations. (iteration 8)
- Building a skill marketplace or a Learning container. Both exist in OpenBot to distribute skills across many people; a small team installs skills by moving a folder. (iteration 9)
- Giving skills their own storage format. `SKILL.md` with frontmatter already holds everything a proposed skill needs. (iteration 9)
- Looking for a per-person skill scope in the spec-kit: the packet is the scope, not the person. (iteration 9)
- Looking for a skill registry in the bots runtime: there is none; skills live in the Skilled tree, and the bot runtime does not read them. (iteration 9)
- Storing learned skills in the BOT.md body. The body is the standing instruction; a skill is a separate, reviewable, reusable unit. (iteration 9)
- Adding a separate audit database. The run record, delivery entry and result event already form the trail; a second store would be the first place to drift. (iteration 10)
- Adding an OpenBot-style action policy engine. A bot's actions happen inside an executor whose sandbox and posture are already enforced; a second policy layer would duplicate the executor's own permission model. (iteration 10)
- Copying the approvals board as a TUI screen. The board is a filtered list over the inbox; `bots inbox` already lists the same items. (iteration 10)
- Looking for activity in the status index beyond rows and flags: the index is a summary, not an event log. (iteration 10)
- Looking for an audit row in skilled bots' run record: the run record has the outcome and evidence, but not a per-decision row. (iteration 10)
- A "lite" multi-tenant mode. Tenancy is in the URL space and the database schema; a lite version would be a second product. (iteration 11)
- Adopting the Helm chart as the small-team install path. It installs a cluster workload with a management agent and a licence requirement. (iteration 11)
- Looking for a mobile web build in the phone app: it is a native React Native project, not a responsive web page. (iteration 11)
- Looking for a single-user mode in the Kubernetes chart: the personal edition is the single-user mode, and it is explicitly not the chart. (iteration 11)
- Shipping a mobile client before a terminal client exists. The terminal is the stated preference and the smaller build. (iteration 11)
- Copying hermes-muse's kernel state machine. It is MIT but Python and coupled to a host plugin API; the state vocabulary is the reusable part, not the code. (iteration 12)
- Copying OpenBot's React approval cards. The logic is in `shared/`, the cards are presentation tied to the web app. (iteration 12)
- Copying openhuman-tui code. GPL-3.0-only would force the combined work under GPL. (iteration 12)
- Looking for a NOTICE file in OpenBot: there is none, so MIT attribution is the only obligation. (iteration 12)
- Looking for a permissive memory implementation in openhuman: GPL-3.0 rules it out for direct reuse. (iteration 12)
- A desktop-first build. Iteration 1 found that OpenBot's chat surface is the web app and its Tauri layer is engine and update management. (iteration 13)
- A server or database for conversations, memory, skills or activity. Each maps to files the runtime already writes, and the queue already provides atomic claims. (iteration 13)
- Any enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile work (iteration 11). (iteration 13)
- Looking for one OpenBot component that could be lifted wholesale. The value is distributed across small pure modules and policy documents; the UI is not portable. (iteration 13)
- Treating the eight parts as independent. Conversations, activity and approvals share the run record and the actor field; building them in the ranked order avoids writing that record three times. (iteration 13)

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
