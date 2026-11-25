# Iteration 9: Standing grants — listing, revocation and expiry

## Focus
Frontier node F-2-007 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants): How is a standing grant listed, revoked or expired once a rule store exists, and what stops an `always` grant from becoming permanent silent authority?

## Actions Taken
1. Read 006's out-of-scope list and the ladder's four rungs against the accepted scopes (`once|conversation|always|deny`).
2. Read 003's approval overlay requirements and acceptance row, which offer `2 approve always`.
3. Read the parity synthesis's approval-grant paragraph to compare the intended card with the built scopes.
4. Checked the needs-you item shape for a conversation identity.

## Findings
1. **P1 — phases 006 and 003: `always` is offered and accepted, but no standing-grant lifecycle exists.** The terminal overlay draws `2 approve always`, `bots answer` accepts `--scope always`, and 006 records the scope on the item and names it in the resumed prompt; 006's own out-of-scope list defers "a saved rule that outlives its item". Nothing in the packet defines how a standing grant is listed, revoked, expired or audited, so the label promises persistence the build does not provide, and the later rule store inherits `always` grants with no lifecycle contract. **Exact edit:** until the rule store lands, remove `always` from 003's overlay and refuse it in 006 (`grant-scope-unsupported`); when the store lands, require `bots grants list|revoke`, a default expiry (30 days), a scope bound to bot + kind, and an audit row on every grant and revoke. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:169] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]

2. **P1 — phase 006, `spec.md:145` (REQ-001) and the ladder: `conversation` is an unrepresentable scope.** The scope is accepted, but a needs-you item carries no conversation id (`ITEM_KEYS` has no such field) and the terminal screen never offers it; "this conversation" therefore has no object to bind to. **Exact edit:** add a `conversationId` to the grant (filled from phase 010/011 when the item came from a conversation) or drop `conversation` from the accepted scopes until that identity exists. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:145] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:51-65]

3. **P2 — phase 006, `plan.md:59`: rung 2 (`rule`) can never fire because no rule store exists.** The ladder doc presents four rungs and "first answer wins", but with no store the rule rung is dead and a reader cannot tell whether a rule beats a kind. **Exact edit:** mark rung 2 "not implemented in this phase" in the ladder doc and in the `decideApproval` doc comment. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59]

4. **P2 — phase 006 versus the parity synthesis: the answered-action audit trail is missing.** The research records that "every answered action lands on the audit trail"; 006 writes the grant onto the item, and the item is the only record, so deleting or expiring the item erases the grant history. **Exact edit:** append one `grant` row per answer to a `grants.jsonl` under the identity state root, with item id, bot, kind, scope, actor and timestamp, and cite it from the ladder doc. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:89] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:66]

## Ruled Out
- Suspected existing grant store: ruled out. No module, verb or state file names a grant store; 006 explicitly defers it.
- Suspected chat path offers `always`: ruled out. 011 sends the item's own options; it has no fixed always choice, so the persistence promise is terminal-only today.

## Dead Ends
- Looking for a revocation surface in 003 or 011: none exists.

## Edge Cases
- Ambiguous input: the node says "once a rule store exists"; no phase defines one, so the answer is the absence of a contract, recorded as finding 1 rather than invented.
- Contradictory evidence: 003's overlay promises "always" while 006's scope does nothing beyond the item; preserved both and recorded the mismatch.
- Missing dependencies: the rule store and a conversation identity.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/acceptance-criteria.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md
- specs/system-skilled-bots/002-openbot-parity-research/research/research.md
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts

## Assessment
- New information ratio: 1.0
- Questions addressed: F-2-007
- Questions answered: the question is answered as a finding — no listing, revocation or expiry contract exists, and `always` is a label without persistence.

## Reflection
- What worked and why: comparing the terminal overlay's labels with the scope list found the promise/effect gap without needing the rule store to exist.
- What did not work and why: nothing failed.
- What I would do differently: read the UI's offered choices as requirements, not decoration; "approve always" is a security promise even when the backend treats it as a string.

## Recommended Next Focus
F-2-008: do the secret scans cover child transcripts and logs written outside the run folder?
