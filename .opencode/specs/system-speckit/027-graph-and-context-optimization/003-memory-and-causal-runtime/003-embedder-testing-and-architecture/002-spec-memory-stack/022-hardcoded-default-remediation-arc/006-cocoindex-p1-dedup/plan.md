---
title: "Plan: 022/006 CocoIndex Python Dedup"
description: "4 Edit calls; main-agent direct; ~15 min."
trigger_phrases: ["022/006 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/006-cocoindex-p1-dedup"
    last_updated_at: "2026-05-23T17:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan written"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002262"
      session_id: "016-002-022-006-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Main-agent direct"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/006 CocoIndex Python Dedup

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
2 P1 dedups in CocoIndex Python: chunk-size constants + COCOINDEX_RERANK_VIA_SIDECAR default.
### Overview
4 mechanical Edits + Python syntax check.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- 3 target files inspected — DONE
### Definition of Done
- R1–R6 pass; strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Consolidate to single canonical constant in config.py + import alias in consumer modules. Lazy import for cross-module to avoid cycles.
### Key Components
- `config/config.py` (canonical source)
- `indexer/indexer.py` (chunk-size consumer)
- `rerankers/reranker.py` (rerank-via-sidecar consumer)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
Read 3 files; confirm structure.
### Phase 2: Edits
4 Edit calls: add constant to config.py + use in Config.from_env + replace indexer chunk constants with import + replace reranker.py return literal with constant.
### Phase 3: Verification
Python syntax + ban-list grep + import-graph verify.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Existing unit tests cover chunking + rerank behavior. No new tests; behavior preserved by same default value.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- config.py already exports DEFAULT_EMBEDDER_NAME / DEFAULT_RERANKER_NAME from registered_embedders — same import-graph shape.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 3 files. Reverts to duplicated inline values; no behavior change.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Independent of all other 022 phases.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Setup | 5 | 5 |
| Edits | 5 | 3 |
| Verify | 5 | 2 |
| Total | 15 min | 10 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If a downstream consumer of `_DEFAULT_RERANK_VIA_SIDECAR` later imports it eagerly and triggers a circular import, switch reranker.py back to inline literal + add a comment pointing to config.py canonical default for manual sync.
<!-- /ANCHOR:enhanced-rollback -->
