# OpenBot Parity for Skilled Bots — Terminal-First, Small-Team Research

Synthesis of 13 deep-research iterations in the `devin-2` fan-out lineage. Every claim carries a `[SOURCE: path:line]` anchor; `[INFERENCE: ...]` marks a derived recommendation.

## 1. Executive Summary

A small team can get close to OpenBot with a terminal-first surface and six small changes, without OpenBot's server, scheduler, Kubernetes charts, managed-upgrade agent or mobile app. The cheapest wins are the routine layer and an approvals/activity surface, because skilled bots already has the triggers, queue, run records, needs-you items and status index they need. The largest new surface is a conversation loop, and it should come after routines and approvals. Enterprise, multi-tenant, Kubernetes, managed upgrades and mobile belong on a skip list. The directly reusable code is MIT or Apache-2.0 in seven of the eight reference repos; openhuman is GPL-3.0 and is design-only.

## 2. Scope and Method

The research question is OpenBot parity for skilled bots, scoped to a small team, preferring a terminal or CLI experience over a desktop app. The method was 13 iterations: two depth-1 frontier nodes (routines; skip list, reuse and build order), four depth-2 routine nodes (until evaluation, sentence planner, missed windows and floor, guardrails), then seven broadening iterations across the remaining parts, terminal versus desktop, the small-team model and a final gap matrix. Evidence is the eight reference repos under `specs/system-skilled-bots/context/` and the built runtime under `.skilled/skills/system-skilled-bots/`.

## 3. The Eight-Part Matrix

| Part | OpenBot | Other repos | Skilled bots today | Smallest change | Size / risk |
|---|---|---|---|---|---|
| Conversations | Multi-bot conversation over a channel and thread, standing role sent every run | Turnstone terminal REPL; openhuman-tui (GPL, design) | Headless only; no chat verb | `bots chat` over a conversation JSONL, botId per message | M / medium |
| Routines | One sentence in four parts; server sweep; floor, cap, fatigue, skip | Hermes owned jobs; Buzz workflow triggers; OpenMausBot schedules; Rakazo preset bridge | Four triggers; launchd-exact cron; queue; git-hook; skip accounting | Routine block compiling to existing triggers, planner, until, floor, fatigue | M / medium |
| Memory | Person-added facts shared; bot-learned facts per bot | Hermes native memory; Rakazo memory adapters | No memory field; prompt is body + spec folder | Shared and per-bot files under the state root | S / low |
| Skills | Write, record or propose; review before use | OpenGhost `/name` skills; Hermes skills | Global SKILL.md directories; spec-kit continuity | `skills` list plus propose-and-approve draft | M / medium |
| Apps | Connect once; broker reaches app as the person | Rakazo provider-neutral adapters; Composio broker | MCP and Code Mode; no registry | `apps` registry plus BOT.md `apps` list as MCP servers | M / medium |
| Computer | Browser, command line, files, vault-filled login, handover | Turnstone tools; OpenGhost browser | Worktree isolation with safe cleanup | Expose worktree path and branch; browser later | S / low (browser XL) |
| Approvals | Action kind, rule, auto-review, vigilance; four answers; audit | OpenGhost hook rules; Turnstone judge | Authoring approval and needs-you items | `bots inbox --json` over the answer path; per-action hooks later | S / low (hooks L) |
| Activity | Server-side audit trail; conversation view is a window | — | Run records and status index | `bots activity` over existing rows | S / low |

Sources: [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:9-18] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-96] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:16-161] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-31] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:7] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:66] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:105] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:172] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12]

## 4. Conversations

OpenBot's conversation is where work is given and reported, can hold several Bots, and each Bot takes its part; a conversation creates a channel and a thread, and the Bot's standing role is sent with every run. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:75-80] A group conversation gives each Bot its own thread but shows people one shared transcript with attributed replies, and a Bot naming a peer `@Name` hands off under the same grants, caps and audit rows. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:189]

Skilled bots is headless by contract: one run is one headless executor invocation, and the prompt says nobody is at a prompt. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:322] The CLI has no chat verb. [SOURCE: .skilled/bin/bots.cjs:20-50]

The smallest terminal conversation is a `bots chat` verb that keeps an append-only conversation JSONL under the user state root, sends the BOT.md body as the standing role, and dispatches one headless run per user message with the transcript. Several Bots need only a `botId` per message plus `@bot` routing. Size M, risk medium because it is a new surface. Turnstone's Apache-2.0 `TerminalUI` is the closest liftable REPL; openhuman-tui is a richer GPL-3.0 design reference. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10] [INFERENCE: based on the conversation model and the headless run contract]

## 5. Routines

OpenBot reads a routine as one sentence in four parts: what it is, what starts it, whether it acts or only tells, and until what happens. Routines, goals and check-ins render as one list over three stores, and one planner maps form answers to the right store. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3-22] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:36-49] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:73-151]

OpenBot fires routines inside the server process: one server holds a PostgreSQL advisory lock and looks every 30 seconds, every server claims five turns at a time, and each firing is claimed from the work queue under a due-minute key. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:147-161] Its guardrails are a 15-minute floor, a 20-enabled cap per person, one failure message per streak with auto-off after ten consecutive failures, and missed windows skipped rather than replayed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-145]

Skilled bots already has the execution substrate: four trigger kinds (cron, queue, git-hook, manual) [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32]; exact cron-to-launchd translation or a named refusal [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303]; a single-claim file queue with a three-attempt retry bound [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43]; a post-commit hook [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:189-201]; and skip-not-replay slot accounting with lateness classes and skipped-slot evidence [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12].

The smallest change is a routine layer that compiles to those triggers:

- A `routine` block in BOT.md: `what`, `starts[]`, `does` (act or tell), `until`.
- A deterministic `planRoutine(text)` for the common schedule phrases, built by composing OpenMausBot's cron-to-preset parser with Rakazo's preset-to-cron function; raw cron passes through and an unparsed result falls back to the manual block. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/packages/phone-protocol/src/cron-label.ts:9-46] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:85-145]
- `does: tell` maps to local-only delivery plus a needs-you note; `act` keeps the existing delivery targets.
- `until` is an optional command evaluated after a successful run with the existing `runPrecheck` helper; exit 0 sets a completion switch and records `untilMetAt`, non-zero means not met. The `precheck` field itself cannot be reused because its `[SILENT]` marker means skip this run. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-578] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:931-935]
- A 15-minute floor measured with `schedulePeriodSeconds` and refused with a named reason; slot accounting stays unchanged. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:82-120]
- A fatigue counter over the status index's run rows, setting a disabled switch with reason `failure-streak` and one needs-you item at ten consecutive failures; `bots enable` resets it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-88] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:56-76]

Size M, risk medium, because the schema moves from one `trigger` object to a `starts` list and the installer, slot accounting and status all read `trigger`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:208-210] A smaller v1 with one trigger per routine is possible at size S but leaves OpenBot's multiple-starts gap open.

## 6. Memory and Skills

OpenBot splits memory by origin: facts a person adds are shared with all their Bots, while facts a Bot picks up while working stay with that Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63] It makes a skill three ways: the person writes it, the person shows the Bot the task once and it records the steps, or OpenBot proposes one from conversations. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:65-70] A learned skill is reviewed before use, with its SKILL.md, why it was proposed and the evidence behind it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88] OpenBot's full learning pipeline (Intelligence containers, per-person spaces, sharing controls) is heavier than a small team needs. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:10-14] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:31-36]

Skilled bots has no memory or skill field; its keys are id, trigger, runtime, budget, enabled, delivery, isolation, sandbox, secrets, precheck and spec_folder. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108] Skills are global SKILL.md directories, and the spec-kit's continuity writer routes session context into a packet's documents rather than a per-bot memory. [SOURCE: .skilled/skills/system-spec-kit/references/memory/memory-system.md:16-32] The bot prompt carries only the BOT.md body, the spec folder and the decision rule. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:311-338]

The smallest memory change is two markdown files under the user state root, one shared and one per bot, prepended to the prompt in that order, with a `bots remember` verb and a needs-you item when a Bot proposes a fact. Size S, risk low. The smallest skill change is a `skills: [name]` list in BOT.md that resolves `.skilled/skills/<name>/SKILL.md` bodies into the prompt, plus a `bots skill propose` draft with needs-you approval. Size M, risk medium from prompt budget. OpenGhost's MIT `/name` parser and `<skill_content>` wrapper are the liftable pattern. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20] [INFERENCE: based on the memory split, the skill lifecycle and the prompt builder]

## 7. Apps and Computer

OpenBot connects an app once on the Connections page; the Bot never sees the sign-in, and a service that takes a key gets it from the vault. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:72-76] Its computer is a browser, a command line and files that persist between tasks; it signs in with a vault login that fills the page without the Bot reading it, hands the page over when a person is needed, and can include folders on the person's machine. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84] The vault holds logins and keys, the Bot never sees the contents, and the secret stays out of the conversation and memory. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-112] Connectors are per-person and brokered: Composio holds the accounts, an admin enables an app, each person connects their own, and a Bot reaches the app as the asker. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md:1-20]

Skilled bots has posture fields for isolation, sandbox and secrets but no connector registry and no vault; its secret check only prevents a known secret literal from entering the prompt. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:55-57] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:249-295] Worktree isolation already gives a Bot its own tree and branch outside the checkout, linked to shared paths and removed only when clean. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-16]

The smallest apps change is an `apps` registry in `bots/config.json` mapping a name to an MCP command or URL, plus an `apps: [name]` list in BOT.md passed to the executor as MCP servers; Code Mode already orchestrates MCP tools. Size M, risk medium because a connector widens a Bot's reach. The smallest vault change is a 0600 file under the user state root holding name-to-secret entries, referenced by name from the existing `secrets` field; the runner injects only the named values and keeps the literal check. Size S, risk low. The smallest computer change is to expose the existing worktree path and branch in run records and `bots status`; a browser view is a separate XL item. [INFERENCE: based on the posture fields, the worktree module and the MCP surface]

## 8. Approvals and Activity

OpenBot decides approval in a fixed order: action kinds first (delete, send, share, post, pay, credentials), then matching rules, then auto-review, then Extra vigilant, with the strictest matching rule winning. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-18] Its card offers allow once, allow for this conversation, always allow here and deny; every answered action still lands on the audit trail. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:20-31] Actions are recognized by name, tool name or button label, and an app-declared destructive hint counts as a delete. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:60-84]

OpenBot's audit trail records what started a run and on whose authority, and the conversation's activity view is only a window over it; the record is server-side and survives restarts. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:66] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:105] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:172]

Skilled bots' existing "approval" is authoring integrity: it hashes BOT.md and `bots/config.json` and refuses an unattended run whose bytes differ from what an operator approved. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14] Needs-you items are the action-approval analogue for parked runs: a run that needs a human ends, leaves one durable item, `bots inbox` lists items, and `bots answer` records the answer and enqueues the resume. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:1-14] [SOURCE: .skilled/bin/bots.cjs:31] [SOURCE: .skilled/bin/bots.cjs:46]

The status index already stores one row per run, delivery and item, and `bots status` shows each bot's last run and delivery plus open items, but there is no chronological activity view. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:126-133] [SOURCE: .skilled/bin/bots.cjs:48] The smallest approvals inbox is `bots inbox --json` over the existing answer path; the smallest activity feed is `bots activity` over the status index's run rows with bot and outcome filters. Neither needs a new store. Per-action policy (send, delete, pay) needs a hook inside the executor and is a later packet; OpenGhost's MIT hook-compatible rules engine is the liftable layer. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10] [INFERENCE: based on the needs-you and status-index surfaces]

## 9. Terminal Versus Desktop

A TUI can render all four app surfaces from data that already exists: a conversation pane over the new conversation file, an approvals pane over `bots inbox`, an activity pane over the status index, and a routine list over BOT.md triggers and schedule state. [INFERENCE: based on iterations 8-10]

OpenBot Desktop is a Tauri shell that installs and runs OpenBot for one person on one computer with no terminal, developer tools or container engine of the person's own; it is standalone, has no organization sign-in and installs the default Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:1-10] It can also connect to an OpenBot running elsewhere, signing in with OAuth 2.1 plus PKCE and keeping the refresh token in the OS credential store. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:10-25] It updates itself with a signed updater, a tray item, a six-hour feed, background image downloads and a database dump/restore on upgrade. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20] The shell is one resizable 1000x800 window with tray-icon, image-png, deep-link, shell and single-instance plugins, bundled as dmg, nsis, appimage, deb and rpm. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/Cargo.toml:20-40]

A desktop shell adds an embedded browser for the Bot's computer and handover, tray and OS notifications, a global hotkey and deep links, the OS credential store, native file dialogs, and a signed self-updater that installs and upgrades the stack. A terminal can approximate notifications and render text, but not the embedded browser or the no-terminal install. The recommendation is a terminal TUI first (size L) and a desktop shell only when the browser view or no-terminal install becomes a must-have (size XL). [INFERENCE: based on the desktop documents and the four-surface mapping]

## 10. Small Team

OpenBot's personal edition runs for one person on their own machine: nobody signs in, there is one computer, and it starts with a single Personal Assistant Bot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-10] The team edition adds one "Everyone" admin scope above "Every Bot" and "This Bot", and people, sign-in and policy are how an admin sets the eight primitives, not a ninth. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131] OpenBot requires an identity provider, and its `OPENBOT_SINGLE_USER=true` escape hatch refuses a public address because every visitor would be the administrator. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:143-154] A routine runs as its creator with that person's grants. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:184-192]

Skilled bots keys state by repository identity and keeps the state a run must not write under a user-level root outside every checkout with owner-only permissions. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-34] It has no sign-in or roles: bots are files changed through git, so change authority is repository write access, and approval authority is whoever can read the state root that holds the needs-you items. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10]

The smallest one-machine model is no sign-in: the OS user plus repository write access is the role model, a team-wide shared memory file sits beside a per-bot file, and a per-person file lives in that user's state root. Size S, risk low. The smallest shared-host model is OS users with 0700 state roots and a 0600 vault, plus an `owner` field in BOT.md naming who may change or approve that Bot; no password store, roles or SSO. A shared bearer token is only needed if a socket or web surface is added. [INFERENCE: based on the personal edition, the repository identity and the state root]

## 11. Skip List

| Part | Why a small team does not need it | Source |
|---|---|---|
| Enterprise / team admin | The "Everyone" scope is a many-person policy layer; OpenMausBot's `enterprise/` is separately licensed | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md:1-12] |
| Multi-tenant isolation | The supervisor makes each person a tenant boundary; without it a shared computer is fine for one team trusting its bots and not fine between tenants | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:66-71] |
| Kubernetes | A second deployment shape with Helm charts, release-manifest promotion and GitOps output | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5] |
| Managed upgrades | Needs a management agent, Flux, a maintenance window and verified backups for every migrating upgrade | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6] |
| Mobile | A separate Expo/React Native app with a deliberately limited launch scope and no Computer screen | [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108] |

## 12. Reuse

| Repo | Path | License | What to lift |
|---|---|---|---|
| OpenBot | `app/src/lib/routines/plan.ts`, `shared/routine-firing.ts` | MIT | Four-part plan mapping and firing framing |
| OpenMausBot | `server/routine-schedules.ts`, `server/routine-cron-text.ts`, `server/routine-wake-retry.ts` | Apache-2.0 | Schedule types, next occurrence, cron-to-sentence, wake retry |
| Rakazo | `packages/core/src/routines/schedule.ts` | Apache-2.0 | Preset-to-cron and cron-to-preset bridge |
| OpenGhost | `rules.js`, `skills.js` | MIT | Hook-compatible rules engine; `/name` skill parser |
| Hermes Muse | `hermes_muse/install.py` | MIT | Owned-job table and watch prompt |
| Turnstone | `turnstone/cli.py`, `turnstone/core/output_guard_judge.py` | Apache-2.0 | Terminal REPL and output judge |
| Buzz | `crates/buzz-workflow` | Apache-2.0 | Workflow trigger vocabulary (design reference; Rust) |
| openhuman | `crates/openhuman-tui` | GPL-3.0 | Design reference only; copyleft bars direct reuse |

Sources: [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2]

## 13. Ranked Build Order

1. **Routine layer** — routine block, deterministic planner, routine list, until check, 15-minute floor, fatigue counter. Size M, risk medium (starts-array migration). Reuses every existing trigger.
2. **Approvals inbox and activity feed** — `bots inbox --json`, `bots activity` over the status index. Size S, risk low. Gives a person a way to see and stop what a Bot did before connectors widen its reach.
3. **Terminal conversation** — `bots chat` over a conversation JSONL, botId per message, `@bot` routing. Size M, risk medium. Largest new surface, so third.
4. **Shared and per-bot memory** — two files under the state root, prompt injection, `bots remember`. Size S, risk low.
5. **Skills list and propose flow** — `skills` list in BOT.md, SKILL.md injection, `bots skill propose`. Size M, risk medium from prompt budget.
6. **Apps registry and vault** — `apps` in `bots/config.json`, MCP servers, 0600 vault file. Size M, risk medium.
7. **Computer exposure** — worktree path and branch in run records and status. Size S, risk low; browser view deferred (XL).
8. **Small-team owner field** — `owner` in BOT.md, OS users and permissions. Size S, risk low; only needed on a shared host.

[INFERENCE: based on the eight-part matrix and the reused substrate]

## 14. First Build Packet

The first build packet should implement the routine block and its planner, the routine list in `bots status`, the after-run until check, the 15-minute floor and the fatigue counter, with tests for the plan-to-trigger mapping and the until transition. That is one coherent packet of size M and medium risk, and every later part builds on the same trigger and run-record substrate. [INFERENCE: based on the routine matrix and the existing runtime surfaces]

The two decisions the packet must resolve are the `starts` array migration (installer, slot accounting and status currently read one `trigger`) and whether a tell-only routine records a needs-you note or a local-only delivery entry. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:208-210]

## 15. Open Questions

- **Starts-array migration:** the schema change is small, but three readers assume one trigger. The packet should decide whether to migrate them together or keep a single primary trigger plus additional queue names.
- **Per-action approval hook:** OpenBot's policy engine runs inside the tool gateway; skilled bots' executor exposes a different tool surface. The hook point and the rule format are not yet chosen.
- **Skill prompt budget:** injecting full SKILL.md bodies can crowd out the bot body. The packet should cap total skill bytes and decide precedence.
- **Browser view:** a terminal cannot embed a live browser. If the Bot's computer must show a page, a desktop shell or an external browser bridge becomes necessary.
- **Queue staleness:** event starts need a `maxLatenessSeconds` if they are to follow OpenBot's skip policy; the drain currently treats every request as runnable.

## 16. Eliminated Alternatives

- Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server and does not need one; launchd, the queue drain and the git hook already fire and claim work.
- Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, far beyond a small team.
- Treating Hermes Muse's fixed six-job table as the target: it is install-time plumbing, not a user-authored routine surface.
- Lifting openhuman code: GPL-3.0 would impose copyleft on the combined work.
- Copying OpenMausBot's `enterprise/`: outside the Apache-2.0 grant and commercially licensed.
- Building a desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding.
- A single "big bang" parity packet: the eight parts touch different subsystems and one packet would be too large to verify.

## 17. Divergence Map

No divergent pivots, saturated directions or Council overrides were recorded in this lineage. The routine frontier was answered in six iterations (two depth-1 nodes and four depth-2 nodes); the remaining seven iterations broadened across the other parts, terminal versus desktop, the small-team model and the final matrix. Frontier nodes F-1-002, F-1-006, F-2-007, F-2-008, F-2-009 and F-2-010 are all answered.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 13
- Questions answered: 6 / 6
- Remaining questions: 0 tracked frontier questions; 5 open build decisions listed in §15
- Last 3 iteration summaries: run 11 small-team model (0.9); run 12 terminal versus desktop (0.9); run 13 final gap matrix (0.7)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## References

- `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/routines.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md`
- `specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md`
- `specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts`
- `specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts`
- `specs/system-skilled-bots/context/OpenGhost-main/rules.js`
- `specs/system-skilled-bots/context/OpenGhost-main/skills.js`
- `specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py`
- `specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md`
- `specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py`
- `specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md`
- `.skilled/skills/system-skilled-bots/runtime/lib/` (definition, cron-translator, request-queue, slot-accounting, runner, switches, run-record, status-index, needs-you, answer, approval, isolation, identity, state-root, dispatch)
- `specs/system-skilled-bots/002-openbot-parity-research/research/lineages/devin-2/resource-map.md`
