---
title: "Plan: 016/004/011 Rerank Model Fit Investigation"
description: "Implementation plan for the research-only investigation under 004-code-index-stack"
trigger_phrases: ["016/004/011 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation"
    last_updated_at: "2026-05-18T19:22:26Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004011"
      session_id: "016-004-011-plan"
      parent_session_id: "016-004-011"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/004/011 Rerank Model Fit Investigation

<!-- ANCHOR:summary -->
## 1. SUMMARY

Research-only investigation under 004-code-index-stack triggered by the May 18 evening rerank-non-determinism analysis. Three sequential phases: survey → measure → decide. Output is a research.md + (optionally) a recommended config change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Survey completeness | research.md lists 3+ candidates with full metadata |
| Measurement quality | per-candidate evidence committed to evidence/ |
| Decision rigor | SWAP/HOLD/NEEDS-CUSTOM stated with rationale |
| Strict-validate | RESULT: PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This packet is research-only with optional small implementation tail (config change). No new module dependencies; uses existing instrumented reranker.py and bench harness.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SETUP — HuggingFace survey for code-aware cross-encoder rerankers; triage SKIP/CONSIDER/MEASURE

### Phase 2: IMPLEMENTATION — For each MEASURE candidate, swap COCOINDEX_RERANK_MODEL + run targeted 8-probe bench (4 failure probes + 4 control hits); capture per-probe score JSONL

### Phase 3: VERIFICATION — Compare failure-mode patterns across candidates; write SWAP/HOLD/NEEDS-CUSTOM decision; if SWAP, prepare config.py + doc updates
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| validate_document.py per file | sk-doc compliance on any new markdown |
| validate.sh --strict on packet | spec-folder convention |
| Targeted bench output | hit/miss against fixture |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `pre-confirmation-margin-analysis.md` (triggered this packet)
- `016/005/005-cocoindex-install-hygiene` (made the bench production-truthful)
- Existing reranker.py instrumentation
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only packet. Rollback = git revert the commits. No production state changed unless a config update is made; that update would be a separate commit also revertible.
<!-- /ANCHOR:rollback -->
