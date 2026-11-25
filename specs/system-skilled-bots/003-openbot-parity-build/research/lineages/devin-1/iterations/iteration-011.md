# Iteration 11: The `bots status --json` key set across 003 and 004

## Focus
Frontier node F-2-009 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen, specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, .skilled/skills/system-skilled-bots/runtime/lib/status.ts): Do the eleven plans agree on the `bots status --json` key set that phase 003's header and phase 004's lastRun fields both extend, and does any phase add a key without updating the terminal screen's parser?

## Actions Taken
1. Read `status.ts`'s `StatusReport` and `StatusRow` shapes and the `bots.cjs` JSON print path.
2. Read 003's requirements for the header and the status read, and 004's `lastRun` additions.
3. Swept the other phases for status-key additions.

## Findings
1. **P2 — phases 003 and 004: 004 adds `lastRun.branch` and `lastRun.worktreePath`, and 003 never states that its Rust status struct ignores unknown fields.** `StatusReport` is a flat object whose `rows[].lastRun` is parsed by 003's header; if the crate derives `deny_unknown_fields`, 004's additive keys break the screen's status read. **Exact edit:** state in 003 that the status structs ignore unknown fields (`#[serde(default)]`, no `deny_unknown_fields`) and add a fixture case with an extra `lastRun` key; 004 AC-005 already asserts the rest of the key set is unchanged. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-109] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md:43]

2. **P2 — phase 003, `spec.md:49` and the header: the bot count must filter `kind: 'bot'`, and no requirement says so.** `StatusRow` is a union of bot rows and item rows, so a header that counts `rows` counts needs-you items as bots. **Exact edit:** add to 003's header requirement "count only rows whose `kind` is `bot`", and assert it with a fixture holding one bot row and one item row. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:101-109] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:49]

## Ruled Out
- Suspected other status-key additions: ruled out. 001 leaves `status.ts` unchanged; 002 adds a row-state value, not a key, and leaves the index unchanged; 006 prints a text column on the inbox line; 011 adds no status field.
- Suspected status-json shape drift in 004: ruled out — AC-005 explicitly keeps the row key set unchanged apart from the two new `lastRun` keys.

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none; the node names the two phases and the status surface.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/status.ts
- .skilled/bin/bots.cjs
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md

## Assessment
- New information ratio: 1.0
- Questions addressed: F-2-009
- Questions answered: the question is answered as a finding — only 004 adds keys, and 003 must state its unknown-field policy and its bot-row filter.

## Reflection
- What worked and why: reading the `StatusRow` union showed the header's count is wrong unless filtered, which is a parser bug the key-set question would otherwise miss.
- What did not work and why: nothing failed.
- What I would do differently: for a JSON contract question, read the union types before the field lists; the union is where counting and filtering bugs live.

## Recommended Next Focus
With the depth-2 nodes answered, consolidate: phases 009 and 010 still have no plan-versus-runtime pass, and the cross-phase conflict list and ranked findings are due.
