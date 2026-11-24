# Iteration 5: Missed windows and a 15-minute floor

## Focus

Frontier node F-2-009 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts, request-queue.ts, slot-accounting.ts): How should missed routine windows and a 15-minute floor map onto launchd calendar entries and the queue drain's retry bound?

## Actions Taken

1. Read the slot-accounting module and its lateness, grace and skipped-slot rules.
2. Read the run-record fields that carry skipped slots and held slots.
3. Read OpenMausBot's catch-up planner and its 12-hour missed-occurrence bound.
4. Re-read the cron translator's every-minute path.
5. Read the queue retry bound and the drain's quarantine behavior.

## Findings

1. Skilled bots already skips missed launchd slots instead of replaying them: the slot-accounting module states that launchd merges every slot a sleeping host missed into one fire, and that each fire names the slot it stood for, how late it ran and which slots it stood in for before dispatch. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12]
2. Slot accounting classifies lateness as on-time, late or catch-up, with a grace window of half the schedule period clamped between 120 seconds and 7,200 seconds, and summarizes skipped slots under a retention cap. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:34-47] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:82-120]
3. The run record already carries the skipped-slot summary (count, first and last instant, and a capped slot list) and a held-slot reason, so the missed-window evidence is durable without a new store. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82-110] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:38-40]
4. OpenMausBot's catch-up planner is a stricter explicit rule: the newest occurrence runs late if it is within 12 hours, older occurrences close as missed on one counted row, and late starts found in one scheduler pass are staggered so a long downtime does not start every routine at once. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts:1-20] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts:23-28]
5. Skilled bots has no 15-minute floor: the cron translator accepts `* * * * *` and turns an all-wildcard minute and hour into `StartInterval 60`, so a bot can fire every minute if its author writes that expression. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:56-57] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:276-280]
6. Queue triggers have no missed-window concept: a request is retried up to three times and then quarantined, and the drain treats every request in the watched folder as runnable, so a stale event is a late run rather than a skipped slot. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43-46] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:12]
7. The smallest change is to enforce the floor at plan or install time by measuring the schedule's shortest gap with the existing `schedulePeriodSeconds` and refusing anything under 900 seconds with a named reason; slot accounting then stays as it is. Size S, risk low. [INFERENCE: based on findings 1-5]
8. Event starts need a second, separate change if they must follow the skip policy: an optional `maxLatenessSeconds` on a queued request, checked by the drain against the request's `scheduledFor`, so a mail or pull-request event older than its window is closed as missed instead of run late. Size M, risk medium because it changes the queue's runnable definition. [INFERENCE: based on finding 6]

## Ruled Out

- Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence.
- Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst.
- Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window.

## Dead Ends

- Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions.
- Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts.

## Edge Cases

- Ambiguous input: none. F-2-009 names the missed-window, floor and queue-retry surfaces.
- Contradictory evidence: none. OpenBot and slot accounting agree on skipping missed windows; OpenMausBot adds a numeric bound rather than disagreeing.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:1-12
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:34-47
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:82-120
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82-110
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:56-57
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:276-280
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43-46
- .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts:12
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts:1-20
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-catch-up.ts:23-28
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-145

## Assessment

- New information ratio: 0.9
- Questions addressed: F-2-009
- Questions answered: F-2-009

## Reflection

- What worked and why: Reading the slot-accounting module first showed that most of the missed-window policy already exists, so the recommendation narrowed to the floor and the queue staleness bound instead of proposing a new scheduler feature.
- What did not work and why: Searching the installer for a floor found none, because the translator is the only schedule guard and it accepts every-minute expressions.
- What I would do differently: Read the every-minute path in the translator before the slot accounting, so the floor gap is established before the existing policy is credited.

## Recommended Next Focus

Work F-2-010 (routine guardrails: the 20-enabled cap and failure-streak auto-off), which is the last depth-2 routine node. Then broaden to the eight parts, starting with approvals and activity.
