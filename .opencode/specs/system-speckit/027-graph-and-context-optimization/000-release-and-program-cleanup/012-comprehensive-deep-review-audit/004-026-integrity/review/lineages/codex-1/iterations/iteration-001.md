# Iteration 001: Correctness

## Focus
Correctness pass over root control claims, generated recency timeline, and graph metadata status fields.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Findings

### P1, Required
- **F001**: Program graph metadata last-active and track status fields are stale - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156` - The root spec says graph metadata's `derived.last_active_child_id` points to the most recently active track [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139], but graph metadata still points to `004-code-graph` with a May 29 timestamp [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156]. The generated timeline ranks `006-operator-tooling`, `003-memory-and-causal-runtime`, and `000-release-and-program-cleanup` as the newest tracks on June 3 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76]. The same metadata drift appears in child track status fields: `000`, `003`, and `006` graph metadata still say `planned` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/graph-metadata.json:50] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/graph-metadata.json:52] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/graph-metadata.json:40].

#### Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "The root graph metadata and sampled child track metadata are stale relative to the root spec and generated timeline, so resume/recency consumers can be routed to the wrong active track or wrong status.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:139",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json:156-157",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/timeline.md:76-78",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/graph-metadata.json:50",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/graph-metadata.json:52",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/graph-metadata.json:40"
  ],
  "counterevidenceSought": "Checked root spec related-docs, generated timeline top track ranking, root graph-metadata derived fields, and sampled child track graph metadata status fields.",
  "alternativeExplanation": "The metadata may intentionally lag until a memory save runs, but the root spec presents the pointer as current and the review slice explicitly asks for completion-claim reconciliation.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if a documented convention says graph metadata may remain stale while timeline is authoritative and no resume/routing consumer reads last_active_child_id.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:139`, `graph-metadata.json:156` | Root spec claim does not match graph metadata. |

## Assessment
- New findings ratio: 0.50
- Dimensions addressed: correctness
- Novelty justification: First metadata correctness pass found one new P1.

## Ruled Out
- Root track count mismatch: no issue found. Root spec and graph metadata both enumerate eight children.

## Dead Ends
- Treating `resource-map.md` as current navigation was rejected because the file explicitly warns that it is stale.

## Recommended Next Focus
Run a security pass over control and changelog artifacts before continuing traceability.
Review verdict: CONDITIONAL
