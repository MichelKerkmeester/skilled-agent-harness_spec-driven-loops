# Review Iteration 008

## Dispatcher

- Mode: review (deep-review LEAF, inline executor for this detached lineage)
- Session: `fanout-deepseek-1795201537192-sq1ivw`, generation 1, lineageMode `new`
- Iteration: 8 of 24
- Focus: **Frontier node F-1-004: traceability**
- Dimension: traceability
- Frontier node: F-1-004 (depth 1 of 3), scope `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts`
- Convergence before dispatch: `CONTINUE` / `noStopCandidate`, stuck 1, consecutive failures 0.
- Sources read this iteration: `steer.md` (absent), `deep-review-config.json`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `frontier-nodes.jsonl`, `deep-review/references/state/state-jsonl.md`, `convergence.cjs` node attribution, `frontier-admit.cjs` block text, the three node files.

## Files Reviewed

- `.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:80-105,195-230` (required fields, row time, legacy field, optional fields, blocked-stop event)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1400-1425` (`iterationBoundToNode`, the attribution order)
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:1043-1045` (the block's instruction to write `frontierNodeId`)
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:280-310` (projection row)
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:429-495` (record hand-over)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The state-format reference omits `frontierNodeId` from the iteration record's optional fields, though the stop decision reads it first** -- `.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:101` -- `convergence.cjs:1415` resolves which frontier node an iteration reviewed by reading `record.frontierNodeId` first, falling back to a focus marker and then to the store's active row. The prompt block instructs every expansive-depth leaf to write the field (`frontier-admit.cjs:1045`), but the schema reference's optional-field list does not name it. A leaf that follows the schema reference instead of the block omits the field and relies on the focus-string fallback, which breaks if the focus is reworded.
   - Finding class: instance-only
   - Scope proof: `rg -n "frontierNodeId" .skilled/skills/system-deep-loop/runtime` returns the read at `convergence.cjs:1415`, the block instruction at `frontier-admit.cjs:1045` and the graph projection at `:1087`; `state-jsonl.md` is the only schema statement and its optional list is the only place the field could be named. The fallback chain is real, so the omission degrades attribution rather than breaking it.
   - Affected surface hints: ["state-jsonl.md optional fields", "convergence.cjs iterationBoundToNode", "frontier-admit.cjs block text"]
   - Case: a leaf reads `state-jsonl.md` to build its iteration record, writes `focus` as "correctness pass on the adapter" instead of the exact "Frontier node F-1-002: correctness" marker, and omits `frontierNodeId`. The reducer then attributes the iteration to the store's active row, which may have moved, so the node's coverage and the per-node stuck count both drift.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:101`, `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1415` | The state-format reference's required and optional field lists match the projection except for `frontierNodeId`, which the stop decision reads and the schema omits. |
| `checklist_evidence` | notApplicable | - | No spec checklist for a commit-range target. |
| `skill_agent` | notApplicable | - | No agent definition in the range. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in the range. |
| `feature_catalog_code` | pending | - | Owned by F-1-006; not re-run here. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:291-296` spreads the record and overrides only `timestamp`, so every field a leaf writes, `frontierNodeId` included, reaches the state log unchanged.
- `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:483-489` hands the record over whole as `data.record`, so the projection is the only place a field could be dropped and it drops none.
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1410-1420` documents the attribution order in a comment that matches the code: own field, then focus marker, then the store's active row.

## Edge Cases

- **`frontierNodeId` is not required for a non-expansive run.** A default-depth review writes no frontier node, so the field is absent by design. The omission from the optional list is only a gap for expansive runs, which is why it is P2 rather than a schema failure.
- **The focus fallback still works today.** Every iteration in this lineage writes both the exact marker and the field, so the drift is latent. The finding names the leaf behavior that would expose it, not a current misattribution.
- **`run` is written beside `iteration`.** The reference calls `run` legacy and says new records write `iteration`; this lineage writes both, and readers accept either. No contradiction with the reference.

## Confirmed-Clean Surfaces

- **Required-field list.** Every field the reference marks required is present in the projection's rows, and the projection adds only `claimedTimestamp`.
- **Row-time rule.** The reference's description of the gateway clock and `claimedTimestamp` matches `deep-review-state-contract.ts:291-296`.
- **Blocked-stop event shape.** The reference's `gateResults` list matches the nine gate names `convergence.cjs` records.
- **Legacy `run` handling.** The reference's statement that readers accept `run` and the fan-out stop-policy validator does not matches `convergence.cjs`'s `getIterationRun` usage.

## Ruled Out

- **A schema failure for `frontierNodeId`.** Ruled out: the field is optional and the fallback chain is documented in code; the gap is in the reference, not the runtime.
- **A projection field drop.** Ruled out: the projection spreads the record and overrides only the timestamp.
- **A `run`-versus-`iteration` contradiction.** Ruled out: the reference describes both and the readers accept both.

## Next Focus

- Dimension: traceability
- Frontier node: F-1-006 (active; the reducer's breadth-first rule selects the shallowest node with the fewest visits)
- Focus area: the docs node's cross-references: whether the compiled contract digests resolve to the files they name, whether the feature-catalog index lists every catalog file the range touched, and whether the playbook index names the scenarios that exist.
- Reason: F-1-004 traceability produced one P2 schema gap; the docs node's own cross-reference integrity is the next traceability surface.
- Rotation status: F-1-004 correctness, security and traceability covered; F-1-006 traceability next.
- Blocked/productive carry-forward: productive (field-list-to-reader comparison found the omission); no blocked approaches.
- Required evidence: compiled contract digest headers, `runtime/feature-catalog/feature-catalog.md`, and the playbook index.
- Recovery note: stuck count is 1; if this pass records no progress the next convergence check may enter stuck recovery and close the active node as exhausted. That is a legal path, not a failure.

Review verdict: PASS
