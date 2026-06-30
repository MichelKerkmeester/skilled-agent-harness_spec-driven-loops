# Iteration 003: Traceability And Packet State

## Focus

Dimensions: traceability and maintainability. Compared parent phase-parent claims, graph metadata, and child phase completion state.

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.3333

## Findings

### P0, Blocker

None.

### P1, Required

- **F003**: Parent phase packet still claims scaffold-only planned status while child phases are completed. The parent metadata says `Status | Planned` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:51`] and the parent narrative says all nine phases are planned, scaffold-only, and no advisor/code-graph source has been modified [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:71`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:87`]. Child phases now report completed implementation, for example 001 [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/001-advisor-observability/spec.md:49`], 006 [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit/spec.md:55`], and 009 [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:54`]. Parent graph metadata still derives `status: planned` and only lists `spec.md` as key file [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json:44-47`]. This misleads resume/search/status consumers and hides active integration debt from the parent packet.

#### Claim Adjudication Packet: F003

```json
{
  "findingId": "F003",
  "claim": "The parent phase packet's planned/scaffold-only status contradicts completed child phase state and stale graph metadata.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:51",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:71",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:87",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/001-advisor-observability/spec.md:49",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit/spec.md:55",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md:54",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json:44-47"
  ],
  "counterevidenceSought": "Read parent spec/graph metadata and sampled completed child specs plus child implementation summaries/tasks. No parent reconciliation note was found in the parent spec or graph metadata.",
  "alternativeExplanation": "The parent may intentionally stay lean, but phase-parent discipline still requires current purpose/status and child map accuracy, not stale scaffold-only claims.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if parent graph metadata/spec are reconciled to accurately report mixed/completed child state and link current active findings.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md:71` | Parent claims no code edits while child phases claim implementation complete. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical/tasks.md:87-89` | Child task ledgers exist, but parent integrated status is stale. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-60` | Claimed includeTrace path is not public-schema reachable. |

## Assessment

- New findings ratio: 0.3333
- Dimensions addressed: traceability, maintainability
- Novelty justification: Found packet-level state drift that changes resume/search operator expectations.

## Ruled Out

- Resource-map coverage gate: parent `resource-map.md` is absent, so this gate is not applicable.

## Dead Ends

- Full validation was not run as part of this review artifact write because the lineage task is review-only and code graph readiness was stale; evidence is direct file reads.

## Recommended Next Focus

Synthesize report with active P1 findings and remediation workstreams.
Review verdict: CONDITIONAL
