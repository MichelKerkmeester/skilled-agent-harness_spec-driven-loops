---
title: Deep Research Strategy - OpenBot Parity for Skilled Bots (vibe-1 lineage)
description: Runtime strategy for the vibe-1 fan-out lineage of the OpenBot parity research run.
trigger_phrases:
  - "deep research strategy"
  - "openbot parity"
  - "skilled bots"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - OpenBot Parity for Skilled Bots (vibe-1 lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for the vibe-1 fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration; machine-owned sections are rewritten by the reducer.

### Usage

- **Init:** populated with Topic, Key Questions, Known Context, and Research Boundaries.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's.

Inputs (read-only): eight reference repos under specs/system-skilled-bots/context/ (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under .skilled/skills/system-skilled-bots/.

OpenBot frames a bot as eight parts in four pairs (OpenBot-main/docs/how-openbot-works.md): conversations and routines, memory and skills, apps and computer, approvals and activity.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- [x] How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?
- [x] What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?
- [x] How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?
- [x] What does the hermes-muse skills/companion format look like, and is it liftable as a skill store?
- [x] How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Enterprise, multi-tenant, Kubernetes, managed-upgrade and mobile capability. These are recorded on a skip list with reasons, not designed.
- Building anything. The packet ends at a recommendation.
- Re-deriving what the other three lineages own; this lineage works its dealt frontier share and the memory/skills part of the eight-part frame.

---

## 5. STOP CONDITIONS
- config.maxIterations (13) reached. stopPolicy is max-iterations, so convergence before the cap is telemetry only.
- Three trailing failed iterations.
- maxDurationMinutes (120) elapsed since createdAt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How do the reference repos build bot memory (per-bot and shared) and skills (written, recorded from a demonstration, proposed from use), and how would those map onto Skilled skills and the spec-kit?
- How does an OpenBot memory reviewState (unreviewed, confirmed, edited) map onto a skilled-bots needs-you item?
- What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?
- How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?
- What does the hermes-muse skills/companion format look like, and is it liftable as a skill store?
- How does an OpenBot LearningProposal review (pending_review, approved, rejected with evidence) map onto a Skilled skill proposal?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- going to the OpenAPI spec before the prose docs. The spec carries the discriminators (`formedBy`, `formedByBotId`, `reviewState`, `enabled`) that decide recall, and the docs only restate them; reading the spec first made the docs a confirmation rather than a source of ambiguity. (iteration 1)
- reading the `Skill` schema before the Learning docs. Seeing that `tools` is declarative and that `ownerId`/`botIds` carry the scoping made the Learning material read as "how a skill gets created", not "how a skill gets permission" — which is the distinction that decides how small a parity change can be. (iteration 2)
- reading `memory.md` before `DESIGN.md`. The reference file states the rules the model must follow, and `DESIGN.md` then showed which of those rules are enforced in code — that split is the reusable idea, because a rule stated only in prose is a rule a model can drift from. (iteration 3)
- reading OpenGhost's `tidy` acceptance rule rather than only its prompt. The prompt is the easy part; the four rejection conditions are what make a model rewrite safe, and they are the part a copy would most likely drop. (iteration 4)
- reading the Skilled side only after the four repos were fully evidenced. The mapping fell out of the comparison rather than being designed from Skilled's existing shape, which is why it is asymmetric — skills need almost nothing and memory needs a new file. (iteration 5)
- reading the `NeedsYouItem` interface rather than only the feature page. The interface shows `id` is the run id, which is the single fact that turns "reuse the item" into "reuse the item's shape"; the prose page alone would have made the reuse look free. (iteration 6)
- reading `state-root.ts` before designing anything. It already answers the layout question — shared entries beside per-identity folders — so the memory store becomes a third entry in an existing shape rather than a new subsystem. The file also states the rule that decides the format: everything a run must not write lives outside every checkout. (iteration 7)
- reading the installer's `NEXT_FIRE_UNKNOWN` constant. It is one line with a comment, and it settles the whole `nextSyncAt` question: the runtime has already decided not to predict a fire, so a stored next-sync time would be the only guessed timestamp in the tree. (iteration 8)
- measuring the folder before reading it. The line counts show the generated `interface.md` is 311 lines against a 26-line median, which is the single-source rule made visible: the one page that must be complete is the one page nobody writes by hand. (iteration 9)
- reading the approve and reject descriptions rather than only the schema. The schema says `status` is three values; the descriptions say approve is idempotent, reject is refused after approve, and only an administrator may review. Those three sentences decide the whole design, and none of them is visible in the field list. (iteration 10)
- searching for a TUI library across all eight repos before reading any of them. One grep found `openhuman-tui`, which is the only terminal client in the set and settles the verdict with its own README rather than with an argument. (iteration 11)
- reading OpenBot's single-person install rules before its role model. They show that the largest product in the set ships a no-sign-in mode as a first-class case, which turns the small-team question from "what auth do we build" into "which of OpenBot's two modes do we already match". (iteration 12)
- reading `personal-edition.md` before the skip list. It shows OpenBot itself ships a one-person, no-sign-in edition, so the skip list is not a list of things OpenBot lacks — it is a list of things the `team` edition adds for organizations larger than this one. (iteration 13)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- searching for a memory implementation directory. The reference checkout ships the contract, not the server, so an implementation-level answer is not available here and pretending otherwise would have produced an unsupported claim. (iteration 1)
- looking for an origin field on `Skill`. The three origins converge on one record, so the search was answering a question the design deliberately does not ask. (iteration 2)
- looking for a skill proposal path. hermes-muse ships one hand-authored skill, so it has no learning loop to compare; the absence is itself the finding. (iteration 3)
- expecting a proposal queue in OpenGhost. It installs skills from links and folders, so the learning loop simply is not there; recording the absence stops a later iteration from searching for it again. (iteration 4)
- looking for an existing Skilled memory store to extend. The spec-kit's continuity surfaces are per-packet, so extending them would have conflated "what this packet knows" with "what this person knows", which is the confusion the node exists to prevent. (iteration 5)
- looking for a non-holding item class. `holdForBot` holds on any open item, so the hold is structural, not a flag. (iteration 6)
- assuming the node's JSONL framing was a constraint. Checking `writeStateAtomic` showed the runtime has no append path at all, so JSONL would be the only append-only store in the tree. (iteration 7)
- looking for a next-fire calculator to reuse. There is none, and the absence is deliberate rather than an oversight. (iteration 8)
- looking for a skill-proposal mechanism in hermes-muse. The companion skill is authored, so the only staged-write path is memory, and the proposal pattern has to be inferred from that path rather than copied. (iteration 9)
- looking for a proposal mechanism to extend. Skilled has none, so the proposal store has to be built from the needs-you item rather than adapted from an existing draft path. (iteration 10)
- expecting OpenBot's desktop to be a chat client. Its ownership table shows the native side is an engine installer and container supervisor, so the desktop's value is in the stack it manages, not the screens it draws. (iteration 11)
- looking for a permission check in the runtime. There is none, so the roles model has to be added at one call site rather than extended from an existing gate. (iteration 12)
- looking for a permissively licensed terminal client. The only one is GPL-3.0, so the terminal item has to be written rather than lifted, which is why it sits last. (iteration 13)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A database-backed skill store. hermes-muse keeps skills as markdown and state in SQLite, and the skill is explicitly forbidden to hand-edit that database; a skill store in a database would invert that split. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A database-backed skill store. hermes-muse keeps skills as markdown and state in SQLite, and the skill is explicitly forbidden to hand-edit that database; a skill store in a database would invert that split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A database-backed skill store. hermes-muse keeps skills as markdown and state in SQLite, and the skill is explicitly forbidden to hand-edit that database; a skill store in a database would invert that split.

### A fifth trigger kind for memory sync. The four kinds already cover a timed read-in, and a new kind would need its own validation, install path and drift rule. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A fifth trigger kind for memory sync. The four kinds already cover a timed read-in, and a new kind would need its own validation, install path and drift rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fifth trigger kind for memory sync. The four kinds already cover a timed read-in, and a new kind would need its own validation, install path and drift rule.

### A new frontmatter schema. Skilled's five keys already cover what the companion's three do, and adding a key would need a discovery-rule change for no gain. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A new frontmatter schema. Skilled's five keys already cover what the companion's three do, and adding a key would need a discovery-rule change for no gain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new frontmatter schema. Skilled's five keys already cover what the companion's three do, and adding a key would need a discovery-rule change for no gain.

### A new review command beside `bots answer`. The needs-you item already carries a question, options, an answer and evidence, which is the whole proposal review. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A new review command beside `bots answer`. The needs-you item already carries a question, options, an answer and evidence, which is the whole proposal review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new review command beside `bots answer`. The needs-you item already carries a question, options, an answer and evidence, which is the whole proposal review.

### A second SQLite database for memory. The index is SQLite because it answers cross-identity queries; memory is read whole by one bot at a time, so a database would add a schema and a migration for no query benefit. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A second SQLite database for memory. The index is SQLite because it answers cross-identity queries; memory is read whole by one bot at a time, so a database would add a schema and a migration for no query benefit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second SQLite database for memory. The index is SQLite because it answers cross-identity queries; memory is read whole by one bot at a time, so a database would add a schema and a migration for no query benefit.

### A separate proposal UI. hermes-muse reviews a staged write with a slash command and an id, which is the same shape as `bots inbox` plus `bots answer`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A separate proposal UI. hermes-muse reviews a staged write with a slash command and an id, which is the same shape as `bots inbox` plus `bots answer`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate proposal UI. hermes-muse reviews a staged write with a slash command and an id, which is the same shape as `bots inbox` plus `bots answer`.

### A separate review UI. `bots inbox` already lists open items and `bots answer` already resolves them; a second surface would be the "two pages answering the same question" that OpenBot's own rules forbid. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A separate review UI. `bots inbox` already lists open items and `bots answer` already resolves them; a second surface would be the "two pages answering the same question" that OpenBot's own rules forbid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate review UI. `bots inbox` already lists open items and `bots answer` already resolves them; a second surface would be the "two pages answering the same question" that OpenBot's own rules forbid.

### A separate shared-memory store and per-bot memory store. No reference repo does it, and it doubles the write path for no gain. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A separate shared-memory store and per-bot memory store. No reference repo does it, and it doubles the write path for no gain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate shared-memory store and per-bot memory store. No reference repo does it, and it doubles the write path for no gain.

### A separate sync scheduler beside the drain job. The drain job already runs on a throttle with backoff and already claims requests from the inbox. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A separate sync scheduler beside the drain job. The drain job already runs on a throttle with backoff and already claims requests from the inbox.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate sync scheduler beside the drain job. The drain job already runs on a throttle with backoff and already claims requests from the inbox.

### A session token or cookie. The state root's owner and mode already decide who can read and write, and a token would be a second authority that can disagree with the filesystem. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: A session token or cookie. The state root's owner and mode already decide who can read and write, and a token would be a second authority that can disagree with the filesystem.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A session token or cookie. The state root's owner and mode already decide who can read and write, and a token would be a second authority that can disagree with the filesystem.

### A web UI served from the CLI. The TUI needs no HTTP server or sidecar, and a served UI would add a port, a session and a browser to a tool that already runs in the terminal. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: A web UI served from the CLI. The TUI needs no HTTP server or sidecar, and a served UI would add a port, a session and a browser to a tool that already runs in the terminal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A web UI served from the CLI. The TUI needs no HTTP server or sidecar, and a served UI would add a port, a session and a browser to a tool that already runs in the terminal.

### Adding a third `edited` review state. The answer text already carries the rewrite, so a third state would need its own transition rules for no recall benefit. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Adding a third `edited` review state. The answer text already carries the rewrite, so a third state would need its own transition rules for no recall benefit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a third `edited` review state. The answer text already carries the rewrite, so a third state would need its own transition rules for no recall benefit.

### Applying a proposal without the skill-advisor's trusted mutation path. That path is the only write the advisor trusts, and a second write path would bypass its gate. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Applying a proposal without the skill-advisor's trusted mutation path. That path is the only write the advisor trusts, and a second write path would bypass its gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Applying a proposal without the skill-advisor's trusted mutation path. That path is the only write the advisor trusts, and a second write path would bypass its gate.

### Building a second memory store beside the host's. hermes-muse explicitly declines to, and the reason is structural: two stores drift and the model cannot tell which is authoritative. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Building a second memory store beside the host's. hermes-muse explicitly declines to, and the reason is structural: two stores drift and the model cannot tell which is authoritative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a second memory store beside the host's. hermes-muse explicitly declines to, and the reason is structural: two stores drift and the model cannot tell which is authoritative.

### Building a Tauri shell first. OpenBot's native side exists to install and supervise Compose, and a runtime that boots in-process has nothing to install or supervise. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Building a Tauri shell first. OpenBot's native side exists to install and supervise Compose, and a runtime that boots in-process has nothing to install or supervise.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a Tauri shell first. OpenBot's native side exists to install and supervise Compose, and a runtime that boots in-process has nothing to install or supervise.

### Building sign-in. OpenBot's own single-person install has none, and a few people on one machine already have an OS identity that a session would only duplicate. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Building sign-in. OpenBot's own single-person install has none, and a few people on one machine already have an OS identity that a session would only duplicate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building sign-in. OpenBot's own single-person install has none, and a few people on one machine already have an OS identity that a session would only duplicate.

### Building the "recorded from a demonstration" origin. It needs a recorder, a container per person and an external analysis service, which is the enterprise shape D3 puts on the skip list. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Building the "recorded from a demonstration" origin. It needs a recorder, a container per person and an external analysis service, which is the enterprise shape D3 puts on the skip list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building the "recorded from a demonstration" origin. It needs a recorder, a container per person and an external analysis service, which is the enterprise shape D3 puts on the skip list.

### Building the terminal client first. It would draw four empty surfaces until the memory, review, proposal and routine items exist. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Building the terminal client first. It would draw four empty surfaces until the memory, review, proposal and routine items exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building the terminal client first. It would draw four empty surfaces until the memory, review, proposal and routine items exist.

### Copying hermes-muse's `SKILL.md` frontmatter as a skill record. It carries three fields and no scoping, so it cannot express who may use a skill or which bot offers it; the OpenBot `Skill` record is the better shape and the Skilled `SKILL.md` frontmatter is already richer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Copying hermes-muse's `SKILL.md` frontmatter as a skill record. It carries three fields and no scoping, so it cannot express who may use a skill or which bot offers it; the OpenBot `Skill` record is the better shape and the Skilled `SKILL.md` frontmatter is already richer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying hermes-muse's `SKILL.md` frontmatter as a skill record. It carries three fields and no scoping, so it cannot express who may use a skill or which bot offers it; the OpenBot `Skill` record is the better shape and the Skilled `SKILL.md` frontmatter is already richer.

### Copying OpenBot's `reviewState` as a three-value enum with an `edited` state. Two values (`unreviewed`, `confirmed`) carry the gate; `edited` is a UI affordance, not a recall rule. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Copying OpenBot's `reviewState` as a three-value enum with an `edited` state. Two values (`unreviewed`, `confirmed`) carry the gate; `edited` is a UI affordance, not a recall rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's `reviewState` as a three-value enum with an `edited` state. Two values (`unreviewed`, `confirmed`) carry the gate; `edited` is a UI affordance, not a recall rule.

### Copying openhuman's four tabs as-is. Logs, Chat, Config and Settings are its own split; the OpenBot surfaces are conversations, approvals, activity and routines. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Copying openhuman's four tabs as-is. Logs, Chat, Config and Settings are its own split; the OpenBot surfaces are conversations, approvals, activity and routines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying openhuman's four tabs as-is. Logs, Chat, Config and Settings are its own split; the OpenBot surfaces are conversations, approvals, activity and routines.

### Copying openhuman's memory subsystem. It is a vendored engine with a job queue, a document brain and a source registry, and it is GPL-3.0. For a small team it is the wrong size and the wrong licence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Copying openhuman's memory subsystem. It is a vendored engine with a job queue, a document brain and a source registry, and it is GPL-3.0. For a small team it is the wrong size and the wrong licence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying openhuman's memory subsystem. It is a vendored engine with a job queue, a document brain and a source registry, and it is GPL-3.0. For a small team it is the wrong size and the wrong licence.

### Embedding evidence in the proposal. OpenBot serves evidence from its own endpoint so a reviewer reads it on demand; embedding it would make every proposal carry its whole transcript. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Embedding evidence in the proposal. OpenBot serves evidence from its own endpoint so a reviewer reads it on demand; embedding it would make every proposal carry its whole transcript.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Embedding evidence in the proposal. OpenBot serves evidence from its own endpoint so a reviewer reads it on demand; embedding it would make every proposal carry its whole transcript.

### Keeping the multi-tenant memory scope. A small team is one organization, so the second scope would be a branch nothing takes. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Keeping the multi-tenant memory scope. A small team is one organization, so the second scope would be a branch nothing takes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping the multi-tenant memory scope. A small team is one organization, so the second scope would be a branch nothing takes.

### Keying memory by repository identity only. That is what the runtime does today, and it makes a person's facts vanish when they move to another checkout. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Keying memory by repository identity only. That is what the runtime does today, and it makes a person's facts vanish when they move to another checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keying memory by repository identity only. That is what the runtime does today, and it makes a person's facts vanish when they move to another checkout.

### Lifting OpenBot's desktop shell. Its native side installs and supervises Compose, which this runtime does not have. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Lifting OpenBot's desktop shell. Its native side installs and supervises Compose, which this runtime does not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting OpenBot's desktop shell. Its native side installs and supervises Compose, which this runtime does not have.

### Lifting openhuman's TUI code. GPL-3.0 cannot be relicensed into this tree, so only the shape transfers. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Lifting openhuman's TUI code. GPL-3.0 cannot be relicensed into this tree, so only the shape transfers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting openhuman's TUI code. GPL-3.0 cannot be relicensed into this tree, so only the shape transfers.

### Lifting the companion folder as a template. Its 21 references are all Muse domain pages (goals, dispatch, proactivity, sources, calendar, weather, feed, briefings), so copying the folder would import a domain, not a format. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Lifting the companion folder as a template. Its 21 references are all Muse domain pages (goals, dispatch, proactivity, sources, calendar, weather, feed, briefings), so copying the folder would import a domain, not a format.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting the companion folder as a template. Its 21 references are all Muse domain pages (goals, dispatch, proactivity, sources, calendar, weather, feed, briefings), so copying the folder would import a domain, not a format.

### Looking for a next-fire calculator in the runtime. There is none by design: `NEXT_FIRE_UNKNOWN` is the only value the installer ever reports for `nextFire`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a next-fire calculator in the runtime. There is none by design: `NEXT_FIRE_UNKNOWN` is the only value the installer ever reports for `nextFire`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a next-fire calculator in the runtime. There is none by design: `NEXT_FIRE_UNKNOWN` is the only value the installer ever reports for `nextFire`.

### Looking for a non-holding item class in `needs-you.ts`. There is none: `holdForBot` returns a hold for any open item of the bot, so a non-holding review item is a new shape rather than a configuration of the existing one. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a non-holding item class in `needs-you.ts`. There is none: `holdForBot` returns a hold for any open item of the bot, so a non-holding review item is a new shape rather than a configuration of the existing one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a non-holding item class in `needs-you.ts`. There is none: `holdForBot` returns a hold for any open item of the bot, so a non-holding review item is a new shape rather than a configuration of the existing one.

### Looking for a permissively licensed terminal client to lift. The only one in the set is openhuman's, and it is GPL-3.0. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Looking for a permissively licensed terminal client to lift. The only one in the set is openhuman's, and it is GPL-3.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a permissively licensed terminal client to lift. The only one in the set is openhuman's, and it is GPL-3.0.

### Looking for a role or permission check anywhere in the runtime. There is none: `bots answer` writes the answer after a secret check and nothing else. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a role or permission check anywhere in the runtime. There is none: `bots answer` writes the answer after a secret check and nothing else.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a role or permission check anywhere in the runtime. There is none: `bots answer` writes the answer after a secret check and nothing else.

### Looking for a skill-proposal or skill-review path in hermes-muse. There is none: its one skill is hand-authored and shipped, so it offers no evidence for the "proposed from use" origin. That origin has to be answered from OpenBot and from Skilled's own spec-kit, not from this repo. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a skill-proposal or skill-review path in hermes-muse. There is none: its one skill is hand-authored and shipped, so it offers no evidence for the "proposed from use" origin. That origin has to be answered from OpenBot and from Skilled's own spec-kit, not from this repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a skill-proposal or skill-review path in hermes-muse. There is none: its one skill is hand-authored and shipped, so it offers no evidence for the "proposed from use" origin. That origin has to be answered from OpenBot and from Skilled's own spec-kit, not from this repo.

### Looking for a skill-proposal path in OpenGhost. Its skills are discovered from folders and installed from a link; there is no proposal queue. The "proposed from use" origin remains an OpenBot-only pattern in this repo set. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a skill-proposal path in OpenGhost. Its skills are discovered from folders and installed from a link; there is no proposal queue. The "proposed from use" origin remains an OpenBot-only pattern in this repo set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a skill-proposal path in OpenGhost. Its skills are discovered from folders and installed from a link; there is no proposal queue. The "proposed from use" origin remains an OpenBot-only pattern in this repo set.

### Looking for an existing per-person key to hang memory on. There is none: `identityKey` is derived from `owner/name`, and no other identity dimension exists in the runtime. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for an existing per-person key to hang memory on. There is none: `identityKey` is derived from `owner/name`, and no other identity dimension exists in the runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing per-person key to hang memory on. There is none: `identityKey` is derived from `owner/name`, and no other identity dimension exists in the runtime.

### Looking for an existing proposal or draft mechanism in `.skilled/skills/`. There is none: skills are authored directly, and the only staged-write pattern in the tree is the needs-you item. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for an existing proposal or draft mechanism in `.skilled/skills/`. There is none: skills are authored directly, and the only staged-write pattern in the tree is the needs-you item.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing proposal or draft mechanism in `.skilled/skills/`. There is none: skills are authored directly, and the only staged-write pattern in the tree is the needs-you item.

### Modelling the three origins as three storage locations. All three produce the same `Skill` record; only the proposal path adds a staging row, so the origin is provenance rather than a separate store. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Modelling the three origins as three storage locations. All three produce the same `Skill` record; only the proposal path adds a staging row, so the origin is provenance rather than a separate store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Modelling the three origins as three storage locations. All three produce the same `Skill` record; only the proposal path adds a staging row, so the origin is provenance rather than a separate store.

### One JSON file per fact, matching `records/` and `needs-you/`. A memory of a few hundred facts would become a few hundred files, and recall would read the whole folder on every run. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: One JSON file per fact, matching `records/` and `needs-you/`. A memory of a few hundred facts would become a few hundred files, and recall would read the whole folder on every run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: One JSON file per fact, matching `records/` and `needs-you/`. A memory of a few hundred facts would become a few hundred files, and recall would read the whole folder on every run.

### One JSONL per person. The runtime's atomic write helper is whole-file, so JSONL buys nothing and costs a new append path plus a line-level parser. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: One JSONL per person. The runtime's atomic write helper is whole-file, so JSONL buys nothing and costs a new append path plus a line-level parser.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: One JSONL per person. The runtime's atomic write helper is whole-file, so JSONL buys nothing and costs a new append path plus a line-level parser.

### Per-bot memory ownership. OpenBot scopes memory to the person and the organization, and a per-bot store would make a person's facts disappear when the bot is renamed. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Per-bot memory ownership. OpenBot scopes memory to the person and the organization, and a per-bot store would make a person's facts disappear when the bot is renamed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Per-bot memory ownership. OpenBot scopes memory to the person and the organization, and a per-bot store would make a person's facts disappear when the bot is renamed.

### Reading the generated TypeScript client under `app/src/lib/api/generated/memory/` as the model source. It is generated from `api/openapi/memory.yaml`, so the spec is the authority and the client adds no semantics. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the generated TypeScript client under `app/src/lib/api/generated/memory/` as the model source. It is generated from `api/openapi/memory.yaml`, so the spec is the authority and the client adds no semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the generated TypeScript client under `app/src/lib/api/generated/memory/` as the model source. It is generated from `api/openapi/memory.yaml`, so the spec is the authority and the client adds no semantics.

### Reusing `NeedsYouItem` verbatim for memory review. Its `id` is the run id and its open state holds the bot, so a single unreviewed fact would stop every later run of that bot. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reusing `NeedsYouItem` verbatim for memory review. Its `id` is the run id and its open state holds the bot, so a single unreviewed fact would stop every later run of that bot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing `NeedsYouItem` verbatim for memory review. Its `id` is the run id and its open state holds the bot, so a single unreviewed fact would stop every later run of that bot.

### Searching `skills.yaml` for a "taught" or "recorded" origin field returned nothing. The recorded-from-a-demonstration origin is not a field on `Skill`; it is a Learning path that ends in the same record. Any design that adds an `origin` column to a skill store is inventing a distinction OpenBot does not persist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching `skills.yaml` for a "taught" or "recorded" origin field returned nothing. The recorded-from-a-demonstration origin is not a field on `Skill`; it is a Learning path that ends in the same record. Any design that adds an `origin` column to a skill store is inventing a distinction OpenBot does not persist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `skills.yaml` for a "taught" or "recorded" origin field returned nothing. The recorded-from-a-demonstration origin is not a field on `Skill`; it is a Learning path that ends in the same record. Any design that adds an `origin` column to a skill store is inventing a distinction OpenBot does not persist.

### Searching for a memory implementation directory under `api/` returned only `api/openapi/memory.yaml`. OpenBot's memory server code is not in this reference checkout, so the model must be read from the spec and docs. This bounds how far "how it is built" can be answered for memory: the contract is available, the implementation is not. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a memory implementation directory under `api/` returned only `api/openapi/memory.yaml`. OpenBot's memory server code is not in this reference checkout, so the model must be read from the spec and docs. This bounds how far "how it is built" can be answered for memory: the contract is available, the implementation is not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a memory implementation directory under `api/` returned only `api/openapi/memory.yaml`. OpenBot's memory server code is not in this reference checkout, so the model must be read from the spec and docs. This bounds how far "how it is built" can be answered for memory: the contract is available, the implementation is not.

### Searching hermes-muse for a skill-proposal or skill-creation mechanism. There is none: the companion skill is authored, never generated, and the only staged-write path is for memory. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Searching hermes-muse for a skill-proposal or skill-creation mechanism. There is none: the companion skill is authored, never generated, and the only staged-write path is for memory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching hermes-muse for a skill-proposal or skill-creation mechanism. There is none: the companion skill is authored, never generated, and the only staged-write path is for memory.

### Searching Skilled for an existing memory store to extend. There is none: the only continuity surface is the spec-kit's per-packet `handover.md` and `_memory.continuity`, which is per-packet, not per-person or per-bot. The gap is real and cannot be closed by configuration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching Skilled for an existing memory store to extend. There is none: the only continuity surface is the spec-kit's per-packet `handover.md` and `_memory.continuity`, which is per-packet, not per-person or per-bot. The gap is real and cannot be closed by configuration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching Skilled for an existing memory store to extend. There is none: the only continuity surface is the spec-kit's per-packet `handover.md` and `_memory.continuity`, which is per-packet, not per-person or per-bot. The gap is real and cannot be closed by configuration.

### Searching the other seven repos for a terminal UI. Only openhuman ships one; OpenBot, buzz and openhuman's own app are Tauri, and OpenGhost and hermes-muse are desktop shells. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Searching the other seven repos for a terminal UI. Only openhuman ships one; OpenBot, buzz and openhuman's own app are Tauri, and OpenGhost and hermes-muse are desktop shells.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the other seven repos for a terminal UI. Only openhuman ships one; OpenBot, buzz and openhuman's own app are Tauri, and OpenGhost and hermes-muse are desktop shells.

### Storing `nextSyncAt` as a computed timestamp. The runtime deliberately reports `UNKNOWN` for a next fire because no launchd surface reports one, so a stored value would be a guess that goes stale. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Storing `nextSyncAt` as a computed timestamp. The runtime deliberately reports `UNKNOWN` for a next fire because no launchd surface reports one, so a stored value would be a guess that goes stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing `nextSyncAt` as a computed timestamp. The runtime deliberately reports `UNKNOWN` for a next fire because no launchd surface reports one, so a stored value would be a guess that goes stale.

### Storing `status` as a field on the proposal. Every value is readable from the answer and the applied skill, so a stored copy could disagree with them, which is the same failure the needs-you item avoids. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Storing `status` as a field on the proposal. Every value is readable from the answer and the applied skill, so a stored copy could disagree with them, which is the same failure the needs-you item avoids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing `status` as a field on the proposal. Every value is readable from the answer and the applied skill, so a stored copy could disagree with them, which is the same failure the needs-you item avoids.

### Storing `syncStatus` as a field. Every one of its four values is already readable from the queue and the last run record, so a stored copy could disagree with them. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Storing `syncStatus` as a field. Every one of its four values is already readable from the queue and the last run record, so a stored copy could disagree with them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing `syncStatus` as a field. Every one of its four values is already readable from the queue and the last run record, so a stored copy could disagree with them.

### Three roles. `admin` governs people, sign-in and policy; with no sign-in there is nothing for it to govern, so it collapses into `owner`. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Three roles. `admin` governs people, sign-in and policy; with no sign-in there is nothing for it to govern, so it collapses into `owner`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Three roles. `admin` governs people, sign-in and policy; with no sign-in there is nothing for it to govern, so it collapses into `owner`.

### Treating `formedBy: intelligence` as a fourth memory scope. It is a provenance value for a fact the backend holds that OpenBot formed no record of, and the schema says such a fact "can be edited or forgotten but not paused" — a storage-origin distinction, not a scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `formedBy: intelligence` as a fourth memory scope. It is a provenance value for a fact the backend holds that OpenBot formed no record of, and the schema says such a fact "can be edited or forgotten but not paused" — a storage-origin distinction, not a scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `formedBy: intelligence` as a fourth memory scope. It is a provenance value for a fact the backend holds that OpenBot formed no record of, and the schema says such a fact "can be edited or forgotten but not paused" — a storage-origin distinction, not a scope.

### Treating `tools` on a skill as a capability grant. The schema says naming an action gives no bot access to it, so a skill cannot be used to escalate a bot's reach and does not need a grant check at approval time. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `tools` on a skill as a capability grant. The schema says naming an action gives no bot access to it, so a skill cannot be used to escalate a bot's reach and does not need a grant check at approval time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `tools` on a skill as a capability grant. The schema says naming an action gives no bot access to it, so a skill cannot be used to escalate a bot's reach and does not need a grant check at approval time.

### Treating OpenGhost's `by` field as a review gate. An agent-written record is live at once; the user's control is edit and remove, not approve. That is a different trust posture from OpenBot's `reviewState` and the difference matters for the recommendation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating OpenGhost's `by` field as a review gate. An agent-written record is live at once; the user's control is edit and remove, not approve. That is a different trust posture from OpenBot's `reviewState` and the difference matters for the recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating OpenGhost's `by` field as a review gate. An agent-written record is live at once; the user's control is edit and remove, not approve. That is a different trust posture from OpenBot's `reviewState` and the difference matters for the recommendation.

### Treating the terminal as a reduced client. openhuman's TUI drives the same `web_chat` surface as its desktop app, so the surface is shared rather than reimplemented. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating the terminal as a reduced client. openhuman's TUI drives the same `web_chat` surface as its desktop app, so the surface is shared rather than reimplemented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the terminal as a reduced client. openhuman's TUI drives the same `web_chat` surface as its desktop app, so the surface is shared rather than reimplemented.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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
None

### Bounded Context Snapshot

- Source pointers: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md (eight-part frame), OpenBot-main/docs/automatic-learning.md (memory and skills), hermes-muse-main/skills, openhuman-main, OpenGhost-main, .skilled/skills/system-skilled-bots/ (BOT.md, bots CLI, triggers, needs-you, worktrees, status index).
- Reuse candidates: OpenBot memory/skill stores, hermes-muse skill format, openhuman and OpenGhost memory layouts, Skilled skills and the spec-kit.
- Integration points: .skilled/skills/system-skilled-bots/, .skilled/bin/bots.cjs, .skilled/skills/ skill discovery.
- Constraints and risks: reference repos are read-only; every claim needs a [SOURCE: path:line] citation; the packet ends at a recommendation.

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
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-24T19:08:19.000Z
