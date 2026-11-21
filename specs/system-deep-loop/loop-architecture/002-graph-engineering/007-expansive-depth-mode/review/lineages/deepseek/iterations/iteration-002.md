# Review Iteration 002

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 2 of 24
- Focus: **Frontier node F-1-004: correctness**
- Dimension: correctness
- Frontier node: F-1-004 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts`
- Node selection note: the reducer moved the active node from F-1-002 to F-1-004 because its breadth-first rule prefers the shallowest node with the fewest visits (`reduce-state.cjs:2013-2019`). F-1-002 keeps its correctness coverage and returns for its next dimension after the other depth-1 nodes have one visit.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, the three node files, `deep-research-contract.ts`, `legacy-compatibility.ts`, `lineage-timestamp-window.ts`, `runtime/scripts/README.md`.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:182-186,370-440,540-580` (error codes, `findIdempotentReplay`, `payloadHead`, `eventContentDigest`, conflict return)
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:101-115,300-370,429-495,532-540` (`GATEWAY_IDENTITY_FIELDS`, `withoutGatewayIdentity`, `defaultIdempotencyKey`, `buildPreparedInput`, review and legacy meta, conflict stderr)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:280-310` (iteration row projection, `claimedTimestamp`)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:326-360` (research iteration row projection)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:715-725` (research `claimedTimestamp` upcast)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:95-105,310-315` (claim-aware stamp checks)
- `.skilled/skills/system-deep-loop/runtime/scripts/README.md:36` (documented gateway contract)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The gateway strips a model row's identity fields from the envelope but the projected state-log row still carries them** -- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:483-489` -- `withoutGatewayIdentity` removes `eventId`, `idempotencyKey`, `producer` and `authorityEpoch` from the metadata handed to `buildPreparedInput`, so the ledger event mints all four. The record itself is still passed whole as `data: { record: rawEvent }`, and the projection spreads it back (`deep-review-state-contract.ts:291-296`), so a model that writes `eventId` or `idempotencyKey` into its iteration record gets those values into `deep-review-state.jsonl` beside the ledger's minted identity. The rationale in the code comment ("a row that named an earlier row's key or id would read as its retry or collide with it") and the README line ("minted by the gateway, never taken from the row") therefore describe the envelope only, not the projection.
   - Finding class: instance-only
   - Scope proof: `rg -n "eventId" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` returns no hit, so no current consumer correlates a state-log row to a ledger event by that field; the mismatch is latent rather than breaking. The strip site is the only one (`append-mode-event.cjs:108-115`) and the only whole-record hand-over is the review branch (`:483-489`).
   - Affected surface hints: ["append-mode-event CLI", "deep-review-state-contract projection", "runtime/scripts/README.md"]
   - Case: a leaf writes its iteration record with `"eventId":"event-<its own uuid>"` (a plausible copy of the shape it saw in a ledger row). The ledger stores the row under a gateway-minted id, and the projected state log stores the leaf's id. A later reader that treats the state-log `eventId` as the ledger id resolves to an event that does not exist, and the documented "never taken from the row" guarantee is false for that field.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/skills/system-deep-loop/runtime/scripts/README.md:36` | The README's gateway paragraph matches the envelope behavior (gateway-timed iteration rows, `claimedTimestamp`, minted identity, exit 2 on a reused key with other content). The one drift found is the projection, reported as P2-1, so the protocol passes on the envelope contract it describes. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | pending | - | `runtime/feature-catalog/script-entry-points/append-mode-event-script.md` is in scope and belongs to node F-1-006. |
| `playbook_capability` | pending | - | Belongs to F-1-006. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:100-102,313` reads `claimedTimestamp` when present and falls back to `timestamp`, so the gateway's clock override does not blind the lineage stamp-window check; the model's claim is still judged.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:721` sets `data.claimedTimestamp` from the legacy row's own stamp, and `deep-research-contract.ts:358` projects it, so review and research agree on the claim field.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:343-346` prefers `claimedTimestamp` for `stampedAt`, so salvage timing follows the same rule.

## Edge Cases

- **Replay after the head moved.** `eventContentDigest` deletes `prevEventHash`/`payloadDigest` and nulls any value equal to either event's head, so a retry built on a moved head still compares equal and replays the original receipt. Verified by reading the digest construction, not by running a concurrent append.
- **Different content under the same key.** The digest compares the payload minus head-derived fields; a genuinely different record produces a different digest and is refused with `IDEMPOTENCY_CONFLICT`, whose reason now also reaches stderr (`append-mode-event.cjs:535-539`).
- **Model-supplied `idempotencyKey`.** It is stripped from the metadata, so the key is the derived default. The derived key still hashes the raw record, which includes that field; a retry that hands over the same bytes therefore still replays.
- **Non-iteration review rows.** `reviewMeta` only overrides the clock for `type === "iteration"`; an event row keeps its own stamp, matching the projection's `else` branch.

## Confirmed-Clean Surfaces

- **Conflict refusal before append.** `append-mode-event.ts:568-575` returns the refusal before the authorize/append loop, so a reused key with other content cannot write a second event.
- **Same-kind, same-content replay.** `findIdempotentReplay` returns the durable receipt for a matching digest, and `maxRetries` is 0 on a replay, so no second append is attempted.
- **Producer and epoch minting.** `buildPreparedInput` falls back to the CLI producer and `authority.epoch` when the metadata carries neither, and the strip removes both from a model row.
- **Research iteration timing.** The research projection already used `occurredAt` before this range, so the review change aligns the two modes rather than diverging from them.

## Ruled Out

- **A P1 for the projected identity fields.** Ruled out after searching for a consumer: neither the reducer nor the verifier reads `eventId` from a state-log row, so nothing mis-correlates today. Kept at P2 as a contract/comment mismatch with latent confusion.
- **A digest collision risk from `withoutHeads`.** Ruled out: it only nulls a value equal to one of the two event heads, which a review record's content cannot plausibly contain, and both sides are transformed identically.
- **A timestamp regression for the stamp-window check.** Ruled out: `lineage-timestamp-window.ts` prefers `claimedTimestamp`, so the model's claim is still the value judged.

## Next Focus

- Dimension: correctness
- Frontier node: F-1-006 (open, zero visits; the reducer's breadth-first rule selects it next)
- Focus area: docs and contracts — whether the command docs, compiled contracts, references, feature catalogs and playbooks describe what the round 5 and 6 code now does, starting with the `deep-review.yaml` stop-decision contract against `convergence.cjs` and the compiled `deep-review.contract.markdown`.
- Reason: F-1-004 correctness produced one P2 and no P0/P1; the remaining depth-1 node has no visit, and the reducer steers breadth before depth.
- Rotation status: F-1-004 correctness complete; F-1-006 correctness next.
- Blocked/productive carry-forward: productive (tracing the strip site to the projection found the mismatch); no blocked approaches.
- Required evidence: `deep-review.yaml` stop-decision bindings, `convergence.cjs` gate names, and the compiled contract markdown.
- Recovery note: none.

Review verdict: PASS
