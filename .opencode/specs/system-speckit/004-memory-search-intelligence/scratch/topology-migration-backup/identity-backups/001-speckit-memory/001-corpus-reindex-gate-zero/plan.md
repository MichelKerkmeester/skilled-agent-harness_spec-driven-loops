---
title: "Implementation Plan: Corpus Reindex - Gate-Zero for Recall Benchmarking"
description: "Approach + sequencing + shared-infra deps for running the deferred corpus reindex and wiring the C9-4 embedding-coverage guard that makes 'reindex is gate-zero' executable."
trigger_phrases:
  - "corpus reindex plan gate zero"
  - "embedding reconcile sequencing"
  - "ablation coverage guard plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero"
    last_updated_at: "2026-07-04T17:51:03.030Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author reindex gate-zero plan"
    next_safe_action: "Capture baseline then run force reindex + reconcile"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-001-corpus-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Corpus Reindex - Gate-Zero for Recall Benchmarking

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Subsystem** | Spec-Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Embedding provider** | ollama / `nomic-embed-text-v1.5` / dim 768 (live, healthy) |
| **Reindex tools** | `memory_index_scan` (force), `memory_embedding_reconcile` (apply), `memory_health` (evidence) |
| **Guard seam** | `lib/eval/ablation-framework.ts:580-586` (existing `assertGroundTruthAlignment` call site) |
| **Testing** | vitest in `mcp_server/`, the existing ablation/eval suites + a coverage-guard unit check |

### Overview
Two moves, in strict order. First a **data operation**: force-reindex the cold rows and reconcile embedding status so the corpus is whole, bracketed by before/after `memory_health` snapshots so the coverage gain is a measured delta, not an assertion. Second a **small guard**: extend the ablation runner's pre-flight alignment check with an embedding-coverage assertion (C9-4) so the harness refuses to trust a recall number against a cold index. The reindex is the hard precondition (gate-zero) for every recall-affecting candidate in the `001-speckit-memory` tree. The guard makes that precondition machine-enforced rather than a convention.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Cold-state baseline observable via `memory_health` (live: 4,032 pending rows ≈20.1%)
- [x] Reindex mechanism identified (`memory_index_scan` force + `memory_embedding_reconcile` apply)
- [x] Guard seam confirmed real (`ablation-framework.ts:580-586`, `assertGroundTruthAlignment` at `:314`)
- [x] Embedding provider healthy (ollama nomic-embed-text-v1.5)

### Definition of Done
- [ ] Pre/post coverage baseline captured and the delta reported
- [ ] `pendingByStatus.pending` driven to ~0, residual `failed` explained
- [ ] C9-4 `assertEmbeddingCoverage` wired at `:580-586` and throws below threshold
- [ ] `mcp_server/` vitest passes (no regression vs captured baseline), checklist verified

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-restore-then-guard. The restore uses the existing maintenance tool surface (idempotent, fail-closed reconcile). The guard reuses the existing ablation pre-flight choke point so every benchmark path inherits it for free.

### Key Components
- **`memory_index_scan({ force: true, background: true })`**, re-evaluates all rows ignoring content hash, re-deriving embeddings for cold rows. Background job polled via `memory_index_scan_status`.
- **`memory_embedding_reconcile`**, `dry-run` to preview buckets, then `apply` to flip vector-present pending/retry/failed → success and reset genuinely-missing-vector retention failures → retry. Fail-closed on active-shard mismatch.
- **`assertEmbeddingCoverage` (C9-4, new)**, sibling to `assertGroundTruthAlignment`, computes golden-set parent embedding coverage and throws-with-remediation below threshold. Invoked at the same `runAblation` pre-flight (`:580-586`).
- **`map-ground-truth-ids.ts --write`**, existing remediation for golden-set drift, run only if `assertGroundTruthAlignment` reports it post-reindex.

### Data Flow
1. Snapshot `memory_health` (full) → record `pendingByStatus` + `consistency` baseline.
2. `memory_index_scan({ force: true, background: true })` → poll status to completion.
3. `memory_embedding_reconcile({ mode: 'dry-run' })` → confirm buckets → `{ mode: 'apply' }`.
4. (Optional 2nd reconcile pass) to measure the irreducible `failed` floor.
5. Snapshot `memory_health` again → compute and report the coverage delta.
6. If `assertGroundTruthAlignment` drifts → `map-ground-truth-ids.ts --write` → re-verify.
7. Add `assertEmbeddingCoverage` at `:580-586` → verify it throws on a deliberately-low-coverage probe and passes on the restored corpus.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The reindex is a data operation. The only source surface touched is the ablation pre-flight guard. Producer/consumer inventory:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assertGroundTruthAlignment` (`ablation-framework.ts:314`) | producer: ID-parenthood pre-flight assertion | unchanged (sibling guard added beside it) | `rg -n "assertGroundTruthAlignment" lib/eval` |
| `runAblation` pre-flight (`ablation-framework.ts:580-586`) | consumer: the choke point every benchmark passes | update, invoke new `assertEmbeddingCoverage` here | grep the call site + integration probe |
| `assertEmbeddingCoverage` (new) | producer: embedding-coverage assertion | create | unit test throws-below / passes-above |
| `memory_index_scan` / `memory_embedding_reconcile` | data tools restoring coverage | run (no code change) | before/after `memory_health` delta |
| `ground-truth.json` | golden-set parent IDs | conditional refresh on drift | `assertGroundTruthAlignment` passes |

Required inventories:
- Consumers of the guard seam: `rg -n "assertGroundTruthAlignment|runAblation" . --glob '*.ts'`.
- Coverage invariant: a recall number is trustworthy ONLY when golden-set parent embedding coverage ≥ threshold. The guard throws otherwise (fail-closed). Adversarial case: a partly-cold index that passes ID-alignment but fails coverage must be rejected.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Capture pre-reindex `memory_health` (full report): `pendingByStatus`, `consistency`, `index.summary`.
- [ ] Confirm embedder healthy and no active competing scan job.

### Phase 2: Reindex (the gate-zero data operation)
- [ ] Force background reindex, poll to completion.
- [ ] Reconcile dry-run → confirm → apply.
- [ ] Optional second reconcile pass to find the irreducible `failed` floor.

### Phase 3: Guard + Verification
- [ ] Capture post-reindex `memory_health`, compute the before/after delta.
- [ ] Re-align `ground-truth.json` if drifted.
- [ ] Add `assertEmbeddingCoverage` (C9-4) at `ablation-framework.ts:580-586`.
- [ ] Verify the guard throws below threshold and passes on the restored corpus, run `mcp_server/` vitest.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Coverage evidence | Before/after `memory_health` delta on `pendingByStatus` + `consistency` | `memory_health` |
| Unit | `assertEmbeddingCoverage` throws below threshold, passes above | vitest (`mcp_server/`) |
| Integration | `runAblation` refuses a cold-index run, passes on the restored corpus | vitest / a low-coverage probe DB |
| Regression | Full `mcp_server/` suite vs the captured baseline (no new failures) | vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Embedding provider (ollama) | External | Green (healthy) | Cannot re-embed cold rows |
| `memory_index_scan` / `memory_embedding_reconcile` | Internal (MCP) | Green | Cannot run the reindex |
| `assertGroundTruthAlignment` (`ablation-framework.ts:314`) | Internal | Green (confirmed) | Guard seam unavailable |
| `ground-truth.json` golden set | Internal | Green (exists) | Coverage cannot be computed against golden parents |
| Sibling recall candidates (C2-C, C9-1/2/3, calibration) | Downstream | Blocked-by-this | They cannot benchmark until gate-zero is met |

### Shared-Infra / Sequencing Deps
- **This sub-phase is the shared precondition for the whole `001-speckit-memory` impl tree.** Every benchmark-gated candidate (C2-C single-hop graph-gating, the three new corpus metrics C9-1/C9-2/C9-3, isotonic calibration A2, cold-tier re-measurement A5) depends on a whole index. Ship this FIRST.
- **Independent of the Wave-0 shipped record (030):** the 030 candidates (Q6-anchor, C9 embedder-degrade, ANN tie-stable, C5-B, C-X1/C6-A, two-primitive content-id, gauges, skip-closed, Constitutional CAS, Deep-Loop trio, Q4-C1) were correctness/determinism fixes that did **not** require a whole corpus, gate-zero was deferred there by design and is owned here.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: reconcile mass-mutates wrongly, or the guard wrongly blocks all benchmarks.
- **Procedure**: the reconcile is additive (flips status flags + re-embeds, no deletes), so there is little to roll back on the data side, a subsequent reconcile/scan re-derives the correct state. For the guard: revert the `assertEmbeddingCoverage` edit (single function + one call-site line). The harness returns to alignment-only pre-flight.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──> Phase 2 (Reindex) ──> Phase 3 (Guard + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Reindex |
| Reindex | Baseline | Guard + Verify |
| Guard + Verify | Reindex | (downstream recall sub-phases) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline snapshot | Low | 15 minutes |
| Force reindex + reconcile | Medium (I/O-bound re-embed ~4k rows) | 1-3 hours (mostly wall-clock for ollama) |
| C9-4 guard + tests | Low-Medium | 1-2 hours |
| **Total** | | **~2.5-5.5 hours** (compute-bound, mostly the re-embed) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-reindex `memory_health` snapshot captured (the only "backup" needed, the operation is additive)
- [ ] Reconcile `dry-run` bucket preview confirmed before `apply`
- [ ] No active competing index-scan job

### Rollback Procedure
1. **Data**: none required, reconcile only flips status flags / re-embeds (no deletes). Re-run scan/reconcile to converge if a partial run left mixed state.
2. **Guard**: `git revert` the `assertEmbeddingCoverage` edit (one function + one call-site line).
3. **Verify**: `runAblation` returns to alignment-only pre-flight, `mcp_server/` vitest green.

### Data Reversal
- **Has data migrations?** No schema migration, the only data change is embedding/status enrichment (additive, idempotent).
- **Reversal procedure**: N/A (additive), a subsequent scan re-derives correct state.

<!-- /ANCHOR:enhanced-rollback -->
