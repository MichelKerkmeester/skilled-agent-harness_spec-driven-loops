# Iteration 001 - Correctness

Focus: program control status and path catalog claims.

## Files Reviewed

| File | Purpose |
|------|---------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md` | Root phase map and aggregate status |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md` | Sample complete child track |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/spec.md` | Sample complete child track |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md` | Sample deferred child track |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/*/graph-metadata.json` | Metadata status reconciliation |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md` | Path catalog accuracy |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md` | Migration bridge counterevidence |

## Findings

### P1

- **F001**: Top-level track graph metadata still reports planned after specs report complete, in progress, or deferred - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/graph-metadata.json:50` - Root `spec.md` marks 000 complete, 001 complete, 005 deferred, and several tracks in progress, while every sampled child `graph-metadata.json` still reports `"status": "planned"`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:97`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/spec.md:46`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/graph-metadata.json:47`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md:39`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/graph-metadata.json:40`]
- **F003**: Resource map marks obsolete pre-reorg paths OK while warning readers not to navigate from it - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62` - The map declares itself stale and says not to navigate from it, but the summary still claims zero missing paths and rows mark old homes such as `000-release-cleanup` as `OK`. The migration bridge maps those old homes elsewhere. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:138`]

### P2

- None.

## Claim Adjudication Packets

```json
[
  {
    "findingId": "F001",
    "claim": "Track-level graph metadata derived.status is stale relative to the track specs and root phase map.",
    "evidenceRefs": [
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:97",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/spec.md:46",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/graph-metadata.json:47",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/spec.md:39",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/graph-metadata.json:40"
    ],
    "counterevidenceSought": "Checked root map, sampled child specs, and all eight child graph-metadata status rows.",
    "alternativeExplanation": "The metadata may be intentionally stale because a save has not refreshed child metadata after reorg waves.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "Downgrade to P2 if metadata consumers are proven not to use child derived.status for resume, search, or graph traversal."
  },
  {
    "findingId": "F003",
    "claim": "The resource map cannot safely act as current coverage evidence because stale rows still present OK status for moved paths.",
    "evidenceRefs": [
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:24",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:44",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/resource-map.md:62",
      ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/context-index.md:138"
    ],
    "counterevidenceSought": "Checked the map's own stale warning, summary counts, old-path rows, and migration bridge.",
    "alternativeExplanation": "The warning banner partially mitigates human navigation risk, but the OK rows still contradict the coverage summary.",
    "finalSeverity": "P1",
    "confidence": 0.88,
    "downgradeTrigger": "Downgrade if downstream tooling explicitly ignores all table rows whenever the stale banner is present."
  }
]
```

## Iteration Summary

New findings: P0 0, P1 2, P2 0.

Review verdict: CONDITIONAL
