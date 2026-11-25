---
title: Deep Research Strategy - OpenBot Parity for Skilled Bots
description: Runtime strategy packet tracking focus decisions, answered questions, and outcomes across the devin-1 research lineage.
trigger_phrases:
  - "openbot parity strategy"
  - "skilled bots parity research"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - OpenBot Parity for Skilled Bots

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for this research lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** Topic, Key Questions, Known Context and Research Boundaries are populated from the lineage config.
- **Per iteration:** The iteration reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's.

Inputs (read-only): eight reference repos under `specs/system-skilled-bots/context/` (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under `.skilled/skills/system-skilled-bots/` (BOT.md definitions, bots CLI at `.skilled/bin/bots.cjs`, manual/queue/git-hook/launchd triggers, needs-you items, worktree isolation, desktop delivery, status index).

OpenBot frames a bot as eight parts in four pairs (`OpenBot-main/docs/how-openbot-works.md`): conversations and routines, memory and skills, apps and computer, approvals and activity. For each of the eight parts answer: what OpenBot does and how it is built; what the other seven repos do better or more simply; what skilled bots has today; and the smallest change that closes the gap, with its size and risk.

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

Cite every claim with `[SOURCE: path:line]`. End with a ranked build order a first build packet can start from.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How do OpenBot and the other reference repos give a team conversations with a bot and an activity feed, and can a terminal or TUI match the OpenBot desktop app for that, or is a desktop shell such as Tauri worth adding?
- [x] How do approvals work in OpenBot and the other repos, and what is the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records?
- [x] How does a terminal or TUI present a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying?
- [x] How are conversations persisted and fanned out so several bots can share one thread, and what is the smallest activity record that can be shown after the fact?
- [x] What is the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's owner/admin/member split and turnstone's RBAC can be dropped?
- [x] How should shared versus per-person memory be scoped when a few people use the same bots, and what does OpenBot's memory model do that skilled bots' per-bot files do not?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Enterprise and multi-tenant operation, Kubernetes deployment, managed upgrades and mobile apps. These are explicitly out of scope and belong on the skip list rather than the build plan.
- A desktop application built before a terminal or CLI surface has been proven to match the needed OpenBot experience.
- Rebuilding OpenBot's hosted service, billing, or marketing surfaces.
- Implementation work. This packet produces research findings and a build order only.

---

## 5. STOP CONDITIONS
- The loop reaches `config.maxIterations` (13) with stop policy `max-iterations`.
- Every one of the eight OpenBot parts has a current-state answer, a smallest-change proposal with size and risk, and the nine additional questions have cited answers.
- No new cited evidence is available for the remaining open questions.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How do OpenBot and the other reference repos give a team conversations with a bot and an activity feed, and can a terminal or TUI match the OpenBot desktop app for that, or is a desktop shell such as Tauri worth adding?
- How do approvals work in OpenBot and the other repos, and what is the smallest small-team model of who can talk to, approve for and change a bot, compared with skilled bots' needs-you items and run records?
- How does a terminal or TUI present a conversation with a bot together with its approvals, activity and routine list, and which repo's terminal frontend is worth copying?
- How are conversations persisted and fanned out so several bots can share one thread, and what is the smallest activity record that can be shown after the fact?
- What is the smallest sign-in and role model for a few people sharing one machine or host, and which parts of OpenBot's owner/admin/member split and turnstone's RBAC can be dropped?
- How should shared versus per-person memory be scoped when a few people use the same bots, and what does OpenBot's memory model do that skilled bots' per-bot files do not?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the implementation next to the docs separated the chat surface from the shell. The group-chat header comment and the Tauri module list each state their boundary explicitly, so the terminal-versus-desktop question resolved on evidence rather than taste. (iteration 1)
- reading the approval module's header comment first gave the design rationale (why definition-level, why outside the run's reach) in three sentences, and the docs then supplied the action-level comparison. Pairing each OpenBot concept with the skilled-bots primitive that already exists kept the gap analysis concrete. (iteration 2)
- reading the renderer's function list before its bodies showed the whole information architecture in one screenful — transcript, composer, three text views. The overlay file then supplied the decision interaction in twenty lines. (iteration 3)
- comparing the message shape with the run-record shape made the missing piece obvious. OpenBot stores messages; skilled bots stores runs. Both are complete records of a different unit, and the gap is a unit, not a field. (iteration 4)
- the identity resolver's precedence order and the state root's pinned-environment rule together answer the security half of the question without any new design. The remaining design work is one actor field and one permission list. (iteration 5)
- the edition boundary was the decisive fact. OpenBot's memory is a team feature with a hosted backend, which explains why the smallest version for this team is files with provenance rather than a store. (iteration 6)
- reading `planRoutine` next to the routine doc turned a prose contract into three data shapes, which made the mapping to BOT.md triggers mechanical. The drain's routing rules then showed which "until" behaviours already exist as quarantine and retry. (iteration 7)
- the grant-then-policy-then-audit ordering in OpenBot is three words and maps directly onto skilled bots' missing piece, which is the grant. The worktree module's header comment supplied the security rationale without reading its implementation. (iteration 8)
- the three-way skill origin in OpenBot's how-it-works page maps cleanly onto three existing Skilled surfaces — authoring a skill, proposing one in a packet, installing one in the tree. The mapping needed no new concept. (iteration 9)
- comparing record-by-record rather than feature-by-feature showed that the storage gap is small and the presentation gap is the real one. The audit-before-action ordering in OpenBot is the one design idea worth borrowing. (iteration 10)
- each skipped feature has a visible dependency — a directory, a cluster, a licence service, an app store. Naming the dependency is a better reason than "we do not need it". (iteration 11)
- checking licenses first turned a vague "can we reuse this" into a short list. The MIT repos carry the highest-value small modules; the GPL repo carries the best design and no reusable code. (iteration 12)
- sizing each change against an existing module kept the table honest. Every "smallest change" names a file that already exists or a field that already has a home, which is why the sizes are S or M and not L. (iteration 13)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first repo-wide TUI keyword search returned mostly lockfiles and vendored third-party licences; narrowing to `crates/*/src` and READMEs produced the real hit. Broad dependency scans are noise in repos this size. (iteration 1)
- grepping for "approval" across OpenMausBot and buzz returned mostly unrelated UI state files; their approval implementations are not named that way. A per-repo README pass would locate them faster than keyword search. (iteration 2)
- turnstone's "console" looked like a TUI by name and is a web dashboard; the first paragraph settled it. Names are not evidence. (iteration 3)
- searching for a groups directory returned nothing because `groups.ts` is a single file; the import path was the reliable clue. (iteration 4)
- reading OpenBot's auth client files produced mostly hosted-sign-in plumbing; the architecture doc's security-boundaries list was the compact source. (iteration 5)
- the memory screen components say nothing about storage; the architecture page's four bullets carry the whole model. (iteration 6)
- the routines doc's later sections are about server operations (worker containers, pods), which do not transfer to a launchd-based runtime; they were skipped rather than mined. (iteration 7)
- the vault appears in docs as a user-facing promise, not as a schema; the encryption rules in the architecture page are the only concrete contract. (iteration 8)
- OpenBot's `skills.yaml` is a deployment package format, not a skill format; reading it for schema details mostly confirmed the grant model already found. (iteration 9)
- the needs-you board component is mostly layout; the useful fact was its relationship to the inbox, not its markup. (iteration 10)
- the Kubernetes and managed-upgrade docs are long operator runbooks; the first section of each carried the dependency and the rest was procedure. (iteration 11)
- the Apache repos' best code is either large (buzz desktop) or database-bound (turnstone memory), so their value is conceptual plus one small file. (iteration 12)
- ranking by value alone put the desktop shell high because it is the most visible OpenBot surface; ranking by dependency and risk moved it last, which matches the topic's terminal preference. (iteration 13)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A "lite" multi-tenant mode. Tenancy is in the URL space and the database schema; a lite version would be a second product. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: A "lite" multi-tenant mode. Tenancy is in the URL space and the database schema; a lite version would be a second product.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A "lite" multi-tenant mode. Tenancy is in the URL space and the database schema; a lite version would be a second product.

### A desktop-first build. Iteration 1 found that OpenBot's chat surface is the web app and its Tauri layer is engine and update management. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A desktop-first build. Iteration 1 found that OpenBot's chat surface is the web app and its Tauri layer is engine and update management.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A desktop-first build. Iteration 1 found that OpenBot's chat surface is the web app and its Tauri layer is engine and update management.

### A server or database for conversations, memory, skills or activity. Each maps to files the runtime already writes, and the queue already provides atomic claims. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A server or database for conversations, memory, skills or activity. Each maps to files the runtime already writes, and the queue already provides atomic claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A server or database for conversations, memory, skills or activity. Each maps to files the runtime already writes, and the queue already provides atomic claims.

### Adding a separate audit database. The run record, delivery entry and result event already form the trail; a second store would be the first place to drift. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Adding a separate audit database. The run record, delivery entry and result event already form the trail; a second store would be the first place to drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a separate audit database. The run record, delivery entry and result event already form the trail; a second store would be the first place to drift.

### Adding an OpenBot-style action policy engine. A bot's actions happen inside an executor whose sandbox and posture are already enforced; a second policy layer would duplicate the executor's own permission model. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Adding an OpenBot-style action policy engine. A bot's actions happen inside an executor whose sandbox and posture are already enforced; a second policy layer would duplicate the executor's own permission model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding an OpenBot-style action policy engine. A bot's actions happen inside an executor whose sandbox and posture are already enforced; a second policy layer would duplicate the executor's own permission model.

### Adding Better Auth or any identity provider. OpenBot needs it because it serves many organizations over the network; a small team on one host already has an identity in the OS or SSH layer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adding Better Auth or any identity provider. OpenBot needs it because it serves many organizations over the network; a small team on one host already has an identity in the OS or SSH layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Better Auth or any identity provider. OpenBot needs it because it serves many organizations over the network; a small team on one host already has an identity in the OS or SSH layer.

### Adopting the Helm chart as the small-team install path. It installs a cluster workload with a management agent and a licence requirement. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Adopting the Helm chart as the small-team install path. It installs a cluster workload with a management agent and a licence requirement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting the Helm chart as the small-team install path. It installs a cluster workload with a management agent and a licence requirement.

### Any enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile work (iteration 11). -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Any enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile work (iteration 11).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile work (iteration 11).

### Building a memory service or embedding store. The reference set's service-shaped memories (OpenBot Intelligence, openhuman CortexDB) exist to serve many users and machines; a few people on one host do not need recall ranking. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Building a memory service or embedding store. The reference set's service-shaped memories (OpenBot Intelligence, openhuman CortexDB) exist to serve many users and machines; a few people on one host do not need recall ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a memory service or embedding store. The reference set's service-shaped memories (OpenBot Intelligence, openhuman CortexDB) exist to serve many users and machines; a few people on one host do not need recall ranking.

### Building a server-side group transcript with per-bot threads, as OpenBot does. Skilled bots runs one bot per dispatch in a worktree; the file-chain model already preserves attribution without a message server. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Building a server-side group transcript with per-bot threads, as OpenBot does. Skilled bots runs one bot per dispatch in a worktree; the file-chain model already preserves attribution without a message server.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a server-side group transcript with per-bot threads, as OpenBot does. Skilled bots runs one bot per dispatch in a worktree; the file-chain model already preserves attribution without a message server.

### Building a skill marketplace or a Learning container. Both exist in OpenBot to distribute skills across many people; a small team installs skills by moving a folder. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Building a skill marketplace or a Learning container. Both exist in OpenBot to distribute skills across many people; a small team installs skills by moving a folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a skill marketplace or a Learning container. Both exist in OpenBot to distribute skills across many people; a small team installs skills by moving a folder.

### Building a web UI first. Every surface the question names is a list or a transcript, and the runtime already stores both; a browser adds a server and a session layer without adding information. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Building a web UI first. Every surface the question names is a list or a transcript, and the runtime already stores both; a browser adds a server and a session layer without adding information.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a web UI first. Every surface the question names is a list or a transcript, and the runtime already stores both; a browser adds a server and a session layer without adding information.

### Building an administrator grant table for apps. With one operator group and a file-defined bot, the bot's own secret allowlist is the grant. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Building an administrator grant table for apps. With one operator group and a file-defined bot, the bot's own secret allowlist is the grant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building an administrator grant table for apps. With one operator group and a file-defined bot, the bot's own secret allowlist is the grant.

### Copying hermes-muse's kernel state machine. It is MIT but Python and coupled to a host plugin API; the state vocabulary is the reusable part, not the code. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Copying hermes-muse's kernel state machine. It is MIT but Python and coupled to a host plugin API; the state vocabulary is the reusable part, not the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying hermes-muse's kernel state machine. It is MIT but Python and coupled to a host plugin API; the state vocabulary is the reusable part, not the code.

### Copying OpenBot's browser computer (live screen, take-the-wheel, recorder). It is the largest surface in OpenBot and the least needed by a team whose bots work in repositories. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Copying OpenBot's browser computer (live screen, take-the-wheel, recorder). It is the largest surface in OpenBot and the least needed by a team whose bots work in repositories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's browser computer (live screen, take-the-wheel, recorder). It is the largest surface in OpenBot and the least needed by a team whose bots work in repositories.

### Copying OpenBot's goal store and subscription tables. The same behaviour comes from a BOT.md field plus the existing queue, without a database. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Copying OpenBot's goal store and subscription tables. The same behaviour comes from a BOT.md field plus the existing queue, without a database.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's goal store and subscription tables. The same behaviour comes from a BOT.md field plus the existing queue, without a database.

### Copying OpenBot's owner/admin/member roles into skilled bots. With no sign-in and no tenant, the roles have nothing to distinguish; the same protection comes from recording who approved what. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying OpenBot's owner/admin/member roles into skilled bots. With no sign-in and no tenant, the roles have nothing to distinguish; the same protection comes from recording who approved what.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's owner/admin/member roles into skilled bots. With no sign-in and no tenant, the roles have nothing to distinguish; the same protection comes from recording who approved what.

### Copying OpenBot's per-person Learning containers. They depend on a hosted backend and a skills marketplace; the same value comes from a proposed SKILL.md reviewed in a packet. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Copying OpenBot's per-person Learning containers. They depend on a hosted backend and a skills marketplace; the same value comes from a proposed SKILL.md reviewed in a packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's per-person Learning containers. They depend on a hosted backend and a skills marketplace; the same value comes from a proposed SKILL.md reviewed in a packet.

### Copying OpenBot's React approval cards. The logic is in `shared/`, the cards are presentation tied to the web app. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Copying OpenBot's React approval cards. The logic is in `shared/`, the cards are presentation tied to the web app.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's React approval cards. The logic is in `shared/`, the cards are presentation tied to the web app.

### Copying OpenGhost's hand-written drawing engine or OpenMausBot's Electron shell. Both are large UI codebases tied to a desktop runtime. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copying OpenGhost's hand-written drawing engine or OpenMausBot's Electron shell. Both are large UI codebases tied to a desktop runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenGhost's hand-written drawing engine or OpenMausBot's Electron shell. Both are large UI codebases tied to a desktop runtime.

### Copying openhuman-tui code. GPL-3.0-only would force the combined work under GPL. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Copying openhuman-tui code. GPL-3.0-only would force the combined work under GPL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying openhuman-tui code. GPL-3.0-only would force the combined work under GPL.

### Copying the 15-minute floor and 20-enabled cap as server rules. They are product guardrails for a chat-driven authoring surface; a small team authors bots in files and can see the whole list. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Copying the 15-minute floor and 20-enabled cap as server rules. They are product guardrails for a chat-driven authoring surface; a small team authors bots in files and can see the whole list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the 15-minute floor and 20-enabled cap as server rules. They are product guardrails for a chat-driven authoring surface; a small team authors bots in files and can see the whole list.

### Copying the approvals board as a TUI screen. The board is a filtered list over the inbox; `bots inbox` already lists the same items. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Copying the approvals board as a TUI screen. The board is a filtered list over the inbox; `bots inbox` already lists the same items.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the approvals board as a TUI screen. The board is a filtered list over the inbox; `bots inbox` already lists the same items.

### Copying the owner/admin/member split. Owner and admin are the same authority in OpenBot's own helper, so the three names collapse to two behaviours, and a few people do not need a delegation tree. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying the owner/admin/member split. Owner and admin are the same authority in OpenBot's own helper, so the three names collapse to two behaviours, and a few people do not need a delegation tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying the owner/admin/member split. Owner and admin are the same authority in OpenBot's own helper, so the three names collapse to two behaviours, and a few people do not need a delegation tree.

### Copying turnstone-console. It solves multi-node cluster visibility, a problem this team does not have. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copying turnstone-console. It solves multi-node cluster visibility, a problem this team does not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying turnstone-console. It solves multi-node cluster visibility, a problem this team does not have.

### Copying turnstone's full RBAC and permission-string model. It exists to let an administrator delegate across many users and endpoints, a problem a small team does not have. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying turnstone's full RBAC and permission-string model. It exists to let an administrator delegate across many users and endpoints, a problem a small team does not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying turnstone's full RBAC and permission-string model. It exists to let an administrator delegate across many users and endpoints, a problem a small team does not have.

### Copying turnstone's permission strings. They exist to let an administrator compose custom roles across endpoints; a small team needs one gate, not a policy language. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying turnstone's permission strings. They exist to let an administrator compose custom roles across endpoints; a small team needs one gate, not a policy language.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying turnstone's permission strings. They exist to let an administrator compose custom roles across endpoints; a small team needs one gate, not a policy language.

### Counting "which repo has a desktop app" as evidence of a better conversation surface. Electron and Tauri shells in this set mostly wrap the same web UI; the differentiator is the host contract (streaming events, approvals, sessions), not the window toolkit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting "which repo has a desktop app" as evidence of a better conversation surface. Electron and Tauri shells in this set mostly wrap the same web UI; the differentiator is the host contract (streaming events, approvals, sessions), not the window toolkit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting "which repo has a desktop app" as evidence of a better conversation surface. Electron and Tauri shells in this set mostly wrap the same web UI; the differentiator is the host contract (streaming events, approvals, sessions), not the window toolkit.

### Giving each bot its own memory schema. The BOT.md contract is already a stable, small frontmatter; memory belongs beside the bot, not inside its definition. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Giving each bot its own memory schema. The BOT.md contract is already a stable, small frontmatter; memory belongs beside the bot, not inside its definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Giving each bot its own memory schema. The BOT.md contract is already a stable, small frontmatter; memory belongs beside the bot, not inside its definition.

### Giving skills their own storage format. `SKILL.md` with frontmatter already holds everything a proposed skill needs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Giving skills their own storage format. `SKILL.md` with frontmatter already holds everything a proposed skill needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Giving skills their own storage format. `SKILL.md` with frontmatter already holds everything a proposed skill needs.

### Looking for a message table in skilled bots' runtime: there is none. Delivery entries record where a result went, not what was said. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a message table in skilled bots' runtime: there is none. Delivery entries record where a result went, not what was said.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a message table in skilled bots' runtime: there is none. Delivery entries record where a result went, not what was said.

### Looking for a mobile web build in the phone app: it is a native React Native project, not a responsive web page. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a mobile web build in the phone app: it is a native React Native project, not a responsive web page.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a mobile web build in the phone app: it is a native React Native project, not a responsive web page.

### Looking for a NOTICE file in OpenBot: there is none, so MIT attribution is the only obligation. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a NOTICE file in OpenBot: there is none, so MIT attribution is the only obligation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a NOTICE file in OpenBot: there is none, so MIT attribution is the only obligation.

### Looking for a per-person skill scope in the spec-kit: the packet is the scope, not the person. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a per-person skill scope in the spec-kit: the packet is the scope, not the person.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-person skill scope in the spec-kit: the packet is the scope, not the person.

### Looking for a permissive memory implementation in openhuman: GPL-3.0 rules it out for direct reuse. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a permissive memory implementation in openhuman: GPL-3.0 rules it out for direct reuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a permissive memory implementation in openhuman: GPL-3.0 rules it out for direct reuse.

### Looking for a ratatui, bubbletea, textual or ink TUI in every reference repo: only openhuman ships a real terminal frontend (`crates/openhuman-tui`). OpenGhost and OpenMausBot are Electron; buzz and OpenBot are Tauri; hermes-muse is a Hermes dashboard plugin; turnstone and rakazo are web/api workspaces. Repeating this survey per repo would add no new signal. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a ratatui, bubbletea, textual or ink TUI in every reference repo: only openhuman ships a real terminal frontend (`crates/openhuman-tui`). OpenGhost and OpenMausBot are Electron; buzz and OpenBot are Tauri; hermes-muse is a Hermes dashboard plugin; turnstone and rakazo are web/api workspaces. Repeating this survey per repo would add no new signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a ratatui, bubbletea, textual or ink TUI in every reference repo: only openhuman ships a real terminal frontend (`crates/openhuman-tui`). OpenGhost and OpenMausBot are Electron; buzz and OpenBot are Tauri; hermes-muse is a Hermes dashboard plugin; turnstone and rakazo are web/api workspaces. Repeating this survey per repo would add no new signal.

### Looking for a routine list in openhuman-tui: it has `/sessions` and `/skills` but no routine concept; OpenBot's four-part row is the better source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a routine list in openhuman-tui: it has `/sessions` and `/skills` but no routine concept; OpenBot's four-part row is the better source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a routine list in openhuman-tui: it has `/sessions` and `/skills` but no routine concept; OpenBot's four-part row is the better source.

### Looking for a routine scheduler in skilled bots beyond launchd: cron translation and launchd installation are the whole scheduling layer. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a routine scheduler in skilled bots beyond launchd: cron translation and launchd installation are the whole scheduling layer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a routine scheduler in skilled bots beyond launchd: cron translation and launchd installation are the whole scheduling layer.

### Looking for a single-user mode in the Kubernetes chart: the personal edition is the single-user mode, and it is explicitly not the chart. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a single-user mode in the Kubernetes chart: the personal edition is the single-user mode, and it is explicitly not the chart.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a single-user mode in the Kubernetes chart: the personal edition is the single-user mode, and it is explicitly not the chart.

### Looking for a skill registry in the bots runtime: there is none; skills live in the Skilled tree, and the bot runtime does not read them. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a skill registry in the bots runtime: there is none; skills live in the Skilled tree, and the bot runtime does not read them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a skill registry in the bots runtime: there is none; skills live in the Skilled tree, and the bot runtime does not read them.

### Looking for a user table in skilled bots' state root: there is none, only per-identity repository state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a user table in skilled bots' state root: there is none, only per-identity repository state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a user table in skilled bots' state root: there is none, only per-identity repository state.

### Looking for a vault in skilled bots' runtime: secrets come from the process environment and dotenv files, with literal scanning, not from a store. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a vault in skilled bots' runtime: secrets come from the process environment and dotenv files, with literal scanning, not from a store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a vault in skilled bots' runtime: secrets come from the process environment and dotenv files, with literal scanning, not from a store.

### Looking for activity in the status index beyond rows and flags: the index is a summary, not an event log. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for activity in the status index beyond rows and flags: the index is a summary, not an event log.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for activity in the status index beyond rows and flags: the index is a summary, not an event log.

### Looking for an action-level approval hook in skilled bots' runner. The runtime's only pre-execution gate is the definition hash; there is no per-tool policy layer to extend. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for an action-level approval hook in skilled bots' runner. The runtime's only pre-execution gate is the definition hash; there is no per-tool policy layer to extend.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an action-level approval hook in skilled bots' runner. The runtime's only pre-execution gate is the definition hash; there is no per-tool policy layer to extend.

### Looking for an activity view in the status index: it stores rows and flags, not a lifecycle grouping. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for an activity view in the status index: it stores rows and flags, not a lifecycle grouping.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an activity view in the status index: it stores rows and flags, not a lifecycle grouping.

### Looking for an app catalogue in skilled bots: MCP servers are configured outside the bot runtime, in Code Mode's own configuration. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for an app catalogue in skilled bots: MCP servers are configured outside the bot runtime, in Code Mode's own configuration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an app catalogue in skilled bots: MCP servers are configured outside the bot runtime, in Code Mode's own configuration.

### Looking for an audit row in skilled bots' run record: the run record has the outcome and evidence, but not a per-decision row. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for an audit row in skilled bots' run record: the run record has the outcome and evidence, but not a per-decision row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an audit row in skilled bots' run record: the run record has the outcome and evidence, but not a per-decision row.

### Looking for one OpenBot component that could be lifted wholesale. The value is distributed across small pure modules and policy documents; the UI is not portable. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for one OpenBot component that could be lifted wholesale. The value is distributed across small pure modules and policy documents; the UI is not portable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for one OpenBot component that could be lifted wholesale. The value is distributed across small pure modules and policy documents; the UI is not portable.

### Reading OpenBot's memory components (`memories.tsx`, `sources.tsx`) for a data model: they are screens over the API, not the model. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reading OpenBot's memory components (`memories.tsx`, `sources.tsx`) for a data model: they are screens over the API, not the model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading OpenBot's memory components (`memories.tsx`, `sources.tsx`) for a data model: they are screens over the API, not the model.

### Replacing the worktree with a container per bot. The worktree is cheaper, already audited, and the posture matrix already refuses unsafe combinations. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Replacing the worktree with a container per bot. The worktree is cheaper, already audited, and the posture matrix already refuses unsafe combinations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing the worktree with a container per bot. The worktree is cheaper, already audited, and the posture matrix already refuses unsafe combinations.

### Replaying missed windows. OpenBot's stamp model is better than a backlog, and skilled bots' slot accounting already summarizes missed slots instead of running them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Replaying missed windows. OpenBot's stamp model is better than a backlog, and skilled bots' slot accounting already summarizes missed slots instead of running them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replaying missed windows. OpenBot's stamp model is better than a backlog, and skilled bots' slot accounting already summarizes missed slots instead of running them.

### Reusing OpenBot's channel/member tables directly. They assume a multi-tenant organization and a database, neither of which this team needs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reusing OpenBot's channel/member tables directly. They assume a multi-tenant organization and a database, neither of which this team needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing OpenBot's channel/member tables directly. They assume a multi-tenant organization and a database, neither of which this team needs.

### Searching openhuman-tui for a separate approvals screen: approvals are overlays and a status control, not a page. The overlay is the model to copy. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching openhuman-tui for a separate approvals screen: approvals are overlays and a status control, not a page. The overlay is the model to copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching openhuman-tui for a separate approvals screen: approvals are overlays and a status control, not a page. The overlay is the model to copy.

### Searching skilled bots' runtime for memory code: there is none, and the library README's module table confirms the absence rather than a gap in the search. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching skilled bots' runtime for memory code: there is none, and the library README's module table confirms the absence rather than a gap in the search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching skilled bots' runtime for memory code: there is none, and the library README's module table confirms the absence rather than a gap in the search.

### Shipping a mobile client before a terminal client exists. The terminal is the stated preference and the smaller build. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Shipping a mobile client before a terminal client exists. The terminal is the stated preference and the smaller build.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping a mobile client before a terminal client exists. The terminal is the stated preference and the smaller build.

### Storing learned skills in the BOT.md body. The body is the standing instruction; a skill is a separate, reviewable, reusable unit. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Storing learned skills in the BOT.md body. The body is the standing instruction; a skill is a separate, reviewable, reusable unit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing learned skills in the BOT.md body. The body is the standing instruction; a skill is a separate, reviewable, reusable unit.

### Treating `bots answer` as an approval system. It continues a parked run; it does not gate an action before it happens. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `bots answer` as an approval system. It continues a parked run; it does not gate an action before it happens.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `bots answer` as an approval system. It continues a parked run; it does not gate an action before it happens.

### Treating the eight parts as independent. Conversations, activity and approvals share the run record and the actor field; building them in the ranked order avoids writing that record three times. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating the eight parts as independent. Conversations, activity and approvals share the run record and the actor field; building them in the ranked order avoids writing that record three times.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the eight parts as independent. Conversations, activity and approvals share the run record and the actor field; building them in the ranked order avoids writing that record three times.

### Treating the OpenBot desktop app as the parity target for conversations: its chat UI is the same web app served to the browser, and the Tauri layer's distinctive work is engine/stack management, not chat. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the OpenBot desktop app as the parity target for conversations: its chat UI is the same web app served to the browser, and the Tauri layer's distinctive work is engine/stack management, not chat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the OpenBot desktop app as the parity target for conversations: its chat UI is the same web app served to the browser, and the Tauri layer's distinctive work is engine/stack management, not chat.

### Treating the queue as a general event bus. It carries run requests with an idempotency key, not arbitrary events. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the queue as a general event bus. It carries run requests with an idempotency key, not arbitrary events.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the queue as a general event bus. It carries run requests with an idempotency key, not arbitrary events.

### Treating the run record as an activity log. It is one record per run; a conversation needs several messages per run. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the run record as an activity log. It is one record per run; a conversation needs several messages per run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the run record as an activity log. It is one record per run; a conversation needs several messages per run.

### Treating the status index as an identity source: it is keyed by repository identity, not by person. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the status index as an identity source: it is keyed by repository identity, not by person.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the status index as an identity source: it is keyed by repository identity, not by person.

### Using OpenBot's admin "Members do it themselves" setting as a template for a role system. It is a per-action-kind switch, not a role. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Using OpenBot's admin "Members do it themselves" setting as a template for a role system. It is a per-action-kind switch, not a role.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using OpenBot's admin "Members do it themselves" setting as a template for a role system. It is a per-action-kind switch, not a role.

### Using OpenBot's mobile app as a comparison point. It is explicitly on the topic's skip list. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Using OpenBot's mobile app as a comparison point. It is explicitly on the topic's skip list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using OpenBot's mobile app as a comparison point. It is explicitly on the topic's skip list.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md` (eight-part frame), `OpenBot-main/docs/approvals.md`, `OpenBot-main/docs/routines.md`, `OpenBot-main/docs/coworkers.md`, `OpenBot-main/docs/personal-edition.md`, `OpenBot-main/desktop/` (Tauri shell), `OpenBot-main/app/` (web app), `.skilled/bin/bots.cjs` (bots CLI), `.skilled/skills/system-skilled-bots/runtime/lib/` (queue, needs-you, status index), `.skilled/skills/system-skilled-bots/*/` (author/run/schedule/status mode packets).
- Reuse candidates: OpenBot Tauri desktop shell and web app conversation surfaces; other repos' TUI implementations; existing Skilled skills, spec-kit and MCP/Code Mode connectors.
- Integration points: bots CLI subcommands, BOT.md frontmatter, trigger adapters (manual, queue, git-hook, launchd), needs-you items, worktree isolation, desktop delivery, status index.
- Constraints and risks: all eight reference repos are read-only; every claim needs a `[SOURCE: path:line]` citation; small-team scope excludes enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile work.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-24T20:07:11.298Z
