---
title: "Verification Checklist: Phase 016 sk-code content coherence and reference integrity"
description: "Unchecked planned Level 3 verification checklist for the sk-code content coherence phase."
trigger_phrases:
  - "sk-code content coherence checklist"
  - "sk-code reference integrity checklist"
  - "phase 016 checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Start T001 by capturing the current sk-code reference and playbook baseline before edits"
    blockers:
      - "Phase 017 canon metadata-shape decisions may affect the exact description.json and graph-metadata.json wording."
    key_files:
      - ".opencode/skills/sk-code/manual_testing_playbook/"
      - ".opencode/skills/sk-code/description.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does phase 017 land any metadata vocabulary decision before phase 016 edits begin?"
    answered_questions: []
---
# Verification Checklist: Phase 016 sk-code content coherence and reference integrity

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

- [ ] CHK-001 [P0] Requirements documented in spec.md with audit/master-plan traces.
- [ ] CHK-002 [P0] Technical approach defined in plan.md with baseline, repair, relocation, metadata, benchmark, and verification sequence.
- [ ] CHK-003 [P1] Dependencies identified, including phase 017 metadata vocabulary impact.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] code-quality dead OpenCode checklist paths are fixed and checked.
- [ ] CHK-011 [P0] code-verify stack-folder verifier is re-anchored and its SKILL/README instructions match.
- [ ] CHK-012 [P1] webflow/opencode/animation/shared P1 sk-doc alignment findings are closed or approved for deferral.
- [ ] CHK-013 [P1] sk-code hub metadata prose follows the two-axis parent-hub canon.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] sk-code markdown link checker reports 0 broken live references.
- [ ] CHK-021 [P0] Router-sync vitest passes with non-vacuous nested packet coverage.
- [ ] CHK-022 [P0] Vocab-sync vitest passes with correct vocabulary ownership.
- [ ] CHK-023 [P0] Parent-skill-check strict reports 0 sk-code failures.
- [ ] CHK-024 [P1] Stale flat-era path grep is clean for playbook bodies and new benchmark baseline.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding is classified as broken-ref, useless-ref, duplicate-ref, sk-doc-alignment, benchmark, or speckit-relocation.
- [ ] CHK-FIX-002 [P0] Same-class reference inventory is completed before edits.
- [ ] CHK-FIX-003 [P0] Consumer inventory is completed for relocated hooks documentation and changed verifier guidance.
- [ ] CHK-FIX-004 [P0] Playbook and benchmark stale bodies are semantically re-derived, not only string-replaced.
- [ ] CHK-FIX-005 [P1] Matrix axes and expected row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Add-only benchmark baseline preserves historical benchmark artifacts.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to implementation diff or command output, not this planning document alone.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets are introduced into skill docs, metadata, playbooks, benchmarks, or spec docs.
- [ ] CHK-031 [P0] Relocated hooks documentation does not expose unsafe runtime instructions beyond the existing spec-kit contract.
- [ ] CHK-032 [P1] Auth/authz remains not applicable and no auth behavior is modified.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record stay synchronized with the master plan phase 016 scope.
- [ ] CHK-041 [P1] Code comment hygiene is respected if verifier code changes are needed.
- [ ] CHK-042 [P2] README updates are included only where sub-skill alignment findings require them.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Planning pass writes remain limited to phase 016 folder.
- [ ] CHK-051 [P1] Execution pass limits implementation edits to sk-code plus the one system-spec-kit relocation.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Planned, not yet executed

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md.
- [ ] CHK-101 [P1] All decision records have status and execution timing.
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale.
- [ ] CHK-103 [P2] Migration path documented for the hooks relocation.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Verification commands are scoped to sk-code and relocation targets where possible.
- [ ] CHK-111 [P1] Router-sync coverage remains bounded and non-vacuous.
- [ ] CHK-112 [P2] Benchmark baseline refresh records command/runtime assumptions if generated.
- [ ] CHK-113 [P2] Performance benchmark evidence is included only if required by the benchmark workflow.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and usable for sk-code plus relocation edits.
- [ ] CHK-121 [P0] No feature flag is required because this is local skill content and documentation repair.
- [ ] CHK-122 [P1] Phase 019 rollup dependency is documented.
- [ ] CHK-123 [P1] Benchmark baseline is ready for later cross-hub comparison.
- [ ] CHK-124 [P2] Operator handoff notes are updated if implementation spans sessions.

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] system-spec-kit owns the relocated hooks reference after the move.
- [ ] CHK-131 [P1] Sk-doc alignment findings are closed using current templates and packet conventions.
- [ ] CHK-132 [P2] No license or third-party content change is introduced.
- [ ] CHK-133 [P2] Data handling remains not applicable.

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All phase documents synchronize on planned state until execution completes.
- [ ] CHK-141 [P1] Metadata refresh decision is reflected in decision-record.md.
- [ ] CHK-142 [P2] User-facing sub-skill README updates are limited to audited alignment needs.
- [ ] CHK-143 [P2] Knowledge transfer is captured in implementation-summary.md only after verification.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Phase owner | [ ] Approved for execution | |
| Implementer | sk-code content repair | [ ] Verified | |
| Reviewer | Parent-hub canon check | [ ] Verified | |

<!-- /ANCHOR:sign-off -->
