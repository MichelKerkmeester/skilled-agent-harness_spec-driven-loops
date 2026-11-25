# Iteration 1: Shared data contracts

## Focus
Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/010-conversations, .skilled/skills/system-skilled-bots/runtime/lib): Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?

## Findings
1. **Phases 001/005/006/010 — P1:** Their additions evolve the same closed `NeedsYouItem` shape, but the packet has no shared, versioned schema and writer-ownership contract for staged fields (`kind`, `grants`, and `conversationId`), null/default behavior, old-reader compatibility, and cross-phase rollout order; add `specs/system-skilled-bots/003-openbot-parity-build/shared-record-contracts.md` with JSON Schemas, field ownership, compatibility fixtures, and the migration sequence. Phase 001 does specify its own activity/inbox rows and answer fields, and 010 specifies the chat message record; the gap is their shared evolution contract. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151-156] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152-154] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153-157] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65,95-99] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:80-94,188-192]
2. **Phase 002-routine-layer — P1:** The plan names `untilMetAt`, `fatiguedAt`, and `fatigueItemId`, and defines when completion and ten consecutive failures change switches, but does not settle the persisted record schema/version, malformed-state recovery, or atomic/concurrent update behavior; add child `002-routine-state-and-recovery` with the state schema, transition table, restart/corruption policy, and time/failure fixtures. The phase spans routine parsing, runner, installer, state, CLI, docs, and tests, so promote it to a phase parent with children for routine grammar/triggers/floor, completion lifecycle, fatigue/answer lifecycle, and CLI/status integration plus hardening. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:121-145,165-167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:71-73,123-126]
3. **Phase 005-memory — P1:** Entry fields, bounds, and the append/forget owner are named, but the durable line grammar still needs an explicit escaping rule for delimiter characters and a concurrent append-versus-forget protocol; add child `005-memory-file-format-and-write-protocol` with a schema/grammar, malformed-line policy, atomic rewrite/locking behavior, and `|`/crash/concurrency fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146-151] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60,108]
4. **Phase 006-approval-grants — P1:** The grant object and concurrent-answer loser are specified, but rollback says to revert and then manually remove or strip `grants` from item files; it does not give a tested downgrade path that preserves open approvals for the older closed-key reader. Add child `006-grant-schema-rollout-and-rollback` with a compatibility strategy, reversible migration/downgrade procedure, backup/restore steps, and mixed-version fixtures. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153-171] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:144-149] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:95-99]

## Ruled Out
- Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196]
- The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk.

## Dead Ends
- Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution.

## Edge Cases
- Ambiguous input: none; the frontier narrowed the review to phases 001, 002, 005, 006, and 010.
- Contradictory evidence: none found in the reviewed packet/runtime sources.
- Missing dependencies: one broad search targeted absent module names; direct reads of the existing validators supplied the needed evidence.
- Partial success: no dedicated JSON Schema files were inspected in this iteration; the findings describe omissions in the reviewed phase contracts and name the artifacts that would close them.
- Initialization conflict: the lineage config's `parentSessionId` equals its own session id because the init script reused the parent config object; the run-open event is already durable. Preserve this lineage identity, record the discrepancy, and do not rewrite the config or ledger.
- `steer.md` was absent at iteration start.

## Sources Consulted
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:151-156`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:121-145,165-167`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:71-73,123-126`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146-151`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:60,108`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153-171`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:144-149`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196`
- `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65,95-99`
- `.skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:80-94,188-192`
- `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, and `steer.md` (absent at iteration start) in this lineage

## Assessment
- New information ratio: 0.5
- Questions addressed: Data/contracts and JSON payloads for phases 001, 002, 005, 006, and 010.
- Questions answered: No, not all contracts are one-shot complete. Phases 001 and 010 are mostly explicit for this angle; phases 002, 005, and 006 retain decisions, and shared record evolution needs one packet-level contract.
- Questions remaining: 2
- Finding novelty: the sibling lineage raised related leads; this iteration verified them against the primary phase/runtime sources and specified concrete closing artifacts, so the findings are partially new.
- Timestamp observed before recording: 2026-11-25 21:54:09 UTC.

## Reflection
- What worked and why: comparing requirement tables to the runtime validators exposed that strong per-phase field lists still need a shared rollout contract when readers reject unknown keys.
- What did not work and why: the initial broad runtime lookup used module names that were not present, so it returned no useful contract evidence.
- What I would do differently: start the next contract pass from the actual runtime file inventory, then trace each field through every writer and reader.

## Recommended Next Focus
Continue with the next unvisited bound frontier node after the reducer refresh; keep the remaining phase expansion review separate from this data-contract pass.
