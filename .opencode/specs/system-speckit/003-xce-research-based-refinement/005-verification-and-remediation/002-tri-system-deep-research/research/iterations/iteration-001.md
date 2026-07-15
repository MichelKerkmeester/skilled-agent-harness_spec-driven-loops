# Iteration 001 — Angle 1

**Angle:** Idempotency flag-ON enablement readiness: receipt key variance per logical update, force-retry conflicts, receipt TTL — what still blocks default-on?

**Summary:** Receipt key variance for ordinary `memory_update` metadata appears improved in source, but default-on remains blocked by force-retry collisions, concurrent loser handling, and missing receipt TTL. Docs also still contain stale replay-marker expectations.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] Force retries share the save receipt key but change the payload hash

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3451-3464; .opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:87-101
- Detail: The save receipt key is derived from file path, content hash, route hints, target anchor, and scope, but not `force`. The payload hash does include the full args spread, so changing only `force` keeps the same receipt key while changing the payload hash, producing `idempotency_key_conflict` instead of allowing an intentional forced retry.
- Fix sketch: Either include force/retry intent in the server-derived request fingerprint or define a separate forced-write idempotency policy that cannot collide with ordinary retry receipts.

## [P1][BUG] Concurrent changed-payload save loser mutates but does not fail or replay

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3608-3625; .opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts:136-143
- Detail: After a successful save, `storeIdempotencyReceipt` can lose the first-write race. The handler only returns the winner when the keyed lookup is `replay`; if the winner has the same receipt key but a different payload hash, lookup returns `conflict` and the loser falls through returning its own already-mutated response.
- Fix sketch: On lost receipt store, handle `conflict` explicitly by rolling back/preventing the loser mutation or returning a deterministic conflict response instead of its divergent success.

## [P1][BROKEN-FEATURE] memory_update lost-store path ignores immutable receipt winner

- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:549-556; .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3610-3618
- Detail: `memory_save` checks the boolean returned by `storeIdempotencyReceipt` and replays the winner on a lost store. `memory_update` stores the receipt but ignores that boolean, so concurrent same-key update losers return their own response instead of the canonical first response.
- Fix sketch: Mirror the save handler's lost-store winner lookup in `memory_update`, including explicit handling for conflict status.

## [P1][NEW-FEATURE] Receipt TTL is not implemented

- Evidence: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:656-669; command `rg -n "DELETE FROM memory_idempotency_receipts|idempotency.*TTL|receipt.*TTL|SPECKIT_MEMORY_IDEMPOTENCY.*TTL|MEMORY_IDEMPOTENCY.*TTL" ".opencode/skills/system-spec-kit"` -> no output
- Detail: The receipt table has `created_at` and `updated_at`, but there is no TTL configuration, expiry query, or cleanup path. Deletes also clean ancillary memory rows without deleting receipts, so old receipts can replay stale responses or conflict indefinitely.
- Fix sketch: Add a documented receipt TTL with cleanup and replay-time validity checks, including behavior for deleted or superseded memory IDs.

## [P2][DOC-DRIFT] Manual/catalog docs still require retired replayed:true marker

- Evidence: .opencode/skills/system-spec-kit/feature_catalog/mutation/memory-idempotency-receipts-and-near-duplicate-hints.md:27; .opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/memory-idempotency-replay-and-conflict.md:20; .opencode/specs/system-spec-kit/027-xce-research-based-refinement/before-vs-after.md:71
- Detail: The current code and 027 summary say replay returns the original response verbatim with no `replayed: true` marker. The feature catalog and manual testing scenario still instruct validators to expect `replayed:true`, which would make a correct current implementation look like a manual-test failure.
- Fix sketch: Update the catalog and playbook to validate verbatim replay rather than a replay marker.
