# Iteration 5: The needs-you item's key set and its five writers

## Focus
Frontier node F-2-007 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts, phases 001/005/006/009/010): Which phases must change when the needs-you item gains grants, kind, conversationId and proposal fields, and is the closed ITEM_KEYS list a single-writer contract or a per-phase one?

## Actions Taken
1. Read `ITEM_KEYS` and `validateNeedsYouItem` in `needs-you.ts` to establish the closed allowlist and its `unknown-key` refusal.
2. Read the parent spec's "Shared Records" table, which assigns one owner per record more than one phase writes.
3. Read the four phases' additions: 001 (`kind` key, `by` and `scope` on the answer), 005 (`kind` values plus three proposal fields), 006 (`grants` and its nested `kind`), 009 (the `skill-proposal` value), 010 (`conversationId` on two closed lists).
4. Grepped the packet and the prior research for `ITEM_KEYS` to separate what is already known from what is still open.
5. Re-read 006's grant schema to test whether the two `kind` vocabularies collide.

## Findings
1. **P1 — The Shared Records table assigns `kind` to 005 and `grants` to 006 but never lists the final `ITEM_KEYS` set, so four of the six additions have no owner row.** The table's rows cover the item's `kind` and `grants` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:127-128] and the inbox item's ten printed fields [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:126], but not `conversationId` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170], not `proposalType`, `proposalFact` and `proposalBotId` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:167], and not `by` and `scope` on the answer [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:158]. Closing artifact: one row in the Shared Records table titled "needs-you item key set" listing all eighteen keys with the owning phase per key, plus the same for the answer object.
2. **P1 — `ITEM_KEYS` is a single-writer contract in code and a five-writer contract in the packet, and no artifact says which.** The array is closed and `validateNeedsYouItem` refuses any unknown key with `unknown-key` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-64] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:97-98], while 001 adds `kind` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:112], 005 adds three proposal fields and the `kind` values [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:116], 006 adds `grants` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:94], 009 adds the `skill-proposal` value [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:123] and 010 adds `conversationId` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170]. Closing artifact: a Phase Transition Rule naming `needs-you.ts` as a serial merge point beside `definition.ts` and `state-root.ts`, and the final key list in the Shared Records table.
3. **P1 — The `kind` collision is only half-closed: the table gives the item's `kind` values to 005, but 006's `grants` object carries its own `kind` with a different vocabulary.** The item's `kind` is `decision`, `memory-proposal` or `skill-proposal` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:127], while `grants.kind` is `pay`, `credentials`, `delete`, `send`, `share`, `post` or `other` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:149]. A reader of one JSON payload sees two `kind` keys with disjoint vocabularies and no rule to tell them apart. Closing artifact: rename the nested one to `grants.actionKind` in 006 REQ-001, or state both vocabularies in the contracts file.
4. **P1 — `conversationId` is added to two closed key lists in one change and only one of them has an owner row.** 010 REQ-012 says it adds `conversationId` to `ITEM_KEYS` and to `RECORD_KEYS` and to the two validators in the same change [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170], and `RECORD_KEYS` is the request record's closed list [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:190], which the Shared Records table never mentions. Closing artifact: a Shared Records row for the request record's key set, owned by 010, with the final list.
5. **P2 — The answer object's key set is not in the table either, though 001 changes it.** The table's inbox row lists `answer` as one field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:126], and 001 adds `by` and `scope` inside it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:158] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:166], so the object's four keys (`text`, `answeredAt`, `by`, `scope`) appear in no single place. Closing artifact: one row for the answer object, which also closes iteration 1's nullability finding.
6. **P1 — The table's ownership rule is contradicted by its own `kind` row: 001 lands the key while 005 owns the values, so a non-owner writes the shape decision.** The rule reads "The owner fixes the shape; every other phase reads it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122], and the `kind` row then says "001 lands the key in `ITEM_KEYS` and 009 adds its value" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:127]. A builder of 001 must decide whether to write the validator branch for a key whose values it does not own, and a builder of 005 must decide whether to re-write the key. Closing artifact: state that the owner writes both the key and its validator branch, and the landing phase only reads it — or move the key into 005's change.
7. **P2 — Correction to iteration 3: the packet does have a shared ownership document, so that finding was too broad.** The Shared Records table exists and assigns eleven records to owners [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:120-140]; iteration 3's finding 1 said no shared architecture doc exists, which is true for the module map and the import edges but false for record ownership. The narrower gap is that the table names owners and not final contents, which is what findings 1, 4 and 5 close.

## Ruled Out
- Re-raising the `kind` collision as an unknown: the prior research already found it and the parent's Shared Records table already assigns the values to 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577], so the open part is the nested `grants.kind`, not the top-level one.
- Treating the landing order as the fix: the phases land 001, 005, 006, 009, 010 in numeric order, but order cannot reconcile two vocabularies or supply a missing key list.
- Looking for a generated schema of the item: no schema file exists (iteration 1), so the table is the only ownership artifact.

## Dead Ends
- The `unknown-key` refusal is not the problem: it is the mechanism that makes the closed list safe, and it works. The problem is that five phases edit the list without one target.
- 009's addition is a value rather than a key, so it does not widen the array; only 001, 005, 006 and 010 do.

## Edge Cases
- Ambiguous input: "which phases must change" could mean which phases edit the file or which phases must change their own docs. Selected interpretation: both, with the file editors named first and the doc changes named in the closing artifact. Deferred: the exact diff per phase, which belongs to the contracts phase.
- Contradictory evidence: iteration 3's finding 1 versus the Shared Records table is a genuine contradiction between two of this lineage's own artifacts; finding 7 records the correction and narrows the earlier claim rather than deleting it.
- Missing dependencies: none.
- Partial success: none.

## Questions Answered
- Which phases must change when the item gains `grants`, `kind`, `conversationId` and the proposal fields? 001 (the `kind` key and the answer's `by`/`scope`), 005 (the `kind` values and three proposal fields), 006 (`grants` and its nested `kind`), 009 (the `skill-proposal` value), 010 (`conversationId` on `ITEM_KEYS` and `RECORD_KEYS`), plus the parent spec's Shared Records table for the ownership rows.
- Is `ITEM_KEYS` a single-writer contract or a per-phase one? In code it is single-writer (one array, one validator); in the packet it is five-writer, and the Shared Records table assigns only two of the six additions.

## Questions Remaining
- Does 006 accept `grants.actionKind`, or does the item's top-level `kind` get renamed instead?
- Should the final key list live in the Shared Records table or in `contracts/needs-you-item.schema.json`?

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-64, 97-98
- .skilled/skills/system-skilled-bots/runtime/lib/request-record.ts:190
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:100-140
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:112, 158, 166
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:116, 167
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:94, 149
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:123
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:170
- specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577, 589

## Assessment
- New information ratio: 0.86
- Questions addressed: the F-2-007 node question (which phases change, and the writer model)
- Questions answered: both parts

## Reflection
- What worked and why: reading the parent spec's Shared Records table before the phase docs turned the question from "who writes this" into "which rows are missing", which is a much smaller and more actionable gap.
- What did not work and why: grepping the prior research for `ITEM_KEYS` returned a large volume of already-settled findings; the useful part was one row, and the rest cost context.
- What I would do differently: read the parent spec's Shared Records table first in every iteration that touches a shared record, because it is the packet's own answer to the ownership question and it is easy to miss.

## Recommended Next Focus
The unreviewed phases: 007-per-bot-apps, 008-vault, 009-skills, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review. The Shared Records table should be the spine of the synthesis: it is the packet's best cross-cutting artifact and every remaining gap is a missing row in it or a missing file beside it.
