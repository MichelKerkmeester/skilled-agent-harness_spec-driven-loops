---
title: "Implementation Plan: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index/plan]"
description: "Phased implementation plan for the full 5-angle self-maintaining index design: Phase 1 coalescing contract + health/orphan sweep, Phase 2 phased async execution + degraded-mode, Phase 3 single-writer concurrency + move reconciliation. Each phase gated by tsc build + tests."
trigger_phrases:
  - "memory index scan implementation plan"
  - "013 memory index implementation plan"
  - "memory index phased async scan job plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-self-maintaining-index"
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phased Level-2 plan"
    next_safe_action: "Dispatch Phase 1 via cli-opencode gpt-5.5 high (isolated worktree)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: memory_index_scan Self-Maintaining Index

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) |
| **Subsystem** | spec-kit memory MCP daemon (`mcp_server/`) |
| **Storage** | SQLite (`memory_index` + vec shards + BM25/FTS) |
| **Testing** | vitest (`npm run typecheck`, targeted vitest files) |

### Overview
The 012 deep-research packet converged on turning `memory_index_scan` into an idempotent, coalescing, phased async scan job (research.md §6). This packet implements that design against the live `mcp_server/` daemon. The daemon runs during development, so edits touch source only; build verification is isolated (`tsc --noEmit`), and any daemon restart is a discrete, explicit step — never an implicit side effect of an edit. Delivered in three gated phases, each dispatched to cli-opencode and verified before the next.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- 012 research present and converged (`config.status=complete`).
- Clean recovery baseline commit recorded; daemon source unmodified at phase start.
- cli-opencode `openai` provider configured (`opencode providers list` preflight).

### Definition of Done (per phase)
- `tsc --noEmit` passes for `mcp_server/` with zero new errors.
- Spec-kit test suite passes (or the phase-relevant subset, with full suite before the final completion claim).
- The phase's success criteria (spec.md §5) demonstrably met.
- No raw `E429`/`-32001` regression; existing memory search/save behavior unchanged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Eventually-consistent, self-correcting index. Lexical search always available (rows committed `pending`, BM25/FTS-searchable); vectors converge in the background; moves/orphans heal automatically; one freshness surface answers "is my index healthy?".

### Key Components
- **Coalescer (A1):** `scanKey` = hash of normalized scope + options + DB identity; a repeat call joins the in-flight/recent job (`coalesced:true`). Reuses lease state (`db-state.ts:443/456`).
- **Phased job (A2):** bounded walk → commit-lexical (per-tick cap) → async vector drain. Reuses `embedder_status` job model (`reindex.ts`).
- **Single-writer (A3):** atomic claim-by-update (`retry-manager.ts:303`) for work items; heartbeat + lease-epoch recovery; per-worktree DBs independent.
- **Degraded-mode (A4):** async-mode indexing (`embedding-pipeline.ts:140` → `vector-index-mutations.ts:337`); drain checks composed provider/circuit state before pending→retry claim.
- **Self-heal (A5):** bounded orphan sweep (reuses `delete_memory_from_database()` `vector-index-mutations.ts:577-627`); move reconcile by `packet_id` + doc role/anchor; `memory_health.index` block; triggers feeding the coalescer.

### Data Flow
caller → coalescer (scanKey) → job (walk → commit-lexical → return envelope) → async drain (provider-checked vector embedding) → completion → orphan sweep + move reconcile → `memory_health.index` reflects freshness.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Coalescing Contract + Health + Orphan Sweep
- Convert the raw `E429` return (`memory-index.ts:245-260`) into a success envelope `{jobId, scanKey, status, phase, coalesced, nextPollAfterMs}` that joins the in-flight/recent job using the existing lease reason (`lease_active` vs `cooldown`).
- Add a `memory_health.index` block (`memory-crud-health.ts`): single `summary` enum + counts (on-disk delta, orphan/pending/retry/failed, last-scan age).
- Add a bounded global orphan sweep (ungated from scan scope) in `lib/storage/incremental-index.ts`, reusing `delete_memory_from_database()` — never a raw `memory_index` delete; paged + per-tick cap.

### Phase 2: Phased Async Execution + Degraded-Mode
- Flip scan indexing to async mode so lexical commits without the provider; vectors drain after the request returns.
- Implement the 3-phase job boundary (`lexical_complete` / `complete_with_pending_vectors`) with per-tick caps + continuation.
- Vector drain checks composed provider/circuit state BEFORE the atomic pending→retry claim (`retry-manager.ts:303`); surface `degraded` + `nextVectorAttemptAfter`.

### Phase 3: Single-Writer Concurrency + Move Reconciliation
- Job-layer single-writer via atomic claim-by-update work items; heartbeat + lease-epoch recovery.
- Move reconciliation: match vanished→new path by `packet_id` + doc role/anchor (unique-match guard; content hash confirmation only); update row path in place; else delete+add.
- Auto-reindex triggers (lazy reconcile-on-`File not found`, watcher→queue, post-commit stale marker) feeding the A1 coalescer.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | `mcp_server/` typecheck after every phase (HARD gate) | `npm run typecheck` (`tsc --noEmit`) |
| Unit/integration | scan handler, lease/coalescing, health surface, orphan/stale cleanup, embedding pipeline | vitest (targeted files) |
| Behavioral smoke | repeat-scan coalescing, `force` scan on 026 root, health index block, renest orphan removal | manual, against a deliberately restarted daemon only |
| Regression | existing memory_search / memory_save unchanged (additive contract) | vitest + manual |

Targeted vitest files to extend: `tests/handler-memory-index-cooldown.vitest.ts`, `tests/incremental-index.vitest.ts`, `tests/incremental-index-v2.vitest.ts`, `tests/safety.vitest.ts`. The live daemon is never the test target mid-phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `embedder_status` job model (`lib/embedders/reindex.ts`) | Internal | Green | reuse for scan job; reimplement if absent |
| `pending`/`retry` + atomic claim (`lib/providers/retry-manager.ts:303`) | Internal | Green | single-writer + outage-safe drain |
| deferred lexical upsert (`lib/search/vector-index-mutations.ts:337`) | Internal | Green | lexical-first commit |
| `delete_memory_from_database()` (`vector-index-mutations.ts:577-627`) | Internal | Green | safe orphan deletion |
| cli-opencode `openai/gpt-5.5 --variant high` | External | Green | executor for each phase |
| 012 research (`research/research.md`) | Internal | Green | canonical design source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a dispatch goes off-scope, a gate (`tsc`/tests) fails, or a merged phase regresses.
- **Procedure**: discard the worktree diff before merge (no production impact); for a merged phase, `git revert <phase-commit>` (additive contract keeps earlier phases functional), then rebuild `dist/` + restart the daemon as a discrete step.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Coalescing + Health + Sweep) ──► Phase 2 (Phased async + Degraded) ──► Phase 3 (Concurrency + Move reconcile)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | 012 research (design) | Phase 2 |
| Phase 2 | Phase 1 (coalescing contract) | Phase 3 |
| Phase 3 | Phase 2 (phased job + async-mode) | None |

Strictly sequential: each phase builds on the prior contract; no cross-phase parallel dispatch (single-dispatch discipline + shared daemon source).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Coalescing + Health + Orphan sweep | Med | 1 cli-opencode dispatch + verify |
| Phase 2 — Phased async + Degraded-mode | High | 1-2 dispatches (job state machine + async-mode flip) |
| Phase 3 — Concurrency + Move reconcile + Triggers | High | 1-2 dispatches (claim-by-update + move identity + triggers) |
| **Total** | High | **3-5 gated dispatches, verified phase-by-phase** |

Effort is expressed in gated dispatches rather than wall-clock: each phase is one (occasionally two) cli-opencode dispatches followed by a `tsc` + test gate before the next is launched.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [ ] Clean recovery baseline commit recorded (hash) before each phase dispatch.
- [ ] Dispatch runs in an isolated git worktree; agent performs no git writes.
- [ ] BANNED OPS + disjoint allowed-file scope rendered into the dispatch prompt (RM-8).

### Rollback Procedure
1. If a dispatch goes off-scope or the gate fails: discard the worktree diff (do not merge), no production impact.
2. If a merged phase regresses: `git revert <phase-commit>` on `main` (additive contract keeps earlier phases functional).
3. Rebuild `dist/` + restart the daemon as a discrete step to apply the reverted source.
4. Re-confirm `validate.sh --strict` + `tsc` clean before re-dispatching.

### Data Reversal
- **Has data migrations?** No (Phase 1). Phase 2/3 may add job tables — if so, additive-only with a documented down-path.
- **Reversal procedure**: revert the source commit; the index self-heals on the next scan (orphan sweep + reconcile).
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- **Spec**: `spec.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
- **Research source**: `../012-memory-index-scan-ux-hardening/research/research.md`
