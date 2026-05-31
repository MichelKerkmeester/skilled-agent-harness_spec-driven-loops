---
title: "Tasks — Phase 007 Memory Semantic Triggers"
description: "T### task list mapping spec REQ-NNN to file paths + acceptance criteria. Four sub-phases (schema/backfill, matcher, hybrid handler, tests/goldens/shadow eval)."
trigger_phrases:
  - "027 phase 007 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-semantic-trigger-fallback"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T020 task list"
    next_safe_action: "Claim T001 (schema migration)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->
# Tasks: Semantic Trigger Fallback (Hybrid)

<!-- SPECKIT_LEVEL: 3 -->

---

## NOTATION

`T###` = Task ID • `REQ-NNN` = spec requirement • `[X]` complete | `[ ]` pending | `[~]` in progress

---

## SUB-PHASE 1 — SCHEMA + BACKFILL

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 1 | [ ] | T001 | Add `memory_trigger_embeddings` table to schema | REQ-004 | `mcp_server/lib/storage/vector-index-schema.ts` (modified) | Migration test passes; `(memory_id, phrase_hash)` primary key |
| 2 | [ ] | T002 | Implement BLOB embedding storage reuse via existing `embedding_cache` | REQ-004 | `mcp_server/lib/cache/embedding-cache.ts` (analyzed) | Lookup by `phrase_hash + model_id + dimensions` returns BLOB |
| 3 | [ ] | T003 | Add per-memory backfill in `memory_index_scan` handler | REQ-005, REQ-006 | `mcp_server/handlers/memory-index-scan.ts` (modified) | Scan generates trigger embeddings for `embedding_status='pending'` rows |
| 4 | [ ] | T004 | Add save-time embedding hook in `embedding-pipeline.ts` (best-effort, non-blocking) | REQ-006 | `mcp_server/lib/embeddings/embedding-pipeline.ts` (modified) | Save flow not blocked on Voyage failure; `embedding_status='failed'` recorded for retry |

## SUB-PHASE 2 — SEMANTIC MATCHER

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 5 | [ ] | T005 | Create `semantic-trigger-matcher.ts` with cosine + threshold + margin + max gates | REQ-002 | `mcp_server/lib/triggers/semantic-trigger-matcher.ts` (NEW) | Pure function; deterministic ordering; gates enforced |
| 6 | [ ] | T006 | Reuse `memory-summaries.ts` cosine + BLOB-to-Float32 conversion pattern | REQ-002 | `mcp_server/lib/storage/memory-summaries.ts` (cited) | Cosine math identical to existing precedent |
| 7 | [ ] | T007 | Add in-memory trigger embedding cache (loaded on first call; TTL refresh) | REQ-002 | `semantic-trigger-matcher.ts` (NEW) | Cache concurrent-safe; invalidation on `memory_index_scan --force` |
| 8 | [ ] | T008 | Author semantic-matcher unit tests | REQ-002 | `mcp_server/__tests__/triggers/semantic-matcher.vitest.ts` (NEW) | Cosine math verified; gates verified |

## SUB-PHASE 3 — HYBRID HANDLER INTEGRATION

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 9 | [ ] | T009 | Add Stage 2 semantic gate after lexical stage in `memory-triggers.ts` | REQ-002, REQ-009 | `mcp_server/handlers/memory-triggers.ts` (modified, lines ~210-250) | Stage 2 fires only when `SPECKIT_SEMANTIC_TRIGGERS=true` AND lexical empty/weak |
| 10 | [ ] | T010 | Implement strong-command short-circuit (no embed call) | REQ-003 | `memory-triggers.ts` (modified) | Trace assertion: explicit command match → `embed` NOT called |
| 11 | [ ] | T011 | Implement UNION semantics (lexical first, semantic dedup) | REQ-002 | `memory-triggers.ts` (modified) | Unit test: lexical-strong → only lexical; lexical-empty + paraphrase → semantic returned |
| 12 | [ ] | T012 | Add activation guards: lexical=1.0, semantic=min(0.85, score) | REQ-008 | `memory-triggers.ts:360-380` (modified) | Unit test on activation block |
| 13 | [ ] | T013 | Source-tag every match: `matchSource: 'lexical'\|'semantic'`, `semanticScore?: number` | REQ-007 | `memory-triggers.ts` + types | Snapshot test on result envelope |
| 14 | [ ] | T014 | Author hybrid-handler integration tests | REQ-001, REQ-002 | `mcp_server/__tests__/triggers/hybrid-handler.vitest.ts` (NEW) | All scenarios green |
| 15 | [ ] | T015 | Author diff test: flag-off output bit-identical to current | REQ-001 | `mcp_server/__tests__/triggers/lexical-parity.vitest.ts` (NEW) | Snapshot diff empty |

## SUB-PHASE 4 — TESTS + GOLDENS + SHADOW EVAL

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 16 | [ ] | T016 | Create trigger goldens fixture (~40 phrases × {exact, paraphrase, distractor}) | REQ-012 | `mcp_server/__tests__/fixtures/trigger-goldens.json` (NEW) | Coverage spans CJK + Latin; metric targets per fixture |
| 17 | [ ] | T017 | Author cold-start test (phrase without embedding skipped silently) | REQ-011 | `mcp_server/__tests__/triggers/cold-start.vitest.ts` (NEW) | Telemetry `semantic_trigger_skipped_uncached` populated |
| 18 | [ ] | T018 | Author latency-budget test (30-50ms PASS / 100ms WARN preserved) | REQ-013 | `mcp_server/__tests__/triggers/latency-budget.vitest.ts` (NEW) | p95 within WARN budget |
| 19 | [ ] | T019 | Author threshold-tuning test consuming shadow telemetry | REQ-010 | `mcp_server/__tests__/triggers/threshold-tuning.vitest.ts` (NEW) | Threshold-band buckets populated correctly |
| 20 | [ ] | T020 | Document 5 flags in `ENV_REFERENCE.md` | REQ-009 | `mcp_server/ENV_REFERENCE.md` (modified) | All 5 documented with defaults |

---

## TASK DEPENDENCIES

```
T001 ─→ T002 ─→ T003 ─→ T004
                              ↘
T005 ─→ T006 ─→ T007 ─→ T008    T016 (parallel-safe with T001+)
                              ↘
T009 ─→ T010 ─→ T011 ─→ T012 ─→ T013 ─→ T014 ─→ T015
                                                       ↘
                                                        T017 ─→ T018 ─→ T019 ─→ T020
```

---

## TOTAL EFFORT

- ~280-430 production LOC across schema, matcher, handler, telemetry.
- ~180-280 test LOC across 6 test files + fixtures.
- 20 tasks total; ~15-20 hours estimated wall.

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
- 028/004-code-graph-adoption-eval eval gate documented (if applicable for active-mode rollout).
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
