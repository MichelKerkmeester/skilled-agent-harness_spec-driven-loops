---
title: "Plan: 016/004/012 Fixture Audit (Probe 10 First)"
description: "Implementation plan for the research-only investigation under 004-code-index-stack"
trigger_phrases: ["016/004/012 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-probe-10"
    last_updated_at: "2026-05-18T19:22:26Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004012"
      session_id: "016-004-012-plan"
      parent_session_id: "016-004-012"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/004/012 Fixture Audit (Probe 10 First)

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

### Phase 1: SETUP — Re-read all 18 probes' query strings + expected_source_path values from the fixture file

### Phase 2: IMPLEMENTATION — Audit each probe (KEEP/CHANGE/AMBIGUOUS); priority: probe 10 + universal-ceiling probes (1, 6, 11, 12, 15); produce verdict table in research.md

### Phase 3: VERIFICATION — If any CHANGE verdicts: produce updated fixture JSON diff in evidence/; cross-link to 011 for re-bench coordination
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
