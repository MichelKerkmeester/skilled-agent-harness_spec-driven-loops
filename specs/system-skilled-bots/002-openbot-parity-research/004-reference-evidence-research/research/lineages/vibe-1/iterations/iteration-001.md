# Iteration 1: Human surface — phases 001-activity-and-actor and 002-routine-layer

## Focus

Frontier node F-1-001 (depth 1). Which reference files implement an activity feed, an inbox, an actor on a record and routines with an `until` outcome; what a builder should lift or mirror and under which licence; where the plan differs from the reference and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against.

Scope read: `003-openbot-parity-build/001-activity-and-actor/spec.md`, `003-openbot-parity-build/002-routine-layer/spec.md`, `context/OpenBot-main/app/src/lib/bot-lifecycle/`, `context/OpenBot-main/shared/`, `context/OpenBot-main/docs/routines.md`.

## Findings

1. **Phase 001 — the seven group titles are liftable verbatim and the plan fixes only the ids.** `ACTIVITY_GROUPS` declares each group as `{ id, title }` in one ordered array: `needs_you`/"Needs you", `working`/"Working", `scheduled`/"Scheduled", `done`/"Done", `stopped`/"Stopped", `failed`/"Failed", `recurring`/"Recurring" [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:28-39]. Phase 001's REQ-001 fixes the seven ids and their order and REQ-002 requires each group to carry a `title`, but no line in the phase fixes the title strings, so a builder invents seven labels that the screen's sample payload then has to match. Lift the array as-is under the MIT notice REQ-006 already requires. (observed)

2. **Phase 001 — `stopped` is a derived predicate over a stop instant, not a status value.** The reference never stores a "stopped" status: `stoppedByYou` returns `task?.status === "failed" && Boolean(task.stoppedAt)` [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/tasks/queries.ts:300-304], and `taskGroup` routes a failed task to `stopped` or `failed` on that predicate alone [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:82-87]. The 003 synthesis already carries the gap that `stopped` has no data source (003-plan-depth-research §4.001 gap 1); what is new is the shape of the fix — one nullable `stoppedAt` instant on the run record plus a predicate, so no new status value, no index column and no `SCHEMA_VERSION` move, which is exactly the constraint 001's own risk table imposes. (observed for the reference; inferred for the plan's fix shape)

3. **Phase 001 — the reference dedupes a needs-you item against the run that raised it, and the plan does not.** `groupActivity` skips an approval or question whose `channelId` is one of the listed task's conversations, so it is shown once, as the task [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:147-152]. Phase 001 sources `needs_you` from the status index and `working` from the bot's held lease side file [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143], and a parked run holds its lease while its item is open, so one parked run prints twice: once under `needs_you` and once under `working`. The plan needs one dedupe rule keyed on the item's `runId`, which REQ-003 already carries. (observed for the reference; inferred for the plan's absence)

4. **Phase 001 — the reference drops an action's first row when its failure row is loaded beside it, and the plan has no retry rule.** `oneRowPerAction` collects the `attempt` ids of failed, stopped and refused actions and filters out the matching `computer.action_allowed` row, because "the first is the one a reader believes" [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:70-96]. The runtime's queue retries a claimed request up to three times, so one request can leave more than one run record, and `bots activity` has no rule for which of them it prints. The reference's rule is the liftable one: the terminal row wins and the earlier row is left out of the read, not out of the trail. (observed)

5. **Phase 002 — the reference frames a firing in three sentences because a live firing read its own instruction as a routine-management question, did nothing, and recorded `succeeded`.** `FIRING_FRAME` is three fixed sentences: that this is a scheduled firing happening now, that the work belongs in this turn, and that managing routines is not what was asked [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:9-13]. The comment records the failure verbatim: the instruction "Every run, append the current date and time …" was sent as the turn's user message, the model called `list_routines`, found a routine that already said that, answered that it was already configured, and appended nothing — "a routine telling somebody it is working while doing nothing at all, which is worse than one that breaks" [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:18-34]. Phase 002 changes when a bot runs and when it stops and never what the run is told: a search of its spec for `firing`, `frame` or `prompt` finds no framing rule. This is the highest-value lift in the phase, it is MIT, and the plan does not guard against the failure at all. (observed)

6. **Phase 002 — the reference records a second live failure on the identity of a "tell" routine, and the plan's `does: tell` has no identity rule.** `checkInSubject` falls back to the instruction collapsed to one line and cut to 120 units, and the comment records why: a check-in with no Name went in with an empty subject, the server counts a check-in with no link and the same subject as the same one, so every unnamed "Only tell you" landed on the bot's default check-in and was refused as already there [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:52-68]. Phase 002 maps `does: tell` to local-only delivery [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114] and states no identity for a tell routine, so two tell routines with the same body either collide or duplicate. (observed)

7. **Phase 002 — the plan sorts `recurring` by next fire and the reference deliberately does not.** Phase 001's REQ-002 requires rows "soonest first in `scheduled` and `recurring`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:118]. The reference sorts `scheduled` ascending by time and never sorts `recurring`: it appends routines, then goals, then check-ins in insertion order [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:175-192]. The evidence supports the plan for a terminal list, where a next-fire column is the useful ordering, but the reference's reason is worth keeping: a time-sorted recurring list reorders itself on every poll, so a row moves under the reader's cursor. State the sort and accept the movement, or keep insertion order and print the next fire as a column. (observed)

## Ruled Out

- **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference.
- **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable.
- **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field.

## Dead Ends

- `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it.
- OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap.

## Edge Cases

- Ambiguous input: none. The node named both phases and both reference repos.
- Contradictory evidence: none. The one difference found (finding 7) is a design choice, not a contradiction.
- Missing dependencies: the server-side goal evaluation is absent from the checkout (see Dead Ends); recorded as a limit on finding 2's scope, not as a failure.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:28-39, 65-75, 82-87, 102-199
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/tasks/queries.ts:300-304
- specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:70-96
- specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:9-13, 18-51
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/plan.ts:8-16, 52-68
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/routines/merged.ts:144-159
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-145
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:95-255
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114, 173, 195
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:75-102
- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent at read time)

## Assessment

- New information ratio: 0.93
- Questions addressed: F-1-001 (human surface, phases 001 and 002)
- Questions answered: F-1-001

## Reflection

- What worked and why: reading the reference's own comments rather than only its code. `routine-firing.ts` and `plan.ts` both carry a recorded production failure in prose beside the fix, which is the exact class of evidence the topic asks for ("which failures, tests and fixes in those repos the plan does not yet guard against") and which no earlier synthesis could reach because none read these files.
- What did not work and why: searching for an `actor` counterpart in OpenBot's audit trail. The reference attributes by conversation and routine owner, so there is nothing to lift and the search cost two calls.
- What I would do differently: read the phase's `design/` folder before the reference, so the comparison is against the phase's own decided shapes rather than its requirements alone.

## Recommended Next Focus

Frontier node F-1-005: prompt and records, phases 004-computer-exposure, 005-memory, 009-skills and 010-conversations, reading `openhuman-full` first because no earlier run studied it.
