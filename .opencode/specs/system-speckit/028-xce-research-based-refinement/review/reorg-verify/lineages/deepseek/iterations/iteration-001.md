# Iteration 1: Correctness — Reorganization Structural Integrity

## Focus
D1 Correctness: Verify phase-parent spec structure integrity across spec.md Phase Documentation Map, context-index.md old-to-new path bridge, graph-metadata.json child pointers, and description.json metadata consistency.

## Scorecard
- Dimensions covered: [correctness]
- Files reviewed: 8 (spec.md, context-index.md, graph-metadata.json, description.json, handover.md, resource-map.md, timeline.md, before-vs-after.md)
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (all findings are new discoveries; severity-weighted: 0.75)

## Findings

### P1, Required
- **F001**: graph-metadata.json `key_files` contains a stale pre-reorg path. The entry `"001-peck-teachings-adoption/spec.md"` [SOURCE: graph-metadata.json:55] does not reflect the six-track reorganization. The correct path is `001-research-and-doctrine/001-peck-teachings-adoption/spec.md`. This stale reference could cause broken path resolution for consumers that read key_files to locate artifacts.

- **F002**: resource-map.md scope is stale and misleading. The file declares itself a "point-in-time snapshot (2026-06-04)" and states it "does not enumerate the later-shipped phases, now grouped under the six themed tracks (000-005)" [SOURCE: resource-map.md:33]. However, resource_map_present is `true` in config and review protocol relies on this file being current. A stale resource map undermines the Resource Map Coverage Gate audit.

### P2, Suggestion
- **F003**: description.json has stale `description` field — the text "Residual 029 design units: vector reconcile, launcher front-proxy port, hash-class replay pool, defer-by-design bucket" [SOURCE: description.json:36] is clearly intended for a different phase and was not updated during reorganization. This is a metadata accuracy issue.

- **F004**: description.json `specFolder` field uses the short form `"028-xce-research-based-refinement"` [SOURCE: description.json:35] while graph-metadata.json uses the fully-qualified form `"system-spec-kit/027-xce-research-based-refinement"` [SOURCE: graph-metadata.json:4]. Inconsistent path qualification could cause mismatches in automated path resolution.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | graph-metadata.json:55, description.json:35-36, resource-map.md:33 | Phase map entries match disk; 2 metadata drift issues found |

## Assessment
- New findings ratio: 1.0 (all findings are new discoveries)
- Dimensions addressed: correctness
- Novelty justification: First iteration on a fresh review session; no prior findings exist for deduplication
- Spec.md Phase Documentation Map entries all match actual child folders on disk (verified 6/6)
- context-index.md old-to-new bridge paths resolve correctly (spot-checked 5 of 30 entries; all passed)
- graph-metadata.json children_ids match description.json children and actual folders

## Ruled Out
- context-index.md bridge inaccuracy: All 5 spot-checked entries resolve to existing files on disk
- spec.md phase map / folder mismatch: All 6 tracks have matching folders with spec.md present

## Dead Ends
- None

## Recommended Next Focus
D2 Security: Scan spec docs, templates, and configuration files for secrets exposure, unsafe file paths, and injection risks in the reorganized phase parent structure.

## Claim Adjudication Packets

### F001 (P1)
```json
{
  "findingId": "F001",
  "claim": "graph-metadata.json key_files contains a stale pre-reorg path that does not resolve under the current six-track structure.",
  "evidenceRefs": [
    "graph-metadata.json:55"
  ],
  "counterevidenceSought": "Verified the path '001-peck-teachings-adoption/spec.md' does not exist at the 027 root; the correct path '001-research-and-doctrine/001-peck-teachings-adoption/spec.md' exists on disk. Checked spec.md Phase Documentation Map to confirm the new home.",
  "alternativeExplanation": "The path could be intentionally relative and resolved from a child phase context, but key_files are per the schema consumed from the parent level, and other entries use repo-relative qualified paths.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If key_files resolution in graph-metadata.json consumers uses a flexible resolution strategy that successfully finds the file regardless of path staleness, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### F002 (P1)
```json
{
  "findingId": "F002",
  "claim": "resource-map.md is a stale point-in-time snapshot from before the six-track reorganization, undermining the Resource Map Coverage Gate audit.",
  "evidenceRefs": [
    "resource-map.md:33"
  ],
  "counterevidenceSought": "Checked if resource-map.md had been regenerated since 2026-06-04 — it has not. Verified the file explicitly states it is a snapshot and does not enumerate the themed-track phases.",
  "alternativeExplanation": "The resource-map.md could be intentionally preserved as historical provenance with spec.md serving as the live authority, but this contradicts the review protocol which requires resource_map_present=true files to be current for audit purposes.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the review config were updated to set resource_map_present=false or the resource-map were regenerated to include the current six-track structure, downgrade to P2 advisory.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

Review verdict: CONDITIONAL
