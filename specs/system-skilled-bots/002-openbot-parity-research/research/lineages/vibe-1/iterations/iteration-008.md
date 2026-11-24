# Iteration 8: The memory-source sync clock against cron and queue triggers

## Focus
Frontier node F-2-006 (depth 2, scope OpenBot-main/api/openapi/memory.yaml, .skilled/skills/system-skilled-bots/bots-schedule): How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?

## Actions Taken
1. Read the `MemorySource` sync fields and their descriptions in `memory.yaml`, plus the example payload for the cadence.
2. Read the trigger model in `runtime/lib/definition.ts`: the four kinds and the per-kind key validation.
3. Read the cron translator's module contract and the installer's next-fire constant.
4. Read the queued-request shape and the queue's retry bound.
5. Read `bots-schedule/references/schedule-lifecycle.md` for the install, hold and drift rules.

## Findings
1. OpenBot's `MemorySource` carries a sync clock: `syncStatus` is an extensible enum `idle | running | succeeded | error`, `syncError` is "Why the last sync failed, in a sentence for the person", `lastSyncAt` is a nullable date-time, and `nextSyncAt` is a non-nullable date-time. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:673]
2. The example cadence is fifteen minutes: `lastSyncAt: '2026-11-14T08:45:00.000Z'` beside `nextSyncAt: '2026-11-14T09:00:00.000Z'`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:961]
3. The runtime has exactly four trigger kinds — `cron` (an expression), `queue` (a name), `git-hook`, and `manual` — and a definition's trigger block is validated against its kind's allowed keys, so an unknown key is refused rather than ignored. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25]
4. A cron expression is translated to launchd calendar dictionaries or an interval, and "every cron string either becomes dictionaries that fire exactly as cron would or is refused with a named invariant id". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:5]
5. The runtime never computes a next fire time: `NEXT_FIRE_UNKNOWN = 'UNKNOWN'`, with the comment "The next fire time is never computed: no launchd surface reports it." [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:93]
6. A queued request has exactly two kinds, `run` and `resume`, and carries a free-form `source` string plus an `origin` that names who or what produced it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:27] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:51]
7. The queue's retry policy is already bounded: `RETRY_BOUND = 3`, and the drain job has a 60-second throttle with a 300-second backoff base doubling to a 3600-second cap. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:87]
8. `bots schedule install drain` installs the repository's queue-drain job, and a first install is always held disabled until `bots enable`. [SOURCE: .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md:37]
9. A scheduled run uses only the `BOT.md` and `bots/config.json` an operator approved, and is refused as `definition-drifted` after either file changes. [SOURCE: .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md:52]
10. A memory source sync is a `cron` trigger, not a new trigger kind: the source's cadence is the cron expression, and the sync itself is a `run` request with `source: 'memory-sync'` and `origin: <sourceId>`. [INFERENCE: based on findings 1, 3 and 6]
11. `nextSyncAt` should not be stored: the runtime already refuses to predict a next fire, so the field becomes a display derivation from the source's cron expression, or drops out of the record entirely. [INFERENCE: based on findings 2 and 5]
12. `syncStatus` is fully derivable and should not be stored either: `idle` is no request in the queue for that source, `running` is a claimed request, and `succeeded` or `error` is the last run record's exit. [INFERENCE: based on findings 1 and 6]
13. `syncError` maps onto the run record's failure reason, which the delivery message already renders as a sentence for the person. [INFERENCE: based on findings 1 and 6]
14. `lastSyncAt` maps onto the last run record's dispatch time, which the status index already stores per run. [INFERENCE: based on findings 1 and 6]
15. A failed sync needs no new retry policy: the queue's `RETRY_BOUND = 3` and the drain job's 60-second throttle with 300-to-3600-second backoff already bound it. [INFERENCE: based on finding 7]
16. The smallest change is one new `source` string and one cron expression per source, with no new trigger kind, no new store and no new retry path. [INFERENCE: based on findings 10 through 15]

## Ruled Out
- A fifth trigger kind for memory sync. The four kinds already cover a timed read-in, and a new kind would need its own validation, install path and drift rule.
- Storing `nextSyncAt` as a computed timestamp. The runtime deliberately reports `UNKNOWN` for a next fire because no launchd surface reports one, so a stored value would be a guess that goes stale.
- Storing `syncStatus` as a field. Every one of its four values is already readable from the queue and the last run record, so a stored copy could disagree with them.
- A separate sync scheduler beside the drain job. The drain job already runs on a throttle with backoff and already claims requests from the inbox.

## Dead Ends
- Looking for a next-fire calculator in the runtime. There is none by design: `NEXT_FIRE_UNKNOWN` is the only value the installer ever reports for `nextFire`.

## Edge Cases
- Ambiguous input: none. The node names both sides of the mapping.
- Contradictory evidence: none. OpenBot stores `nextSyncAt`; the runtime refuses to compute one. That is a difference in capability, not a conflict between sources.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:640-700
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:955-1000
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-35
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:141-166
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:1-40
- .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:86-98
- .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:27-62
- .skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:43-49
- .skilled/skills/system-skilled-bots/bots-schedule/references/schedule-lifecycle.md:33-54

## Assessment
- New information ratio: 0.91
- Questions addressed: How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?
- Questions answered: How does an OpenBot memory source sync clock (nextSyncAt, syncStatus) map onto our cron and queue triggers?

## Reflection
- What worked and why: reading the installer's `NEXT_FIRE_UNKNOWN` constant. It is one line with a comment, and it settles the whole `nextSyncAt` question: the runtime has already decided not to predict a fire, so a stored next-sync time would be the only guessed timestamp in the tree.
- What did not work and why: looking for a next-fire calculator to reuse. There is none, and the absence is deliberate rather than an oversight.
- What I would do differently: read the trigger model before the OpenBot fields. Knowing there are exactly four kinds and two request kinds makes the mapping a one-line answer, and the OpenBot fields then only decide which of the four it is.

## Recommended Next Focus
The skill proposal path: OpenBot's `LearningProposal` carries an `operation` and a `publishedSkillId`, so the next question is where a proposed skill should live on disk and how it reaches a person for review without a second review surface.
