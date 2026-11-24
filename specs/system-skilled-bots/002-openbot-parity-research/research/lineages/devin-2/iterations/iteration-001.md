# Iteration 1: OpenBot routines versus skilled bots triggers

## Focus

Frontier node F-1-002 (depth 1, scope OpenBot-main/docs/routines.md, hermes-muse-main, buzz-main, .skilled/skills/system-skilled-bots/runtime/lib): How do OpenBot routines (sentence form, time and event starts, act or tell, until an outcome) and the other repos' schedulers map onto skilled bots' cron, queue and git-hook triggers, and what is the smallest change that closes the gap?

## Actions Taken

1. Read OpenBot's routines document and the eight-part overview.
2. Read the routine planner and firing helper in the OpenBot app.
3. Read Hermes Muse's installed-job table, watch prompt, and cron wake path.
4. Read Buzz's workflow engine section of its architecture document.
5. Read the skilled-bots BOT.md trigger schema, cron translator, queue semantics, and bots CLI verb list.

## Findings

1. OpenBot treats a routine as one standing instruction read as a sentence in four parts: what it is, what starts it, whether it acts or only tells, and until what happens. Routines, goals and check-ins are drawn as one list although they remain three server stores. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3-22]
2. OpenBot's "starts" admits a schedule, an event subscription, or a single now-run; "does" is act-within-approvals or tell-only; "until" is "you stop it" or a stated outcome that completes a goal. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:39-44] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:36-49]
3. A single New-routine screen writes three stores through one planner: act-on-schedule with no outcome is a routine, act-on-schedule with an outcome is a goal plus a routine, act-on-event is a goal with a subscription, now-once is a goal run at once, and tell-only is a check-in. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:73-151]
4. OpenBot fires routines inside the server process: one server holds a PostgreSQL advisory lock and looks every 30 seconds, every server claims five turns at a time, and each firing is claimed from the shared work queue under a key naming its due minute so two servers cannot double-fire it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:147-161]
5. OpenBot surrounds the scheduler with product guardrails: a 15-minute floor per routine, a 20-enabled-routine cap per person, one failure message per failure streak and auto-off after ten consecutive failures, and missed windows skipped rather than replayed. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-145]
6. Hermes Muse implements standing work as owned cron jobs with fixed cron keys and default expressions, driven by a script entry that builds a packet and lets the host run the model; a drain job batches work and re-wakes itself, and each watch job embeds its check and stop condition in the prompt. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:135-137] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/hooks.py:163]
7. Buzz implements event-start automation as a YAML-as-code workflow engine with four trigger types (message posted, reaction added, schedule, webhook), seven actions including request-approval and delay, and a cron loop that ticks every 60 seconds with window-based matching. [SOURCE: specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md:625-670]
8. Skilled bots' BOT.md admits exactly four trigger kinds — cron, queue, git-hook and manual — with no sentence form, no act-versus-tell field, no "until" outcome and no event subscription beyond the repository post-commit hook; cron is translated only into launchd calendar dictionaries or refused with a named invariant id. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:5-10] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303]
9. Skilled bots already has the execution substrate a routine needs: a named file queue with rename-based single-claim and a three-attempt retry bound, a git-hook trigger that enqueues one request per matching bot on post-commit, and manual `bots run`/`bots enqueue`/`bots drain` verbs. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:1-20] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:189-201] [SOURCE: .skilled/bin/bots.cjs:23-41]
10. The smallest gap-closing change is a routine layer that compiles to the existing four triggers rather than a new scheduler: an optional `routine` block in BOT.md (what, starts[], does, until), a deterministic sentence-to-block planner for the common schedule and event phrasings, `does: tell` mapped to local-only delivery plus a needs-you note, and `until` evaluated after each run from a precheck or stop expression; fatigue counting and missed-slot skipping attach to the existing run record and queue slot accounting. [INFERENCE: based on findings 4-9; OpenBot's scheduler, stores and UI are not needed, because the queue, git-hook and launchd paths already fire and claim work]

## Ruled Out

- Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team.
- Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope.
- Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks.

## Dead Ends

- Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model.
- Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table.

## Edge Cases

- Ambiguous input: none. F-1-002 names the routine scope explicitly.
- Contradictory evidence: none. OpenBot's prose and planner agree on the routine/goal/check-in mapping.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:3-22
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:36-49
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-161
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:184-192
- specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:39-57
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:73-151
- specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:40-55
- specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/install.py:135-137
- specs/system-skilled-bots/context/hermes-muse-main/hermes_muse/hooks.py:163
- specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md:625-670
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:110-113
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:5-10
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:1-20
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:189-201
- .skilled/bin/bots.cjs:23-41

## Assessment

- New information ratio: 0.9
- Questions addressed: F-1-002
- Questions answered: F-1-002

## Reflection

- What worked and why: Reading the canonical prose document first, then the planner and the runtime trigger schema, produced a direct mapping between OpenBot's four parts and skilled bots' four trigger kinds without guessing at implementation.
- What did not work and why: Searching OpenBot's API tree for routine code produced only OpenAPI descriptions, because the routine logic is app-side and shared-package code rather than an API module.
- What I would do differently: Read the four-part table in `how-openbot-works.md` before the longer `routines.md`, so the semantics anchor the code reading instead of arriving after it.

## Recommended Next Focus

Work frontier node F-1-006: assess the skip list (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), the direct-reuse candidates with their licenses, and the ranked build order. The depth-2 proposals filed under F-1-002 cover the routine-specific follow-ups (until evaluation, sentence planner, missed-window policy, fatigue guardrails).
