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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-001-corpus-reindex-gate-zero"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Seed plan-only implementation-summary (work not yet executed)"
    next_safe_action: "Capture baseline, run reindex + reconcile, add C9-4 guard"
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

> **STATUS: NOT STARTED (plan-only).** This sub-phase was authored during a re-plan; the reindex and guard have NOT been executed. This summary records the intended delivery and the captured pre-reindex baseline the implementation must beat. Do not read any section below as a completion claim.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/001-speckit-memory/001-001-corpus-reindex-gate-zero` |
| **Level** | 2 |
| **Status** | Not Started (plan-only) |
| **Candidate** | `corpus-reindex-gate-zero` — PENDING (gate: needs-reindex-run) |
| **Completion** | 0% |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — planned scope:**
- Run the deferred corpus reindex (`memory_index_scan({ force: true })` + `memory_embedding_reconcile({ mode: 'apply' })`) to restore the ~4,032 cold/un-enriched rows (≈20.1% of the 20,050-row corpus, measured live `2026-06-19`).
- Add `assertEmbeddingCoverage` (C9-4) at `lib/eval/ablation-framework.ts:580-586` so the ablation runner refuses to trust a recall number against a cold index.

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
