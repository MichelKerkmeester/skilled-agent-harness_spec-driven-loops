# Iteration 1: Correctness — trigger-backfill cancellation, scan instrumentation, and spec-code alignment

## Focus

- **Dimension:** correctness (primary), with a traceability cross-check of REQ-001..REQ-004.
- **Files reviewed:**
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/spec.md`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases/plan.md`
  - `.opencode/bin/mk-spec-memory-launcher.cjs`
  - `.opencode/bin/lib/model-server-supervision.cjs`

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.12

## Findings

### P2, Suggestion

- **F001**: Cancelled trigger-backfill phrase sync does not report pending rows for partial work, `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:248`.
  - The chunk loop returns early when `options.isCancelled?.()` is true at a chunk boundary (line 248). The returned `result` still has `pendingRows: 0` because the pending-row query is skipped, even though earlier chunks have already inserted pending `memory_trigger_embeddings` rows. The scan response therefore underreports pending state for a cancelled run. This is a latent observability/correctness gap, not a data-corruption issue: the next scan reconciles the partial state because upserts are idempotent.
- **F002**: Near-duplicate repair count is not captured in `ScanResults` or the scan response, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1261`.
  - `await timedPhase('near-dup-repair', () => runNearDuplicateRepairBackfill());` discards the returned count. Unlike `postInsertEnrichmentRepaired`, there is no `ScanResults` field or response hint for near-duplicate repairs, so operators cannot observe whether the phase did work. This is an observability/maintainability gap.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | pass | hard | `memory-index.ts:501-526`, `memory-index.ts:1226-1261`, `trigger-embedding-backfill.ts:247-259`, `mk-spec-memory-launcher.cjs:821`, `model-server-supervision.cjs:632` | REQ-001..REQ-004 claims match shipped behavior. |
| `checklist_evidence` | notApplicable | hard | — | Level 1 folder has no `checklist.md`. |
| `skill_agent` | notApplicable | advisory | — | Target is a spec folder. |
| `agent_cross_runtime` | notApplicable | advisory | — | Target is a spec folder. |
| `feature_catalog_code` | notApplicable | advisory | — | No feature catalog file in scope. |
| `playbook_capability` | notApplicable | advisory | — | No playbook artifact in scope. |

## Assessment

- New findings ratio: 0.12
- Dimensions addressed: correctness, traceability
- Novelty justification: First and only pass permitted by `maxIterations=1`. Both findings are new observations from direct code/spec comparison. No P0/P1 defects were found.

## Ruled Out

- None.

## Dead Ends

- None.

## Recommended Next Focus

None — `maxIterations=1` reached. Proceed to synthesis.

Review verdict: PASS
