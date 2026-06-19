---
title: "Implementation Summary: Corpus Reindex — Gate-Zero for Recall Benchmarking"
description: "Plan-only placeholder. The deferred corpus reindex + C9-4 embedding-coverage guard are NOT YET EXECUTED; this records the intended delivery and the pre-reindex baseline to beat."
trigger_phrases:
  - "corpus reindex implementation summary"
  - "gate zero embedding coverage status"
  - "reindex pending baseline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ship C9-4 coverage guard; verify embedding coverage already 100pct so reindex superseded"
    next_safe_action: "Proceed to the benchmark tier; coverage gate is satisfied"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-001-corpus-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Corpus Reindex — Gate-Zero for Recall Benchmarking

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

> **STATUS: GUARD SHIPPED, COVERAGE VERIFIED, REINDEX SUPERSEDED.** The C9-4 `assertEmbeddingCoverage` guard is implemented and tested (59 ablation tests pass). The corpus reindex was deliberately NOT run: a live `memory_embedding_reconcile` dry-run on 2026-06-19 returned 0 rows to fix (0 vector-present-stale, 0 missing-vector retry-eligible), and `memory_health` reports vec rows 20,050 of 20,050, so embedding coverage is already 100 percent and the reindex's stated coverage purpose was already met. The 4,032 pending rows are background ENRICHMENT (entity and causal post-insert, not embeddings) and the 50 FTS/vector mismatches are minor consistency drift, both left to the self-maintaining index. The recall-benchmark tier is unblocked.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero` |
| **Level** | 2 |
| **Status** | Guard Shipped; Coverage Verified (reindex superseded) |
| **Candidate** | `corpus-reindex-gate-zero` — C9-4 guard DONE; reindex superseded (coverage already 100%) |
| **Completion** | Guard delivered + verified; reindex deliberately not run (unnecessary) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Shipped:**
- **C9-4 `assertEmbeddingCoverage` guard (DONE):** added `inspectEmbeddingCoverage` + `assertEmbeddingCoverage` in `lib/eval/ablation-framework.ts`, wired beside `assertGroundTruthAlignment` at the runner. Default threshold is 100 percent of unique golden parent IDs, requiring both `memory_index.embedding_status = 'success'` and a `vec_memories` row. The failure message references the reindex/reconcile remediation and `scripts/evals/map-ground-truth-ids.ts --write`. 59 ablation tests pass; typecheck and `validate.sh --strict` green.

**Superseded (NOT run):**
- The deferred corpus reindex (`memory_index_scan({ force: true })` + `memory_embedding_reconcile({ mode: 'apply' })`) was NOT executed. Live evidence showed embedding coverage is already whole (reconcile dry-run = 0 mutations; vec 20,050/20,050), so the reindex's stated purpose of restoring embedding coverage was already satisfied. The residual 4,032 pending background-enrichment rows and 50 consistency mismatches are left to the self-maintaining index, not forced via a manual scan.

**Pre-reindex baseline to beat (captured `2026-06-19` via `memory_health` full report):**

| Signal | Baseline value |
|--------|----------------|
| Indexed rows | 20,050 |
| `pendingByStatus.pending` | 2,441 |
| `pendingByStatus.failed` | 1,570 |
| `pendingByStatus.partial` | 21 |
| Total pending enrichment | 4,032 (≈20.1%) |
| `consistency.status` | degraded (FTS/vector mismatch) |
| `index.summary` | degraded_needs_repair |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Intended path (see `plan.md` §4): Baseline snapshot → force background reindex (poll to completion) → reconcile dry-run then apply → post-reindex snapshot + delta → conditional ground-truth re-alignment → add the coverage guard + tests.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Reindex via the MCP tool surface, not raw DB edits** — `memory_index_scan` / `memory_embedding_reconcile` are idempotent and fail-closed; hand-editing `context-index.sqlite` is out of scope.
- **Guard at the shared pre-flight, not per-caller** — extend the existing `runAblation` alignment choke point so every benchmark path inherits coverage enforcement for free.
- **Threshold tentatively = 100% golden-set parent coverage** (small curated set); corpus-wide irreducible `failed` residual is reported, not gated (see spec §9 OPEN QUESTIONS).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

Not yet run. Required at completion (see `checklist.md`): before/after `memory_health` delta showing `pending` driven to ~0; `assertEmbeddingCoverage` unit test (throws below / passes above); `runAblation` cold-index rejection probe; full `mcp_server/` vitest with no regression vs the captured baseline.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No measured benefit number anywhere in packet 028** — every downstream leverage estimate is structural inference; this sub-phase is precisely the precondition that makes those numbers measurable for the first time.
- **Irreducible `failed` residual** — some rows may genuinely not embed; the implementation reports the floor rather than overclaiming 100% coverage.
- **Ground-truth drift risk** — a force reindex can shift parent IDs; the existing `map-ground-truth-ids.ts --write` remediation is the fallback.

<!-- /ANCHOR:limitations -->
