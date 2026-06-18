# Iteration 001: Traceability and Evidence Consistency

## Focus

- Dimension: traceability, with a maintainability advisory recorded where the implementation comment directly affected review interpretation.
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases`.
- Artifact binding: `artifact_dir` was bound directly to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review/lineages/gpt55-p021b-1` per the fanout override. The resolveArtifactRoot node command was not run.
- Code graph status: stale; direct Grep and Read were used for evidence.

## Scorecard

- Dimensions covered: traceability, maintainability-advisory.
- Files reviewed: 9.
- New findings: P0=0 P1=1 P2=1.
- Refined findings: P0=0 P1=0 P2=0.
- New findings ratio: 1.00.
- Iteration stop: config.maxIterations reached after this pass.

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Live deploy check is marked PASS without satisfying `vec == fts` - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/implementation-summary.md:96` - The success criterion requires the live force-reindex deploy verification to confirm daemon pid stability and `vec == fts` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:148-149`]. The task list repeats the same required confirmation [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/tasks.md:69`]. The claimed PASS evidence instead reports `fts == memory_index (20001==20001), vec 19957 (44-row deferred-embedding residue, poll stopped at the lag line by design)` [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/implementation-summary.md:96`]. That proves the lag read but not the stated vector parity criterion.

```json
{
  "findingId": "F001",
  "claim": "The packet marks the live deploy check as PASS without proving the required vec == fts acceptance criterion.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md:148-149",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/tasks.md:69",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/implementation-summary.md:96"
  ],
  "counterevidenceSought": "Checked target spec, tasks, implementation summary, diagnostic script, dist files, and implementation code for a later vec==fts confirmation; found only fts==memory_index plus vec 19957 with deferred-embedding residue.",
  "alternativeExplanation": "The diagnostic intentionally stopped at the lag line to avoid waiting for deferred embeddings, which may be acceptable for a lag-only check, but it does not satisfy the stated vec==fts deploy criterion.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if a subsequent diagnostic artifact or summary row shows vec == fts after the deferred embedding queue drains, or the acceptance criterion is amended to exclude vector parity from the lag-only check.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F002**: `timedPhase` comment overstates wall-clock as block duration for async phases - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:786-790` - The comment says the wrapped tail phases do not yield and their wall-clock equals event-loop-block duration [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:786-790`]. At least two wrapped phases can await async work: enrichment repair awaits `repairIncompleteMarkers` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:713-718`], and near-duplicate repair awaits `embeddings.generateDocumentEmbedding` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:729-760`]. The event-loop lag sampler still supplies the real block signal, so this is an advisory documentation-risk finding, not a runtime blocker.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec.md:148-149`, `implementation-summary.md:96` | Code-side changes are present, but one acceptance criterion is not proven by the claimed PASS evidence. |
| `checklist_evidence` | skipped | hard | `checklist.md` missing | Level 1 target has no checklist; gate is N/A for this lineage. |
| `feature_catalog_code` | partial | advisory | `memory-index.ts:500-523`, `trigger-embedding-backfill.ts:184-279`, `trigger-embedding-backfill.vitest.ts:155-224` | Implementation and tests support the main feature claims; F002 records a comment-accuracy drift. |
| `playbook_capability` | pass | advisory | `scratch/diag-lag-read.sh:98-132` | Diagnostic script can drive background scan and parse instrumentation. |

## Assessment

- New findings ratio: 1.00.
- Dimensions addressed: traceability, maintainability-advisory.
- Novelty justification: The P1 comes from direct contradiction between acceptance criteria and the packet's claimed PASS row. The P2 comes from direct source-code comment/code mismatch.
- Provisional verdict for this iteration: CONDITIONAL because a P1 finding is active and no P0 finding was confirmed.

## Ruled Out

- Dist staleness: `dist/handlers/memory-index.js` contains `event-loop blocked`, `max-event-loop-lag`, `timedPhase`, and threaded `isCancelled`; `dist/lib/search/trigger-embedding-backfill.js` contains `PHRASE_SYNC_CHUNK_ROWS`, `syncPhraseChunk`, cancel checks, and `setImmediate` yields.
- Launcher adopt/reap regression: the launcher refuses dead-socket respawn when a fresh maintenance marker names the live child [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:814-825`] and also adopts a busy daemon on stale-reclaim when the marker is fresh [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:1685-1694`].

## Dead Ends

- Resource-map coverage: no `resource-map.md` or `applied/T-*.md` exists in the target packet, so the resource-map coverage pass is N/A.
- Checklist evidence: no `checklist.md` exists for this Level 1 packet.

## Recommended Next Focus

Resolve F001 by either running the diagnostic until vector parity is actually confirmed after deferred embeddings drain, or amending the acceptance criterion and implementation summary so the completed claim matches the lag-only evidence. If continuing this lineage beyond one iteration, cover correctness and security next.

Review verdict: CONDITIONAL
