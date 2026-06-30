---
title: "Tasks: Code Graph - Generation Watermark (Q6-C2 → Q6-C1)"
description: "Task breakdown for the staged code-graph generation watermark: Q6-C2 soft additive counter is done, while the Q6-C1 hard as-of-generation gate remains PENDING and DEFER-speculative."
trigger_phrases:
  - "code graph generation watermark tasks"
  - "q6-c2 q6-c1 task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark"
    last_updated_at: "2026-06-19T08:16:05Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Q6-C2 soft watermark and verified the generation counter"
    next_safe_action: "Leave Q6-C1 hard gate pending until Q1-C1 schema work has a named consumer"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Tasks: Code Graph, Generation Watermark (Q6-C2 → Q6-C1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

**Per-candidate status** (cross-checked against `git log --oneline 1ecc531431..ab5459fb6d`):

| Candidate | Status | Gate / Evidence |
|-----------|--------|-----------------|
| Q6-C2 (soft watermark) | **DONE** | Implemented in `code-graph-db.ts`, `handlers/scan.ts`, `code-graph-context.ts`. Verified by `tsc --noEmit`, targeted Vitest and mutation falsifier. |
| Q6-C1 (hard as-of-generation gate) | **PENDING - DEFER-speculative** | Not in 030 §14. Gate: needs the Q1-C1 bi-temporal cluster (`SCHEMA_VERSION` 5→6) + a named consumer, redundant with the shipped readiness gate (synthesis `01` L24, `04` L27). |
| Q6-C1-generation-watermark (close-out key) | **DONE for key production, consumer pending** | Q6-C2 now produces the monotonic `generation` key. Q1-C1 consumption remains gated with the hard gate. |

> NOTE: the 030 "Q6-anchor FIX" (`738e118751`) is the **Deep Loop** strategy-template anchor fix, a different subsystem's Q6, NOT this code-graph generation watermark. The Q6 label collides across subsystems.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Confirm live seams.

- [x] T001 Confirm the REFUTED bump site: `ensure-ready.ts:497` is `setLastGitHead(currentHead)` inside the `headChanged && headScope==='out-of-scope'` return-`fresh` branch, does NOT fire on `full_scan`/`selective_reindex` (verified during planning, research iter-23/24, roadmap BROADENING L220)
- [x] T002 Confirm the correct bump site: `handlers/scan.ts` `if (scanPromotable)` finalize block (~`:666-679`), beside `setLastGitHead` (`:672`) and `setCodeGraphScope` (`:679`), fires after both full and selective promotion (verified during planning)
- [x] T003 Confirm storage substrate: `code_graph_metadata` KV table present (`code-graph-db.ts:193`/`:456`), stores strings only, `Number.parseInt`-with-fallback precedent at `:241`, helper export block ~`:556-627` (verified during planning)
- [x] T004 Confirm PENDING baseline: zero `bumpCodeGraphGeneration`/`getCodeGraphGeneration`/`graph_generation` tokens in `system-code-graph/mcp_server` (grep returned empty during planning)
- [x] T005 Re-confirm the live seams at implementation time: `scanPromotable` block in `handlers/scan.ts`, freshness envelope type in `code-graph-context.ts`, `computeFreshness()` (`rg`/direct read evidence)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Q6-C2 soft watermark (DONE).

- [x] T006 Add `getCodeGraphGeneration(): number`, read `graph_generation` via `getMetadata`, `parseInt(value, 10) || 0` (malformed/unset → 0) (`code-graph-db.ts`, covered by `code-graph-db.vitest.ts`)
- [x] T007 Add `bumpCodeGraphGeneration(): number`, read current, `setMetadata('graph_generation', String(n+1))`, return n+1, export beside existing metadata helpers (`code-graph-db.ts`, covered by `code-graph-db.vitest.ts`)
- [x] T008 Call `graphDb.bumpCodeGraphGeneration()` once inside the `if (scanPromotable)` finalize block (`handlers/scan.ts`), NOT at `ensure-ready.ts:497` (covered by `code-graph-scan.vitest.ts`)
- [x] T009 Add `generation: number` to the freshness envelope type (`code-graph-context.ts`, covered by typecheck)
- [x] T010 Stamp `generation: getCodeGraphGeneration()` (default 0) in `computeFreshness()` so it flows to both main and empty-fallback envelopes (`code-graph-context.ts`, covered by `code-graph-context-handler.vitest.ts`)
- [ ] T011 [B] (Q6-C1, DEFER-speculative, do NOT implement) as-of-generation hard error gate replacing the binary `freshness !== 'fresh'` block at `handlers/query.ts:903-915`, blocked on Q1-C1 cluster + named consumer. Design captured in spec §3/§6, no code this phase.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Unit: `getCodeGraphGeneration()` returns 0 when unset and on a malformed KV value, `bumpCodeGraphGeneration()` increments 0→1→2 (`code-graph-db.vitest.ts`)
- [x] T013 Integration: a promoted `full_scan` bumps, a promoted `selective_reindex` bumps, a non-promoting scan leaves the counter unchanged (`code-graph-scan.vitest.ts`)
- [x] T014 Behavior: a `code_graph_context` result carries `metadata.freshness.generation` equal to the counter, and the returned node/edge set is byte-identical to baseline (`code-graph-context-handler.vitest.ts`)
- [x] T015 `tsc --noEmit` clean, targeted Vitest green (`4` files / `64` tests plus real-scan smoke `1` file / `5` tests)
- [x] T016 Reconcile spec/plan/tasks, record Q6-C1 DEFER-speculative gate and the Q1-C1 close-out-key linkage (REQ-005)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Q6-C2 tasks (T001-T010, T012-T016) marked `[x]`
- [x] T011 remains `[B]` by design (Q6-C1 DEFER-speculative), recorded, not implemented
- [x] Automated verification passed: two promoted scan modes advance `generation`, non-promoting scan leaves it unchanged and context carries the counter
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md`, iter-21 (Q6-C2 build sketch), iter-23/24 (bump-site refutation)
- **Shipped record**: Wave-0 record (Q6 pair absent → PENDING)
<!-- /ANCHOR:cross-refs -->

---
