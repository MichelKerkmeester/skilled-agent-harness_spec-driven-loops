---
title: "Verification Checklist: 023D Doctor Model Swap UX"
description: "Verification Date: 2026-05-19"
trigger_phrases:
  - "verification"
  - "checklist"
  - "023D"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
    last_updated_at: "2026-05-19T20:36:58Z"
    last_updated_by: "codex"
    recent_action: "Recorded verification checklist"
    next_safe_action: "Complete full verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:023d000000000000000000000000000000000000000000000000000000000003"
      session_id: "023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 023D Doctor Model Swap UX

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes targeted lint checks: `.venv/bin/ruff check cocoindex_code/ tests/test_doctor.py tests/test_embedder_license.py`.
- [x] CHK-011 [P0] Doctor output shows real stale global `ccc` warning/failure instead of hiding it.
- [x] CHK-012 [P1] Error handling implemented for unavailable daemon, missing fingerprint, unavailable PyPI, unknown models, and commercial-safe refusal.
- [x] CHK-013 [P1] Code follows existing Typer CLI and registry patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Targeted pytest passed: `tests/test_doctor.py tests/test_embedder_license.py tests/test_registered_embedders.py tests/test_fingerprint.py`.
- [x] CHK-021 [P0] Manual doctor JSON output ran through `.venv/bin/ccc doctor --json`.
- [x] CHK-022 [P1] Edge cases tested: clean rc=0, CC BY-NC warning rc=1, commercial-safe failure rc=2, parseable JSON, 80k chunk estimator.
- [x] CHK-023 [P1] Config-load refusal validated by pytest.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: cross-consumer operator trust defect spanning CLI, config, registry, fingerprint, docs, and tests.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed via `rg -n "fingerprint|reranker_license|effective_config_hash|Reranker"`.
- [x] CHK-FIX-003 [P0] Consumer inventory covered CLI status, 023C index metadata, observability wrappers, config, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser adversarial table not applicable; env/global-state variants covered by doctor tests.
- [x] CHK-FIX-005 [P1] Matrix axes listed: reranker license safe/non-safe, commercial profile on/off, daemon/fingerprint available/unavailable, JSON/text output.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed through `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true`.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands in implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Env parsing uses existing bounded boolean and model registry patterns.
- [x] CHK-032 [P1] License governance blocks non-commercial defaults under explicit commercial-safe mode.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized.
- [x] CHK-041 [P1] ADR-024 through ADR-026 appended.
- [x] CHK-042 [P2] README unchanged; command is self-describing via `ccc doctor --help`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created in packet.
- [x] CHK-051 [P1] No scratch cleanup required.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-19

**Final Gate**: `validate.sh --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:summary -->
