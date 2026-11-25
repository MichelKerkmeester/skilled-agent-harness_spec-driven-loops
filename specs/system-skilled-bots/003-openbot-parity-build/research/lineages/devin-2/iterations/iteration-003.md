# Iteration 3: Shared records, second pass — tasks, acceptance criteria, state-root and posture (frontier node F-1-002)

**Iteration**: 3 of 13
**Focus**: Frontier node F-1-002, second pass. Iteration 1 compared the specs and plans; this pass follows the same shared records into `tasks.md`, `acceptance-criteria.md`, the parent phase map, the state-root folder list and the `HonoredPosture` validator, and closes the records iteration 1 left open (memory files, state-root layout, acceptance criteria).

## Focus

The node's seven record families were each checked at the layer where a build gate lives. A conflict that only exists in prose is a documentation defect; a conflict that reaches a `tasks.md` verify command or a `[P0]` checklist row is a build gate. This pass looked specifically for the second kind, and for the dependencies the parent phase map asserts.

## Actions Taken

1. Read `001/tasks.md`, `004/tasks.md` and `004/acceptance-criteria.md` for every `SCHEMA_VERSION` assertion.
2. Read `003/acceptance-criteria.md` and `006/acceptance-criteria.md` for the answer-scope path.
3. Read `011/acceptance-criteria.md` and `011/tasks.md` for the roster and approver check.
4. Read `state-root.ts:100-145` for the actual shared and identity folder lists.
5. Grepped every phase's state-root file-table row to compare the folder each phase adds.
6. Read `run-record.ts:123-128` and `:240-247` to test phase 007's "validator unchanged" claim and phase 008's backward-compatibility claim.
7. Read the parent phase map (`spec.md:117-132`) against each phase's declared predecessor.

## Findings

1. **P0 — The `SCHEMA_VERSION` contradiction is encoded in phase 004's task list and a `[P0]` checklist gate, so it blocks phase 004 rather than merely confusing a reader.** Phase 001's task list records the pre-state as `'2'` and then bumps it: T001 prints `const SCHEMA_VERSION = '2';` and T012 requires `const SCHEMA_VERSION = '3';` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:36] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:54]. Phase 004's task list asserts `'2'` three times: T007 reads it, T030 is titled "Prove no schema version moved", and CHK-011 is a `[P0]` row that requires `'2'` "so no index needs a rebuild" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:49] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:86] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:141]. The runtime makes the consequence concrete: `openIndex` throws `schema version <n> is not <current>` when the stored value differs [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253], so after 001's bump an existing index is not merely un-bumped, it is unreadable until rebuilt. **Exact edit**: in `004-computer-exposure/tasks.md` change T007, T030 and CHK-011 to expect `'3'`, retitle T030 "Prove no second schema version moved", and add a rebuild note; alternatively remove the bump from `001/tasks.md:54` and carry `actor` in the existing JSON row the way 004 carries `RunSummary`.
2. **P2 — The parent phase map misstates phase 002's dependency.** The map says phase 2 depends on "001, whose run rows the fatigue switch counts" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122]. Phase 002's plan instead puts the fatigue count in a per-bot state file, `routines/<bot-id>.json`, owned by `routine-state.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:30] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62], and its `bots routines` verb reads that state file rather than the index [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171]. Either the dependency cell or the design is wrong, and a reader scheduling the build cannot tell which. **Exact edit**: replace the row-2 dependency cell with "001, whose needs-you item the fatigue switch raises" if the design is right, or move the count into the status index if the map is right; in either case state the choice in `002-routine-layer/plan.md` `routine-state.ts`.
3. **P2 — Actor names have no comparison rule shared by phase 001 and phase 011.** Phase 001 fills an answer's `by` from `--as <name>` when given and the OS user otherwise, with no normalization rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146]. Phase 011 admits a channel answer when the sender's actor is "named `owner` or listed in `members` in `operators.json`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177], and its acceptance row repeats the check without saying how two names are compared [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:58]. `Alice`, `alice` and `alice ` are three different strings, so a roster that a human wrote will not match an actor the OS resolved. **Exact edit**: add to 001 REQ-004 "the actor is trimmed and compared case-insensitively" (or "compared exactly after trim") and add the same sentence to 011 REQ-005, with one acceptance row in each phase that answers with a differently-cased name.

## Ruled Out

- **Treating phase 007's "validator unchanged" claim as wrong.** `validateRunRecord` checks the eight field groups' presence and a fixed set of named fields, and never enumerates `HonoredPosture`'s keys [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:240]. Adding `apps` and `secretsUsed` therefore needs no validator change, and an older record still validates. Both 007 and 008 are correct; recorded as a verified strength.
- **Treating the state-root folders as a collision.** The runtime's shared level holds `index`, `registered-roots` and `authority`; the identity level holds `requests`, `leases`, `switches`, `needs-you`, `records`, `installs` and `receipts` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117]. The phases add `routines` (002), `memory` at both levels (005), `secrets` (008), `proposals` (009), `conversations` (010) and `channels` (011) — seven distinct names, each through `state-root.ts`, with no shared file name. Verified as consistent.
- **Treating phase 010's dependency on 003 as a build-order defect.** The phase map says 003 gains its chat pane in 010, and 010 replaces the phase 003 placeholder [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155]; the placeholder is explicit in 003's requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:164]. The handoff is deliberate and stated on both sides, not a conflict.

## Dead Ends

- Comparing acceptance-criteria files row by row for every record produced no new conflict: the four contested contracts are absent from the acceptance rows and live only in `tasks.md` and `plan.md`. The acceptance layer is thinner than the task layer, which is itself worth knowing: a phase can pass its AC table and still fail a task verify.

## Edge Cases

- **Ambiguous input**: "every conflict between two phases" was read as every conflict on the seven named record families, not every conflict in the packet. All seven were checked at spec, plan, task and acceptance layer; unrelated conflicts (delivery, channels, terminal) are other iterations' scope.
- **Contradictory evidence**: Finding 1 is a four-way contradiction (001 spec/plan/tasks vs 004 spec/plan/tasks vs the runtime constant vs the runtime open check). Both sides are cited; the runtime proves the consequence, not which side is intended.
- **Missing dependencies**: none.
- **Partial success**: none; the pass completed.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:36, :54
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:146
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:30, :62
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:171
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:164
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md:44
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:49, :86, :141
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/acceptance-criteria.md:58
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:155
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/acceptance-criteria.md:58
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:117-132
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123, :240
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 0.83
- Questions addressed: F-1-002 (all seven record families, now at task and acceptance layer)
- Questions answered: F-1-002 — the conflict list is complete for the named record families: four conflicts (SCHEMA_VERSION, terminal scope, `operators.json` scope and write path, phase-count metadata) plus three smaller gaps (bot-message `by`, actor normalization, phase-map dependency), with state-root layout, memory files and `HonoredPosture` verified consistent.

## Reflection

- **What worked and why**: Following a prose conflict into `tasks.md` changed its severity. The same contradiction that read as a documentation slip in iteration 1 is a `[P0]` gate in phase 004's checklist, and the runtime's schema check proves why. Severity should be assigned from the gate that enforces the claim, not from where the claim is written.
- **What did not work and why**: The acceptance-criteria sweep assumed the AC tables would encode the contracts; they do not. The task lists and plans are the load-bearing layer for this packet.
- **What I would do differently**: Start the next severity pass from `CHK-` rows, because a `[P0]` checklist row is where a wrong claim does the most damage.

## Recommended Next Focus

Move to the plan-versus-runtime angle: take the verify commands from each phase's `tasks.md` and run the cheap ones (the `rg`, `node bots.cjs` and `vitest --list` forms) to see which are runnable here today and which name a symbol, file or verb that does not exist. That is the largest untouched angle and it tests the same records this node covered.
