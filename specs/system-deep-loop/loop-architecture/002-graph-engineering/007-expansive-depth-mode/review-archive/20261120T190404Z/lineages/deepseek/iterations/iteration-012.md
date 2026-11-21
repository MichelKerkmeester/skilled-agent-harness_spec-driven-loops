# Iteration 12 - F-1-007 maintainability: pivot and coverage-graph change cost

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-007, dimension maintainability. Node scope: the pivot library and mode scripts, `continuity-thread.cjs` and `runtime/lib/coverage-graph`.
- Operator review focus covered in this iteration: overengineering (the double config write and the two retry controls named and judged), operator UX (attempt and failure text), cross-CLI/OS parity (per-loop paths and vocabularies).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` -- attempt transition, retry loop, event ids and paths.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` -- the subcommand surface the workflow drives.
- `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts`, `deep-research/scripts/divergent-research-pivot.ts` -- the per-loop seed builders.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`, `coverage-graph-query.ts` -- the per-loop vocabularies and safe metadata.
- Traceability sources: `012-pivot-hygiene` REQ-001..REQ-009, `010-research-frontier-mode` REQ-005/REQ-008.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The attempt-1 to attempt-2 config transition writes the config twice and the second write bypasses the conflict check** -- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1296 -- When a retry opens, `preparePivotTransaction` calls `persistConfig(paths.configPath, openingRecord)` to replay the attempt-1 record unchanged, then `writeStateIfChangedAtomic(paths.configPath, configRecord, ...)` to adopt attempt 2. `persistConfig` is the guarded writer (it refuses a conflicting existing config), and `writeStateIfChangedAtomic` is the raw atomic writer, so the second call is the only write in the pivot that can replace a config without the guard. A reader must reconstruct why the replay exists, and a future caller that adds a third attempt or a migrated config shape has to re-derive the same two-step order; a crash between the writes leaves attempt 1 persisted with the attempt-failed event durable, which is only safe because the next prepare re-enters this branch.
Finding class: instance-only
Scope proof: the only `writeStateIfChangedAtomic` call in the file is this branch (`:1299`); every other config write goes through `persistConfig`. The comment at `:1289-1298` explains the replay but not the guard asymmetry.
Affected surface hints: ["divergent-pivot.ts preparePivotTransaction", "persistConfig", "writeStateIfChangedAtomic", "attempt transition"]
Case: a later change adds an attempt-3 path and copies `persistConfig` alone; the attempt-2 record no longer replays, `persistConfig` throws a conflict, and the retry fails at prepare instead of reporting a pivot failure.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `012` REQ-007's attempt identity and config parse match; the double write is an implementation detail the REQ does not name. The iteration 3 REQ-007 admission claim remains the only partial. |
| `checklist_evidence` | partial | `012` AC rows match; AC-008 remains outstanding. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1490-1535` writes the retryable attempt failure with its own event id and lifecycle, which the YAML retry step reads.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs:15-25` documents that prepare is mode-owned while record-seat and finalize act on the persisted transaction, which is why finalize accepts the caller's paths.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:225-229` keeps one relation vocabulary per loop, so the research `DERIVED_FROM` edge cannot leak into a review graph.

## Edge Cases

- The library `runDivergentPivot` retries in-process while the YAML re-enters `step_prepare_divergent_pivot`; the two controls exist because the library is the packaged API and the workflow must orchestrate native seat dispatch across steps. They are ruled out as a duplication defect, not as a maintainability fix target.
- `finalize` trusts the caller's paths JSON; only the workflow calls it, and the pivot paths are built once by prepare. The trust note is already recorded in the security iteration.
- The review and research pivot scripts both build a seat list and identity; the seats and trigger text differ by loop, so the shared part is the library's transaction, not the builders.

## Confirmed-Clean Surfaces

- Attempt 1 keeps its historical ids and paths, and attempt 2 has a distinct prefix, so an older pivot still loads.
- The retry event is distinct from `pivot_failed`, and the workflow reads its `retryable` flag rather than guessing from the reason.
- Every config write has a stated replay rule; only the one transition needs the two-step order, and it is documented.
- The graph vocabularies are per loop and the safe metadata list is one frozen constant.

## Ruled Out

- Collapsing the library retry loop and the YAML retry step: different owners and different dispatch models.
- A duplication finding for the two mode-specific pivot builders: the shared transaction lives in the library; the builders carry genuinely different seats and triggers.
- A vocabulary finding for `DERIVED_FROM`: it is research-only and the review graph never emits it.

## Next Focus

- Dimension: none remaining. All three dealt nodes cover correctness, security, traceability and maintainability; the frontier is answered and the run proceeds to synthesis with stop reason `converged` / reasonDetail `frontier_drained`.
- Reason: the dealt frontier holds no open or active node and at least one answered node, which is the legal `frontier_drained` candidate once the stop gates pass.
- Required evidence: the findings registry, the merged state log and the iteration files this synthesis reads.
- Rotation status: complete.

Review verdict: CONDITIONAL
