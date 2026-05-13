---
title: "Tasks — Phase 010 Retrieval Rerank Clients"
description: "T### task list: 4 sub-phases (interface extraction, memory adapter, Coco adapter, telemetry+docs)."
trigger_phrases:
  - "027 phase 010 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T018 task list"
    next_safe_action: "Claim T001 (RerankClient interface)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->
# Tasks: Retrieval Rerank Clients (Shared Interfaces)

<!-- SPECKIT_LEVEL: 3 -->

---

## SUB-PHASE 1 — INTERFACE EXTRACTION

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 1 | [ ] | T001 | Define `RerankClient<T>` generic interface | REQ-001 | `mcp_server/lib/search/rerank-client.ts` (NEW) | Interface type-checks; preserves cross-encoder semantics |
| 2 | [ ] | T002 | Define `EmbeddingCacheClient` interface | REQ-005 | `mcp_server/lib/cache/embedding-cache-client.ts` (NEW) | Interface type-checks; preserves embedding-cache semantics |
| 3 | [ ] | T003 | Author interface contract tests rejecting abstraction-boundary violations | REQ-008, REQ-013 | `mcp_server/__tests__/search/rerank-client-contract.vitest.ts` (NEW) | Tests reject memory-tier or code-chunk fields in shared client calls |

## SUB-PHASE 2 — MEMORY ADAPTER SWAP

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 4 | [ ] | T004 | `cross-encoder.ts` implements `RerankClient<MemoryDocument>` | REQ-001 | `mcp_server/lib/search/cross-encoder.ts` (modified) | Type implements interface; tests unchanged |
| 5 | [ ] | T005 | `embedding-cache.ts` implements `EmbeddingCacheClient` | REQ-005 | `mcp_server/lib/cache/embedding-cache.ts` (modified) | Type implements interface |
| 6 | [ ] | T006 | `stage3-rerank.ts` consumes `RerankClient<MemoryRow>` via DI | REQ-002 | `mcp_server/lib/search/pipeline/stage3-rerank.ts:410-465` (modified) | Constructor takes RerankClient; default = current cross-encoder |
| 7 | [ ] | T007 | Diff test: memory rerank output bit-identical pre/post adapter swap | REQ-002, REQ-011 | `mcp_server/__tests__/search/memory-rerank-adapter.vitest.ts` (NEW) | Snapshot diff empty |

## SUB-PHASE 3 — COCO RERANK ADAPTER

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 8 | [ ] | T008 | Decide Python adapter vs TS bridge (resolve open question) | n/a | architectural decision | Documented in ADR or commit message |
| 9 | [ ] | T009 | Create Coco rerank adapter (Python or TS bridge) | REQ-003 | `mcp-coco-index/mcp_server/cocoindex_code/rerank_adapter.py` (NEW, Python option) OR new TS bridge module | Adapter type-checks; preserves score-origin + rankingSignals |
| 10 | [ ] | T010 | Integrate optional rerank stage in `query.py` after `_dedup_and_rank_rows()` | REQ-007 | `mcp-coco-index/mcp_server/cocoindex_code/query.py` (modified) | Flag-gated; standalone behavior unchanged when off |
| 11 | [ ] | T011 | Adapter test: round-trip preserves all telemetry fields | REQ-004 | `mcp-coco-index/tests/test_rerank_adapter.py` (NEW) OR vitest equivalent | Round-trip test green |
| 12 | [ ] | T012 | Diff test: Coco flag-off output bit-identical to current | REQ-012 | new test file in coco tests | Snapshot diff empty |

## SUB-PHASE 4 — TELEMETRY + TESTS + DOCS

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 13 | [ ] | T013 | Add cross-backend overlap telemetry events | REQ-006 | `mcp_server/lib/search/cross-encoder.ts` + `lib/cache/embedding-cache.ts` (modified) | 3 events fire on appropriate conditions |
| 14 | [ ] | T014 | Telemetry size budget < 50B per event | REQ-016 | event-size snapshot test | All 3 events under budget |
| 15 | [ ] | T015 | Author cross-backend telemetry test | REQ-006 | `mcp_server/__tests__/search/cross-backend-telemetry.vitest.ts` (NEW) | Telemetry events verified |
| 16 | [ ] | T016 | Author circuit-breaker fallback test | REQ-010 | `mcp_server/__tests__/search/circuit-breaker-fallback.vitest.ts` (NEW) | Mock-failure test green; signal `provider: 'fallback-score-only'` present |
| 17 | [ ] | T017 | ENV_REFERENCE.md documents `SPECKIT_COCO_USE_SHARED_RERANK` flag | REQ-015 | `mcp_server/ENV_REFERENCE.md` (modified) | grep verification |
| 18 | [ ] | T018 | Documentation for future RQ-A5 fusion consumer | REQ-014 | `mcp_server/lib/search/README.md` OR `rerank-client.ts` header (modified) | Section explains composability + abstraction boundary |

---

## TASK DEPENDENCIES

```
T001 ─→ T002 ─→ T003
            ↓
            T004 ─→ T005 ─→ T006 ─→ T007
                                          ↘
                                           T008 ─→ T009 ─→ T010 ─→ T011 ─→ T012
                                                                                    ↘
                                                                                     T013 ─→ T014 ─→ T015 ─→ T016 ─→ T017 ─→ T018
```

---

## TOTAL EFFORT

- ~250-420 production LOC across interfaces + adapters + telemetry.
- ~120-220 test LOC across 5+ test files.
- 18 tasks; ~12-18 hours estimated wall.

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
