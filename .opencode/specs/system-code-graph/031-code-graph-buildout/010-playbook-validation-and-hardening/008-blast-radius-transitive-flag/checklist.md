---
title: "Verification Checklist: blast_radius includeTransitive Flag Fix (029 Phase 008)"
description: "Verification Date: 2026-05-27"
trigger_phrases:
  - "blast radius transitive checklist"
  - "f-022-1 fix checklist"
  - "029 phase 008 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 008 checklist"
    next_safe_action: "Verify after code edit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: blast_radius includeTransitive Flag Fix (029 Phase 008)

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Consumer audit confirms no programmatic reliance on the default
- [ ] CHK-003 [P1] All in-branch maxDepth uses enumerated
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] tsc build clean
- [ ] CHK-011 [P0] effectiveDepth gates ONLY the blast_radius branch
- [ ] CHK-012 [P1] No debug logs / commented code
- [ ] CHK-013 [P1] query.ts:1008 helper scope untouched
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] vitest: blast_radius default → depth 1
- [ ] CHK-021 [P0] vitest: includeTransitive:true → multi-hop (depth maxDepth)
- [ ] CHK-022 [P0] existing query-handler + scan tests still pass
- [ ] CHK-023 [P1] alignment verifier clean
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] F-022-1 classed: contract-violation / class-of-bug (one op ignores a documented flag)
- [ ] CHK-FIX-002 [P0] Consumer inventory complete (phase-007 audit) — no programmatic caller
- [ ] CHK-FIX-003 [P0] Other code_graph_query operations unaffected (outline/calls/imports)
- [ ] CHK-FIX-004 [P1] Matrix axis: {default, includeTransitive} × {depth} covered by tests
- [ ] CHK-FIX-005 [P1] Fallback/empty depthGroups use the same effectiveDepth
- [ ] CHK-FIX-006 [P1] Scenario 022 pass criteria reconciled to the corrected contract
- [ ] CHK-FIX-007 [P2] Evidence pinned to test + build output
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets; internal traversal only
- [ ] CHK-031 [P1] No new external surface
- [ ] CHK-032 [P2] Depth clamp (0-20) preserved
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] implementation-summary updated post-fix
- [ ] CHK-042 [P1] 029 matrix F-022-1 marked resolved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only in-scope files touched
- [ ] CHK-051 [P2] Verification transcripts in scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-05-27
<!-- /ANCHOR:summary -->
