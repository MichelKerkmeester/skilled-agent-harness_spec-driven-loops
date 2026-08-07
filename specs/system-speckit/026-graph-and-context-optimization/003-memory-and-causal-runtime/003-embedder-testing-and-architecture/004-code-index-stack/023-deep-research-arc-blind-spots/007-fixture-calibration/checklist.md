---
title: "Verification Checklist: 023B Fixture Calibration"
description: "Verification checklist for expanded fixture, perturbation harness, taxonomy, gates, and documentation."
trigger_phrases:
  - "023B checklist"
importance_tier: "high"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/007-fixture-calibration"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded 023B verification evidence"
    next_safe_action: "Run full sweep later"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_calibration_perturbation.py"
    session_dedup:
      fingerprint: "sha256:023b000000000000000000000000000000000000000000000000000000000004"
      session_id: "023-deep-research-arc-blind-spots/007-fixture-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 023B Fixture Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 023C diagnostic counter API read. Evidence: `../023-deep-research-arc-blind-spots/002-retrieval-observability/implementation-summary.md`.
- [x] CHK-002 [P0] Existing fixture read. Evidence: `code-retrieval-fixture-corrected.json`.
- [x] CHK-003 [P1] Long-run time budget documented. Evidence: `run-expanded-bench.sh` header.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fixture schema is validateable. Evidence: validation command reports 73 probes and required profile counts.
- [x] CHK-011 [P0] Aggregation code is pure/testable. Evidence: `test_aggregator_computes_mean_stddev_ci`.
- [x] CHK-012 [P1] Miss classifier covers requested taxonomy labels. Evidence: `test_residual_miss_classifier`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted tests pass. Evidence: `4 passed in 0.01s`.
- [x] CHK-021 [P0] Full package tests pass. Evidence: `227 passed in 18.65s`.
- [x] CHK-022 [P1] Live smoke run recorded. Evidence: `evidence/runs/lane-sample-smoke-run-1.json`, `3/5` hits.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] HIGH and MED findings mapped to closure artifacts. Evidence: `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] ROBUST gates defined. Evidence: `evidence/robust-verdict-gates.md`.
- [x] CHK-FIX-003 [P1] Default changes deferred with rationale. Evidence: `evidence/calibration-recommendation.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added. Evidence: fixture and run artifacts contain paths, queries, scores, and counters only.
- [x] CHK-031 [P1] Vendor/generated probes do not execute vendor code. Evidence: they are passive truth targets.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist created.
- [x] CHK-041 [P1] ADRs written. Evidence: `decision-record.md` ADR-B-001 through ADR-B-003.
- [x] CHK-042 [P1] Evidence docs written.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Benchmark artifact lives under requested new benchmark folder.
- [x] CHK-051 [P1] Tests live under mcp-coco-index `tests/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-ARCH-001 [P0] Measurement surfaces do not alter runtime defaults.
- [x] CHK-ARCH-002 [P0] Repeated-run discipline supports `n >= 3`.
- [x] CHK-ARCH-003 [P1] Residual taxonomy consumes 023C-style counters.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-PERF-001 [P1] Harness records p95 latency per run.
- [x] CHK-PERF-002 [P1] Full sweep runtime documented instead of hidden.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-DEPLOY-001 [P0] No production config change required.
- [x] CHK-DEPLOY-002 [P1] Follow-on condition defined for future default changes.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-COMP-001 [P0] License/vendor probes are passive metadata targets.
- [x] CHK-COMP-002 [P1] No network dependency added.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-DOC-001 [P0] Level 3 packet docs present.
- [x] CHK-DOC-002 [P0] Metadata files generated.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [x] CHK-SIGN-001 [P0] Automated verification run.
- [x] CHK-SIGN-002 [P0] Strict validation run after docs.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-19
<!-- /ANCHOR:summary -->
