# Iteration 7: Routines — sentences, event starts and until outcomes against cron, queue and git hooks

## Focus
Routines: how OpenBot's sentence-shaped routines, event starts and until outcomes map onto skilled bots' cron, queue and git-hook triggers, and what the smallest change is for a routine list. The reducer reported every tracked question resolved, so this iteration takes the lowest-coverage topic in the research ask: the routines part of the eight-part frame.

## Actions Taken
- Read OpenBot's routine contract, including goals, check-ins, the 15-minute floor, the 20-enabled cap, the fatigue rule and missed windows.
- Read the form-to-plan mapping that turns answers into a routine, a goal or a check-in.
- Read skilled bots' cron translator, trigger vocabulary, git-hook opt-in, installer constraint and drain routing.

## Findings
1. An OpenBot routine is one sentence in four parts: What (the instruction), Starts (a time, an event, or now once), Does (act, or only tell), Until (you stop it, or an outcome is reached). Goals and check-ins are the same list: a goal is a routine with an outcome, a check-in is a routine that only tells you. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:12-28]
2. The form-to-plan mapping is the executable version of that sentence. `planRoutine` returns exactly three shapes: a routine (act on a schedule, no outcome), a goal (act with an outcome, an event start, or run once) with an optional schedule and a `runNow` flag, or a check-in (tell only, with an interval). [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:14-40]
3. Event starts are subscriptions, not triggers in the bot file: a goal carries `subscriptions: {source, eventType}[]`, and a goal runs when asked or when an event wakes it. That is why OpenBot can offer "when a pull request opens" and "when a new email arrives" without a per-bot trigger list. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:20-32] [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:73-77]
4. OpenBot bounds standing work on purpose: a routine may fire at most every 15 minutes, a person may have at most 20 routines switched on, and both limits exist because a conversation is an easy place to accumulate work without noticing. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:110-120]
5. The fatigue rule is about worth, not retries: a routine posts exactly one message about a failure (the first after a success), ten consecutive failures switch it off, and turning it back on restarts the count. The doc explicitly separates this from the queue's attempt count. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:122-135]
6. Missed windows are skipped, not replayed: the next run is a stamp, and a deployment that was offline for a month advances the stamp occurrence by occurrence without firing the backlog. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:137-145]
7. Skilled bots' cron path is exact by construction: every cron string either becomes launchd calendar dictionaries that fire exactly as cron would, or is refused with a named invariant id; the translator is the only cron reader in the hub, so the checker, installer and slot lister cannot disagree. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:3-20]
8. Skilled bots' trigger vocabulary is already four kinds — cron, queue, git-hook and manual — with git-hook opt-in per repository (`gitHookTrigger`), and only a cron trigger can be installed as a schedule. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-38] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts:50-51] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586]
9. The queue drain is a strict router, which is what a routine list needs behind it: claim by rename, quarantine a refusal and never retry it, quarantine a request for a paused or held bot rather than replaying it later, retry a failure to a bound of three, and stop the pass on a setup fault with the claimed request put back. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:3-20]
10. Mapping the four parts onto skilled bots: What → the BOT.md body; Starts at a time → a `cron` trigger; Starts when something happens → a `queue` trigger fed by a producer (git-hook already writes one for commits; mail and pull-request events need a small producer that calls `bots enqueue`); Does act → the run; Does only tell → `delivery: local-only`; Until you stop it → the `disabled` switch; Until an outcome → no equivalent today. The smallest change is one optional `until:` block in BOT.md (an outcome sentence plus a check command) and a runner rule that parks or stops the bot when the check passes; the routine list itself is a read over BOT.md files plus the status index. [INFERENCE: based on findings 1-9]

## Ruled Out
- Copying OpenBot's goal store and subscription tables. The same behaviour comes from a BOT.md field plus the existing queue, without a database.
- Copying the 15-minute floor and 20-enabled cap as server rules. They are product guardrails for a chat-driven authoring surface; a small team authors bots in files and can see the whole list.
- Replaying missed windows. OpenBot's stamp model is better than a backlog, and skilled bots' slot accounting already summarizes missed slots instead of running them.

## Dead Ends
- Looking for a routine scheduler in skilled bots beyond launchd: cron translation and launchd installation are the whole scheduling layer.
- Treating the queue as a general event bus. It carries run requests with an idempotency key, not arbitrary events.

## Edge Cases
- Ambiguous input: "event starts (new mail, a pull request)" could mean watching a mailbox or receiving a webhook. The evidence supports a producer that enqueues a request; the source of the event is outside the bot runtime either way.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts
- .skilled/skills/system-skilled-bots/runtime/lib/installer.ts
- .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts

## Assessment
- New information ratio: 0.95
- Questions addressed: routines (the third of the nine additional questions)
- Questions answered: routines mapping and smallest change

## Reflection
- What worked and why: reading `planRoutine` next to the routine doc turned a prose contract into three data shapes, which made the mapping to BOT.md triggers mechanical. The drain's routing rules then showed which "until" behaviours already exist as quarantine and retry.
- What did not work and why: the routines doc's later sections are about server operations (worker containers, pods), which do not transfer to a launchd-based runtime; they were skipped rather than mined.
- What I would do differently: read `slot-accounting.ts` in the same pass, since its missed-slot summary is the direct counterpart of OpenBot's skipped windows.

## Recommended Next Focus
Apps and computer: OpenBot's connectors and vault against MCP and Code Mode, and a bot's computer against skilled bots' worktree isolation.
