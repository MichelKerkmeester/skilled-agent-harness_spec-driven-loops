# Iteration 13: The gap matrix, the skip list and the ranked build order

## Focus

The final gap matrix: consolidate the eight parts, the terminal-versus-desktop answer, the skip list and the reuse list into a ranked build order a first build packet can start from, and name the smallest change, size and risk for each part.

## Actions Taken

1. Re-read the architecture document's audit and activity sections.
2. Consolidated the evidence from iterations 1-12 into one part-by-part matrix.
3. Ranked the changes by what reuses existing substrate and what opens the largest new surface.
4. Re-checked the reuse candidates against their licenses.
5. Defined the first build packet from the top-ranked change.

## Findings

1. Conversations: OpenBot gives a multi-bot conversation over a channel and thread with the Bot's standing role sent every run [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:75-80]; Turnstone's Apache-2.0 terminal REPL and openhuman's GPL-3.0 TUI are the terminal references [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40] [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10]; skilled bots runs headless with no chat verb [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6] [SOURCE: .skilled/bin/bots.cjs:20-50]; the smallest change is a `bots chat` verb over a conversation JSONL with a botId per message (size M, risk medium).
2. Routines: OpenBot reads one sentence in four parts and fires it from the server with a floor, a cap, fatigue and skip-not-replay [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:16-22] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-161]; Hermes Muse uses owned cron jobs and watch prompts, Buzz a YAML workflow engine with message, reaction, schedule and webhook triggers, OpenMausBot explicit schedule and catch-up types, and Rakazo a preset-to-cron bridge [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55] [SOURCE: specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md:625-670] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts:1-30] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:85-145]; skilled bots already has four triggers, launchd-exact cron, a single-claim queue, a git hook and skip-not-replay slot accounting [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12]; the smallest change is a routine block that compiles to those triggers, a deterministic planner, an after-run until check, a 15-minute floor and a fatigue counter (size M, risk medium from the starts array).
3. Memory: OpenBot shares person-added facts across all Bots and keeps bot-learned facts with the bot [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-63]; skilled bots has no memory field and its prompt carries only the BOT.md body, the spec folder and the decision rule [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:94-108] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:311-338]; the smallest change is a shared file plus a per-bot file under the user state root, prepended to the prompt, with a remember verb (size S, risk low).
4. Skills: OpenBot writes, records or proposes a skill and reviews a learned one before use [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:65-70] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88]; Skilled keeps global SKILL.md directories and the spec-kit continuity writer [SOURCE: .skilled/skills/system-spec-kit/references/memory/memory-system.md:16-32]; OpenGhost's MIT `/name` parser and `<skill_content>` wrapper are the liftable pattern [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20]; the smallest change is a `skills` list in BOT.md that injects named SKILL.md bodies plus a propose-and-approve draft (size M, risk medium from prompt budget).
5. Apps: OpenBot connects an app once and reaches it as the person through a broker [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:72-76] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md:1-20]; Rakazo's Apache-2.0 adapter tree is the boundary reference [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/adapters/src/index.ts:1]; skilled bots has MCP and Code Mode but no connector registry [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:55-57]; the smallest change is an `apps` registry in `bots/config.json` plus an `apps` list in BOT.md passed as MCP servers (size M, risk medium from widened reach).
6. Computer: OpenBot gives a Bot a browser, a command line, files and a vault-filled login, with handover when a page needs the person [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:78-84] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-112]; skilled bots' worktree already gives a tree, branch, files and commands with safe cleanup [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-16]; the smallest change is to expose the worktree path and branch in run records and status (size S, risk low), with a browser view deferred (size XL).
7. Approvals: OpenBot decides by action kind, rule, auto-review and vigilance, offers four answers, recognizes actions by name and destructive hints, and audits every decision [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-31] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:60-84] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:7]; OpenGhost's MIT hook-compatible rules engine and Turnstone's Apache-2.0 judge are the liftable policy layers [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10] [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/core/output_guard_judge.py:1-30]; skilled bots has authoring approval and needs-you items, not per-action policy [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10]; the smallest change is `bots inbox --json` over the existing answer path (size S), with per-action hooks later (size L).
8. Activity: OpenBot keeps a server-side audit trail that survives restarts and records what started a run, while the conversation's activity view is only a window over it [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:66] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:105] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:172]; skilled bots' run records and status index already store per-run rows with exit reason, delivery, skipped slots and item ids [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-88]; the smallest change is a `bots activity` verb over those rows (size S, risk low).
9. Small team: OpenBot's personal edition needs no sign-in, its team edition adds an Everyone admin scope, and its public deployment refuses an open single-user mode [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-10] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:143-154]; skilled bots keys state by repository and OS user under a 0700 root [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-34]; the smallest change is no sign-in plus an `owner` field in BOT.md for a shared host (size S, risk low).
10. Terminal versus desktop: a TUI can render conversations, the approvals inbox, the activity feed and the routine list from existing stores, while a Tauri shell adds an embedded browser, tray and OS notifications, the OS credential store, native dialogs and a signed self-updater [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:1-25] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30]; the recommendation is a terminal TUI first (size L) and a desktop shell only when the browser view or no-terminal install becomes a must-have (size XL).
11. Skip list: enterprise/team admin, multi-tenant isolation, Kubernetes, managed upgrades and mobile are all out of scope for a small team — the team admin is a many-person policy layer [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:124-131], the supervisor exists to make each person a tenant boundary [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:66-71], Kubernetes is a second deployment shape with Helm charts and promotion tooling [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5], managed upgrades need a management agent, Flux and backup configuration [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6], and mobile is a separate Expo app with a limited launch scope [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108].
12. Ranked build order: (1) routine block, planner, until, floor and fatigue; (2) approvals inbox and activity feed; (3) terminal conversation; (4) shared and per-bot memory; (5) skills list and propose flow; (6) apps registry and vault; (7) computer exposure over worktrees; (8) small-team owner field. The order puts the changes that reuse existing substrate first and the largest new surface (conversation) third, so the first packet ships a visible routine list before it ships a chat loop. [INFERENCE: based on findings 1-11]
13. Reuse list: OpenBot's `plan.ts` and `routine-firing.ts` (MIT), OpenMausBot's `routine-schedules.ts`, `routine-cron-text.ts` and `routine-wake-retry.ts` (Apache-2.0), Rakazo's `schedule.ts` (Apache-2.0), OpenGhost's `rules.js` and `skills.js` (MIT), Hermes Muse's `install.py` (MIT), Turnstone's `cli.py` and `output_guard_judge.py` (Apache-2.0); openhuman is GPL-3.0 and is design-only [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:2-3] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2].
14. The first build packet should implement the routine block and its planner, the routine list in `bots status`, the after-run until check, the 15-minute floor and the fatigue counter, with tests for the plan-to-trigger mapping and the until transition; that is one coherent packet of size M and medium risk, and every later part builds on the same trigger and run-record substrate. [INFERENCE: based on findings 2, 7, 8 and 12]

## Ruled Out

- Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not.
- Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did.
- Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding.

## Dead Ends

- A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify.
- Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install.

## Edge Cases

- Ambiguous input: none. The final matrix is the synthesis the topic asks for.
- Contradictory evidence: none across iterations; the one correction was the memory reference path, fixed in iteration 9 before this matrix.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:7
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:66
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:105
- specs/system-skilled-bots/context/OpenBot-main/docs/architecture.md:172
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:28-34
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:59-84
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:105-131
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:16-22
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-161
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-31
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:60-84
- specs/system-skilled-bots/context/OpenBot-main/docs/automatic-learning.md:78-88
- specs/system-skilled-bots/context/OpenBot-main/docs/personal-edition.md:1-10
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:66-71
- specs/system-skilled-bots/context/OpenBot-main/docs/deployment.md:143-154
- specs/system-skilled-bots/context/OpenBot-main/docs/kubernetes-upgrades.md:1-5
- specs/system-skilled-bots/context/OpenBot-main/docs/managed-upgrades.md:3-6
- specs/system-skilled-bots/context/OpenBot-main/docs/app-guidelines.md:74-108
- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-install.md:1-25
- specs/system-skilled-bots/context/OpenBot-main/docs/desktop-updates.md:1-20
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/tauri.conf.json:1-30
- specs/system-skilled-bots/context/OpenBot-main/docs/plugins/composio.md:1-20
- specs/system-skilled-bots/context/OpenBot-main/docs/coworkers.md:75-80
- specs/system-skilled-bots/context/OpenBot-main/shared/approval-outcomes.ts:1-30
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-schedules.ts:1-30
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts:1-28
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:85-145
- specs/system-skilled-bots/context/OpenGhost-main/rules.js:1-10
- specs/system-skilled-bots/context/OpenGhost-main/skills.js:1-20
- specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55
- specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md:625-670
- specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:1-40
- specs/system-skilled-bots/context/turnstone-main/turnstone/core/output_guard_judge.py:1-30
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/README.md:1-10
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-108
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:5-6
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:311-338
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-16
- .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:1-14
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-10
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:1-88
- .skilled/skills/system-skilled-bots/runtime/lib/identity.ts:1-20
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-34
- .skilled/bin/bots.cjs:20-50
- .skilled/skills/system-spec-kit/references/memory/memory-system.md:16-32
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1-2
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:2-3
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1-2
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1-2
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1-2
- specs/system-skilled-bots/context/turnstone-main/LICENSE:2-3
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2

## Assessment

- New information ratio: 0.7
- Questions addressed: all eight parts, terminal versus desktop, small team, skip list, reuse and build order
- Questions answered: none tracked as a frontier question; this iteration consolidates the broadened research

## Reflection

- What worked and why: Consolidating by part, then ranking by reused substrate, produced a build order that starts with a visible routine list rather than the largest new surface.
- What did not work and why: A single parity packet was rejected because the eight parts touch different subsystems and one packet would be too large to verify.
- What I would do differently: Keep the matrix in a table-shaped draft during the run so the final iteration is a fill-in rather than a reconstruction.

## Recommended Next Focus

Synthesis: compile `research.md` from iterations 1-13, preserve the per-part matrix and the ranked build order, and note the open questions that a first build packet should resolve (the starts-array migration and the per-action approval hook).
