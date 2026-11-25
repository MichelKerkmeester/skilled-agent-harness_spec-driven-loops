# Iteration 6: Routine guardrails — the enabled cap and failure-streak auto-off

## Focus

Frontier node F-2-010 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts, status-index.ts, switches.ts): Which OpenBot routine guardrails, the 20-enabled cap and failure-streak auto-off, belong in run records and the status index for a small team?

## Actions Taken

1. Re-read OpenBot's cap and fatigue-rule sections.
2. Searched skilled bots for any per-bot streak, cap or fatigue logic.
3. Read the status index's run-summary fields and retention model.
4. Read the needs-you item store and the delivery resolver.
5. Read the stop-switch layer for how an automatic stop would be represented.

## Findings

1. OpenBot caps a person at 20 enabled routines because a conversation is an easy place to accumulate standing work without noticing, and switching one off frees a slot. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:113-116]
2. OpenBot's fatigue rule posts one message on the first failure after a success, switches the routine off after ten consecutive failures with a second final message, and resets the count when a person turns it back on. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-130]
3. Skilled bots has neither a per-bot failure streak nor an enabled-bot cap; the only related backoff is the drain job's setup-fault backoff, which protects the drain rather than a bot's schedule. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:89]
4. The status index already stores one row per run with `botId` and `exitReason`, built only from run records and needs-you items, so a failure streak is a query over existing rows rather than a new store. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:3-14] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-88]
5. The needs-you store already models one durable operator item per run, and the delivery resolver already routes per-channel entries, so a "switched off after N failures" notice can reuse both. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-40] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:130-171]
6. The stop-switch layer currently stores only `setAt` for `disabled` and `paused`, so an automatic fatigue stop would be indistinguishable from a person's disable; it needs a reason or a distinct kind so `bots enable` can tell them apart. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:22-29] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:56-76]
7. The smallest change is a post-run check that counts the last ten terminal run rows for the bot from the status index, and at ten sets a disabled switch with reason `failure-streak` and writes one needs-you item; `bots enable` clears it and resets the count. Size S, risk low because it reads existing rows and writes existing state kinds. [INFERENCE: based on findings 3-6]
8. The 20-enabled cap belongs at `bots enable` and `bots schedule install`: count enabled definitions or installed schedules and refuse the 21st with a named reason. It is optional for a few people but cheap, and it preserves OpenBot's protection against unnoticed accumulation. Size S, risk low. [INFERENCE: based on findings 1 and 3]

## Ruled Out

- Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records.
- Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure.
- Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped.

## Dead Ends

- Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior.
- Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs.

## Edge Cases

- Ambiguous input: none. F-2-010 names the cap, the failure streak and the three runtime surfaces.
- Contradictory evidence: none. OpenBot's prose and skilled bots' run-record vocabulary agree that a failure is a distinct terminal outcome.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:113-130
- .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:89
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:3-14
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-88
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:1-40
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:130-171
- .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:22-29
- .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:56-76
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:130-141

## Assessment

- New information ratio: 0.9
- Questions addressed: F-2-010
- Questions answered: F-2-010

## Reflection

- What worked and why: Reading the status index before the switches showed that the streak can be derived from existing run rows, so the change stays out of the definition and the scheduler.
- What did not work and why: Searching for an existing cap found only evidence-size caps, which look similar by name but bound different things.
- What I would do differently: Read the switch schema first, so the automatic-versus-manual disable distinction is established before the fatigue check is designed.

## Recommended Next Focus

The routine frontier is now fully answered (F-1-002, F-1-006 and F-2-007 through F-2-010). Broaden to the remaining OpenBot parts, starting with approvals and activity: how OpenBot's approval rules and activity record compare with the needs-you items, run records and `bots status`, and what the smallest terminal approvals inbox and activity feed would be.
