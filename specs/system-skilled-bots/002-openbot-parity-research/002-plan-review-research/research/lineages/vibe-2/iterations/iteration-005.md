# Iteration 5: Cross-phase consistency — the shared records disagree in five places

## Focus

Frontier node F-2-006 (depth 2): "Cross-phase consistency: do the eleven phases agree on the shared records (`by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields, `bots --json` output) and is the build order and dependency graph sound?"

This iteration compares the record shapes each phase writes and reads. It found that the two phases that share a file disagree on every field name, that a channel approval drops the grant scope the terminal approval records, that four `--json` surfaces ship four shapes with no version, and that two phases extend `HonoredPosture` without a schema version.

## Actions Taken

1. Read the message-record requirements of phases 010 and 011 and compared them field by field.
2. Read phase 006's grant requirements against phase 011's approval requirements.
3. Read the `--json` requirements of phases 001, 002, 010 and 011 against phase 003's consumption of them.
4. Read the actor field names across phases 001, 010 and 011.
5. Read `run-record.ts`'s `schemaVersion` guard and `HonoredPosture` shape against phases 007 and 008's additions, and listed every phase that modifies `state-root.ts`.

## Findings

1. **Phase 011's terminal transport cannot reuse phase 010's conversation file: the two message shapes disagree on every field name.** Phase 010's message record is `schemaVersion`, `id`, `conversationId`, `botId`, `role`, `text`, `at`, `runId` and `by` (`010-conversations/spec.md:150`). Phase 011's inbound message is `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation`, `sender`, `text` and `raw` (`011-messaging-channels/spec.md:174`). Phase 011 says the terminal transport "reuses phase 010's conversation JSONL and `bots chat`" (`011-messaging-channels/spec.md:55`), but a record written in 011's shape has no `schemaVersion`, no `role`, no `botId` and no `runId`, so 010's reader would skip it as a torn or unknown line. **Severity P1.** Fix: in `011-messaging-channels/spec.md` §4, state that the inbound and outbound shapes are transport-level and are converted to 010's message record before any append, and add one acceptance row that a terminal-transport message read back through `bots chat --transcript --json` carries 010's nine fields.

2. **A channel approval records no grant scope, so the same item answered from the terminal and from chat produces two different records.** Phase 006 adds `grants` to the needs-you item with "the scope the answer granted" and `bots answer --scope once|conversation|always|deny` (`006-approval-grants/spec.md:94-99`). Phase 011 puts "Phase 006's `grants` field and ladder" out of scope (`011-messaging-channels/spec.md:53`) and its approval requirement checks only the actor against `operators.json` (`011-messaging-channels/spec.md:177`). An operator who answers from chat therefore records no scope, and the resumed run's prompt names no granted scope. **Severity P1.** Fix: delete the Out of Scope line at `011-messaging-channels/spec.md:53` and add a requirement that a channel answer passes `--scope` through `bots answer`, defaulting to `once` when the reply grammar carries no scope word.

3. **Four `--json` surfaces ship four shapes with no version field, and the terminal screen must parse all of them.** Phase 001's `activity --json` prints groups carrying "its id, its title and its rows" (`001-activity-and-actor/spec.md:144`); phase 002's `routines --json` prints a list carrying `what`, starts, `does`, `until`, `untilMetAt`, failure streak and switch state (`002-routine-layer/spec.md:171`); phase 010's `chat --transcript --json` prints "the messages as a JSON array" (`010-conversations/spec.md:153`); phase 011's `channel list --json` prints "the same as" the text form (`011-messaging-channels/spec.md:196`). Phase 003 consumes three of them (`003-terminal-screen/spec.md:43`). None carries a version, so a later change to one shape breaks the screen silently. **Severity P1.** Fix: add one requirement to `001-activity-and-actor/spec.md` §4 defining a shared envelope — `{"schemaVersion": 1, "kind": "<verb>", "items": [...]}` — and have `002-routine-layer/spec.md`, `010-conversations/spec.md` and `011-messaging-channels/spec.md` cite it instead of describing their own shape.

4. **The actor has three names across the phases: `by`, `actor` and `sender`.** Phase 001 records `by` on the needs-you answer and `actor` on the run record (`001-activity-and-actor/spec.md:146-147`); phase 010 records `by` on a conversation message (`010-conversations/spec.md:150`); phase 011 records `sender` on an inbound message (`011-messaging-channels/spec.md:174`). A reader that wants "who did this" has to know which of the three applies. **Severity P2.** Fix: name the resolved actor `by` in every record, and make `sender` the transport-level chat id that resolves to `by` before the record is written; state the mapping once in `011-messaging-channels/spec.md` §4.

5. **Two phases add fields to `HonoredPosture` without a schema version bump, so a reader cannot tell "declared none" from "written before the field existed".** `RunRecord.schemaVersion` is the literal `1` and `validateRunRecord` rejects any other value with `record-schema-unsupported` (`run-record.ts:197,239`); `HonoredPosture` holds `isolation`, `sandbox`, `executorKind` and `model` (`run-record.ts:123-128`). Phase 007 adds `apps` and says to record `[]` when the bot declares none (`007-per-bot-apps/spec.md:100`); phase 008 adds `secretsUsed` (`008-vault/spec.md:98`). Neither mentions the version, so a record written before 007 has no `apps` and reads identically to a bot that declared none. **Severity P1.** Fix: in `007-per-bot-apps/spec.md` §4, bump `schemaVersion` to `2` and make `validateRunRecord` accept `1` and `2`, treating a missing `apps` on a version-1 record as `null` (unknown) rather than `[]`; have `008-vault/spec.md` add `secretsUsed` under the same version.

6. **Five phases modify `state-root.ts`, a second merge hotspot beside `definition.ts`.** Phases 002, 005, 008, 010 and 011 each add a folder or a path helper to the same module (`002-routine-layer/spec.md:129`, `005-memory/spec.md:113`, `008-vault/spec.md:119`, `010-conversations/spec.md:115`, `011-messaging-channels/spec.md:141`). The parent's phase map orders them serially, but no plan names the module as a shared merge point. **Severity P2.** Fix: extend the Phase Transition Rule proposed in iteration 2 finding 6 to name both `definition.ts` and `state-root.ts` as shared merge points, and add the `state-root.ts` row to each of the five plans' AFFECTED SURFACES tables.

## Verified Correct

- **The build order's dependency column is sound for the ten research slices.** Each phase's stated dependency is the phase that writes the record it reads: 002 on 001's run rows, 003 on 001 and 002's `--json`, 004 on 001's run records, 005 on 001's item, 006 on 001's item and inbox, 007 on 001's posture, 008 on 007's per-run config, 009 on 001's item, 010 on 001's run records (`spec.md:118-133`). No phase depends on a phase that comes after it.
- **Phase 011's dependency list is complete for its own scope.** It names 001 (the actor a link resolves to), 006 (the grant an approval carries), 008 (the vault) and 010 (the chat the terminal transport reuses) (`spec.md:134`), which covers every record it reads.
- **The memory and skills prompt order does not conflict.** Phase 005 prepends memory "shared first" (`005-memory/spec.md:97`) and phase 009 loads skills "after the standing body" (`009-skills/spec.md:167`), so the assembly order is memory, body, skills, with no phase claiming the same slot.

## Questions Answered

- F-2-006 in part: the shared records are compared and five disagreements are recorded; the build order and dependency graph are sound for the ten research slices.

## Questions Remaining

- Security and failure modes. (F-2-007)
- Which planned surfaces duplicate the runtime, ranked by build time saved? (F-2-008)
- Which runtime modules more than one phase modifies, and in what order must they land? (F-2-009)

## Ruled Out

- **Treating the `by`/`actor` split as a defect.** Phase 001 uses `by` on an answer and `actor` on a run record deliberately: the answer is a person's act and the run record is a run's attribution. Only the third name, `sender`, is a defect.
- **Treating phase 011's dependency on 006 as satisfied by the phase map alone.** The map names 006, but 011's own Out of Scope block removes the grant it depends on, which is why finding 2 is a defect rather than a documentation gap.
- **Reading phase 010's `--json` array as an envelope.** It is a bare array, which is the shape most likely to break a consumer when a field is added; that is why finding 3 asks for an envelope rather than a version field on the array.

## Dead Ends

- **Looking for a shared JSON envelope in the runtime.** `bots status --json` prints its own shape and no module defines a common wrapper, so the envelope has to be introduced by a phase rather than reused.
- **Looking for a `schemaVersion` bump in any phase.** No phase mentions `RunRecord.schemaVersion`; only 010's conversation record carries its own `schemaVersion`, which is a different record.

## Edge Cases

- **Ambiguous input:** "shared records" could mean only the files two phases write, or every record any phase writes. This iteration used the first reading for findings 1, 2 and 5 and the second for findings 3 and 4, and says which in each.
- **Contradictory evidence:** phase 011 claims to reuse 010's conversation file and defines a shape that cannot be read by 010's reader. Both are cited; finding 1 records the shape as the defect because 010 owns the file.
- **Missing dependencies:** none.
- **Partial success:** none.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:144-147`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:129,171`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:43`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:97,113`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:94-99`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:100`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:98,119`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:167`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:115,150,153`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:53,55,141,174,177,196`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:118-134`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128,197,239`

## Assessment

- New information ratio: 0.92 (5 fully new findings, 1 partially new because it extends the iteration-2 merge-hotspot finding)
- Questions addressed: F-2-006
- Questions answered: F-2-006 in part

## Reflection

- **What worked and why:** comparing the two phases that share a file field by field, rather than reading each phase's own description, is what exposed the conversation-shape conflict. Each phase's description is internally consistent; only the pair is not.
- **What did not work and why:** the first pass looked for a shared `--json` envelope in the runtime and found none, which briefly read as "no contract needed". The contract is needed precisely because none exists, and the four shapes are the evidence.
- **What I would do differently:** list every record a phase writes and every record it reads, then intersect the lists across phases. The intersection is where the conflicts are, and it is a smaller set than the union.

## Recommended Next Focus

F-2-007, security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, and routine `until` and fatigue edge cases.
