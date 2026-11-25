# Iteration 4: Runtime foundations and messaging

## Focus
Runtime foundations and messaging: assess phases 001-activity-and-actor, 002-routine-layer, 004-computer-exposure, 006-approval-grants and 011-messaging-channels for record contracts, lifecycle/state transitions, security boundaries and user-facing channel design. The strategy registry had no open tracked questions, so this pass broadened to the remaining runtime phases and did not reopen the frontier nodes.

## Actions Taken
- Read the current lineage config, state, strategy and registry state; `steer.md` was checked and absent. Wrote the non-frontier focus and the frontier-block command returned no node.
- Compared the five phase plans, requirements, test cases and rollback sections, concentrating on routine-state writes, answer concurrency, backward-compatible index reads and the transport message surfaces.
- Read the channel reference adapter and inbound envelope contracts in tinychannels, and checked phase 011's listed file set for a UX/design artifact owner.

## Findings
1. **Phase 002-routine-layer — P1 state-transition race.** `routine-state.ts` reads/writes routine state and `evaluateFatigue` updates the disabled switch, fatigue record and needs-you item; `bots enable` clears the switch and fatigue record through another surface. The implementation sequence and test matrix do not define which operation wins if enable races an in-flight failed run, or how to recover if the process stops between the switch, state and item writes. Add a serialized/idempotent transition contract and race/restart fault fixtures to `002-routine-layer/plan.md`, `tasks.md` and `acceptance-criteria.md`; keep this a targeted Level 2 amendment, not a phase parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:71-73] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:101-102] [INFERENCE: the plan names both writers and a state matrix, but no race ordering or partial-write recovery fixture]
2. **Phase 011-messaging-channels — P1 user-facing design gap and scope split.** The plan pins the adapter, queue, approval grammar, five transport files and per-platform button/text surfaces, but it does not assign a design artifact with literal message examples or mockups for prompt, answer choices, expiry, refusal, redaction and uncertain delivery. The phase file inventory also contains no design folder. Create a Level 3 phase parent with children for (a) UX/message catalog and component map, (b) shared contract/config/pairing/roster, (c) approval and queue persistence/recovery, (d) Telegram and Slack adapters, (e) Signal and WhatsApp adapters, and (f) terminal/chat integration and conformance hardening. The UX child should own `design/` mockups and fixture snapshots for all five surfaces; it should also make the documented fatigue-notice limitation explicit or decide its channel behavior. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:31-32] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:67-80] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:101-108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:140-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:68]

## Questions Answered
- Whether routine lifecycle, run location, approval grants and channel flows are specified enough to implement without new module or schema decisions.
- Which remaining runtime phases warrant a depth amendment or parent split.

## Questions Remaining
- Cross-phase contract compatibility and expansion ranking across the full 001-014 plan; carried to iteration 5.

## Assessment
- Phase 001-activity-and-actor: no P0/P1 planning gap found. Actor precedence, actor/answer record fields, old-index compatibility, and integration coverage for old DDL and scheduled actors are specified; keep Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:123-125] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:148-149]
- Phase 004-computer-exposure: no P0/P1 planning gap found. The working-directory/branch record fields, nullable branch case, prompt slot, resume upgrade and pre-change summary readback are described; keep Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:62-69] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-149]
- Phase 006-approval-grants: no P0/P1 planning gap found. The answer lock, first-answer-wins rule, grant writer and concurrent-answer test are specified; keep Level 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:63-67] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:169-171] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:120-124]

## Sources Consulted
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/deep-research-config.json`
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/deep-research-state.jsonl`
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/deep-research-strategy.md`
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/steer.md` (checked; absent)
- Phase docs for 001, 002, 004, 006 and 011 listed in the citations above
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:43-103`
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/envelope.rs:37-59`
- `specs/system-skilled-bots/context/OpenGhost-main/routines.js:41-72` (first reference for visible routine lifecycle)
- `specs/system-skilled-bots/context/OpenGhost-main/approval-card.js:4-6,59-89` (first reference for user-facing approval-card hierarchy)

## Assessment Summary
- New information ratio: 1.0
- Questions addressed: runtime phases 001, 002, 004, 006 and 011.
- Questions answered: 001, 004 and 006 are one-shot ready at Level 2; 002 needs a focused race/recovery amendment; 011 should become a Level 3 parent and needs explicit message design artifacts.

## Reflection
- What worked and why: Comparing writer surfaces against the existing tests exposed a concrete 002 race that module inventories alone would miss; inspecting the 011 file list separately distinguished detailed transport mechanics from absent message design deliverables.
- What did not work and why: The strategy no longer supplied an open question, so the focus had to broaden from the frontier to unreviewed runtime phases; the direct phase docs provided enough evidence without external web research.
- What I would do differently: In the next pass, trace the producers and consumers across all fourteen phases together and rank the remaining contract handoffs by whether a downstream builder can act on them as written.

## Recommended Next Focus
Iteration 5: cross-phase contract audit and final ranked expansion plan for every phase except the 003 terminal-screen children; compare the outputs and inputs across 001-014, include reference-code priorities, and distinguish required parent expansions from focused amendments.
