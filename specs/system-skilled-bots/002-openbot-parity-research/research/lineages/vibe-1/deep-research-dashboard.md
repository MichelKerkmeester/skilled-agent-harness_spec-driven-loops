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

- Started: 2026-11-24T19:08:19.000Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-vibe-1-1795547239490-2piovn
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
| 1 | Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit? | memory | 1.00 | 11 | complete |
| 2 | Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit? | skills | 1.00 | 14 | complete |
| 3 | Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit? | memory-skills-comparison | 1.00 | 16 | complete |
| 4 | Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit? | memory-skills-comparison | 1.00 | 14 | complete |
| 5 | Frontier node F-1-003 (depth 1, scope OpenBot-main/docs/automatic-learning.md, hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills): How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit? | memory-skills-mapping | 0.78 | 11 | insight |
| 6 | Frontier node F-2-004 (depth 2, scope .skilled/skills/system-skilled-bots/, OpenBot-main/api/openapi/memory.yaml): How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item? | memory-review | 0.91 | 11 | complete |
| 7 | Frontier node F-2-005 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/): What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay? | memory-store | 0.94 | 16 | complete |
| 8 | Frontier node F-2-006 (depth 2, scope OpenBot-main/api/openapi/memory.yaml, .skilled/skills/system-skilled-bots/bots-schedule): How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers? | memory-sync | 0.91 | 16 | complete |
| 9 | Frontier node F-2-007 (depth 2, scope hermes-muse-main/skills): What does the hermes-muse skills/companion format look like, and is it liftable as a skill store? | skill-store | 0.88 | 16 | complete |
| 10 | Frontier node F-2-008 (depth 2, scope OpenBot-main/api/openapi/learning.yaml, .skilled/skills): How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal? | skill-proposal | 0.86 | 18 | complete |
| 11 | Terminal versus desktop: can a CLI or TUI give the OpenBot app experience (conversations, approvals inbox, activity feed, routine list), and what would a desktop shell add that a terminal cannot? | terminal-vs-desktop | 0.89 | 18 | complete |
| 12 | The small-team model: who can talk to, approve for and change a bot, whether memory is shared or per-person, and the smallest sign-in and roles model that works for a few people on one machine or a shared host. | small-team | 0.83 | 18 | complete |
| 13 | The skip list and the reuse inventory: which enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parts to leave out with a reason each, and which code is liftable with repo, path and license. | skip-list-and-reuse | 0.87 | 18 | complete |

- iterationsCompleted: 13
- keyFindings: 197
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- [x] How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?
- [x] What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?
- [x] How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?
- [x] What does the hermes-muse skills/companion format look like, and is it liftable as a skill store?
- [x] How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████▇▂▃▅▆▆▅▅▄▄▄▄▃▃▄
- score sparkline: █████▇▂▃▅▆▆▅▅▄▄▄▄▃▃▄
- Last 3 ratios: 0.89 -> 0.83 -> 0.87
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.87
- coverageBySources: {"code":171,"other":29}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading the generated TypeScript client under `app/src/lib/api/generated/memory/` as the model source. It is generated from `api/openapi/memory.yaml`, so the spec is the authority and the client adds no semantics. (iteration 1)
- Searching for a memory implementation directory under `api/` returned only `api/openapi/memory.yaml`. OpenBot's memory server code is not in this reference checkout, so the model must be read from the spec and docs. This bounds how far "how it is built" can be answered for memory: the contract is available, the implementation is not. (iteration 1)
- Treating `formedBy: intelligence` as a fourth memory scope. It is a provenance value for a fact the backend holds that OpenBot formed no record of, and the schema says such a fact "can be edited or forgotten but not paused" — a storage-origin distinction, not a scope. (iteration 1)
- Modelling the three origins as three storage locations. All three produce the same `Skill` record; only the proposal path adds a staging row, so the origin is provenance rather than a separate store. (iteration 2)
- Searching `skills.yaml` for a "taught" or "recorded" origin field returned nothing. The recorded-from-a-demonstration origin is not a field on `Skill`; it is a Learning path that ends in the same record. Any design that adds an `origin` column to a skill store is inventing a distinction OpenBot does not persist. (iteration 2)
- Treating `tools` on a skill as a capability grant. The schema says naming an action gives no bot access to it, so a skill cannot be used to escalate a bot's reach and does not need a grant check at approval time. (iteration 2)
- Building a second memory store beside the host's. hermes-muse explicitly declines to, and the reason is structural: two stores drift and the model cannot tell which is authoritative. (iteration 3)
- Copying hermes-muse's `SKILL.md` frontmatter as a skill record. It carries three fields and no scoping, so it cannot express who may use a skill or which bot offers it; the OpenBot `Skill` record is the better shape and the Skilled `SKILL.md` frontmatter is already richer. (iteration 3)
- Looking for a skill-proposal or skill-review path in hermes-muse. There is none: its one skill is hand-authored and shipped, so it offers no evidence for the "proposed from use" origin. That origin has to be answered from OpenBot and from Skilled's own spec-kit, not from this repo. (iteration 3)
- Copying openhuman's memory subsystem. It is a vendored engine with a job queue, a document brain and a source registry, and it is GPL-3.0. For a small team it is the wrong size and the wrong licence. (iteration 4)
- Looking for a skill-proposal path in OpenGhost. Its skills are discovered from folders and installed from a link; there is no proposal queue. The "proposed from use" origin remains an OpenBot-only pattern in this repo set. (iteration 4)
- Treating OpenGhost's `by` field as a review gate. An agent-written record is live at once; the user's control is edit and remove, not approve. That is a different trust posture from OpenBot's `reviewState` and the difference matters for the recommendation. (iteration 4)
- A separate shared-memory store and per-bot memory store. No reference repo does it, and it doubles the write path for no gain. (iteration 5)
- Building the "recorded from a demonstration" origin. It needs a recorder, a container per person and an external analysis service, which is the enterprise shape D3 puts on the skip list. (iteration 5)
- Copying OpenBot's `reviewState` as a three-value enum with an `edited` state. Two values (`unreviewed`, `confirmed`) carry the gate; `edited` is a UI affordance, not a recall rule. (iteration 5)
- Searching Skilled for an existing memory store to extend. There is none: the only continuity surface is the spec-kit's per-packet `handover.md` and `_memory.continuity`, which is per-packet, not per-person or per-bot. The gap is real and cannot be closed by configuration. (iteration 5)
- A separate review UI. `bots inbox` already lists open items and `bots answer` already resolves them; a second surface would be the "two pages answering the same question" that OpenBot's own rules forbid. (iteration 6)
- Adding a third `edited` review state. The answer text already carries the rewrite, so a third state would need its own transition rules for no recall benefit. (iteration 6)
- Looking for a non-holding item class in `needs-you.ts`. There is none: `holdForBot` returns a hold for any open item of the bot, so a non-holding review item is a new shape rather than a configuration of the existing one. (iteration 6)
- Reusing `NeedsYouItem` verbatim for memory review. Its `id` is the run id and its open state holds the bot, so a single unreviewed fact would stop every later run of that bot. (iteration 6)
- A second SQLite database for memory. The index is SQLite because it answers cross-identity queries; memory is read whole by one bot at a time, so a database would add a schema and a migration for no query benefit. (iteration 7)
- Keying memory by repository identity only. That is what the runtime does today, and it makes a person's facts vanish when they move to another checkout. (iteration 7)
- Looking for an existing per-person key to hang memory on. There is none: `identityKey` is derived from `owner/name`, and no other identity dimension exists in the runtime. (iteration 7)
- One JSON file per fact, matching `records/` and `needs-you/`. A memory of a few hundred facts would become a few hundred files, and recall would read the whole folder on every run. (iteration 7)
- One JSONL per person. The runtime's atomic write helper is whole-file, so JSONL buys nothing and costs a new append path plus a line-level parser. (iteration 7)
- A fifth trigger kind for memory sync. The four kinds already cover a timed read-in, and a new kind would need its own validation, install path and drift rule. (iteration 8)
- A separate sync scheduler beside the drain job. The drain job already runs on a throttle with backoff and already claims requests from the inbox. (iteration 8)
- Looking for a next-fire calculator in the runtime. There is none by design: `NEXT_FIRE_UNKNOWN` is the only value the installer ever reports for `nextFire`. (iteration 8)
- Storing `nextSyncAt` as a computed timestamp. The runtime deliberately reports `UNKNOWN` for a next fire because no launchd surface reports one, so a stored value would be a guess that goes stale. (iteration 8)
- Storing `syncStatus` as a field. Every one of its four values is already readable from the queue and the last run record, so a stored copy could disagree with them. (iteration 8)
- A database-backed skill store. hermes-muse keeps skills as markdown and state in SQLite, and the skill is explicitly forbidden to hand-edit that database; a skill store in a database would invert that split. (iteration 9)
- A new frontmatter schema. Skilled's five keys already cover what the companion's three do, and adding a key would need a discovery-rule change for no gain. (iteration 9)
- A separate proposal UI. hermes-muse reviews a staged write with a slash command and an id, which is the same shape as `bots inbox` plus `bots answer`. (iteration 9)
- Lifting the companion folder as a template. Its 21 references are all Muse domain pages (goals, dispatch, proactivity, sources, calendar, weather, feed, briefings), so copying the folder would import a domain, not a format. (iteration 9)
- Searching hermes-muse for a skill-proposal or skill-creation mechanism. There is none: the companion skill is authored, never generated, and the only staged-write path is for memory. (iteration 9)
- A new review command beside `bots answer`. The needs-you item already carries a question, options, an answer and evidence, which is the whole proposal review. (iteration 10)
- Applying a proposal without the skill-advisor's trusted mutation path. That path is the only write the advisor trusts, and a second write path would bypass its gate. (iteration 10)
- Embedding evidence in the proposal. OpenBot serves evidence from its own endpoint so a reviewer reads it on demand; embedding it would make every proposal carry its whole transcript. (iteration 10)
- Looking for an existing proposal or draft mechanism in `.skilled/skills/`. There is none: skills are authored directly, and the only staged-write pattern in the tree is the needs-you item. (iteration 10)
- Storing `status` as a field on the proposal. Every value is readable from the answer and the applied skill, so a stored copy could disagree with them, which is the same failure the needs-you item avoids. (iteration 10)
- A web UI served from the CLI. The TUI needs no HTTP server or sidecar, and a served UI would add a port, a session and a browser to a tool that already runs in the terminal. (iteration 11)
- Building a Tauri shell first. OpenBot's native side exists to install and supervise Compose, and a runtime that boots in-process has nothing to install or supervise. (iteration 11)
- Copying openhuman's four tabs as-is. Logs, Chat, Config and Settings are its own split; the OpenBot surfaces are conversations, approvals, activity and routines. (iteration 11)
- Searching the other seven repos for a terminal UI. Only openhuman ships one; OpenBot, buzz and openhuman's own app are Tauri, and OpenGhost and hermes-muse are desktop shells. (iteration 11)
- Treating the terminal as a reduced client. openhuman's TUI drives the same `web_chat` surface as its desktop app, so the surface is shared rather than reimplemented. (iteration 11)
- A session token or cookie. The state root's owner and mode already decide who can read and write, and a token would be a second authority that can disagree with the filesystem. (iteration 12)
- Building sign-in. OpenBot's own single-person install has none, and a few people on one machine already have an OS identity that a session would only duplicate. (iteration 12)
- Looking for a role or permission check anywhere in the runtime. There is none: `bots answer` writes the answer after a secret check and nothing else. (iteration 12)
- Per-bot memory ownership. OpenBot scopes memory to the person and the organization, and a per-bot store would make a person's facts disappear when the bot is renamed. (iteration 12)
- Three roles. `admin` governs people, sign-in and policy; with no sign-in there is nothing for it to govern, so it collapses into `owner`. (iteration 12)
- Building the terminal client first. It would draw four empty surfaces until the memory, review, proposal and routine items exist. (iteration 13)
- Keeping the multi-tenant memory scope. A small team is one organization, so the second scope would be a branch nothing takes. (iteration 13)
- Lifting OpenBot's desktop shell. Its native side installs and supervises Compose, which this runtime does not have. (iteration 13)
- Lifting openhuman's TUI code. GPL-3.0 cannot be relicensed into this tree, so only the shape transfers. (iteration 13)
- Looking for a permissively licensed terminal client to lift. The only one in the set is openhuman's, and it is GPL-3.0. (iteration 13)

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
- Frontier size: 9 nodes (0 open, 0 active, 6 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 3
- Revisits: 4
- Budget depth1: 5 of 6.5 iterations spent
- Budget depth2: 5 of 6.05 iterations spent
- Budget depth3: 0 of 3 iterations spent

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
