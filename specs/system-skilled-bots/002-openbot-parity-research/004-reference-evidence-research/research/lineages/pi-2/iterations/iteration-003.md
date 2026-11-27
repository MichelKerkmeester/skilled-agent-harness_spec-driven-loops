# Iteration 3: Phases 001-activity-and-actor and 002-routine-layer

## Focus
Per-phase evidence for `001-activity-and-actor` and `002-routine-layer`: which reference files implement the same thing, what a builder should lift or mirror with the licence of the source, where the plan differs from the references, and which failures the plan does not yet guard against. The two phases are paired because 001's activity groups and 002's routine block both come from OpenBot-main and share the run-record surface.

Interpretation chosen: "the references" for 001 and 002 means OpenBot-main (the primary reference, MIT) plus the licence of every other repo a lift could touch, because both phases name lifted files in their acceptance criteria.

## Actions Taken
1. Read the plan's requirements and scope boundaries for 001 and 002.
2. Read OpenBot's `docs/routines.md` in full for the floor, the cap, the fatigue rule, missed windows and the actor rule.
3. Read OpenBot's `app/src/lib/bot-lifecycle/activity-groups.ts` against the plan's seven group ids.
4. Read the built runtime's `slot-accounting.ts` and `cron-translator.ts` for lateness and local-time handling, and grepped both for DST and timezone terms.
5. Collected the licence header of all ten reference repos and re-read the earlier synthesis's licensing section to separate new licence facts from known ones.

## Findings

1. **`tinychannels-main` is GPL-3.0, and no earlier synthesis names it; the plan's 011 notice rule is therefore load-bearing rather than cosmetic.** The reference's LICENSE is the GNU General Public License version 3. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] The earlier synthesis lists licences for the other nine repos and calls `openhuman` "GPL-3.0 and design-only", but it never mentions tinychannels, which was not in its repo set. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:120] This repository is MIT. [SOURCE: LICENSE:1-3] Phase 011's notice requirement already states "No tinychannels code is copied, so no notice names it". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:133] **Observed.** The finding is that the rule must survive: 011 cites tinychannels on nearly every row of its wire tables, and every one of those citations is a behaviour to mirror, never a file to copy. A builder who lifts a retry table or a constant from `delivery/policy.rs` turns an MIT repository into a GPL-3 derivative. Restating the licence in the 011 section of the notices file, as a "no code copied, behaviour mirrored from a GPL-3.0 reference" line, is cheaper than a later audit.

2. **The five vendored crates in `openhuman-full` are under the same GPL-3.0 licence as `openhuman-main`, so they are design-only before their value is even ranked.** `openhuman-full/LICENSE` is GPL version 3. [SOURCE: specs/system-skilled-bots/context/openhuman-full/LICENSE:1-2] The earlier synthesis already treats `openhuman` as design-only for the TUI shape. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:130] **Observed.** The net-new pass that reads `tinyagents`, `tinyconnectors`, `tinymemory`, `tinyhumans-sdk` and `tinysecurity` must score each one twice: once for value to a small team, and once as "mirror only", because no line of any of them can enter this MIT tree. A crate that is valuable only as code therefore scores lower than its behaviour is worth.

3. **A local-time cron slot that does not exist, or exists twice, has no rule in the built runtime, in the plan, or in the reference's own documentation.** The plan computes a next fire "from the cron expression in the machine's local time and written as an ISO 8601 UTC instant, because no launchd surface reports one". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:173] The runtime's `cron-translator.ts` and `slot-accounting.ts` were grepped for `DST`, `daylight`, `timezone`, `timeZone` and `TZ=`: no match in either file. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:36-45] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:1] Plan 002 states the 15-minute floor and the skip rule but no transition rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:172], and OpenBot's routines document covers the floor, the cap, fatigue, missed windows and the actor, and gives no daylight-saving rule in any of them. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:107-146] **Observed (absence on all three sides) / inferred (the failure).** A `daily 02:30` routine on the spring-forward night in a zone that skips 02:00 to 03:00 has no slot to stand for, and on the fall-back night has two. The slot-accounting account function would either find no slot at or before the fire or find the same local time twice, and neither the plan's acceptance criteria nor the runtime's tests name the case. This is the one failure in either phase that no side guards.

4. **The activity grouping is a faithful lift: OpenBot's seven ids and their order are exactly the plan's, and the reference's third entry kind has no analogue here.** `ACTIVITY_GROUPS` is `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring`, in that order, with the ordering rationale "what waits on the person, what is running, what is lined up, then how it ended". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:22-48] The plan requires the same seven ids in the same order and leaves out an empty group. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:166] The reference carries three entry kinds — a task, an item and a `check_in` — where the plan's `recurring` group is fed by installed cron schedules instead. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts:50-52] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:173] **Observed.** The lift is correct as far as it goes; the one item a builder will miss is that the reference groups a *check-in setting* as its own entry kind, which here has no store, so a host with a `does: tell` routine shows nothing under `recurring` until 002's schedule rows exist. That is intended, and worth one line in the data-model so a later reader does not read it as a bug.

5. **Both of 002's tempting additions are already deferred with a citation and a reversal condition, so no builder should re-add them.** The 20-enabled cap is excluded because "skilled bots has no per-person list, and the operator owns the repository's `bots/` folder". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114] The first-failure notice is deferred because `delivery.onFailure` already reports each failure, with the reversal condition "a phase that adds a notice channel reads the run records for the first failure after a completed one". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:121] **Observed.** This is a confirm, not a gap: the reference posts exactly one notice on the first failure after a success and a second at the tenth [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:118-124], and the plan's deferral is the right call for a single-operator host. Recording it here so a later phase does not treat it as an oversight.

## Ruled Out
- **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision.
- **The first-failure notice as a gap.** Explicitly deferred with a reversal condition.
- **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add.

## Dead Ends
- Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence.
- OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule.

## Edge Cases
- Ambiguous input: two phases in one iteration. Both are OpenBot-sourced and share the run-record surface, and the alternative was two thin iterations for a 10-iteration run covering 14 phases.
- Contradictory evidence: none. Finding 3 is an absence on every side rather than a contradiction.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/OpenBot-main/LICENSE
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts
- specs/system-skilled-bots/context/tinychannels-main/LICENSE
- specs/system-skilled-bots/context/openhuman-full/LICENSE
- specs/system-skilled-bots/context/{OpenMausBot-main,rakazo-main,openhuman-main,OpenGhost-main,hermes-muse-main,turnstone-main,buzz-main}/LICENSE
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSING.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts
- LICENSE

## Assessment
- New information ratio: 0.80
- Questions addressed: 001-activity-and-actor evidence, licence of every lift; 002-routine-layer evidence and its two deferrals.
- Questions answered: both phases' per-phase evidence questions, except the reference-side failure inventory for 002's `until_check`, which is not a reference feature (it is this packet's own addition).

## Reflection
- What worked and why: collecting all ten licence headers in one pass. The earlier synthesis's licensing table made the new fact visible by omission — tinychannels was simply absent from it — and one grep for a term none of three sides uses (DST) turned a suspicion into a citable gap.
- What did not work and why: approaching 001 and 002 expecting defects. The plan had already excluded the two obvious additions with citations, so two of the five findings are confirms rather than gaps. That is a good outcome for the plan and a lesson about where to hunt: the unguarded cases live in the seams between three artefacts (plan, runtime, reference), not in any one of them.
- What I would do differently: check the prior synthesis's licensing and skip tables *before* reading a phase, not after. It cost a pass to discover that the 20-cap and the first-failure notice were already settled.

## Recommended Next Focus
Phase 003-terminal-screen and 004-computer-exposure: the reference's terminal renderer, answer overlay and status vocabulary, and the computer-exposure model (which host surface a bot may touch, and under what grant), with the failures their tests name.
