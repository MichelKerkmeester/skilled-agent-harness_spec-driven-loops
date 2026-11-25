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

- Started: 2026-11-24T20:08:00.000Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-vibe-2-1795547239490-2piovn
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
| 1 | Frontier node F-1-004 (depth 1, scope OpenBot-main/api, OpenBot-main/docs/configuration.md, turnstone-main, OpenMausBot-main, rakazo-main, .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts): How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation? | apps-and-computer | 1.00 | 10 | complete |
| 2 | Frontier node F-2-005 (depth 2, scope OpenBot-main/app/src/components/vault, OpenBot-main/app/src/components/manage, OpenBot-main/api/openapi.yaml): How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use? | apps-and-computer | 0.90 | 10 | complete |
| 3 | Frontier node F-2-006 (depth 2, scope OpenBot-main/api/openapi.yaml, OpenBot-main/app/src/components/connections): How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it? | apps-and-computer | 0.95 | 10 | complete |
| 4 | Frontier node F-2-007 (depth 2, scope OpenBot-main/shared/computer-token.ts, OpenBot-main/shared/computer-start.ts, OpenBot-main/shared/bot-browser.ts): How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team? | apps-and-computer | 1.00 | 11 | complete |
| 5 | Frontier node F-2-008 (depth 2, scope turnstone-main, OpenMausBot-main, rakazo-main): What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy? | apps-and-computer | 1.00 | 12 | complete |
| 6 | Frontier node F-3-009 (depth 3, scope .skilled/skills/system-skilled-bots/runtime/lib, .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts, .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts): What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record? | apps-and-computer | 0.85 | 10 | insight |
| 7 | Connector registry design: the smallest way for skilled bots to name a bot's apps, grant them per bot and record each use, on top of MCP and Code Mode, without building an OAuth server | apps-and-computer | 0.90 | 10 | insight |
| 8 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.85 | 11 | insight |
| 9 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.80 | 10 | insight |
| 10 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.75 | 10 | insight |
| 11 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.80 | 10 | insight |
| 12 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.85 | 8 | insight |
| 13 | Bot computer design beyond a worktree: what a terminal genuinely cannot give, and the smallest addition that closes the gap, given that skilled bots already keeps a per-run folder with retention and that only two executor kinds give an OS-level sandbox | apps-and-computer | 0.60 | 8 | insight |

- iterationsCompleted: 13
- keyFindings: 130
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?
- [x] How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use?
- [x] How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it?
- [x] How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team?
- [x] What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?
- [x] What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▇███▇▅▆▆▅▅▄▄▄▅▅▄▁
- score sparkline: █▇▆▇███▇▅▆▆▅▅▄▄▄▅▅▄▁
- Last 3 ratios: 0.80 -> 0.85 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":152,"other":12}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading `OpenBot-main/docs/configuration.md` for the vault: the file is 130 KB of deployment configuration and contains no vault section, so the vault's shape had to come from the app components and the API instead. (iteration 1)
- Searching for a `vault/` or `secret/` directory at the repo root of `OpenBot-main` returns nothing; the vault lives in `app/src/components/vault/` and `app/src/components/manage/`, and the server side is behind the API rather than a named module. (iteration 1)
- Treating `posture.secrets` as an existing feature: grepping the runtime for `secrets` returns only the definition field and the leak guard, so there is nothing to compare against yet. (iteration 1)
- `app/src/components/manage/credentials-page.tsx` is the admin view of the same credential list, not a second store; reading it added the noun split ("key" in the personal edition, "credential" in the team edition) and nothing else. (iteration 2)
- Looking for a client-side decryption path: every read endpoint returns metadata only, so there is nothing to decrypt in the app. The secret never leaves the server except into a page field. (iteration 2)
- Treating "saved login" and "credential" as one store: they have different owners, different permissions and different use paths, so a parity build needs both or an explicit decision to ship one. (iteration 2)
- `app/src/components/connections` is a UI surface over the same endpoints; it added no new contract facts beyond the three connect outcomes already in the API description. (iteration 3)
- Looking for a refresh-token endpoint: there is none. Refresh is implicit in the connection record plus `confirmConnection` and `recheck`, which re-ask the app rather than rotating a token the client holds. (iteration 3)
- Treating the OAuth client as the normal path: it is the exception for vendors that refuse dynamic registration, so a parity build should not start there. (iteration 3)
- Assuming gVisor is the boundary: it is opt-in, and the documented default is an ordinary container sharing the host kernel. The real boundary is the container plus the per-computer token. (iteration 4)
- Searching for a `supervisor/` or `agent-computer/` directory in this checkout: both are published images referenced by name, so their source is not here. The compose file's comments are the contract, and they are unusually explicit about why each setting exists. (iteration 4)
- Treating the computer as a sandbox mode: it is a separate service with its own image, entrypoint, volumes and token. A sandbox flag on an executor cannot stand in for it. (iteration 4)
- Copying OpenMausBot's computer: it is an Electron desktop shell driving a native CUA driver, which is the desktop path D4 deprioritises and the largest possible lift. (iteration 5)
- Copying turnstone's OAuth stack wholesale: it is a Python service with a Fernet keyring and a per-server admin form, sized for a multi-node deployment rather than a few people on one host. (iteration 5)
- Looking for a shared "vault" module across the three: each solves it differently (Postgres table, Fernet store, external password manager), so there is no single thing to lift. The reusable part is the *shape*, not the code. (iteration 5)
- Treating any of the three as a connector catalogue: none ships a catalogue of apps; rakazo and turnstone both assume you bring the service, and OpenMausBot assumes you bring the password manager. (iteration 5)
- A page-field injection like OpenBot's masked box: skilled bots has no browser, so there is no field to fill. The command variable is the equivalent primitive. (iteration 6)
- A proxy-injection like rakazo's `secret_request`: it needs a server that makes the outbound call, which skilled bots does not have and a small team does not need. (iteration 6)
- An external password manager like OpenMausBot's Bitwarden: it adds a service, a CLI dependency and a sync loop for a team of a few people. (iteration 6)
- Looking for an existing encryption helper in the runtime: there is none, so the key handling has to be specified rather than reused. Turnstone's config-only rule is the cheapest correct answer. (iteration 6)
- A connector catalogue: none of the eight repos ships one that a small team would use, and the UTCP config already names the servers this team actually has. (iteration 7)
- Building an OAuth server: it is the largest single piece of OpenBot's app layer and the one a small team can skip, because a shared account or a key covers the common case. (iteration 7)
- Looking for an existing per-bot MCP filter: there is none. The launcher is a pass-through, so the filter has to be added at the config-file level rather than inside the launcher. (iteration 7)
- Per-person connections: they need a sign-in surface and a session store. A small team on one host can share one account per app, which is OpenBot's own `shared` account mode. (iteration 7)
- A per-bot container: it is the largest piece of OpenBot's computer and it exists to serve a browser farm. A small team runs one bot at a time on one machine. (iteration 8)
- A profiles volume: the operator's own browser profile is the profiles volume, and it is already logged in. (iteration 8)
- gVisor: OpenBot itself leaves it unset by default, and the executor kinds that matter already give an OS boundary. (iteration 8)
- Looking for a browser capability in the executor matrix: there is none. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` covers web *search*, not a browser, so a headed browser is not something any executor kind can be asked for. (iteration 8)
- A new delivery channel for approvals: `desktop` is the only channel and it does not acknowledge, so the honest move is to fix the acknowledgement rather than add a channel. (iteration 9)
- Adding a `grants` table to the status index: the index is a projection of files, and a grant is already in the run record, so a table would be a second source of truth for the same fact. (iteration 9)
- Building memory now: it couples to nothing, so it can be added at any time and should be added last. (iteration 9)
- Looking for a memory module under a different name (`context`, `notes`, `knowledge`): the runtime has none. The nearest thing is the spec-kit's own packet documents, which are per-spec rather than per-bot. (iteration 9)
- A browser inside the product: the operator's own browser already has the logins, which is what OpenBot's profiles volume exists to preserve. (iteration 10)
- A Tauri shell: it wraps a web app that does not exist, and its value is packaging rather than capability. (iteration 10)
- Building a TUI now: the four surfaces are four verbs, and a TUI over `status --json` is a rendering exercise that can follow the stores rather than precede them. (iteration 10)
- Looking for a terminal UI in the other seven repos: none ships one. OpenMausBot is Electron, OpenBot is Tauri plus a web app, and the rest are servers or CLIs without a TUI. (iteration 10)
- A sign-in system: it would be a second identity beside the one every path already uses, and the first thing it would have to do is agree with `identityKey`. (iteration 11)
- Looking for a per-person key in the state root: there is none. `identityStatePaths` keys by identity only, and `retired` records identities rather than people. (iteration 11)
- Per-person secret stores: they would break the shared-account case, which is the common case for a small team and is OpenBot's own `shared` account mode. (iteration 11)
- Three roles: OpenBot's own `owner` is not assignable, so a small team's two roles are the same shape with the deployment owner implicit. (iteration 11)
- Copying OpenBot's connection registry: it is an OpenAPI description of a server this product does not have, so the shape transfers and the code does not. (iteration 12)
- Lifting anything from openhuman: GPL-3.0 is copyleft, and a permissive product cannot absorb it. (iteration 12)
- Lifting turnstone's OAuth runtime: it is Python, and the per-user path is dark by default, so the rule is worth more than the code. (iteration 12)
- Looking for a TypeScript secret store in OpenBot: there is none. OpenBot's vault is server-side and its client only renders forms, so the only liftable TypeScript store in the eight repos is rakazo's. (iteration 12)
- Building all four slices as one packet: the first two prove the design, and the last two depend on what the first two learn about the run record. (iteration 13)
- Building memory in this packet: it is another pair's share and it couples to nothing here. (iteration 13)
- Looking for a dependency that forces the secret store before the connector registry: there is none. The two share only the `grants` field, which is slice 4 and can land after both. (iteration 13)
- Starting with the secret store: it is the largest slice and the only one that can leak, so starting there puts the risk first and the proof last. (iteration 13)

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
- Budget depth1: 1 of 6.5 iterations spent
- Budget depth2: 4 of 10.05 iterations spent
- Budget depth3: 1 of 8 iterations spent

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
