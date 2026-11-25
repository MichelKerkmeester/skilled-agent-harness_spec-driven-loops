# Iteration 9: The cross-cutting layer — refusal catalogue, concurrency and restart, migration and rollback

## Focus
Whether the packet has one error and refusal catalogue, one concurrency and restart rule and one migration and rollback rule, or whether each phase's own names and rules are the only record. Every earlier iteration found a phase minting a name or a shape that another phase reads, so this iteration tests whether anything owns the vocabulary those names belong to.

## Actions Taken
1. Grepped the whole packet for a refusal or error catalogue owner (`refusal catalogue`, `error catalogue`, `refusal table`, `exit-code table`): no file matches.
2. Read `runner.ts:113-151` for `EXIT_CODES` and `REFUSAL_CAUSES`, and `run-record.ts:123-143` for `HonoredPosture`, `RunExit` and `RefusalDetail`.
3. Counted the exit codes each phase spec states, and grepped all 14 phase specs for `EXIT_CODES`: zero cite it.
4. Counted `concurren|lock|restart|crash|interrupt|resume` and `migrat|rollback|backward|older record|upgrade` per phase spec to locate the phases that own each concern.
5. Extracted the new refusal names each of 007, 008, 009 and 011 mints, and grepped the packet for `REFUSAL_CAUSES`, `RefusalCause` and `FailureClass`: no phase document mentions any of them.

## Findings

1. **P0 — the refusal catalogue exists in code and no phase cites it.** `REFUSAL_CAUSES` at `runner.ts:123-151` is a frozen 25-entry registry, each entry `{reason, class}` where `class` is `author`, `operator`, `environment` or `null`, and `RefusalCause` is `keyof typeof REFUSAL_CAUSES`. Across 007 to 011 the phases mint roughly 36 new names — 007 four (`apps-invalid`, `apps-refused`, `apps-unenforceable`, `apps-unknown-server`), 008 nine, 009 thirteen, 011 ten — and not one phase document mentions `REFUSAL_CAUSES`, `RefusalCause` or `FailureClass`. A builder who adds a name without registering it fails typecheck; one who casts defeats the taxonomy; and the `class` value is what `RunExit.class` carries into the run record, so a wrong class mislabels a refusal as an author, operator or environment fault. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:123] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:151] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:130]

2. **P1 — `RefusalDetail.cause` is a free string, so the typed registry is not enforced at the record boundary.** `run-record.ts:142-143` declares `cause: string`, not `RefusalCause`, so a record can carry a name the registry does not hold and nothing rejects it. The registry is therefore advisory at exactly the point where a later reader would rely on it. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:142]

3. **P1 — no phase owns the exit-code convention.** `EXIT_CODES` at `runner.ts:113-120` is a frozen six-value object — `completed` 0, `runFailure` 1, `usage` 2, `recursionGuard` 3, `refused` 4, `awaitingDecision` 5 — and `bots-run/references/run-queue-and-answer.md:15` names it as the table a reader checks. Zero of the 14 phase specs cite `EXIT_CODES`; each restates a bare number. The numbers agree today, but nothing makes a new phase agree tomorrow: 008's `secret-no-input` exit 2 is a `usage` code chosen by restatement rather than by citation, and a builder adding a refusal has no rule telling them which of the six to pick. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:113] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146]

4. **P0 — the packet has no schema-version concept, so every record change is undetectable.** `state-root.ts` carries no version marker and `run-record.ts` no version field, and no phase spec owns "state-root version", "schema version" or "record version". Meanwhile five phases edit closed-key lists (`ITEM_KEYS`, `RECORD_KEYS`, `FRONTMATTER_KEYS`) and the packet's only compatibility rule is "read a missing field as a default" (008 REQ-008, 006's risk row). That rule covers an additive change and fails a changed meaning, which is exactly 008's `secrets:` case (iteration 6, finding 5): an old record and a new one are indistinguishable except by which keys happen to be present. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:155]

5. **P1 — migration and rollback are mentioned about ten times across fourteen phases and owned by none.** Counting `migrat|rollback|backward|older record|upgrade` per phase spec: 001 one, 002 two, 003 zero, 004 one, 005 one, 006 zero, 007 one, 008 two, 009 one, 010 one, 011 zero, 012 zero, 013 zero, 014 zero. No phase has a migration section, a rollback step or an operator upgrade runbook; the closest is 006's risk row about an older runtime refusing a newer grant. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:194]

6. **P1 — concurrency is handled per phase but never as one rule.** Counting `concurren|lock|restart|crash|interrupt|resume` per phase spec: 002 twenty-six, 005 thirty-four, 006 seventeen, 010 twenty-five, 011 twenty-nine — high exactly where a queue or a lease exists — against 001 two, 003 seven and 008 two. So the phases that own a queue state their rules and the phases that write a shared file do not: 008's index is read-modify-written with no lock (iteration 6, finding 6). Nothing in the packet says which files are single-writer and which need a lock. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md]

7. **P1 — no phase states which of its refusals are pre-dispatch and which are post-dispatch.** `RunExit.refusal` is documented as "Present when the run was refused before dispatch, so a refusal never reads as a failure" (`run-record.ts:137-138`), and `REFUSAL_CAUSES` mixes both kinds — `body-secret` is pre-dispatch, `resume-posture-changed` happens at resume. No phase says which of its new names is pre-dispatch, so a builder cannot tell whether to write `refusal` or `reason`, and the record's own distinction between a refusal and a failure is left to guesswork. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:137] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:123]

8. **P2 — the refusal names are minted in three document layers with no single list.** 008 shows the pattern: a name can appear in a REQ, in edge-case prose, in an acceptance-criteria row or in a goal verification line, and the four do not agree — `secret-too-long` and `secret-store-unreadable` are prose-only (iteration 6, finding 3). A packet-level catalogue would make that impossible, and it is the same artifact that would carry the `class` and the pre-dispatch flag findings 1 and 7 need. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:222]

## Ruled Out
- Reading the packet as having no refusal discipline. It has a typed registry, a frozen exit-code object and a documented table; the gap is that no phase document points at any of them.
- Treating concurrency as unowned. 002, 005, 006, 010 and 011 each state their queue and lease rules in detail; the gap is the shared-file writers, not the queue owners.
- Treating migration as entirely absent. 006's risk row and 008's "read a missing field as a default" are real compatibility rules; they are just not a migration story.

## Dead Ends
- Looking for a packet-level catalogue file: `grep -rln "refusal catalogue|error catalogue|refusal table|exit-code table"` over the packet returns nothing, so the vocabulary lives only in `runner.ts` and in each phase's prose.
- Looking for a state-root or record version field: neither `state-root.ts` nor `run-record.ts` has one, and only 001 mentions "record version" at all, in an unrelated sense.

## Edge Cases
- Ambiguous input: none. The greps are exhaustive over the 14 phase specs.
- Contradictory evidence: none. The code and the docs do not disagree; the docs simply do not cite the code.
- Missing dependencies: none.
- Partial success: none. All five research actions returned evidence.

## Questions Answered
- Does the packet have one refusal catalogue? It has one in code (`REFUSAL_CAUSES`, 25 entries) and none in the documents; no phase cites it.
- Does it have one concurrency and restart rule? No — five phases own their own, and the shared-file writers state none.
- Does it have one migration and rollback rule? No — about ten mentions across fourteen phases, no owner, and no version field to migrate against.

## Questions Remaining
- Which single artifact would close findings 1, 3, 4, 7 and 8 at once, and which phase should own it.
- Whether the packet's ranked expansion plan should put that artifact before or after the per-phase children.

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:113-151
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-143
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts (no version marker)
- .skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md:15
- specs/system-skilled-bots/003-openbot-parity-build/0*/spec.md (all 14, grepped for exit codes, concurrency, migration and refusal names)
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:194
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146, :155, :222

## Assessment
- New information ratio: 0.92
- Questions addressed: whether the packet owns its refusal vocabulary, its concurrency rules and its migration story.
- Questions answered: all three, all negatively.

## Reflection
- What worked and why: grepping the code for the vocabulary before grepping the docs for it. Finding `REFUSAL_CAUSES` and `EXIT_CODES` first turned "the packet has no catalogue" into the sharper and more actionable "the catalogue exists and no phase cites it".
- What did not work and why: one grep over the packet hit a prior lineage's session-chunk JSON and flooded the output. The lesson is to scope greps to `0*/spec.md` rather than the packet root, which the later counts did.
- What I would do differently: count per phase from the start. The per-phase counts are what turned three vague suspicions into findings 5 and 6 with numbers behind them.

## Recommended Next Focus
The ranked per-phase expansion plan: which phases become parents with which children, which single cross-cutting artifact closes the most findings, and what design artifacts the user-facing surfaces still need.
