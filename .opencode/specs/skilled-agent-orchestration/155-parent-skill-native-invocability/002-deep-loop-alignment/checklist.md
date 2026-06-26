---
title: "Verification Checklist: deep-loop parent-skill alignment"
description: "Acceptance checklist for the deep-loop alignment. All items unchecked; verified at execution per stage and at the final validation gate."
trigger_phrases:
  - "deep-loop alignment checklist"
  - "deep-loop alignment acceptance"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the acceptance checklist"
    next_safe_action: "Verify items during execution"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

This packet is plan-only. Implementation and testing items are intentionally unchecked and are verified at execution per stage and at the final validation gate. Only the documentation items apply to this packet now.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements (R1–R5) documented in spec.md
- [ ] CHK-002 [P0] Staged technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified (phase 001 mechanism; 154 precedent)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Renamed/edited skill assets pass `package_skill.py --check` (deferred: gated execution)
- [ ] CHK-011 [P0] No broken `ai-council` references remain after the rename (deferred: gated Stage 1)
- [ ] CHK-012 [P1] Hub routing follows the phase-001 Option E pattern (deferred: gated Stage 3)
- [ ] CHK-013 [P1] Changes follow the sk-design parent-skill conventions (deferred: gated execution)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (R1–R5) met (deferred: gated Stage 5)
- [ ] CHK-021 [P0] `Skill(deep-loop-workflows[,hint])` reaches a mode; `/deep:*` + agents still function (deferred: gated Stage 3/5)
- [ ] CHK-022 [P1] Routing fixtures: a deep-loop query resolves to `deep-loop-workflows` (deferred: gated Stage 5)
- [ ] CHK-023 [P1] `advisor_rebuild` + `skill_graph_validate` clean (deferred: gated Stage 5)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (the `ai-council` reference inventory in Stage 0).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the rename: commands, agents, `mode-registry.json`, `deep-loop-runtime`, and cross-refs.
- [ ] CHK-FIX-004 [P0] Path/identity changes (rename, load paths) verified for outside-root and no-op cases before the gate.
- [ ] CHK-FIX-005 [P1] Stage exit gates and their evidence are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Single-identity invariant re-checked after the routing retrofit reads family-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced by the alignment
- [ ] CHK-031 [P0] No packet's tool-permission contract widened as a side effect (NFR-S01) (deferred: gated execution)
- [ ] CHK-032 [P1] Rename does not expose or relocate any privileged load path (deferred: gated Stage 1)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/decision-record synchronized
- [ ] CHK-041 [P1] `SKILL.md`/reference pointers repointed after catalog removals (deferred: gated Stage 2)
- [ ] CHK-042 [P2] Hub `SKILL.md` documents the Option E invocation surface (deferred: gated Stage 3)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 14 | 0/14 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Alignment decisions documented in decision-record.md (ADR-001/002/003)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Deferred/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Rename/migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] No runtime cross-skill import coupling added to the advisor hot path (NFR-P01) (deferred: gated Stage 4)
- [ ] CHK-111 [P1] Throughput targets met (deferred: not applicable)
- [ ] CHK-112 [P2] Load testing completed (deferred: not applicable)
- [ ] CHK-113 [P2] Performance benchmarks documented (deferred: not applicable)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Per-stage recovery baseline + rollback procedure documented
- [ ] CHK-121 [P0] Feature flag configured (if applicable) (deferred: not applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured (deferred: not applicable)
- [ ] CHK-123 [P1] Runbook created (deferred: gated execution)
- [ ] CHK-124 [P2] Deployment runbook reviewed (deferred: not applicable)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Single-identity invariant review completed (one `graph-metadata.json`) (deferred: gated Stage 3)
- [ ] CHK-131 [P1] Dependency licenses compatible (deferred: not applicable)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (deferred: not applicable)
- [ ] CHK-133 [P2] Data handling compliant with requirements (deferred: not applicable)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable) (deferred: not applicable)
- [ ] CHK-142 [P2] User-facing documentation updated (deferred: not applicable)
- [ ] CHK-143 [P2] Knowledge transfer documented (deferred: not applicable)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Pending | Technical Lead | [ ] Approved | |
| Pending | Product Owner | [ ] Approved | |
| Pending | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
