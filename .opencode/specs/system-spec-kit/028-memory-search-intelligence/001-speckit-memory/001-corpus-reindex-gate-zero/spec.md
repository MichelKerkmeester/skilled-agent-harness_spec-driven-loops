---
title: "Feature Specification: Corpus Reindex — Gate-Zero for Recall Benchmarking"
description: "Run the deferred corpus reindex restoring ~20-25% cold/un-embedded rows — the hard precondition for benchmarking any recall candidate in packet 028's Memory MCP retrieval-intelligence work."
trigger_phrases:
  - "corpus reindex gate zero"
  - "deferred reindex embedding coverage"
  - "memory recall benchmark precondition"
  - "assert embedding coverage ablation"
  - "028 speckit memory impl reindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author corpus-reindex gate-zero impl sub-phase spec"
    next_safe_action: "Run reindex + reconcile, then add C9-4 coverage guard at ablation-framework.ts:580"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-001-corpus-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Corpus Reindex — Gate-Zero for Recall Benchmarking

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
| **Candidate** | `corpus-reindex-gate-zero` (a.k.a. C9-4-assertEmbeddingCoverage, gate-zero) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP index is partly cold: a measurable fraction of indexed rows are un-enriched / un-embedded, and the FTS/vector consistency state is degraded. Until that coverage is restored, **no recall, calibration, or cold-tier number can be trusted** — a benchmark run against a quarter-dark index silently measures the wrong corpus and believes the result. The 028 retrieval-evaluation campaign (child `008-retrieval-evaluation`) named this **the hard precondition for every recall-affecting candidate**: "Reindex is gate-zero" (`synthesis/08-retrieval-evaluation-findings.md` §"How to read each entry"; "Honest caveats"). The eval harness itself only checks ground-truth ID parenthood/presence (`assertGroundTruthAlignment`, `ablation-framework.ts:314`), not embedding coverage — so it cannot today refuse to run against a cold index.

Live evidence of the cold state (captured `2026-06-19` via `memory_health`, full report):
- **20,050 rows indexed**; `backgroundEnrichment.pendingByStatus`: `failed=1570, partial=21, pending=2441` → **4,032 rows still pending enrichment** (the health hint states it verbatim: "4032 rows still pending enrichment").
- That is **≈20.1%** of the corpus un-enriched — in the neighborhood of the research's "~25% cold/un-embedded" figure (the roadmap/synthesis figure is structural inference; the live number is ~20%).
- `consistency.status: "degraded"` with FTS/vector mismatched IDs; `index.summary: "degraded_needs_repair"`.

### Purpose
Run the deferred corpus reindex (force re-index + embedding reconcile) so the index is whole, then make "reindex is gate-zero" **executable** by extending the alignment guard to refuse a benchmark when embedding coverage is below threshold. This unblocks benchmarking of every downstream recall candidate in the `001-speckit-memory` impl tree. It must run **FIRST**, before any benchmark-gated candidate (C2-C single-hop gating, the three new corpus metrics, isotonic calibration, cold-tier re-measurement).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the deferred corpus reindex to restore embedding/enrichment coverage across the ~4,032 cold rows: `memory_index_scan({ force: true })` (force re-index, ignore content hash) followed by `memory_embedding_reconcile({ mode: 'apply' })` (flip vector-present rows to success; reset genuinely-missing-vector retention failures to retry-eligible for re-embedding).
- Capture a **before/after coverage baseline** (per the regression-baseline-and-delta rule): pre-reindex `pendingByStatus` + `consistency` counts vs post-reindex counts, reporting the delta.
- Refresh `lib/eval/data/ground-truth.json` against the post-reindex active DB if the alignment guard reports drift (the existing remediation: `scripts/map-ground-truth-ids.ts --write`).
- Add the C9-4 coverage guard: extend `assertGroundTruthAlignment` (or add a sibling `assertEmbeddingCoverage`) so the ablation runner throws-with-remediation when the golden set's embedding coverage is below threshold (drop-in at the existing call site `ablation-framework.ts:580-586`).

### Out of Scope
- Implementing any downstream recall candidate (C2-C class-gating, the three new corpus metrics C9-1/C9-2/C9-3, isotonic calibration, cold-tier re-measurement) — each is its own sub-phase, all gated behind this one.
- Building the eval-harness metric lanes themselves (child `008` Wave-1 spine `C9-1/C9-2/C9-3`) — gate-zero is their precondition, not their delivery.
- Changing retention/TTL physical deletion, schema migrations, or the embedding provider/model.
- Touching the other three subsystems (code-graph, skill-advisor, deep-loop).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts` | Modify | Add the embedding-coverage assertion (C9-4) invoked at the existing `:580-586` guard call site; throw-with-remediation below threshold |
| `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json` | Modify (conditional) | Refresh golden-set parent-memory IDs against the post-reindex DB if alignment drift is reported |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | Data (runtime) | Re-enriched/re-embedded rows (a data operation via the MCP tools, NOT a source edit) |

> **Note:** the primary deliverable is a **data operation** (the reindex itself) plus one small guard. The reindex is driven through the MCP tools (`memory_index_scan`, `memory_embedding_reconcile`), not by editing the DB.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Capture a pre-reindex coverage baseline | `memory_health` (full report) snapshot recorded with `pendingByStatus` (failed/partial/pending) + `consistency` counts before any reindex action |
| REQ-002 | Run the force reindex | `memory_index_scan({ force: true })` completes; the scan re-evaluates all rows ignoring content hash |
| REQ-003 | Run the embedding reconcile | `memory_embedding_reconcile({ mode: 'apply' })` completes; vector-present pending/retry/failed rows flip to success, genuinely-missing-vector retention failures reset to retry-eligible |
| REQ-004 | Coverage restored | Post-reindex `pendingByStatus.pending` ≈ 0 (within the un-recoverable provider-failure residual), `consistency.status` no longer `degraded` OR the residual is explained as genuinely un-embeddable rows |
| REQ-005 | Report the before/after delta | A baseline-vs-after table records the coverage delta (per the regression-baseline-and-delta rule) — not just the after-state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Make gate-zero executable | `assertEmbeddingCoverage` (C9-4) added at `ablation-framework.ts:580-586`; throws with a remediation message when golden-set embedding coverage is below threshold |
| REQ-007 | Ground-truth re-alignment if drifted | If `assertGroundTruthAlignment` reports drift post-reindex, `ground-truth.json` refreshed via `map-ground-truth-ids.ts --write` against the active DB |
| REQ-008 | No silent corpus mutation beyond reindex | The reconcile is run in `apply` only after a `dry-run` preview confirms the bucket counts; no rows deleted |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Embedding/enrichment coverage is whole — `pendingByStatus.pending` driven to ~0 and any residual `failed` rows are explained (genuine provider failures vs recoverable), recorded as a before/after delta against the captured baseline.
- **SC-002**: The eval harness can no longer trust a recall number against a cold index — `assertEmbeddingCoverage` is wired at `ablation-framework.ts:580-586` and throws-with-remediation below threshold (verified by a unit/integration check or a deliberate low-coverage probe).
- **SC-003**: Downstream recall candidates in `001-speckit-memory` are unblocked — a benchmark run against the golden set now passes the coverage guard and measures the full corpus.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Large force-reindex load | Re-embedding ~4k rows via ollama may be slow / load-heavy | Run `memory_index_scan({ background: true })` and poll `memory_index_scan_status`; reconcile after |
| Risk | Genuine un-embeddable rows | Some `failed` rows are real provider failures, not recoverable | `memory_embedding_reconcile` `resetMissing` only resets retention failures to retry; report the irreducible residual rather than overclaiming "100% covered" |
| Risk | Ground-truth drift after reindex | Golden-set parent IDs may no longer align | `assertGroundTruthAlignment` already detects it; remediate with `map-ground-truth-ids.ts --write` (REQ-007) |
| Risk | Coverage-threshold false gate | Too-strict threshold blocks legitimate benchmarks | Set the threshold against the post-reindex achievable coverage, leaving headroom for the irreducible residual |
| Dependency | Embedding provider healthy | Reconcile/scan need a live embedder | `memory_health.embeddingProvider.healthy` must be true (live: ollama nomic-embed-text-v1.5, healthy) |
| Dependency | MCP tools available | Reindex is driven via `memory_index_scan` / `memory_embedding_reconcile` | Daemon warm; fall back to `node .opencode/bin/spec-memory.cjs` CLI if MCP transport fails |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The reindex should run as a background job (`background: true`) so it does not block the daemon's normal recall traffic; status polled rather than blocking.

### Reliability
- **NFR-R01**: The reconcile runs `dry-run` first, `apply` only after the bucket preview is confirmed — fail-closed against accidental mass mutation.
- **NFR-R02**: No physical row deletion occurs; the operation only enriches/re-embeds and flips status flags.

### Observability
- **NFR-O01**: Before/after `memory_health` snapshots are recorded as the evidence trail (baseline-and-delta), so the coverage gain is auditable, not asserted.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Irreducible failures**: rows whose content genuinely cannot embed (malformed / provider-rejected) stay `failed` after reconcile — report the count, do not loop forever.
- **Masked duplicates**: `memory_embedding_reconcile` reconciles masked-duplicate failed rows to success (never prunes) — expected, not an error.
- **Already-warm corpus**: if a prior session already reindexed, the force scan is near-idempotent (re-derives embeddings); the guard still verifies coverage.

### Error Scenarios
- **Embedder down mid-scan**: `embeddingRetry.circuitBreakerOpen` / provider unhealthy → abort, surface the provider error, retry when healthy (do NOT claim coverage restored).
- **Ground-truth misalignment after reindex**: `assertGroundTruthAlignment` throws with the `map-ground-truth-ids.ts --write` remediation — run it, then re-verify.
- **Coverage still below threshold after reconcile**: the C9-4 guard correctly blocks downstream benchmarks; treat as gate-zero-not-met, not a guard bug.

### Concurrent Operations
- **Two sessions reindexing**: the index scan is single-job; a second `force` scan while one is active should poll the existing job, not launch a competing one.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 1 small guard fn + 1 call-site line; the heavy lift is a data reindex (no schema, no source rewrite) |
| Risk | 8/25 | Reconcile is additive/fail-closed (no deletes); guard is reversible; risk is over/under-strict threshold |
| Research | 6/20 | Seams + mechanism fully mapped from research; only the threshold value + residual-floor need impl-time calibration |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- What exact embedding-coverage threshold should C9-4 enforce — 100% of golden-set parents, or golden-set coverage ≥ a fraction that tolerates the irreducible residual? **TENTATIVE: golden-set parent coverage = 100% (the golden set is small and curated); corpus-wide residual is reported but not gated.**
- Is the post-reindex `failed` residual genuinely un-embeddable, or recoverable on a second reconcile pass? **RESOLVE AT IMPL: run reconcile twice, compare residual; report the floor.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent research phase**: `../spec.md` + `../research/research.md`
- **Gate-zero source**: `../../research/synthesis/08-retrieval-evaluation-findings.md` (C9-4-assertEmbeddingCoverage, Wave-1 gate-zero)

<!-- /ANCHOR:related-docs -->
