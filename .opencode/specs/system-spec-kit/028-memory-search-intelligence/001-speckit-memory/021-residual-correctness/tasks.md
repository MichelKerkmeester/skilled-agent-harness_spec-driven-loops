---
title: "Tasks: 015-Residual Correctness — RRF-scale + maintenance-grace TTL (028/001 impl)"
description: "Task Format: T### [P?] Description (file path). Both A4-015-residual and A7-maintenance-grace-ttl are DONE in this phase; packet 030 was not edited."
trigger_phrases:
  - "015 residual correctness tasks"
  - "resolveSearchScore rrf scale tasks"
  - "maintenance marker ttl lease tasks"
  - "phase yield refresh invariant tasks"
  - "wave-0 memory correctness breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the two residual correctness implementation tasks and focused verification"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-021-residual-correctness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 015-Residual Correctness — RRF-scale + maintenance-grace TTL

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Both candidates are DONE in this phase. Packet 030 remains untouched; the current implementation record lives here.

- [x] T001 [P] Read the seams: A4 `handlers/memory-search.ts:494-508` vs the 015 fix `lib/search/confidence-scoring.ts:343,402-403`; A7 `lib/storage/maintenance-marker.ts:23-26,44-51` + lease `mk-spec-memory-launcher.cjs:419,455-456,524-525`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### A4-015-residual (DONE — verify-independently-first; no benchmark, no schema migration, no shared-infra dep)

- [x] T002 Independently verify the residual: confirm the 015 fix is confined to `confidence-scoring.ts` and `resolveSearchScore` is the unpatched re-route path (`handlers/memory-search.ts:494-499`)
- [x] T003 [P] Capture the before baseline: `computeAverageScore` value for a fixed query set (regression-baseline rule)
- [x] T004 Route `resolveSearchScore` through the absolute-relevance read (reuse `resolveAbsoluteRelevance` / `pipeline/types.ts:89-95` where present), gated on `typeof row.similarity === 'number'` (`handlers/memory-search.ts:494-499`)
- [x] T005 Effective-score fallback for lexical-only rows (no `similarity`); never throw on a null similarity (`handlers/memory-search.ts:494-499`)
- [x] T006 Resolve the `> 1 ? candidate / 100` heuristic per the caller inventory — remove if dead, else keep for the raw-cosine path (`handlers/memory-search.ts:499`)
- [x] T007 Capture the after baseline; record the magnitude delta

### A7-maintenance-grace-ttl (DONE — no benchmark, no schema migration; soft cross-module lease read)

- [x] T008 Introduce/locate a shared `LEASE_TTL_MS` (60000) source; derive `MAINTENANCE_MARKER_TTL_MS = LEASE_TTL_MS × K (K=3)` — byte-identical 180000 (`lib/storage/maintenance-marker.ts:23-25`)
- [x] T009 Document the `marker-TTL > 2×-lease-reclaim` invariant (180s > 120s, 60s margin) in the module comment (`lib/storage/maintenance-marker.ts:23-24`)
- [x] T010 Document the phase-yield invariant — "any synchronous phase > TTL/2 must call `maintenance.refresh()`" — in the `refresh()` doc; confirm the existing 200-row / phase-boundary refresh hooks satisfy it (`lib/storage/maintenance-marker.ts:29-31,69-71`)
- [x] T011 Confirm the lease heartbeat, reclaim window, and `shouldAdoptDespiteProbe` guard are untouched (`mk-spec-memory-launcher.cjs:455-456,819-823`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P] A4 unit test: fixture row (RRF ~0.03 + cosine ~0.8) → average on the cosine scale; lexical-only row → effective-score fallback, no throw
- [x] T013 [P] A7 unit test: `MAINTENANCE_MARKER_TTL_MS === ownerLease.ttlMs × K`, `K > 2`, derived `> 2× reclaim window`; `activeUntilMs` still `now + TTL`
- [x] T014 Confirm `tests/launcher-maintenance-guard.vitest.ts` adopt/reap cases still pass; typecheck + build green; A4 before/after magnitude recorded
- [x] T015 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 2 + Phase 3 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A4 reads the 015-calibrated absolute scale; A7 derives the marker TTL from the lease window with both invariants documented; unit + regression verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **A4 research**: `../research/from-008-retrieval-evaluation/deltas/iter-002.jsonl` (`A4-resolveSearchScore-residual`, `A4-similarity-present-gate`)
- **A7 research**: `../research/from-008-retrieval-evaluation/deltas/iter-007.jsonl` (`A7-4-marker-ttl-to-lease-window`, `A7-5-phase-yield-invariant`)
- **Shipped record (neither candidate present)**: `../../../030-memory-search-intelligence-impl/spec.md` §14
<!-- /ANCHOR:cross-refs -->
