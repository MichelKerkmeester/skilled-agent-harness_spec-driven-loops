# OpenBot Parity for Skilled Bots: Research Synthesis

Canonical synthesis of one expansive `/deep:research` fan-out: four lineages (devin-1, devin-2 on Devin `deepseek-v4-1-flash-max`; vibe-1, vibe-2 on Vibe `deepseek-flash`), 13 iterations each, 52 in total. Each lineage's own synthesis is kept at `research/lineages/<label>/research.md`. Every claim cites `[SOURCE: path:line]`; a recommendation derived from several sources is marked `[INFERENCE: ...]`.

## 1. Executive Summary

A small team can get close to OpenBot without OpenBot's server, database, container stack or desktop shell. All four lineages reached the same verdict independently: skilled bots already has the hard half (approved definitions, an atomic file queue, exact cron, worktree isolation, needs-you decisions, run records and a status index), and what it lacks is a human surface plus a few small records. The gaps that matter are an activity view, an actor on every answer, a routine layer with an `until` outcome, shared and per-bot memory, a per-bot app and secret allowlist, a skill-proposal path and a conversation verb. Each closes with a file-backed change to the existing runtime.

The terminal is enough. Every OpenBot app surface (conversations, approvals inbox, activity feed, routine list) maps onto data the runtime already writes, and openhuman proves a conversation-first terminal client can share one surface with a desktop app. A desktop shell earns its place only for an embedded browser with a hand-back step, or a no-terminal install. Neither is needed for a team whose bots work in repositories.

Recommended first build packet: the activity view and the actor field, then the routine layer. Section 11 has the full ranked order.

## 2. Research Question and Scope

For each of OpenBot's eight bot parts: what OpenBot does, what the seven other reference repos do better or more simply, what skilled bots has today, and the smallest change that closes the gap, with size and risk. Also: terminal versus desktop, the small-team model, a skip list and reusable code with its license. Scope is a small team on one machine or a shared host, terminal preferred. The packet ends at a recommendation and builds nothing.

## 3. Method and Evidence Base

The topic seeded six depth-1 frontier questions (F-1-001 to F-1-006), dealt round-robin to the four lineages, which then admitted depth-2 and depth-3 children and broadened across the remaining parts. The stop policy was `max-iterations`, so all 52 iterations ran. Evidence is the eight repos under `specs/system-skilled-bots/context/` (read-only) and the built runtime under `.skilled/skills/system-skilled-bots/`. The four lineages produced about 53,000 words and 668 source citations across all eight repos. Before synthesis, the claims the ranking rests on were checked against their sources. One lineage claim was corrected (Section 5, desktop install).

## 4. The Frame: Eight Parts in Four Pairs

OpenBot says everything in it "is one of eight things a Bot has", in four pairs: Conversations and Routines (works), Memory and Skills (learns), Apps and Computer (uses), Approvals and Activity (answers to you). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:6-18] Each section below follows that order, and Section 11 ranks the changes across them.

## 5. Conversations and the Terminal Verdict

**OpenBot.** A conversation is where a person gives work and the bot reports back, and it can hold several bots. One group conversation is a server-owned shared transcript: `@Name` addresses one bot, otherwise every addressed bot runs through the headless path one after another, and each reply is attributed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/components/channels/group-chat.tsx:42-48]

**Other repos.** openhuman ships the only full terminal client: "a conversation-first terminal frontend ... built with ratatui and crossterm", embedding the core with no HTTP server, covering saved conversations, approvals, tools, child-run inspection and diagnostics. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:3-6] It is GPL-3.0, so it is a design reference only. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] turnstone's Apache-2.0 `TerminalUI` with readline history and completion is the closest liftable terminal loop. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:3] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:176-178]

**Skilled bots today.** Headless by contract. One run is one executor call, and the CLI has no conversation verb. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/bin/bots.cjs:18-50]

**Smallest change.** A `bots chat <id>` verb over an append-only conversation JSONL under the state root. The BOT.md body is sent as the standing role, each human message dispatches one headless run with the transcript, and a `botId` per message plus `@bot` routing gives several bots in one conversation. Size M, risk medium, because it is a new surface. [INFERENCE: devin-1 and devin-2 iterations on the conversation model and the headless run contract]

**Terminal versus desktop.** A terminal can draw all four app surfaces from existing data: the conversation file, `bots inbox`, the status index and the BOT.md triggers. [INFERENCE: all four lineages] OpenBot's desktop is not a better chat window. Its window "holds no credentials", and its native side owns "Engine install, deployment layout, images, Compose, host processes, secrets, Stop and Quit". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:163-166] It installs and supervises a container stack itself, and only an Intel Mac needs Docker Desktop or Podman Desktop first. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:15-17] The shell is one 1000x800 window with tray, deep-link and single-instance plugins and a signed self-updater. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20]

Verdict: terminal first. The CLI verbs cover the surfaces now. A TUI that draws them in panes is polish on top, and a Tauri shell is justified only by an embedded browser with a passkey hand-back, or by a no-terminal install. [INFERENCE: lineages agree on terminal-first. vibe-2 rates the TUI as polish, devin-2 as a size-L item]

## 6. Routines

**OpenBot.** A routine is one sentence in four parts: What, Starts (a time, an event such as a new email or a pull request, or now, and more than one start is allowed), Does (act within approvals, or only tell), Until (you stop it, or an outcome is reached). A routine with an outcome is a goal, and one that only tells is a check-in. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:40-50] `planRoutine` maps form answers to routine, goal or check-in. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:14-40] The guardrails are a 15-minute floor, at most 20 routines switched on per person, a fatigue rule that switches a routine off after ten consecutive failures, and missed windows skipped rather than replayed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-145]

**Other repos.** OpenMausBot's cron-to-sentence and Rakazo's preset-to-cron functions compose into a deterministic planner for common phrases. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/packages/phone-protocol/src/cron-label.ts:9-46] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:85-145] hermes-muse's owned-job table is install-time plumbing, not a routine surface.

**Skilled bots today.** Four triggers (cron, queue, git-hook, manual), exact cron-to-launchd translation or a named refusal, a single-claim queue with a three-attempt bound, and slot accounting that already skips rather than replays. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:3-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12]

**Smallest change.** A `routine` block in BOT.md (`what`, `starts`, `does`, `until`) rendered over the existing triggers: cron is Starts-at-a-time, queue and git-hook are Starts-on-an-event, manual is Starts-now. `does: tell` maps to local-only delivery. `until` is an optional check command run after a successful run with the existing precheck helper: exit 0 records `untilMetAt` and sets the bot's completion switch. The precheck field itself cannot be reused, because its `[SILENT]` marker means skip this run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-578] Add a 15-minute floor refused by name, a ten-failure fatigue switch over the status index's run rows, and a `bots routines` list. Size M, risk medium: one trigger becoming a `starts` list touches the installer, slot accounting and status, which all read `trigger`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586] A v1 with one start per routine is size S.

## 7. Memory

**OpenBot.** "Facts you add are shared with all your Bots. Facts a Bot picks up while working stay with that Bot." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63] It keeps provenance (origin, review state, forming bot) and applies it before a bot sees anything. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:370-383]

**Other repos.** OpenGhost keeps one bounded memory (60 records, 3,600 characters, crowded at 28) that a model rewrites shorter once crowded. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11] turnstone has the cleanest typed model: user, general, feedback and reference types, with upsert on a name-and-scope identity. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:1-40]

**Skilled bots today.** None. BOT.md has no memory field and the runtime has no memory module. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108]

**Smallest change.** Two files under the state root: shared `memory/shared.md` and per-bot `memory/<bot-id>.md`, both prepended to the prompt, with typed entries (actor, source, date) and OpenGhost's bound. A `bots remember` verb appends, and a bot-proposed fact becomes a needs-you item for confirmation. The state layout already has a shared and a per-identity level. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:135] Size S, risk low.

## 8. Skills

**OpenBot.** A skill is "a named way of doing a task, called with `/`", made three ways: written, recorded from one demonstration, or proposed from conversations. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:65-70] A learned skill is reviewed before use, with its SKILL.md, why it was proposed and its evidence. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88]

**Other repos.** OpenGhost's MIT `/name` parser and skill-content wrapper is the liftable pattern. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20] hermes-muse's staged-write pinning refuses a proposal once the entry it read has changed. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:20]

**Skilled bots today.** The format exists: `.skilled/skills/<name>/SKILL.md`, discovered from frontmatter with no registration step. [SOURCE: .skilled/skills/README.txt:33] What is missing is the proposed-from-use origin and its review.

**Smallest change.** A `skills: [name]` list in BOT.md that loads those SKILL.md bodies into the prompt under a byte cap. Add a `bots skill propose <run-id>` verb that writes a draft plus a `proposal.json` (target path, revision read) into a proposals folder, reviewed through a needs-you item. Size M, risk medium from prompt budget. Recording from a demonstration has no counterpart and stays out.

## 9. Apps and the Vault

**OpenBot.** "An app is a service the Bot uses as you ... The Bot never sees your sign-in. A service that takes a key gets it from your vault." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:72-76] Grants are per action per bot, and switching an app to a shared account is itself an approval change. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5203]

**Other repos.** rakazo has the only liftable TypeScript secret layer: a vault policy, a leak matcher and a placeholder guard, all Apache-2.0. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts:1] turnstone keeps per-user OAuth opt-in and dark by default. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/mcp-oauth.md:1]

**Skilled bots today.** One repository-wide UTCP config reached through Code Mode with no per-bot filter, secrets from the environment and dotenv files, and a literal scanner on prompts and answers. There is no vault and no per-bot grant. [SOURCE: .utcp_config.json:1] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-295]

**Smallest change.** Two slices. First, an `apps:` BOT.md key that writes a per-run filtered UTCP config into the run folder, records `HonoredPosture.apps` and adds an `apps-unknown-server` checker invariant (about 150 to 250 lines, risk medium, fails closed). Second, `bots secret set` with a no-echo prompt, backed by the macOS keychain or a 0600 file under the state root, named from the existing `secrets` field, injected only into the child environment and recorded as `HonoredPosture.secretsUsed` (about 200 to 300 lines, risk medium, the one slice that can leak, so it lands after the first). [INFERENCE: vibe-2 iterations 6 to 7, devin-1 iteration 8]

## 10. Computer

**OpenBot.** A browser, a command line and files that persist. The bot signs in with a vault login it never reads, and hands the page to the person for a passkey or a phone code. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84] The computer is its own loopback-only container with a headed browser, two persistent volumes and a per-bot token derived as `HMAC-SHA256(COMPUTER_TOKEN, label)`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-start.ts:1] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1]

**Skilled bots today.** A worktree per run under `isolation: worktree`, with shared paths linked and removal kept safe, plus an owner-only run folder per run. The posture matrix refuses any isolation and sandbox pair the executor kind cannot honor. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:366] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14]

**Smallest change.** Name the worktree or run folder in the prompt as the bot's working place, and show the path and branch in run records and `bots status` (about 20 to 40 lines, risk low). A browser computer stays out. It is OpenBot's largest surface, and a small team uses its own logged-in browser for the steps that need one.

## 11. Approvals and Activity

**OpenBot.** Approvals are decided in a fixed order, and the first answer wins: kinds of action (delete, send, share, post, pay, credentials), then rules, then auto-review, then extra vigilant. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-6] The card offers allow once, allow for this conversation, always allow here and deny, and every answered action lands on the audit trail. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:20-31] Activity is "the check after", grouped as needs_you, working, scheduled, done, stopped, failed and recurring. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:95] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:15-45]

**Skilled bots today.** "Approval" is authoring integrity: an unattended run whose BOT.md bytes differ from the approved ones is refused. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14] The action-level analogue is the needs-you item, which parks a run with exit 5 and holds the bot until `bots answer`, with its state derived and never stored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-49] The status index holds run, delivery and item rows, but nothing shows them as a timeline. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]

**Smallest change.** A `bots activity` read over the status index, grouped with OpenBot's seven ids (lift the MIT `activity-groups.ts` and `shared/activity-rows.ts`). Add `bots inbox --json`, a `grants` field on the needs-you item so an approval names what it approves, and the precedence ladder written as a doc and applied at the needs-you gate. Each is size S and low risk. Per-action policy inside the executor (send, delete, pay) is a later packet, with OpenGhost's MIT hook-compatible rules engine as the liftable layer. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10]

## 12. Small Team

OpenBot's personal edition signs nobody in, and its operations that manage keys and sessions answer 503 `SIGN_IN_UNAVAILABLE`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:57] Its team roles are owner, admin and member, and owner is not assignable. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:23491-23505] Skilled bots keys state by repository identity `owner/name`, with no sign-in. Change authority is repository write access, and a changed BOT.md is refused as `definition-drifted` until re-enabled. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:20] [SOURCE: .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md:52]

The smallest model, agreed across lineages:

- **No sign-in.** The OS user is the identity, and a session would only duplicate it.
- **An actor on every decision.** A `by:` field on needs-you answers, secret records and run records, filled from the OS user or `--as`. A shared identity otherwise erases who answered. A scheduled run records the installing operator pinned at install time. [INFERENCE: vibe-2 iteration 11, devin-1 open question 1]
- **Two roles.** An `owner` (who installed the jobs) and `member`, in one `operators.json` under the state root, checked by `bots answer` before it writes.
- **Shared host.** State folders are created mode 0700, so a shared root is unreadable by a second person. A group and mode 0770 is the whole change. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46]

## 13. Skip List

| Skipped | Why a small team does not need it | Evidence |
| --- | --- | --- |
| Enterprise roles and SSO | The admin tier governs people, sign-in and policy, and there is no sign-in to govern. OpenMausBot's `enterprise/` is not Apache-2.0 | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/common.yaml:893] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:6-9] |
| Multi-tenant | Tenancy lives in the URL space and schema, and one team is one tenant | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:31] |
| Kubernetes and Helm | Release promotion around a chart, a second deployment shape | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5] |
| Managed upgrades | A vendor management agent tied to the chart. A checkout updates with `git pull` | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6] |
| Mobile | A separate React Native app, and the terminal is the client | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108] |
| PostgreSQL, Compose, container computer, browser farm, gVisor | Even the personal edition runs PostgreSQL. The runtime is a Node CLI with a SQLite index and worktrees | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:33] |
| OAuth server, per-person connections, connector catalogue | A key or a shared account covers the common case, and the UTCP config already names the servers | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi.yaml:5626] |

## 14. Reuse and Licensing

Licenses: OpenBot, OpenGhost and hermes-muse are MIT. OpenMausBot (except `enterprise/`), rakazo, turnstone and buzz are Apache-2.0. openhuman is GPL-3.0 and is design-only. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

| Lift | Repo and path | License | Use |
| --- | --- | --- | --- |
| Activity groups and rows | OpenBot `app/src/lib/bot-lifecycle/activity-groups.ts`, `shared/activity-rows.ts` | MIT | `bots activity` |
| Action-kind classifier | OpenBot `shared/tool-name.ts` | MIT | Approval ladder |
| Routine planner and sentence | OpenBot `app/src/lib/routines/plan.ts`, `docs/routines.md` | MIT | Routine block |
| Cron-to-sentence and preset-to-cron | OpenMausBot `packages/phone-protocol/src/cron-label.ts`, rakazo `packages/core/src/routines/schedule.ts` | Apache-2.0 | Routine planner |
| Secret policy, leak matcher, placeholder guard | rakazo `packages/core/src/integrations/vault.ts`, `messages/secret-matcher.ts`, `node/secrets-guard.ts` | Apache-2.0 | `bots secret` |
| Bounded memory with a rewrite | OpenGhost `memory.js` | MIT | Memory files |
| `/name` skill parser, hook rules engine | OpenGhost `skills.js`, `rules.js` | MIT | Skills, later per-action policy |
| Staged-write pinning | hermes-muse `skills/companion/references/memory.md` | MIT | Proposal review |
| Terminal loop | turnstone `turnstone/cli.py` | Apache-2.0 | `bots chat` |
| TUI shape (tabs, approval overlay, six activity statuses) | openhuman `crates/openhuman-tui/` | GPL-3.0 | Design reference, no code |

MIT reuse keeps the copyright and permission notice. Apache-2.0 reuse keeps the license, any NOTICE file and a statement of changes. One `THIRD_PARTY_NOTICES.md` entry per lifted file, with its source path, covers both.

## 15. Ranked Build Order

The lineages ranked differently, because each weighted a different pair first. This order resolves them by two rules they share: build what later items read before what reads it, and land anything that can leak after the slices that cannot. [INFERENCE: across the four lineage build orders]

1. **Activity view and actor field.** `bots activity` grouped with OpenBot's seven ids, `bots inbox --json`, and `by:` on answers and run records. Size S, risk low. It is the check-after, and the prerequisite for a shared host.
2. **Routine layer.** The four-part block over existing triggers, the `until` check, the 15-minute floor, the fatigue switch and `bots routines`. Size M, risk medium (the `starts` migration). A v1 with one start keeps it at S.
3. **Computer exposure.** The worktree or run folder named in the prompt, and its path and branch in status. Size S, risk low.
4. **Memory.** Shared and per-bot files, `bots remember`, needs-you confirmation of bot-proposed facts. Size S, risk low.
5. **Approval grants and ladder.** `grants` on needs-you items and the precedence ladder at that gate. Size S, risk low.
6. **Per-bot apps.** The `apps:` key, a filtered UTCP config per run, and the checker invariant. Size M, risk medium.
7. **Vault.** `bots secret set`, a keychain or 0600 store, child-environment injection, `secretsUsed`. Size M, risk medium.
8. **Skills.** A `skills:` list with a byte cap, and the propose-and-review flow. Size M, risk medium.
9. **Conversations.** `bots chat` with `@bot` routing over a conversation JSONL. Size M, risk medium.
10. **TUI.** One pane each for chat, inbox, activity and routines over the verbs above, written from openhuman's shape. Size L, risk medium.
11. **Desktop shell.** Only if an embedded browser with hand-back or a no-terminal install becomes a must-have. Size XL.

**First build packet:** items 1 and 2. They reuse the most existing substrate, give the team the before-and-after view of what bots do, and settle the `starts` migration decision every later routine change depends on.

**Operator decision (2026-11-24): the terminal screen moves up.** It follows items 1 and 2 instead of coming tenth. It starts with activity, inbox and routine panes over the data those items write, so it needs no backend of its own. A chat pane joins once item 9 lands. A local web page and a desktop app were offered and not chosen.

**Operator decision (2026-11-25): rebuild in Rust, MIT.** The screen is a new ratatui app that follows openhuman-tui's layout, tabs, approval banner, overlay and command palette as closely as possible, but copies none of its code, because openhuman is GPL-3.0-only and Skilled is MIT. It reads and writes through `bots ... --json`. A GPL fork was offered and not chosen.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence |
| --- | --- | --- |
| Desktop-first build | The Tauri side installs and supervises a container stack. Its window holds no credentials and adds no chat capability | `OpenBot-main/docs/desktop-install.md:163-166` |
| A server or database for conversations, memory, skills or activity | Each maps to files the runtime writes, and the queue already gives atomic claims | `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:3-25` |
| OpenBot's server sweep and advisory-lock scheduler | launchd, the drain and the git hook already fire and claim work | `OpenBot-main/docs/routines.md:147-161` |
| Replaying missed windows | Slot accounting already skips and summarizes | `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12` |
| A container or browser per bot | The worktree is cheaper, and the posture matrix refuses unsafe pairs | `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:3-30` |
| A separate action policy engine now | Executor sandboxes and posture enforce today. Per-action hooks are a later packet | `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts:3-14` |
| Three roles, SSO or an identity provider | Owner is not assignable even in OpenBot, and the OS already has identity | `OpenBot-main/api/openapi.yaml:23505` |
| Buzz's workflow engine wholesale | Needs a relay, Postgres and a workflow crate | `buzz-main/ARCHITECTURE.md` |
| Lifting openhuman code | GPL-3.0 would put the combined work under GPL | `openhuman-main/LICENSE:1-2` |
| One big-bang parity packet | The eight parts touch different subsystems and could not be verified together | lineage devin-2 section 16 |

## Divergence Map

- Saturated directions: none. No lineage retried a direction to exhaustion.
- Pivots taken: none. Each lineage worked its dealt seed nodes and their children, then broadened across the remaining parts.
- Pivot failures and audited overrides: none.
- Remaining frontier: none open. The lineage frontiers closed with their nodes answered.
- Disagreements carried into the ranking: build order (Section 15), whether a TUI is capability or polish (Section 5), and whether memory belongs early (vibe-1) or late (vibe-2).

## 16. Open Questions

1. Who is the actor for a scheduled run on a multi-user host? The proposal is the installing operator pinned at install time. It is untested.
2. Should a routine migrate to a `starts` list at once, or keep one primary trigger plus extra queue names?
3. How large may a memory file grow before it is rewritten shorter? OpenGhost's bound is a starting point, not a measurement here.
4. Where does the per-action approval hook sit inside each executor's tool surface?
5. Should the desktop delivery channel acknowledge, or should a new channel carry approvals?
6. Recording a skill from a demonstration has no counterpart and no design yet.

## 17. Convergence Report

- Stop reason: maxIterationsReached, on all four lineages (stop policy `max-iterations`, so convergence was telemetry only).
- Total iterations: 52 (13 per lineage). No lineage ran out of usage, and the Codex fallback was not needed.
- Questions answered: the six seeded depth-1 nodes, and every child the lineages admitted.
- Convergence threshold: 0.05. The last iterations' new-information ratios were 0.55 to 0.7, so the run ended at its budget rather than at saturation.
- Divergence summary: no divergent pivots recorded.

## References

- Lineage syntheses: `research/lineages/devin-1/research.md`, `research/lineages/devin-2/research.md`, `research/lineages/vibe-1/research.md`, `research/lineages/vibe-2/research.md`
- Merged registry and attribution: `research/findings-registry.json`, `research/fanout-attribution.md`
- Resource map: `research/resource-map.md`
- Primary reference: `specs/system-skilled-bots/context/OpenBot-main/docs/` (how-openbot-works, routines, approvals, architecture, desktop-install, desktop-updates, personal-edition, automatic-learning, deployment, kubernetes-upgrades, managed-upgrades)
- Runtime compared: `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/runtime/lib/`
