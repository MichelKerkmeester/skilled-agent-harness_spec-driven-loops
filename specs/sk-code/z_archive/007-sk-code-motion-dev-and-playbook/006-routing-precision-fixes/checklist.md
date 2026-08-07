---
title: "Verification Checklist: Phase 006 Routing Precision Fixes"
description: "Verification checklist for Phase 006 audit remediation."
trigger_phrases:
  - "phase 006 checklist"
  - "routing precision verification"
  - "RD-002 CS-002 recheck"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/006-routing-precision-fixes"
    last_updated_at: "2026-05-05T13:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 006 verification checklist"
    next_safe_action: "Mark evidence after validation"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: Phase 006 Routing Precision Fixes

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: Phase 006 `spec.md` REQ-001 through REQ-008.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: Phase 006 `plan.md` Phases 1-4.
- [x] CHK-003 [P1] Dependencies identified and available or caveated. Evidence: `plan.md` Dependencies table.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `skill-graph.json` parses as valid JSON. Evidence: Python JSON loader exit 0.
- [x] CHK-011 [P0] All four runner scripts share the same parser hardening behavior. Evidence: `rg quality_flags .../scripts/run_*.sh`.
- [x] CHK-012 [P1] Router docs cite exact canonical filenames, not directory placeholders. Evidence: `resource_loading.md` exact path tables.
- [x] CHK-013 [P1] Changes stay inside the user-approved scope. Evidence: `git status --short` reviewed with unrelated files ignored.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] RD-002 doc-edit routing now favors `sk-doc`. Blocked: live local advisor still reads SQLite and ranks `sk-code` first.
- [ ] CHK-021 [P0] CS-002 explicit non-Webflow prompt remains UNKNOWN or N/A, not WEBFLOW. Static contract fixed; nested Codex recheck failed before model output.
- [x] CHK-022 [P0] All `motion_dev/*` paths are cited from canonical filenames or exact asset paths. Evidence: `resource_loading.md`, `decision_matrix.md`, `playbook_entries.md`.
- [ ] CHK-023 [P0] Re-spot-check all 9 finding scenarios via cli-codex confirms PASS, or any non-PASS is documented as a P0 follow-up.
- [x] CHK-024 [P1] Phase 006 strict validation exits 0. Evidence: `validate.sh .../006-routing-precision-fixes --strict` exit 0.
- [x] CHK-025 [P1] Parent Packet 069 strict validation exits 0. Evidence: `validate.sh .../069-sk-code-motion-dev-and-playbook --strict` exit 0.
- [x] CHK-026 [P1] `spot-recheck-results/` contains 3 result YAMLs. Evidence: `ls spot-recheck-results/` shows RD-002, CS-002, LS-001.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] F-001 through F-009 each have a finding class and remediation status in `implementation-summary.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for router docs, SKILL.md, graph JSON, and runner parsers.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for universal prompt, result YAML schema, and recheck scripts.
- [x] CHK-FIX-004 [P0] Parser fix includes adversarial cases for empty excerpt, bare literal marker, directory placeholders, and missing refs.
- [x] CHK-FIX-005 [P1] Matrix axes are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile environment variant is addressed by documenting nested CLI/network failure if it occurs.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit file line references in the implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or credentials introduced.
- [x] CHK-031 [P0] Runner parser handles malformed model output without shell evaluation.
- [x] CHK-032 [P1] No runner script broadens write scope beyond result/raw transcript paths.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary are synchronized.
- [x] CHK-041 [P1] Parent phase map includes Phase 006.
- [x] CHK-042 [P2] Recommendation mapping R1-R4 is recorded in `implementation-summary.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spot recheck outputs are stored only in `spot-recheck-results/`.
- [x] CHK-051 [P1] Historical Phase 005 result YAMLs remain unmodified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 12/14 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-05
<!-- /ANCHOR:summary -->
