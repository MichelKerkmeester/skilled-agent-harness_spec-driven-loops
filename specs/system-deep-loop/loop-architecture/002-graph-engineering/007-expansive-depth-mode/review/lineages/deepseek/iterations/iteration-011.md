# Review Iteration 011

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 11 of 24
- Focus: **Frontier node F-1-004: maintainability**
- Dimension: maintainability
- Frontier node: F-1-004 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 0, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `append-mode-event.cjs` meta handling, `append-mode-event.ts` conflict path.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:101-115,327-352,429-495,532-540`
- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:370-440,540-610`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The identity strip is a denylist that misses four fields `buildPreparedInput` reads from the same metadata** -- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:108-115` -- `withoutGatewayIdentity` removes `eventId`, `idempotencyKey`, `producer` and `authorityEpoch` (and snake_case forms) from a model-written row before it becomes the envelope metadata. `buildPreparedInput` reads four more identity fields from that same object: `streamId`, `streamSequence`, `correlationId` and `causationId` (`:334-343`). A review record that carries `streamSequence` therefore sets the append's sequence, and one that carries `streamId` labels the event with a stream the ledger did not mint. The strip's own rationale ("a row that named an earlier row's key or id would read as its retry or collide with it") applies to these four as much as to the four it covers.
   - Finding class: class-of-bug
   - Scope proof: `rg -n "streamSequence|streamId|correlationId|causationId" .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` shows the reads at `:334-343` and no strip entry; `GATEWAY_IDENTITY_FIELDS` at `:108-115` is the only strip list. The canonical-envelope path is unaffected because it passes a full envelope, which the catalog documents as caller-identity-preserving.
   - Affected surface hints: ["append-mode-event CLI", "GATEWAY_IDENTITY_FIELDS", "buildPreparedInput", "ledger append fence"]
   - Case: a leaf copies a field it saw in a ledger row into its iteration record, including `"streamSequence": 3`. The gateway hands 3 to `buildPreparedInput`, the append is attempted at a sequence the verified head does not match, and the iteration's state record is refused with `APPEND_FAILED` even though the row itself is valid. The leaf sees a refusal it cannot explain from its own content.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:29` | The catalog names only the four stripped fields, so it matches the code but inherits the same incompleteness: it does not say what happens to a row that carries `streamSequence` or `streamId`. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:540-610` verifies the ledger head before each append attempt and retries up to ten times, so a forced `streamSequence` fails the fence rather than corrupting the chain. That containment is why this is P2 and not P1.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:483-489` applies the strip only to `reviewMeta`; the record still travels whole as `data.record`, which is the separate projection issue reported as R2-P2-001.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:532-539` writes an `IDEMPOTENCY_CONFLICT` reason to stderr as well as the JSON line, so a caller that only reads stderr still sees the refusal.

## Edge Cases

- **`streamSequence` is a self-inflicted refusal, not a cross-run write.** The ledger writes to its own file and fences on its own head, so a wrong sequence fails the append. The impact is a refused iteration, not a corrupted ledger.
- **`streamId` is metadata.** The ledger's own `ledgerId` selects the file; the event's `streamId` is recorded. A wrong value mislabels the receipt without redirecting the write.
- **`correlationId` and `causationId` are harmless but inconsistent.** They are free-form identifiers; a model-chosen value does not break anything, but it breaks the same "minted, never taken from the row" contract the strip exists to enforce.
- **The canonical-envelope path is intentionally exempt.** A caller that hands a full envelope keeps its identity, and the catalog documents that exception.

## Confirmed-Clean Surfaces

- **Conflict path.** The refusal is returned before the authorize/append loop and is written to both stdout and stderr.
- **Retry budget.** A replay gets zero retries and a fresh append gets ten, so a transient head conflict is retried without duplicating a replay.
- **Projection timing.** Only `type: "iteration"` records are gateway-timed; every other row keeps its writer's stamp.
- **Comment accuracy.** The comments at `:104-107` and `:470-475` describe the behavior they sit beside, apart from the strip's incomplete field list reported above.

## Ruled Out

- **A P1 for the forced `streamSequence`.** Ruled out: the ledger's head fence refuses the append, so the failure is a refused iteration rather than a corrupted chain.
- **A cross-stream write through `streamId`.** Ruled out: the ledger file is selected by the ledger's own id, not the event's `streamId`.
- **A duplicate of R2-P2-001.** Ruled out: R2-P2-001 is about the projected row keeping stripped fields; this finding is about four fields that are never stripped at all.

## Next Focus

- Dimension: maintainability
- Frontier node: F-1-006 (active; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: documentation duplication as a maintainability cost: the same sandbox paragraph is hand-maintained in `review.md`, `research.md` and both presentation assets (the compiled contracts are generated), and the range had to edit all four to keep them aligned.
- Reason: F-1-004 maintainability produced one P2; the docs node's duplication is the structural cause of the drift already reported as R4-P2-001.
- Rotation status: F-1-004 all four dimensions covered; F-1-006 maintainability next.
- Blocked/productive carry-forward: productive (comparing the strip list to the meta reader found the gap); no blocked approaches.
- Required evidence: the four hand-maintained copies of the sandbox paragraph and the generator that produces the compiled contracts.
- Recovery note: none.

Review verdict: PASS
