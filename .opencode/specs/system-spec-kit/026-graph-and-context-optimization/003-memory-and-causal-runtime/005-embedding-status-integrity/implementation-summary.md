---
title: "Implementation Summary: embedding-status integrity (durable prevention fixes)"
description: "Implemented and verified three durable code fixes preventing mk-spec-memory embedding-backlog recurrence: reindex status-commit, non-destructive retention, call-time retention config."
trigger_phrases:
  - "embedding status integrity summary"
  - "reindex status commit implementation"
  - "retry retention non-destructive implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/005-embedding-status-integrity"
    last_updated_at: "2026-05-27T05:56:01Z"
    last_updated_by: "main_agent"
    recent_action: "ran-one-time-backlog-reconcile-on-live-db-17241-rows-to-success"
    next_safe_action: "operator-restart-lease-owner-daemon-to-activate-005-prevention-code"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000051"
      session_id: "embedding-status-integrity-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 3 root-cause fixes implemented + verified (build + vitest green)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `005-embedding-status-integrity` |
| **Updated** | 2026-05-27 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Three durable prevention fixes (from the 004 deep-research root cause) implemented in the mk-spec-memory runtime, each with test coverage.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/embedders/reindex.ts` | Modify | REQ-001: completion transaction now commits `embedding_status='success'` (clears `failure_reason`, stamps `embedding_generated_at`, sets `updated_at`) for rows in the just-written `vec_<dim>` table |
| `mcp_server/lib/providers/retry-manager.ts` | Modify | REQ-002: `enforceRetryRetentionLimits()` three passes guard `AND (embedding_status='retry' OR COALESCE(retry_count,0)>0)`; REQ-003: `getMaxRetryQueuePending()`/`getMaxRetryQueueAgeMs()` call-time accessors used as retention defaults + exported |
| `mcp_server/tests/embedder-reindex.vitest.ts` | Modify | Realistic `memory_index` schema (status columns) + assertion all rows become `success` after reindex |
| `mcp_server/tests/providers/retry-retention.vitest.ts` | Modify | Asserts the retry_count guard in all three retention queries + call-time env reads |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Research-first: verified each `file:line` claim from 004 against the live source before editing. Fix #1 is additive and atomic inside the existing completion transaction; fixes #2/#3 are surgical edits to `retry-manager.ts`. Built with `npm run build` (tsc → dist) and verified with the two coupled vitest suites. No production database was mutated.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the reindex status UPDATE to `id IN (SELECT id FROM vec_<dim>)` | Only mark rows actually backed by an active-profile vector — never falsely report `success` |
| Retention guard = `status='retry' OR retry_count>0` | Bounds genuinely-retrying churn while sparing never-attempted clean `pending` work |
| Keep boot-time consts for the export; add call-time accessors for defaults | Stable export shape for diagnostics/tests; live env applies to retention without re-import |
| Collapse to one Level-1 packet (REQ-001/002/003) instead of 3 sub-phases | ~30 LOC across 2 files — three governance doc-sets would be disproportionate ceremony |
| Defer the one-time backlog reconcile | Operational repair, separate from prevention |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Build | Pass | `npm run build` (tsc --build + finalize-dist) clean; fixes present in `dist/` |
| Unit (reindex) | Pass | `tests/embedder-reindex.vitest.ts` — status-commit assertion + existing job-lifecycle tests green |
| Unit (retention) | Pass | `tests/providers/retry-retention.vitest.ts` — guard-present + call-time-config assertions green |
| Regression sweep | Pass | 135/136 coupled tests green |
| Pre-existing flake | Noted | `retry-manager.vitest.ts` T49 fails identically on untouched `main` (full-file ordering flake); passes in isolation; not caused by this change |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Fixes activate only after a `npm run build` and a full daemon (lease-owner) restart — a `/mcp` reconnect is insufficient.
2. **(Resolved 2026-05-27)** The existing ~17k-row backlog (separate from these prevention fixes) was cleared by the one-time reconciliation — 17,241 vector-present rows flipped to `success` against the live DB. See the Operator Run Record below.
3. The context-server hardcoded retry interval/batch (5min/5) is unchanged (deferred follow-up).
4. `memory_embedding_reconcile()` remains a proposed maintenance tool, not yet implemented.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:operator-run -->
## Operator Run Record — One-Time Backlog Reconcile (2026-05-27)

The 004 runbook (§7–§8) was executed against the **live** `context-index.sqlite` to clear the pre-existing embedding-status backlog. Because `memory_embedding_reconcile()` is not yet implemented, the **guarded emergency SQL fallback** (004 `iterations/iteration-008.md` §F2 / `iteration-010.md` §F6) was used.

### Method & Safety

- Active shard resolved from runtime metadata and verified: `nomic-embed-text-v1.5 / dim 768 / ollama`; active-shard guard returned `ok = 1` (fail-closed).
- **Dry-run:** opened `-readonly` with `PRAGMA query_only=ON` — no write was physically possible.
- **Apply:** single `BEGIN IMMEDIATE` transaction, `busy_timeout=30000`, `.bail on` (any error → automatic rollback on exit). Shard read-only in practice (SELECT-only). No file backup taken (operator choice; WAL retains checkpoint-restore).

### Dry-Run Buckets (live)

| Bucket | Rows |
|--------|------|
| `vector_present_status_stale` | 17,241 |
| `missing_active_vector_retry_eligible` | 0 |
| `missing_active_vector_provider_failure` | 0 |
| `failed_masked_by_newer_latest_path_anchor_row` (diagnostic) | 15,152 |

### Apply Result

| | failed | pending | retry | success | total |
|---|---|---|---|---|---|
| **Before** | 16,344 | 402 | 495 | 9,749 | 26,990 |
| **After** | 0 | 0 | 0 | 26,990 | 26,990 |

- UPDATE 1 (vector-present → `success`): **17,241 rows**. UPDATE 2 (missing-vector → `retry`): **0 rows** — nothing needed re-embedding.

### Verification

- **Idempotent** — post-apply dry-run buckets all `0`; a second run is a no-op.
- **Coverage intact** — `success`-rows-missing-a-vector held at exactly **23** (pre-existing hygiene gap, untouched), proving only status flags changed, never a vector surface.
- **Zero re-embedding**; no daemon restart was required for the data repair (`missing_active_vector = 0`, so runbook §8 step 4 was skipped).

### Residual / Next

- Prevention code (REQ-001/002/003) still requires a **lease-owner daemon restart** to become active (Known Limitations #1).
- 23 `success` rows lack an active vector surface (0.24%) — separate hygiene item, out of scope for this reconcile.

<!-- /ANCHOR:operator-run -->
