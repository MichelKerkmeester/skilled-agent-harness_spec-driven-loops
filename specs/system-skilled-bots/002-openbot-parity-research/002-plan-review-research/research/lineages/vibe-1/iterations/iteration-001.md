# Iteration 1: Cross-phase interfaces and order (frontier F-1-003)

## Focus

Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/spec.md, specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer): Cross-phase interfaces and order: does the bots --json output the terminal screen (003) and the channels (011) read match what 001, 002, 006 and 010 promise to emit, and is the build order and dependency list in the parent spec sound?

The narrowest evidence-backed reading of this node is the JSON and answer contracts that cross a phase boundary, plus the parent's phase map. I read the parent spec end to end, then the emitting side (001, 002, 006) and the consuming side (003, 010, 011), and checked each named field against the built runtime. Deferred to later iterations: the security angle of the same contracts (iteration 2+), and 004/005/007/008/009 interfaces.

## Actions Taken

1. Read `specs/system-skilled-bots/003-openbot-parity-build/spec.md` end to end (162 lines) for the phase map, dependency column and Files to Change table.
2. Read the emitting phases' requirement tables: `001-activity-and-actor/spec.md:140-175`, `002-routine-layer/spec.md:109,171`, `006-approval-grants/spec.md:40-140`.
3. Read the consuming phases: `003-terminal-screen/spec.md:1-200` (REQ-001..REQ-015, measured behavior), `003-terminal-screen/plan.md:30-60`, `010-conversations/spec.md:3,31,51,94-96,148-177`, `011-messaging-channels/spec.md:43-53,175-182,281`.
4. Checked each named runtime surface: `.skilled/bin/bots.cjs:31-73` (VERB_SPECS, USAGE), `runtime/lib/status-index.ts:60-80`, `runtime/lib/status.ts:103-114,417`, `runtime/lib/run-record.ts:196-245`, `runtime/lib/needs-you.ts:29-65`, `runtime/lib/delivery.ts:45,135-145`, `runtime/lib/dispatch.ts:45`.
5. Cross-read the answer path in `006-approval-grants/spec.md` against `003-terminal-screen/spec.md` REQ-006/REQ-009 and `011-messaging-channels/spec.md` REQ-007.

## Findings

1. **P1 — the parent spec still describes ten phases while the phase map lists eleven.** The title and description say "Ten build phases" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:3], §3 In Scope says "The ten ranked slices ... one child phase each" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:78], the Files to Change preamble says "the ten phases touch" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:100], and the Handoff Criteria still say "010-conversations closes the program" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:55], while the phase map carries an eleventh row for `011-messaging-channels/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:131]. 011 itself says it "extends the program rather than continuing its order" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43]. **Exact edit**: change `spec.md:3` to "Eleven build phases", `spec.md:78` to "The ten ranked slices ... plus the messaging-channels extension", `spec.md:100` to "the eleven phases touch", and `spec.md:55` to "011-messaging-channels closes the program".

2. **P1 — the parent's Files to Change table omits every 011 surface.** The `bots.cjs` row lists phases "001, 002, 004, 005, 006, 008, 009, 010" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:104], the runtime row says "001-010" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:105], and the `THIRD_PARTY_NOTICES.md` row lists "001, 002, 008, 009, 010" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:109], yet 011 adds a `bots channel` verb group [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:155], five `channel-*.ts` runtime modules [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:137-140] and Apache-2.0 notices for rakazo and turnstone [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:160]. **Exact edit**: append `011` to the phase column of `spec.md:104`, change `spec.md:105` to "001-011", and append `011` to `spec.md:109`.

3. **P1 — 011 lands `operators.json` while the parent's Out of Scope forbids any child from building it, and 011's justification cites a parent edit that was never made.** The parent says "The rest of the small-team model (§12): two roles in one `operators.json` and a shared host at mode 0770. No child builds them; 001 lands the actor field alone" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:94]. 011 decides "yes, the minimal roster" and asserts "the parent's phase-map row records it" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281], but the 011 phase-map row names only "a file-backed identity link" and the 001/006/008/010 dependencies [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:131]. **Exact edit**: replace `spec.md:94` with "The two-role `operators.json` and the shared-host 0770 mode: 001 lands the actor field alone, and 011 lands the minimal `owner`/`members` roster its approver check needs", and add "the `operators.json` roster" to the 011 row at `spec.md:131`.

4. **P1 — three phases define three incompatible grammars for answering one needs-you item.** 003 answers through `bots answer` with free text and binds `y` to `approve`, `a` to `always`, `n` to `deny` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:171], and its overlay draws `1 approve once`, `2 approve always`, `n deny` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:174]. 006 adds `bots answer --scope once|conversation|always|deny` and records the scope on the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:96]. 011 sends "the item's `options`, which the runner fills from the `[OPTION]` lines" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:179]. The runtime does carry `options: string[] | null` on the item [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:38] and the marker exists [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:45], so 011's path is buildable; 003's is not, because `bots answer` accepts no options at all today [SOURCE: .skilled/bin/bots.cjs:73]. Consequences: 003's "approve always" records no standing allow, and 006's `conversation` scope has no surface anywhere. **Exact edit**: add to 003 REQ-003 "the write is `bots answer <item-id> <text> --scope <once|always|deny>`", rewrite 003 REQ-006/REQ-009 to the four scopes, and add to 011 REQ-007 "a chosen option maps to the scope 006 names, and an item with no options gets `once`/`deny`".

5. **P1 — the build order puts the approval overlay (003) before the grant vocabulary (006) and no phase revisits it.** 003 is phase 3 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:123] and 006 is phase 6 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:126]. 010 is the only later phase that edits the crate, and it edits `cli.rs` for chat only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:120]. So the screen's approval path is frozen at pre-006 semantics. **Exact edit**: add a 006 task "Update `crates/bots-tui/src/render/overlay.rs` and `keys.rs` to the four scopes and the `--scope` write", and add `crates/bots-tui` to 006's Files to Change table.

6. **P1 — `bots activity --json`'s row shape is never specified by its producer, but its consumer parses six status values out of it.** 001's REQ-002 promises only "each group carrying its id, its title and its rows" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:144], and its acceptance criterion repeats the same three fields [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:55]. 003 draws "each with one of six markers: `·` running, `✓` done, `✗` failed, `!` needs input, `–` cancelled, `?` stale" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:168] and its AC-005 asserts a done row carries `✓` and `done` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md:43]. Nothing names the row's `state`, `botId`, `at` or `actor` fields. **Exact edit**: extend 001 REQ-002 to "each row carrying `botId`, `identity`, `state`, `at`, `actor` and `runId`", and add the same list to AC-002.

7. **P1 — 001 adds `actor` to the run record without saying where it goes, and the record validator refuses any schema version but 1.** `RunRecord` declares `schemaVersion: 1` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:197] and `validateRunRecord` returns `record-schema-unsupported` for anything else [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:239], while `FIELD_GROUPS` is a closed list of eight groups [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:218]. 001's affected-surfaces table says `run-record.ts` gains "the field, its check and its null default" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:76] but never says top-level or inside `identity`, and never says how a record written before the phase stays readable. A bump to 2 would make every existing record unreadable and `bots status --rebuild` would drop them. **Exact edit**: add to 001's plan "`actor` is a nullable top-level field, `schemaVersion` stays 1, and `actor.vitest.ts` asserts a record written before this phase still validates".

8. **P2 — the routine sentence has no owner.** 002's `--json` is specified to carry "its `what`, rendered starts, `does`, `until`, `untilMetAt`, failure streak and switch state" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171], while 003 draws "the bot id, the four-part routine sentence and the routine's state" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:170]. Neither says who renders the sentence, so 003 re-implements 002's text rendering and the two can drift. **Exact edit**: add `sentence` to 002 REQ-007's field list, or change 003 REQ-007 to "composes the sentence from `what`, `starts`, `does` and `until`".

9. **P2 — the child docs repeat the stale phase count, and 003 calls `bots status --json` a producer of a field it does not emit.** 003's metadata says "Phase 3 of 10" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:31]. 003's plan names `bots status --json` as "Producer of the header's bot count and staleness flag" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:85], but the payload is `{indexPath, builtAt, stale, staleIdentities, rows, duplicateRoots, notes}` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:417] — the staleness flag exists, the bot count is a count of `rows` where `kind` is `bot`. **Exact edit**: change `003-terminal-screen/spec.md:31` to "Phase 3 of 11", and change `003-terminal-screen/plan.md:85` to "Producer of the header's staleness flag and the rows the bot count is counted from".

## Questions Answered

- Does the `bots --json` output the terminal screen reads match what 001 and 002 promise to emit? **Partly.** The group envelope matches; the row object does not (finding 6), and the routine sentence has no owner (finding 8).
- Is the build order and dependency list in the parent spec sound? **No.** The order is sound for 001→002→003 and for 008→011, but 003 builds the approval surface before 006 defines the grant and nothing revisits it (finding 5), and the parent's own phase count, handoff criteria and Files to Change table are stale for 011 (findings 1, 2).

## Questions Remaining

- Do 004, 005, 007, 008 and 009 agree with 001 on the run-record and status-index shapes they extend?
- Does 011's `operators.json` roster conflict with 001's actor precedence, and who may approve from a channel versus the terminal?
- Are the test and verify commands in each phase runnable in this checkout (cargo, vitest, jq)?

## Ruled Out

- Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle.
- Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent.

## Dead Ends

- Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document.

## Edge Cases

- Ambiguous input: the node names four producers (001, 002, 006, 010) and two consumers (003, 011). I read the answer contract as the narrowest shared surface and deferred 004/005/007/008/009 to later iterations.
- Contradictory evidence: 011 asserts the parent's phase-map row records the roster; the row does not. Both are cited (finding 3) and the parent text is treated as the stale side, because 011's need is concrete and its reasoning is sound.
- Missing dependencies: none. Every runtime path cited resolved.
- Partial success: none. All five planned reads completed.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/spec.md:3,55,78,94,100,104-109,119-131
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:140-175
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:40-80
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/acceptance-criteria.md:55
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:109,171
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:31,85,160-200
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:30-60,85
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md:43
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:40-140
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:120,148-177
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43-53,137-160,175-182,281
- .skilled/bin/bots.cjs:31-73,455-462
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:60-80
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114,417
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:196-245
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-65
- .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:45,135-145
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:45

## Assessment

- New information ratio: 1.0
- Questions addressed: the two questions the frontier node asks (JSON contract match; build order soundness)
- Questions answered: both, with the qualifications in findings 6, 8 and 5

## Reflection

- What worked and why: reading the producer's requirement table beside the consumer's requirement table, then checking the named field in the runtime, turned three vague "do they agree" questions into exact line-level mismatches. The runtime is the tiebreaker, and it settled 011's `options` claim in 011's favour and 003's `--scope` gap against 003.
- What did not work and why: grepping for `--scope` across all eleven phases returned nothing outside 006, which first looked like a missing dependency rather than a missing consumer. The cause is that 003 and 011 were written before 006 existed, so neither could cite it.
- What I would do differently: read the parent's phase map first and diff it against the folder list before reading any child, because the stale count and the missing 011 rows are visible in one pass and colour every later reading.

## Recommended Next Focus

The answer-contract conflict (findings 4 and 5) is the one that blocks a build: 003 and 011 both ship an approval surface that cannot express 006's scope. The next iteration should take the security and failure-mode angle on the same surface — who may approve from a channel versus the terminal, what a replayed press does, and whether the grant survives a restart — because that is where the three grammars actually diverge in behaviour.
