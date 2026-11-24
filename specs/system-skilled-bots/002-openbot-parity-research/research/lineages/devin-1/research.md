# OpenBot Parity for Skilled Bots — Research Synthesis

Research topic: get as close to OpenBot as a small team needs, with no extras, preferring a terminal or CLI experience over a desktop app where it can match OpenBot's. This file is the canonical synthesis of the devin-1 research lineage (13 iterations). Every claim cites a repository path and line; derived statements are marked `[INFERENCE: ...]`.

## 1. Executive Summary

A small team does not need OpenBot's application, its server, its database or its desktop shell. It needs OpenBot's *model*: eight parts in four pairs, an ordered approval policy, and an audit record written before an action. Skilled bots already has the hard half — an approved-definition gate, a file queue with atomic claims, worktree isolation, a needs-you decision primitive, and an authorized, idempotent result ledger. What it lacks is a human surface and three small records: a conversation, an actor, and an activity view. The smallest path to parity is a terminal front end over the files the runtime already writes, plus one optional `until:` outcome in BOT.md. No part requires a desktop shell; a Tauri app is the last item and only if the terminal proves insufficient.

## 2. Research Question and Scope

The ask has three layers: for each of OpenBot's eight parts, state what OpenBot does, what the other seven reference repos do better or more simply, what skilled bots has today, and the smallest change that closes the gap with its size and risk; answer nine additional questions (terminal versus desktop, conversations, routines, memory and skills, apps and computer, approvals and activity, the small-team model, a skip list, and reuse); and end with a ranked build order. Scope is a small team on one machine or a shared host, terminal preferred. Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile work are explicitly excluded.

## 3. Method and Evidence Base

Thirteen iterations of primary-source reading: OpenBot's docs and its app, desktop and shared code; the seven other reference repos (OpenMausBot, rakazo, openhuman, OpenGhost, hermes-muse, turnstone, buzz); and the built skilled-bots runtime under `.skilled/skills/system-skilled-bots/`. Every finding carries a `[SOURCE: path:line]` marker; synthesis statements are marked `[INFERENCE: ...]`. Frontier nodes F-1-001 and F-1-005 and their four children (F-2-006 to F-2-009) were answered before coverage-driven iterations took over. No source was modified.

## 4. The Frame: Eight Parts in Four Pairs

OpenBot describes a bot as eight things in four pairs: Conversations and Routines (how work is given and when it runs by itself), Memory and Skills (what it knows and what it knows how to do), Apps and Computer (what it can reach and where it acts), Approvals and Activity (when it stops to ask and what it did). Anything else is a kind of one of these or a setting of one. The order is fixed: Conversations, Routines, Memory, Skills, Apps, Computer, Approvals, Activity. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:6-18] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:168]

## 5. Conversations and Activity

**OpenBot.** Conversations are server-owned transcripts. One conversation can hold several bots: the person posts once, `@Name` addresses one bot, otherwise every addressed bot runs through the headless AG-UI path one after another, and each bot answers in its own attributed thread. A group message carries author, status, `answeredBy`, a consent record and attachments, and the transcript draws the newest 200 lines. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx:42-48] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts:10-31]

Activity is the after-the-fact record, a typed lifecycle view (routine, responsibility, handoff and related kinds) opened from a bot's page, with links back to what produced each entry. Its grouping is a pure function over the bot's activity and the person's tasks, with seven groups in fixed order: needs_you, working, scheduled, done, stopped, failed, recurring. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/bot-profile/activity.tsx:67-79] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:6-45]

**Other repos.** openhuman ships the only real terminal front end: `openhuman-tui`, a conversation-first ratatui and crossterm program that embeds the core in-process, consumes the same `web_chat` event stream as its desktop app, and exposes sessions, permissions, skills, MCP, artifacts and diagnostics as slash commands. It is GPL-3.0-only, so it is a design reference, not liftable code. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:3-9] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/app.rs:8-10] [SOURCE: specs/system-skilled-bots/context/openhuman-main/Cargo.toml:35]

**Skilled bots today.** No conversation surface. The `bots` CLI exposes run, disable, enable, pause, resume, inbox, enqueue, drain, schedule, answer and status; `answer` continues a needs-you item and `status` reports last run, delivery and open items from the status index. [SOURCE: .skilled/bin/bots.cjs:19-50]

**Smallest change.** A `bots chat` command rendering a transcript from run records, plus one `conversation` id on the request and one message row per human message, delivery and answer, written by the same atomic state writer the queue uses. A `bots activity` read over run records, delivery entries and result events, grouped with OpenBot's seven ids. Size M and S, risk low.

## 6. Routines

**OpenBot.** A routine is one sentence in four parts: What, Starts, Does, Until. Goals and check-ins are the same list: a goal is a routine with an outcome, a check-in a routine that only tells you. `planRoutine` returns exactly three shapes — routine, goal (with optional schedule and `runNow`), or check-in — and event starts are subscriptions of `{source, eventType}` on a goal. OpenBot bounds standing work with a 15-minute floor, a 20-enabled cap, a fatigue rule (one failure message, ten consecutive failures switch it off) and skipped rather than replayed missed windows. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:12-28] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:14-40] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:110-145]

**Other repos.** hermes-muse runs owned cron jobs with a state machine and delivery ledger, which is more machinery than a few people need. Turnstone's scheduled tasks are server-side workstreams, not a bot file. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/AGENTS.md:1-20]

**Skilled bots today.** Triggers are cron, queue, git-hook and manual. Cron translation is exact by construction: every cron string either becomes launchd calendar dictionaries that fire exactly as cron or is refused with a named invariant. The drain is a strict router: claim by rename, quarantine refusals, never replay a paused or held request, retry to three, stop the pass on a setup fault with the request returned. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:3-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-38] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:3-20]

**Smallest change.** What → the BOT.md body; Starts at a time → cron; Starts on an event → a queue trigger fed by a small producer; Does only tell → local-only delivery; Until you stop it → the disabled switch. Until an outcome needs one optional `until:` block (outcome sentence plus check command) and a runner rule that parks or stops when the check passes. A `bots routines` list is a read over BOT.md files and the status index. Size M, risk medium (the completion check can loop or stop early).

## 7. Memory

**OpenBot.** Personal memory exists only in the team edition; the personal edition has none because local Intelligence is licensed without it. Facts a person adds are shared with all their bots; facts a bot picks up stay with that bot. OpenBot keeps the provenance its backend lacks — origin, review state, forming bot, importing source — and applies it before a bot sees anything; a bot-formed memory reaches only the forming bot while it holds the source app, and project-scoped results are dropped. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:370-383] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:61-62]

**Other repos.** Turnstone's structured memory is the cleanest small model: four types (user, general, feedback, reference), five scopes (global, workstream, user, coordinator, project), identity tuple `(name, scope, scope_id)`, upsert on the same identity, and a body-free metadata index with explicit get. Openhuman's memory is service-shaped: recall, fetch and store over a pluggable engine in CortexDB, off without an engine. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:1-40] [SOURCE: specs/system-skilled-bots/context/openhuman-main/docs/gitbooks/en/developing/architecture.md:225]

**Skilled bots today.** None. BOT.md has no memory field, and the 28-module runtime has no memory module. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:1-16]

**Smallest change.** Typed memory files: per-bot `bots/<id>/memory.md` and shared `bots/memory.md`, entries typed user/general/feedback/reference with actor, source, bot and date; `bots remember` appends, `bots memory` lists, and the runner prepends both files to the prompt. Shared facts also belong in the spec-kit's continuity surfaces. Size S, risk low.

## 8. Skills

**OpenBot.** A skill is a named way of doing a task called with `/`, made in three ways: written, recorded from a demonstration, or proposed from conversations. People create personal skills attachable only to bots they own; administrators create deployment skills. Skills narrow the tools a run is offered, and a skill's declaration grants nothing because it is intersected with existing grants. In-conversation authoring suspends the run on a card and writes nothing until the person presses the button. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:64-70] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:327-360]

**Skilled bots today.** A skill is already a folder with `SKILL.md` frontmatter (name, description, allowed-tools, version) plus optional `ROUTER.md`, references, assets and scripts; routing loads the skill, then the router, then matched leaves. The spec-kit owns authored packets and the review trail. [SOURCE: .skilled/skills/sk-doc/SKILL.md:1-10] [SOURCE: .skilled/skills/sk-doc/ROUTER.md:1-20] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:20-60]

**Smallest change.** One `bots learn` command that writes a proposed `SKILL.md` plus an evidence note into a packet's `scratch/proposed-skills/`, and a review step that moves an accepted skill to `.skilled/skills/<name>/`. No new format is needed. Size S, risk low.

## 9. Apps and the Vault

**OpenBot.** Apps are admin-governed because they reach external systems with stored credentials: an administrator adds and switches on every app, a bot owner may grant one only where an administrator opened it, and a grant uses the asking person's own account. Every MCP call checks the grant, then the shared action policy with MCP context, then audits the result. Credentials live in a vault and are referenced by id; the vault belongs to the person, and apps and the computer both draw on it without keeping secrets of their own. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:325-341] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:414] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-111]

**Skilled bots today.** External MCP tools go through Code Mode, and secrets come from the process environment and dotenv files, with a literal scanner (minimum length eight) and an environment allowlist. There is no vault and no per-bot secret grant. [SOURCE: .devin/skills/mcp-code-mode/SKILL.md:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:54-57] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:244-252]

**Smallest change.** One `bots vault` surface backed by the OS keychain (or an age-encrypted file), a per-bot secret-name allowlist, and a vault reference syntax in BOT.md. Size M, risk medium (keychain access differs per host).

## 10. Computer and Worktrees

**OpenBot.** The computer is a browser, a command line and files that persist between tasks, plus folders on the person's own machine. It signs in with a vault login that fills the page without the bot reading it, and a step needing the person (a passkey, a phone code) is handed back. A folder is read-only by default, the desktop asks before every edit or command, and access ends when OpenBot stops or the person revokes it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:129-142]

**Skilled bots today.** The computer is a worktree: `isolation: worktree` gives the run its own tree, allocated by sk-git's numbering script under a lock, outside the checkout and the Skilled tree, with shared paths linked rather than installed. Removal records and unlinks links without following them and keeps any tree that is dirty, off its base commit or stashed. The posture matrix refuses before dispatch any isolation and sandbox pair the executor kind cannot honor; native is never admitted. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]

**Smallest change.** None to the mechanism: document the worktree as the bot's computer and add an optional path allowlist for a folder a bot may read outside its tree. Size S, risk low. Do not copy OpenBot's browser computer; it is the largest surface and the least needed by a team whose bots work in repositories.

## 11. Recommendations — the Eight-Part Gap Table and Build Order

| Part | Smallest change | Size | Risk |
| --- | --- | --- | --- |
| Conversations | `bots chat` transcript, conversation id, message rows | M | Low |
| Routines | `until:` block plus `bots routines` list; event starts via queue producer | M | Medium |
| Memory | Typed per-bot and shared memory files; `bots remember` | S | Low |
| Skills | `bots learn` proposed SKILL.md reviewed in a packet | S | Low |
| Apps | `bots vault` plus per-bot secret allowlist | M | Medium |
| Computer | Document worktree as the computer; optional path allowlist | S | Low |
| Approvals | `actor` on approval, answer and run record; optional action classifier | S-M | Medium |
| Activity | `bots activity` grouped over run records, delivery and result events | S | Low |

**Ranked build order for a first build packet:**

1. `bots chat` transcript and conversation id (M, low).
2. `bots activity` grouped view (S, low) — lift OpenBot's MIT `activity-groups.ts` and `activity-rows.ts`.
3. Actor on approvals, answers and run records (S, low) — the shared-host prerequisite.
4. `bots remember` memory files (S, low).
5. `bots routines` list and `until:` outcome (M, medium).
6. `bots learn` proposed skills (S, low).
7. `bots vault` and per-bot secret allowlist (M, medium).
8. Action-kind classifier for approvals (M, medium) — lift OpenBot's MIT `tool-name.ts`.
9. Desktop shell (Tauri) last, only if the terminal proves insufficient.

**Verdict.** Terminal-first is sufficient for every part. OpenBot's distinctive value is its ordered policy and its record, not its window. [INFERENCE: based on Sections 5-10]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
| --- | --- | --- | --- |
| Searching every repo for a TUI framework | Only openhuman ships a terminal front end; the rest are Electron, Tauri, dashboard-plugin or web workspaces | `openhuman-main/crates/openhuman-tui/README.md:3` | 1, 3 |
| Treating the OpenBot desktop app as the conversation target | Its chat is the same web app; the Tauri layer is engine and update management | `OpenBot-main/desktop/src-tauri/src/main.rs:13-31` | 1 |
| Copying OpenBot's owner/admin/member roles | Owner and admin are the same authority; a few people need no delegation tree | `OpenBot-main/app/src/lib/auth/roles.ts:1-26` | 2, 5 |
| Copying turnstone's full RBAC | It composes roles across many endpoints, a problem this team does not have | `turnstone-main/docs/governance.md:9-30` | 2, 5 |
| Treating `bots answer` as an approval system | It continues a parked run after the fact; it does not gate an action before it happens | `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts:3-17` | 2 |
| Building a web UI first | Every named surface is a list or transcript the runtime already stores | `.skilled/bin/bots.cjs:19-50` | 3 |
| Copying OpenGhost's drawing engine or OpenMausBot's Electron shell | Large UI codebases tied to a desktop runtime | `OpenGhost-main/package.json:6` | 3 |
| Copying turnstone-console | A web cluster dashboard for multi-node visibility | `turnstone-main/docs/console.md:3-20` | 3 |
| A server-side group transcript with per-bot threads | Skilled bots runs one bot per dispatch; the file chain preserves attribution without a message server | `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:3-18` | 4 |
| Reusing OpenBot's channel and member tables | They assume a multi-tenant organization and a database | `OpenBot-main/docs/architecture.md:31` | 4, 11 |
| Treating the run record as an activity log | One record per run; a conversation needs several messages per run | `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:70-190` | 4 |
| Adding Better Auth or any identity provider | The host already has an identity in the OS or SSH layer | `OpenBot-main/docs/architecture.md:419-430` | 5 |
| Copying turnstone's permission strings | A policy language is more than one gate | `turnstone-main/docs/governance.md:9-30` | 5 |
| A memory service or embedding store | Service memories exist to serve many users and machines | `openhuman-main/docs/gitbooks/en/developing/architecture.md:225` | 6 |
| Copying OpenBot's per-person Learning containers | They depend on a hosted backend and a marketplace; a proposed SKILL.md gives the same value | `OpenBot-main/docs/automatic-learning.md:50-58` | 6, 9 |
| A per-bot memory schema | Memory belongs beside the bot, not inside its definition | `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58` | 6 |
| Copying OpenBot's goal store and subscription tables | A BOT.md field plus the existing queue gives the same behaviour | `OpenBot-main/docs/routines.md:12-28` | 7 |
| Copying the 15-minute floor and 20-enabled cap | Guardrails for chat authoring; file authors see the whole list | `OpenBot-main/docs/routines.md:110-120` | 7 |
| Replaying missed windows | A stamp is better than a backlog; slot accounting already summarizes missed slots | `OpenBot-main/docs/routines.md:137-145` | 7 |
| An administrator grant table for apps | The bot's own secret allowlist is the grant | `OpenBot-main/docs/architecture.md:325-335` | 8 |
| OpenBot's browser computer | The largest surface, least needed by a repository-working team | `OpenBot-main/docs/personal-edition.md:129-142` | 8 |
| A container per bot | The worktree is cheaper, audited, and the posture matrix refuses unsafe pairs | `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30` | 8 |
| A skill marketplace or Learning container | A small team installs a folder | `OpenBot-main/docs/architecture.md:343-347` | 9 |
| A separate skill storage format | `SKILL.md` frontmatter already holds what a proposed skill needs | `.skilled/skills/sk-doc/SKILL.md:1-10` | 9 |
| Learned skills in the BOT.md body | A skill is a separate reviewable unit | `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts:23-58` | 9 |
| An OpenBot-style action policy engine | The executor's sandbox and posture already enforce; a second layer duplicates it | `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14` | 10 |
| A separate audit database | Run record, delivery entry and result event already form the trail | `.skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts:3-14` | 10 |
| Copying the approvals board as a TUI screen | `bots inbox` already lists the same items | `.skilled/bin/bots.cjs:31` | 10 |
| A lite multi-tenant mode | Tenancy is in the URL space and schema; it would be a second product | `OpenBot-main/docs/architecture.md:31` | 11 |
| The Helm chart as the small-team install path | It installs a cluster workload with a management agent and a licence | `OpenBot-main/docs/managed-upgrades.md:1-30` | 11 |
| A mobile client before a terminal client | The terminal is the stated preference and the smaller build | `OpenBot-main/mobile/AGENTS.md:1-10` | 11 |
| Copying openhuman-tui code | GPL-3.0-only would force the combined work under GPL | `openhuman-main/Cargo.toml:35` | 12 |
| Copying OpenBot's React approval cards | The logic is in `shared/`; the cards are web presentation | `OpenBot-main/app/src/components/approvals/inline-approval.tsx:20-27` | 12 |
| Copying hermes-muse's kernel state machine | Python and coupled to a host plugin API; only the vocabulary is reusable | `hermes-muse-main/AGENTS.md:1-20` | 12 |
| A desktop-first build | OpenBot's chat is the web app; the Tauri layer manages engines | `OpenBot-main/desktop/src-tauri/src/main.rs:13-31` | 13 |
| A server or database for conversations, memory, skills or activity | Each maps to files the runtime already writes; the queue provides atomic claims | `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:3-25` | 13 |

## 12. Open Questions

1. **Who is the actor when a bot runs from a schedule?** The recommendation is to record the host identity, but a scheduled job started by launchd has no interactive user; the smallest defensible answer is the installing operator's identity pinned at install time. Not yet verified against a multi-user host.
2. **Does a `until:` completion check belong in the runner or in the bot body?** The runner can evaluate a command and stop; the body can describe the outcome. The split is unproven.
3. **How large may a memory file grow before it must be summarized?** OpenBot's memory is ranked recall; a file is appended. No bound has been measured.
4. **Should `bots chat` write a message row for tool output, or only for human and bot messages?** The activity view covers tool output; the transcript may not need it. Unresolved.
5. **What happens to a conversation when two people answer the same needs-you item?** The queue dedupes by item id, but the second answer's text is not compared.

## 13. Divergence Map

- Saturated directions: none recorded. No direction was retried to exhaustion; the frontier closed because each node's question was answered.
- Pivots taken: none. The run used the seeded frontier (F-1-001, F-1-005) and four admitted children (F-2-006 to F-2-009), then coverage-driven iterations for routines, apps, skills, approvals/activity, skip list, reuse and synthesis.
- Pivot failures: none.
- Audited overrides: none.
- Remaining frontier: none; all six nodes are answered.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 13
- Questions answered: 6 of 6 tracked questions (two depth-1, four depth-2)
- Remaining questions: 0 tracked; 5 open questions are recorded in Section 12 as follow-ups rather than tracked questions
- Last 3 iteration summaries: run 11 skip list (0.90); run 12 reuse and licensing (0.90); run 13 final synthesis (0.55)
- Convergence threshold: 0.05 (telemetry only under stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

## 15. Reuse and Licensing

| Candidate | Repo | Path | License | Value |
| --- | --- | --- | --- | --- |
| Activity groups and rows | OpenBot | `app/src/lib/bot-lifecycle/activity-groups.ts`, `shared/activity-rows.ts` | MIT | Activity view |
| Action-kind classifier | OpenBot | `shared/tool-name.ts` | MIT | Approval classifier |
| Standing-rule offer | OpenBot | `shared/standing-rule.ts` | MIT | Allowance rules |
| Routine planner | OpenBot | `app/src/lib/routines/plan.ts` | MIT | Routine grammar |
| Structured memory | turnstone | `turnstone/core/memory.py`, `memory_index.py` | Apache-2.0 | Typed memory |
| Team chat state | OpenMausBot | `src/state/team-chats.ts` | Apache-2.0 | Multi-bot conversation |
| Terminal design | openhuman | `crates/openhuman-tui/` | GPL-3.0-only | Reference only |

Attribution: MIT reuse needs the copyright and permission notice; Apache-2.0 reuse needs the license, any NOTICE file and a statement of changes. One `THIRD_PARTY_NOTICES.md` entry per lifted file with source path and commit satisfies both.

## 16. Skip List

| Area | Why skipped | Evidence |
| --- | --- | --- |
| Enterprise identity (SSO, SAML, SCIM) | Needs a directory and a second population to administer; the host already provides identity | `OpenBot-main/docs/architecture.md:419-430` |
| Multi-tenant organizations | Tenancy lives in the URL space and schema; skilled bots has one checkout and one state root per identity | `OpenBot-main/docs/architecture.md:31` |
| Kubernetes and Helm | Needs a cluster, a rollout policy and a backup operator; launchd and the file queue already schedule and retry | `OpenBot-main/docs/kubernetes-upgrades.md:1-30` |
| Managed upgrades | Needs a vendor relationship and a licence service; the status index already reports install state | `OpenBot-main/docs/managed-upgrades.md:1-30` |
| Mobile | Needs a second client, an app-store cycle and a 12-month compatibility promise | `OpenBot-main/mobile/AGENTS.md:1-10` |

What to keep without adopting: Kubernetes' digest pinning and verified backup become installer version pinning and a rebuild that deletes nothing on failure; the managed heartbeat becomes the status index's staleness warning.

## 17. References

- `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/routines.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/groups.ts`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts`
- `specs/system-skilled-bots/context/OpenBot-main/app/src/lib/auth/roles.ts`
- `specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts`
- `specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml`
- `specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md`
- `specs/system-skilled-bots/context/turnstone-main/docs/governance.md`
- `specs/system-skilled-bots/context/turnstone-main/docs/memory.md`
- `specs/system-skilled-bots/context/turnstone-main/docs/console.md`
- `specs/system-skilled-bots/context/OpenMausBot-main/package.json`
- `specs/system-skilled-bots/context/OpenMausBot-main/src/state/team-chats.ts`
- `specs/system-skilled-bots/context/OpenGhost-main/package.json`
- `specs/system-skilled-bots/context/buzz-main/desktop/package.json`
- `specs/system-skilled-bots/context/hermes-muse-main/desktop/plugin.js`
- `.skilled/bin/bots.cjs`
- `.skilled/skills/system-skilled-bots/runtime/lib/README.md`
- `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/status.ts`
- `.skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts`
- `.skilled/skills/sk-doc/SKILL.md`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`
- `.devin/skills/mcp-code-mode/SKILL.md`

Note: `resource-map.md` was absent at init, so no resource-map citation is synthesized here.
