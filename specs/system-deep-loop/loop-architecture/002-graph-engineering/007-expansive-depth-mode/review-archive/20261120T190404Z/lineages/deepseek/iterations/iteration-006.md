# Iteration 6 - F-1-007 security: pivot persisted input, council paths and frontier graph projection

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-007, dimension security. Node scope: `divergent-pivot.ts` and its mode scripts and CLI, `continuity-thread.cjs` and `runtime/lib/coverage-graph`.
- Operator review focus covered in this iteration: overengineering (attempt-scoped ids vs a parallel path builder), operator UX (failure reasons and the terminal-frontier refusal), cross-CLI/OS parity (path containment uses `realpath`, and council artifact names stay portable).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` -- persisted config parsing, council path construction, artifact root and ai-council guards, event store, seat report parsing.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` -- argv parsing for prepare/record-seat/finalize.
- `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` -- candidate seeds and the read-only boundary scan.
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` -- `buildFrontierGraphEvents` node/edge shape and metadata.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts`, `coverage-graph-query.ts` -- relation vocabulary, metadata sanitization and parameterized queries.
- Traceability sources: `010-research-frontier-mode` REQ-005/REQ-008, `012-pivot-hygiene` REQ-001..REQ-009.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `012` REQ-001..REQ-009 match the pivot code; `010` REQ-005/REQ-008 match the frontier graph projection. The iteration 3 REQ-007 admission gap remains the only outstanding partial. |
| `checklist_evidence` | partial | `012` AC rows for retry, agreement failure and seat scope match; AC-008 remains outstanding. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:839-842` rejects an artifact root that canonicalizes inside an ai-council tree, and `:844-861` builds every council path under the pivot root.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1201-1211` parses a persisted pivot config through a strict field-by-field validator before any seat or event write.
- `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs:35-70` parses each subcommand's argv into a typed call and never interpolates a value into a shell.
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:995-1042` emits `DERIVED_FROM` edges, which `coverage-graph-db.ts:226` admits for the research loop the research frontier step runs under.
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:123-142` allowlists metadata keys and `:250-270` sanitizes every value to a scalar, so leaf metadata cannot reach the graph as a nested payload.

## Edge Cases

- `finalize` accepts the caller's `--paths-json` and writes through it rather than re-deriving the council paths; the workflow binds that JSON from its own `prepare` result, so a leaf cannot reach it, but the CLI itself would honor a hand-written path set.
- A resumed attempt reuses the persisted `usageAtStart` and `limits`, so a tampered pivot config could raise its own caps; the leaf already holds write access to its lineage, and the coverage of that write is containment, so this is recorded as a trust-model note rather than a finding.
- `buildFrontierGraphEvents` writes the node question into the graph `name`; admission bounds the stored text, and the graph read path sanitizes only metadata, so a long question stays a long display name rather than an executable payload.
- PRAGMA and schema-migration statements are fixed strings; every row value in the new path is bound as a parameter, including namespace fields.

## Confirmed-Clean Surfaces

- The pivot config parser rejects an unknown attempt, a rounds value that disagrees with the attempt, a missing limit and a non-integer usage before any write.
- The artifact-root guard resolves the prospective real path and refuses an ai-council tree, so a symlinked or nested artifact root cannot redirect council artifacts into a reserved directory.
- Seat outputs are parsed as JSON objects with an exact seat id and candidate ids; a partial or malformed report is rejected rather than coerced.
- The read-only boundary scan inspects title and focus after path-shaped scope entries are removed, so a path name cannot smuggle a mutation verb.
- Coverage-graph reads expose only allowlisted scalar metadata, and all relation and node-kind values are validated against per-loop vocabularies before storage.
- The research frontier's `DERIVED_FROM` edge is in the research relation vocabulary and is never emitted for a review run.

## Ruled Out

- A review-run `DERIVED_FROM` write: the research frontier graph step is the only caller, and the review relation vocabulary excludes it.
- SQL injection through node names, metadata or namespace values: every value is bound, and the only interpolated SQL fragments are fixed column/table names.
- Treating the caller-provided `--paths-json` as a boundary bypass: only the orchestrator calls `finalize`, and it passes its own prepare output.
- Treating the reused persisted pivot limits as a range security defect: the reuse is a documented deviation that keeps a resumed prepare from conflicting with its own recorded state, and the leaf already owns its lineage writes.

## Next Focus

- Dimension: traceability on F-1-003 (fan-out runner and merge against the review packet requirements).
- Reason: security is covered on all three nodes; traceability is the next dimension in the rotation and the fan-out merge carries the cross-lineage evidence the final report cites.
- Required evidence: `011` REQ-008 and `009` REQ-001..REQ-006 against `fanout-run.cjs`/`fanout-merge.cjs`, plus the merged report's provenance fields.
- Rotation status: correctness and security covered on all nodes; traceability uncovered on all three.

Review verdict: CONDITIONAL
