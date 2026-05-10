---
title: "Tasks — Phase 011 Coco-Memory Context Extras"
description: "T### task list. 5 sub-phases bundling RQ-A4 (coco exemplars) + RQ-B2 (memory curator)."
trigger_phrases:
  - "027 phase 011 tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/011-coco-memory-context-extras"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored T001-T028 task list"
    next_safe_action: "Claim T001 (coco_query_examples_vec schema)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->
# Tasks: Coco-Memory Context Extras

<!-- SPECKIT_LEVEL: 3 -->

---

## SUB-PHASE 1 — COCO EXAMPLE BANK SCHEMA + CAPTURE

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 1 | [ ] | T001 | Create `coco_query_examples_vec` schema definition | REQ-002 | `mcp-coco-index/mcp_server/cocoindex_code/example_bank_schema.py` (NEW) | Schema migration creates table; SEPARATE from `code_chunks_vec` |
| 2 | [ ] | T002 | Resolve ADR-002 open question: extend `ccc_feedback` schema OR add `ccc_example_positive` writer | REQ-008 | architectural decision | Documented in commit message or follow-up ADR |
| 3 | [ ] | T003 | Implement capture trigger on `helpful`/`partial` ratings in `ccc-feedback.ts` | REQ-008 | `mcp_server/code_graph/handlers/ccc-feedback.ts` (modified) + Python equivalent | Capture fires only on explicit user-validated ratings |
| 4 | [ ] | T004 | Implement example bank insert/maintenance in `example_bank.py` | REQ-003, REQ-006 | `mcp-coco-index/mcp_server/cocoindex_code/example_bank.py` (NEW) | Privacy: no comments; aggregate identity-only |
| 5 | [ ] | T005 | Cap enforcement (~2000 rows; oldest evicted) | REQ-003 | `example_bank.py` (same) | Cap test passes |
| 6 | [ ] | T006 | TTL ~90 days unless revalidated | REQ-003 | `example_bank.py` (same) | TTL test passes |
| 7 | [ ] | T007 | Author capture + reconciliation tests | REQ-006, REQ-008 | `mcp-coco-index/tests/test_example_bank.py` (NEW) | Tests green |

## SUB-PHASE 2 — COCO EXEMPLAR RETRIEVAL + MAINTENANCE

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 8 | [ ] | T008 | Implement `exemplar_lookup` KNN over example embeddings | REQ-003 | `mcp-coco-index/mcp_server/cocoindex_code/exemplar_lookup.py` (NEW) | Top-3 above similarity 0.80 |
| 9 | [ ] | T009 | Implement stale reconciliation (file/range/hash checks) | REQ-004 | `exemplar_lookup.py` (same) | Reconciliation suppresses mismatches |
| 10 | [ ] | T010 | Wire exemplar group into query response (after `_dedup_and_rank_rows()` line 317-323) | REQ-001 | `mcp-coco-index/mcp_server/cocoindex_code/query.py` (modified) + `protocol.py` (modified for shape) | `exemplars` field added; `data.results` ordering bit-identical |
| 11 | [ ] | T011 | Add `ccc_examples_clear` MCP tool + CLI command | REQ-005 | `mcp-coco-index/mcp_server/cocoindex_code/server.py:141-150` (modified) | Tool registered; CLI command works |
| 12 | [ ] | T012 | Cold start (empty bank) → no `exemplars` key in response | REQ-007 | `query.py` (modified) | Cold start test |
| 13 | [ ] | T013 | Feature flag `SPECKIT_COCOINDEX_EXEMPLARS=false` | REQ-009 | flag gate in query.py + ENV_REFERENCE.md | Flag-off diff test green |
| 14 | [ ] | T014 | Author reconciliation + clear tests | REQ-004, REQ-005 | `mcp-coco-index/tests/test_exemplar_reconciliation.py` (NEW) + `test_examples_clear.py` (NEW) | Tests green |

## SUB-PHASE 3 — MEMORY CONTEXT-CURATOR INTEGRATION SEAM

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 15 | [ ] | T015 | Create `context-curator.ts` integration seam (NOT prompt logic — Sub-Phase 4) | REQ-010 | `mcp_server/lib/search/context-curator.ts` (NEW) | Seam scaffolded; deterministic fallback path defined |
| 16 | [ ] | T016 | Add `retrievalCandidateLimit` + `presentationLimit` + `curationTokenBudget` knobs | REQ-012 | `mcp_server/handlers/memory-search.ts:900-950` (modified) | Budget split test |
| 17 | [ ] | T017 | Wire curator hook between deterministic retrieval (`memory-search.ts:1107-1319`) and `formatSearchResults` (line 1255) | REQ-010 | `memory-search.ts` (modified) + `mcp_server/handlers/memory-context.ts` (modified) | Hook point verified; Stage 4 ordering preserved |
| 18 | [ ] | T018 | Author budget split tests | REQ-012 | `mcp_server/__tests__/search/budget-split.vitest.ts` (NEW) | All knob combinations green |

## SUB-PHASE 4 — CURATOR PROMPT + SCHEMA + PARSER

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 19 | [ ] | T019 | Create `context-curator-prompt.ts` with prompt template + schema | REQ-011 | `mcp_server/lib/search/context-curator-prompt.ts` (NEW) | Prompt + schema defined |
| 20 | [ ] | T020 | Implement strict JSON schema validation (AJV or similar) | REQ-011 | `context-curator.ts` (modified) | Rejects invented IDs |
| 21 | [ ] | T021 | Extend `llm-cache.ts:21-27` with `mode: 'context_curation'` keying | REQ-014 | `mcp_server/lib/search/llm-cache.ts` (modified) | Cache key shape test |
| 22 | [ ] | T022 | Implement candidate-set hash (ordered IDs + score/provenance version) | REQ-014 | `context-curator.ts` (modified) | Hash stable for identical candidate set |
| 23 | [ ] | T023 | Hard timeout 1500-2500ms with deterministic fallback | REQ-013 | `context-curator.ts` (modified) | Mock-timeout test |
| 24 | [ ] | T024 | Stage 4 ordering immutability test (REQ-015) | REQ-015 | `mcp_server/__tests__/search/context-curator.vitest.ts` (NEW) | Snapshot test |
| 25 | [ ] | T025 | Author curator + fallback + schema tests | REQ-010..014 | `context-curator.vitest.ts`, `curator-fallback.vitest.ts`, `curator-schema-validation.vitest.ts` (all NEW) | All paths green |

## SUB-PHASE 5 — TESTS + TELEMETRY + DOCS

| # | Status | ID | Task | REQ | Files | Acceptance |
|---|--------|----|------|-----|-------|------------|
| 26 | [ ] | T026 | Telemetry events: cache hit/miss, timeout, parse failure, selected IDs, omitted high-rank IDs, token/cost, eval outcome | REQ-016 | `memory-context.ts` (modified) + eval logger | Events surfaced |
| 27 | [ ] | T027 | Document flag families in ENV_REFERENCE.md | REQ-009, REQ-017 | `mcp_server/ENV_REFERENCE.md` (modified) | grep verification |
| 28 | [ ] | T028 | Update SKILL.md (mcp-coco-index + system-spec-kit) with both features | REQ-005, REQ-018 | both SKILL.md files (modified) | Documentation reviewed; opt-out + Phase-006 gate documented |

---

## TASK DEPENDENCIES

```
Sub-Phase 1: T001 ─→ T002 ─→ T003 ─→ T004 ─→ T005 ─→ T006 ─→ T007
                                                                     ↘
Sub-Phase 2:                                                           T008 ─→ T009 ─→ T010 ─→ T011 ─→ T012 ─→ T013 ─→ T014
                                                                                                                            ↘
Sub-Phase 3 (memory side, parallel-safe with 1-2):                                                                           T015 ─→ T016 ─→ T017 ─→ T018
                                                                                                                                                          ↘
Sub-Phase 4 (depends on Sub-Phase 3):                                                                                                                      T019 ─→ T020 ─→ T021 ─→ T022 ─→ T023 ─→ T024 ─→ T025
                                                                                                                                                                                                                ↘
Sub-Phase 5: depends on 1-4 completion                                                                                                                                                                            T026 ─→ T027 ─→ T028
```

Sub-Phases 1-2 (coco) and Sub-Phases 3-4 (memory) can largely run in parallel.

---

## TOTAL EFFORT

- ~500-800 production LOC across coco example bank + memory curator + budget split + telemetry.
- ~340-570 test LOC across 8+ test files.
- 28 tasks; ~25-40 hours estimated wall.

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
