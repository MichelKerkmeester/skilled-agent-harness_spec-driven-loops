---
title: "Tasks: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)"
description: "Task breakdown for the staged code-graph generation watermark: Q6-C2 soft additive counter (PENDING, ready-to-implement) and Q6-C1 hard as-of-generation gate (PENDING, DEFER-speculative). All candidates absent from the 030 Wave-0 shipped record."
trigger_phrases:
  - "code graph generation watermark tasks"
  - "q6-c2 q6-c1 task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 tasks for the Q6 generation-watermark pair"
    next_safe_action: "Begin Phase 2 Q6-C2 tasks T006-T010"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-003-generation-watermark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Code Graph — Generation Watermark (Q6-C2 → Q6-C1)

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

**Per-candidate status** (cross-checked against `../../../030-memory-search-intelligence-impl/spec.md` §14 and `git log --oneline 1ecc531431..ab5459fb6d`):

| Candidate | Status | Gate / Evidence |
|-----------|--------|-----------------|
| Q6-C2 (soft watermark) | **PENDING** | Not in 030 §14; only code-graph commit in Wave-0 range is `e21caf5de6` (Q4-C1). Ready-to-implement; gate: confirm live finalize-block lines. |
| Q6-C1 (hard as-of-generation gate) | **PENDING — DEFER-speculative** | Not in 030 §14. Gate: needs the Q1-C1 bi-temporal cluster (`SCHEMA_VERSION` 5→6) + a named consumer; redundant with the shipped readiness gate (synthesis `01` L24, `04` L27). |
| Q6-C1-generation-watermark (close-out key) | **PENDING** | The monotonic key Q1-C1 close-outs need (today they key on non-monotonic `new Date().toISOString()` — research iter-11). Delivered by Q6-C2's counter; consumed only when Q1-C1 lands. |

> NOTE: the 030 "Q6-anchor FIX" (`738e118751`) is the **Deep Loop** strategy-template anchor fix — a different subsystem's Q6, NOT this code-graph generation watermark. The Q6 label collides across subsystems.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Confirm live seams.

- [x] T001 Confirm the REFUTED bump site: `ensure-ready.ts:497` is `setLastGitHead(currentHead)` inside the `headChanged && headScope==='out-of-scope'` return-`fresh` branch — does NOT fire on `full_scan`/`selective_reindex` (verified during planning; research iter-23/24, roadmap BROADENING L220)
- [x] T002 Confirm the correct bump site: `handlers/scan.ts` `if (scanPromotable)` finalize block (~`:666-679`), beside `setLastGitHead` (`:672`) and `setCodeGraphScope` (`:679`) — fires after both full and selective promotion (verified during planning)
- [x] T003 Confirm storage substrate: `code_graph_metadata` KV table present (`code-graph-db.ts:193`/`:456`), stores strings only; `Number.parseInt`-with-fallback precedent at `:241`; helper export block ~`:556-627` (verified during planning)
- [x] T004 Confirm PENDING baseline: zero `bumpCodeGraphGeneration`/`getCodeGraphGeneration`/`graph_generation` tokens in `system-code-graph/mcp_server` (grep returned empty during planning)
- [ ] T005 Re-confirm the live line numbers at implementation time (files drift): `scanPromotable` block in `handlers/scan.ts`, freshness envelope type at `code-graph-context.ts:52`, `computeFreshness()` ~`:320`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Q6-C2 soft watermark (PENDING).

- [ ] T006 Add `getCodeGraphGeneration(): number` — read `graph_generation` via `getMetadata`, `parseInt(value, 10) || 0` (malformed/unset → 0) (`code-graph-db.ts`)
- [ ] T007 Add `bumpCodeGraphGeneration(): number` — read current, `setMetadata('graph_generation', String(n+1))`, return n+1; export beside `setLastGitHead`/`getLastGitHead` (`code-graph-db.ts`)
- [ ] T008 Call `graphDb.bumpCodeGraphGeneration()` once inside the `if (scanPromotable)` finalize block (`handlers/scan.ts` ~`:666-679`) — NOT at `ensure-ready.ts:497`
- [ ] T009 Add `generation: number` to the freshness envelope type (`code-graph-context.ts` ~`:52`)
- [ ] T010 Stamp `generation: getCodeGraphGeneration()` (default 0) in `computeFreshness()` so it flows to both the main result (`:258`) and empty-fallback (`:285`) envelopes (`code-graph-context.ts` ~`:320-329`)
- [ ] T011 [B] (Q6-C1, DEFER-speculative — do NOT implement) as-of-generation hard error gate replacing the binary `freshness !== 'fresh'` block at `handlers/query.ts:903-915`; blocked on Q1-C1 cluster + named consumer. Design captured in spec §3/§6; no code this phase.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Unit: `getCodeGraphGeneration()` returns 0 when unset and on a malformed KV value; `bumpCodeGraphGeneration()` increments 0→1→2
- [ ] T013 Integration: a promoted `full_scan` bumps; a promoted `selective_reindex` bumps; a non-promoting scan (`scanPromotable` false) leaves the counter unchanged (apply-once G2, REQ-004)
- [ ] T014 Behavior: a `code_graph_context` result carries `metadata.freshness.generation` equal to the counter, and the returned node/edge set is byte-identical to baseline (no read-filter change, REQ-003)
- [ ] T015 `node --check` / `tsc` clean; vitest green
- [ ] T016 Reconcile spec/plan/tasks; record Q6-C1 DEFER-speculative gate and the Q1-C1 close-out-key linkage (REQ-005)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Q6-C2 tasks (T001-T010, T012-T016) marked `[x]`
- [ ] T011 remains `[B]` by design (Q6-C1 DEFER-speculative) — recorded, not implemented
- [ ] Manual verification passed: two scans advance `generation` in the context envelope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md`; iter-21 (Q6-C2 build sketch), iter-23/24 (bump-site refutation)
- **Shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Q6 pair absent → PENDING)
<!-- /ANCHOR:cross-refs -->

---
