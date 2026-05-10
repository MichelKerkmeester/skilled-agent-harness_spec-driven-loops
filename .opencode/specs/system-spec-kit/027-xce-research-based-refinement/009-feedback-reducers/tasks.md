---
title: "Tasks — Phase 009 Shared Feedback Reducers"
description: "T### task list. Sub-Phase 1 (P0 fixes T001-T006) MUST land before Sub-Phases 4/5. Total 35 tasks."
trigger_phrases:
  - "027 phase 009 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-feedback-reducers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T035 task list across 5 sub-phases"
    next_safe_action: "Claim T001 (P0-1: isAutoEdgeCreator predicate)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->
# Tasks: Shared Feedback Reducers

<!-- SPECKIT_LEVEL: 3 -->

---

## NOTATION

`T###` = Task ID • `REQ-NNN` = spec requirement • `[X]` complete | `[ ]` pending | `[~]` in progress

---

## SUB-PHASE 1 — P0 PRECONDITION FIXES (MUST land first)

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 1 | [ ] | T001 | P0-1: introduce `isAutoEdgeCreator(createdBy: string): boolean` helper in `causal-edges.ts` | REQ-001 | `mcp_server/lib/storage/causal-edges.ts` (modified, lines 269-288) | Helper exported; logic accepts `'auto'` and `'auto-*'` prefix |
| 2 | [ ] | T002 | P0-1: replace exact-match check in `consolidation.ts:352-359` | REQ-001 | `mcp_server/lib/storage/consolidation.ts` (modified) | Hebbian gating uses helper |
| 3 | [ ] | T003 | P0-2: add manual-edge overwrite guard in `insertEdge` upsert | REQ-002 | `mcp_server/lib/storage/causal-edges.ts:313-338` (modified) | Existing manual edge → reducer skip with `{updated: false, reason: 'manual-edge-protected'}` |
| 4 | [ ] | T004 | P0-3: extend `RetentionExpiredRow` interface with tier fields | REQ-003 | `mcp_server/lib/governance/memory-retention-sweep.ts:17-28` (modified) | Schema: `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, `last_accessed` |
| 5 | [ ] | T005 | P0-3: rewrite `selectExpiredRows` SQL to include tier columns | REQ-003 | `memory-retention-sweep.ts:52-68` (modified) | JOIN/include tier columns in SELECT |
| 6 | [ ] | T006 | Author dedicated tests for P0-1 / P0-2 / P0-3 | REQ-001, 002, 003 | `mcp_server/__tests__/storage/causal-edges-auto-provenance.vitest.ts` (NEW), `insert-edge-manual-guard.vitest.ts` (NEW), `mcp_server/__tests__/governance/retention-sweep-tier.vitest.ts` (NEW) | All 3 test files green; no regression in existing suites |

## SUB-PHASE 2 — SHARED AGGREGATION

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 7 | [ ] | T007 | Create `feedback-aggregation.ts` reducer | REQ-004 | `mcp_server/lib/feedback/feedback-aggregation.ts` (NEW) | Pure function; aggregates by memory_id; signature stable |
| 8 | [ ] | T008 | Implement weighted-positive formula | REQ-005 | `feedback-aggregation.ts` (same) | `weightedHitCount = max(0, strong + 0.25 * same_topic_requery - 0.5 * query_reformulated)` |
| 9 | [ ] | T009 | Idempotency guarantee for identical inputs | REQ-006 | `feedback-aggregation.ts` (same) | Run-twice test passes |
| 10 | [ ] | T010 | Author aggregation tests (formula edge cases + idempotency) | REQ-005, REQ-006 | `mcp_server/__tests__/feedback/aggregation.vitest.ts` (NEW) | All edge cases green |

## SUB-PHASE 3 — CONSUMER A: COCO RERANK WEIGHTS

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 11 | [ ] | T011 | Create Python `feedback_reducer.py` | REQ-007 | `mcp-coco-index/mcp_server/cocoindex_code/feedback_reducer.py` (NEW) | Reads JSONL line-by-line; parses JSON; aggregates by (intent_tag, path_class) |
| 12 | [ ] | T012 | Derive `path_class` from `resultFile` via `classify_path()` reuse | REQ-008 | `feedback_reducer.py` (same) | Path class derivation matches indexer |
| 13 | [ ] | T013 | Create SQLite `feedback_rerank_weights` table + lookup helper | REQ-009 | `mcp-coco-index/mcp_server/cocoindex_code/feedback_rerank_table.py` (NEW) | Schema migration + cached lookup |
| 14 | [ ] | T014 | Implement reducer formula with min support + clamped delta | REQ-010 | `feedback_reducer.py` (same) | Min support: 5 events OR 3 distinct queries; `delta = clamp(±0.10)` |
| 15 | [ ] | T015 | Apply clamped delta in `_ranked_result()` at `query.py:177-223` | REQ-011 | `mcp-coco-index/mcp_server/cocoindex_code/query.py` (modified) | Signal `feedback_rerank_delta:+0.04:path_class=implementation:intent=general` |
| 16 | [ ] | T016 | Cold-start + missing-table + below-min-support → `delta=0` | REQ-012 | `feedback_reducer.py` + `query.py` (modified) | No-op tests pass |
| 17 | [ ] | T017 | Privacy: aggregate-only schema; no comment text in learned table | REQ-013 | `feedback_rerank_table.py` schema review | Grep absence of comment fields |
| 18 | [ ] | T018 | Feature flag `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0` | REQ-014 | `mcp_server/ENV_REFERENCE.md` (modified) + flag gate in `query.py` | Flag-off behavior unchanged |
| 19 | [ ] | T019 | Author Consumer A tests | REQ-007..014 | `mcp-coco-index/tests/test_feedback_reducer.py` (NEW) | All paths green |

## SUB-PHASE 4 — CONSUMER B: SESSION-TRACE CAUSAL EDGES

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 20 | [ ] | T020 | Create `session-trace-causal-reducer.ts` | REQ-015 | `mcp_server/lib/feedback/session-trace-causal-reducer.ts` (NEW) | Reducer signature stable; reads feedback_events ordered |
| 21 | [ ] | T021 | Source selection algorithm: prefer same-query, fall back to recent prior session-shown, cap at 5 | REQ-016 | `session-trace-causal-reducer.ts` (same) | Selection deterministic; cap enforced |
| 22 | [ ] | T022 | Emit `ENABLED(A → B)` at strength 0.3 with `created_by='auto-session'` | REQ-017 | `session-trace-causal-reducer.ts` (same) | Edge created at exact 0.3; provenance correct |
| 23 | [ ] | T023 | DEFERRED invocation hooks: consolidation cycle + explicit MCP maintenance tool | REQ-018 | `consolidation.ts` end-of-cycle + new MCP tool `runSessionTraceReducer` | Code review: no live invocation paths |
| 24 | [ ] | T024 | Manual-edge guard (depends on P0-2): query existing first | REQ-019 | `session-trace-causal-reducer.ts` (same) | Test: pre-existing manual NOT overwritten |
| 25 | [ ] | T025 | Idempotency per `(session_id, A, B)`; bump strength ≤0.05 clamped to 0.5 | REQ-020 | `session-trace-causal-reducer.ts` (same) | Run-twice test |
| 26 | [ ] | T026 | Caps: ≤5 sources/citation, MAX_EDGES_PER_NODE=20, CAP_PER_WINDOW=100 | REQ-021 | `session-trace-causal-reducer.ts` (same) | Cap tests for each |
| 27 | [ ] | T027 | Feature flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false` | REQ-022 | `ENV_REFERENCE.md` + flag gate | Flag-off: no edges created |
| 28 | [ ] | T028 | Author Consumer B tests | REQ-015..022 | `mcp_server/__tests__/feedback/session-trace-causal.vitest.ts` (NEW) | All paths green |

## SUB-PHASE 5 — CONSUMER C: LEARNED RETENTION/DECAY

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 29 | [ ] | T029 | Create `feedback-retention-reducer.ts` consuming Sub-Phase 2 + extended `RetentionExpiredRow` | REQ-023 | `mcp_server/lib/feedback/feedback-retention-reducer.ts` (NEW) | Reducer composes shared aggregation |
| 30 | [ ] | T030 | Implement RetentionDecision rules (5 cases) | REQ-024 | `feedback-retention-reducer.ts` (same) | All 5 cases tested; logic per spec table |
| 31 | [ ] | T031 | Create `edge-tier-basement.ts` helper with narrow scope | REQ-025 | `mcp_server/lib/feedback/edge-tier-basement.ts` (NEW) | Floor only for manual + both-endpoints-high-tier (or constitutional-chain evidence) |
| 32 | [ ] | T032 | `dryRun` path returns decisions without writes | REQ-026 | `feedback-retention-reducer.ts` (same) | dryRun=true test; no DB writes |
| 33 | [ ] | T033 | Promotion gate copying `shadow-scoring.ts` weekly cycle | REQ-027 | `feedback-retention-reducer.ts` (same) | Live mutation requires shadow eval window |
| 34 | [ ] | T034 | Sweep integration in `memory-retention-sweep.ts` consuming reducer decisions | REQ-028 | `mcp_server/lib/governance/memory-retention-sweep.ts` (modified) | Integration tests for delete/extend/protect |
| 35 | [ ] | T035 | Feature flags + tests | REQ-029 | `ENV_REFERENCE.md` + flag gates + `mcp_server/__tests__/feedback/retention-reducer.vitest.ts` (NEW) + `edge-floor-narrow.vitest.ts` (NEW) | All flag matrices green |

---

## TASK DEPENDENCIES

```
Sub-Phase 1 (P0 fixes):  T001 ─→ T002 ─→ T003 ─→ T004 ─→ T005 ─→ T006
                                              ↓                          ↓
Sub-Phase 2:               T007 ─→ T008 ─→ T009 ─→ T010                  │
                              │                                            │
              ┌───────────────┴───────────────────────────┐                │
              ▼                                            ▼                │
Sub-Phase 3 (Consumer A — independent of P0 fixes):                        │
              T011 ─→ T012 ─→ T013 ─→ T014 ─→ T015 ─→ T016 ─→ T017 ─→ T018 ─→ T019
                                                                            │
Sub-Phase 4 (Consumer B — depends on P0-1 + P0-2):                          │
              T020 ─→ T021 ─→ T022 ─→ T023 ─→ T024 ─→ T025 ─→ T026 ─→ T027 ─→ T028
                                                                            │
Sub-Phase 5 (Consumer C — depends on P0-3 + Sub-Phase 2):                   │
              T029 ─→ T030 ─→ T031 ─→ T032 ─→ T033 ─→ T034 ─→ T035 ←────────┘
```

Sub-Phase 1 (T001-T006) BEFORE Sub-Phase 4 + Sub-Phase 5.
Sub-Phase 2 (T007-T010) BEFORE Sub-Phase 5.
Sub-Phase 3 (Consumer A) is independent — can run in parallel after T001 lands.

---

## TOTAL EFFORT

- ~400-650 production LOC across 7+ new files (TS + Python).
- ~480-810 test LOC across 8+ new test files.
- 35 tasks; ~30-50 hours estimated wall.

---

<!-- L3 STRUCTURAL APPENDIX -->

<!-- ANCHOR:notation -->
## TASK NOTATION

See "NOTATION" section above.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

See first sub-phase tasks above (e.g. Sub-Phase 1 in tasks listing). Includes schema migrations, interface extraction, precondition fixes per phase.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

See implementation sub-phase tasks above. Includes consumer logic, integration seams, adapter layers per phase.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

See final sub-phase tasks above + `checklist.md` verification commands. Includes telemetry, tests, docs, ENV_REFERENCE updates.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- All T### tasks above marked `[X]` complete.
- All `checklist.md` P0 items green.
- Strict spec validation passes.
- Phase-006 eval gate documented (if applicable for active-mode rollout).
- `implementation-summary.md` filled with file:line evidence.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` (REQ-NNN list)
- `plan.md` (sub-phases, risk matrix, success metrics)
- `decision-record.md` (ADRs)
- `checklist.md` (CHK-### verification)
- `resource-map.md` (file inventory)
- `../research/027-xce-research-pt-03/research.md` (pt-03 source)
<!-- /ANCHOR:cross-refs -->
