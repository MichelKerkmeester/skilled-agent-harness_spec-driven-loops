---
title: "Tasks: 115 embedding model evaluation"
description: "Numbered execution checklist mapped to plan.md 5-phase flow."
trigger_phrases:
  - "115 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-embedding-model-evaluation"
    last_updated_at: "2026-05-17T07:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold tasks stub"
    next_safe_action: "Run Phase 0 — resolve open Qs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115003"
      session_id: "115-tasks-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: 115 embedding model evaluation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = completed
- `[ ]` = pending
- `[~]` = partial
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### Open-question resolution
- [ ] T0.1: Finalize candidate model list (resolve spec §7 Q1)
- [ ] T0.2: Choose benchmark dataset source (resolve Q2)
- [ ] T0.3: Set acceptance threshold (resolve Q3)
- [ ] T0.4: Create pre-eval checkpoint named `pre-115-eval-<UTC>`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Eval harness
- [ ] T1.1: Inspect packet 114 eval-loop infrastructure for reusability
- [ ] T1.2: Build/extend harness for embedding-model benchmarking
- [ ] T1.3: Smoke-test harness against current baseline model

### Benchmark sweep
- [ ] T2.1: Download/configure each candidate model
- [ ] T2.2: Run cat-24 scenarios (402, 408, 409) against each candidate
- [ ] T2.3: Run sample cat-01/11/15 regression set
- [ ] T2.4: Emit per-model row to `evidence/benchmark-results.csv`

### Decision
- [ ] T3.1: Compare results; identify winner (or no-swap)
- [ ] T3.2: Author ADR-001 in `decision-record.md`
- [ ] T3.3: Commit benchmark CSV + ADR

### Implementation (if swap chosen)
- [ ] T4.1: Update model binding in mk-spec-memory
- [ ] T4.2: Re-index full memory corpus with new model
- [ ] T4.3: Re-run 008 cat-24 — verify 409 reaches PASS
- [ ] T4.4: Re-run 008 PASS sample — verify ≥ 56/57 preserved
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [ ] T5.1: Strict-validate 115 packet exit 0
- [ ] T5.2: Update implementation-summary.md with final-state results
- [ ] T5.3: Memory save via `/memory:save`
- [ ] T5.4: Update 008 implementation-summary.md to mark cat-24/409 closure path
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- All P0 + P1 requirements met (per spec.md §4)
- ADR-001 decision documented
- 008 cat-24/409 either reaches PASS (with new model) or carries an explicit "accepted PARTIAL" rationale
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Packet 008: predecessor finding (cat-24/402, 408, 409)
- Packet 114: eval-loop infrastructure (reuse candidate)
- Codex K commit `8ec4f1491`: SQL + trigger-lane + rerank improvements (preserved)
- mk-spec-memory MCP server: model binding surface
<!-- /ANCHOR:cross-refs -->
