# Iteration 5: Record and field shapes — `RunRecord`, `NeedsYouItem`, `RunSummary`, `BotDefinition` (angle 1)

**Iteration**: 5 of 13
**Focus**: Angle 1 at the shape layer — do the record and field shapes each plan assumes match the runtime's actual types, and do the new fields have a named home?

## Focus

Iteration 4 proved every named file and symbol exists. This pass read the four interfaces the phases extend — `RunRecord`, `NeedsYouItem`, `RunSummary` and `BotDefinition` — against each phase's requirement text, looking for a field that is named in one doc and unnamed, misplaced or contradicted in another.

## Actions Taken

1. Read `run-record.ts:123-205` for `HonoredPosture`, `RunRecord`, `EvidenceLocations` and `WorktreeEvidence`.
2. Read `needs-you.ts:20-70` for `NeedsYouItem`, `NeedsYouAnswer` and the `ITEM_KEYS` validator list.
3. Read `definition.ts:40-110` for `BotDefinition`, `Posture` and `FRONTMATTER_KEYS`.
4. Read `status-index.ts:266-300` for `summarizeRecord` and the `RunSummary` field set.
5. Read phase 004's REQ-001 to REQ-007 for the `lastRun.branch` and `lastRun.worktreePath` names.
6. Read phase 005's REQ-007 to REQ-009 and its plan's rollback note for the memory-proposal item fields.
7. Read phase 001's plan description and file table for the run-record actor field name.

## Findings

1. **P1 — Phase 005's memory-proposal item contradicts itself on the proposing bot, and the runtime's `holdForBot` has no kind filter to resolve it.** REQ-007 says the item carries "the type, the fact and the proposing bot" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150], REQ-008 appends the confirmed fact "to the proposing bot's file" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151], and REQ-009 says the item "holds no bot and awaits no resume, so `holdForBot` and `itemAwaitingResume` ignore it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152]. The runtime's `holdForBot` selects by `botId` and open state only, with no kind check [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:287]. So either the item carries the proposing bot's id — and then `holdForBot` holds that bot, contradicting REQ-009 — or it carries no id, and REQ-008 cannot find the file to append to. **Exact edit**: in `005-memory/spec.md` REQ-009 replace the sentence with "A `memory-proposal` item carries the proposing bot in `proposalBotId` and a `kind` of `memory-proposal`, and `holdForBot` and `itemAwaitingResume` skip an item whose `kind` is `memory-proposal`", and change REQ-008's "the proposing bot's file" to name `proposalBotId`.
2. **P2 — Phase 005's REQ-007 names no item field for the type, the fact or the bot.** The requirement says the item carries them but never names a key [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150], while the plan's rollback note refers to an item "carrying `kind`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:150]. The `NeedsYouItem` validator is an explicit key list [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51], so an unnamed field cannot be added. **Exact edit**: name the keys in REQ-007 — `kind: "memory-proposal"`, `memoryType`, `fact` — and add all three to the phase's `needs-you.ts` file-table row and to the `ITEM_KEYS` change it describes.
3. **P2 — Phase 001 calls the run-record field `by:` in its plan description and `actor` everywhere else, and never names its field group.** The plan's description says the phase "extends the needs-you item and the run record with a `by:` field" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:3], while REQ-005 says every run record carries `actor` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:147] and the file table says `run-record.ts` gains `actor` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:77]. `RunRecord` is eight named groups [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:218], and a top-level `actor` would sit outside all of them. **Exact edit**: change the plan description to `actor` and add one sentence to REQ-005 naming the group — "`actor` sits in `identity`" (or `request`) — so the validator, the index column and the JSON reader agree on one path.

## Ruled Out

- **Treating `RunSummary`'s new fields as unnamed.** Phase 004's REQ-005 names `lastRun.branch` and `lastRun.worktreePath` in the JSON, and REQ-006 says the two fields ride in `RunSummary` from the record's evidence [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147]. The data already exists in `EvidenceLocations.branch` and `EvidenceLocations.worktreePath` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:155], so the phase surfaces it without a new record field. Verified as consistent.
- **Treating the `BotDefinition` key additions as a collision.** `FRONTMATTER_KEYS` holds thirteen keys today [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:92], and the four phases that add a key each add a distinct one — `routine` (002), `memory` (005), `apps` (007) and `skills` (009). Phase 008 adds none, because `secrets` already exists as `Posture.secrets` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57]. Verified as consistent.
- **Treating `HonoredPosture` as an open key bag.** The record validator checks group presence and named fields and never enumerates the posture keys [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240], so 007's and 008's additive fields need no validator change; that was already ruled in during iteration 3 and still holds.
- **Treating the needs-you key list as automatically extensible.** It is not — `ITEM_KEYS` is an explicit array [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51] — which is why phases 001 and 006 both say they update it, and why Finding 2 matters.

## Dead Ends

- Reading the interface alone cannot find a semantic contradiction: `NeedsYouItem` has no `kind` field today, so the 005 conflict only appears when the requirement text is read against `holdForBot`'s selector. Shape review needs the reader, not just the type.

## Edge Cases

- **Ambiguous input**: "the shapes it assumes" was read as the four interfaces the eleven phases extend, plus the JSON keys the terminal and channels consume. The request-queue and delivery records were not re-read this iteration; they were covered by iteration 2's failure-mode pass.
- **Contradictory evidence**: Finding 1 is an internal contradiction in one phase, not between two phases. It is reported as such, with both sides cited.
- **Missing dependencies**: none.
- **Partial success**: none.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123, :155, :202, :240
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24, :48, :287
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:57, :92
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:266
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:3, :77
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:147
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150, :151, :152
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:150
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 1, record and field shape layer
- Questions answered: the four extended interfaces accept every planned addition except phase 005's memory-proposal item, which contradicts itself on the proposing bot and leaves its fields unnamed; phase 001's run-record field name is inconsistent in one place and its group is unnamed.

## Reflection

- **What worked and why**: Reading `holdForBot`'s selector against REQ-009 turned a wording quibble into a design contradiction. The selector is three lines long and decides the question; the requirement text alone could be read charitably.
- **What did not work and why**: The first pass looked only at the interfaces and found nothing, because an interface cannot show a semantic conflict. The reader function is where the meaning lives.
- **What I would do differently**: For each new item field, read the function that will select or filter on it before accepting the requirement's wording.

## Recommended Next Focus

Take angle 2's build-order half: for each phase, check that every file it modifies is owned by an earlier phase or already exists, and that no two phases claim the same edit to the same line region in a way that forces a merge decision. The record-shape layer is now covered; the edit-order layer is not.
