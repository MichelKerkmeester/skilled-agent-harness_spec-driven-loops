---
title: "Implementation Plan: 115 embedding model evaluation"
description: "5-phase plan: resolve open Qs, build eval harness, run benchmark sweep, analyze + decide, implement chosen path."
trigger_phrases:
  - "115 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-embedding-model-evaluation"
    last_updated_at: "2026-05-17T07:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold plan stub"
    next_safe_action: "Resolve open questions in spec.md §7"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115002"
      session_id: "115-plan-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 115 embedding model evaluation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| Executor | TBD — main agent or cli-codex (mechanical) + cli-devin (eval runs) |
| Storage | `.opencode/specs/skilled-agent-orchestration/115-embedding-model-evaluation/` |
| Output | `evidence/benchmark-results.csv` + ADR-001 in `decision-record.md` |
| Testing | Re-run cat-24 scenarios + sample cat-01/11/15 against each candidate |

### Overview
Evaluate 3-5 embedding models, decide whether to swap, implement chosen path. Reuse packet 114 eval infrastructure where compatible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Open questions in spec.md §7 resolved
- [ ] Candidate model list finalized
- [ ] Benchmark dataset chosen (cat-24 scenarios OR dedicated)
- [ ] Pre-eval checkpoint created

### Definition of Done
- [ ] Benchmark CSV produced for all candidates
- [ ] ADR-001 decision recorded
- [ ] If swap chosen: implementation merged + 008 playbook re-run ≥ 56/57 PASS preserved
- [ ] If no-swap chosen: rationale documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-model decision packet — benchmark, compare, decide, swap-or-document.

### Key Components
- Eval harness: extends packet 114's eval-loop infrastructure
- Benchmark dataset: cat-24 scenarios 401-415 as ground truth
- Candidate models: downloaded via ollama/llama.cpp/huggingface
- Results aggregator: CSV with per-model recall@3, paraphrase cosine, latency, size

### Data Flow
Candidate model → eval harness → cat-24 scenarios → top-K results → score → CSV row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Phase 0**: Resolve open questions; create checkpoint; finalize candidate list
2. **Phase 1**: Build/extend eval harness (reuse 114 if compatible)
3. **Phase 2**: Run benchmark sweep on all candidates
4. **Phase 3**: Analyze results, produce ADR-001 decision
5. **Phase 4**: Implement chosen path (model swap OR no-change rationale)
6. **Phase 5**: Verify no regression on 008's 56 PASS scenarios
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Re-run cat-24/402, 408, 409 against each candidate; record top-3 recall
- Sample 5-10 PASS scenarios from cat-01 (retrieval) + cat-11 (scoring) + cat-15 (retrieval-enhancements) for regression check
- Spot-check latency on memory_search hot path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 008 evidence/playbook-results.jsonl (baseline classifications)
- Packet 008 evidence/checkpoint-create-rca.md (retrieval pipeline context)
- Packet 114 eval-loop infrastructure (reuse candidate)
- Codex K commit `8ec4f1491` (SQL + trigger-lane + rerank — preserve)
- mk-spec-memory MCP server (model swap surface)
- ollama / llama.cpp runtime for candidate model loading
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If chosen model swap causes regression on 008's 56 PASS scenarios:
1. Revert the model-binding commit
2. Restore prior model registration in mk-spec-memory
3. Re-run 008 playbook subset to confirm restoration
4. Document failed swap in `decision-record.md` ADR-002 (preserve as evidence)
<!-- /ANCHOR:rollback -->
