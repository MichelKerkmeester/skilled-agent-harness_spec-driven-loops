---
title: "Tasks — Phase 006 Coco-Index Intent Steering"
description: "T### task list mapping spec REQ-NNN to concrete file paths + acceptance criteria. Three implementation phases (classifier, expander, advisor hint) + tests/docs."
trigger_phrases:
  - "027 phase 007 tasks"
  - "coco intent steering tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/006-coco-intent-steering"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T015 task list"
    next_safe_action: "Claim T001 (intent classifier scaffold)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->
# Tasks: Coco-Index Intent Steering + Bounded Query Expansion

<!-- SPECKIT_LEVEL: 3 -->

---

## NOTATION

| Marker | Meaning |
|--------|---------|
| `T###` | Task ID; references in commits/checklists |
| `REQ-NNN` | Maps to spec.md requirement |
| `[X]` | Complete | `[ ]` Pending | `[~]` In progress |
| `P0/P1/P2` | Priority class |

---

## SUB-PHASE 1 — INTENT CLASSIFIER (Sub-Phase 1)

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 1 | [ ] | T001 | Create `intent_classifier.py` skeleton — pure-function `classify(query: str) -> {intent: str, confidence: float}` | REQ-001 | `mcp-coco-index/mcp_server/cocoindex_code/intent_classifier.py` (NEW) | Module imports cleanly; returns valid intent label + confidence ∈ [0..1] |
| 2 | [ ] | T002 | Implement intent rules for v1 families: `implementation`, `test`, `docs`, `error_handling`, `general` | REQ-001 | same as T001 | Each family detected by ≥3 keyword variants; weighted-overlap confidence |
| 3 | [ ] | T003 | Author 30+ fixture queries spanning all 5 families + edge cases (empty, mixed-intent, ambiguous) | REQ-001 | `mcp-coco-index/tests/test_intent_classifier.py` (NEW) | Fixture precision ≥ 0.85 on labeled ground truth |
| 4 | [ ] | T004 | Wire `intent_classifier` into `query.py` via import + invocation point | REQ-001 | `mcp-coco-index/mcp_server/cocoindex_code/query.py` (modified) | Import succeeds; classifier callable from `query_codebase()` |

## SUB-PHASE 2 — QUERY EXPANDER (Sub-Phase 2)

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 5 | [ ] | T005 | Implement exact-intent suppression heuristics (quoted strings, regex syntax, file paths, exact identifiers) | REQ-004 | `query.py` (modified) | All 5 suppression cases trigger correct `expansion_suppressed_reason` telemetry |
| 6 | [ ] | T006 | Implement sub-query expansion templates per intent family (≤2 sub-queries per family) | REQ-002 | `query.py` (modified) | 3-embedding ceiling enforced via assertion |
| 7 | [ ] | T007 | Integrate expander BEFORE `embedder.embed()` at query.py:293-295 | REQ-001 | `query.py` (modified) | Original query + sub-queries embedded; total ≤3 calls per request |
| 8 | [ ] | T008 | Per-sub-query fetch budget = existing `fetch_k = unique_k * 4` | REQ-003 | `query.py` (modified) | No fanout multiplier; total candidates bounded |
| 9 | [ ] | T009 | Merge sub-query rows through existing `_dedup_and_rank_rows()` | REQ-001 | `query.py` (modified) | No new dedup logic; existing path unchanged on suppressed queries |
| 10 | [ ] | T010 | Add path-class intent priors in `_ranked_result()` (bounded ±0.05) | REQ-008 | `query.py:177-223` (modified) | Implementation intent boosts implementation rows; bounds enforced |
| 11 | [ ] | T011 | Populate `rankingSignals` with `intent`, `expanded_to`, `sub_query_idx` per result row | REQ-005 | `query.py`, `schema.py` | Snapshot test confirms signals present in result envelope |
| 12 | [ ] | T012 | Author E2E test fixtures covering expansion path + cap enforcement + suppression | REQ-002, REQ-004 | `mcp-coco-index/tests/test_query_expansion.py` (NEW) | All scenarios pass; assertion failure on >3 embed calls |

## SUB-PHASE 3 — ADVISOR FIRST-ACTION HINT (Sub-Phase 3)

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 13 | [ ] | T013 | Add coco-first-action hint emission in `render.ts:124-158` when topLabel + intent + threshold gates pass | REQ-009 | `mcp_server/skill_advisor/lib/render.ts` (modified) | Hint renders for top-ranked coco + concept intent; existing render tests pass |
| 14 | [ ] | T014 | Standalone fallback flag `SPECKIT_COCOINDEX_FIRST_ACTION_HINT=0` for pre-Phase-005 ship | REQ-009 | `render.ts` (modified) | Flag-gated path renders hint without Phase 005 dependency |
| 15 | [ ] | T015 | Author advisor render tests — Phase-005-integrated path + standalone fallback | REQ-009 | `mcp_server/__tests__/skill_advisor/render-coco-hint.vitest.ts` (NEW) | Both paths green |

## SUB-PHASE 4 — TELEMETRY + DOCS (Sub-Phase 4)

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 16 | [ ] | T016 | Add telemetry envelope fields in `cocoindex-calibration.ts` | REQ-007 | `mcp_server/lib/search/cocoindex-calibration.ts` (modified) | `sub_query_count`, `expansion_intent`, `expansion_suppressed_reason`, `path_class_intent_boost` populated |
| 17 | [ ] | T017 | Document feature flags in `ENV_REFERENCE.md` | REQ-006, REQ-009 | `mcp_server/ENV_REFERENCE.md` (modified) | Both flags documented with default values + descriptions |
| 18 | [ ] | T018 | Update `SKILL.md` + `references/search_patterns.md` with expansion behavior + opt-out | REQ-011 | `mcp-coco-index/SKILL.md`, `references/search_patterns.md` (modified) | Docs reflect new flag, intent families, telemetry signals |
| 19 | [ ] | T019 | Latency benchmark on 50-query fixture; assert <2× baseline p50 | REQ-010 | `mcp-coco-index/tests/test_latency_benchmark.py` (NEW) | p50 overhead < 100ms |

---

## TASK DEPENDENCIES

```
T001 ─┬─→ T002 ─→ T003
      └─→ T004 ─→ T005 ─→ T006 ─→ T007 ─→ T008 ─→ T009 ─→ T010 ─→ T011 ─→ T012
                                                                                 ↘
T013 ─→ T014 ─→ T015                                                              T016 ─→ T017 ─→ T018 ─→ T019
```

T013-T015 can run in parallel with T001-T012 (independent module).

---

## TOTAL EFFORT

- ~250-350 production LOC across 3 modules.
- ~120-180 test LOC across 4 test files.
- 19 tasks total; ~10-15 hours estimated wall (excluding Phase-004 eval gate).

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
- Phase-004 eval gate documented (if applicable for active-mode rollout).
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
