---
title: "Implementation Plan: memory_index_scan self-maintaining index [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/plan]"
description: "Phased implementation plan for the full 5-angle self-maintaining index design: Phase 1 coalescing contract + health/orphan sweep, Phase 2 phased async execution + degraded-mode, Phase 3 single-writer concurrency + move reconciliation. Each phase gated by tsc build + tests."
trigger_phrases:
  - "memory index scan implementation plan"
  - "013 memory index implementation plan"
  - "memory index phased async scan job plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation"
    last_updated_at: "2026-05-31T15:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phased Level-3 plan"
    next_safe_action: "Dispatch Phase 1 via cli-opencode gpt-5.5 high"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/incremental-index.ts"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: memory_index_scan Self-Maintaining Index

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
The 012 deep-research packet converged on turning `memory_index_scan` into an idempotent, coalescing, phased async scan job (research.md §6). This packet implements that design against the live `mcp_server/` daemon. The daemon is running (7 procs) during development, so edits touch source only; build verification is isolated (`tsc`), and any daemon restart is a discrete, explicit step — never an implicit side effect of an edit.

### Overview
Three gated phases, ordered by UX/hardening per unit effort (research.md §10):
- **Phase 1** — coalescing caller contract (kills the E429 foot-gun) + `memory_health.index` freshness surface + bounded global orphan sweep. Lowest risk, highest immediate UX win, no embedding-pipeline changes.
- **Phase 2** — phased execution (walk → commit-lexical → async vector drain) + async-mode scan indexing (removes the `-32001` timeout class) + outage-safe drain.
- **Phase 3** — job-layer single-writer concurrency + move reconciliation + auto-reindex triggers.

Each phase is dispatched to cli-opencode `openai/gpt-5.5 --variant high` against a clean recovery baseline, then verified by `tsc` + the spec-kit test suite before the next phase is dispatched. The contract is additive: existing completed-response fields are wrapped in job metadata so current callers degrade gracefully.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- 012 research.md present and converged (`config.status=complete`).
- Clean recovery baseline commit recorded; daemon source unmodified at phase start.
- cli-opencode `openai` provider configured (`opencode providers list` preflight).

### Definition of Done (per phase)
- `tsc` build passes for `mcp_server/` with zero new errors.
- Spec-kit test suite passes (or the phase-relevant subset, with full suite before final completion claim).
- The phase's success criteria (spec.md §5) demonstrably met.
- No raw `E429`/`-32001` regression; existing memory search/save behavior unchanged.

### Definition of Done (packet)
- All three phases complete + verified; `validate.sh <folder> --strict` exit 0; `checklist.md` fully checked with evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Eventually-consistent, self-correcting index. Lexical search always available (rows committed `pending`, BM25/FTS-searchable); vectors converge in the background; moves/orphans heal automatically; one freshness surface answers "is my index healthy?".

### Key Components
- **Coalescer (A1):** `scanKey` = hash of normalized scope + options + DB identity. A repeat call joins the in-flight/recent job (`coalesced:true`) instead of erroring. Reuses lease state (`db-state.ts:443/456`).
- **Phased job (A2):** Phase 1 bounded walk → Phase 2 commit-lexical (per-tick cap) → Phase 3 async vector drain. Reuses `embedder_status` job model (`reindex.ts:78/592/658`).
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
- Add a `memory_health.index` block to the handler (`memory-crud-health.ts`, response near `:308`/`:792`): single `summary` enum + counts (on-disk delta, orphan/pending/retry/failed, last-scan age).
- Add a bounded global orphan sweep (ungated from scan scope) in `incremental-index.ts`, reusing `delete_memory_from_database()` — never a raw `memory_index` delete; paged + per-tick cap.
- **Gate:** `tsc` + tests; back-to-back scans both succeed; `memory_health.index` populated; renested orphan rows removed.

### Phase 2: Phased Async Execution + Degraded-Mode
- Flip scan indexing to async mode so lexical commits without the provider; vectors drain after the request returns.
- Implement the 3-phase job boundary (`lexical_complete` / `complete_with_pending_vectors`) with per-tick caps + continuation.
- Vector drain checks composed provider/circuit state BEFORE the atomic pending→retry claim (`retry-manager.ts:303`), so an outage never burns clean `pending` rows into prunable `retry` (`:493-519`); surface `degraded` + `nextVectorAttemptAfter`.
- **Gate:** `tsc` + tests; `force` scan on 026 root returns within deadline with `complete_with_pending_vectors`; outage leaves rows `pending`, not `retry`.

### Phase 3: Single-Writer Concurrency + Move Reconciliation
- Job-layer single-writer via atomic claim-by-update work items; heartbeat + lease-epoch recovery for stale workers.
- Move reconciliation: match vanished→new path by `packet_id` + doc role/anchor (unique-match guard; content hash confirmation only); update row path in place (preserve id, vector rowid, embedding, history); else fall back to delete+add.
- Auto-reindex triggers: lazy reconcile-on-`File not found`-search (enqueue bounded verify job, never mutate in result formatting), watcher→queue, post-commit stale marker — all feeding the A1 coalescer.
- **Gate:** `tsc` + full test suite; concurrent callers coordinate; `git mv`'d folder updates path in place without re-embed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Build:** `tsc` on `mcp_server/` after every phase — zero new errors (the stack-appropriate verification gate; HARD per the Iron Law).
- **Unit/integration:** spec-kit vitest suites covering scan handler, lease/coalescing, health surface, orphan/stale cleanup, embedding pipeline. Add targeted tests for: repeat-scan coalescing (no E429), async-mode lexical commit, outage-safe drain (pending not promoted to retry), orphan sweep ungated from scope, move reconciliation unique-match.
- **Behavioral smoke (manual, daemon-coordinated):** two back-to-back `memory_index_scan`; `force` scan on 026 root; `memory_health` index block; renested-folder orphan removal. Run only against a deliberately restarted daemon, never the live one mid-phase.
- **Regression:** existing memory_search / memory_save unchanged; additive contract verified.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Design:** `../012-memory-index-scan-ux-hardening/research/research.md` (canonical).
- **Existing code primitives (reuse, do not reinvent):** `embedder_status` job model (`lib/embedders/reindex.ts`), `pending`/`retry` status + atomic claim (`lib/providers/retry-manager.ts`), deferred lexical upsert (`lib/search/vector-index-mutations.ts:337`), `delete_memory_from_database()` (`:577-627`), lease state (`core/db-state.ts`).
- **Executor:** cli-opencode `openai/gpt-5.5 --variant high` (per `.opencode/skills/cli-opencode/SKILL.md`).
- **Ordering:** Phase 1 → 2 → 3 strictly sequential (each builds on the prior contract); no parallel dispatch across phases (single-dispatch discipline + shared daemon source).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Each phase is one or more scoped commits on `main` with explicit pathspecs; the pre-phase commit hash is the recovery baseline.
- Revert a phase: `git revert <phase-commit>` (or `git reset --hard <baseline>` if unpushed and isolated) — restores the prior daemon source; rebuild + restart daemon to apply.
- The contract is additive (job metadata wraps existing fields), so a partial rollback of a later phase leaves earlier phases functional.
- If a cli-opencode dispatch goes off-scope (RM-8 precedent), the clean baseline + scoped diff review catches it before commit; discard the worktree/diff and re-dispatch with tightened BANNED OPS.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- **Spec**: `spec.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Decisions**: `decision-record.md`
- **Research source**: `../012-memory-index-scan-ux-hardening/research/research.md`
