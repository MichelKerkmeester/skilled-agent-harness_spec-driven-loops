---
title: "Plan: 022/008 Rerank-Sidecar Default Consolidation"
description: "Canonical sidecar_defaults.py + 4 cross-language consumer updates."
trigger_phrases: ["022/008 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/008-rerank-sidecar-p1-dedup"
    last_updated_at: "2026-05-23T17:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan written"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002282"
      session_id: "016-002-022-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Main-agent direct"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/008 Rerank-Sidecar Default Consolidation

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Cross-language consolidation: canonical Python module + sync comments in bash/cjs.
### Overview
1 new file + 4 modifications.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- All 4 inline-duplicate sites identified — DONE
### Definition of Done
- R1–R6 pass; strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Canonical Python source + lazy imports + cross-language sync comments.
### Key Components
- `scripts/sidecar_defaults.py` (canonical)
- 2 Python consumers + 1 bash + 1 cjs sync comment
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: New module
Write sidecar_defaults.py with 3 constants + docstrings.
### Phase 2: Python consumers
Update rerank_sidecar.py:49-54 + ensure_rerank_sidecar.py:64,155 with lazy imports.
### Phase 3: Bash + cjs comments
Add cross-language sync comments at start.sh:43,73 + ensure-rerank-sidecar.cjs:19,610.
### Phase 4: Verification
Python + Bash + Node syntax checks; cross-language sync count grep; strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Existing sidecar tests cover health probe + reranking. No new tests; behavior preserved. Invariant test deferred to follow-on.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Python launchers use lazy import to avoid circular load.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 5 files + `git rm sidecar_defaults.py`. Reverts to duplicate inline values.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Independent of all other 022 phases.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Investigation | 10 | 10 |
| Edits | 15 | 10 |
| Verify | 5 | 2 |
| Total | 30 | 22 |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If lazy imports trigger circular issues at module load, switch back to inline literals + keep sync comments only.
<!-- /ANCHOR:enhanced-rollback -->
