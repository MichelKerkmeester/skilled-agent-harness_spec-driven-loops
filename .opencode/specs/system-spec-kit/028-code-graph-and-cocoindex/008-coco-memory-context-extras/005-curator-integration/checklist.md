---
title: "Verification Checklist: 005 Curator Integration"
description: "Verification checklist for memory curator integration child phase."
trigger_phrases:
  - "027 011 005 checklist"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-coco-memory-context-extras/005-curator-integration"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored child checklist"
    next_safe_action: "Use checklist during implementation"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-005-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 005 Curator Integration

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Child 004 dependency verified
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `data.results` ordering and scores are immutable
- [ ] CHK-011 [P0] Fallback omits `data.curatedContext`
- [ ] CHK-012 [P1] Budget defaults are bounded
- [ ] CHK-013 [P1] Telemetry events are stable and low-cardinality
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Ordering immutability snapshot passes
- [ ] CHK-021 [P0] Budget split test passes
- [ ] CHK-022 [P1] Timeout and invalid-output fallback tests pass
- [ ] CHK-023 [P1] Curated context response schema test passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class documented for any implementation bug fixed during this phase
- [ ] CHK-FIX-002 [P0] Same-class limit and response producers inventoried
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `curatedContext`
- [ ] CHK-FIX-004 [P0] Parser/path/security fixes include adversarial tests if introduced
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed for feature flag reads
- [ ] CHK-FIX-007 [P1] Evidence is pinned to explicit file paths and commands
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Curated context references only deterministic candidate IDs
- [ ] CHK-031 [P0] Invalid curator output is never attached
- [ ] CHK-032 [P1] Feature flag defaults to disabled
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, and tasks stay synchronized
- [ ] CHK-041 [P1] Budget split knobs documented near implementation
- [ ] CHK-042 [P2] ENV docs updated for public flags
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Integration code stays under `mcp_server/lib/search`
- [ ] CHK-051 [P1] Tests stay under `mcp_server/__tests__/search`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
