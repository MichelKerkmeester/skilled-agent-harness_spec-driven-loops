---
title: "Verification Checklist: Deprecate Standalone Deep Context"
description: "Verification checklist for staged standalone deep-context deprecation and research/review context capability integration."
trigger_phrases:
  - "deep-context deprecation checklist"
  - "context mode verification"
  - "research review context snapshot verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/038-deprecate-deep-context-integrate-capabilities"
    last_updated_at: "2026-07-04T13:24:26Z"
    last_updated_by: "opencode"
    recent_action: "Completed research synthesis"
    next_safe_action: "Implement /deep:context redirect stub"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-deep-context-deprecation-plan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Checklist covers final implementation verification, not just packet creation."
      - "Deep-research completed 10 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deprecate Standalone Deep Context

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim implementation done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md requirements section]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md architecture and phases sections]
- [x] CHK-003 [P1] Dependencies identified and available or marked yellow. [EVIDENCE: plan.md dependencies section]
- [ ] CHK-004 [P0] Active-reference inventory captured before public-surface edits. [Source: pending inventory]
- [ ] CHK-005 [P1] Baseline tests/probes captured before implementation changes. [Source: pending baseline]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Generated command docs updated through the compiler, not manual drift. [Test: pending command compiler]
- [ ] CHK-011 [P0] `/deep:context` redirect cannot execute legacy YAML. [Test: pending command behavior check]
- [ ] CHK-012 [P1] Research/review context snapshot docs follow existing deep-loop patterns. [Source: pending file review]
- [ ] CHK-013 [P1] No stale active docs present standalone context as supported. [Test: pending grep parity]
- [ ] CHK-014 [P1] Modified script/code files pass comment hygiene when applicable. [Test: pending comment hygiene]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria in spec.md are met. [Test: pending implementation verification]
- [ ] CHK-021 [P0] Command-contract compiler and tests pass. [Test: pending command-contract suite]
- [ ] CHK-022 [P0] Advisor routing probes and drift guard pass. [Test: pending advisor probes]
- [ ] CHK-023 [P0] Deep-loop runtime tests pass or internal `context` cleanup is deferred with evidence. [Test: pending runtime tests]
- [ ] CHK-024 [P1] Mirror parity checks pass for `.opencode` and `.claude` agent surfaces. [Test: pending mirror scan]
- [ ] CHK-025 [P1] Historical archive preservation verified. [Source: pending inventory classification]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each removed or redirected standalone context surface has a finding class: `active-runtime`, `active-doc`, `generated-metadata`, `test-fixture`, `historical-archive`, or `false-positive`. [Source: pending inventory]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for commands, agents, registry, advisor, docs, and mirrors. [Test: pending grep inventory]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for context report artifacts, context assets, reducer scripts, and runtime loop-type references. [Test: pending grep inventory]
- [ ] CHK-FIX-004 [P0] Public command deprecation includes an adversarial check proving legacy YAML cannot run. [Test: pending command check]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [Source: plan.md]
- [ ] CHK-FIX-006 [P1] Advisor stale-index variant checked after metadata/index refresh. [Test: pending advisor probe after refresh]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to explicit command output or diff range, not a moving branch claim. [Source: pending implementation summary]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced in docs, metadata, or generated artifacts. [Test: pending secret-aware review]
- [ ] CHK-031 [P0] Research/review replacement behavior does not widen write permissions outside loop-owned artifact folders. [Source: pending agent/skill review]
- [ ] CHK-032 [P1] Deprecated command fails closed rather than attempting partial legacy execution. [Test: pending command behavior check]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and decision record synchronized for the planning packet. [EVIDENCE: spec.md, plan.md, tasks.md, checklist.md, decision-record.md]
- [ ] CHK-041 [P1] Active README/AGENTS/orchestrator docs updated after implementation. [Test: pending grep parity]
- [ ] CHK-042 [P2] Archived historical specs left untouched unless active fixtures or indexes require regeneration.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Planning packet files live in the approved spec folder. [EVIDENCE: .opencode/specs/deep-loops/038-deprecate-deep-context-integrate-capabilities/]
- [ ] CHK-051 [P1] Temp files stay in `scratch/` only during implementation. [Source: pending final review]
- [ ] CHK-052 [P1] Retired deep-context assets are archived or deleted consistently, not left half-active. [Source: pending implementation diff]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 2/15 |
| P1 Items | 14 | 3/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-07-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in decision-record.md. [EVIDENCE: decision-record.md ADR-001]
- [x] CHK-101 [P1] Decision has status. [EVIDENCE: decision-record.md metadata table]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. [EVIDENCE: decision-record.md alternatives table]
- [ ] CHK-103 [P2] Migration path documented after implementation diff is known.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Advisor prompt-time routing behavior remains acceptable after metadata cleanup. [Test: pending advisor probes]
- [ ] CHK-111 [P1] Replacement context snapshot does not force extra default loop iterations. [Test: pending research/review contract check]
- [ ] CHK-112 [P2] Full benchmark run completed if command routing performance changes.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and usable. [Source: plan.md]
- [ ] CHK-121 [P0] No feature flag required or a staged stub/restore path is documented. [Source: plan.md]
- [ ] CHK-122 [P1] User-facing migration note for `/deep:context` exists in active docs or command stub. [Source: pending docs]
- [ ] CHK-123 [P1] Runbook-level replacement paths are documented: `@context`, `/deep:research`, `/deep:review`. [Source: pending docs]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] License/dependency status unaffected or verified N/A. [Source: pending final review]
- [ ] CHK-131 [P1] Data handling unchanged because no persisted user data migration occurs. [Source: pending final review]
- [ ] CHK-132 [P2] Additional security checklist completed if implementation edits executable routing code.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All active spec documents synchronized after implementation. [Test: pending final doc review]
- [ ] CHK-141 [P1] Public docs and root framework docs no longer advertise standalone context. [Test: pending grep parity]
- [ ] CHK-142 [P2] Historical archive exceptions are documented if any active index files remain stale.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved planning with `Run plan` | 2026-07-04 |
| OpenCode assistant | Implementer | Pending implementation | |
<!-- /ANCHOR:sign-off -->
