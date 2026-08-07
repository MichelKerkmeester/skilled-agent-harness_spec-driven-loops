# Iteration 1: Traceability Review

## Focus
Dimension: traceability.

Reviewed the target packet's success criteria, task claims, implementation summary, and the named implementation/test surfaces for spec-to-evidence alignment. Code graph readiness was stale, so this pass used direct file reads and exact searches only.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 11
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Live reindex completion claim does not satisfy the `vec == fts` success criterion. The spec requires the deploy verification to confirm the daemon pid is unchanged and `vec == fts` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:149]. The implementation summary marks the live reindex lag read as PASS while recording `fts == memory_index (20001==20001), vec 19957`, a 44-row vector shortfall [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/implementation-summary.md:96]. This is not a runtime blocker proven by this pass, but it is a completion/evidence contradiction that must be resolved by either reaching vector parity or amending the success criterion.

```json
{
  "findingId": "F001",
  "claim": "The packet marks the live reindex lag read PASS even though the recorded vector count does not satisfy the spec's vec == fts success criterion.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:149",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/implementation-summary.md:96"
  ],
  "counterevidenceSought": "Checked spec.md, plan.md, tasks.md, implementation-summary.md, graph-metadata.json, and the named implementation/test files for a revised acceptance criterion or evidence that vec reached fts; the only located row records fts/memory_index 20001 and vec 19957.",
  "alternativeExplanation": "The 44-row vector residue may be intentionally deferred and not relevant to daemon responsiveness, but the active success criterion explicitly says vec == fts, so the completion evidence must either satisfy that criterion or amend it.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if the spec is amended to make vec parity non-gating for this deploy check or if a later evidence row records vec == fts for the same run.",
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

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | spec.md:149; implementation-summary.md:96 | SC-002 evidence contradicts the written `vec == fts` criterion. |
| checklist_evidence | pass | hard | spec.md:37; tasks.md:75 | Level 1 packet has no checklist.md, so no checked checklist claims were available. |
| feature_catalog_code | partial | advisory | memory-index.ts:512-527; memory-index.ts:790-800; trigger-embedding-backfill.ts:262-279; trigger-embedding-backfill.vitest.ts:155-224 | Implementation surfaces support the instrumentation/chunking claims, but completion evidence remains inconsistent. |
| playbook_capability | notApplicable | advisory | none | No playbook artifact in this target. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: The finding is a direct contradiction between the target spec's success criterion and its recorded completion evidence.
- Verdict basis: P1 because the issue is an unsupported completion/evidence claim, not a proven P0 runtime fault.

## Ruled Out
- Missing event-loop sampler: `memory-index.ts` starts the sampler and logs lag at lines 512-527 and 1488-1492.
- Missing `timedPhase` wrapping of tail phases: `memory-index.ts` defines `timedPhase` at lines 790-800 and wraps the tail phases at lines 1247-1269.
- Missing trigger-backfill chunk/yield: `trigger-embedding-backfill.ts` chunks source rows and yields between transactions at lines 262-279.
- Missing cancel/yield tests: `trigger-embedding-backfill.vitest.ts` covers immediate cancel, chunk-boundary cancel, and cooperative yield at lines 155-224.
- Missing fresh-marker adoption check: `mk-spec-memory-launcher.cjs` consults `readMaintenanceMarker` and `shouldAdoptDespiteProbe` before respawn at lines 814-825; the helper requires a fresh marker for the exact live child at `model-server-supervision.cjs` lines 615-640.

## Dead Ends
- Code graph structural traversal was not used because `code_graph_status` reported stale readiness.

## Recommended Next Focus
Resolve F001 or amend SC-002, then run correctness/security passes over the scan lifecycle and launcher adoption path if this lineage is continued.

Review verdict: CONDITIONAL
