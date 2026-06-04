# Iteration 001 - Correctness

## Dispatcher

- Focus dimension: correctness
- Files reviewed: root `spec.md`, root `graph-metadata.json`, `timeline.md`, sampled child track `graph-metadata.json` files.

## Findings - New

### P1

- **F001**: Graph metadata recency and track status fields are stale - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156` - Root metadata points `last_active_child_id` at `004-code-graph` and line 157 gives `last_active_at` as 2026-05-29, while `timeline.md:41` says the most recent live spec folder is under `000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3`, and `timeline.md:76` to `timeline.md:78` rank current tracks as `006`, `003`, then `000`. The same reconciliation issue appears in sampled child track metadata: `000-release-and-program-cleanup/graph-metadata.json:50` says `planned` while that track spec says `Complete` at line 39; `005-graph-impact-and-affordance/graph-metadata.json:40` says `planned` while its spec says `Deferred` at line 39; `006-operator-tooling/graph-metadata.json:40` says `planned` while its spec says `In Progress` at line 39.

#### Claim Adjudication Packet

```json
{
  "findingId": "F001",
  "claim": "Graph metadata no longer represents the current recency and status state of the 026 program.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:41",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/graph-metadata.json:50",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md:39",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/graph-metadata.json:40",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md:39",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/graph-metadata.json:40",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/spec.md:39"
  ],
  "counterevidenceSought": "Checked root spec, root timeline, root graph-metadata, and sampled child graph-metadata/spec pairs across complete, deferred, and in-progress tracks.",
  "alternativeExplanation": "The graph metadata may be intended as a stale cache, but spec.md presents it as the live last-active pointer and the child graph metadata files are machine-readable status surfaces.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if graph-metadata.json is explicitly documented as non-authoritative cache and excluded from resume/search routing."
}
```

## Confirmed-Clean Surfaces

- Root phase map itself lists the eight tracks consistently.
- No P0 correctness issue was found.

## Next Focus

Security pass over documentation-only surface.

Review verdict: CONDITIONAL
