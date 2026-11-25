# Iteration 10: Phase handoff criteria — is each exit an observable state the next phase can test? (angle 2)

**Iteration**: 10 of 13
**Focus**: Angle 2's remaining half — each phase declares a handoff that the next phase depends on. Does every handoff name an observable state the next phase's setup step can test, and does any handoff claim a dependency that does not exist or contradict the phase's own change?

## Focus

A handoff is the contract between two phases. It has to be observable (a command, a record, a file), true after the phase's own change, and honest about what the next phase actually consumes. This pass read all eleven handoff rows against the phase's own requirements, the next phase's setup, and the runtime's behavior where the handoff names a command.

## Actions Taken

1. Extracted all eleven `Handoff Criteria` rows.
2. Read `status.ts` for what `bots status` does when an index's schema version differs from the code's.
3. Read phase 008's handoff against phase 009's requirements for the secret grammar and refusal ids.
4. Read phase 006's `grants.rung` enum against its doc requirement and its handoff.
5. Read phase 007's handoff against phase 008's scope for the per-run config.

## Findings

1. **P0 — Phases 001 and 004 both hand off an index that must open across the schema change, and the runtime refuses exactly that.** Phase 001's handoff requires "`bots status` still reads an index built before the schema bump" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:30], and phase 004's requires "an index built before the change still opens without `--rebuild`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:32]. The runtime's `openIndex` throws `schema version <n> is not <current>` when the stored value differs [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253], and `status.ts` turns that into `index-unreadable` with the hint `run bots status --rebuild` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:323] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:350]. With 001's bump to `'3'`, an index written at `'2'` cannot open without a rebuild, so both phases fail their own exit criteria. **Exact edit**: either drop the bump from 001 and carry `actor` as a JSON row field (the iteration 3 fix), or rewrite both handoffs to "`bots status --rebuild` rebuilds an index built before the bump and prints its rows" and add that rebuild to each phase's acceptance table.
2. **P2 — Phase 008's handoff invents a dependency on phase 009 that phase 009 does not have.** The handoff says "009 reads the `secrets` name grammar and the store's refusal ids, and nothing else passes between the two" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:32]. Phase 009 never mentions the secrets name grammar, `secret-name-invalid` or `secret-unknown`; it reuses the existing literal detector for its proposal check [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:169]. A false handoff makes 009 responsible for testing 008's refusals and hides the fact that the two phases are independent. **Exact edit**: replace the second sentence with "nothing passes between 008 and 009; 009 reuses the existing literal detector, not the store."
3. **P2 — Phase 006's `grants.rung` enum has five values while its doc and handoff name four rungs.** REQ-001 allows `rung` to be `kind`, `rule`, `auto-review`, `extra-vigilant` or `bot` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145], while REQ-009 and the handoff require the doc to name "the four rungs in OpenBot's order" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:158] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30]. Either `bot` is a fifth rung and every count should say five, or it is not a rung and the enum should drop it. **Exact edit**: pick one — "the five rungs, with `bot` the last" in REQ-009 and the doc, or remove `bot` from the REQ-001 enum.

## Ruled Out

- **Treating phase 007's handoff as overreach.** It names the per-run config path and says 008 injects into the same file, which matches 008's own scope ("the per-run filtered UTCP config and `HonoredPosture.apps` belong to 007") [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:42]. The handoff is the model the other phases should follow.
- **Treating phase 005's byte-identical-prompt handoff as untestable.** It names the exact regression (a bot with no memory file gets today's prompt) and phase 005's acceptance table carries the matching row [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:59]. Observable and testable.
- **Treating phase 011's "nothing passes to a successor" as wrong.** It is the last phase in the program and its handoff says so; the only defect there is the phase-count metadata already reported in iteration 1.

## Dead Ends

- A handoff that names a command can be checked against the runtime, but a handoff that names a behavior ("a met `until` switches the bot off") can only be checked against the phase's acceptance table. Both were read; no further contradiction surfaced.

## Edge Cases

- **Ambiguous input**: "observable state" was read as a command or record a next-phase setup step could run, not as a prose outcome. Three handoffs (002, 006, 009) are behavior lists rather than commands; they were accepted when their acceptance tables carry the matching rows.
- **Contradictory evidence**: Finding 1 is a direct contradiction between two handoffs and the runtime, with the runtime deciding the outcome.
- **Missing dependencies**: none.
- **Partial success**: the `bots status --rebuild` path was read, not run, because running it would write an index outside the lineage.

## Sources Consulted

- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:30
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:32
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/acceptance-criteria.md:59
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30, :145, :158
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:32, :42
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:169
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:253
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts:323, :350
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 0.83
- Questions addressed: angle 2, handoff criteria
- Questions answered: seven of eleven handoffs are observable and true; 001 and 004 hand off an impossible index state (the same root cause as the P0 schema conflict, now at the exit gate), 008 invents a 009 dependency, and 006 counts four rungs against a five-value enum.

## Reflection

- **What worked and why**: Reading the handoff against the runtime, not against the next phase's prose, caught the impossible index state. The handoff is a promise about the system, so the system has to be the judge.
- **What did not work and why**: The first pass treated "still opens" as a statement about file compatibility; the schema check makes it a statement about code compatibility. The distinction only appears in `openIndex`.
- **What I would do differently**: For every handoff that names a command, read the command's failure path before accepting the promise.

## Recommended Next Focus

Take the acceptance-criteria layer across all eleven phases: check that every `REQ` has a matching `AC` row, that no `AC` row cites a `REQ` that does not exist, and that the `[P0]` checklist rows name a gate that a phase's own tasks can actually run.
