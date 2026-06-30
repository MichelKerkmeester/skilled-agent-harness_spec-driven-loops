# Review Report: 021-cooperative-heavy-phases

## 1. Executive Summary

- **Verdict:** PASS
- **Active findings:** P0=0, P1=0, P2=2
- **hasAdvisories:** true
- **Scope:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/021-cooperative-heavy-phases` (spec-folder) and its referenced implementation, tests, and launcher supervision code.
- **Stop reason:** `maxIterations` reached (configured to 1).
- **Session:** fanout-p021-kimi-1-1781716627766-f4z8n0, generation 1, lineage new.

The single permitted iteration focused on correctness and the `spec_code` traceability protocol. No P0 or P1 defects were confirmed. Two P2 observability gaps were noted. Security and maintainability dimensions were not reviewed due to the iteration budget.

## 2. Planning Trigger

PASS routes to `/create:changelog` for the reviewed correctness and traceability surface. Because the review was truncated at one iteration, schedule a follow-up review covering security and maintainability before treating the packet as fully release-ready.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | Status | First/Last Seen |
|----|----------|-----------|-------|-----------|--------|-----------------|
| F001 | P2 | correctness | Cancelled trigger-backfill phrase sync does not report pending rows for partial work | `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts:248` | active | 1 / 1 |
| F002 | P2 | maintainability | Near-duplicate repair count is not captured in ScanResults or scan response | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1261` | active | 1 / 1 |

### F001 details

When `isCancelled` returns true at a chunk boundary, `runTriggerEmbeddingBackfill` returns `result` with `status: 'cancelled'` but `pendingRows` remains 0 because the pending-row query is skipped. Earlier chunks have already inserted pending rows into `memory_trigger_embeddings`, so the scan response underreports pending state. The partial state is safe because the upserts are idempotent (`ON CONFLICT DO UPDATE`) and the deletes are per-memory-id; the next scan reconciles it.

### F002 details

`timedPhase('near-dup-repair', () => runNearDuplicateRepairBackfill())` discards the returned count. `ScanResults` has no field for near-duplicate repairs and the final response emits no hint for it, unlike `postInsertEnrichmentRepaired`. This limits observability and makes it harder to verify the phase ran at all.

## 4. Remediation Workstreams

1. **Observability in trigger-backfill cancellation** (F001)
   - After a cancelled phrase sync, set `result.pendingRows` to the count of pending rows already inserted before returning, or document that `pendingRows` is intentionally not populated for cancelled runs.
2. **Observability in near-duplicate repair** (F002)
   - Add a `nearDupRepaired` field to `ScanResults` and include it in the scan response / hints, mirroring `postInsertEnrichmentRepaired`.

Both workstreams are advisory; neither blocks the PASS verdict.

## 5. Spec Seed

No normative spec changes are required. The existing REQ-001..REQ-004 acceptance criteria are met by the shipped code.

## 6. Plan Seed

- TBD-001 [P2] Decide whether to populate `pendingRows` on cancelled trigger-backfill phrase sync.
- TBD-002 [P2] Surface near-duplicate repair count in `ScanResults` and scan response.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | REQ-001..REQ-004 verified against implementation; see F001/F002 for minor gaps. |
| `checklist_evidence` | core | notApplicable | Level 1 spec folder has no `checklist.md`. |
| `skill_agent` | overlay | notApplicable | Target is a spec folder. |
| `agent_cross_runtime` | overlay | notApplicable | Target is a spec folder. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog file in scope. |
| `playbook_capability` | overlay | notApplicable | No playbook artifact in scope. |

## 8. Deferred Items

- F001 and F002 are recorded as P2 advisories.
- Security and maintainability dimensions were not reviewed due to `maxIterations=1`.

## 9. Audit Appendix

### Iteration table

| # | Focus | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|------------|--------------|-------|--------|
| 1 | correctness | correctness, traceability | 0/0/2 | 0.12 | complete |

### Coverage at stop

- Dimensions covered: 2 / 4 (correctness, traceability)
- Core protocols: `spec_code` pass; `checklist_evidence` not applicable.
- Overlay protocols: all not applicable for a spec-folder target.
- Files reviewed: 7.

### Convergence replay

- The loop stopped because `maxIterations=1` was reached, not because of convergence math.
- No `blocked_stop` events were emitted.
- No P0 findings were discovered; claim adjudication was not required.

### Verification evidence consulted

- `memory-index.ts` — lag sampler (`LOOP_LAG_SAMPLE_MS`, instrument gate), `timedPhase`, `onPhase` refresh wiring.
- `trigger-embedding-backfill.ts` — `PHRASE_SYNC_CHUNK_ROWS`, between-chunk `setImmediate`, `isCancelled`, cache-hit yield.
- `mk-spec-memory-launcher.cjs` — `shouldAdoptDespiteProbe` call in `respawnAfterDeadSocket` (line 821) and stale-reclaim path (line 1689).
- `model-server-supervision.cjs` — `shouldAdoptDespiteProbe` definition (line 632).
