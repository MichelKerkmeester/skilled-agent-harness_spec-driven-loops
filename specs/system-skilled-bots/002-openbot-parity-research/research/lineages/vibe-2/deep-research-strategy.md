---
title: Deep Research Strategy - OpenBot parity for skilled bots (vibe-2 lineage)
description: Runtime strategy file for the vibe-2 fan-out lineage of the OpenBot parity research run.
trigger_phrases:
  - "openbot parity strategy"
  - "vibe-2 lineage strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - OpenBot Parity (vibe-2 lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for this detached fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** populated with Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections remain stable; machine-owned sections are rewritten by the reducer after each iteration.

### Question Injection Surface

`specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-2/inbox.jsonl` holds the frontier rows dealt to this lineage. Each line is one JSON object with `id`, `text`, `source`, `origin`, `injectedAtIteration`, `promotedQuestionId`.

---

## 2. TOPIC

OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's.

Inputs (read-only): eight reference repos under `specs/system-skilled-bots/context/` (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under `.skilled/skills/system-skilled-bots/`.

OpenBot frames a bot as eight parts in four pairs (`OpenBot-main/docs/how-openbot-works.md`): conversations and routines, memory and skills, apps and computer, approvals and activity. For each of the eight parts: what OpenBot does and how it is built; what the other seven repos do better or more simply; what skilled bots has today; and the smallest change that closes the gap, with its size and risk.

Also: terminal versus desktop; conversations; routines; memory and skills; apps and computer; approvals and activity; small-team roles; a skip list; reusable code; and a ranked build order.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?
- [x] How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use?
- [x] How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it?
- [x] How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team?
- [x] What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?
- [x] What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Building anything. The packet ends at a recommendation (D5).
- Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile parity. These go on the skip list with reasons (D3).
- Desktop-app parity where a terminal can match it (D4).
- Editing any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- `maxIterations` reached (13). The stop policy is `max-iterations`, so convergence is telemetry only.
- Three consecutive failed iterations.
- `maxDurationMinutes` (120) elapsed from `createdAt`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How do the reference repos connect a bot to apps and secrets and give it a computer, compared with Skilled's MCP and Code Mode and the bots worktree isolation?
- How does OpenBot's vault actually store and inject a secret: what is encrypted, what a bot can see, and when a person must approve a use?
- How does OpenBot's app/connection registry authorize an app (OAuth client, account mode, refresh, scopes) and what would Skilled need to match it?
- How is OpenBot's computer provisioned and bounded (supervisor, container image, sandbox provider, per-tenant token) and what is the smallest equivalent for a small team?
- What do turnstone-main, OpenMausBot-main and rakazo-main do for apps, secrets and a bot's computer, and which of the three is simplest to copy?
- What is the smallest secret store skilled bots can add that keeps a value write-only, injects it without the bot reading it, and records each use in the run record?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- starting from the frame document and then following each primitive into code gave a clean split between what OpenBot *says* a primitive is and what it *implements*. The vault's absence from the eight is the single most useful structural fact, because it means a parity build needs a ninth store that is not a bot part. (iteration 1)
- reading the OpenAPI *descriptions* rather than the schemas. OpenBot writes its operation descriptions in the same plain language as the frame document, and those sentences state the invariants ("write-only", "never a password", "the person's confirmation to use it this once") that a schema cannot express. (iteration 2)
- reading the *write* endpoints (account-mode, oauth-client, connect) rather than the read ones. The write descriptions carry the invariants — transactional switch, approval granted on switch, secret never answered — that the read endpoints only imply. (iteration 3)
- reading `docker-compose.yml` as a design document. Every setting carries a comment saying what breaks without it, which is exactly the information a parity build needs and which no README states. (iteration 4)
- reading each repo's `docs/` directory rather than its source. All three write decision documents that state the boundary and the reason, which is exactly the reusable artefact — the code is Apache 2.0 but the *reasoning* is what a small-team build needs. (iteration 5)
- reading the three existing state modules (`run-record`, `needs-you`, `state-root`) before designing. Each one already solves a piece — a per-run record, a parked question, a per-identity layout — so the design became assembly rather than invention, which is what "smallest change" means. (iteration 6)
- reading the *config* files rather than the code. The whole connector surface is two JSON files and a 181-line launcher, so the design question became "what is the smallest thing to add to these two files", which is a much smaller question than "how do we build a connector layer". (iteration 7)
- reading the *retention* code rather than the isolation code. The isolation module says what a worktree is; the reaper says how long it lives, and that is what turns "a tree" into "a workspace". (iteration 8)
- reading the *schema* rather than the code. Six `CREATE TABLE` statements answer "what can the product already see" in one screen, and the answer — nothing about grants — is the whole coupling finding. (iteration 9)
- reading the CLI's usage block as a *product surface* rather than as documentation. Thirteen verbs and six exit codes are a complete app in text form, and the comparison to forty component folders is the whole verdict. (iteration 10)
- reading `identity.ts` before designing roles. The product has no sign-in because it has an identity, and the identity is the repository — that single fact answers four of the six questions at once. (iteration 11)
- reading all eight `LICENSE` files rather than trusting the earlier note. The earlier note was correct about the three repos it examined and wrong as a general statement, and the GPL-3.0 repo is the one that would have caused a real problem. (iteration 12)
- ranking by coupling rather than by size. The smallest slice is also the least coupled, and the largest slice is the only one that can leak, so coupling and failure mode agree on the order and no tie-break is needed. (iteration 13)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- reading `docs/configuration.md` for the vault wasted a call; the file is deployment configuration, and the vault is an app surface plus an API resource. (iteration 1)
- looking for a client-side decryption path assumed the app holds the secret; it never does, so the search was wasted. (iteration 2)
- searching for a refresh-token endpoint assumed a client-held token model; OpenBot re-asks the app instead, so there is nothing to rotate. (iteration 3)
- looking for the supervisor's source assumed it is in this repo; it is a published image, so the compose contract is the ceiling of what can be read here. (iteration 4)
- looking for a shared vault module assumed convergence; the three diverge completely, so the comparison had to be by shape rather than by code. (iteration 5)
- looking for an existing encryption helper assumed one exists; it does not, so the key rule had to be borrowed from turnstone rather than reused locally. (iteration 6)
- looking for a per-bot filter inside the launcher assumed the launcher knows about bots; it does not, and it should not, because the filter belongs where the bot definition is read. (iteration 7)
- assuming the sandbox was a property of the product. It is a property of the *executor kind*, and the map that says so is three files away from the posture module that enforces it. (iteration 8)
- expecting memory to be a module with a different name. It is genuinely absent, and the absence is the finding: memory is the one part of the eight with no coupling, which makes it the safest thing to defer. (iteration 9)
- expecting the Tauri shell to be a separate application. It is a window around the same web app, so its value is packaging, and packaging is not a capability a small team is missing. (iteration 10)
- expecting OpenBot's three roles to map onto three skilled-bots roles. `owner` is not assignable in OpenBot either, so it is a deployment property, and a small team's deployment has exactly one owner by construction. (iteration 11)
- expecting OpenBot's vault to be liftable TypeScript. It is a server-side feature described in OpenAPI, so its value is the shape of the endpoints, not the code behind them. (iteration 12)
- trying to rank by user value. Every slice is invisible to the operator until it is done, so value does not discriminate between them. (iteration 13)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `app/src/components/connections` is a UI surface over the same endpoints; it added no new contract facts beyond the three connect outcomes already in the API description. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `app/src/components/connections` is a UI surface over the same endpoints; it added no new contract facts beyond the three connect outcomes already in the API description.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `app/src/components/connections` is a UI surface over the same endpoints; it added no new contract facts beyond the three connect outcomes already in the API description.

### `app/src/components/manage/credentials-page.tsx` is the admin view of the same credential list, not a second store; reading it added the noun split ("key" in the personal edition, "credential" in the team edition) and nothing else. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `app/src/components/manage/credentials-page.tsx` is the admin view of the same credential list, not a second store; reading it added the noun split ("key" in the personal edition, "credential" in the team edition) and nothing else.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `app/src/components/manage/credentials-page.tsx` is the admin view of the same credential list, not a second store; reading it added the noun split ("key" in the personal edition, "credential" in the team edition) and nothing else.

### A browser inside the product: the operator's own browser already has the logins, which is what OpenBot's profiles volume exists to preserve. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A browser inside the product: the operator's own browser already has the logins, which is what OpenBot's profiles volume exists to preserve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A browser inside the product: the operator's own browser already has the logins, which is what OpenBot's profiles volume exists to preserve.

### A connector catalogue: none of the eight repos ships one that a small team would use, and the UTCP config already names the servers this team actually has. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A connector catalogue: none of the eight repos ships one that a small team would use, and the UTCP config already names the servers this team actually has.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A connector catalogue: none of the eight repos ships one that a small team would use, and the UTCP config already names the servers this team actually has.

### A new delivery channel for approvals: `desktop` is the only channel and it does not acknowledge, so the honest move is to fix the acknowledgement rather than add a channel. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A new delivery channel for approvals: `desktop` is the only channel and it does not acknowledge, so the honest move is to fix the acknowledgement rather than add a channel.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new delivery channel for approvals: `desktop` is the only channel and it does not acknowledge, so the honest move is to fix the acknowledgement rather than add a channel.

### A page-field injection like OpenBot's masked box: skilled bots has no browser, so there is no field to fill. The command variable is the equivalent primitive. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A page-field injection like OpenBot's masked box: skilled bots has no browser, so there is no field to fill. The command variable is the equivalent primitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A page-field injection like OpenBot's masked box: skilled bots has no browser, so there is no field to fill. The command variable is the equivalent primitive.

### A per-bot container: it is the largest piece of OpenBot's computer and it exists to serve a browser farm. A small team runs one bot at a time on one machine. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A per-bot container: it is the largest piece of OpenBot's computer and it exists to serve a browser farm. A small team runs one bot at a time on one machine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-bot container: it is the largest piece of OpenBot's computer and it exists to serve a browser farm. A small team runs one bot at a time on one machine.

### A profiles volume: the operator's own browser profile is the profiles volume, and it is already logged in. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A profiles volume: the operator's own browser profile is the profiles volume, and it is already logged in.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A profiles volume: the operator's own browser profile is the profiles volume, and it is already logged in.

### A proxy-injection like rakazo's `secret_request`: it needs a server that makes the outbound call, which skilled bots does not have and a small team does not need. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A proxy-injection like rakazo's `secret_request`: it needs a server that makes the outbound call, which skilled bots does not have and a small team does not need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A proxy-injection like rakazo's `secret_request`: it needs a server that makes the outbound call, which skilled bots does not have and a small team does not need.

### A sign-in system: it would be a second identity beside the one every path already uses, and the first thing it would have to do is agree with `identityKey`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: A sign-in system: it would be a second identity beside the one every path already uses, and the first thing it would have to do is agree with `identityKey`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A sign-in system: it would be a second identity beside the one every path already uses, and the first thing it would have to do is agree with `identityKey`.

### A Tauri shell: it wraps a web app that does not exist, and its value is packaging rather than capability. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A Tauri shell: it wraps a web app that does not exist, and its value is packaging rather than capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Tauri shell: it wraps a web app that does not exist, and its value is packaging rather than capability.

### Adding a `grants` table to the status index: the index is a projection of files, and a grant is already in the run record, so a table would be a second source of truth for the same fact. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Adding a `grants` table to the status index: the index is a projection of files, and a grant is already in the run record, so a table would be a second source of truth for the same fact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a `grants` table to the status index: the index is a projection of files, and a grant is already in the run record, so a table would be a second source of truth for the same fact.

### An external password manager like OpenMausBot's Bitwarden: it adds a service, a CLI dependency and a sync loop for a team of a few people. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: An external password manager like OpenMausBot's Bitwarden: it adds a service, a CLI dependency and a sync loop for a team of a few people.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An external password manager like OpenMausBot's Bitwarden: it adds a service, a CLI dependency and a sync loop for a team of a few people.

### Assuming gVisor is the boundary: it is opt-in, and the documented default is an ordinary container sharing the host kernel. The real boundary is the container plus the per-computer token. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Assuming gVisor is the boundary: it is opt-in, and the documented default is an ordinary container sharing the host kernel. The real boundary is the container plus the per-computer token.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming gVisor is the boundary: it is opt-in, and the documented default is an ordinary container sharing the host kernel. The real boundary is the container plus the per-computer token.

### Building a TUI now: the four surfaces are four verbs, and a TUI over `status --json` is a rendering exercise that can follow the stores rather than precede them. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Building a TUI now: the four surfaces are four verbs, and a TUI over `status --json` is a rendering exercise that can follow the stores rather than precede them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a TUI now: the four surfaces are four verbs, and a TUI over `status --json` is a rendering exercise that can follow the stores rather than precede them.

### Building all four slices as one packet: the first two prove the design, and the last two depend on what the first two learn about the run record. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Building all four slices as one packet: the first two prove the design, and the last two depend on what the first two learn about the run record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building all four slices as one packet: the first two prove the design, and the last two depend on what the first two learn about the run record.

### Building an OAuth server: it is the largest single piece of OpenBot's app layer and the one a small team can skip, because a shared account or a key covers the common case. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Building an OAuth server: it is the largest single piece of OpenBot's app layer and the one a small team can skip, because a shared account or a key covers the common case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building an OAuth server: it is the largest single piece of OpenBot's app layer and the one a small team can skip, because a shared account or a key covers the common case.

### Building memory in this packet: it is another pair's share and it couples to nothing here. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Building memory in this packet: it is another pair's share and it couples to nothing here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building memory in this packet: it is another pair's share and it couples to nothing here.

### Building memory now: it couples to nothing, so it can be added at any time and should be added last. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Building memory now: it couples to nothing, so it can be added at any time and should be added last.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building memory now: it couples to nothing, so it can be added at any time and should be added last.

### Copying OpenBot's connection registry: it is an OpenAPI description of a server this product does not have, so the shape transfers and the code does not. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Copying OpenBot's connection registry: it is an OpenAPI description of a server this product does not have, so the shape transfers and the code does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's connection registry: it is an OpenAPI description of a server this product does not have, so the shape transfers and the code does not.

### Copying OpenMausBot's computer: it is an Electron desktop shell driving a native CUA driver, which is the desktop path D4 deprioritises and the largest possible lift. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying OpenMausBot's computer: it is an Electron desktop shell driving a native CUA driver, which is the desktop path D4 deprioritises and the largest possible lift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenMausBot's computer: it is an Electron desktop shell driving a native CUA driver, which is the desktop path D4 deprioritises and the largest possible lift.

### Copying turnstone's OAuth stack wholesale: it is a Python service with a Fernet keyring and a per-server admin form, sized for a multi-node deployment rather than a few people on one host. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying turnstone's OAuth stack wholesale: it is a Python service with a Fernet keyring and a per-server admin form, sized for a multi-node deployment rather than a few people on one host.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying turnstone's OAuth stack wholesale: it is a Python service with a Fernet keyring and a per-server admin form, sized for a multi-node deployment rather than a few people on one host.

### gVisor: OpenBot itself leaves it unset by default, and the executor kinds that matter already give an OS boundary. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: gVisor: OpenBot itself leaves it unset by default, and the executor kinds that matter already give an OS boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: gVisor: OpenBot itself leaves it unset by default, and the executor kinds that matter already give an OS boundary.

### Lifting anything from openhuman: GPL-3.0 is copyleft, and a permissive product cannot absorb it. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Lifting anything from openhuman: GPL-3.0 is copyleft, and a permissive product cannot absorb it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting anything from openhuman: GPL-3.0 is copyleft, and a permissive product cannot absorb it.

### Lifting turnstone's OAuth runtime: it is Python, and the per-user path is dark by default, so the rule is worth more than the code. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Lifting turnstone's OAuth runtime: it is Python, and the per-user path is dark by default, so the rule is worth more than the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting turnstone's OAuth runtime: it is Python, and the per-user path is dark by default, so the rule is worth more than the code.

### Looking for a browser capability in the executor matrix: there is none. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` covers web *search*, not a browser, so a headed browser is not something any executor kind can be asked for. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a browser capability in the executor matrix: there is none. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` covers web *search*, not a browser, so a headed browser is not something any executor kind can be asked for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a browser capability in the executor matrix: there is none. `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` covers web *search*, not a browser, so a headed browser is not something any executor kind can be asked for.

### Looking for a client-side decryption path: every read endpoint returns metadata only, so there is nothing to decrypt in the app. The secret never leaves the server except into a page field. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a client-side decryption path: every read endpoint returns metadata only, so there is nothing to decrypt in the app. The secret never leaves the server except into a page field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a client-side decryption path: every read endpoint returns metadata only, so there is nothing to decrypt in the app. The secret never leaves the server except into a page field.

### Looking for a dependency that forces the secret store before the connector registry: there is none. The two share only the `grants` field, which is slice 4 and can land after both. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a dependency that forces the secret store before the connector registry: there is none. The two share only the `grants` field, which is slice 4 and can land after both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a dependency that forces the secret store before the connector registry: there is none. The two share only the `grants` field, which is slice 4 and can land after both.

### Looking for a memory module under a different name (`context`, `notes`, `knowledge`): the runtime has none. The nearest thing is the spec-kit's own packet documents, which are per-spec rather than per-bot. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a memory module under a different name (`context`, `notes`, `knowledge`): the runtime has none. The nearest thing is the spec-kit's own packet documents, which are per-spec rather than per-bot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a memory module under a different name (`context`, `notes`, `knowledge`): the runtime has none. The nearest thing is the spec-kit's own packet documents, which are per-spec rather than per-bot.

### Looking for a per-person key in the state root: there is none. `identityStatePaths` keys by identity only, and `retired` records identities rather than people. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Looking for a per-person key in the state root: there is none. `identityStatePaths` keys by identity only, and `retired` records identities rather than people.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-person key in the state root: there is none. `identityStatePaths` keys by identity only, and `retired` records identities rather than people.

### Looking for a refresh-token endpoint: there is none. Refresh is implicit in the connection record plus `confirmConnection` and `recheck`, which re-ask the app rather than rotating a token the client holds. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a refresh-token endpoint: there is none. Refresh is implicit in the connection record plus `confirmConnection` and `recheck`, which re-ask the app rather than rotating a token the client holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a refresh-token endpoint: there is none. Refresh is implicit in the connection record plus `confirmConnection` and `recheck`, which re-ask the app rather than rotating a token the client holds.

### Looking for a shared "vault" module across the three: each solves it differently (Postgres table, Fernet store, external password manager), so there is no single thing to lift. The reusable part is the *shape*, not the code. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a shared "vault" module across the three: each solves it differently (Postgres table, Fernet store, external password manager), so there is no single thing to lift. The reusable part is the *shape*, not the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a shared "vault" module across the three: each solves it differently (Postgres table, Fernet store, external password manager), so there is no single thing to lift. The reusable part is the *shape*, not the code.

### Looking for a terminal UI in the other seven repos: none ships one. OpenMausBot is Electron, OpenBot is Tauri plus a web app, and the rest are servers or CLIs without a TUI. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a terminal UI in the other seven repos: none ships one. OpenMausBot is Electron, OpenBot is Tauri plus a web app, and the rest are servers or CLIs without a TUI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a terminal UI in the other seven repos: none ships one. OpenMausBot is Electron, OpenBot is Tauri plus a web app, and the rest are servers or CLIs without a TUI.

### Looking for a TypeScript secret store in OpenBot: there is none. OpenBot's vault is server-side and its client only renders forms, so the only liftable TypeScript store in the eight repos is rakazo's. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a TypeScript secret store in OpenBot: there is none. OpenBot's vault is server-side and its client only renders forms, so the only liftable TypeScript store in the eight repos is rakazo's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a TypeScript secret store in OpenBot: there is none. OpenBot's vault is server-side and its client only renders forms, so the only liftable TypeScript store in the eight repos is rakazo's.

### Looking for an existing encryption helper in the runtime: there is none, so the key handling has to be specified rather than reused. Turnstone's config-only rule is the cheapest correct answer. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for an existing encryption helper in the runtime: there is none, so the key handling has to be specified rather than reused. Turnstone's config-only rule is the cheapest correct answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing encryption helper in the runtime: there is none, so the key handling has to be specified rather than reused. Turnstone's config-only rule is the cheapest correct answer.

### Looking for an existing per-bot MCP filter: there is none. The launcher is a pass-through, so the filter has to be added at the config-file level rather than inside the launcher. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for an existing per-bot MCP filter: there is none. The launcher is a pass-through, so the filter has to be added at the config-file level rather than inside the launcher.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing per-bot MCP filter: there is none. The launcher is a pass-through, so the filter has to be added at the config-file level rather than inside the launcher.

### Per-person connections: they need a sign-in surface and a session store. A small team on one host can share one account per app, which is OpenBot's own `shared` account mode. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Per-person connections: they need a sign-in surface and a session store. A small team on one host can share one account per app, which is OpenBot's own `shared` account mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-person connections: they need a sign-in surface and a session store. A small team on one host can share one account per app, which is OpenBot's own `shared` account mode.

### Per-person secret stores: they would break the shared-account case, which is the common case for a small team and is OpenBot's own `shared` account mode. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Per-person secret stores: they would break the shared-account case, which is the common case for a small team and is OpenBot's own `shared` account mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-person secret stores: they would break the shared-account case, which is the common case for a small team and is OpenBot's own `shared` account mode.

### Reading `OpenBot-main/docs/configuration.md` for the vault: the file is 130 KB of deployment configuration and contains no vault section, so the vault's shape had to come from the app components and the API instead. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `OpenBot-main/docs/configuration.md` for the vault: the file is 130 KB of deployment configuration and contains no vault section, so the vault's shape had to come from the app components and the API instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `OpenBot-main/docs/configuration.md` for the vault: the file is 130 KB of deployment configuration and contains no vault section, so the vault's shape had to come from the app components and the API instead.

### Searching for a `supervisor/` or `agent-computer/` directory in this checkout: both are published images referenced by name, so their source is not here. The compose file's comments are the contract, and they are unusually explicit about why each setting exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a `supervisor/` or `agent-computer/` directory in this checkout: both are published images referenced by name, so their source is not here. The compose file's comments are the contract, and they are unusually explicit about why each setting exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `supervisor/` or `agent-computer/` directory in this checkout: both are published images referenced by name, so their source is not here. The compose file's comments are the contract, and they are unusually explicit about why each setting exists.

### Searching for a `vault/` or `secret/` directory at the repo root of `OpenBot-main` returns nothing; the vault lives in `app/src/components/vault/` and `app/src/components/manage/`, and the server side is behind the API rather than a named module. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a `vault/` or `secret/` directory at the repo root of `OpenBot-main` returns nothing; the vault lives in `app/src/components/vault/` and `app/src/components/manage/`, and the server side is behind the API rather than a named module.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `vault/` or `secret/` directory at the repo root of `OpenBot-main` returns nothing; the vault lives in `app/src/components/vault/` and `app/src/components/manage/`, and the server side is behind the API rather than a named module.

### Starting with the secret store: it is the largest slice and the only one that can leak, so starting there puts the risk first and the proof last. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Starting with the secret store: it is the largest slice and the only one that can leak, so starting there puts the risk first and the proof last.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with the secret store: it is the largest slice and the only one that can leak, so starting there puts the risk first and the proof last.

### Three roles: OpenBot's own `owner` is not assignable, so a small team's two roles are the same shape with the deployment owner implicit. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Three roles: OpenBot's own `owner` is not assignable, so a small team's two roles are the same shape with the deployment owner implicit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Three roles: OpenBot's own `owner` is not assignable, so a small team's two roles are the same shape with the deployment owner implicit.

### Treating "saved login" and "credential" as one store: they have different owners, different permissions and different use paths, so a parity build needs both or an explicit decision to ship one. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating "saved login" and "credential" as one store: they have different owners, different permissions and different use paths, so a parity build needs both or an explicit decision to ship one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "saved login" and "credential" as one store: they have different owners, different permissions and different use paths, so a parity build needs both or an explicit decision to ship one.

### Treating `posture.secrets` as an existing feature: grepping the runtime for `secrets` returns only the definition field and the leak guard, so there is nothing to compare against yet. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `posture.secrets` as an existing feature: grepping the runtime for `secrets` returns only the definition field and the leak guard, so there is nothing to compare against yet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `posture.secrets` as an existing feature: grepping the runtime for `secrets` returns only the definition field and the leak guard, so there is nothing to compare against yet.

### Treating any of the three as a connector catalogue: none ships a catalogue of apps; rakazo and turnstone both assume you bring the service, and OpenMausBot assumes you bring the password manager. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating any of the three as a connector catalogue: none ships a catalogue of apps; rakazo and turnstone both assume you bring the service, and OpenMausBot assumes you bring the password manager.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating any of the three as a connector catalogue: none ships a catalogue of apps; rakazo and turnstone both assume you bring the service, and OpenMausBot assumes you bring the password manager.

### Treating the computer as a sandbox mode: it is a separate service with its own image, entrypoint, volumes and token. A sandbox flag on an executor cannot stand in for it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the computer as a sandbox mode: it is a separate service with its own image, entrypoint, volumes and token. A sandbox flag on an executor cannot stand in for it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the computer as a sandbox mode: it is a separate service with its own image, entrypoint, volumes and token. A sandbox flag on an executor cannot stand in for it.

### Treating the OAuth client as the normal path: it is the exception for vendors that refuse dynamic registration, so a parity build should not start there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the OAuth client as the normal path: it is the exception for vendors that refuse dynamic registration, so a parity build should not start there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the OAuth client as the normal path: it is the exception for vendors that refuse dynamic registration, so a parity build should not start there.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

- Source pointers: `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md` (the eight-part frame), `specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md`, `specs/system-skilled-bots/context/OpenBot-main/api/`, `.skilled/skills/system-skilled-bots/` (BOT.md, runtime, triggers, needs-you, worktrees, desktop delivery, status index), `.skilled/bin/bots.cjs`.
- Reuse candidates: OpenBot's Tauri shell and connector/vault layer; turnstone-main and OpenMausBot-main terminal surfaces; rakazo-main and openhuman-main runtime shapes.
- Integration points: `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/runtime/`, the spec-kit packet layout.
- Constraints and risks: eight repos of unknown size; no network access assumed; every claim needs a `[SOURCE: path:line]` that resolves.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue`
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-skilled-bots/002-openbot-parity-research/research/lineages/vibe-2/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-24T20:08:00.000Z
