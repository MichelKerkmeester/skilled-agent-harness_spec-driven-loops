# Iteration 4: Phases 001-activity-and-actor and 002-routine-layer

## Focus

Phases 001-activity-and-actor and 002-routine-layer: which reference files implement the same thing, what a builder should lift or mirror, where the plan differs from the reference and which side the evidence supports, and which failures the plan does not yet guard against.

The frontier nodes are worked out — F-1-002's three depth-2 children are answered and the run-wide node cap pruned the last proposal — so this iteration takes the phase coverage the topic's first question demands. 001 and 002 are the two phases every other phase reads, and iteration 3 touched them only through their approval seams.

## Actions Taken

1. Read `OpenBot-main/shared/activity-rows.ts` in full for the activity projection's exclusion and dedupe rules.
2. Read `OpenBot-main/docs/routines.md` for the routine row's four parts, the ordering rule, the refused-schedule behaviour and the edit path.
3. Read the plan's 001 `design/data-model.md` sections on the module boundary, the refresh on read and the answer identity.
4. Read the plan's 002 REQ-001 to REQ-011 and its non-goals list.
5. Compared the reference's event-log projection with the plan's status-index projection.

## Findings

1. **001 — the reference excludes six of its own event types from the personal activity view, and the plan has no row-level exclusion.** `OPENBOT_WORKING_EVENT_TYPES` is `mcp.tools_discovered`, `channel.routed`, `component.published`, `component.description_updated`, `computer.policy_loaded` and `computer.isolation_loaded`, because "None of it is something a Bot did or a person can act on, and Admin keeps all of it". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:14-38] *(observed)* The plan's 001 has an empty-group filter and no row-level exclusion. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md:29] *(observed)* A runtime that indexes its own setup rows — a tool discovery, a policy load — would fill `working` with them, and the plan's seven groups have no rule that says which rows are the runtime talking about itself. This is the one 001 gap with a concrete failure behind it.

2. **001 — the reference drops a call row when the change it made is recorded separately, and keeps it when the call failed.** `CALLS_RECORDED_AS_CHANGES` is `routines/create_routine`, `routines/update_routine` and `routines/delete_routine`, and the rule is: "A Bot creating a routine wrote two rows for one action ... Activity leaves the call's row out when it succeeded, and shows the change, which is written whoever made it ... A call that failed made no change and keeps its row." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:40-52] *(observed)* The plan's 001 has no dedupe rule; its only duplicate handling is the answer's text-and-scope identity. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md:221] *(observed)* Phase 002's `bots routines` and 009's `bots skill propose` each write a change beside a call, so the plan will draw two rows for one action the first time a bot edits its own routine. The rule to mirror is the conditional: drop the call row only when it succeeded.

3. **001 — the reference draws each action once and counts the same rows in two places.** "The page asks the server to leave `OPENBOT_WORKING_EVENT_TYPES` out and draws each action once (`oneRowPerAction`). The Activity report a Bot draws counts the same rows ... so its figure for a Bot is the number of rows the person finds on the page for that Bot." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:4-7] *(observed)* The plan's 001 has one reader, `bots activity`, so the one-declaration rule has nothing to protect yet. It will have two the moment 003's screen and 011's channel read the same rows, and the rule is what keeps their counts equal. This is the third instance of the pattern iteration 3 recorded in 007.

4. **002 — the reference persists a routine whose schedule is refused and pauses it, while the plan refuses the install.** "If a goal is saved but its schedule is refused, the goal is paused, and the screen says why its schedule was refused." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:52-54] *(observed)* The plan refuses `routine-floor-15-minutes` at the checker and at the installer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:172] *(observed)*, so the declaration never lands and the operator's words are lost with it. The evidence supports the plan for a file-backed definition — a refused BOT.md is a defect its author fixes, and a paused file would be a second state to explain — and the reference's behaviour is what a later `bots routines add` verb would need, because a verb has no file to reject.

5. **002 — the plan defers the check-in cap and leaves `does: tell` on the 15-minute floor.** The plan states the deferral: "The check-in frequency cap of once an hour - no check-in store exists, and `does: tell` is the whole of the check-in surface here." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:120] *(observed)* The reference caps a check-in at "at most once an hour". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:19] *(observed)* So a `does: tell` routine on the plan's floor fires 96 times a day against the reference's 24. The plan's floor is one number for both `act` and `tell`; the evidence supports a second, higher floor for `tell`, and the plan's own deferral note is the place to record that the residual is 4x the reference's cap rather than unbounded.

6. **002 — the reference orders working rows first, and the plan sorts by bot id.** "Rows that are working (on, active, not paused) come first." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:25-26] *(observed)* The plan's `bots routines --json` sorts by `botId`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:179] *(observed)* The two are not in conflict once the reader is named: a terminal list wants an order a script can diff, and a screen wants the working rows on top. The evidence supports the plan for the verb and the reference for the screen, so 003's routines pane should sort by `switch` and 002 should keep `botId`.

7. **002 — the reference's four parts are the plan's four keys, and the plan adds a fifth the reference has no name for.** The reference's row is "What, Starts, Does, Until". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:15-21] *(observed)* The plan's block is `what`, `starts`, `does`, `until` and `until_check`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168] *(observed)* `until_check` is the plan's own addition: the reference's "Done when" is prose a person judges, and the plan makes it a command that switches the bot off. That is the plan's strongest single improvement over the reference in this phase, and 013 should say so rather than presenting the block as lifted.

8. **002 — the reference changes a routine by being asked, and the plan has no path for that.** "The same Bot can list what is standing, change one, or delete one, all by being asked. There is no edit form." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:57-59] *(observed)* The plan's 002 is read-only — `bots routines` lists — and 010 adds `bots chat`. So the plan's edit path is a person editing BOT.md. The evidence supports the plan for a file-backed definition, and 010 should record that a chat-driven routine edit is out of scope rather than leaving it to be discovered.

9. **001 — the reference projects an event log and the plan projects a status index, and the difference is what each can show.** The reference's rows come from named event types such as `mcp.tools_discovered` and `routine.created`. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:14-52] *(observed)* The plan's rows come from the status index's run, delivery and item rows plus live leases, queued requests and installed schedules. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:45] *(observed)* An event log can show a row for something that never became a run; an index cannot, and the plan's own Problem Statement already says three of the seven groups have no source in the index at all. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:67] *(observed)* The evidence supports the plan's index projection for a small team — one store, one retention rule, no log to rotate — and the reference's event log is what a complete timeline would need. 001 should record the trade rather than the gap.

## Ruled Out

- **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered.
- **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size.
- **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7.

## Dead Ends

- `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema.
- `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites.

## Edge Cases

- Ambiguous input: none. Both phases had one reading.
- Contradictory evidence: none. The plan and the reference differ on four points and each difference is a design choice, not a conflict.
- Missing dependencies: `OpenBot-main/server/` is absent, so the event writer that produces the reference's rows cannot be read. Fallback: the shared exclusion and dedupe lists, which are the rules the writer obeys. Confidence impact: the row *sources* are inferred from the event names, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:1-96
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:1-60
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:42,45,67,102,119,126-143,166,171
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/design/data-model.md:29,144,215,221,287
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:33,50,53,64,97,113,119-120,127-129,168-183,269
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/records.md:156
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/fixtures.md:42,85

## Assessment

- New information ratio: 0.88
- Questions addressed: the topic's first question for phases 001 and 002 — reference files, what to lift or mirror, where the plan differs and which side the evidence supports, and the unguarded failures.
- Questions answered: 001's missing row-level exclusion and dedupe rules; 002's refused-schedule difference, the `does: tell` floor residual, the ordering split between verb and screen, and the `until_check` improvement.

## Reflection

- What worked and why: reading the reference's *rule lists* rather than its page code. `OPENBOT_WORKING_EVENT_TYPES` and `CALLS_RECORDED_AS_CHANGES` are two exported constants, and between them they carry the two rules the plan lacks. A page component would have shown the same rules as branches.
- What did not work and why: my first three candidate findings for 002 — a missing `does` key, a missing check-in cap, a missing `until` — were all wrong, and reading the plan's REQ table refuted each in one line. The plan is more complete than a reference-first read suggests.
- What I would do differently: read the plan's REQ table before the reference for every phase, and treat the reference as the source of *rules the plan has no row for* rather than of features the plan lacks.

## Recommended Next Focus

Phases 004-computer-exposure and 005-memory, the two phases no iteration has read. The specific next reads are `OpenBot-main/shared/computer-control.ts` and `shared/computer-start.ts` for 004, and `OpenBot-main/docs/memory.md` plus `openhuman-full/vendor/tinymemory/` for 005. The open question this iteration leaves is whether 001's seven groups need an eighth for the runtime's own rows or an exclusion list; the reference chose exclusion, and the plan has neither.
